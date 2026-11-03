// Les Mots Sacrés : le sermon du matin se compose en en combinant deux.
// Chaque mot a ses effets ; certaines paires révèlent un combo caché.

import type { ComboSermon, MotSacre } from "@/lib/types";

export const MOTS_SACRES: MotSacre[] = [
  {
    id: "famille",
    mot: "Famille",
    effets: { ferveur: 4, paranoia: -2 },
    fragments: [
      "Nous sommes une famille. Celle qui ne vous juge pas au repas de Noël.",
      "Vos anciennes familles ont eu leur chance. Elles l'ont gâchée en 1997.",
      "Ici, personne ne vous demandera quand vous comptez trouver « un vrai travail ».",
    ],
  },
  {
    id: "peur",
    mot: "Peur",
    effets: { ferveur: 2, paranoia: 6, derive: 2 },
    fragments: [
      "Dehors, tout mord. Même les distributeurs de billets.",
      "La peur est une boussole. Suivez-la jusqu'à moi.",
      "Quelque chose approche. J'ai vu les nuages faire des angles.",
    ],
  },
  {
    id: "argent",
    mot: "Argent",
    effets: { ressources: 10, ferveur: -2, derive: 1 },
    fragments: [
      "L'argent n'a aucune valeur. Donnez-le-moi, vous serez débarrassés.",
      "La dîme allège l'âme et le portefeuille. Dans cet ordre.",
      "Le ciel n'accepte pas la carte bleue. Moi si. Sans contact.",
    ],
  },
  {
    id: "silence",
    mot: "Silence",
    effets: { paranoia: -5, ferveur: -1 },
    fragments: [
      "Taisons-nous ensemble. C'est plus fort que de parler seuls.",
      "Le silence est la seule prière sans faute d'orthographe.",
      "Chut. ... Voilà. C'était ça, la doctrine du jour.",
    ],
  },
  {
    id: "amour",
    mot: "Amour",
    effets: { ferveur: 4, reputation: 2 },
    fragments: [
      "Aimez-vous les uns les autres. Sous ma supervision.",
      "L'amour est gratuit. Le reste est en supplément.",
      "Serrez la main de votre voisin. Gardez-la. Bien. On avance.",
    ],
  },
  {
    id: "travail",
    mot: "Travail",
    effets: { ressources: 6, ferveur: 1 },
    fragments: [
      "Chaque patate épluchée vous élève. Le champ nord regorge d'élévation.",
      "Les ampoules aux mains sont des médailles que le corps se décerne.",
      "Le repos, c'est pour ceux qui doutent. Vous doutez ? Non ? Aux brouettes.",
    ],
  },
  {
    id: "mystere",
    mot: "Mystère",
    effets: { ferveur: 5, paranoia: 3, derive: 2 },
    fragments: [
      "Il y a des choses que je sais et que je ne dirai pas. De rien.",
      "Le troisième tiroir de l'autel restera fermé. N'y pensez plus. Vous y pensez, là.",
      "Pourquoi ? Excellente question. Méditez-la jusqu'à jeudi.",
    ],
  },
  {
    id: "moi",
    mot: "Le Gourou",
    effets: { ferveur: 6, derive: 5, reputation: -2 },
    fragments: [
      "Je ne dis pas que je suis exceptionnel. Je le laisse entendre. Nuance.",
      "Regardez ce front. Ce front a vaincu le temps.",
      "Quand je dors, je continue d'avoir raison. C'est fatigant, mais c'est le don.",
    ],
  },
  {
    id: "findumonde",
    mot: "Fin du Monde",
    effets: { ferveur: 7, paranoia: 6, derive: 4, reputation: -3 },
    fragments: [
      "La fin approche. Prévoyez des mouchoirs et des conserves.",
      "Après la fin, il y aura un brunch. Réservé aux fidèles à jour de cotisation.",
      "Le monde finit mardi. Lequel ? Un mardi. Restez souples.",
    ],
  },
  {
    id: "soupe",
    mot: "Soupe",
    effets: { ferveur: 3, paranoia: -3, ressources: -3 },
    fragments: [
      "Ce soir, soupe pour tous. La transcendance commence par un bon bouillon.",
      "Croyez en ce que vous voulez, mais croyez-y avec des légumes.",
      "Le poireau ne ment jamais. Méditez là-dessus en coupant les carottes.",
    ],
  },
];

// Le mot qui n'existe pas. À Dérive très haute, il s'invite dans le tirage
// du matin à la place d'un mot normal. Le joueur comprendra que quelque
// chose ne va plus du tout.
export const MOT_VERITE: MotSacre = {
  id: "verite",
  mot: "LA VÉRITÉ",
  effets: { ferveur: 9, paranoia: 7, derive: 6, reputation: -4 },
  fragments: [
    "Je vais tout vous dire. Non. Pas encore. Mais sachez que je sais.",
    "La vérité est ronde et chaude et elle tourne. Comme dans le micro-ondes.",
    "Certains d'entre vous ne sont pas réels. La VÉRITÉ, c'est que ça ne change rien entre nous.",
  ],
};

// Paires qui déclenchent une révélation — texte dédié et bonus caché.
export const COMBOS_SERMON: ComboSermon[] = [
  {
    mots: ["peur", "famille"],
    titre: "La Famille est menacée",
    texte:
      "On veut nous séparer. Qui ? Eux. Serrez-vous. Plus serré que ça. Voilà. Que personne ne réponde aux appels de sa mère cette semaine.",
    bonus: { paranoia: 4, ferveur: 3 },
  },
  {
    mots: ["argent", "amour"],
    titre: "Donner, c'est aimer",
    texte:
      "L'amour ne se compte pas. Mais s'il se comptait, il se compterait en espèces, dans l'urne prévue à cet effet, près du portail.",
    bonus: { ressources: 8 },
  },
  {
    mots: ["moi", "mystere"],
    titre: "Qui suis-je vraiment ?",
    texte:
      "On me demande d'où je viens. Je réponds : d'où venez-VOUS ? Le silence qui suit est ma biographie officielle.",
    bonus: { derive: 4, ferveur: 4 },
  },
  {
    mots: ["soupe", "findumonde"],
    titre: "Le Dernier Bouillon",
    texte:
      "Quand tout s'effondrera, il restera ceci : nous, autour d'une marmite. L'apocalypse a une odeur, et c'est celle du poireau.",
    bonus: { ferveur: 6 },
  },
  {
    mots: ["silence", "moi"],
    titre: "Méditez-moi",
    texte:
      "Aujourd'hui, ne pensez à rien. Et si une pensée vient malgré tout, faites en sorte que ce soit moi.",
    bonus: { derive: 3, paranoia: -2 },
  },
  {
    mots: ["travail", "findumonde"],
    titre: "Le Potager de l'Apocalypse",
    texte:
      "La fin du monde n'attend pas, et les radis non plus. Creusez. Pour les légumes ou pour l'abri, on verra selon la météo.",
    bonus: { ressources: 6, paranoia: 3 },
  },
  {
    mots: ["famille", "soupe"],
    titre: "Le Grand Repas",
    texte:
      "Une famille, c'est des gens qui mangent la même soupe sans porter plainte. Ce soir, double ration. Maman est fière de vous. Maman, c'est moi.",
    bonus: { ferveur: 5, paranoia: -3 },
  },
  {
    mots: ["peur", "argent"],
    titre: "L'Assurance Éternité",
    texte:
      "Le malheur frappe sans prévenir. Heureusement, la formule Éternité Plus couvre l'au-delà, les intempéries et le vol de vélo. Souscription au fond à droite.",
    bonus: { ressources: 10, derive: 3, reputation: -3 },
  },
];

export function trouverCombo(idA: string, idB: string): ComboSermon | null {
  return (
    COMBOS_SERMON.find(
      (c) =>
        (c.mots[0] === idA && c.mots[1] === idB) ||
        (c.mots[0] === idB && c.mots[1] === idA)
    ) ?? null
  );
}
