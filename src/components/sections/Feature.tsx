import Link from "next/link";
import { site } from "@/config/site";
import { strategies } from "@/content/strategies";

/* ===========================================================================
   FEATURE — the colour moment.

   The section that carries ONE idea: six strategies, one risk framework,
   because correlated risk does not respect a mandate boundary.

   WHY IT LOOKS LIKE THIS
   ----------------------
   The page around it is dark, typographic and hairline-ruled: a data table
   (MarketsBand), a ledger (Approach), an editorial index (Insights). None of
   those stop a thumb. This one is built to — a saturated full-bleed field of
   orchid-to-periwinkle carrying display serif at 72px, a deep-iris column
   beside it, and a luminous line drawing bled to both edges underneath.

   It is image-led without an image: no photography is available or permitted,
   so the picture is drawn — six coloured strands, one per strategy, in the
   same identity hues MarketsBand assigns them, converging into a single white
   line. That drawing IS the claim in the headline, so the section says the
   thing twice, once in type and once in light.

   What keeps it a fund and not a brand deck: nothing here is decorative
   language. The headline is a structural fact, the sentence under it is the
   reason, the four-cell ledger is the firm's own registration data, and the
   quote is the Investment Committee's. No florals, no soft focus, no
   empowerment copy, no colour used as gender shorthand — the warmth is light
   and temperature, and the seriousness is that every word is sourced.

   SOURCES — nothing on this section is invented
     "Six strategies. One risk framework."   strategies.length + Approach.tsx
     "correlated risk … mandate boundary"    Approach.tsx, tail-overlay block
     "limits set once, firm-wide"            MarketsBand ledger, "One, firm-wide"
     Formed / Domicile / Structure / Mandate src/config/site.ts
     The quote                               firm copy, Investment Committee
     Strand hues                             MarketsBand HUE map, same order

   COLOUR — measured, per surface, because foreground is not uniform
     Warm slab is a gradient of three tokens; black text is measured at every
     stop and never drops below the darkest of them:
       black on orchid    #dd90d8   9.06:1   (gradient start)
       black on pale-iris #d1c9ff  13.51:1
       black on periwinkle #90b8f0 10.30:1
       black on the orchid→pale midpoint     11.08:1
       black on the pale→periwinkle midpoint 11.85:1
       obsidian #0f1011 body text on orchid   8.21:1  (worst stop)
     Deep-iris slab is the ONLY tile that takes white:
       white  #ffffff on deep-iris #4b49aa    7.41:1
       pale-iris attribution on deep-iris     4.77:1
     On the abyss ground #090a0b:
       pale-iris kicker 12.75 · cloud 18.20 · silver 12.09 · orchid 8.54
       periwinkle 9.72 · cyan 8.01 · iris 6.00
     deep-iris is deliberately never a mark on abyss (2.67:1) — it is used
     there only as unfocused bloom, never as a line or a letter.

   MOTION — one idea, slow. Light travels down each strand into the junction,
   and the bloom breathes. Both stop dead under prefers-reduced-motion; the
   drawing is complete and legible with every animation removed.

   Server component. No client JS, no dependencies, no imagery.
   ========================================================================= */

/** Index-matched to `strategies`, same hues MarketsBand gives the six books. */
const STRANDS: { hue: string; y: number }[] = [
  { hue: "var(--color-periwinkle)", y: 16 }, //     systematic macro      9.72:1 on abyss
  { hue: "var(--color-cyan-signal)", y: 70 }, //    volatility arbitrage  8.01:1
  { hue: "var(--color-iris-gleam)", y: 124 }, //    statistical rel value 6.00:1
  { hue: "var(--color-orchid-bloom)", y: 176 }, //  commodity carry       8.54:1
  { hue: "var(--color-pale-iris)", y: 230 }, //     event dislocation    12.75:1
  { hue: "var(--color-silver)", y: 284 }, //        tail overlay         12.09:1
];

/** The junction, in viewBox units, and as the percentages the HTML dot uses. */
const JOIN_X = 1010;
const JOIN_Y = 150;
const VB_W = 1440;
const VB_H = 300;

const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

/** site.ts, verbatim. No AUM, no people, no address — none exist. */
const ledger: { label: string; value: string }[] = [
  { label: "Formed", value: site.foundedLabel },
  { label: "Domicile", value: site.city },
  { label: "Structure", value: site.structure },
  { label: "Mandate", value: site.mandate },
];

const css = `
/* ---------------------------------------------------------------- the band */
.ft {
  position: relative; isolation: isolate; overflow: hidden;
  background: var(--color-abyss);
  border-top: 1px solid rgba(255,255,255,.09);
  padding-block: 84px 0;
}
@media (min-width: 768px) { .ft { padding-block: 120px 0; } }

/* Light behind everything. Sits under the slabs, so it can never touch the
   contrast of any text — it only lifts the ground the drawing sits on. */
.ft-bloom {
  position: absolute; inset: -25% -12% -10%; z-index: -2; pointer-events: none;
  background:
    radial-gradient(44% 40% at 16% 20%,
      color-mix(in srgb, var(--color-orchid-bloom) 30%, transparent), transparent 72%),
    radial-gradient(42% 46% at 86% 26%,
      color-mix(in srgb, var(--color-deep-iris) 55%, transparent), transparent 74%),
    radial-gradient(64% 44% at 52% 104%,
      color-mix(in srgb, var(--color-periwinkle) 18%, transparent), transparent 72%);
  filter: blur(26px);
  animation: ftBreathe 26s ease-in-out infinite alternate;
}
@keyframes ftBreathe {
  from { transform: translate3d(0,0,0) scale(1); opacity: .82; }
  to   { transform: translate3d(0,-2%,0) scale(1.06); opacity: 1; }
}

/* Grain. Keeps a large flat dark ground from looking like flat dark ink. */
.ft-noise {
  position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%;
  opacity: .05; pointer-events: none;
}

/* --------------------------------------------------------------- head row */
.ft-head-row { display: flex; align-items: center; gap: 20px; }
.ft-spectrum {
  display: flex; flex: 1 1 auto; height: 3px; min-width: 80px;
  border-radius: 2px; overflow: hidden;
}
.ft-spectrum > span { flex: 1 1 0; }

/* ---------------------------------------------------------------- mosaic */
.ft-mosaic { display: grid; gap: 14px; margin-top: 28px; }
@media (min-width: 768px) {
  .ft-mosaic { grid-template-columns: repeat(12, minmax(0,1fr)); gap: 16px; margin-top: 40px; }
  .ft-a { grid-column: span 7; }
  .ft-b { grid-column: span 5; }
}
@media (min-width: 1024px) { .ft-a { grid-column: span 8; } .ft-b { grid-column: span 4; } }

.ft-slab {
  position: relative; overflow: hidden;
  border-radius: var(--radius-tile);
  display: flex; flex-direction: column;
}

/* The warm field. Three tokens, no invented colour between them; black clears
   9:1 at every point along the ramp. */
.ft-a {
  background: linear-gradient(148deg,
    var(--color-orchid-bloom) 0%,
    var(--color-pale-iris) 48%,
    var(--color-periwinkle) 100%);
  color: var(--color-void);
  padding: 30px 26px 26px;
}
@media (min-width: 768px) { .ft-a { padding: 44px 40px 36px; } }
@media (min-width: 1280px) { .ft-a { padding: 56px 52px 44px; } }

/* A highlight, not a tint: white only lightens, so contrast can only improve. */
.ft-a::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(58% 52% at 88% -6%, rgba(255,255,255,.42), transparent 68%);
}
.ft-a > * { position: relative; z-index: 1; }

/* Sized so the second sentence holds one line from 1024px up — the slab's
   inner measure is fixed at 685px once .wrap hits its 1200px cap, and
   "One risk framework." sets at 62px inside it. Below that it wraps, which is
   what a display face is for. */
.ft-head {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(38px, 4.7vw, 62px); line-height: .94; letter-spacing: -.024em;
  color: var(--color-void); margin-top: 20px;
}
.ft-lede {
  font-size: clamp(16px, 1.45vw, 19px); line-height: 1.55; font-weight: 300;
  color: var(--color-obsidian); max-width: 27em; margin-top: 18px;
}
.ft-link {
  display: inline-flex; align-items: center; gap: 10px; align-self: flex-start;
  min-height: 44px; margin-top: 18px; padding-right: 2px;
  font-size: 16px; color: var(--color-void);
  border-bottom: 1px solid rgba(0,0,0,.34);
  transition: border-color .2s ease, gap .2s ease;
}
.ft-link:hover { border-color: var(--color-void); gap: 14px; }
.ft-link svg { transition: transform .2s ease; }
.ft-link:hover svg { transform: translateX(3px); }

/* The registration ledger. It is here to do a job: a saturated colour field
   with four hard facts on it reads as a firm, not as a poster. */
.ft-ledger {
  margin-top: auto; padding-top: 30px;
  display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); column-gap: 18px;
}
@media (min-width: 1024px) { .ft-ledger { grid-template-columns: repeat(4, minmax(0,1fr)); } }
.ft-cell {
  border-top: 1px solid rgba(0,0,0,.24);
  padding: 12px 0 0;
}
.ft-cell dt { color: var(--color-obsidian); }
.ft-cell dd { margin-top: 2px; font-size: 15px; line-height: 1.35; color: var(--color-void); }

/* The cool column. deep-iris is the one tile in the system that takes white. */
.ft-b {
  background: var(--color-deep-iris);
  color: var(--color-pure);
  padding: 30px 26px; gap: 28px; justify-content: space-between;
}
@media (min-width: 768px) { .ft-b { padding: 40px 32px; } }
@media (min-width: 1280px) { .ft-b { padding: 52px 40px; } }
/* The junction light from the drawing below, echoed inside the tile. It is a
   bottom-edge glow and never reaches the type: white on deep-iris measures
   7.41:1 everywhere a letter actually sits. */
.ft-b::before {
  content: ""; position: absolute; inset: auto 0 0 0; height: 62%;
  pointer-events: none;
  background: radial-gradient(72% 100% at 50% 128%,
    color-mix(in srgb, var(--color-pale-iris) 40%, transparent), transparent 70%);
}
.ft-b::after {
  content: ""; position: absolute; inset: auto -34% -38% auto;
  width: 68%; aspect-ratio: 1; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.22); pointer-events: none;
}
.ft-b > * { position: relative; z-index: 1; }
.ft-quote {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(23px, 2.4vw, 34px); line-height: 1.16; letter-spacing: -.014em;
  color: var(--color-pure); text-wrap: pretty;
}
.ft-attrib {
  color: var(--color-pale-iris);
  border-top: 1px solid rgba(255,255,255,.24); padding-top: 14px;
}

/* ------------------------------------------------------------ the drawing */
.ft-draw { position: relative; width: 100%; height: 172px; margin-top: 52px; }
@media (min-width: 768px) { .ft-draw { height: 232px; margin-top: 80px; } }
@media (min-width: 1280px) { .ft-draw { height: 268px; } }
.ft-svg { display: block; width: 100%; height: 100%; }

/* Non-uniform scaling is deliberate: the drawing stretches to any viewport and
   the strokes stay 1.5px because of vector-effect. The junction cannot live in
   the SVG for the same reason — a circle would scale into an ellipse — so it is
   an HTML element positioned on the same percentages. */
.ft-glow { filter: blur(5px); }
.ft-spark { animation: ftFlow 12s linear infinite; }
@keyframes ftFlow { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }

.ft-join {
  position: absolute; z-index: 1;
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--color-pure);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 6px rgba(255,255,255,.14), 0 0 26px 8px rgba(209,201,255,.42);
  animation: ftPulse 6s ease-in-out infinite;
}
@keyframes ftPulse {
  0%, 100% { box-shadow: 0 0 0 6px rgba(255,255,255,.12), 0 0 22px 6px rgba(209,201,255,.34); }
  50%      { box-shadow: 0 0 0 9px rgba(255,255,255,.18), 0 0 34px 12px rgba(209,201,255,.55); }
}

@media (prefers-reduced-motion: reduce) {
  .ft-spark { display: none; }
  .ft-bloom, .ft-join { animation: none; }
}
`;

export default function Feature() {
  const count = COUNT[strategies.length] ?? String(strategies.length);

  return (
    <section id="framework" className="ft" aria-labelledby="feature-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ft-bloom" aria-hidden="true" />
      <svg className="ft-noise" aria-hidden="true" focusable="false">
        <filter id="ftGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ftGrain)" />
      </svg>

      <div className="wrap">
        {/* the six, stated as colour before they are stated as a sentence */}
        <div className="ft-head-row">
          <p className="t-mono-xs text-pale-iris">Risk framework</p>
          <div className="ft-spectrum" aria-hidden="true">
            {STRANDS.map((s) => (
              <span key={s.y} style={{ background: s.hue }} />
            ))}
          </div>
        </div>

        <div className="ft-mosaic">
          {/* ------------------------------------------------- the warm field */}
          <div className="ft-slab ft-a">
            <h2 id="feature-title" className="ft-head">
              Correlated risk does not
              <br />
              respect a mandate boundary.
            </h2>

            <p className="ft-lede">
              So the limits are set once, firm-wide, and all {count.toLowerCase()} strategies
              run inside them. One framework, not six.
            </p>

            <Link href="/firm" className="ft-link">
              How risk is governed
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
              >
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
            </Link>

            <dl className="ft-ledger">
              {ledger.map((l) => (
                <div key={l.label} className="ft-cell">
                  <dt className="t-mono-xs">{l.label}</dt>
                  <dd>{l.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* -------------------------------------------------- the cool column */}
          <div className="ft-slab ft-b">
            <blockquote className="ft-quote">
              Risk is not the price of return. It is what we manage so that we are still
              here when the return arrives.
            </blockquote>
            <p className="t-mono-xs ft-attrib">Investment Committee</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- the drawing */}
      <div className="ft-draw">
        <svg
          className="ft-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${count} strands, one for each strategy, converging into a single line: one risk framework.`}
        >
          {STRANDS.map((s, i) => {
            const d = `M 0 ${s.y} C 340 ${s.y}, 640 ${JOIN_Y}, ${JOIN_X} ${JOIN_Y}`;
            return (
              <g key={s.y}>
                <path
                  className="ft-glow"
                  d={d}
                  fill="none"
                  stroke={s.hue}
                  strokeWidth="8"
                  opacity="0.2"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={d}
                  fill="none"
                  stroke={s.hue}
                  strokeWidth="1.5"
                  opacity="0.92"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="ft-spark"
                  d={d}
                  pathLength={1000}
                  fill="none"
                  stroke={s.hue}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="26 974"
                  vectorEffect="non-scaling-stroke"
                  style={{ animationDelay: `${i * -1.85}s` }}
                />
              </g>
            );
          })}

          {/* one line out */}
          <path
            className="ft-glow"
            d={`M ${JOIN_X} ${JOIN_Y} L ${VB_W} ${JOIN_Y}`}
            fill="none"
            stroke="var(--color-pale-iris)"
            strokeWidth="10"
            opacity="0.24"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M ${JOIN_X} ${JOIN_Y} L ${VB_W} ${JOIN_Y}`}
            fill="none"
            stroke="var(--color-cloud)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          className="ft-join"
          aria-hidden="true"
          style={{ left: `${(JOIN_X / VB_W) * 100}%`, top: `${(JOIN_Y / VB_H) * 100}%` }}
        />
      </div>
    </section>
  );
}
