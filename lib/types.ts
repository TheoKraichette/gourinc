// Types partagés du jeu.

export type Phase = "sermon" | "gestion" | "evenement" | "rapport";
export type Ecran = "titre" | "jeu" | "fin";

export type EtatVisible = "fervent" | "douteux" | "partant";
export type TypeInfiltre = "flic" | "journaliste";

export type TypeFin =
  | "effondrement"
  | "raid"
  | "culte-eternel"
  | "redemption"
  | "legende";

export interface Stats {
  ferveur: number; // 0-100, à 0 : la secte se disperse
  paranoia: number; // 0-100
  reputation: number; // 0-100, à 0 : raid
  ressources: number; // argent/nourriture, simple compteur
  derive: number; // 0-100, cachée — santé mentale du gourou
}

export interface Adepte {
  id: string;
  nom: string;
  archetypeId: string;
  loyaute: number; // 0-100, caché
  suspicion: number; // 0-100, caché
  influence: number; // 0-100, caché
  jourArrivee: number;
  promu: boolean;
  estInfiltre: boolean;
  // Position sur la carte du camp (0-1, relatif à la taille du canvas)
  x: number;
  y: number;
}

export interface Effets {
  ferveur?: number;
  paranoia?: number;
  reputation?: number;
  ressources?: number;
  derive?: number;
  loyauteTous?: number;
  recrues?: number;
}

// Le sermon se compose en combinant deux Mots Sacrés.
export interface MotSacre {
  id: string;
  mot: string;
  effets: Effets;
  fragments: string[]; // morceaux de prêche assemblés dans le sermon final
}

export interface ComboSermon {
  mots: [string, string]; // paire de MotSacre.id, ordre indifférent
  titre: string;
  texte: string; // remplace les fragments : la révélation du combo
  bonus: Effets;
}

export interface SermonProduit {
  titre: string;
  texte: string;
}

export interface ChoixEvenement {
  label: string;
  effets: Effets;
  reaction: string; // texte affiché après le choix
}

export interface JeuEvenement {
  id: string;
  titre: string;
  texte: string; // {ADEPTE} est remplacé par un nom d'adepte tiré au sort
  minJour?: number;
  cibleAdepte?: boolean; // l'événement vise un adepte précis
  visiteur?: string; // si présent, un personnage entre par le portail (ex: "le journaliste")
  choix: ChoixEvenement[];
}

export interface ChoixDialogue {
  label: string;
  reponse: string;
  loyaute: number;
  suspicion: number;
}

export interface Archetype {
  id: string;
  nom: string; // "Le Naïf"
  description: string;
  base: {
    loyaute: [number, number];
    suspicion: [number, number];
    influence: [number, number];
  };
  accroches: string[]; // ce qu'il dit quand on lui parle
  choixDialogue: ChoixDialogue[];
  reactionPromotion: string;
  reactionExclusion: string;
}

export interface EntreeJournal {
  jour: number;
  texte: string;
  type: "info" | "indice" | "pensee" | "alerte";
}

// ——— Prophéties : le joueur annonce, le joueur assume ———

export interface Prophetie {
  id: string;
  titre: string; // "Le Ciel s'ouvrira comme un yaourt"
  annonce: string; // le prêche d'annonce, du haut de la caisse
  grandiose: number; // 1-3 : multiplie le boost immédiat et le crash
  accomplie: string; // texte si un signe providentiel la "confirme"
  ratee: string; // texte du matin où rien ne s'est passé
}

export interface PropheteEtat {
  prophetieId: string;
  jourEcheance: number;
  foisDoublee: number; // chaque report alourdit la chute
}

export interface ResolutionProphetie {
  prophetieId: string;
  signe: boolean; // un signe plausible s'est-il produit ?
}

// ——— Miracles : la Dérive comme pouvoir ———

export interface Miracle {
  id: string;
  nom: string;
  description: string; // ce que le joueur lit dans le menu
  seuil: number; // Dérive minimum pour le débloquer (reste acquis ensuite)
  cout: number; // Dérive ajoutée à l'usage — le prix invisible
}

export interface InfiltreEtat {
  adepteId: string;
  type: TypeInfiltre;
  jourArrivee: number;
  indicesRecus: string[]; // indices déjà révélés au joueur
}

export interface EvenementDuJour {
  evenement: JeuEvenement;
  adepteCibleId: string | null;
  texteResolu: string; // texte avec {ADEPTE} remplacé
  reaction: string | null; // null tant que pas résolu
}

export interface DialogueEtat {
  adepteId: string;
  accroche: string;
  choix: ChoixDialogue[];
  reponse: string | null; // réponse affichée après un choix
  interrogatoire: boolean; // au confessionnal : permet l'accusation formelle
}

export interface FinInfo {
  type: TypeFin;
  titre: string;
  texte: string;
}
