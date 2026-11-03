"use client";

// La nuit : le carnet du gourou, en plein écran. Le rapport du soir,
// les rumeurs, et — quand la Dérive travaille — ses pensées à lui.

import { useGameStore } from "@/lib/store/gameStore";

export default function CarnetNuit() {
  const rapport = useGameStore((s) => s.rapportDuSoir);
  const jour = useGameStore((s) => s.jour);
  const journal = useGameStore((s) => s.journal);
  const fin = useGameStore((s) => s.fin);
  const jourSuivant = useGameStore((s) => s.jourSuivant);

  const entreesNuit = journal.filter(
    (e) => e.jour === jour && e.type !== "info"
  );

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[2px]">
      <div className="panneau max-h-full w-full max-w-xl overflow-y-auto rounded-lg p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-encre-douce">
          Carnet du Gourou
        </p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-accent">
          Nuit du jour {jour}
        </h2>

        <div className="mt-6 flex flex-col gap-3 border-l-2 border-bordure pl-4">
          {rapport.map((ligne, i) => (
            <p key={i} className="font-display text-base leading-relaxed">
              {ligne}
            </p>
          ))}
          {entreesNuit.map((e, i) => (
            <p
              key={`n-${i}`}
              className={`font-display text-base leading-relaxed ${
                e.type === "alerte"
                  ? "text-red-300"
                  : e.type === "indice"
                    ? "text-accent"
                    : "italic text-encre-douce"
              }`}
            >
              {e.type === "indice" && "⚿ Rumeur — "}
              {e.texte}
            </p>
          ))}
        </div>

        <button
          onClick={jourSuivant}
          className={`mt-8 w-full rounded border py-3 text-sm uppercase tracking-widest transition ${
            fin
              ? "border-red-400 bg-red-400/10 text-red-300 hover:bg-red-400/20"
              : "border-accent bg-accent/10 text-accent hover:bg-accent/25"
          }`}
        >
          {fin ? "Quelque chose ne va pas..." : `Se lever — jour ${jour + 1} →`}
        </button>
      </div>
    </div>
  );
}
