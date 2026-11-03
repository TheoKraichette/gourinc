// Petits helpers aléatoires — pas de seed, le chaos fait partie du culte.

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function chance(pourcent: number): boolean {
  return Math.random() * 100 < pourcent;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickN<T>(arr: readonly T[], n: number): T[] {
  const copie = [...arr];
  const res: T[] = [];
  while (res.length < n && copie.length > 0) {
    res.push(copie.splice(Math.floor(Math.random() * copie.length), 1)[0]);
  }
  return res;
}

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

let compteurId = 0;
export function genId(prefix: string): string {
  compteurId += 1;
  return `${prefix}-${Date.now().toString(36)}-${compteurId}`;
}
