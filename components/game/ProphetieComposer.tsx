"use client";

// La caisse du prophète : on choisit quoi annoncer, et pour quand.
// Gros boost immédiat = grosse dette au jour J. Le crédit spirituel.

import { useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { PROPHETIES } from "@/data/propheties";
import { pickN } from "@/lib/rng";

const ECHEANCES = [
  { jours: 3, label: "dans 3 jours", ton: "audacieux" },
  { jours: 5, label: "dans 5 jours", ton: "raisonnable" },
  { jours: 8, label: "dans 8 jours", ton: "prudent" },
];

export default function ProphetieComposer() {
  const annoncerProphetie = useGameStore((s) => s.annoncerProphetie);
  const fermerCaisse = useGameStore((s) => s.fermerCaisse);
  const [propositions] = useState(() => pickN(PROPHETIES, 3));
  const [choisie, setChoisie] = useState<string | null>(null);
  const [echeance, setEcheance] = useState<number | null>(null);

  const pret = choisie !== null && echeance !== null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-6">
      <div className="panneau w-full max-w-xl rounded-2xl p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-encre-douce">
          La caisse du prophète
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-accent">
          Annoncer l'avenir
        </h2>
        <p className="mt-1 text-sm italic text-encre-douce">
          Plus c'est grandiose et proche, plus le camp s'enflamme aujourd'hui.
          Et plus la chute serait rude si l'avenir ne coopère pas.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {propositions.map((p) => (
            <button
              key={p.id}
              onClick={() => setChoisie(p.id)}
              className={`rounded border p-3 text-left transition ${
                choisie === p.id
                  ? "border-accent bg-accent/10"
                  : "border-bordure hover:border-accent/60"
              }`}
            >
              <p className="font-display text-base font-semibold">
                {p.titre}{" "}
                <span className="text-accent">{"✦".repeat(p.grandiose)}</span>
              </p>
              <p className="mt-0.5 text-xs italic text-encre-douce">
                « {p.annonce} »
              </p>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          {ECHEANCES.map((e) => (
            <button
              key={e.jours}
              onClick={() => setEcheance(e.jours)}
              className={`flex-1 rounded border px-3 py-2 text-xs uppercase tracking-wider transition ${
                echeance === e.jours
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-bordure text-encre-douce hover:border-accent/60"
              }`}
            >
              {e.label}
              <span className="block text-[0.6rem] normal-case italic opacity-70">
                {e.ton}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={fermerCaisse}
            className="rounded border border-bordure px-4 py-2.5 text-xs uppercase tracking-wider text-encre-douce transition hover:border-accent hover:text-accent"
          >
            Redescendre
          </button>
          <button
            disabled={!pret}
            onClick={() => pret && annoncerProphetie(choisie!, echeance!)}
            className="flex-1 rounded border border-accent bg-accent/10 py-2.5 text-sm uppercase tracking-widest text-accent transition hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Monter sur la caisse et l'annoncer
          </button>
        </div>
      </div>
    </div>
  );
}
