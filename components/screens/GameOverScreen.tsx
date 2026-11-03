"use client";

import { useGameStore } from "@/lib/store/gameStore";

const SOUS_TITRES: Record<string, string> = {
  effondrement: "Fin de partie — la foi, ça s'entretient",
  raid: "Fin de partie — les gyrophares ont gagné",
  "culte-eternel": "Victoire — si on peut appeler ça comme ça",
  redemption: "Fin alternative — la seule sortie honorable",
  legende: "Fin de partie — vous étiez le dernier fidèle",
};

export default function GameOverScreen() {
  const fin = useGameStore((s) => s.fin);
  const jour = useGameStore((s) => s.jour);
  const nouvellePartie = useGameStore((s) => s.nouvellePartie);
  const retourTitre = useGameStore((s) => s.retourTitre);

  if (!fin) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="panneau max-w-2xl rounded-lg p-10 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-encre-douce">
          {SOUS_TITRES[fin.type]} · jour {jour}
        </p>
        <h1 className="font-display text-5xl font-black text-accent">
          {fin.titre}
        </h1>
        <p className="mt-8 text-left font-display text-lg leading-relaxed text-encre">
          {fin.texte}
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={nouvellePartie}
          className="rounded border border-accent bg-accent/10 px-8 py-3 uppercase tracking-widest text-accent transition hover:bg-accent/25"
        >
          Refonder ailleurs
        </button>
        <button
          onClick={retourTitre}
          className="rounded border border-bordure px-8 py-3 uppercase tracking-widest text-encre-douce transition hover:border-accent hover:text-accent"
        >
          Menu
        </button>
      </div>
    </main>
  );
}
