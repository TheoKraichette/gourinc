// Vérification des conditions de fin de partie.

import type { Adepte, FinInfo, Stats } from "@/lib/types";
import { FINS } from "@/data/fins";

export const JOUR_VICTOIRE = 60;

export function verifierFin(
  stats: Stats,
  adeptes: Adepte[],
  jour: number,
  nomSecte: string
): FinInfo | null {
  const construire = (type: keyof typeof FINS): FinInfo => ({
    type,
    titre: FINS[type].titre,
    texte: FINS[type].texte.replace(/\{SECTE\}/g, nomSecte),
  });

  // La légende d'abord : c'est le twist central, il prime sur tout.
  if (stats.derive >= 100) return construire("legende");
  if (stats.reputation <= 0) return construire("raid");
  if (stats.ferveur <= 0 || adeptes.length === 0) return construire("effondrement");
  if (jour >= JOUR_VICTOIRE && stats.ferveur > 50) return construire("culte-eternel");
  return null;
}

// La Rédemption est volontaire : dissoudre la secte, si on est resté à peu près sain.
export function peutDissoudre(stats: Stats, jour: number): boolean {
  return jour >= 15 && stats.derive < 25;
}

export function finRedemption(nomSecte: string): FinInfo {
  return {
    type: "redemption",
    titre: FINS.redemption.titre,
    texte: FINS.redemption.texte.replace(/\{SECTE\}/g, nomSecte),
  };
}
