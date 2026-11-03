"use client";

import { useGameStore } from "@/lib/store/gameStore";

export default function TitleScreen() {
  const nouvellePartie = useGameStore((s) => s.nouvellePartie);
  const chargerPartie = useGameStore((s) => s.chargerPartie);
  const aSauvegarde = useGameStore((s) => s.aSauvegarde);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-8 text-center">
      <div>
        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-encre-douce">
          Simulateur de dérive spirituelle
        </p>
        <h1 className="font-display text-7xl font-black tracking-tight text-accent sm:text-8xl">
          Gourou Inc.
        </h1>
        <p className="mx-auto mt-6 max-w-md font-display text-xl italic text-encre-douce">
          Fondez une secte. Gérez ses fidèles. Essayez de ne pas croire vos
          propres mensonges.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={nouvellePartie}
          className="rounded border border-accent bg-accent/10 px-10 py-3 font-medium uppercase tracking-widest text-accent transition hover:bg-accent/25"
        >
          Fonder une secte
        </button>
        {aSauvegarde && (
          <button
            onClick={chargerPartie}
            className="rounded border border-bordure px-10 py-3 uppercase tracking-widest text-encre-douce transition hover:border-accent hover:text-accent"
          >
            Reprendre le culte
          </button>
        )}
      </div>

      <p className="max-w-sm text-xs leading-relaxed text-encre-douce/60">
        Toute ressemblance avec un mouvement spirituel existant serait un
        miracle — et nous ne croyons pas aux miracles. Enfin, pas encore.
      </p>
    </main>
  );
}
