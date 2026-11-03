// Les 8 archétypes d'adeptes. Chacun a sa voix, ses stats de départ,
// et ses réactions aux grands moments de la vie sectaire.

import type { Archetype } from "@/lib/types";

export const ARCHETYPES: Archetype[] = [
  {
    id: "naif",
    nom: "Le Naïf",
    description: "Croit tout. Même les horoscopes contradictoires.",
    base: { loyaute: [70, 90], suspicion: [0, 10], influence: [10, 30] },
    accroches: [
      "Gourou ! J'ai rêvé de vous cette nuit. Vous distribuiez des yaourts. C'est un signe, non ?",
      "J'ai dit à ma banquière que je suivais désormais la Voie. Elle a raccroché. Elle n'est pas prête.",
      "Est-ce que les nuages nous observent ? Je demande pour un ami. L'ami c'est moi.",
    ],
    choixDialogue: [
      {
        label: "Oui, c'est un signe majeur.",
        reponse: "Je le savais ! Je vais le noter dans mon carnet des signes. Page 340.",
        loyaute: 8,
        suspicion: -2,
      },
      {
        label: "Concentre-toi sur tes corvées.",
        reponse: "Oui. Bien sûr. Les corvées sont une prière. Vous l'avez dit mardi. Ou c'était moi ?",
        loyaute: 2,
        suspicion: 0,
      },
      {
        label: "Tu poses trop de questions.",
        reponse: "Pardon. Je vais poser des affirmations à la place.",
        loyaute: -4,
        suspicion: 3,
      },
    ],
    reactionPromotion: "Il pleure de joie et essaie de bénir une brouette.",
    reactionExclusion: "Il part en remerciant tout le monde. Même le portail.",
  },
  {
    id: "comptable",
    nom: "L'Ancien Comptable",
    description: "A quitté un cabinet d'audit pour « du sens ». Optimise la dîme.",
    base: { loyaute: [50, 70], suspicion: [20, 40], influence: [30, 50] },
    accroches: [
      "Gourou, j'ai refait les comptes de l'au-delà. On est en déficit karmique de 12%.",
      "Si on requalifie les offrandes en dons manuels, on défiscalise l'extase. J'ai les formulaires.",
      "Question : le paradis, c'est du hors-bilan ?",
    ],
    choixDialogue: [
      {
        label: "Tes chiffres servent la Cause.",
        reponse: "Merci. J'ai pris la liberté d'amortir l'autel sur cinq ans.",
        loyaute: 7,
        suspicion: -3,
      },
      {
        label: "L'argent est une illusion.",
        reponse: "Une illusion avec un taux de TVA, Gourou. Restons rigoureux.",
        loyaute: -2,
        suspicion: 2,
      },
      {
        label: "Ne montre ces comptes à personne.",
        reponse: "...Noté. Je crée un deuxième classeur. Un classeur ésotérique.",
        loyaute: 3,
        suspicion: 5,
      },
    ],
    reactionPromotion: "Il imprime des cartes de visite : « Second du Gourou — Expertise & Transcendance ».",
    reactionExclusion: "Il exige un reçu de sortie. Personne ne sait quoi écrire dessus.",
  },
  {
    id: "rebelle",
    nom: "La Rebelle Silencieuse",
    description: "Elle observe. Elle note. Elle n'applaudit jamais aux sermons.",
    base: { loyaute: [30, 50], suspicion: [40, 60], influence: [40, 60] },
    accroches: [
      "...",
      "Vous saviez que la « prophétie du réfrigérateur » change chaque fois que vous la racontez ?",
      "Je reste parce que la nourriture est correcte. Pour l'instant.",
    ],
    choixDialogue: [
      {
        label: "Ton silence est une sagesse.",
        reponse: "Mon silence est un silence. N'en faites pas un produit.",
        loyaute: 4,
        suspicion: -4,
      },
      {
        label: "Doute, c'est bon signe.",
        reponse: "...C'est la première chose honnête que vous dites cette semaine.",
        loyaute: 9,
        suspicion: -6,
      },
      {
        label: "Applaudis, la prochaine fois.",
        reponse: "Non.",
        loyaute: -8,
        suspicion: 6,
      },
    ],
    reactionPromotion: "Elle accepte le titre. Elle précise qu'elle ne portera pas la cape.",
    reactionExclusion: "Elle sort sans un mot. Trois adeptes regardent longtemps la porte.",
  },
  {
    id: "fanatique",
    nom: "Le Fanatique",
    description: "Trop motivé. Vraiment trop. Il fait peur aux nouveaux.",
    base: { loyaute: [90, 100], suspicion: [0, 5], influence: [30, 60] },
    accroches: [
      "Gourou ! J'ai gravé votre visage sur le portail. Au chalumeau. Ça rayonne.",
      "Dites un mot et je jeûne. Dites deux mots et je jeûne deux fois.",
      "Les incroyants du village me regardent bizarrement. Je peux m'en occuper ?",
    ],
    choixDialogue: [
      {
        label: "Ta ferveur m'honore.",
        reponse: "JE LE SAVAIS. Je vais le crier au champ. LE CHAMP DOIT SAVOIR.",
        loyaute: 5,
        suspicion: 0,
      },
      {
        label: "Calme-toi. C'est un ordre doux.",
        reponse: "Je serai calme avec INTENSITÉ, Gourou.",
        loyaute: 2,
        suspicion: 0,
      },
      {
        label: "Ne t'occupe de personne.",
        reponse: "Compris. Je les surveillerai seulement des yeux. Les deux yeux.",
        loyaute: 0,
        suspicion: 2,
      },
    ],
    reactionPromotion: "Il se rase la tête sur-le-champ. Personne ne le lui avait demandé.",
    reactionExclusion: "Il campe devant le portail quatre jours. Il appelle ça « l'exil fidèle ».",
  },
  {
    id: "mystique",
    nom: "La Mystique Autoproclamée",
    description: "A des visions. Beaucoup. Souvent en concurrence avec les vôtres.",
    base: { loyaute: [50, 70], suspicion: [10, 30], influence: [50, 70] },
    accroches: [
      "J'ai eu une vision, Gourou. Vous y étiez plus petit que dans la vraie vie. Curieux, non ?",
      "Les esprits m'ont parlé du dîner de demain. Ce sera des lentilles. Vérifiez, vous verrez.",
      "Mon troisième œil me gratte. C'est un présage. Ou du pollen.",
    ],
    choixDialogue: [
      {
        label: "Tes visions complètent les miennes.",
        reponse: "« Complètent ». Intéressant. Je note que vous reconnaissez mes dons.",
        loyaute: 6,
        suspicion: 0,
      },
      {
        label: "Il n'y a qu'un seul canal : moi.",
        reponse: "Bien sûr, bien sûr. Les esprits seront déçus, mais je transmettrai.",
        loyaute: -5,
        suspicion: 4,
      },
      {
        label: "Raconte-moi ta vision en détail.",
        reponse: "Enfin quelqu'un qui écoute ! Alors : d'abord, une odeur de raclette...",
        loyaute: 8,
        suspicion: -3,
      },
    ],
    reactionPromotion: "Elle annonce l'avoir « vu venir depuis mars ». Elle distribue des attestations.",
    reactionExclusion: "Elle maudit le potager en partant. Les courgettes semblent tenir le coup.",
  },
  {
    id: "coach",
    nom: "Le Coach Reconverti",
    description: "Ex-coach en développement personnel. Parle en slides invisibles.",
    base: { loyaute: [40, 60], suspicion: [15, 35], influence: [40, 65] },
    accroches: [
      "Gourou, votre storytelling est top, mais on peut optimiser le funnel de conversion des âmes.",
      "J'ai fait un SWOT de la secte. Nos menaces : la police. Nos forces : vous, à 70%.",
      "On devrait pivoter vers un modèle d'abonnement spirituel. Freemium : l'enfer. Premium : le reste.",
    ],
    choixDialogue: [
      {
        label: "Développe ton idée de funnel.",
        reponse: "Alors : l'adepte entre par la curiosité, il reste par la soupe, il donne par l'amour. Simple. Scalable.",
        loyaute: 7,
        suspicion: -2,
      },
      {
        label: "On ne « pivote » pas une révélation.",
        reponse: "Reçu. Je reformule : on itère sur le dogme. C'est différent.",
        loyaute: 1,
        suspicion: 1,
      },
      {
        label: "Tu parles trop. Écoute le silence.",
        reponse: "Le silence... comme levier d'engagement. Vous êtes bon. Vous êtes très bon.",
        loyaute: 3,
        suspicion: 0,
      },
    ],
    reactionPromotion: "Il ajoute « C-level » à son titre. Personne n'ose demander ce que ça veut dire.",
    reactionExclusion: "Il part en disant que c'était « une opportunité d'apprentissage ». Il pleure un peu.",
  },
  {
    id: "grandmere",
    nom: "La Grand-Mère Adoptive",
    description: "Nourrit tout le monde. Tricote des étuis de gourde. Intouchable.",
    base: { loyaute: [60, 80], suspicion: [10, 25], influence: [70, 90] },
    accroches: [
      "Mon petit, vous avez encore sauté le goûter. Un gourou, ça se nourrit.",
      "J'ai fait des crêpes pour le rituel de ce soir. Et des sans gluten pour l'Invisible.",
      "Le petit nouveau, là. Il ne finit jamais son assiette. Ce n'est pas normal, un garçon comme ça.",
    ],
    choixDialogue: [
      {
        label: "Vos crêpes sont un sacrement.",
        reponse: "Oh, arrêtez. ...Non, continuez un peu.",
        loyaute: 6,
        suspicion: -2,
      },
      {
        label: "Que savez-vous sur le petit nouveau ?",
        reponse: "Il dit qu'il était fleuriste. Mais il tient son sécateur comme un stylo, ce petit.",
        loyaute: 2,
        suspicion: -1,
      },
      {
        label: "Reposez-vous, vous en faites trop.",
        reponse: "Me reposer ? Et qui nourrira l'Éveil, mon petit ? Vos prophéties ? Elles sont creuses, sans beurre.",
        loyaute: 3,
        suspicion: 0,
      },
    ],
    reactionPromotion: "Elle accepte, à condition de garder la main sur les confitures. Tout le monde approuve.",
    reactionExclusion: "Le camp entier se fige. Quelqu'un lâche une assiette. Vous entendez le vent.",
  },
  {
    id: "sociologue",
    nom: "L'Étudiant en Sociologie",
    description: "« Je suis juste là pour ma thèse. » Prend des notes. Beaucoup de notes.",
    base: { loyaute: [20, 40], suspicion: [50, 70], influence: [20, 40] },
    accroches: [
      "Fascinant. Vous venez d'utiliser un marqueur d'autorité charismatique de type wébérien. Je note.",
      "C'est pour ma thèse : vous diriez que vous êtes un gourou « hégémonique » ou « post-moderne » ?",
      "Ne faites pas attention à moi. Je suis en observation participante. Le mot-clé, c'est participante.",
    ],
    choixDialogue: [
      {
        label: "Cite-moi correctement dans ta thèse.",
        reponse: "Avec numéro de page et tout. Vous serez ma meilleure note de bas de page.",
        loyaute: 5,
        suspicion: -3,
      },
      {
        label: "Ta thèse parle de nous ou de toi ?",
        reponse: "...C'est une excellente question méthodologique. Je vais me resservir de la soupe.",
        loyaute: 6,
        suspicion: -4,
      },
      {
        label: "Arrête de prendre des notes.",
        reponse: "D'accord, d'accord. Je mémoriserai. C'est pire, non ?",
        loyaute: -3,
        suspicion: 5,
      },
    ],
    reactionPromotion: "Il accepte « pour la science ». Sa thèse vient de gagner un chapitre.",
    reactionExclusion: "Il part avec trois carnets pleins. Vous espérez que la soutenance est privée.",
  },
];

export function getArchetype(id: string): Archetype {
  const a = ARCHETYPES.find((x) => x.id === id);
  if (!a) throw new Error(`Archétype inconnu : ${id}`);
  return a;
}
