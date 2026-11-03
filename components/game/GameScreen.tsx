"use client";

// Plus de panneau latéral : le camp occupe tout l'écran, l'UI vient à lui.
// - phase sermon : le composeur de Mots Sacrés en bas
// - phase gestion : gestes sur les adeptes + cloche du soir
// - phase événement : bulle ancrée dans la scène (le visiteur arrive à pied)
// - phase rapport : le carnet du gourou en plein écran

import { useEffect, useState } from "react";
import { ACTIONS_PAR_JOUR, useGameStore } from "@/lib/store/gameStore";
import { peutDissoudre } from "@/lib/engine/fins";
import { getProphetie } from "@/data/propheties";
import CampView from "./CampView";
import SermonComposer from "./SermonComposer";
import CarnetNuit from "./CarnetNuit";
import ProphetieComposer from "./ProphetieComposer";
import ProphetieResolution from "./ProphetieResolution";
import MiracleMenu from "./MiracleMenu";

export default function GameScreen() {
  const nomSecte = useGameStore((s) => s.nomSecte);
  const jour = useGameStore((s) => s.jour);
  const phase = useGameStore((s) => s.phase);
  const stats = useGameStore((s) => s.stats);
  const actionsRestantes = useGameStore((s) => s.actionsRestantes);
  const journal = useGameStore((s) => s.journal);
  const evenementDuJour = useGameStore((s) => s.evenementDuJour);
  const choisirEvenement = useGameStore((s) => s.choisirEvenement);
  const terminerJournee = useGameStore((s) => s.terminerJournee);
  const passerAEvenement = useGameStore((s) => s.passerAEvenement);
  const dissoudre = useGameStore((s) => s.dissoudre);
  const prophetie = useGameStore((s) => s.prophetie);
  const resolutionProphetie = useGameStore((s) => s.resolutionProphetie);
  const caisseOuverte = useGameStore((s) => s.caisseOuverte);
  const autelOuvert = useGameStore((s) => s.autelOuvert);

  const [carnetOuvert, setCarnetOuvert] = useState(false);
  const [confirmeDissolution, setConfirmeDissolution] = useState(false);
  const [visiteurArrive, setVisiteurArrive] = useState(false);

  // Si l'événement a un visiteur, la bulle attend qu'il ait fait le chemin.
  const aVisiteur = Boolean(evenementDuJour?.evenement.visiteur);
  useEffect(() => {
    if (phase !== "evenement") {
      setVisiteurArrive(false);
      return;
    }
    if (!aVisiteur) {
      setVisiteurArrive(true);
      return;
    }
    const timer = setTimeout(() => setVisiteurArrive(true), 1700);
    return () => clearTimeout(timer);
  }, [phase, aVisiteur, evenementDuJour?.evenement.id]);

  useEffect(() => setConfirmeDissolution(false), [carnetOuvert]);

  const dernieresEntrees = journal.slice(-3);

  // À haute Dérive, le carnet ment. L'écart est déterministe par jour :
  // les chiffres semblent stables, mais faux. Le décor, lui, dit vrai.
  const carnetMenteur = stats.derive >= 70;
  const distordre = (v: number, i: number) => {
    if (!carnetMenteur) return Math.round(v);
    const amplitude = (stats.derive - 60) / 2.5;
    return Math.max(0, Math.round(v + Math.sin(jour * 7 + i * 3.7) * amplitude));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <CampView />

      {/* Bandeau discret : titre, jour, actions restantes en encens */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-start justify-between p-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-accent drop-shadow">
            {nomSecte}
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-encre-douce">
            Jour {jour}
          </p>
        </div>
        {prophetie && (
          <div className="rounded-full border border-accent/40 bg-black/40 px-4 py-1.5 text-center">
            <span className="text-xs text-accent">
              ☄ {getProphetie(prophetie.prophetieId).titre}
            </span>
            <span className="ml-2 text-[0.65rem] uppercase tracking-wider text-encre-douce">
              {prophetie.jourEcheance - jour <= 0
                ? "c'est aujourd'hui"
                : `J-${prophetie.jourEcheance - jour}`}
            </span>
          </div>
        )}
        {phase === "gestion" && (
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            {Array.from({ length: Math.max(ACTIONS_PAR_JOUR, actionsRestantes) }).map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${
                  i < actionsRestantes ? "bg-accent" : "bg-encre-douce/25"
                }`}
                title="Actions du jour"
              />
            ))}
            <span className="ml-1 text-[0.6rem] uppercase tracking-wider text-encre-douce">
              gestes
            </span>
          </div>
        )}
      </div>

      {/* Chronique en filigrane, bas gauche */}
      <div className="pointer-events-none absolute bottom-16 left-4 z-10 w-80">
        {dernieresEntrees.map((e, i) => (
          <p
            key={`${e.jour}-${i}`}
            className={`mb-1 text-xs leading-snug drop-shadow ${
              e.type === "alerte"
                ? "text-red-300"
                : e.type === "indice"
                  ? "text-accent"
                  : e.type === "pensee"
                    ? "font-display italic text-encre-douce"
                    : "text-encre-douce/80"
            }`}
            style={{ opacity: 0.45 + i * 0.25 }}
          >
            {e.type === "indice" && "⚿ "}
            {e.texte}
          </p>
        ))}
      </div>

      {/* Aide gestuelle, une ligne, bas centre */}
      {phase === "gestion" && (
        <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs text-encre-douce/70">
          Cliquez un fidèle pour lui parler — glissez-le vers un lieu pour agir
          sur lui.
        </p>
      )}

      {/* Le matin : d'abord la prophétie arrivée à échéance, sinon le sermon */}
      {phase === "sermon" &&
        (resolutionProphetie ? <ProphetieResolution /> : <SermonComposer />)}

      {/* La caisse du prophète et le menu des miracles */}
      {caisseOuverte && <ProphetieComposer />}
      {autelOuvert && <MiracleMenu />}

      {/* La cloche du soir */}
      {phase === "gestion" && (
        <button
          onClick={passerAEvenement}
          className="absolute bottom-4 right-4 z-10 rounded-full border border-accent bg-black/50 px-6 py-3 text-sm uppercase tracking-widest text-accent shadow-lg transition hover:bg-accent/20"
        >
          🔔 Sonner le soir
        </button>
      )}

      {/* Le carnet de comptes (les chiffres, pour qui y tient) */}
      <button
        onClick={() => setCarnetOuvert((o) => !o)}
        className="absolute bottom-4 left-4 z-20 rounded-full border border-bordure bg-black/50 px-4 py-2 text-xs uppercase tracking-widest text-encre-douce transition hover:border-accent hover:text-accent"
      >
        {carnetOuvert ? "Fermer le carnet" : "📖 Carnet"}
      </button>
      {carnetOuvert && (
        <div className="panneau absolute bottom-16 left-4 z-20 w-72 rounded-xl p-4 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-encre-douce">
            Les comptes du culte
          </p>
          <div className="mt-3 flex flex-col gap-2 font-display text-sm">
            {(
              [
                ["Ferveur", stats.ferveur, stats.ferveur < 25],
                ["Paranoïa", stats.paranoia, stats.paranoia > 65],
                ["Réputation", stats.reputation, stats.reputation < 25],
                ["Ressources", stats.ressources, stats.ressources < 15],
              ] as [string, number, boolean][]
            ).map(([label, valeur, alerte], i) => (
              <div key={label} className="flex items-baseline justify-between">
                <span className="text-encre-douce">{label}</span>
                <span className={`text-base ${alerte ? "text-red-400" : "text-encre"}`}>
                  {distordre(valeur, i)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.65rem] italic leading-snug text-encre-douce/70">
            {carnetMenteur
              ? "Relu ce matin : tout est exact. Tout a toujours été exact. Inutile de vérifier ailleurs."
              : "Tenu à la bougie. Certaines colonnes n'existent dans aucun plan comptable connu."}
          </p>
          {peutDissoudre(stats, jour) && (
            <button
              onClick={() => {
                if (confirmeDissolution) dissoudre();
                else setConfirmeDissolution(true);
              }}
              className="mt-3 w-full rounded border border-bordure py-2 text-[0.65rem] uppercase tracking-widest text-encre-douce transition hover:border-encre hover:text-encre"
            >
              {confirmeDissolution
                ? "Tout leur avouer, vraiment ?"
                : "Dissoudre la secte (l'autre sortie)"}
            </button>
          )}
        </div>
      )}

      {/* La bulle d'événement, ancrée dans la scène */}
      {phase === "evenement" && evenementDuJour && visiteurArrive && (
        <div className="absolute left-1/2 top-[30%] z-20 w-[26rem] -translate-x-1/2">
          <div className="panneau rounded-xl rounded-bl-none p-5 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-encre-douce">
              {evenementDuJour.evenement.titre}
            </p>
            <p className="mt-2 font-display text-base leading-relaxed">
              {evenementDuJour.texteResolu}
            </p>
            {evenementDuJour.reaction === null ? (
              <div className="mt-4 flex flex-col gap-2">
                {evenementDuJour.evenement.choix.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => choisirEvenement(i)}
                    className="rounded border border-bordure p-2.5 text-left text-sm transition hover:border-accent hover:text-accent"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-4 rounded border border-accent/40 bg-accent/5 p-3 font-display text-sm italic leading-relaxed">
                  {evenementDuJour.reaction}
                </p>
                <button
                  onClick={terminerJournee}
                  className="mt-4 w-full rounded border border-accent bg-accent/10 py-2.5 text-sm uppercase tracking-widest text-accent transition hover:bg-accent/25"
                >
                  Laisser la nuit tomber →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Le carnet du gourou, la nuit */}
      {phase === "rapport" && <CarnetNuit />}
    </main>
  );
}
