"use client";

// Le sermon du matin se compose : cinq Mots Sacrés tirés au sort,
// on en choisit deux, le prêche s'assemble. Certaines paires résonnent.

import { useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";

export default function SermonComposer() {
  const mots = useGameStore((s) => s.motsDuJour);
  const composerSermon = useGameStore((s) => s.composerSermon);
  const [choisis, setChoisis] = useState<string[]>([]);

  const basculer = (id: string) => {
    setChoisis((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id]; // le plus ancien cède sa place
      return [...prev, id];
    });
  };

  const pret = choisis.length === 2;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center p-5">
      <div className="panneau w-full max-w-2xl rounded-2xl p-5 shadow-2xl">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-encre-douce">
          Sermon du matin — le camp attend, le feu crépite
        </p>
        <p className="mt-1 text-center font-display text-lg italic text-encre">
          Choisissez deux Mots Sacrés et montez sur la caisse.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {mots.map((mot) => {
            const actif = choisis.includes(mot.id);
            return (
              <button
                key={mot.id}
                onClick={() => basculer(mot.id)}
                className={`rounded-full border px-5 py-2.5 font-display text-lg transition ${
                  actif
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_18px_rgba(217,164,65,0.25)]"
                    : "border-bordure text-encre hover:border-accent/60"
                }`}
              >
                {mot.mot}
              </button>
            );
          })}
        </div>

        <button
          disabled={!pret}
          onClick={() => pret && composerSermon(choisis[0], choisis[1])}
          className="mt-5 w-full rounded border border-accent bg-accent/10 py-3 text-sm uppercase tracking-widest text-accent transition hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {pret
            ? "Prêcher →"
            : `Encore ${2 - choisis.length} mot${choisis.length === 1 ? "" : "s"} à choisir`}
        </button>
        <p className="mt-2 text-center text-[0.65rem] italic text-encre-douce/70">
          On raconte que certains mots, ensemble, résonnent plus fort que la
          somme de leurs échos.
        </p>
      </div>
    </div>
  );
}
