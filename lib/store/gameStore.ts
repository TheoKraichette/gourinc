// Le store Zustand : tout l'état du jeu et toutes les actions du joueur.

import { create } from "zustand";
import type {
  Adepte,
  DialogueEtat,
  Ecran,
  Effets,
  EntreeJournal,
  EvenementDuJour,
  FinInfo,
  InfiltreEtat,
  MotSacre,
  Phase,
  PropheteEtat,
  ResolutionProphetie,
  SermonProduit,
  Stats,
} from "@/lib/types";
import { creerAdepte } from "@/lib/engine/adeptes";
import { resoudreFinDeJournee } from "@/lib/engine/resolution";
import { finRedemption, verifierFin } from "@/lib/engine/fins";
import { getArchetype } from "@/data/archetypes";
import { EVENEMENTS } from "@/data/events";
import { MOTS_SACRES, MOT_VERITE, trouverCombo } from "@/data/mots";
import { getProphetie } from "@/data/propheties";
import { MIRACLES } from "@/data/miracles";
import { TELLS_INFILTRE } from "@/data/indices";
import { genererNomSecte } from "@/data/names";
import {
  chargerSauvegarde,
  effacerSauvegarde,
  sauvegarder,
} from "@/lib/save";
import { chance, clamp, pick, pickN, randInt } from "@/lib/rng";

export const ACTIONS_PAR_JOUR = 2;

const STATS_INITIALES: Stats = {
  ferveur: 60,
  paranoia: 10,
  reputation: 70,
  ressources: 100,
  derive: 0,
};

interface GameStore {
  ecran: Ecran;
  nomSecte: string;
  jour: number;
  phase: Phase;
  stats: Stats;
  adeptes: Adepte[];
  journal: EntreeJournal[];
  actionsRestantes: number;
  motsDuJour: MotSacre[];
  dernierSermon: SermonProduit | null;
  evenementDuJour: EvenementDuJour | null;
  evenementsVus: string[];
  infiltre: InfiltreEtat | null;
  prochainInfiltreJour: number;
  fin: FinInfo | null;
  dialogue: DialogueEtat | null;
  adepteSelectionneId: string | null;
  rapportDuSoir: string[];
  aSauvegarde: boolean;
  prophetie: PropheteEtat | null;
  resolutionProphetie: ResolutionProphetie | null;
  miraclesDebloques: string[];
  miracleUtilise: boolean;
  caisseOuverte: boolean; // la caisse du prophète (composeur de prophétie)
  autelOuvert: boolean; // le menu des miracles du micro-ondes

  initialiser: () => void;
  nouvellePartie: () => void;
  chargerPartie: () => void;
  composerSermon: (idMotA: string, idMotB: string) => void;
  selectionnerAdepte: (id: string | null) => void;
  parler: (adepteId: string) => void;
  interroger: (adepteId: string) => void;
  repondreDialogue: (index: number) => void;
  fermerDialogue: () => void;
  donnerTache: (adepteId: string) => void;
  promouvoir: (adepteId: string) => void;
  exclure: (adepteId: string) => void;
  faireDisparaitre: (adepteId: string) => void;
  accuser: (adepteId: string) => void;
  passerAEvenement: () => void;
  choisirEvenement: (index: number) => void;
  terminerJournee: () => void;
  jourSuivant: () => void;
  dissoudre: () => void;
  retourTitre: () => void;
  ouvrirCaisse: () => void;
  fermerCaisse: () => void;
  annoncerProphetie: (prophetieId: string, dansJours: number) => void;
  resoudreProphetie: (
    choix: "miracle" | "doubler" | "admettre" | "halluciner"
  ) => void;
  ouvrirAutel: () => void;
  fermerAutel: () => void;
  lancerMiracle: (miracleId: string) => void;
}

function appliquerEffets(
  stats: Stats,
  adeptes: Adepte[],
  effets: Effets,
  jour: number
): { stats: Stats; adeptes: Adepte[]; notes: string[] } {
  const s = { ...stats };
  let liste = adeptes.map((a) => ({ ...a }));
  const notes: string[] = [];

  s.ferveur = clamp(s.ferveur + (effets.ferveur ?? 0));
  s.paranoia = clamp(s.paranoia + (effets.paranoia ?? 0));
  s.reputation = clamp(s.reputation + (effets.reputation ?? 0));
  s.derive = clamp(s.derive + (effets.derive ?? 0));
  s.ressources = Math.max(0, s.ressources + (effets.ressources ?? 0));

  if (effets.loyauteTous) {
    liste = liste.map((a) => ({
      ...a,
      loyaute: clamp(a.loyaute + effets.loyauteTous!),
    }));
  }
  for (let i = 0; i < (effets.recrues ?? 0); i++) {
    const recrue = creerAdepte(liste, jour);
    liste.push(recrue);
    notes.push(`${recrue.nom} a rejoint le mouvement.`);
  }
  return { stats: s, adeptes: liste, notes };
}

function tirerMots(derive: number): MotSacre[] {
  const mots = pickN(MOTS_SACRES, 5);
  // À Dérive très haute, un mot qui n'existe pas s'invite dans le tirage.
  if (derive >= 85) {
    mots[randInt(0, mots.length - 1)] = MOT_VERITE;
  }
  return mots;
}

function tirerEvenement(
  jour: number,
  adeptes: Adepte[],
  evenementsVus: string[]
): EvenementDuJour {
  let pool = EVENEMENTS.filter(
    (e) =>
      (e.minJour === undefined || jour >= e.minJour) &&
      !evenementsVus.includes(e.id) &&
      (!e.cibleAdepte || adeptes.length > 0)
  );
  if (pool.length === 0) {
    // Tout a été vu : on recommence le cycle.
    pool = EVENEMENTS.filter(
      (e) =>
        (e.minJour === undefined || jour >= e.minJour) &&
        (!e.cibleAdepte || adeptes.length > 0)
    );
  }
  const evenement = pick(pool);
  const cible = evenement.cibleAdepte ? pick(adeptes) : null;
  return {
    evenement,
    adepteCibleId: cible?.id ?? null,
    texteResolu: evenement.texte.replace(/\{ADEPTE\}/g, cible?.nom ?? ""),
    reaction: null,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ecran: "titre",
  nomSecte: "",
  jour: 1,
  phase: "sermon",
  stats: STATS_INITIALES,
  adeptes: [],
  journal: [],
  actionsRestantes: ACTIONS_PAR_JOUR,
  motsDuJour: [],
  dernierSermon: null,
  evenementDuJour: null,
  evenementsVus: [],
  infiltre: null,
  prochainInfiltreJour: 5,
  fin: null,
  dialogue: null,
  adepteSelectionneId: null,
  rapportDuSoir: [],
  aSauvegarde: false,
  prophetie: null,
  resolutionProphetie: null,
  miraclesDebloques: [],
  miracleUtilise: false,
  caisseOuverte: false,
  autelOuvert: false,

  initialiser: () => {
    set({ aSauvegarde: chargerSauvegarde() !== null });
  },

  nouvellePartie: () => {
    const adeptes: Adepte[] = [];
    for (let i = 0; i < 5; i++) adeptes.push(creerAdepte(adeptes, 1));
    const nomSecte = genererNomSecte();
    set({
      ecran: "jeu",
      nomSecte,
      jour: 1,
      phase: "sermon",
      stats: { ...STATS_INITIALES },
      adeptes,
      journal: [
        {
          jour: 1,
          type: "info",
          texte: `${nomSecte} est fondée. Cinq fidèles, un champ, un micro-ondes. Tout commence.`,
        },
      ],
      actionsRestantes: ACTIONS_PAR_JOUR,
      motsDuJour: tirerMots(0),
      dernierSermon: null,
      evenementDuJour: null,
      evenementsVus: [],
      infiltre: null,
      prochainInfiltreJour: randInt(5, 7),
      fin: null,
      dialogue: null,
      adepteSelectionneId: null,
      rapportDuSoir: [],
      prophetie: null,
      resolutionProphetie: null,
      miraclesDebloques: [],
      miracleUtilise: false,
      caisseOuverte: false,
      autelOuvert: false,
    });
  },

  chargerPartie: () => {
    const save = chargerSauvegarde();
    if (!save) return;
    set({
      ecran: "jeu",
      nomSecte: save.nomSecte,
      jour: save.jour,
      phase: "sermon",
      stats: save.stats,
      adeptes: save.adeptes,
      journal: save.journal,
      actionsRestantes: ACTIONS_PAR_JOUR,
      motsDuJour: tirerMots(save.stats.derive),
      dernierSermon: null,
      evenementDuJour: null,
      evenementsVus: save.evenementsVus,
      infiltre: save.infiltre,
      prochainInfiltreJour: save.prochainInfiltreJour,
      fin: null,
      dialogue: null,
      adepteSelectionneId: null,
      rapportDuSoir: [],
      prophetie: save.prophetie ?? null,
      resolutionProphetie: save.resolutionProphetie ?? null,
      miraclesDebloques: save.miraclesDebloques ?? [],
      miracleUtilise: false,
      caisseOuverte: false,
      autelOuvert: false,
    });
  },

  composerSermon: (idMotA, idMotB) => {
    const { motsDuJour, stats, adeptes, jour, journal, phase } = get();
    const motA = motsDuJour.find((m) => m.id === idMotA);
    const motB = motsDuJour.find((m) => m.id === idMotB);
    if (!motA || !motB || motA.id === motB.id || phase !== "sermon") return;

    const combo = trouverCombo(motA.id, motB.id);
    const effets: Effets = {};
    for (const source of [motA.effets, motB.effets, combo?.bonus ?? {}]) {
      for (const [cle, valeur] of Object.entries(source)) {
        effets[cle as keyof Effets] =
          (effets[cle as keyof Effets] ?? 0) + (valeur as number);
      }
    }
    const sermon: SermonProduit = combo
      ? { titre: combo.titre, texte: combo.texte }
      : {
          titre: `${motA.mot} et ${motB.mot}`,
          texte: `${pick(motA.fragments)} ${pick(motB.fragments)}`,
        };

    const res = appliquerEffets(stats, adeptes, effets, jour);
    set({
      stats: res.stats,
      adeptes: res.adeptes,
      phase: "gestion",
      actionsRestantes: ACTIONS_PAR_JOUR,
      dernierSermon: sermon,
      journal: [
        ...journal,
        {
          jour,
          type: "info" as const,
          texte: `Sermon du matin — « ${sermon.titre} »${combo ? " (les mots ont résonné étrangement fort)" : ""}`,
        },
        ...res.notes.map((n) => ({ jour, type: "info" as const, texte: n })),
      ],
    });
  },

  selectionnerAdepte: (id) => set({ adepteSelectionneId: id, dialogue: null }),

  parler: (adepteId) => {
    const { adeptes, actionsRestantes, phase } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || phase !== "gestion" || actionsRestantes <= 0) return;
    const archetype = getArchetype(adepte.archetypeId);
    // L'infiltré se trahit parfois dans la conversation.
    const accroche =
      adepte.estInfiltre && chance(45)
        ? pick(TELLS_INFILTRE)
        : pick(archetype.accroches);
    set({
      actionsRestantes: actionsRestantes - 1,
      adepteSelectionneId: adepteId,
      dialogue: {
        adepteId,
        accroche,
        choix: archetype.choixDialogue,
        reponse: null,
        interrogatoire: false,
      },
    });
  },

  // Au confessionnal : même conversation, mais sous pression. L'infiltré
  // se trahit plus souvent, et l'accusation formelle devient possible.
  interroger: (adepteId) => {
    const { adeptes, actionsRestantes, phase } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || phase !== "gestion" || actionsRestantes <= 0) return;
    const archetype = getArchetype(adepte.archetypeId);
    const accroche =
      adepte.estInfiltre && chance(65)
        ? pick(TELLS_INFILTRE)
        : pick(archetype.accroches);
    set({
      actionsRestantes: actionsRestantes - 1,
      adepteSelectionneId: adepteId,
      dialogue: {
        adepteId,
        accroche,
        choix: archetype.choixDialogue,
        reponse: null,
        interrogatoire: true,
      },
    });
  },

  repondreDialogue: (index) => {
    const { dialogue, adeptes } = get();
    if (!dialogue || dialogue.reponse !== null) return;
    const choix = dialogue.choix[index];
    if (!choix) return;
    set({
      adeptes: adeptes.map((a) =>
        a.id === dialogue.adepteId
          ? {
              ...a,
              loyaute: clamp(a.loyaute + choix.loyaute),
              suspicion: clamp(a.suspicion + choix.suspicion),
            }
          : a
      ),
      dialogue: { ...dialogue, reponse: choix.reponse },
    });
  },

  fermerDialogue: () => set({ dialogue: null }),

  donnerTache: (adepteId) => {
    const { adeptes, actionsRestantes, phase, stats, jour, journal } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || phase !== "gestion" || actionsRestantes <= 0) return;
    set({
      actionsRestantes: actionsRestantes - 1,
      stats: { ...stats, ressources: stats.ressources + 8 },
      adeptes: adeptes.map((a) =>
        a.id === adepteId ? { ...a, loyaute: clamp(a.loyaute + 3) } : a
      ),
      journal: [
        ...journal,
        {
          jour,
          type: "info",
          texte: `${adepte.nom} est envoyé aux corvées sacrées. Les ressources remontent, l'ego aussi.`,
        },
      ],
    });
  },

  promouvoir: (adepteId) => {
    const { adeptes, actionsRestantes, phase, stats, jour, journal } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || adepte.promu || phase !== "gestion" || actionsRestantes <= 0)
      return;
    const archetype = getArchetype(adepte.archetypeId);
    set({
      actionsRestantes: actionsRestantes - 1,
      stats: { ...stats, ferveur: clamp(stats.ferveur + 4) },
      adeptes: adeptes.map((a) => {
        if (a.id === adepteId)
          return { ...a, promu: true, loyaute: clamp(a.loyaute + 15) };
        // Les gros egos digèrent mal la promotion des autres.
        if (a.influence > 60) return { ...a, loyaute: clamp(a.loyaute - 5) };
        return a;
      }),
      journal: [
        ...journal,
        {
          jour,
          type: "info",
          texte: `${adepte.nom} est promu Disciple de confiance. ${archetype.reactionPromotion}`,
        },
      ],
    });
  },

  exclure: (adepteId) => {
    const { adeptes, actionsRestantes, phase, stats, jour, journal } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || phase !== "gestion" || actionsRestantes <= 0) return;
    const archetype = getArchetype(adepte.archetypeId);
    const onde = Math.round(adepte.influence / 15);
    const nouvellesEntrees: EntreeJournal[] = [
      {
        jour,
        type: "info",
        texte: `${adepte.nom} est exclu du mouvement. ${archetype.reactionExclusion}`,
      },
    ];
    let reputation = stats.reputation;
    if (adepte.estInfiltre) {
      reputation = clamp(reputation - 8);
      nouvellesEntrees.push({
        jour,
        type: "alerte",
        texte: `Quelques jours plus tard, un entrefilet paraît dans la presse locale : « Une communauté qui a des choses à cacher ? » Signé d'initiales inconnues.`,
      });
    }
    set({
      actionsRestantes: actionsRestantes - 1,
      adepteSelectionneId: null,
      stats: {
        ...stats,
        ferveur: clamp(stats.ferveur - Math.round(adepte.influence / 10)),
        paranoia: clamp(stats.paranoia + 4),
        reputation,
      },
      adeptes: adeptes
        .filter((a) => a.id !== adepteId)
        .map((a) => ({ ...a, loyaute: clamp(a.loyaute - onde) })),
      journal: [...journal, ...nouvellesEntrees],
    });
  },

  faireDisparaitre: (adepteId) => {
    const { adeptes, actionsRestantes, phase, stats, jour, journal } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || phase !== "gestion" || actionsRestantes <= 0) return;
    const nouvellesEntrees: EntreeJournal[] = [
      {
        jour,
        type: "alerte",
        texte: `${adepte.nom} est parti en « mission lointaine ». Très lointaine. Le bus de nuit pour Perpignan, disons.`,
      },
    ];
    const s = {
      ...stats,
      derive: clamp(stats.derive + 15),
      paranoia: clamp(stats.paranoia + 10),
    };
    let liste = adeptes.filter((a) => a.id !== adepteId);
    if (adepte.estInfiltre) {
      s.reputation = clamp(s.reputation - 18);
      nouvellesEntrees.push({
        jour,
        type: "alerte",
        texte: `Le bipeur de ${adepte.nom} ne répond plus. Quelque part, un commissariat s'inquiète beaucoup.`,
      });
    } else if (chance(50)) {
      s.reputation = clamp(s.reputation - 8);
      liste = liste.map((a) => ({ ...a, loyaute: clamp(a.loyaute - 6) }));
      nouvellesEntrees.push({
        jour,
        type: "indice",
        texte: `Des adeptes posent des questions sur cette « mission ». ${adepte.nom} n'avait même pas pris sa brosse à dents.`,
      });
    }
    set({
      actionsRestantes: actionsRestantes - 1,
      adepteSelectionneId: null,
      stats: s,
      adeptes: liste,
      journal: [...journal, ...nouvellesEntrees],
    });
  },

  // L'accusation se prononce à l'issue d'un interrogatoire — elle ne coûte
  // pas d'action supplémentaire, mais elle engage tout le camp.
  accuser: (adepteId) => {
    const { adeptes, phase, stats, jour, journal, infiltre } = get();
    const adepte = adeptes.find((a) => a.id === adepteId);
    if (!adepte || phase !== "gestion") return;

    if (adepte.estInfiltre && infiltre) {
      const preuve =
        infiltre.type === "flic"
          ? "Dans la doublure de sa veste : un badge de la gendarmerie et trois tickets-restaurant."
          : "Dans sa gourde : un dictaphone. Dans le dictaphone : vos sermons, annotés « à charge ».";
      set({
        dialogue: null,
        adepteSelectionneId: null,
        stats: {
          ...stats,
          ferveur: clamp(stats.ferveur + 10),
          paranoia: clamp(stats.paranoia - 10),
          reputation: clamp(stats.reputation + 5),
        },
        adeptes: adeptes.filter((a) => a.id !== adepteId),
        infiltre: null,
        prochainInfiltreJour: jour + randInt(6, 10),
        journal: [
          ...journal,
          {
            jour,
            type: "alerte",
            texte: `DÉMASQUÉ. ${adepte.nom} était un infiltré (${infiltre.type === "flic" ? "police" : "presse"}). ${preuve} Le camp exulte : le Gourou voit tout.`,
          },
        ],
      });
    } else {
      // Fausse accusation : la paranoïa se retourne contre vous.
      set({
        dialogue: null,
        adepteSelectionneId: null,
        stats: {
          ...stats,
          ferveur: clamp(stats.ferveur - 10),
          paranoia: clamp(stats.paranoia + 15),
        },
        adeptes: adeptes
          .filter((a) => a.id !== adepteId)
          .map((a) => ({ ...a, loyaute: clamp(a.loyaute - 8) })),
        journal: [
          ...journal,
          {
            jour,
            type: "alerte",
            texte: `${adepte.nom}, accusé d'être un traître, vide son sac devant tout le monde : trois t-shirts et un livre de sudoku. Il part en larmes. Le camp évite votre regard.`,
          },
        ],
      });
    }
  },

  passerAEvenement: () => {
    const { jour, adeptes, evenementsVus, phase } = get();
    if (phase !== "gestion") return;
    set({
      phase: "evenement",
      dialogue: null,
      dernierSermon: null,
      adepteSelectionneId: null,
      evenementDuJour: tirerEvenement(jour, adeptes, evenementsVus),
    });
  },

  choisirEvenement: (index) => {
    const { evenementDuJour, stats, adeptes, jour, journal, evenementsVus } =
      get();
    if (!evenementDuJour || evenementDuJour.reaction !== null) return;
    const choix = evenementDuJour.evenement.choix[index];
    if (!choix) return;
    const res = appliquerEffets(stats, adeptes, choix.effets, jour);
    const cible = adeptes.find((a) => a.id === evenementDuJour.adepteCibleId);
    const reaction = choix.reaction.replace(/\{ADEPTE\}/g, cible?.nom ?? "");
    set({
      stats: res.stats,
      adeptes: res.adeptes,
      evenementsVus: [...evenementsVus, evenementDuJour.evenement.id],
      evenementDuJour: { ...evenementDuJour, reaction },
      journal: [
        ...journal,
        {
          jour,
          type: "info",
          texte: `${evenementDuJour.evenement.titre} — ${reaction}`,
        },
        ...res.notes.map((n) => ({ jour, type: "info" as const, texte: n })),
      ],
    });
  },

  terminerJournee: () => {
    const {
      jour,
      stats,
      adeptes,
      infiltre,
      prochainInfiltreJour,
      journal,
      nomSecte,
    } = get();
    const res = resoudreFinDeJournee(
      jour,
      stats,
      adeptes,
      infiltre,
      prochainInfiltreJour
    );
    const fin = verifierFin(res.stats, res.adeptes, jour, nomSecte);

    // La Dérive débloque les miracles — définitivement, même si elle redescend.
    const { miraclesDebloques } = get();
    const nouveauxMiracles = MIRACLES.filter(
      (m) => res.stats.derive >= m.seuil && !miraclesDebloques.includes(m.id)
    );
    const journalNuit = [...res.journal];
    if (nouveauxMiracles.length > 0) {
      journalNuit.push({
        jour,
        type: "pensee" as const,
        texte:
          "Le micro-ondes a fait un bruit nouveau cette nuit. Quelque chose est devenu... disponible.",
      });
    }

    set({
      phase: "rapport",
      stats: res.stats,
      adeptes: res.adeptes,
      infiltre: res.infiltre,
      prochainInfiltreJour: res.prochainInfiltreJour,
      rapportDuSoir: res.rapport,
      journal: [...journal, ...journalNuit],
      fin,
      caisseOuverte: false,
      autelOuvert: false,
      miraclesDebloques: [
        ...miraclesDebloques,
        ...nouveauxMiracles.map((m) => m.id),
      ],
    });
  },

  jourSuivant: () => {
    const { fin } = get();
    if (fin) {
      effacerSauvegarde();
      set({ ecran: "fin", aSauvegarde: false });
      return;
    }
    const etat = get();
    const nouveauJour = etat.jour + 1;

    // Le jour de la prophétie est-il arrivé ?
    let resolutionProphetie: ResolutionProphetie | null =
      etat.resolutionProphetie;
    let journal = etat.journal;
    if (etat.prophetie && !resolutionProphetie) {
      if (nouveauJour >= etat.prophetie.jourEcheance) {
        // Un signe plausible s'est-il produit ? Les fervents en voient partout.
        resolutionProphetie = {
          prophetieId: etat.prophetie.prophetieId,
          signe: chance(20 + etat.stats.ferveur / 4),
        };
      } else if (etat.prophetie.jourEcheance - nouveauJour === 1) {
        journal = [
          ...journal,
          {
            jour: nouveauJour,
            type: "info",
            texte:
              "Veille de prophétie. Le camp est fébrile. Kevin a préparé un parapluie, « au cas où, dans un sens ou dans l'autre ».",
          },
        ];
      }
    }

    sauvegarder({
      version: 1,
      nomSecte: etat.nomSecte,
      jour: nouveauJour,
      stats: etat.stats,
      adeptes: etat.adeptes,
      journal,
      infiltre: etat.infiltre,
      prochainInfiltreJour: etat.prochainInfiltreJour,
      evenementsVus: etat.evenementsVus,
      prophetie: etat.prophetie,
      resolutionProphetie,
      miraclesDebloques: etat.miraclesDebloques,
    });
    set({
      jour: nouveauJour,
      phase: "sermon",
      motsDuJour: tirerMots(etat.stats.derive),
      dernierSermon: null,
      actionsRestantes: ACTIONS_PAR_JOUR,
      evenementDuJour: null,
      rapportDuSoir: [],
      dialogue: null,
      adepteSelectionneId: null,
      aSauvegarde: true,
      journal,
      resolutionProphetie,
      miracleUtilise: false,
      caisseOuverte: false,
      autelOuvert: false,
    });
  },

  dissoudre: () => {
    const { nomSecte } = get();
    effacerSauvegarde();
    set({ fin: finRedemption(nomSecte), ecran: "fin", aSauvegarde: false });
  },

  retourTitre: () => {
    set({ ecran: "titre", aSauvegarde: chargerSauvegarde() !== null });
  },

  ouvrirCaisse: () => {
    const { phase, actionsRestantes, prophetie, dialogue } = get();
    if (phase !== "gestion" || actionsRestantes <= 0 || prophetie || dialogue)
      return;
    set({ caisseOuverte: true, autelOuvert: false });
  },

  fermerCaisse: () => set({ caisseOuverte: false }),

  annoncerProphetie: (prophetieId, dansJours) => {
    const { phase, actionsRestantes, prophetie, jour, stats, journal } = get();
    if (phase !== "gestion" || actionsRestantes <= 0 || prophetie) return;
    const p = getProphetie(prophetieId);
    // Plus c'est grandiose et proche, plus le camp s'enflamme — à crédit.
    const boost = p.grandiose * 4 + (9 - dansJours);
    set({
      actionsRestantes: actionsRestantes - 1,
      caisseOuverte: false,
      stats: {
        ...stats,
        ferveur: clamp(stats.ferveur + boost),
        derive: clamp(stats.derive + 2),
      },
      prophetie: { prophetieId, jourEcheance: jour + dansJours, foisDoublee: 0 },
      journal: [
        ...journal,
        {
          jour,
          type: "info",
          texte: `PROPHÉTIE. Du haut de la caisse : « ${p.annonce} » Rendez-vous au jour ${jour + dansJours}. Le camp frissonne.`,
        },
      ],
    });
  },

  resoudreProphetie: (choix) => {
    const { prophetie, resolutionProphetie, jour, stats, adeptes, journal } =
      get();
    if (!prophetie || !resolutionProphetie) return;
    const p = getProphetie(prophetie.prophetieId);
    const g = p.grandiose;

    if (choix === "miracle" && resolutionProphetie.signe) {
      set({
        stats: {
          ...stats,
          ferveur: clamp(stats.ferveur + g * 5),
          paranoia: clamp(stats.paranoia - 3),
          // S'attribuer un hasard : le premier pas vers y croire soi-même.
          derive: clamp(stats.derive + 3),
        },
        prophetie: null,
        resolutionProphetie: null,
        journal: [
          ...journal,
          { jour, type: "info", texte: `PROPHÉTIE ACCOMPLIE. ${p.accomplie}` },
        ],
      });
    } else if (choix === "doubler") {
      set({
        stats: {
          ...stats,
          ferveur: clamp(stats.ferveur - 3),
          derive: clamp(stats.derive + 3 + g * 2),
        },
        prophetie: {
          ...prophetie,
          jourEcheance: jour + 4,
          foisDoublee: prophetie.foisDoublee + 1,
        },
        resolutionProphetie: null,
        journal: [
          ...journal,
          {
            jour,
            type: "info",
            texte: `La prophétie est « réinterprétée » : le vrai rendez-vous est au jour ${jour + 4}. Quelques sourcils se lèvent. Vous les recomptez ce soir.`,
          },
        ],
      });
    } else if (choix === "admettre") {
      const chute = g * 7 + prophetie.foisDoublee * 4;
      set({
        stats: {
          ...stats,
          ferveur: clamp(stats.ferveur - chute),
          derive: clamp(stats.derive - 8),
          reputation: clamp(stats.reputation + 4),
          paranoia: clamp(stats.paranoia - 4),
        },
        prophetie: null,
        resolutionProphetie: null,
        journal: [
          ...journal,
          {
            jour,
            type: "info",
            texte: `${p.ratee} Vous admettez l'erreur, simplement. Le silence est long. La grand-mère finit par servir le café.`,
          },
        ],
      });
    } else if (choix === "halluciner" && stats.derive >= 50) {
      set({
        stats: {
          ...stats,
          ferveur: clamp(stats.ferveur + g * 3),
          derive: clamp(stats.derive + g * 4),
          paranoia: clamp(stats.paranoia + 6),
        },
        adeptes: adeptes.map((a) =>
          a.loyaute < 60 ? { ...a, loyaute: clamp(a.loyaute - 8) } : a
        ),
        prophetie: null,
        resolutionProphetie: null,
        journal: [
          ...journal,
          {
            jour,
            type: "alerte",
            texte: `« C'est accompli. Je le VOIS. » Les fervents tombent à genoux. Les douteux regardent le ciel vide, puis la sortie.`,
          },
        ],
      });
    }
  },

  ouvrirAutel: () => {
    const { phase, dialogue } = get();
    if (phase !== "gestion" || dialogue) return;
    set({ autelOuvert: true, caisseOuverte: false });
  },

  fermerAutel: () => set({ autelOuvert: false }),

  lancerMiracle: (miracleId) => {
    const { phase, miracleUtilise, miraclesDebloques, stats, jour, journal } =
      get();
    const miracle = MIRACLES.find((m) => m.id === miracleId);
    if (
      !miracle ||
      phase !== "gestion" ||
      miracleUtilise ||
      !(miraclesDebloques.includes(miracleId) || stats.derive >= miracle.seuil)
    )
      return;

    const s: Stats = { ...stats, derive: clamp(stats.derive + miracle.cout) };
    let adeptes = get().adeptes;
    let actionsRestantes = get().actionsRestantes;
    let texte = "";
    if (miracleId === "quete") {
      s.ressources += 25;
      texte =
        "MIRACLE. La caisse commune déborde de billets pliés en triangle. Personne ne demande d'où. La foi dispense de reçu.";
    } else if (miracleId === "signe") {
      s.ferveur = clamp(s.ferveur + 15);
      s.paranoia = clamp(s.paranoia + 3);
      texte =
        "MIRACLE. Vous avez fait le Geste devant le camp. Personne ne peut le décrire, mais tout le monde l'a vu. La ferveur repart.";
    } else if (miracleId === "dedoublement") {
      actionsRestantes += 2;
      texte =
        "MIRACLE. Vous avez toujours été à deux endroits aujourd'hui. Le temps a cédé sans discuter. Il ne discute plus beaucoup, le temps.";
    } else if (miracleId === "grand-oubli") {
      s.paranoia = clamp(s.paranoia - 25);
      adeptes = adeptes.map((a) => ({
        ...a,
        suspicion: clamp(a.suspicion - 15),
      }));
      texte =
        "MIRACLE. Le camp s'est réveillé lisse. Les rancunes, les questions sur la caisse : effacées. Georgette refait du café comme si de rien n'était.";
    }

    set({
      stats: s,
      adeptes,
      actionsRestantes,
      miracleUtilise: true,
      autelOuvert: false,
      miraclesDebloques: miraclesDebloques.includes(miracleId)
        ? miraclesDebloques
        : [...miraclesDebloques, miracleId],
      journal: [...journal, { jour, type: "pensee", texte }],
    });
  },
}));
