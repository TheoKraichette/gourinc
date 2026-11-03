"use client";

// Le menu du Micro-Ondes Sacré. Les miracles se débloquent avec la Dérive —
// le joueur découvre son propre état mental en voyant ce qui devient possible.

import { useGameStore } from "@/lib/store/gameStore";
import { MIRACLES } from "@/data/miracles";

export default function MiracleMenu() {
  const miraclesDebloques = useGameStore((s) => s.miraclesDebloques);
  const miracleUtilise = useGameStore((s) => s.miracleUtilise);
  const derive = useGameStore((s) => s.stats.derive);
  const lancerMiracle = useGameStore((s) => s.lancerMiracle);
  const fermerAutel = useGameStore((s) => s.fermerAutel);

  const disponibles = MIRACLES.filter(
    (m) => miraclesDebloques.includes(m.id) || derive >= m.seuil
  );
  const verrouilles = MIRACLES.length - disponibles.length;

  return (
    <div className="absolute left-[4%] top-[38%] z-30 w-80 -translate-y-1/2">
      <div className="panneau rounded-xl p-4 shadow-2xl">
        <div className="flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-encre-douce">
            Le Micro-Ondes Sacré
          </p>
          <button
            onClick={fermerAutel}
            className="text-xs text-encre-douce transition hover:text-accent"
          >
            fermer ✕
          </button>
        </div>

        {disponibles.length === 0 ? (
          <p className="mt-3 font-display text-sm italic text-encre-douce">
            Vous posez la main sur l'Appareil. Il fait « bip ». Rien d'autre.
            Pour l'instant, ce n'est qu'un micro-ondes. Pour l'instant.
          </p>
        ) : miracleUtilise ? (
          <p className="mt-3 font-display text-sm italic text-encre-douce">
            L'Appareil est tiède et silencieux. Il doit refroidir jusqu'à
            demain. Vous comprenez ça mieux que personne.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {disponibles.map((m) => (
              <button
                key={m.id}
                onClick={() => lancerMiracle(m.id)}
                className="rounded border border-accent/40 bg-accent/5 p-3 text-left transition hover:border-accent hover:bg-accent/15"
              >
                <p className="font-display text-sm font-semibold text-accent">
                  {m.nom}
                </p>
                <p className="mt-0.5 text-xs italic leading-snug text-encre-douce">
                  {m.description}
                </p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-wider text-encre-douce/60">
                  Prix : une part de vous
                </p>
              </button>
            ))}
          </div>
        )}

        {verrouilles > 0 && disponibles.length > 0 && (
          <p className="mt-3 text-[0.65rem] italic text-encre-douce/60">
            L'Appareil bourdonne — {verrouilles} porte
            {verrouilles > 1 ? "s" : ""} encore fermée
            {verrouilles > 1 ? "s" : ""}. Il faudra croire plus fort.
          </p>
        )}
      </div>
    </div>
  );
}
