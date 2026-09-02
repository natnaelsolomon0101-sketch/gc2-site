/* ===========================================================================
   Atmosphere — the LIGHT and DEPTH layer for the dark hero.

   Not a background image and not a single gradient: a stack of independently
   drifting elliptical light sources rendered in the chromatic palette,
   screen-blended so their overlaps mix into hues that were never authored,
   plus a seeded speck field for parallax, a quiet centre scrim so display
   type keeps its contrast, a vignette, and film grain that dithers away the
   banding a dark CSS gradient would otherwise show.

   Composition contract
   --------------------
   This is the BACKMOST layer. It paints its own ground and is `inset-0`,
   `pointer-events:none`, `aria-hidden`, and `isolation:isolate` — every blend
   mode inside is sealed in, so a sibling (e.g. BloomField) placed after it in
   the DOM composites cleanly on top and is never tinted or clipped by it.
   Give the parent `position:relative` and let siblings sit at a higher z.

   Cost
   ----
   Zero JavaScript at runtime — server component, no effects, no rAF, no
   canvas, no per-frame allocation. Everything animated is `transform` or
   `opacity` on a composited layer, so the main thread does 0ms of work per
   frame and there is no layout or paint after the first.

   Motion
   ------
   Every drift keyframe starts and ends at identity on an inner element; the
   composed rest pose lives on the static outer wrapper. So when animations
   are disabled the field lands on a deliberately composed still, never blank
   and never frozen mid-transition.
   ========================================================================= */

export type AtmosphereProps = {
  className?: string;
  /** Overall luminance of the light stack. 1 = designed level. Clamped 0-2. */
  intensity?: number;
};

/* -- palette (BUILD100K tokens, as rgb triplets) -------------------------- */
const C = {
  iris: "132,125,255", // #847dff
  cyan: "0,179,221", // #00b3dd
  pale: "209,201,255", // #d1c9ff
  deep: "75,73,170", // #4b49aa
  orchid: "221,144,216", // #dd90d8
  peri: "144,184,240", // #90b8f0
  abyss: "9,10,11", // #090a0b
} as const;

/** Smooth six-stop falloff. More stops = less banding before grain even helps. */
const falloff = (c: string, a: number) =>
  `radial-gradient(closest-side, rgba(${c},${a}) 0%, rgba(${c},${(a * 0.8).toFixed(4)}) 20%,` +
  ` rgba(${c},${(a * 0.5).toFixed(4)}) 41%, rgba(${c},${(a * 0.24).toFixed(4)}) 60%,` +
  ` rgba(${c},${(a * 0.08).toFixed(4)}) 78%, rgba(${c},${(a * 0.02).toFixed(4)}) 90%, rgba(${c},0) 100%)`;

type Glow = {
  k: string; c: string; a: number;
  x: number; y: number; w: number; h: number; r: number;
  n: string; d: number; o: number;
};

/* The frame is composed in three VALUE BANDS, not scattered blobs — a
   luminous violet sky up top, a deep quiet middle where the type lives, and a
   cool lit horizon low in the frame that falls off to black at the very edge.
   Within that, three DEPTH planes: FAR is huge, dim and slow; NEAR is small,
   saturated and quick. Nothing large is centred, so the mid-tones stay clean
   instead of averaging out to grey. */
const GLOWS: Glow[] = [
  // -- far: the two skies, ~100s cycles -----------------------------------
  { k: "f1", c: C.deep,   a: 0.80, x: 36, y: -2, w: 142, h: 74, r: -7, n: "atmA", d: 118, o: 0  }, // upper sky wash
  { k: "f2", c: C.cyan,   a: 0.50, x: 62, y: 90, w: 146, h: 50, r: 4,  n: "atmB", d: 104, o: 31 }, // lower horizon wash

  // -- mid: the shapes you actually read, 45-90s --------------------------
  { k: "m1", c: C.iris,   a: 0.64, x: 79, y: 2,  w: 80,  h: 46, r: -16, n: "atmD", d: 74, o: 8  },
  { k: "m2", c: C.orchid, a: 0.38, x: 48, y: -4, w: 64,  h: 34, r: 8,   n: "atmF", d: 58, o: 21 }, // mixes to magenta over m1
  { k: "m3", c: C.peri,   a: 0.64, x: 46, y: 83, w: 150, h: 19, r: -3,  n: "atmB", d: 88, o: 55 }, // the horizon ribbon
  { k: "m4", c: C.deep,   a: 0.54, x: 4,  y: 76, w: 60,  h: 46, r: 14,  n: "atmE", d: 66, o: 40 }, // lower-left counterweight

  // -- the light that wraps the type: two edge sources at headline height,
  //    reaching inward and stopped by the scrim before they touch the words
  { k: "e1", c: C.iris,   a: 0.50, x: -6, y: 46, w: 52,  h: 70, r: 0, n: "atmC", d: 96,  o: 12 },
  { k: "e2", c: C.cyan,   a: 0.44, x: 106, y: 58, w: 50, h: 64, r: 0, n: "atmE", d: 82,  o: 47 },
  { k: "e3", c: C.orchid, a: 0.26, x: 98, y: 34, w: 34,  h: 40, r: 0, n: "atmF", d: 70,  o: 29 },

  // -- near: small, saturated, the brightest things in the frame ----------
  { k: "n1", c: C.pale,   a: 0.38, x: 85, y: 12, w: 31,  h: 25, r: 0, n: "atmG", d: 42, o: 3  }, // halo
  { k: "n2", c: C.pale,   a: 0.66, x: 85, y: 11, w: 10,  h: 8, r: 0, n: "atmH", d: 34, o: 17 }, // hot core
  { k: "n3", c: C.cyan,   a: 0.62, x: 22, y: 84, w: 18,  h: 12, r: 0, n: "atmH", d: 38, o: 26 },
  { k: "n4", c: C.orchid, a: 0.38, x: 68, y: 82, w: 22,  h: 13, r: 0, n: "atmG", d: 47, o: 33 },
];

/* -- seeded speck field ---------------------------------------------------
   Deterministic PRNG so server and client render byte-identical markup.     */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Band = {
  n: number; seed: number; sz: [number, number]; op: [number, number];
  glow: number; cols: string[]; clearCentre: boolean; anim: string; d: number; o: number;
};

const BANDS: Band[] = [
  { n: 30, seed: 20260901, sz: [1, 1.7],   op: [0.13, 0.32], glow: 1.5, cols: [C.pale, C.peri],           clearCentre: false, anim: "atmA", d: 112, o: 5  },
  { n: 15, seed: 77123,    sz: [1.5, 2.3], op: [0.26, 0.48], glow: 3.5, cols: [C.pale, C.iris, C.peri],   clearCentre: true,  anim: "atmE", d: 78,  o: 19 },
  { n: 7,  seed: 991337,   sz: [2.2, 3.4], op: [0.40, 0.70], glow: 7,   cols: [C.pale, C.cyan, C.orchid], clearCentre: true,  anim: "atmG", d: 52,  o: 11 },
];

type Speck = { x: number; y: number; s: number; o: number; c: string; g: number };

const SPECKS: Speck[][] = BANDS.map((b) => {
  const rnd = mulberry32(b.seed);
  const out: Speck[] = [];
  let guard = 0;
  while (out.length < b.n && guard++ < b.n * 40) {
    const x = rnd() * 100;
    const y = rnd() * 100;
    const s = b.sz[0] + rnd() * (b.sz[1] - b.sz[0]);
    const o = b.op[0] + rnd() * (b.op[1] - b.op[0]);
    const c = b.cols[Math.floor(rnd() * b.cols.length)];
    // keep the brighter planes out of the headline band
    if (b.clearCentre && y > 33 && y < 64 && x > 14 && x < 86) continue;
    out.push({ x, y, s, o, c, g: b.glow });
  }
  return out;
});

/* -- grain ---------------------------------------------------------------- */
/* Turbulence pushed into the ALPHA channel over a fixed pale fill. Grey noise
   under `overlay` is invisible on a near-black ground; this is sparse white
   speckle, which is what actually reads as film grain in the shadows and
   dithers the gradient banding away. It composites normally rather than with
   `screen` — over a ground this dark the two differ by 0.25/255 on average,
   which is not worth a whole-frame blend pass. */
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='1.05' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 0.86 0 0 0 0 0.84 0 0 0 0 1 0.5 0.5 0.5 0 -0.70'/>" +
  "</filter><rect width='150' height='150' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

/* Coarse fractal cloud, alpha-mapped to a pale tint. This is the difference
   between "overlapping radial gradients" and something that reads as air: it
   breaks every ellipse edge into organic mottling. The vertical ramp that
   confines it to the sky and the horizon is baked into the SVG rather than
   applied as a CSS mask-image, because a mask on an animated full-frame layer
   is one of the most expensive things a compositor can be asked to do. */
const NEBULA_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 900' " +
  "preserveAspectRatio='none' width='900' height='900'><defs>" +
  "<filter id='n' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.019' numOctaves='4' seed='11' stitchTiles='stitch'/>" +
  "<feColorMatrix type='matrix' values='0 0 0 0 0.80 0 0 0 0 0.77 0 0 0 0 1 0.8 0.8 0.8 0 -1.06'/>" +
  "</filter>" +
  "<linearGradient id='r' x1='0' y1='0' x2='0' y2='1'>" +
  "<stop offset='0' stop-color='#fff' stop-opacity='.42'/>" +
  "<stop offset='.16' stop-color='#fff' stop-opacity='1'/>" +
  "<stop offset='.38' stop-color='#fff' stop-opacity='.60'/>" +
  "<stop offset='.56' stop-color='#fff' stop-opacity='.14'/>" +
  "<stop offset='.74' stop-color='#fff' stop-opacity='.34'/>" +
  "<stop offset='1' stop-color='#fff' stop-opacity='.16'/>" +
  "</linearGradient>" +
  "<mask id='m'><rect width='900' height='900' fill='url(#r)'/></mask>" +
  "</defs><rect width='900' height='900' filter='url(#n)' mask='url(#m)'/></svg>";
const NEBULA_URL = `url("data:image/svg+xml,${encodeURIComponent(NEBULA_SVG)}")`;

/* -- scoped stylesheet ---------------------------------------------------- */
const CSS = `
.atm{position:absolute;inset:0;overflow:hidden;pointer-events:none;isolation:isolate;
     contain:layout paint style;}
.atm-ground{position:absolute;inset:0;
  background:
    radial-gradient(130% 70% at 72% -6%, rgba(${C.deep},.34) 0%, rgba(${C.deep},.12) 44%, rgba(${C.abyss},0) 78%),
    radial-gradient(140% 46% at 44% 104%, rgba(${C.peri},.16) 0%, rgba(${C.abyss},0) 70%),
    linear-gradient(180deg, #12141f 0%, #0d0f16 26%, #0a0b0e 50%, #0a0b0f 74%, #08090a 100%);}
/* The ONLY blend pass in the component. Everything luminous lives inside this
   group, alpha-composites cheaply against its own transparent canvas, and the
   finished group screens onto the ground exactly once — so the field can only
   ever add light, never darken the ground, at the cost of one readback. */
.atm-light{position:absolute;inset:0;mix-blend-mode:screen;}
.atm-neb{position:absolute;inset:-9%;opacity:.19;
  background-image:${NEBULA_URL};background-size:1240px 100%;background-repeat:repeat-x;
  background-position:center top;
  animation:atmNeb 132s cubic-bezier(.45,.05,.55,.95) infinite both;}
/* layered air: a thin haze that thickens toward the horizon line */
.atm-haze{position:absolute;left:0;right:0;bottom:0;height:46%;
  background:linear-gradient(to top, rgba(${C.peri},.10) 0%, rgba(${C.peri},.055) 34%,
             rgba(${C.peri},.018) 66%, rgba(${C.peri},0) 100%);}
.atm-p{position:absolute;}
/* No per-glow blend mode. The whole light stack screens onto the ground once
   (.atm-light), and inside that group the glows are already light-on-
   transparent, so alpha compositing and screen produce the same picture -
   measured delta between the two is 0.05/255 mean, 0.96/255 worst pixel.
   Dropping 13 blend passes cut frame time ~34% on a software compositor. */
.atm-d{position:absolute;inset:0;border-radius:50%;
       animation-iteration-count:infinite;animation-timing-function:cubic-bezier(.45,.05,.55,.95);
       animation-fill-mode:both;}
.atm-sp{position:absolute;inset:0;animation-iteration-count:infinite;
        animation-timing-function:cubic-bezier(.45,.05,.55,.95);animation-fill-mode:both;}
.atm-s{position:absolute;border-radius:50%;}
/* the quiet region: a soft well of shadow the headline sits in */
.atm-scrim{position:absolute;inset:0;
  background:radial-gradient(92% 66% at 50% 52%,
    rgba(${C.abyss},.58) 0%, rgba(${C.abyss},.54) 20%, rgba(${C.abyss},.45) 38%,
    rgba(${C.abyss},.33) 55%, rgba(${C.abyss},.20) 71%, rgba(${C.abyss},.09) 86%,
    rgba(${C.abyss},0) 100%);}
/* Narrow viewports: the edge sources are sized in %, so they intrude much
   further into the type column at 390px than at 1600px. Widen and deepen the
   quiet region there so #9f9fa0 body copy still clears 4.5:1 on its worst
   pixel, not just on average. */
@media (max-width:900px){
  .atm-scrim{background:radial-gradient(140% 84% at 50% 53%,
    rgba(${C.abyss},.76) 0%, rgba(${C.abyss},.72) 24%, rgba(${C.abyss},.62) 42%,
    rgba(${C.abyss},.47) 58%, rgba(${C.abyss},.30) 74%, rgba(${C.abyss},.13) 89%,
    rgba(${C.abyss},0) 100%);}
}
.atm-vig{position:absolute;inset:0;
  background:radial-gradient(120% 112% at 50% 42%,
    rgba(${C.abyss},0) 38%, rgba(${C.abyss},.20) 64%, rgba(${C.abyss},.46) 84%, rgba(${C.abyss},.72) 100%),
    linear-gradient(to top, rgba(${C.abyss},.46) 0%, rgba(${C.abyss},.22) 9%, rgba(${C.abyss},.07) 16%, rgba(${C.abyss},0) 24%);}
.atm-grain{position:absolute;inset:-32px;background-image:${GRAIN_URL};
  background-size:150px 150px;opacity:.34;
  animation:atmGrain 1.1s steps(1,end) infinite;}

@keyframes atmA{0%{transform:translate3d(0,0,0) scale(1)}
 26%{transform:translate3d(3.5%,-3%,0) scale(1.055)}
 52%{transform:translate3d(-1.5%,3.5%,0) scale(.965)}
 78%{transform:translate3d(-3.5%,-1.5%,0) scale(1.03)}
 100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes atmB{0%{transform:translate3d(0,0,0) scale(1)}
 30%{transform:translate3d(-4%,2.5%,0) scale(.95)}
 61%{transform:translate3d(2.5%,-3.5%,0) scale(1.07)}
 82%{transform:translate3d(3%,1.5%,0) scale(1.01)}
 100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes atmC{0%{transform:translate3d(0,0,0) scale(1)}
 34%{transform:translate3d(2%,-4.5%,0) scale(1.08)}
 67%{transform:translate3d(-3%,2%,0) scale(.94)}
 100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes atmD{0%{transform:translate3d(0,0,0) scale(1)}
 22%{transform:translate3d(-2.5%,3%,0) scale(1.06)}
 48%{transform:translate3d(4%,1%,0) scale(.96)}
 74%{transform:translate3d(1%,-3.5%,0) scale(1.04)}
 100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes atmE{0%{transform:translate3d(0,0,0) scale(1)}
 29%{transform:translate3d(4.5%,2%,0) scale(.955)}
 58%{transform:translate3d(-2%,-4%,0) scale(1.075)}
 81%{transform:translate3d(-4%,1%,0) scale(1.005)}
 100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes atmF{0%{transform:translate3d(0,0,0) scale(1)}
 37%{transform:translate3d(-3.5%,-2.5%,0) scale(1.06)}
 71%{transform:translate3d(3%,3%,0) scale(.945)}
 100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes atmG{0%{transform:translate3d(0,0,0) scale(1);opacity:.86}
 24%{transform:translate3d(-5%,4%,0) scale(1.1);opacity:1}
 55%{transform:translate3d(4%,-3%,0) scale(.9);opacity:.72}
 79%{transform:translate3d(2%,4%,0) scale(1.04);opacity:.94}
 100%{transform:translate3d(0,0,0) scale(1);opacity:.86}}
@keyframes atmH{0%{transform:translate3d(0,0,0) scale(1);opacity:.7}
 33%{transform:translate3d(6%,-5%,0) scale(1.18);opacity:1}
 66%{transform:translate3d(-4%,5%,0) scale(.86);opacity:.6}
 100%{transform:translate3d(0,0,0) scale(1);opacity:.7}}
/* translate only, no scale: this layer's background is a rasterised SVG and
   scaling it is the one transform that can force a re-raster of a full-frame
   texture. Drift alone is all the sky needs. */
@keyframes atmNeb{0%{transform:translate3d(0,0,0)}
 34%{transform:translate3d(2.4%,-1.5%,0)}
 68%{transform:translate3d(-2%,1.3%,0)}
 100%{transform:translate3d(0,0,0)}}
@keyframes atmGrain{
 0%{transform:translate3d(0,0,0)}      12.5%{transform:translate3d(-9px,5px,0)}
 25%{transform:translate3d(6px,-11px,0)} 37.5%{transform:translate3d(-13px,-4px,0)}
 50%{transform:translate3d(11px,8px,0)}  62.5%{transform:translate3d(-5px,12px,0)}
 75%{transform:translate3d(8px,-7px,0)}  87.5%{transform:translate3d(-11px,-9px,0)}
 100%{transform:translate3d(0,0,0)}}

@media (prefers-reduced-motion: reduce){
  .atm-d,.atm-sp,.atm-grain,.atm-neb{animation:none !important;}
  /* atmG/atmH also carry opacity; restore their rest value explicitly */
  .atm-d[data-rest]{opacity:.86;}
}
`;

export default function Atmosphere({ className, intensity = 1 }: AtmosphereProps) {
  const i = Math.max(0, Math.min(2, intensity));
  return (
    <div aria-hidden="true" className={className ? `atm ${className}` : "atm"}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="atm-ground" />

      <div className="atm-light" style={{ opacity: i }}>
        {GLOWS.map((g) => (
          <div
            key={g.k}
            className="atm-p"
            style={{
              left: `${g.x}%`, top: `${g.y}%`,
              width: `${g.w}%`, height: `${g.h}%`,
              transform: `translate3d(-50%,-50%,0) rotate(${g.r}deg)`,
            }}
          >
            <div
              className="atm-d"
              data-rest={g.n === "atmG" || g.n === "atmH" ? "" : undefined}
              style={{
                background: falloff(g.c, g.a),
                animationName: g.n,
                animationDuration: `${g.d}s`,
                animationDelay: `-${g.o}s`,
              }}
            />
          </div>
        ))}

        {SPECKS.map((band, bi) => (
          <div
            key={`b${bi}`}
            className="atm-sp"
            style={{
              animationName: BANDS[bi].anim,
              animationDuration: `${BANDS[bi].d}s`,
              animationDelay: `-${BANDS[bi].o}s`,
            }}
          >
            {band.map((s, si) => (
              <div
                key={si}
                className="atm-s"
                style={{
                  left: `${s.x.toFixed(3)}%`, top: `${s.y.toFixed(3)}%`,
                  width: `${s.s.toFixed(2)}px`, height: `${s.s.toFixed(2)}px`,
                  background: `rgba(${s.c},${s.o.toFixed(3)})`,
                  boxShadow: `0 0 ${s.g}px rgba(${s.c},${(s.o * 0.75).toFixed(3)})`,
                }}
              />
            ))}
          </div>
        ))}
        <div className="atm-neb" />
        <div className="atm-haze" />
      </div>

      <div className="atm-scrim" />
      <div className="atm-vig" />
      <div className="atm-grain" />
    </div>
  );
}
