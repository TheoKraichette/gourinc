// Résolution de fin de journée : drift des stats, départs, recrutements,
// vie de l'infiltré, pensées du gourou. Fonction pure : état entrant → état sortant + rapport.

import type { Adepte, EntreeJournal, InfiltreEtat, Stats } from "@/lib/types";
import { creerAdepte } from "./adeptes";
import { INDICES_INFILTRE, FAUX_INDICES } from "@/data/indices";
import {
  PENSEES_PALIER_1,
  PENSEES_PALIER_2,
  PENSEES_PALIER_3,
} from "@/data/pensees";
import { MENSONGES_CHRONIQUE } from "@/data/mensonges";
import { chance, clamp, pick, randInt } from "@/lib/rng";

export interface ResultatResolution {
  stats: Stats;
  adeptes: Adepte[];
  infiltre: InfiltreEtat | null;
  prochainInfiltreJour: number;
  rapport: string[];
  journal: EntreeJournal[];
}

export function resoudreFinDeJournee(
  jour: number,
  statsIn: Stats,
  adeptesIn: Adepte[],
  infiltreIn: InfiltreEtat | null,
  prochainInfiltreJour: number
): ResultatResolution {
  const stats: Stats = { ...statsIn };
  let adeptes: Adepte[] = adeptesIn.map((a) => ({ ...a }));
  let infiltre: InfiltreEtat | null = infiltreIn ? { ...infiltreIn } : null;
  let prochainInfiltre = prochainInfiltreJour;
  const rapport: string[] = [];
  const journal: EntreeJournal[] = [];

  // 1. Drift naturel — l'entropie du doute
  stats.ferveur -= 2;
  if (stats.paranoia > 60) {
    stats.ferveur -= 3;
    rapport.push("La paranoïa ronge l'ambiance. Les gens chuchotent en se regardant chuchoter.");
  }
  stats.paranoia -= 2;
  if (stats.derive > 50) {
    stats.reputation -= 1;
  }

  // 2. Intendance
  const coutNourriture = Math.ceil(adeptes.length / 2);
  stats.ressources -= coutNourriture;
  if (stats.ressources < 0) {
    stats.ressources = 0;
    stats.ferveur -= 8;
    rapport.push("Les réserves sont vides. La soupe du soir était surtout de l'eau chaude avec une intention.");
  }

  // 3. Le moral collectif déteint sur la loyauté individuelle
  for (const a of adeptes) {
    if (stats.ferveur >= 70) a.loyaute = clamp(a.loyaute + 2);
    if (stats.ferveur < 30) a.loyaute = clamp(a.loyaute - 3);
    if (stats.paranoia >= 70) {
      a.loyaute = clamp(a.loyaute - 2);
      a.suspicion = clamp(a.suspicion + 3);
    }
  }

  // 4. Départs nocturnes
  const partants: Adepte[] = [];
  adeptes = adeptes.filter((a) => {
    if (a.estInfiltre) return true; // l'infiltré, lui, reste. Évidemment.
    const veutPartir =
      (a.loyaute < 20 && chance(40)) ||
      (stats.ferveur < 20 && a.loyaute < 35 && chance(25));
    if (veutPartir) partants.push(a);
    return !veutPartir;
  });
  for (const p of partants) {
    rapport.push(`${p.nom} est parti dans la nuit, sans bruit. Sa tente est vide.`);
    const onde = Math.round(p.influence / 15);
    for (const a of adeptes) a.loyaute = clamp(a.loyaute - onde);
    if (p.influence > 50) {
      rapport.push(`Le départ de ${p.nom} laisse un vide. On en parle à voix basse au petit-déjeuner.`);
    }
  }

  // 5. Recrutement — la ferveur attire, la réputation rassure
  const pRecrue = clamp((stats.ferveur + stats.reputation) / 2 - 25, 5, 55);
  if (chance(pRecrue)) {
    const recrue = creerAdepte(adeptes, jour);
    adeptes.push(recrue);
    rapport.push(`Une nouvelle recrue a poussé le portail : ${recrue.nom}. Regard brillant, valise légère.`);
  }

  // 6. Arrivée d'un infiltré — déguisé en recrue ordinaire
  if (!infiltre && jour + 1 >= prochainInfiltre) {
    const type = chance(50) ? ("flic" as const) : ("journaliste" as const);
    const espion = creerAdepte(adeptes, jour, { estInfiltre: true });
    adeptes.push(espion);
    infiltre = { adepteId: espion.id, type, jourArrivee: jour, indicesRecus: [] };
    rapport.push(`Une nouvelle recrue a poussé le portail : ${espion.nom}. Regard brillant, valise légère.`);
  }

  // 7. Vie de l'infiltré : indices, et compte à rebours
  if (infiltre) {
    const espion = adeptes.find((a) => a.id === infiltre!.adepteId);
    if (espion) {
      const joursInfiltre = jour - infiltre.jourArrivee;
      if (joursInfiltre >= 8) {
        // Trop tard : l'infiltré rend son rapport.
        adeptes = adeptes.filter((a) => a.id !== espion.id);
        if (infiltre.type === "flic") {
          stats.reputation -= 25;
          stats.paranoia += 10;
          stats.ferveur -= 5;
          journal.push({
            jour,
            type: "alerte",
            texte: `${espion.nom} a disparu au matin. À midi, une descente de gendarmerie « de routine ». Ils savaient où était la caisse. Ils savaient tout.`,
          });
        } else {
          stats.reputation -= 20;
          stats.ferveur -= 8;
          journal.push({
            jour,
            type: "alerte",
            texte: `${espion.nom} a disparu au matin. Trois jours plus tard, un article : « J'ai infiltré la secte » — huit pages, photos comprises. Vous êtes flou sur toutes, mais reconnaissable.`,
          });
        }
        infiltre = null;
        prochainInfiltre = jour + randInt(6, 10);
      } else if (chance(50)) {
        const dispo = INDICES_INFILTRE.filter(
          (i) => !infiltre!.indicesRecus.includes(i)
        );
        if (dispo.length > 0) {
          const indice = pick(dispo);
          infiltre.indicesRecus.push(indice);
          journal.push({
            jour,
            type: "indice",
            texte: indice.replace(/\{NOM\}/g, espion.nom),
          });
        }
      }
    } else {
      // L'infiltré n'est plus là (exclu, disparu...) : la menace est levée.
      infiltre = null;
      prochainInfiltre = jour + randInt(6, 10);
    }
  }

  // 8. Faux indices — cadeau de la paranoïa
  if (stats.paranoia > 45 && chance(stats.paranoia - 45)) {
    const innocents = adeptes.filter((a) => !a.estInfiltre);
    if (innocents.length > 0) {
      const cible = pick(innocents);
      journal.push({
        jour,
        type: "indice",
        texte: pick(FAUX_INDICES).replace(/\{NOM\}/g, cible.nom),
      });
    }
  }

  // 9. Pensées du gourou — la Dérive parle
  const poolPensees =
    stats.derive >= 85
      ? PENSEES_PALIER_3
      : stats.derive >= 60
        ? PENSEES_PALIER_2
        : stats.derive >= 30
          ? PENSEES_PALIER_1
          : null;
  if (poolPensees && chance(65)) {
    journal.push({ jour, type: "pensee", texte: pick(poolPensees) });
  }

  // 9bis. À très haute Dérive, la chronique elle-même se met à mentir.
  // Déguisée en info banale : c'est le contenu qui doit inquiéter.
  if (stats.derive >= 70 && chance(35)) {
    journal.push({ jour, type: "info", texte: pick(MENSONGES_CHRONIQUE) });
  }

  // 10. Bornage
  stats.ferveur = clamp(stats.ferveur);
  stats.paranoia = clamp(stats.paranoia);
  stats.reputation = clamp(stats.reputation);
  stats.derive = clamp(stats.derive);
  stats.ressources = Math.max(0, Math.round(stats.ressources));

  if (rapport.length === 0) {
    rapport.push("Une journée calme. C'est louche, mais on prend.");
  }

  return {
    stats,
    adeptes,
    infiltre,
    prochainInfiltreJour: prochainInfiltre,
    rapport,
    journal,
  };
}
