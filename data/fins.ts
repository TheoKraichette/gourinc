// Textes des fins de partie. {SECTE} est remplacé par le nom de la secte.

import type { TypeFin } from "@/lib/types";

export const FINS: Record<TypeFin, { titre: string; texte: string }> = {
  effondrement: {
    titre: "L'Effondrement",
    texte:
      "Le dernier adepte est parti ce matin, avec la brouette et ce qui restait de confiture. " +
      "Vous prêchez encore un peu, par habitude, devant le feu de camp éteint. " +
      "Le micro-ondes fait « bip » dans le silence. Plus personne ne le salue. " +
      "{SECTE} aura duré ce que durent les rêves un peu tordus : le temps qu'on y croie à plusieurs.",
  },
  raid: {
    titre: "Le Raid",
    texte:
      "6h02. Les gyrophares repeignent les tentes en bleu. C'est presque joli. " +
      "Un gendarme vous tend une couverture de survie — dorée, comme vos ambitions. " +
      "En montant dans le fourgon, vous entendez un adepte demander si le rituel de l'aube est maintenu. " +
      "L'histoire retiendra {SECTE} comme « l'affaire du camping ». Vous auriez préféré autre chose.",
  },
  "culte-eternel": {
    titre: "Le Culte Éternel",
    texte:
      "Soixante jours. Vous avez tenu soixante jours, et la ferveur brûle encore. " +
      "Dix ans plus tard : 4 millions de membres, une application de méditation, un procès en cours dans onze pays. " +
      "{SECTE} a des filiales, un jet, et une gamme de tisanes. " +
      "Parfois, la nuit, vous repensez au petit camp, au feu, à la courgette. C'était mieux avant. Vous le direz dans votre autobiographie, chapitre 12 : « C'était mieux avant » — 24,90 €.",
  },
  redemption: {
    titre: "La Rédemption",
    texte:
      "Un matin comme les autres, vous montez sur la caisse en bois et vous dites la vérité : " +
      "« Je ne suis pas un prophète. Le micro-ondes est un simple micro-ondes. La sieste n'est pas cosmique, elle est juste bien. » " +
      "Silence. Puis la grand-mère hausse les épaules : « On s'en doutait un peu. On reste pour la soupe ? » " +
      "{SECTE} devient une association de quartier. Vous animez l'atelier compost le jeudi. Vous n'avez jamais été aussi heureux.",
  },
  legende: {
    titre: "Le Gourou a cru sa propre légende",
    texte:
      "Vous ne vous souvenez plus d'avoir inventé quoi que ce soit. Tout a toujours été vrai. " +
      "Les adeptes vous regardent avec inquiétude — non, avec dévotion — non, avec inquiétude. Les deux sont pareils maintenant. " +
      "Ce matin, vous avez prêché trois heures. Le camp était vide depuis longtemps, mais les chaises, elles, étaient d'accord. " +
      "Quelque part, un micro-ondes fait « bip ». Vous répondez. {SECTE} n'a plus qu'un seul fidèle, et c'est vous.",
  },
};
