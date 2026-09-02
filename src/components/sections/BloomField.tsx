"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   BloomField — a generative night meadow.

   Not an image and not a particle library: a Canvas 2D composition of three
   receding ground planes under a horizon-hugging glow, with ~330 blooms
   scattered across them on a photographic depth-of-field model (focus plane at
   d≈0.46; anything nearer or further is baked softer, dimmer and larger).
   Blooms drift, breathe and shimmer on independent 19–97s cycles, and a single
   54s travelling breeze wave crosses the field left to right, so the meadow
   moves together without ever pulsing in unison.

   Determinism    one committed seed drives layout, colour and every phase
                  offset, so the composition is identical on every machine.
   Type safety    a quiet mask suppresses bloom alpha through the central
                  column, keeping the headline region near-pure obsidian.
   Cost           every bloom is a pre-baked sprite; ground and scrim are baked
                  once per size. The loop does setTransform + drawImage only —
                  no gradients, no paths, no allocation per frame. Throttled to
                  30fps, parked when offscreen or when the tab is hidden.
   Reduced motion one composed frame at t = STATIC_T. No loop is started.
   ═══════════════════════════════════════════════════════════════════════════ */

/** The one and only source of randomness. Change this and the meadow changes. */
const SEED = 0x1f0a7e5;
/** The moment the still composition freezes on — and where the animation
 *  starts from, so the two are continuous. */
const STATIC_T = 18.4;
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;
/** Sizes below are authored against a 900px minimum viewport dimension. */
const REF = 900;
/** Depth of the plane that is in focus. */
const FOCUS = 0.46;
/** Blur radii baked into each sprite tier, in sprite pixels. */
const BLUR_PX = [0, 2.2, 5.5, 11] as const;
/** Breeze: one wave crosses the field every 54 seconds. */
const BREEZE_W = (Math.PI * 2) / 54;
const TAU = Math.PI * 2;

type RGB = readonly [number, number, number];

/* Palette — chromatic tokens only. Mostly pale, a very few bright. The hue
   lives mainly in each bloom's halo; the petals themselves are mixed most of
   the way to cloud, which is what stops the field reading as party lights. */
const PALETTE: RGB[] = [
  [209, 201, 255], // pale-iris   #d1c9ff
  [144, 184, 240], // periwinkle  #90b8f0
  [75, 73, 170], //   deep-iris   #4b49aa
  [132, 125, 255], // iris        #847dff
  [221, 144, 216], // orchid      #dd90d8
  [0, 179, 221], //   cyan        #00b3dd
  [245, 245, 247], // cloud       #f5f5f7
];
/* Weighted warm: orchid and pale-iris carry the temperature, periwinkle and
   deep-iris the depth, cyan is deliberately almost absent — it is the coldest
   and most generically fintech token in the set. */
const WEIGHTS = [0.3, 0.21, 0.125, 0.13, 0.16, 0.015, 0.06];
const CUM = WEIGHTS.reduce<number[]>((acc, w0) => {
  acc.push((acc[acc.length - 1] ?? 0) + w0);
  return acc;
}, []);
const CLOUD: RGB = [245, 245, 247];

/* ── deterministic PRNG ──────────────────────────────────────────────────── */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];
/** Period in seconds → angular velocity. Nothing here is faster than 19s. */
const w = (secs: number) => TAU / secs;

/* ── the landscape ───────────────────────────────────────────────────────── */
/** Distant ridge. Sits under the type block, not through it. */
const farRidge = (x: number) =>
  0.552 + 0.03 * Math.sin(x * 3.9 + 1.1) + 0.015 * Math.sin(x * 8.3 + 0.4);
/** Near ridge — the hillside the meadow sits on. */
const nearRidge = (x: number) =>
  0.692 + 0.044 * Math.sin(x * 2.4 + 2.6) + 0.019 * Math.sin(x * 5.1 + 1.3);

/**
 * Quiet mask: the alpha multiplier for a bloom at normalised (x, y).
 * A bloom is only suppressed when it is BOTH horizontally central AND inside
 * the vertical type band, so the field stays alive at the edges and along the
 * bottom while the headline column reads as clean obsidian.
 */
function quiet(x: number, y: number) {
  const fx = smoothstep(0.3, 0.52, Math.abs(x - 0.5));
  const fy = smoothstep(0.28, 0.44, Math.abs(y - 0.34));
  return 0.05 + 0.95 * Math.min(1, fx + fy);
}

/**
 * Light map: how much of the moon reaches (x, y). A broad pool below and to
 * the right of the horizon glow, modulated by three incommensurate waves so
 * the meadow breaks into lit drifts and dark hollows. Without this every bloom
 * is equally bright, the field reads as evenly spaced polka dots, and no
 * amount of good flower drawing rescues it.
 */
function litness(x: number, y: number) {
  const dx = (x - 0.66) / 0.95;
  const dy = (y - 0.95) / 0.62;
  const pool = 1 - smoothstep(0.2, 1.3, Math.sqrt(dx * dx + dy * dy));
  const n =
    Math.sin(x * 5.3 + 1.1) * 0.46 +
    Math.sin(y * 4.1 + 2.7) * 0.3 +
    Math.sin((x + y) * 7.9 + 0.4) * 0.24;
  const drift = clamp(0.5 + n * 0.5, 0, 1);
  return lerp(0.36, 1.0, clamp(pool * 0.55 + drift * 0.55, 0, 1));
}

/* ── sprites ─────────────────────────────────────────────────────────────── */
type Sprite = {
  c: HTMLCanvasElement;
  size: number;
  /** the radius the head is authored at, for scale maths */
  unit: number;
  /** pivot inside the sprite (stemmed blooms pivot at the base of the stem) */
  ax: number;
  ay: number;
};

function makeSprite(ci: number, shape: number, blur: number): Sprite {
  const col = PALETTE[ci];
  // petals are mostly cloud with the hue only whispering through
  const body = mix(col, CLOUD, 0.6);
  // the halo carries the hue, but even it is pulled off full saturation —
  // a fully saturated cyan bloom reads as a party light, not a night flower
  const glow = mix(col, CLOUD, 0.24);
  const SP = shape === 3 ? 128 : shape === 2 ? 64 : 96;
  const cv = document.createElement("canvas");
  cv.width = SP;
  cv.height = SP;
  const g = cv.getContext("2d")!;

  const hx = SP / 2;
  const hy = shape === 3 ? SP * 0.3 : SP / 2;
  const px = SP / 2;
  const py = shape === 3 ? SP * 0.94 : SP / 2;
  const R = shape === 3 ? SP * 0.175 : shape === 2 ? SP * 0.17 : SP * 0.26;

  // stem, behind the head, brightening toward the flower
  if (shape === 3) {
    const sg = g.createLinearGradient(px, py, hx, hy);
    sg.addColorStop(0, rgba(body, 0));
    sg.addColorStop(0.55, rgba(body, 0.1));
    sg.addColorStop(1, rgba(body, 0.24));
    g.strokeStyle = sg;
    g.lineWidth = SP * 0.012;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(px, py);
    g.quadraticCurveTo(px + SP * 0.055, (py + hy) / 2, hx, hy);
    g.stroke();
  }

  g.globalCompositeOperation = "lighter";

  // ambient halo — this is where the chromatic token actually shows
  const halo = g.createRadialGradient(hx, hy, 0, hx, hy, shape === 2 ? SP * 0.48 : SP * 0.47);
  halo.addColorStop(0, rgba(glow, shape === 2 ? 0.34 : 0.2));
  halo.addColorStop(0.24, rgba(glow, 0.1));
  halo.addColorStop(0.6, rgba(glow, 0.026));
  halo.addColorStop(1, rgba(glow, 0));
  g.fillStyle = halo;
  g.fillRect(0, 0, SP, SP);

  // petals — rounded lobes that meet, so the head reads as a flower disc
  // rather than a star. Fill is near-flat with a soft tip falloff.
  if (shape !== 2) {
    const petals = shape === 1 ? 6 : 5;
    const step = TAU / petals;
    const hw = step * 0.5 * 0.98; // lobes just touch
    const L = R;
    const pg = g.createRadialGradient(hx, hy, 0, hx, hy, L * 1.02);
    pg.addColorStop(0, rgba(body, 0.3));
    pg.addColorStop(0.45, rgba(body, 0.4));
    pg.addColorStop(0.78, rgba(body, 0.3));
    pg.addColorStop(0.94, rgba(body, 0.09));
    pg.addColorStop(1, rgba(body, 0));
    g.fillStyle = pg;
    const P = (ang: number, r: number) => [hx + Math.cos(ang) * r, hy + Math.sin(ang) * r];
    for (let i = 0; i < petals; i++) {
      const a0 = i * step - Math.PI / 2;
      const [c1x, c1y] = P(a0 - hw, L * 0.42);
      const [c2x, c2y] = P(a0 - hw * 0.66, L * 1.02);
      const [tx, ty] = P(a0, L);
      const [c3x, c3y] = P(a0 + hw * 0.66, L * 1.02);
      const [c4x, c4y] = P(a0 + hw, L * 0.42);
      g.beginPath();
      g.moveTo(hx, hy);
      g.bezierCurveTo(c1x, c1y, c2x, c2y, tx, ty);
      g.bezierCurveTo(c3x, c3y, c4x, c4y, hx, hy);
      g.fill();
    }
  }

  // core — the light the bloom catches
  const cr = shape === 2 ? R * 0.62 : R * 0.34;
  const core = g.createRadialGradient(hx, hy, 0, hx, hy, cr);
  core.addColorStop(0, `rgba(255,255,255,${shape === 2 ? 0.6 : 0.55})`);
  core.addColorStop(0.45, rgba(body, 0.34));
  core.addColorStop(1, rgba(body, 0));
  g.fillStyle = core;
  g.beginPath();
  g.arc(hx, hy, cr, 0, TAU);
  g.fill();

  let out = cv;
  if (blur > 0) {
    const b = document.createElement("canvas");
    b.width = SP;
    b.height = SP;
    const bg = b.getContext("2d")!;
    // bake-time only; a browser without ctx.filter simply renders crisper
    bg.filter = `blur(${BLUR_PX[blur]}px)`;
    bg.drawImage(cv, 0, 0);
    out = b;
  }
  return { c: out, size: SP, unit: R, ax: px, ay: py };
}

/* ── the field ───────────────────────────────────────────────────────────── */
type Bloom = {
  x: number;
  y: number;
  /** head radius, in REF px */
  size: number;
  alpha: number;
  rot: number;
  ci: number;
  shape: number;
  blur: number;
  /** deterministic 0–1 survival rank; low ranks stay at every viewport width */
  rank: number;
  /** vertical squash — a flower on a hillside is seen at an angle, not face on */
  sq: number;
  w1: number;
  w2: number;
  ph1: number;
  ph2: number;
  ax: number;
  ay: number;
  wb: number;
  phb: number;
  bamp: number;
  ws: number;
  phs: number;
  samp: number;
  wr: number;
  phr: number;
  ramp: number;
  sw: number;
  rsw: number;
  spr: Sprite | null;
};

/** Largest bloom each palette index is allowed on, in REF px. A saturated hue
 *  is fine as a pinprick and disastrous as a soft 70px smear: one teal blob
 *  turns the whole field into a screensaver. Cyan is held to pinpricks; orchid
 *  carries warmth through the mid field but never becomes a foreground wash. */
const MAX_SIZE_FOR: Record<number, number> = { 4: 30, 5: 7 }; // orchid, cyan

function pickColor(r: number, size: number) {
  let i = CUM.length - 1;
  for (let k = 0; k < CUM.length; k++) {
    if (r <= CUM[k]) {
      i = k;
      break;
    }
  }
  const cap = MAX_SIZE_FOR[i];
  if (cap !== undefined && size > cap) i = r < 0.5 ? 0 : 1;
  return i;
}

function blurFor(d: number, shape: number) {
  if (shape === 2) return 0; // distant motes are already soft gradients
  const dev = Math.abs(d - FOCUS);
  return dev < 0.06 ? 0 : dev < 0.15 ? 1 : dev < 0.3 ? 2 : 3;
}

function buildField(): Bloom[] {
  const rnd = mulberry32(SEED);
  const out: Bloom[] = [];

  // Meadows clump. Twelve two-dimensional drifts over (x, band-fraction),
  // with a thin uniform scatter between them, so the field has thickets and
  // hollows instead of an even sprinkle.
  const clusters: Array<[number, number]> = [];
  for (let i = 0; i < 12; i++) clusters.push([rnd() * 1.1 - 0.05, rnd()]);
  /** returns [x, f] where f is the position inside the band, 0 far → 1 near */
  const clump = (spreadX: number, spreadF: number): [number, number] => {
    if (rnd() < 0.26) return [rnd() * 1.12 - 0.06, rnd()];
    const c = clusters[Math.floor(rnd() * clusters.length)];
    const gx = (rnd() + rnd() + rnd() - 1.5) * spreadX;
    const gf = (rnd() + rnd() + rnd() - 1.5) * spreadF;
    return [clamp(c[0] + gx, -0.06, 1.06), clamp(c[1] + gf, 0, 1)];
  };

  const push = (
    x: number,
    y: number,
    d: number,
    size: number,
    alpha: number,
    shape: number,
    rank: number,
    driftScale = 1,
  ) => {
    out.push({
      x,
      y,
      size,
      alpha: alpha * quiet(x, y) * litness(x, y),
      rot: rnd() * TAU,
      ci: pickColor(rnd(), size),
      shape,
      blur: blurFor(d, shape),
      rank,
      sq: shape === 2 ? 1 : lerp(0.52, 1.0, Math.pow(rnd(), 0.7)),
      w1: w(lerp(34, 86, rnd())),
      w2: w(lerp(41, 97, rnd())),
      ph1: rnd() * TAU,
      ph2: rnd() * TAU,
      ax: (3 + d * 15) * driftScale,
      ay: (2 + d * 8) * driftScale,
      wb: w(lerp(26, 64, rnd())),
      phb: rnd() * TAU,
      bamp: 0.035 + d * 0.05,
      ws: w(lerp(19, 47, rnd())),
      phs: rnd() * TAU,
      samp: lerp(0.1, 0.22, rnd()),
      wr: w(lerp(70, 160, rnd())),
      phr: rnd() * TAU,
      ramp: shape === 3 ? lerp(0.03, 0.07, rnd()) : lerp(0.05, 0.16, rnd()),
      sw: (2 + d * 9) * driftScale,
      rsw: shape === 3 ? 0.055 : 0.02,
      spr: null,
    });
  };

  // A — motes above the far ridge: pollen, or stars, deliberately ambiguous
  for (let i = 0; i < 26; i++) {
    const x = rnd();
    const y = lerp(0.04, farRidge(x) - 0.02, Math.pow(rnd(), 0.7));
    push(
      x,
      y,
      lerp(0.02, 0.16, rnd()),
      lerp(1.1, 2.8, Math.pow(rnd(), 1.7)),
      lerp(0.14, 0.38, rnd()),
      2,
      lerp(0.4, 1, rnd()),
      0.6,
    );
  }

  // B — far meadow, between the two ridges: the dense receding carpet
  for (let i = 0; i < 72; i++) {
    const [x, f] = clump(0.075, 0.22);
    const a = farRidge(x);
    const bnd = nearRidge(x);
    const y = lerp(a, bnd, Math.pow(f, 0.72));
    const d = lerp(0.14, 0.42, f);
    const sh = rnd() < 0.58 ? 2 : rnd() < 0.5 ? 0 : 1;
    push(x, y, d, lerp(1.4, 5.5, f * f + rnd() * 0.3), lerp(0.3, 0.66, rnd()), sh, lerp(0.18, 1, rnd()));
  }

  // C — the near hillside. Depth climbs toward the bottom of the frame; size
  //     is deliberately long-tailed, so most blooms are small and a handful
  //     are large. A uniform size band is what makes generative art look
  //     stamped, and a stamped field is a screensaver.
  for (let i = 0; i < 98; i++) {
    const [x, f0] = clump(0.075, 0.2);
    const bnd = nearRidge(x);
    const f = Math.pow(f0, 0.82);
    const y = lerp(bnd - 0.012, 1.03, f);
    const d = lerp(0.44, 0.76, f);
    const sz = lerp(2.4, 26, clamp(f * 0.42 + Math.pow(rnd(), 3.1) * 0.85, 0, 1));
    push(x, y, d, sz, lerp(0.34, 0.8, rnd()), rnd() < 0.5 ? 0 : 1, lerp(0.12, 0.96, rnd()));
  }

  // C2 — grass-level dust between the blooms; pure texture, individually
  //      invisible, collectively the thing that makes the hillside inhabited
  for (let i = 0; i < 96; i++) {
    const [x, f] = clump(0.09, 0.3);
    const bnd = nearRidge(x);
    const y = lerp(bnd - 0.025, 1.05, Math.pow(f, 0.66));
    push(x, y, lerp(0.4, 0.7, rnd()), lerp(0.7, 2.3, rnd()), lerp(0.14, 0.36, rnd()), 2, lerp(0.28, 1, rnd()), 0.7);
  }

  // D — near foreground: large, soft, dim. This is what makes the frame deep.
  for (let i = 0; i < 17; i++) {
    const x = lerp(-0.06, 1.06, rnd());
    const y = lerp(0.86, 1.12, rnd());
    const d = lerp(0.82, 1, rnd());
    push(x, y, d, lerp(30, 74, rnd()), lerp(0.15, 0.33, rnd()), rnd() < 0.5 ? 0 : 1, lerp(0.05, 0.5, rnd()));
  }

  // E — stemmed blooms rooted below the frame, swaying from the base
  for (let i = 0; i < 17; i++) {
    const x = rnd() < 0.5 ? lerp(-0.02, 0.4, rnd()) : lerp(0.6, 1.02, rnd());
    const y = lerp(0.98, 1.26, rnd());
    const d = lerp(0.55, 0.82, rnd());
    push(x, y, d, lerp(12, 25, rnd()), lerp(0.36, 0.66, rnd()), 3, lerp(0.0, 0.45, rnd()));
  }

  // F — the six blooms that are unambiguously flowers: on the focus plane,
  //     brightest, crisp, held out of the headline column, always present.
  for (let i = 0; i < 6; i++) {
    const left = i % 2 === 0;
    const x = left ? lerp(0.04, 0.3, rnd()) : lerp(0.7, 0.96, rnd());
    const y = lerp(0.74, 0.94, rnd());
    push(x, y, lerp(0.42, 0.5, rnd()), lerp(17, 27, rnd()), lerp(0.6, 0.84, rnd()), rnd() < 0.5 ? 0 : 1, 0);
  }

  return out;
}

/* ── baked layers ────────────────────────────────────────────────────────── */
function ridgeTrace(g: CanvasRenderingContext2D, W: number, H: number, fn: (x: number) => number) {
  g.beginPath();
  g.moveTo(0, fn(0) * H);
  const step = 1 / 128;
  for (let x = step; x <= 1.0001; x += step) g.lineTo(x * W, fn(x) * H);
}

/** A wide, flat ellipse of light — moonrise hugging the horizon. */
function horizonGlow(
  g: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  stops: Array<[number, string]>,
  W: number,
  H: number,
) {
  g.save();
  g.translate(cx, cy);
  g.scale(1, ry / rx);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  for (const [p, c] of stops) rg.addColorStop(p, c);
  g.fillStyle = rg;
  g.fillRect(-W * 2, (-H * 2 * rx) / ry, W * 4, (H * 4 * rx) / ry);
  g.restore();
}

function paintBackground(W: number, H: number): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;

  // sky — abyss overhead, lifting toward the horizon. Many stops, because
  // banding across a dark gradient is what makes a dark page look cheap.
  const sky = g.createLinearGradient(0, 0, 0, H * 0.6);
  sky.addColorStop(0, "#090a0b");
  sky.addColorStop(0.22, "#0b0a0d");
  sky.addColorStop(0.42, "#0e0d12");
  sky.addColorStop(0.62, "#121018");
  sky.addColorStop(0.82, "#17141e");
  sky.addColorStop(1, "#1b1723");
  g.fillStyle = sky;
  g.fillRect(0, 0, W, Math.ceil(H * 0.6));
  g.fillStyle = "#1b1723";
  g.fillRect(0, Math.floor(H * 0.6) - 1, W, H);

  // the light source — a low, wide bloom of iris sitting on the far ridge.
  // This is the warmth the client asked for; it is the whole mood.
  g.globalCompositeOperation = "lighter";
  horizonGlow(
    g,
    W * 0.66,
    H * 0.585,
    W * 0.6,
    H * 0.135,
    [
      // deep-iris warmed toward orchid: the moonrise is violet, not blue
      [0, "rgba(140,101,190,0.27)"],
      [0.22, "rgba(110,88,182,0.125)"],
      [0.5, "rgba(85,76,172,0.042)"],
      [0.78, "rgba(75,73,170,0.012)"],
      [1, "rgba(75,73,170,0)"],
    ],
    W,
    H,
  );
  horizonGlow(
    g,
    W * 0.18,
    H * 0.605,
    W * 0.38,
    H * 0.095,
    [
      [0, "rgba(144,184,240,0.075)"],
      [0.42, "rgba(144,184,240,0.024)"],
      [1, "rgba(144,184,240,0)"],
    ],
    W,
    H,
  );
  g.globalCompositeOperation = "source-over";

  // far hill — a clear value step down from the lit sky
  ridgeTrace(g, W, H, farRidge);
  g.lineTo(W, H);
  g.lineTo(0, H);
  g.closePath();
  const farFill = g.createLinearGradient(0, H * 0.54, 0, H);
  farFill.addColorStop(0, "#0d0e13");
  farFill.addColorStop(0.5, "#0b0c10");
  farFill.addColorStop(1, "#0a0b0e");
  g.fillStyle = farFill;
  g.fill();

  // near hill — darker again, the mass the foreground blooms grow out of
  ridgeTrace(g, W, H, nearRidge);
  g.lineTo(W, H);
  g.lineTo(0, H);
  g.closePath();
  const nearFill = g.createLinearGradient(0, H * 0.66, 0, H);
  nearFill.addColorStop(0, "#08090c");
  nearFill.addColorStop(0.55, "#070809");
  nearFill.addColorStop(1, "#050506");
  g.fillStyle = nearFill;
  g.fill();

  // aerial perspective: a thin haze sitting on the near ridge, so the two
  // ground planes separate the way real distance separates them
  g.globalCompositeOperation = "lighter";
  horizonGlow(
    g,
    W * 0.5,
    H * 0.7,
    W * 0.7,
    H * 0.045,
    [
      [0, "rgba(160,158,205,0.05)"],
      [0.5, "rgba(150,150,200,0.016)"],
      [1, "rgba(150,150,200,0)"],
    ],
    W,
    H,
  );

  // the moonlit grass edge, clipped to the hill so it can only ever read as
  // an edge on a mass, never as a hairline floating in the sky
  g.save();
  ridgeTrace(g, W, H, nearRidge);
  g.lineTo(W, H);
  g.lineTo(0, H);
  g.closePath();
  g.clip();
  for (const [lw, a] of [
    [6, 0.012],
    [1.6, 0.022],
  ] as Array<[number, number]>) {
    ridgeTrace(g, W, H, nearRidge);
    g.lineWidth = lw;
    g.strokeStyle = `rgba(198,196,238,${a})`;
    g.stroke();
  }
  g.restore();
  g.globalCompositeOperation = "source-over";

  return cv;
}

/** Grain tile. Banding on dark gradients is what makes a dark page look cheap. */
function makeGrain(): HTMLCanvasElement {
  const N = 128;
  const cv = document.createElement("canvas");
  cv.width = N;
  cv.height = N;
  const g = cv.getContext("2d")!;
  const img = g.createImageData(N, N);
  const rnd = mulberry32(SEED ^ 0x5bf03);
  for (let i = 0; i < N * N; i++) {
    const v = rnd();
    img.data[i * 4] = 255;
    img.data[i * 4 + 1] = 255;
    img.data[i * 4 + 2] = 255;
    img.data[i * 4 + 3] = v < 0.58 ? 0 : Math.floor(v * 12);
  }
  g.putImageData(img, 0, 0);
  return cv;
}

function paintScrim(W: number, H: number, grain: HTMLCanvasElement): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;

  // top scrim — guarantees the nav and headline sit on near-pure obsidian
  const top = g.createLinearGradient(0, 0, 0, H * 0.58);
  top.addColorStop(0, "rgba(9,10,11,0.62)");
  top.addColorStop(0.4, "rgba(9,10,11,0.34)");
  top.addColorStop(0.75, "rgba(9,10,11,0.1)");
  top.addColorStop(1, "rgba(9,10,11,0)");
  g.fillStyle = top;
  g.fillRect(0, 0, W, Math.ceil(H * 0.58));

  // grounding vignette at the foot of the frame
  const bot = g.createLinearGradient(0, H * 0.84, 0, H);
  bot.addColorStop(0, "rgba(5,6,7,0)");
  bot.addColorStop(1, "rgba(5,6,7,0.34)");
  g.fillStyle = bot;
  g.fillRect(0, Math.floor(H * 0.84), W, Math.ceil(H * 0.16) + 1);

  // corner falloff
  const M = Math.max(W, H);
  const vig = g.createRadialGradient(W * 0.5, H * 0.52, M * 0.36, W * 0.5, H * 0.52, M * 0.88);
  vig.addColorStop(0, "rgba(5,6,7,0)");
  vig.addColorStop(1, "rgba(5,6,7,0.26)");
  g.fillStyle = vig;
  g.fillRect(0, 0, W, H);

  const pat = g.createPattern(grain, "repeat");
  if (pat) {
    g.globalAlpha = 0.45;
    g.fillStyle = pat;
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1;
  }
  return cv;
}

/* ── component ───────────────────────────────────────────────────────────── */
export type BloomFieldProps = {
  className?: string;
  /** 0 dims the field away entirely, 1 is the composed default. Capped at 1.5. */
  intensity?: number;
};

export default function BloomField({ className, intensity = 1 }: BloomFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  const refreshRef = useRef<(() => void) | null>(null);
  intensityRef.current = clamp(intensity, 0, 1.5);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Layout is generated once, in normalised space, so a resize re-projects
       the same meadow instead of reshuffling it. */
    const all = buildField();
    const cache = new Map<string, Sprite>();
    for (const b of all) {
      const key = `${b.ci}|${b.shape}|${b.blur}`;
      let s = cache.get(key);
      if (!s) {
        s = makeSprite(b.ci, b.shape, b.blur);
        cache.set(key, s);
      }
      b.spr = s;
    }
    const grain = makeGrain();

    let W = 0;
    let H = 0;
    let dpr = 1;
    let bg: HTMLCanvasElement | null = null;
    let scrim: HTMLCanvasElement | null = null;
    let field: Bloom[] = all;

    function resize() {
      const r = host!.getBoundingClientRect();
      const cw = Math.max(1, Math.round(r.width));
      const ch = Math.max(1, Math.round(r.height));
      let d = Math.min(2, globalThis.devicePixelRatio || 1);
      // Hard ceiling on device pixels, so a 5K display cannot tank the frame.
      // Set from measurement, not superstition: at 4.5M device px a frame costs
      // ~0.6ms, which leaves the 33ms budget essentially untouched. A retina
      // laptop hero therefore renders at native density; only genuinely huge
      // canvases get scaled down, and soft glows survive that gracefully.
      const MAXPX = 4_500_000;
      if (cw * ch * d * d > MAXPX) d = Math.max(1, Math.sqrt(MAXPX / (cw * ch)));
      if (cw === W && ch === H && d === dpr && bg) return;
      W = cw;
      H = ch;
      dpr = d;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      bg = paintBackground(canvas!.width, canvas!.height);
      scrim = paintScrim(canvas!.width, canvas!.height, grain);
      applyDensity();
    }

    /** Density follows width: a phone gets a sparser, calmer meadow. Ranks are
     *  monotone, so a wider viewport strictly adds blooms to the same picture
     *  rather than reshuffling it. */
    function applyDensity() {
      const k = clamp(W / 1280, 0.5, 1.0) * clamp(intensityRef.current, 0.3, 1.0);
      field = all.filter((b) => b.rank <= k);
    }

    function render(t: number) {
      const g = ctx!;
      const inten = intensityRef.current;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
      if (bg) g.drawImage(bg, 0, 0);

      g.globalCompositeOperation = "lighter";
      const s = (Math.min(W, H) / REF) * dpr;
      const bt = t * BREEZE_W;
      for (let i = 0; i < field.length; i++) {
        const b = field[i];
        const spr = b.spr!;
        const al = b.alpha * (1 + Math.sin(t * b.ws + b.phs) * b.samp) * inten;
        if (al <= 0.004) continue;
        const sway = Math.sin(bt - b.x * 3.6);
        const ox = (Math.sin(t * b.w1 + b.ph1) * b.ax + sway * b.sw) * s;
        const oy = Math.sin(t * b.w2 + b.ph2) * b.ay * s;
        const sc = 1 + Math.sin(t * b.wb + b.phb) * b.bamp;
        const rot = b.rot + Math.sin(t * b.wr + b.phr) * b.ramp + sway * b.rsw;
        const k = (b.size * s * sc) / spr.unit;
        const ky = k * b.sq;
        const co = Math.cos(rot);
        const sn = Math.sin(rot);
        g.globalAlpha = al < 1 ? al : 1;
        // rotate ∘ squash, so the head tilts as if lying on the ground plane
        g.setTransform(co * k, sn * k, -sn * ky, co * ky, b.x * W * dpr + ox, b.y * H * dpr + oy);
        g.drawImage(spr.c, -spr.ax, -spr.ay, spr.size, spr.size);
      }

      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
      if (scrim) g.drawImage(scrim, 0, 0);
    }

    resize();
    render(STATIC_T);

    if (reduce) {
      // a composed still, and no loop at all
      const roStatic = new ResizeObserver(() => {
        resize();
        render(STATIC_T);
      });
      roStatic.observe(host);
      refreshRef.current = () => {
        applyDensity();
        render(STATIC_T);
      };
      return () => {
        roStatic.disconnect();
        refreshRef.current = null;
      };
    }

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let visible = true;
    let onscreen = true;
    let running = false;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!last) {
        last = now;
        return;
      }
      const dt = now - last;
      if (dt < FRAME_MS) return;
      last = now;
      // clamped, so a stall never teleports the field
      elapsed += (dt < 100 ? dt : 100) / 1000;
      render(STATIC_T + elapsed);
    }

    function sync() {
      const want = visible && onscreen;
      if (want === running) return;
      running = want;
      if (want) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    const io = new IntersectionObserver(
      (es) => {
        onscreen = es.some((e) => e.isIntersecting);
        sync();
      },
      { rootMargin: "160px" },
    );
    io.observe(host);

    const onVis = () => {
      visible = document.visibilityState !== "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    let rraf = 0;
    const ro = new ResizeObserver(() => {
      if (rraf) return;
      rraf = requestAnimationFrame(() => {
        rraf = 0;
        resize();
        if (!running) render(STATIC_T + elapsed);
      });
    });
    ro.observe(host);

    refreshRef.current = () => {
      applyDensity();
      if (!running) render(STATIC_T + elapsed);
    };

    sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (rraf) cancelAnimationFrame(rraf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      refreshRef.current = null;
    };
  }, []);

  // intensity is read live by the render loop, but density and the
  // reduced-motion still both need an explicit nudge when it changes
  useEffect(() => {
    refreshRef.current?.();
  }, [intensity]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        // pre-hydration / no-JS ground, so this is never a blank black box
        background: "radial-gradient(120% 70% at 66% 58%, #1d1826 0%, #100e14 45%, #090a0b 100%)",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
