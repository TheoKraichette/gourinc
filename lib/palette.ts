// Palette dynamique : sépia chaleureux à Dérive 0, rouge/violet malsain à Dérive 100.
// C'est le feedback visuel principal sur l'état mental du gourou.

export interface Palette {
  bg: string;
  panel: string;
  panelBord: string;
  accent: string;
  texte: string;
  texteDoux: string;
  sol: string;
  clairiere: string;
  feu: string;
  tente: string;
}

const SEPIA: Palette = {
  bg: "#251c12",
  panel: "#322619",
  panelBord: "#4d3c27",
  accent: "#d9a441",
  texte: "#f0e4cd",
  texteDoux: "#b3a284",
  sol: "#3a2e1f",
  clairiere: "#46372a",
  feu: "#e8863b",
  tente: "#6b5233",
};

const CORROMPU: Palette = {
  bg: "#150a1e",
  panel: "#221132",
  panelBord: "#3f2359",
  accent: "#c93d64",
  texte: "#e9d8f2",
  texteDoux: "#9880ac",
  sol: "#241435",
  clairiere: "#2f1b44",
  feu: "#d14360",
  tente: "#44265f",
};

function hexVersRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function melanger(a: string, b: string, t: number): string {
  const ra = hexVersRgb(a);
  const rb = hexVersRgb(b);
  const c = ra.map((v, i) => Math.round(v + (rb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

// derive 0-100 → palette interpolée. La bascule s'accélère après 40.
export function paletteDerive(derive: number): Palette {
  const t = Math.min(1, Math.max(0, (derive / 100) ** 1.4));
  const cles = Object.keys(SEPIA) as (keyof Palette)[];
  const res = {} as Palette;
  for (const k of cles) res[k] = melanger(SEPIA[k], CORROMPU[k], t);
  return res;
}

// Couleurs des adeptes selon leur état visible (stables, lisibles sur les deux palettes)
export const COULEUR_ETAT: Record<string, string> = {
  fervent: "#e0a33f",
  douteux: "#8fa3b8",
  partant: "#77776d",
};
