// Générateurs de noms — le nom de la secte donne le ton de toute la partie.

import { pick } from "@/lib/rng";

const PREFIXES_SECTE = [
  "L'Église",
  "Le Temple",
  "La Confrérie",
  "L'Ordre Sacré",
  "Le Cercle",
  "La Communauté Éveillée",
  "Les Enfants",
  "La Fraternité",
];

const SUFFIXES_SECTE = [
  "de la Sieste Cosmique",
  "du Tupperware Éternel",
  "du Micro-Ondes Révélé",
  "de la Photocopieuse Divine",
  "du Wifi Universel",
  "de l'Abonnement Perpétuel",
  "du Gluten Invisible",
  "du Rond-Point Originel",
  "de la Raclette Ascensionnelle",
  "du Lundi Aboli",
  "de la Cinquième Lessive",
  "du Compost Intérieur",
];

export function genererNomSecte(): string {
  return `${pick(PREFIXES_SECTE)} ${pick(SUFFIXES_SECTE)}`;
}

const PRENOMS = [
  "Bernard",
  "Georgette",
  "Kevin",
  "Monique",
  "Jean-Loup",
  "Sylvie",
  "Patrick",
  "Chantal",
  "Didier",
  "Roselyne",
  "Thierry",
  "Micheline",
  "Gérard",
  "Cassandre",
  "Norbert",
  "Léa",
  "Maurice",
  "Solange",
  "Fabrice",
  "Odile",
  "Régis",
  "Pénélope",
  "Gilbert",
  "Anaïs",
  "Marcel",
  "Brigitte",
  "Ludovic",
  "Huguette",
];

export function genererNomAdepte(dejaPris: string[]): string {
  const libres = PRENOMS.filter((p) => !dejaPris.includes(p));
  if (libres.length === 0) {
    // Plus de prénoms : on numérote, c'est très sectaire comme pratique.
    return `${pick(PRENOMS)} II`;
  }
  return pick(libres);
}
