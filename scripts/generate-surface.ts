/**
 * Generates public/surface.svg — ~40 isolines of deterministic 2D simplex noise.
 * Committed output. Never generated at runtime.
 *
 * SEED is fixed so the artwork is identical on every machine and every build.
 */
import { createNoise2D } from "simplex-noise";
import { writeFileSync } from "node:fs";

const SEED = 0x5ea5ea5e;          // committed seed — do not change casually
const COLS = 240;
const ROWS = 160;
const LEVELS = 40;
const W = 1200;
const H = 800;

/** mulberry32 — small, deterministic, dependency-free PRNG */
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const noise2D = createNoise2D(mulberry32(SEED));

/* Layered noise, low frequency, so it reads as calm terrain rather than static. */
function field(x: number, y: number) {
  const u = x / COLS, v = y / ROWS;
  return (
    1.00 * noise2D(u * 2.1, v * 1.5) +
    0.45 * noise2D(u * 4.3, v * 3.1) +
    0.18 * noise2D(u * 8.7, v * 6.4)
  ) / 1.63;
}

const grid: number[][] = [];
for (let y = 0; y <= ROWS; y++) {
  const row: number[] = [];
  for (let x = 0; x <= COLS; x++) row.push(field(x, y));
  grid.push(row);
}

const sx = W / COLS;
const sy = H / ROWS;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cross = (v0: number, v1: number, lv: number) => (lv - v0) / (v1 - v0);

/** Marching squares: emit segments per cell, then chain them into polylines. */
function isoSegments(level: number) {
  const segs: [number, number, number, number][] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const tl = grid[y][x], tr = grid[y][x + 1];
      const br = grid[y + 1][x + 1], bl = grid[y + 1][x];
      const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;

      const T = () => [ (x + cross(tl, tr, level)) * sx, y * sy ] as [number, number];
      const R = () => [ (x + 1) * sx, (y + cross(tr, br, level)) * sy ] as [number, number];
      const B = () => [ (x + cross(bl, br, level)) * sx, (y + 1) * sy ] as [number, number];
      const L = () => [ x * sx, (y + cross(tl, bl, level)) * sy ] as [number, number];

      const push = (a: [number, number], b: [number, number]) => segs.push([a[0], a[1], b[0], b[1]]);
      switch (idx) {
        case 1: case 14: push(L(), B()); break;
        case 2: case 13: push(B(), R()); break;
        case 3: case 12: push(L(), R()); break;
        case 4: case 11: push(T(), R()); break;
        case 6: case  9: push(T(), B()); break;
        case 7: case  8: push(L(), T()); break;
        case 5: push(L(), T()); push(B(), R()); break;
        case 10: push(L(), B()); push(T(), R()); break;
      }
    }
  }
  return segs;
}

/** Chain segments head-to-tail so we emit few long paths, not thousands of stubs. */
function chain(segs: [number, number, number, number][]) {
  const key = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;
  const heads = new Map<string, number[]>();
  segs.forEach((s, i) => {
    for (const k of [key(s[0], s[1]), key(s[2], s[3])]) {
      if (!heads.has(k)) heads.set(k, []);
      heads.get(k)!.push(i);
    }
  });
  const used = new Set<number>();
  const paths: number[][] = [];
  for (let i = 0; i < segs.length; i++) {
    if (used.has(i)) continue;
    used.add(i);
    const pts = [segs[i][0], segs[i][1], segs[i][2], segs[i][3]];
    let grew = true;
    while (grew) {
      grew = false;
      const ex = pts[pts.length - 2], ey = pts[pts.length - 1];
      for (const j of heads.get(key(ex, ey)) ?? []) {
        if (used.has(j)) continue;
        const s = segs[j];
        const startMatches = key(s[0], s[1]) === key(ex, ey);
        pts.push(startMatches ? s[2] : s[0], startMatches ? s[3] : s[1]);
        used.add(j); grew = true; break;
      }
    }
    if (pts.length >= 6) paths.push(pts);   // drop 1-segment specks
  }
  return paths;
}

/** Ramer-Douglas-Peucker: drop points that add no visible shape. */
function simplify(pts: number[], eps: number): number[] {
  const n = pts.length / 2;
  if (n < 3) return pts;
  const keep = new Uint8Array(n); keep[0] = 1; keep[n - 1] = 1;
  const stack: [number, number][] = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    if (b <= a + 1) continue;
    const ax = pts[a * 2], ay = pts[a * 2 + 1];
    const bx = pts[b * 2], by = pts[b * 2 + 1];
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let far = -1, fd = eps;
    for (let i = a + 1; i < b; i++) {
      const px = pts[i * 2], py = pts[i * 2 + 1];
      const dist = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (dist > fd) { fd = dist; far = i; }
    }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i * 2], pts[i * 2 + 1]);
  return out;
}

const d: string[] = [];
for (let i = 0; i < LEVELS; i++) {
  const level = -0.62 + (1.24 * i) / (LEVELS - 1);
  for (const raw of chain(isoSegments(level))) {
    const pts = simplify(raw, 1.4);
    if (pts.length < 8) continue;                     // drop specks after simplifying
    let s = `M${Math.round(pts[0])} ${Math.round(pts[1])}`;
    for (let k = 2; k < pts.length; k += 2) s += `L${Math.round(pts[k])} ${Math.round(pts[k + 1])}`;
    d.push(s);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" aria-hidden="true">
<g stroke="#E3E5E1" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
${d.map((p) => `<path d="${p}"/>`).join("\n")}
</g>
</svg>
`;
writeFileSync("public/surface.svg", svg);
console.log(`surface.svg: ${d.length} paths, ${LEVELS} levels, seed 0x${SEED.toString(16)}`);
