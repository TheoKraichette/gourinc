// Sauvegarde locale — un seul slot, localStorage.

import type {
  Adepte,
  EntreeJournal,
  InfiltreEtat,
  PropheteEtat,
  ResolutionProphetie,
  Stats,
} from "@/lib/types";

const CLE_SAUVEGARDE = "gourinc-save-v1";

export interface Sauvegarde {
  version: 1;
  nomSecte: string;
  jour: number;
  stats: Stats;
  adeptes: Adepte[];
  journal: EntreeJournal[];
  infiltre: InfiltreEtat | null;
  prochainInfiltreJour: number;
  evenementsVus: string[];
  prophetie: PropheteEtat | null;
  resolutionProphetie: ResolutionProphetie | null;
  miraclesDebloques: string[];
}

export function sauvegarder(data: Sauvegarde): void {
  try {
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(data));
  } catch {
    // stockage plein ou bloqué — le culte vivra sans archives
  }
}

export function chargerSauvegarde(): Sauvegarde | null {
  try {
    const brut = localStorage.getItem(CLE_SAUVEGARDE);
    if (!brut) return null;
    const data = JSON.parse(brut) as Sauvegarde;
    if (data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function effacerSauvegarde(): void {
  try {
    localStorage.removeItem(CLE_SAUVEGARDE);
  } catch {
    // tant pis
  }
}
