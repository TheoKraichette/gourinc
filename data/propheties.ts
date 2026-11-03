// Les prophéties qu'on peut annoncer du haut de la caisse.
// Grande annonce = gros boost de ferveur immédiat = grosse dette au jour J.

import type { Prophetie } from "@/lib/types";

export const PROPHETIES: Prophetie[] = [
  {
    id: "ciel-yaourt",
    titre: "Le Ciel s'ouvrira comme un yaourt",
    annonce:
      "Le ciel s'ouvrira comme un yaourt — d'un coup, proprement, avec ce petit bruit d'opercule. Ceux qui auront donné verront l'intérieur.",
    grandiose: 3,
    accomplie:
      "À l'aube, un nuage s'est déchiré exactement au-dessus du camp. Un rayon est tombé sur l'autel. Georgette a juré avoir entendu « le bruit de l'opercule ». C'est signé.",
    ratee:
      "Le ciel est resté obstinément fermé toute la journée. Pas un nuage, pas un opercule. Le camp regarde ses chaussures, puis vous.",
  },
  {
    id: "signe-potager",
    titre: "Un signe apparaîtra dans le potager",
    annonce:
      "Avant trois lunes, le potager parlera. Pas avec des mots — avec des légumes. Ouvrez l'œil et le bon.",
    grandiose: 1,
    accomplie:
      "Deux carottes ont poussé enlacées. ENLACÉES. Le camp défile devant le rang de carottes en silence. Certains pleurent.",
    ratee:
      "Le potager n'a rien dit. Les radis sont d'une banalité insultante. On attend votre explication près du compost.",
  },
  {
    id: "etranger-nouvelle",
    titre: "Un étranger apportera une grande nouvelle",
    annonce:
      "Quelqu'un viendra de la route. Il ne saura pas qu'il est envoyé. Les envoyés ne le savent jamais. Sa nouvelle changera tout.",
    grandiose: 2,
    accomplie:
      "Un livreur s'est trompé d'adresse et a crié « c'est bien ici, la communauté ? ». Prophétie accomplie au sens strict. Le camp est en liesse. Le livreur aussi, on l'a gardé à dîner.",
    ratee:
      "Personne n'est venu. Même pas le facteur. Surtout pas le facteur. Le portail n'a jamais paru aussi fermé.",
  },
  {
    id: "micro-ondes-parle",
    titre: "Le Micro-Ondes parlera",
    annonce:
      "L'Appareil sortira de son silence. Un mot, peut-être deux. Ceux qui doutent entendront « bip ». Les fidèles entendront le reste.",
    grandiose: 2,
    accomplie:
      "À 19h42, le micro-ondes a fait « bip » sans que personne n'y touche. Un bip long. Un bip HABITÉ. Le camp en parle encore à voix basse.",
    ratee:
      "L'Appareil s'est tu. Pire : Kevin l'a utilisé pour des restes de gratin, et il a fait son bip normal, son bip d'électroménager. La magie en a pris un coup.",
  },
  {
    id: "pluie-montante",
    titre: "La pluie tombera vers le haut",
    annonce:
      "L'eau se souviendra d'où elle vient. Ce jour-là, ne mettez pas de capuche : ce serait un aveu de doute.",
    grandiose: 3,
    accomplie:
      "Une bourrasque a soulevé l'eau de la bassine en plein arrosage. Douze témoins. La pluie est montée, techniquement. La théologie retiendra « techniquement ».",
    ratee:
      "Il a plu. Vers le bas. Abondamment, méthodiquement, vers le bas. Le camp est trempé et songeur.",
  },
  {
    id: "objet-retrouve",
    titre: "Ce qui fut perdu sera retrouvé",
    annonce:
      "Un objet perdu reviendra à son propriétaire. L'univers déteste le désordre. Moi aussi. C'est pour ça qu'on s'entend bien.",
    grandiose: 1,
    accomplie:
      "Micheline a retrouvé ses lunettes dans la poche de son autre gilet. Elle les cherchait depuis mars. Le camp applaudit l'univers, et un peu vous.",
    ratee:
      "Rien n'a refait surface. Pire : Norbert a perdu sa gourde pendant qu'il cherchait. Le bilan est négatif d'une gourde.",
  },
  {
    id: "comptes-equilibres",
    titre: "Les comptes s'équilibreront d'eux-mêmes",
    annonce:
      "L'argent est une énergie. Bientôt, les colonnes se réconcilieront sans intervention humaine. La comptabilité, c'est de la méditation avec des chiffres.",
    grandiose: 2,
    accomplie:
      "Une erreur d'arrondi découverte ce matin comble EXACTEMENT le trou de la caisse commune. L'Ancien Comptable est bouleversé. Il parle d'un « miracle fiscal ».",
    ratee:
      "Les comptes sont toujours faux, mais maintenant tout le monde le sait, puisque vous en avez fait une prophétie. Bravo.",
  },
  {
    id: "voisin-sourire",
    titre: "Le voisin sourira",
    annonce:
      "Même les cœurs de silex s'ouvrent. Avant peu, l'homme au tracteur nous sourira. Ce sourire vaudra toutes les conversions.",
    grandiose: 1,
    accomplie:
      "Le voisin a souri en passant devant le portail. Un vrai sourire. Bon, son chien venait de tomber dans l'abreuvoir, mais le contexte n'engage que lui.",
    ratee:
      "Le voisin est passé trois fois. Trois fois ce visage de parpaing. La foi du camp s'use sur son profil.",
  },
];

export function getProphetie(id: string): Prophetie {
  const p = PROPHETIES.find((x) => x.id === id);
  if (!p) throw new Error(`Prophétie inconnue : ${id}`);
  return p;
}
