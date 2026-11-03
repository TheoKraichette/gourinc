"use client";

// Le Jour de la Prophétie. Soit le hasard a fourni un signe (on s'attribue
// le miracle), soit il faut choisir : doubler la mise, avouer, ou — si la
// Dérive est assez avancée — voir ce que personne d'autre ne voit.

import { useGameStore } from "@/lib/store/gameStore";
import { getProphetie } from "@/data/propheties";

export default function ProphetieResolution() {
  const prophetie = useGameStore((s) => s.prophetie);
  const resolution = useGameStore((s) => s.resolutionProphetie);
  const derive = useGameStore((s) => s.stats.derive);
  const resoudreProphetie = useGameStore((s) => s.resoudreProphetie);

  if (!prophetie || !resolution) return null;
  const p = getProphetie(prophetie.prophetieId);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[2px]">
      <div className="panneau w-full max-w-xl rounded-lg p-8 shadow-2xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-encre-douce">
          Le jour de la prophétie
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-semibold text-accent">
          {p.titre}
        </h2>
        {prophetie.foisDoublee > 0 && (
          <p className="mt-1 text-center text-xs italic text-encre-douce">
            (déjà reportée {prophetie.foisDoublee} fois — le camp compte)
          </p>
        )}

        {resolution.signe ? (
          <>
            <p className="mt-6 font-display text-base leading-relaxed">
              {p.accomplie}
            </p>
            <button
              onClick={() => resoudreProphetie("miracle")}
              className="mt-6 w-full rounded border border-accent bg-accent/10 py-3 text-sm uppercase tracking-widest text-accent transition hover:bg-accent/25"
            >
              S'attribuer le miracle →
            </button>
          </>
        ) : (
          <>
            <p className="mt-6 font-display text-base leading-relaxed">
              {p.ratee}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => resoudreProphetie("doubler")}
                className="rounded border border-bordure p-3 text-left text-sm transition hover:border-accent hover:text-accent"
              >
                <span className="font-medium">Doubler la mise.</span>{" "}
                <span className="text-encre-douce">
                  « Erreur de calendrier. Le vrai rendez-vous est dans quatre
                  jours. » Ça passera. Ça passe toujours. Non ?
                </span>
              </button>
              <button
                onClick={() => resoudreProphetie("admettre")}
                className="rounded border border-bordure p-3 text-left text-sm transition hover:border-accent hover:text-accent"
              >
                <span className="font-medium">Admettre l'erreur.</span>{" "}
                <span className="text-encre-douce">
                  La ferveur va morfler, mais votre tête restera à vous.
                </span>
              </button>
              {derive >= 50 && (
                <button
                  onClick={() => resoudreProphetie("halluciner")}
                  className="rounded border border-red-400/50 bg-red-950/20 p-3 text-left text-sm text-red-200 transition hover:border-red-400"
                >
                  <span className="font-display italic">
                    « C'est accompli. Je le VOIS. »
                  </span>{" "}
                  <span className="text-red-200/70">
                    Et le pire, c'est que c'est vrai. Vous le voyez.
                  </span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
