"use client";

// Le camp EST l'interface. Tout se lit et tout se joue dans la scène :
// - le feu de camp grossit avec la Ferveur
// - des yeux s'ouvrent dans les buissons quand la Paranoïa monte
// - la voiture de gendarmerie se rapproche du portail quand la Réputation chute
// - les caisses de la réserve matérialisent les Ressources
// Les verbes sont des gestes : cliquer un adepte pour lui parler, le GLISSER
// sur l'autel (promotion), le confessionnal (interrogatoire), le potager
// (corvée), le portail (exclusion) ou l'arrêt de bus Perpignan (disparition).

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Text, Group } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useGameStore } from "@/lib/store/gameStore";
import { COULEUR_ETAT, paletteDerive } from "@/lib/palette";
import { etatVisible } from "@/lib/engine/adeptes";
import { getArchetype } from "@/data/archetypes";

interface Marcheur {
  x: number;
  y: number;
  tx: number;
  ty: number;
  pause: number;
}

type ZoneId = "autel" | "confessionnal" | "champ" | "portail" | "bus";

interface Zone {
  id: ZoneId;
  x: number; // centre, relatif
  y: number;
  rayon: number; // rayon de détection, relatif à min(w,h)
  label: string;
}

const ZONES: Zone[] = [
  { id: "autel", x: 0.12, y: 0.42, rayon: 0.1, label: "Promouvoir" },
  { id: "confessionnal", x: 0.88, y: 0.42, rayon: 0.1, label: "Interroger" },
  { id: "champ", x: 0.14, y: 0.85, rayon: 0.12, label: "Corvée" },
  { id: "portail", x: 0.5, y: 0.1, rayon: 0.07, label: "Exclure" },
  { id: "bus", x: 0.86, y: 0.07, rayon: 0.08, label: "Bus de nuit" },
];

const TENTES = [
  { x: 0.3, y: 0.24 },
  { x: 0.7, y: 0.26 },
  { x: 0.32, y: 0.78 },
  { x: 0.68, y: 0.8 },
];

const BUISSONS = [
  { x: 0.04, y: 0.22 },
  { x: 0.05, y: 0.6 },
  { x: 0.95, y: 0.62 },
  { x: 0.96, y: 0.25 },
  { x: 0.25, y: 0.95 },
  { x: 0.55, y: 0.94 },
  { x: 0.85, y: 0.93 },
  { x: 0.45, y: 0.2 },
];

function nouvelleCible(m: Marcheur) {
  m.tx = 0.18 + Math.random() * 0.64;
  m.ty = 0.24 + Math.random() * 0.58;
  m.pause = Math.floor(Math.random() * 50);
}

export default function CampView() {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [taille, setTaille] = useState({ w: 800, h: 600 });
  const [tick, setTick] = useState(0);
  const marcheurs = useRef<Map<string, Marcheur>>(new Map());
  const [dragId, setDragId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);
  const [confirmBus, setConfirmBus] = useState<string | null>(null);
  // Progression du visiteur d'événement, de 0 (portail) à 1 (arrivé au camp)
  const visiteurProgres = useRef(0);

  const adeptes = useGameStore((s) => s.adeptes);
  const stats = useGameStore((s) => s.stats);
  const phase = useGameStore((s) => s.phase);
  const dialogue = useGameStore((s) => s.dialogue);
  const actionsRestantes = useGameStore((s) => s.actionsRestantes);
  const evenementDuJour = useGameStore((s) => s.evenementDuJour);
  const dernierSermon = useGameStore((s) => s.dernierSermon);
  const jour = useGameStore((s) => s.jour);
  const prophetie = useGameStore((s) => s.prophetie);
  const miraclesDebloques = useGameStore((s) => s.miraclesDebloques);
  const miracleUtilise = useGameStore((s) => s.miracleUtilise);
  const ouvrirCaisse = useGameStore((s) => s.ouvrirCaisse);
  const ouvrirAutel = useGameStore((s) => s.ouvrirAutel);
  const parler = useGameStore((s) => s.parler);
  const interroger = useGameStore((s) => s.interroger);
  const repondreDialogue = useGameStore((s) => s.repondreDialogue);
  const fermerDialogue = useGameStore((s) => s.fermerDialogue);
  const accuser = useGameStore((s) => s.accuser);
  const donnerTache = useGameStore((s) => s.donnerTache);
  const promouvoir = useGameStore((s) => s.promouvoir);
  const exclure = useGameStore((s) => s.exclure);
  const faireDisparaitre = useGameStore((s) => s.faireDisparaitre);

  const palette = paletteDerive(stats.derive);

  useEffect(() => {
    const el = conteneurRef.current;
    if (!el) return;
    const mesurer = () => setTaille({ w: el.clientWidth, h: el.clientHeight });
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Le bus n'attend pas au-delà de la phase de gestion.
  useEffect(() => {
    if (phase !== "gestion") setConfirmBus(null);
  }, [phase]);

  // Boucle d'animation : déambulation, cercle du sermon, marche du visiteur.
  useEffect(() => {
    const interval = setInterval(() => {
      if (dragIdRef.current) return; // pendant un drag, le monde retient son souffle
      const etat = useGameStore.getState();
      const carte = marcheurs.current;
      const liste = etat.adeptes;

      liste.forEach((a, index) => {
        let m = carte.get(a.id);
        if (!m) {
          m = { x: a.x, y: a.y, tx: a.x, ty: a.y, pause: 0 };
          nouvelleCible(m);
          carte.set(a.id, m);
        }
        // L'interlocuteur d'un dialogue reste planté là.
        if (etat.dialogue?.adepteId === a.id) return;

        let tx = m.tx;
        let ty = m.ty;
        if (etat.phase === "sermon") {
          // Rassemblement en cercle autour du feu pour écouter le prêche.
          const angle = (index / Math.max(1, liste.length)) * Math.PI * 2;
          tx = 0.5 + Math.cos(angle) * 0.14;
          ty = 0.52 + Math.sin(angle) * 0.13;
        } else if (m.pause > 0) {
          m.pause -= 1;
          return;
        }
        const dx = tx - m.x;
        const dy = ty - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.012) {
          if (etat.phase !== "sermon") nouvelleCible(m);
        } else {
          m.x += (dx / dist) * 0.0045;
          m.y += (dy / dist) * 0.0045;
        }
      });

      // Le visiteur d'événement marche du portail vers le camp.
      if (
        etat.phase === "evenement" &&
        etat.evenementDuJour?.evenement.visiteur &&
        visiteurProgres.current < 1
      ) {
        visiteurProgres.current = Math.min(1, visiteurProgres.current + 0.03);
      }
      if (etat.phase !== "evenement") visiteurProgres.current = 0;

      setTick((t) => t + 1);
    }, 85);
    return () => clearInterval(interval);
  }, []);

  const { w, h } = taille;
  const unite = Math.min(w, h);
  const feuX = w / 2;
  const feuY = h * 0.52;
  const flamme = 1 + Math.sin(tick * 0.55) * 0.12;
  // Le feu raconte la Ferveur : de braise mourante à brasier.
  const rayonFeu = (8 + stats.ferveur * 0.28) * flamme;
  // La voiture de gendarmerie se gare d'autant plus près que la Réputation baisse.
  const voitureX = w * (0.03 + (stats.reputation / 100) * 0.32);
  const gyrophare = stats.reputation < 35 && tick % 8 < 4;
  // À très haute Dérive, le gourou voit des yeux même là où il n'y en a pas.
  const nbYeux = Math.min(
    BUISSONS.length,
    Math.floor(stats.paranoia / 13) + (stats.derive > 80 ? 3 : 0)
  );
  const nbCaisses = Math.min(8, Math.ceil(stats.ressources / 20));

  const gestesActifs = phase === "gestion" && actionsRestantes > 0 && !dialogue;
  const caisseCliquable = gestesActifs && !prophetie;
  const miracleDispo =
    phase === "gestion" && !miracleUtilise && miraclesDebloques.length > 0;
  const pulsation = 0.5 + Math.sin(tick * 0.25) * 0.3;

  const zonePour = (nx: number, ny: number): Zone | null => {
    for (const z of ZONES) {
      const d = Math.hypot((nx - z.x) * w, (ny - z.y) * h);
      if (d < z.rayon * unite) return z;
    }
    return null;
  };

  const finDrag = (adepteId: string, e: KonvaEventObject<DragEvent>) => {
    setDragId(null);
    dragIdRef.current = null;
    const pos = e.target.position();
    const nx = pos.x / w;
    const ny = pos.y / h;
    const m = marcheurs.current.get(adepteId);
    const zone = zonePour(nx, ny);
    if (zone) {
      if (zone.id === "autel") promouvoir(adepteId);
      else if (zone.id === "confessionnal") interroger(adepteId);
      else if (zone.id === "champ") donnerTache(adepteId);
      else if (zone.id === "portail") exclure(adepteId);
      else if (zone.id === "bus") {
        setConfirmBus(adepteId); // le bus attend une confirmation
      }
      if (m && zone.id !== "bus") nouvelleCible(m);
      if (m) {
        m.x = Math.min(0.94, Math.max(0.06, nx));
        m.y = Math.min(0.94, Math.max(0.16, ny));
        if (zone.id === "bus") {
          // Il attend à l'arrêt, sa petite valise à la main.
          m.tx = m.x;
          m.ty = m.y;
          m.pause = 9999;
        }
      }
    } else if (m) {
      m.x = Math.min(0.96, Math.max(0.04, nx));
      m.y = Math.min(0.96, Math.max(0.14, ny));
      nouvelleCible(m);
    }
  };

  const curseur = (stage: Konva.Stage | null, style: string) => {
    if (stage) stage.container().style.cursor = style;
  };

  // Position d'ancrage de la bulle de dialogue (sur l'interlocuteur).
  const adepteDialogue = dialogue
    ? adeptes.find((a) => a.id === dialogue.adepteId)
    : null;
  const posDialogue = adepteDialogue
    ? marcheurs.current.get(adepteDialogue.id)
    : null;
  const adepteBus = confirmBus
    ? adeptes.find((a) => a.id === confirmBus)
    : null;
  const posBus = adepteBus ? marcheurs.current.get(adepteBus.id) : null;

  const visiteurLabel = evenementDuJour?.evenement.visiteur;
  const visiteurY = 0.12 + visiteurProgres.current * 0.18;

  return (
    <div ref={conteneurRef} className="relative h-full w-full overflow-hidden">
      <Stage width={w} height={h}>
        {/* ————— Décor ————— */}
        <Layer listening={false}>
          <Rect width={w} height={h} fill={palette.sol} />
          {/* La route, en haut : le monde extérieur */}
          <Rect y={0} width={w} height={h * 0.09} fill="#2b2b2e" />
          <Rect y={h * 0.045} width={w} height={2} fill="#4a4a3c" dash={[14, 10]} />
          <Circle x={feuX} y={feuY} radius={unite * 0.33} fill={palette.clairiere} />

          {/* La voiture de gendarmerie — plus la Réputation baisse, plus elle approche */}
          <Group x={voitureX} y={h * 0.045}>
            <Rect x={-22} y={-8} width={44} height={16} fill="#26324a" cornerRadius={4} />
            <Rect x={-12} y={-13} width={22} height={8} fill="#3c4c6b" cornerRadius={3} />
            <Circle x={-13} y={9} radius={4} fill="#111" />
            <Circle x={13} y={9} radius={4} fill="#111" />
            <Circle x={2} y={-15} radius={3.5} fill={gyrophare ? "#5aa7ff" : "#2b4a7a"} />
            <Text x={-30} y={14} width={60} align="center" text="gendarmerie" fontSize={8} fill="#7a8699" />
          </Group>

          {/* L'arrêt de bus pour Perpignan */}
          <Group x={ZONES[4].x * w} y={h * 0.075}>
            <Rect x={-2} y={-26} width={4} height={26} fill="#5c5c52" />
            <Rect x={-26} y={-40} width={52} height={16} fill="#4a4a40" cornerRadius={2} />
            <Text x={-26} y={-36} width={52} align="center" text="PERPIGNAN" fontSize={7} fill="#c9c9b8" />
          </Group>

          {/* Le portail */}
          <Group x={w * 0.5} y={h * 0.1}>
            <Rect x={-30} y={-14} width={5} height={28} fill={palette.tente} />
            <Rect x={25} y={-14} width={5} height={28} fill={palette.tente} />
            <Rect x={-30} y={-16} width={60} height={5} fill={palette.tente} />
          </Group>

          {/* Tentes */}
          {TENTES.map((t, i) => (
            <Group key={i} x={t.x * w} y={t.y * h}>
              <Line points={[-24, 13, 0, -20, 24, 13]} closed fill={palette.tente} stroke={palette.panelBord} strokeWidth={1.5} />
              <Line points={[-4, 13, 0, 2, 4, 13]} closed fill={palette.sol} />
            </Group>
          ))}

          {/* L'autel du micro-ondes sacré (zone : promotion, clic : miracles) */}
          <Group x={ZONES[0].x * w} y={ZONES[0].y * h}>
            {miracleDispo && (
              <Circle radius={30} fill={palette.accent} opacity={0.14 * pulsation + 0.06} />
            )}
            <Rect x={-30} y={2} width={60} height={13} fill={palette.tente} cornerRadius={3} />
            <Rect x={-12} y={-12} width={24} height={15} fill="#d8d3c8" cornerRadius={2} />
            <Rect
              x={-8}
              y={-8}
              width={10}
              height={8}
              fill={miracleDispo ? palette.feu : "#3a3630"}
              opacity={miracleDispo ? 0.5 + pulsation * 0.5 : 1}
              cornerRadius={1}
            />
            <Circle x={7} y={-5} radius={2} fill="#3a3630" />
            <Text x={-40} y={20} width={80} align="center" text="l'autel" fontSize={10} fontStyle="italic" fill={palette.texteDoux} />
          </Group>

          {/* La caisse du prophète — on y monte pour annoncer l'avenir */}
          <Group x={w * 0.4} y={h * 0.64}>
            {caisseCliquable && (
              <Circle radius={24} stroke={palette.accent} strokeWidth={1.5} dash={[4, 4]} opacity={0.3 + pulsation * 0.4} />
            )}
            <Rect x={-14} y={-9} width={28} height={18} fill="#7a5a33" stroke="#4d3a20" strokeWidth={1.5} cornerRadius={2} />
            <Line points={[-14, -3, 14, -3]} stroke="#4d3a20" strokeWidth={1} />
            <Line points={[-14, 3, 14, 3]} stroke="#4d3a20" strokeWidth={1} />
            {prophetie && (
              <Group y={-22}>
                <Rect x={-16} y={-8} width={32} height={15} fill="rgba(0,0,0,0.55)" cornerRadius={3} />
                <Text
                  x={-16}
                  y={-5}
                  width={32}
                  align="center"
                  text={`J-${Math.max(0, prophetie.jourEcheance - jour)}`}
                  fontSize={10}
                  fill={palette.accent}
                />
              </Group>
            )}
            <Text x={-50} y={13} width={100} align="center" text="la caisse du prophète" fontSize={10} fontStyle="italic" fill={palette.texteDoux} />
          </Group>

          {/* Le confessionnal (zone : interrogatoire) */}
          <Group x={ZONES[1].x * w} y={ZONES[1].y * h}>
            <Line points={[-26, 16, 0, -26, 26, 16]} closed fill={palette.tente} stroke={palette.accent} strokeWidth={2} dash={[6, 4]} />
            <Line points={[-5, 16, 0, 0, 5, 16]} closed fill="#141414" />
            <Text x={-50} y={22} width={100} align="center" text="le confessionnal" fontSize={10} fontStyle="italic" fill={palette.texteDoux} />
          </Group>

          {/* Le potager (zone : corvée) */}
          <Group x={ZONES[2].x * w} y={ZONES[2].y * h}>
            {[-1, 0, 1].map((r) => (
              <Rect key={r} x={-34} y={r * 12 - 5} width={68} height={6} fill={palette.clairiere} cornerRadius={3} />
            ))}
            {[-24, -8, 8, 24].map((cx) => (
              <Circle key={cx} x={cx} y={-11} radius={3} fill="#5d7a3a" />
            ))}
            <Text x={-40} y={26} width={80} align="center" text="le potager" fontSize={10} fontStyle="italic" fill={palette.texteDoux} />
          </Group>

          {/* La réserve : les caisses = les Ressources */}
          <Group x={w * 0.88} y={h * 0.82}>
            {Array.from({ length: nbCaisses }).map((_, i) => (
              <Rect
                key={i}
                x={(i % 3) * 16 - 24}
                y={-Math.floor(i / 3) * 14}
                width={14}
                height={12}
                fill={palette.tente}
                stroke={palette.panelBord}
                strokeWidth={1}
                cornerRadius={1}
              />
            ))}
            <Text x={-40} y={18} width={80} align="center" text="la réserve" fontSize={10} fontStyle="italic" fill={palette.texteDoux} />
          </Group>

          {/* Buissons — et les yeux que la Paranoïa y ouvre */}
          {BUISSONS.map((b, i) => (
            <Group key={i} x={b.x * w} y={b.y * h}>
              <Circle radius={16} fill={palette.clairiere} />
              <Circle x={-9} y={4} radius={10} fill={palette.clairiere} />
              <Circle x={9} y={4} radius={10} fill={palette.clairiere} />
              {i < nbYeux && tick % 40 < 32 && (
                <>
                  <Circle x={-4} y={-2} radius={2} fill={palette.accent} />
                  <Circle x={4} y={-2} radius={2} fill={palette.accent} />
                </>
              )}
            </Group>
          ))}

          {/* Le feu de camp — la Ferveur incarnée */}
          <Circle x={feuX} y={feuY} radius={rayonFeu * 1.9} fill={palette.feu} opacity={0.16} />
          <Circle x={feuX} y={feuY} radius={rayonFeu} fill={palette.feu} opacity={0.65} />
          <Circle x={feuX} y={feuY} radius={rayonFeu * 0.45} fill="#f5d78a" />

          {/* Le Gourou — son ombre s'allonge avec la Dérive */}
          <Group x={feuX} y={h * 0.4}>
            <Line
              points={[0, 8, -6 - stats.derive * 0.5, 14 + stats.derive * 0.35, 6 + stats.derive * 0.2, 16 + stats.derive * 0.3]}
              closed
              fill="rgba(0,0,0,0.35)"
            />
            <Circle radius={13} fill={palette.accent} />
            <Line points={[-9, -8, 0, -26, 9, -8]} closed fill={palette.accent} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
            <Circle x={-4} y={-2} radius={1.6} fill="#241a10" />
            <Circle x={4} y={-2} radius={1.6} fill="#241a10" />
            <Text x={-30} y={18} width={60} align="center" text="vous" fontSize={10} fontStyle="italic" fill={palette.texteDoux} />
          </Group>

          {/* Le visiteur d'événement franchit le portail */}
          {phase === "evenement" && visiteurLabel && (
            <Group x={w * 0.5} y={h * visiteurY}>
              <Circle radius={10} fill="#b8c2cc" stroke="#2b2b2e" strokeWidth={1.5} />
              <Rect x={-8} y={-16} width={16} height={5} fill="#2b2b2e" cornerRadius={2} />
              <Circle x={-3} y={-2} radius={1.4} fill="#22262b" />
              <Circle x={3} y={-2} radius={1.4} fill="#22262b" />
              <Text x={-60} y={14} width={120} align="center" text={visiteurLabel} fontSize={10} fontStyle="italic" fill="#b8c2cc" />
            </Group>
          )}
        </Layer>

        {/* ————— Zones de dépôt (visibles pendant un drag) ————— */}
        {dragId && (
          <Layer listening={false}>
            {ZONES.map((z) => (
              <Group key={z.id} x={z.x * w} y={z.y * h}>
                <Circle
                  radius={z.rayon * unite}
                  stroke={z.id === "bus" || z.id === "portail" ? "#d96a6a" : palette.accent}
                  strokeWidth={2}
                  dash={[6, 5]}
                  opacity={0.85}
                />
                <Rect x={-46} y={z.rayon * unite + 4} width={92} height={18} fill="rgba(0,0,0,0.55)" cornerRadius={9} />
                <Text
                  x={-46}
                  y={z.rayon * unite + 8}
                  width={92}
                  align="center"
                  text={z.label}
                  fontSize={11}
                  fill={z.id === "bus" || z.id === "portail" ? "#e89a9a" : palette.texte}
                />
              </Group>
            ))}
          </Layer>
        )}

        {/* ————— Objets cliquables : l'autel (miracles) et la caisse (prophéties) ————— */}
        <Layer>
          <Circle
            x={ZONES[0].x * w}
            y={ZONES[0].y * h}
            radius={32}
            fill="black"
            opacity={0}
            onClick={ouvrirAutel}
            onTap={ouvrirAutel}
            onMouseEnter={(e) => curseur(e.target.getStage(), phase === "gestion" ? "pointer" : "default")}
            onMouseLeave={(e) => curseur(e.target.getStage(), "default")}
          />
          <Circle
            x={w * 0.4}
            y={h * 0.64}
            radius={26}
            fill="black"
            opacity={0}
            onClick={ouvrirCaisse}
            onTap={ouvrirCaisse}
            onMouseEnter={(e) => curseur(e.target.getStage(), caisseCliquable ? "pointer" : "default")}
            onMouseLeave={(e) => curseur(e.target.getStage(), "default")}
          />
        </Layer>

        {/* ————— Les adeptes ————— */}
        <Layer>
          {adeptes.map((a) => {
            const m = marcheurs.current.get(a.id);
            const x = (m?.x ?? a.x) * w;
            const y = (m?.y ?? a.y) * h;
            const etat = etatVisible(a);
            return (
              <Group
                key={a.id}
                x={x}
                y={y}
                draggable={gestesActifs}
                onClick={() => gestesActifs && parler(a.id)}
                onTap={() => gestesActifs && parler(a.id)}
                onDragStart={() => {
                  setDragId(a.id);
                  dragIdRef.current = a.id;
                }}
                onDragEnd={(e) => finDrag(a.id, e)}
                onMouseEnter={(e) => curseur(e.target.getStage(), gestesActifs ? "grab" : "default")}
                onMouseLeave={(e) => curseur(e.target.getStage(), "default")}
              >
                <Circle
                  radius={10}
                  fill={COULEUR_ETAT[etat]}
                  stroke={a.promu ? palette.accent : "rgba(0,0,0,0.35)"}
                  strokeWidth={a.promu ? 3 : 1}
                />
                <Circle x={-3} y={-2} radius={1.4} fill="#2a2118" />
                <Circle x={3} y={-2} radius={1.4} fill="#2a2118" />
                <Text x={-40} y={14} width={80} align="center" text={a.nom} fontSize={11} fill={palette.texteDoux} />
              </Group>
            );
          })}
        </Layer>
      </Stage>

      {/* ————— Bulle de dialogue, ancrée sur l'interlocuteur ————— */}
      {dialogue && adepteDialogue && posDialogue && (
        <div
          className="absolute z-20 w-80 -translate-x-1/2"
          style={{
            left: `${Math.min(88, Math.max(12, posDialogue.x * 100))}%`,
            top: `${Math.min(60, Math.max(6, posDialogue.y * 100 - 8))}%`,
          }}
        >
          <div className="panneau rounded-xl rounded-bl-none p-4 shadow-2xl">
            <p className="text-xs uppercase tracking-widest text-encre-douce">
              {adepteDialogue.nom} — {getArchetype(adepteDialogue.archetypeId).nom}
              {dialogue.interrogatoire && (
                <span className="text-red-400"> · au confessionnal</span>
              )}
            </p>
            <p className="mt-2 font-display text-sm italic leading-relaxed">
              « {dialogue.accroche} »
            </p>
            {dialogue.reponse === null ? (
              <div className="mt-3 flex flex-col gap-1.5">
                {dialogue.choix.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => repondreDialogue(i)}
                    className="rounded border border-bordure px-3 py-1.5 text-left text-xs transition hover:border-accent hover:text-accent"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-3 rounded border border-accent/40 bg-accent/5 p-2 font-display text-sm italic">
                  « {dialogue.reponse} »
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={fermerDialogue}
                    className="flex-1 rounded border border-bordure py-1.5 text-xs uppercase tracking-wider text-encre-douce transition hover:border-accent hover:text-accent"
                  >
                    Le laisser partir
                  </button>
                  {dialogue.interrogatoire && (
                    <button
                      onClick={() => accuser(dialogue.adepteId)}
                      className="flex-1 rounded border border-red-400/60 py-1.5 text-xs uppercase tracking-wider text-red-400 transition hover:bg-red-400/15"
                    >
                      L'accuser !
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ————— Confirmation de l'arrêt de bus ————— */}
      {confirmBus && adepteBus && posBus && (
        <div
          className="absolute z-20 w-72 -translate-x-1/2"
          style={{
            left: `${Math.min(85, Math.max(15, posBus.x * 100))}%`,
            top: `${Math.min(60, Math.max(6, posBus.y * 100 + 4))}%`,
          }}
        >
          <div className="panneau rounded-xl border-red-400/50 p-4 shadow-2xl">
            <p className="font-display text-sm italic leading-relaxed">
              {adepteBus.nom} attend à l'arrêt. Le bus de nuit pour Perpignan
              passe dans une minute. Il ne repassera pas.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  const m = marcheurs.current.get(confirmBus);
                  if (m) nouvelleCible(m);
                  setConfirmBus(null);
                }}
                className="flex-1 rounded border border-bordure py-1.5 text-xs uppercase tracking-wider text-encre-douce transition hover:border-accent hover:text-accent"
              >
                Le retenir
              </button>
              <button
                onClick={() => {
                  faireDisparaitre(confirmBus);
                  setConfirmBus(null);
                }}
                className="flex-1 rounded border border-red-400/60 py-1.5 text-xs uppercase tracking-wider text-red-400 transition hover:bg-red-400/15"
              >
                Le laisser monter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ————— Le sermon prononcé flotte au-dessus du gourou ————— */}
      {phase === "gestion" && dernierSermon && !dialogue && (
        <div
          className="absolute z-10 w-96 -translate-x-1/2"
          style={{ left: "50%", top: "16%" }}
        >
          <div className="panneau rounded-xl rounded-bl-none p-4 opacity-95 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-accent">
              « {dernierSermon.titre} »
            </p>
            <p className="mt-1 font-display text-sm italic leading-relaxed">
              {dernierSermon.texte}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
