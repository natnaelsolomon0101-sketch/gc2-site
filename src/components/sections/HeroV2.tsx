"use client";

/* ===========================================================================
   HeroV2 — "ruled composition, one hard-edged step wedge of light".

   Self-contained. Renders its own <section>, its own ground, its own light.
   Drop it in place of the entire existing hero block (the <section> that
   currently wraps <Atmosphere/>); it does not need Atmosphere and does not
   read anything from the page around it except the site config.

   WHY THIS AND NOT ANOTHER GRADIENT
   ---------------------------------
   Three hero attempts failed the same way: nothing had an edge. Flat black had
   no light; the bloom field and the violet/teal wash had light but no
   structure, so both read as stock backgrounds. What reads as expensive in a
   dark 2026 interface is precision — a grid you can feel, type that sets the
   layout instead of sitting inside it, light with a boundary, and motion that
   is exact rather than drifting.

   So the whole composition is built from lines:

   - A 12-column hairline grid locked to the site's 1200px measure. It is the
     skeleton, and every other element lands on one of its lines.
   - A masthead of real facts (city, structure, mandate, live Austin time),
     mono, ruled above and below. No invented numbers anywhere — everything
     shown is from config or is the actual clock.
   - The display type left-aligned on the column-1 line, sized so that
     "Evidence first." measures almost exactly eight columns. The layout is
     built around the type, not the other way round.
   - ONE luminous element, and it is made of the grid rather than laid over it:
     the last four columns of the measure plus the bleed out to the viewport
     edge are lit individually, each step brighter and more open than the one
     to its left, with the 24px gutters left black between them. Inside each
     strip the light is immediately cut into a louvre of 1px hard-stop rules.
     Hard stops, never blur: the light is dithered into structure, so it cannot
     go hazy. The masthead bar and the full-bleed rules cut across it.
   - Fine static grain over everything, which is what makes a flat dark field
     read filmic instead of empty.

   MOTION (exact, not floaty)
   --------------------------
   One-shot on load: the two display lines rise under a hard mask, the rules
   draw left to right, and the wedge wipes down one step at a time. Steady
   state is two composited transforms — the light sliding behind the fixed
   louvre (22s, ±7%), and a 1px index hairline stepping down the lit field in
   20 discrete jumps (8s, steps(), one step every 400ms) — plus one text node
   updated once a second for the clock. No rAF, no canvas, no layout, and no
   paint after the first frame.

   Every animation is one-shot-to-identity or lives inside
   `prefers-reduced-motion: no-preference`, so the base stylesheet IS the
   composed static state. Reduced motion also drops the clock's seconds and
   stops its interval.
   ========================================================================= */

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/site";

/* -- grain ---------------------------------------------------------------
   Turbulence pushed into the alpha channel over a fixed pale fill: sparse
   light speckle, which is what actually reads as grain on a near-black
   ground (grey noise under `overlay` is invisible down here) and which
   dithers away the banding any dark gradient would otherwise show. Static —
   no animation, so it costs exactly one paint, ever. */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .88 0 0 0 0 .86 0 0 0 0 1 .55 .55 .55 0 -.74'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

/** The step wedge, dimmest column first. Index 0-3 are grid columns 9-12 (set
 *  in CSS so the breakpoints can re-place them); the last entry is the strip
 *  that bleeds past the measure to the viewport edge. `o` is the strip's share
 *  of the light; `pitch` is its louvre period in px — one 1px rule every
 *  `pitch`, so a tighter pitch swallows more light. Value and line density
 *  step together, which is what makes it read as a measured wedge. */
const WEDGE: { o: number; pitch: number }[] = [
  { o: 0.26, pitch: 4 },
  { o: 0.44, pitch: 5 },
  { o: 0.66, pitch: 7 },
  { o: 0.86, pitch: 9 },
  { o: 1, pitch: 12 }, // the bleed strip, outside the measure
];

const louvre = (pitch: number) =>
  `repeating-linear-gradient(180deg,` +
  ` rgba(9,10,11,0) 0px, rgba(9,10,11,0) ${pitch - 1}px,` +
  ` rgba(9,10,11,.84) ${pitch - 1}px, rgba(9,10,11,.84) ${pitch}px)`;

const CSS = `
.hv2{
  /* distance from the wrap's content box to the viewport edge, so grid items
     can bleed out of the measure without leaving the grid */
  --hv2-bleed: calc((100vw - min(100vw, 1200px)) / 2 + 24px);
  --hv2-line: rgba(255,255,255,.07);
  --hv2-line-key: rgba(209,201,255,.20);
  --hv2-rule: rgba(255,255,255,.13);
  position:relative; isolation:isolate; overflow:hidden;
  min-height:min(calc(100svh - var(--nav-h, 72px)), 880px);
  display:flex; flex-direction:column;
  background:#0f1011;
}

/* ---- background layer ------------------------------------------------- */
.hv2-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.hv2-ground{position:absolute;inset:0;
  background:
    radial-gradient(120% 78% at 84% 4%, rgba(75,73,170,.22) 0%, rgba(75,73,170,.06) 46%, rgba(9,10,11,0) 72%),
    linear-gradient(180deg, #0f1011 0%, #090a0b 100%);}

/* the measure. identical box maths to .wrap so every line in here lands on
   the same column the foreground content is set on. */
.hv2-measure{position:absolute;inset:0;max-width:1200px;margin-inline:auto;
  padding-inline:24px;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));
  column-gap:24px;}
/* one item per column, each drawing the hairline that sits on its own left
   edge; the last also closes the measure on the right. Key lines are the ones
   the composition is actually pinned to: column 1 (the type's left edge) and
   column 9 (the aperture's edge). */
.hv2-col{grid-row:1;border-left:1px solid var(--hv2-line);}
.hv2-col[data-c="1"],.hv2-col[data-c="9"]{border-left-color:var(--hv2-line-key);}
.hv2-col[data-c="12"]{border-right:1px solid var(--hv2-line);}

/* ---- the light: a step wedge built ON the grid ------------------------
   Not a panel laid over the layout. The last four columns of the measure are
   lit individually, each one brighter and more open than the one to its left,
   with the 24px gutters left black between them. So the light is made of the
   same columns as everything else, it steps in measured increments like a
   photographic step wedge, and every boundary in it is a hard edge the grid
   already explains. The source reads as off-frame right. */
.hv2-strip{grid-row:1;position:relative;overflow:hidden;transform-origin:50% 0;}
.hv2-strip[data-s="0"]{grid-column:9;}
.hv2-strip[data-s="1"]{grid-column:10;}
.hv2-strip[data-s="2"]{grid-column:11;}
.hv2-strip[data-s="3"]{grid-column:12;}
/* the strip that runs from the measure's right edge out to the viewport */
.hv2-strip-bleed{position:absolute;top:0;bottom:0;left:100%;
  width:calc(var(--hv2-bleed) - 24px);}
/* Deliberately EVEN light. The value modelling is done by the wedge and the
   louvre, not by the gradient — a gradient left to do its own falloff is how
   the last three attempts turned to haze. Warm end of the palette: pale-iris,
   iris, orchid, with periwinkle only at the foot. */
.hv2-strip-light{position:absolute;left:0;right:0;top:-14%;bottom:-14%;
  background:
    linear-gradient(191deg,
      rgba(209,201,255,.62) 0%,
      rgba(132,125,255,.60) 22%,
      rgba(221,144,216,.56) 47%,
      rgba(221,144,216,.48) 63%,
      rgba(144,184,240,.40) 84%,
      rgba(75,73,170,.30) 100%);}
/* THE LOUVRE — an ordered dither, not a gradient. Each strip is cut by a
   repeating hard-stop rule pattern; the pitch opens up as the strips brighten,
   so value and line density step together. It can look like many things, but
   it can never look soft. */
.hv2-strip-louvre{position:absolute;inset:0;}
/* the index: one hairline stepping down the lit field in 18 discrete jumps,
   crossing strips and black gutters alike */
.hv2-idxwrap{grid-row:1;grid-column:9 / -1;position:relative;
  margin-right:calc(-1 * var(--hv2-bleed));overflow:hidden;}
/* rest pose sits the index inside the frame, so the reduced-motion state is a
   composed still rather than the line parked off the top */
.hv2-idx{position:absolute;inset:0;transform:translate3d(0,38%,0);}
.hv2-idx > i{position:absolute;left:0;right:0;top:0;height:1px;display:block;
  background:linear-gradient(90deg, rgba(209,201,255,0) 0%,
    rgba(209,201,255,.34) 26%, rgba(209,201,255,.62) 100%);}

.hv2-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.30;}

/* ---- foreground ------------------------------------------------------- */
.hv2-fg{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;
  max-width:1200px;width:100%;margin-inline:auto;padding-inline:24px;
  padding-block:28px 40px;}
.hv2-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;}

/* masthead — real facts only. It carries its own full-bleed dark bar so the
   light stops at the rule underneath it: the mono line stays legible over the
   wedge, and the lit field gains a top edge instead of running off the page. */
.hv2-mast{position:relative;align-items:baseline;padding-bottom:14px;}
.hv2-mast::before{content:"";position:absolute;z-index:-1;
  top:-28px;bottom:0;left:calc(-1 * var(--hv2-bleed));right:calc(-1 * var(--hv2-bleed));
  background:rgba(9,10,11,.94);}
.hv2-mast > *{grid-row:1;}
.hv2-m1{grid-column:1 / span 3;}
.hv2-m2{grid-column:4 / span 3;}
.hv2-m3{grid-column:7 / span 3;}
.hv2-m4{grid-column:10 / span 3;text-align:right;margin-right:-.182em;}
.hv2-mono{font-family:var(--font-mono);font-size:11px;line-height:2;
  text-transform:uppercase;letter-spacing:.182em;font-weight:500;color:#9f9fa0;}
.hv2-mono-lit{color:#cacaca;}          /* anything sitting over the aperture */
.hv2-clock{font-variant-numeric:tabular-nums;}

.hv2-rule{height:1px;background:var(--hv2-rule);transform-origin:0 50%;
  margin-inline:calc(-1 * var(--hv2-bleed));}

/* the free space is split above and below the display line so the headline
   lands just below optical centre rather than being flush to either rule */
.hv2-gap{flex:1 1 0;min-height:40px;}
.hv2-gap-b{flex:.72 1 0;min-height:24px;}

/* display type — the layout is built to it: at every width "Evidence first."
   is set to run to the column-8 line. */
.hv2-h1{grid-column:1 / span 9;font-family:var(--font-display);font-weight:400;
  color:#fff;font-size:clamp(2.5rem, 8.7vw, 7.9rem);line-height:.88;
  letter-spacing:-.026em;margin-block:34px 30px;}
.hv2-l{display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.1em;}
.hv2-l > span{display:block;}
.hv2-l2{color:#d1c9ff;}

/* two explicit rows, so the reading path runs down-left to down-right and the
   actions land on the corner of the composition rather than wherever grid
   auto-placement happens to drop them */
.hv2-foot{padding-top:24px;align-items:start;row-gap:26px;}
.hv2-lead{grid-row:1;grid-column:1 / span 6;font-size:18px;line-height:1.55;
  font-weight:300;color:#9f9fa0;max-width:30em;}
/* the actions stop exactly on the column-9 line, where the light begins:
   everything you read sits left of the aperture, nothing floats over it */
.hv2-cta{grid-row:2;grid-column:5 / span 4;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-end;}
.hv2-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;
  min-height:48px;padding:12px 22px;border-radius:8px;font-size:16px;
  background:#fff;color:#000;border:1px solid #fff;
  transition:background .18s ease,border-color .18s ease,color .18s ease;}
.hv2-btn:hover{background:#f5f5f7;border-color:#f5f5f7;}
.hv2-btn-ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.42);}
.hv2-btn-ghost:hover{background:rgba(255,255,255,.08);border-color:#fff;}

/* ---- narrow ----------------------------------------------------------- */
@media (max-width:767px){
  .hv2{min-height:min(calc(100svh - var(--nav-h, 72px)), 760px);}
  .hv2-measure{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:20px;}
  /* four columns on a phone: hide the rest, move the key lines and the closing
     line to 1 / 3 / 4 so the grid still reads as one measure. */
  .hv2-col[data-c="5"],.hv2-col[data-c="6"],.hv2-col[data-c="7"],.hv2-col[data-c="8"],
  .hv2-col[data-c="9"],.hv2-col[data-c="10"],.hv2-col[data-c="11"],
  .hv2-col[data-c="12"]{display:none;}
  .hv2-col[data-c="3"]{border-left-color:var(--hv2-line-key);}
  .hv2-col[data-c="4"]{border-right:1px solid var(--hv2-line);}
  /* Two steps instead of five — the two brightest, so the wedge still reads as
     a wedge (the bleed strip is already zero-width below 1200px). And they
     stop short of the type: on a phone the reading column is the whole width,
     so the light becomes a lit block in the upper right with a hard bottom
     edge rather than something the copy has to sit on top of. */
  .hv2-strip[data-s="0"],.hv2-strip[data-s="1"]{display:none;}
  .hv2-strip[data-s="2"]{grid-column:3;}
  .hv2-strip[data-s="3"]{grid-column:4;}
  .hv2-strip,.hv2-idxwrap{align-self:start;height:34%;}
  .hv2-idxwrap{grid-column:3 / -1;}
  .hv2-row{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:20px;}
  .hv2-m1{grid-column:1 / span 2;}
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-m4{grid-column:3 / span 2;}
  .hv2-h1{grid-column:1 / -1;font-size:clamp(2.4rem, 12.4vw, 3.9rem);
          margin-block:26px 22px;}
  .hv2-lead{grid-row:1;grid-column:1 / -1;font-size:17px;}
  .hv2-cta{grid-row:2;grid-column:1 / -1;justify-content:flex-start;}
  .hv2-btn{flex:1 1 100%;}
}
@media (min-width:768px) and (max-width:1023px){
  /* the two middle masthead facts wrap to two lines and collide once the
     columns get this narrow — city and time only */
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-m1{grid-column:1 / span 6;}
  .hv2-m4{grid-column:7 / span 6;}
  .hv2-lead{grid-row:1;grid-column:1 / span 7;}
  .hv2-cta{grid-row:2;grid-column:1 / span 8;justify-content:flex-start;}
  .hv2-foot{row-gap:24px;}
}

/* ---- motion ----------------------------------------------------------- */
@media (prefers-reduced-motion: no-preference){
  .hv2-l > span{animation:hv2Rise 1000ms cubic-bezier(.16,1,.3,1) both;}
  .hv2-l2 > span{animation-delay:110ms;}
  .hv2-rule{animation:hv2Draw 1100ms cubic-bezier(.22,.61,.36,1) both;}
  .hv2-rule-b{animation-delay:180ms;}
  .hv2-mast > *,.hv2-foot > *{animation:hv2In 700ms cubic-bezier(.22,.61,.36,1) both;}
  .hv2-m2{animation-delay:60ms;} .hv2-m3{animation-delay:120ms;} .hv2-m4{animation-delay:180ms;}
  .hv2-foot > *{animation-delay:340ms;}
  /* the wedge wipes down one step at a time, left to right */
  .hv2-strip{animation:hv2Wipe 1000ms cubic-bezier(.22,.61,.36,1) both;}
  .hv2-strip[data-s="1"]{animation-delay:90ms;}
  .hv2-strip[data-s="2"]{animation-delay:180ms;}
  .hv2-strip[data-s="3"]{animation-delay:270ms;}
  .hv2-strip[data-s="4"]{animation-delay:360ms;}
  /* the one continuous movement in the frame: the light sliding behind the
     fixed louvre. One composited transform per strip, all in lockstep, so it
     reads as a single source moving rather than five things drifting. */
  .hv2-strip-light{animation:hv2Drift 22s cubic-bezier(.45,.05,.55,.95) infinite alternate both;}
  .hv2-idx{animation:hv2Index 8s steps(20,end) infinite both;}
}
@keyframes hv2Rise{from{transform:translate3d(0,102%,0)}to{transform:none}}
@keyframes hv2Draw{from{transform:scaleX(0)}to{transform:none}}
@keyframes hv2In{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}
@keyframes hv2Wipe{from{transform:scaleY(0)}to{transform:none}}
@keyframes hv2Drift{from{transform:translate3d(0,-7%,0)}to{transform:translate3d(0,7%,0)}}
@keyframes hv2Index{from{transform:translate3d(0,0,0)}to{transform:translate3d(0,100%,0)}}
`;

/** Austin is the firm's stated city; this is the real current time there, not
 *  a decorative counter. Rendered as a placeholder on the server and filled on
 *  mount so the markup is deterministic. */
function useAustinTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const still =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      ...(still ? {} : { second: "2-digit" }),
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    if (still) return;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

export default function HeroV2() {
  const time = useAustinTime();

  return (
    <section className="hv2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="hv2-bg" aria-hidden="true">
        <div className="hv2-ground" />
        <div className="hv2-measure">
          {WEDGE.map((s, i) => (
            <div
              key={i}
              data-s={i}
              className={i === WEDGE.length - 1 ? "hv2-strip hv2-strip-bleed" : "hv2-strip"}
            >
              <div className="hv2-strip-light" style={{ opacity: s.o }} />
              <div className="hv2-strip-louvre" style={{ background: louvre(s.pitch) }} />
            </div>
          ))}
          <div className="hv2-idxwrap">
            <div className="hv2-idx">
              <i />
            </div>
          </div>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="hv2-col" data-c={i + 1} style={{ gridColumn: i + 1 }} />
          ))}
        </div>
        <div className="hv2-grain" />
      </div>

      <div className="hv2-fg">
        <div className="hv2-row hv2-mast">
          <span className="hv2-mono hv2-m1">{site.city}</span>
          <span className="hv2-mono hv2-m2">{site.structure}</span>
          <span className="hv2-mono hv2-m3 hv2-mono-lit">{site.mandate}</span>
          <span className="hv2-mono hv2-m4 hv2-mono-lit">
            <span className="hv2-clock">{time ?? "--:--:--"}</span> CT
          </span>
        </div>
        <div className="hv2-rule" />

        <div className="hv2-gap" />

        <div className="hv2-row">
          <h1 className="hv2-h1">
            <span className="hv2-l">
              <span>Evidence first.</span>
            </span>
            <span className="hv2-l hv2-l2">
              <span>Then capital.</span>
            </span>
          </h1>
        </div>

        <div className="hv2-gap-b" />

        <div className="hv2-rule hv2-rule-b" />
        <div className="hv2-row hv2-foot">
          <p className="hv2-lead">
            {site.name} runs concentrated, systematic strategies across liquid global
            markets, underwritten by our own research and a single risk framework.
          </p>
          <div className="hv2-cta">
            <Link href="/firm" className="hv2-btn">
              Our approach
            </Link>
            <Link href="/contact" className="hv2-btn hv2-btn-ghost">
              Investor inquiries
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
