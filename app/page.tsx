"use client";

import dynamic from "next/dynamic";

// Le jeu utilise canvas (Konva) et localStorage : client uniquement.
const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-display text-2xl italic text-encre-douce">
        Le culte se prépare...
      </p>
    </div>
  ),
});

export default function Home() {
  return <Game />;
}
