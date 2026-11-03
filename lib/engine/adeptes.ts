// Création et lecture des adeptes.

import type { Adepte, EtatVisible } from "@/lib/types";
import { ARCHETYPES, getArchetype } from "@/data/archetypes";
import { genererNomAdepte } from "@/data/names";
import { genId, pick, randInt } from "@/lib/rng";

export function creerAdepte(
  adeptesExistants: Adepte[],
  jour: number,
  options?: { estInfiltre?: boolean; archetypeId?: string }
): Adepte {
  const archetype = options?.archetypeId
    ? getArchetype(options.archetypeId)
    : pick(ARCHETYPES);
  const nom = genererNomAdepte(adeptesExistants.map((a) => a.nom));
  const [lMin, lMax] = archetype.base.loyaute;
  const [sMin, sMax] = archetype.base.suspicion;
  const [iMin, iMax] = archetype.base.influence;
  return {
    id: genId("adepte"),
    nom,
    archetypeId: archetype.id,
    loyaute: randInt(lMin, lMax),
    suspicion: randInt(sMin, sMax),
    influence: randInt(iMin, iMax),
    jourArrivee: jour,
    promu: false,
    estInfiltre: options?.estInfiltre ?? false,
    x: 0.2 + Math.random() * 0.6,
    y: 0.25 + Math.random() * 0.55,
  };
}

// L'état affiché au joueur — l'infiltré imite un état normal.
export function etatVisible(adepte: Adepte): EtatVisible {
  if (adepte.loyaute >= 60) return "fervent";
  if (adepte.loyaute >= 30) return "douteux";
  return "partant";
}

export const LIBELLE_ETAT: Record<EtatVisible, string> = {
  fervent: "Fervent",
  douteux: "Douteux",
  partant: "Sur le point de partir",
};
