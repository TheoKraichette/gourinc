// Les miracles du Micro-Ondes Sacré. Débloqués par paliers de Dérive —
// plus le gourou croit à ses mensonges, plus ils fonctionnent.
// Chaque usage enfonce un peu plus. C'est le contrat.

import type { Miracle } from "@/lib/types";

export const MIRACLES: Miracle[] = [
  {
    id: "quete",
    nom: "La Quête Miraculeuse",
    description:
      "La caisse commune débordera. Personne ne demandera d'où. Croire dispense de compter.",
    seuil: 20,
    cout: 6,
  },
  {
    id: "signe",
    nom: "Le Signe",
    description:
      "Vous ferez un geste, là, devant tout le monde. Personne ne saura le décrire, mais tout le monde l'aura vu. La ferveur reprendra.",
    seuil: 40,
    cout: 8,
  },
  {
    id: "dedoublement",
    nom: "Le Dédoublement",
    description:
      "Le temps se pliera. Vous aurez toujours été à deux endroits aujourd'hui. Deux gestes de plus.",
    seuil: 60,
    cout: 10,
  },
  {
    id: "grand-oubli",
    nom: "Le Grand Oubli",
    description:
      "Les soupçons, les rancunes, les questions sur la caisse : effacés. Le camp se réveillera léger. Léger et lisse.",
    seuil: 75,
    cout: 12,
  },
];
