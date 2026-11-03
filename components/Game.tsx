"use client";

// Racine du jeu : bascule entre écrans et applique la palette liée à la Dérive.

import { useEffect } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { paletteDerive } from "@/lib/palette";
import TitleScreen from "@/components/screens/TitleScreen";
import GameOverScreen from "@/components/screens/GameOverScreen";
import GameScreen from "@/components/game/GameScreen";

export default function Game() {
  const ecran = useGameStore((s) => s.ecran);
  const derive = useGameStore((s) => s.stats.derive);
  const initialiser = useGameStore((s) => s.initialiser);

  useEffect(() => {
    initialiser();
  }, [initialiser]);

  // La Dérive teinte tout le jeu via les variables CSS globales.
  useEffect(() => {
    const p = paletteDerive(ecran === "jeu" ? derive : 0);
    const r = document.documentElement.style;
    r.setProperty("--c-bg", p.bg);
    r.setProperty("--c-panel", p.panel);
    r.setProperty("--c-panel-bord", p.panelBord);
    r.setProperty("--c-accent", p.accent);
    r.setProperty("--c-texte", p.texte);
    r.setProperty("--c-texte-doux", p.texteDoux);
  }, [derive, ecran]);

  if (ecran === "titre") return <TitleScreen />;
  if (ecran === "fin") return <GameOverScreen />;
  return <GameScreen />;
}
