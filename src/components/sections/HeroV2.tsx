/* ===========================================================================
   HeroV2 — "ruled composition, one hard-edged step wedge of light".

   Self-contained. Renders its own <section>, its own ground, its own light.

   WHY THIS AND NOT ANOTHER GRADIENT
   ---------------------------------
   Three hero attempts failed the same way: nothing had an edge. Flat black had
   no light; the bloom field and the violet/teal wash had light but no
   structure, so both read as stock backgrounds. What reads as expensive in a
   dark 2026 interface is precision — a grid you can feel, type that sets the
   layout instead of sitting inside it, light with a boundary, and motion that
   is exact rather than drifting.

   So the whole composition is built from lines:

   - A 12-column hairline grid locked to the site measure (--page-max, which
     foundation widens to 1440 above 1920). Every element lands on one of its
     lines.
   - A masthead of real facts (city, structure, mandate, live local time),
     mono, ruled above and below. No invented numbers anywhere.
   - The display type left-aligned on the column-1 line. Above 767px it is the
     site's own .t-display tier, so the hero grows with the rest of the type
     system instead of running its own private ramp; below 767px one clamp
     derived from the phone measure keeps it to exactly two lines.
   - ONE luminous element, made of the grid rather than laid over it: the field
     from the column-9 line out to the viewport edge, divided into five equal
     strips, each step brighter and more open than the one to its left, gutters
     left black between them. Inside each strip the light is immediately cut
     into a louvre of 1px hard-stop rules. Hard stops, never blur.
   - The curve slot, which is the one honest data object on the first screen:
     columns 6-12 bleeding to the right viewport edge on the frame, full-bleed
     under the lead on the poster. It carries its own near-black ground, so the
     light stops at its top rule and the line is read on black — the same trick
     the masthead bar plays, and the reason the wedge gains a bottom edge
     instead of running off the page.
   - Fine static grain over everything, which is what makes a flat dark field
     read filmic instead of empty.

   WHAT CHANGED IN v4 ROUND 0 (Conductor's contact-sheet reading)
   -------------------------------------------------------------
   1. Landscape phones cut "Then capital." at the fold on every device. The
      landscape block at the foot of this stylesheet is now a real letterbox
      composition rather than the desktop rules squashed: 100dvh with no
      minimum, headline capped at 44px, ledger and curve off, lead kept only
      because it measured as fitting.
   2. The headline wrapped to FOUR lines at 412 and 393 in Chromium. The tall
      phone "cover" treatment that sized to the longest WORD is gone; the
      headline is two lines at every phone width in both engines, sized off the
      measure with 8% of headroom so Android font metrics cannot tip it over.
   3. The ledger values wrapped mid-value at 360 ("LIQUID MARKETS, / GLOBAL").
      Values are nowrap and the row wraps instead, so a value that does not fit
      beside its label takes its own line whole.
   4. The 01/02/03 numerals came off the ledger (EVERY-SCREEN §0.2 item 4 —
      they numbered three facts that are not a sequence).
   5. The five-tile band at 393 read as amputated. Dropped on phones: the
      curve is the poster's object now, and the ground's bloom carries the
      atmosphere.
   6. At 3440 the hero was a card on a wall. The measure follows --page-max
      (1440 above 1920), the type ceiling rises with .t-display to 128px, the
      wedge and the curve both bleed to the right viewport edge, and the hero
      is capped at 900px tall.
   7. 768-1024 portrait tablets were a stretched phone. They get their own
      two-column composition: headline across, then lead and actions left with
      the curve on the right, bleeding out.
   8. The `--:--:--` clock fallback is gone. Nothing renders until the clock
      hydrates; SessionClock (sec-motion) replaces this block when it lands.
   9. The curve slot is composed and reserved. YieldCurve (sec-motion) drops
      into it; until then a static placeholder of the same aspect holds the
      space — 1px stroke, no fill, no axes, no labels, no source line, because
      it states nothing.

   MOTION (exact, not floaty — and never in front of the content)
   --------------------------------------------------------------
   Every duration, delay and curve below is read from src/lib/motion.ts; there
   is not a literal millisecond in this file. One-shot on load: masthead, the
   two display lines (one stagger step apart), the lead, the actions, then the
   curve draws in over `duration.draw`. Opacity and transform are split so the
   words are painted in the first frame and only settle afterwards — the h1 is
   the LCP element and nothing here gates it longer than `duration.base`.

   Steady state is one composited transform — the light sliding behind the fixed
   louvre — plus one text node updated once a second for the clock.

   Every animation lives inside `prefers-reduced-motion: no-preference`, so the
   base stylesheet IS the composed static state, curve included. Reduced motion
   also drops the clock's seconds and stops its interval.
   ========================================================================= */

import Link from "next/link";
import { site } from "@/config/site";
import SessionClock from "@/components/viz/SessionClock";
import YieldCurve from "@/components/viz/YieldCurve";

/* -- grain ---------------------------------------------------------------
   Turbulence pushed into the alpha channel over a fixed fill. On the dark
   build the fill was a pale speckle, because light specks are what read on
   near-black. On paper the same mechanism has to invert its material: the
   specks are INK, sparse and weak, and what they produce is the tooth of a
   sheet rather than film grain. Same reason as before — it keeps a flat field
   from reading as a screen fill, and it dithers away any banding in the wash.
   Static: one paint, ever. */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

/** The step wedge, quietest strip first. The five strips divide the field from
 *  the column-9 line to the viewport edge equally. `o` is the strip's share of
 *  the tint; `pitch` is its louvre period in px — one 1px ink rule every
 *  `pitch`, so a tighter pitch lays down more ink. Tint and line density step
 *  together, which is what makes it read as a measured wedge.
 *
 *  The floor is 0.42 and not the dark build's 0.26. On the old ground a 26%
 *  strip was still clearly light against black; on paper a 26% tint of pale-iris over
 *  #f7f5f0 is 1.03:1 — it is not there. The step has to be compressed into the
 *  range paper can actually hold, or the wedge loses its two dimmest steps and
 *  becomes three. */
const WEDGE: { o: number; pitch: number }[] = [
  { o: 0.42, pitch: 4 },
  { o: 0.56, pitch: 5 },
  { o: 0.7, pitch: 7 },
  { o: 0.85, pitch: 9 },
  { o: 1, pitch: 12 }, // the fullest step, running out to the viewport edge
];

/* The louvre inverts with the ground: on the dark build it was near-black
   rules eating light, on paper it is ink rules laid onto a tint. Same job — the field
   is dithered into structure so it can never go hazy — and the alpha is low
   because on paper a hard 84% rule at a 4px pitch is a barcode, not a texture. */
const louvre = (pitch: number) =>
  `repeating-linear-gradient(180deg,` +
  ` rgba(20,19,17,0) 0px, rgba(20,19,17,0) ${pitch - 1}px,` +
  ` rgba(20,19,17,.16) ${pitch - 1}px, rgba(20,19,17,.16) ${pitch}px)`;

/* The step's share of the tint is baked into each strip's gradient rather than
   set as an inline opacity on the element. That frees the element's own opacity
   to be animated by the scroll response below without the animation's from-value
   (1) wiping out the step and flattening the wedge on the first frame. */
const light = (o: number) =>
  `linear-gradient(191deg,` +
  ` rgba(209,201,255,${(0.5 * o).toFixed(3)}) 0%,` +
  ` rgba(132,125,255,${(0.4 * o).toFixed(3)}) 26%,` +
  ` rgba(132,125,255,${(0.34 * o).toFixed(3)}) 52%,` +
  ` rgba(144,184,240,${(0.34 * o).toFixed(3)}) 78%,` +
  ` rgba(75,73,170,${(0.26 * o).toFixed(3)}) 100%)`;

/** The stylesheet below is written to be read: it carries the reasoning for
 *  every measured number in it, and that reasoning is the reason the next
 *  person does not undo a fix. But it is also inlined into the document, and
 *  the document is the whole critical path on a phone — measured on Slow 4G at
 *  the Pixel 7 descriptor, FCP lands at 860ms and LCP at 1124ms, and the HTML's
 *  own 900ms transfer is what both are waiting for. The hero's <style> was
 *  37.2KB of a 216KB document; the comments are 27KB of that.
 *
 *  So the comments stay in the source and do not ship. Run once at module
 *  scope, not per request. Only /* *\/ comments and runs of whitespace go:
 *  the CSS contains two quoted strings, content:"" (empty, so collapsing is a
 *  no-op) and the grain's data URI (percent-encoded by encodeURIComponent, so
 *  it holds no raw spaces and no comment opener). Verified by diffing the
 *  rendered page against the unstripped build at 393 and 1920. */
const min = (css: string) =>
  css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim();

const CSS = min(`
.hv2{
  /* the page measure, one of its 12 columns, and the column lines the
     composition is built on, in page coordinates. --page-max is foundation's
     token: 1200, widening to 1440 above 1920, so the hero grows with the rest
     of the page instead of freezing at a private number. */
  --hv2-meas: min(100vw, var(--page-max, 1200px));
  /* distance from the viewport's left edge to the content box's left edge --
     i.e. where column 1 starts. Below 1920 that is the centring gap plus the
     24px gutter; above it, the left-anchor rule at the foot of this block. */
  --hv2-side: calc((100vw - var(--hv2-meas)) / 2 + 24px);
  /* The two bleeds are separate because above 1920 the container is no longer
     centred: at 3440 the left margin is pinned at 240px and the right absorbs
     all 1784px of the extra ground. One formula covers both cases -- below
     1920 it evaluates back to --hv2-side, so nothing changes there. */
  --hv2-bleed-l: var(--hv2-side);
  --hv2-bleed-r: calc(100vw - var(--hv2-side) - (var(--hv2-meas) - 48px));
  --hv2-col: calc((var(--hv2-meas) - 48px - 264px) / 12);
  /* The column-9 line, measured from the CONTAINER's content box and not from
     the viewport: the striped field is positioned inside .hv2-upper now, so a
     page-coordinate value would push it --hv2-side further right (264px at
     1920, 1024px at 3440 before the left-anchor) and shrink the light to a
     sliver. --hv2-side still carries the page geometry for the two bleeds. */
  --hv2-c9: calc(8 * (var(--hv2-col) + 24px));
  --hv2-pt: 28px; --hv2-pb: 40px;
  position:relative; isolation:isolate; overflow:hidden;
  min-height:min(calc(100vh - var(--nav-h, 72px)), 900px);
  display:flex; flex-direction:column;
  background:var(--color-ground);
}
@supports (height: 100dvh){
  .hv2{min-height:min(calc(100dvh - var(--nav-h, 72px)), 900px);}
}

/* ---- background layer ------------------------------------------------- */
.hv2-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.hv2-ground{position:absolute;inset:0;
  background:
    radial-gradient(120% 78% at 84% 4%,
      rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 44%, rgba(247,245,240,0) 72%),
    radial-gradient(150% 100% at 86% 0%,
      rgba(20,19,17,.055) 0%, rgba(20,19,17,.018) 48%, rgba(20,19,17,0) 74%),
    var(--color-ground);}

/* the lit field: from the column-9 line of the measure out to the viewport
   edge. Its left edge lands on the same line the reading column stops on;
   the strips inside then share that width equally. */
.hv2-measure{position:absolute;z-index:0;top:0;bottom:0;
  left:var(--hv2-c9);right:calc(-1 * var(--hv2-bleed-r));
  display:flex;gap:24px;}
/* The field carries its own grain. It used to sit in .hv2-bg under the shared
   grain layer; now that it is a foreground element bounded by .hv2-upper, that
   layer is beneath it, and a wedge without grain reads as a flat swatch beside
   a filmic ground. Absolutely positioned so it is not a flex item. */
.hv2-measure::after{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:${GRAIN_URL};background-size:140px 140px;opacity:.30;}

/* ---- the light: a step wedge built ON the grid ------------------------
   Not a panel laid over the layout. It steps in measured increments like a
   photographic step wedge, and every boundary in it is a hard edge the grid
   already explains. The source reads as off-frame right. */
.hv2-strip{position:relative;overflow:hidden;transform-origin:50% 0;flex:1 1 0;}
/* Deliberately EVEN tint. The value modelling is done by the wedge and the
   louvre, not by the gradient — a gradient left to do its own falloff is how
   the dark build's first three attempts turned to haze, and on paper it is how
   a tint turns into a smear.
   Orchid is out of the ramp. It was two of the six stops on the dark ground,
   where a pink at 50% over black is a warm violet; on paper the same stop is
   pink,
   and pink on warm paper is exactly the bruise this pass is told to avoid.
   What is left runs pale-iris -> iris-gleam -> periwinkle -> deep-iris: one
   family, cool against a warm ground, anchored by the one accent that is dark
   enough to hold an edge. Peak alpha .50, measured: the fullest strip
   composites to about 1.16:1 against ground, a shade past the ground->ground-2
   step, which is a swatch and not a slab. */
.hv2-strip-light{position:absolute;left:0;right:0;top:-14%;bottom:-14%;
  will-change:transform,opacity;}
/* THE LOUVRE — an ordered dither, not a gradient. Each strip is cut by a
   repeating hard-stop rule pattern; the pitch opens up as the strips brighten,
   so value and line density step together. */
.hv2-strip-louvre{position:absolute;inset:0;}

.hv2-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.30;}

/* ---- foreground ------------------------------------------------------- */
.hv2-fg{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;
  max-width:var(--page-max, 1200px);width:100%;margin-inline:auto;padding-inline:24px;
  padding-block:var(--hv2-pt) var(--hv2-pb);}
/* THE SHARED HORIZONTAL. Everything above the curve lives in .hv2-upper, and
   the striped field is absolutely positioned inside it — so the field's bottom
   IS the foot's top IS the curve's top rule, by construction rather than by a
   number that has to be kept in sync with what YieldCurve happens to measure.
   That is the whole answer to the frame's two-object problem: the light stops
   on the line the curve hangs from, and both run off the right viewport edge,
   so the right half reads as one object in two registers instead of a striped
   panel with a black rectangle parked under it. */
.hv2-upper{position:relative;flex:1 1 0;display:flex;flex-direction:column;}
/* The field is a positioned z-index:0 child, which paints above non-positioned
   text; the content has to be positioned too or the light covers the words.
   :not(.hv2-measure) because the field IS a direct child, and a blanket rule
   here overwrote its position:absolute — it became a zero-height flex item and
   the whole wedge vanished from the frame. */
.hv2-upper > *:not(.hv2-measure){position:relative;z-index:1;}
.hv2-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;}

/* masthead — real facts only. It carries its own full-bleed dark bar so the
   light stops at the rule underneath it: the mono line stays legible over the
   wedge, and the lit field gains a top edge instead of running off the page. */
.hv2-mast{position:relative;align-items:start;padding-bottom:14px;}
.hv2-mast::before{content:"";position:absolute;z-index:-1;
  top:calc(-1 * var(--hv2-pt));bottom:0;
  left:calc(-1 * var(--hv2-bleed-l));right:calc(-1 * var(--hv2-bleed-r));
  background:var(--color-ground-2);
  border-bottom:1px solid var(--color-hairline);}
.hv2-mast > *{grid-row:1;}
.hv2-m1{grid-column:1 / span 3;}
.hv2-m2{grid-column:4 / span 3;}
.hv2-m3{grid-column:7 / span 3;}
/* The masthead's fourth cell is the session clock (sec-motion's
   src/components/viz/SessionClock.tsx), not a single local time. Three columns
   is 330px at 1920 and 270px at 1280, both under the component's own 420px
   container query, so it paints the running session only — which is what a
   masthead wants. The note under it ("Scheduled cash sessions · exchange
   holidays not shown") is the caption scripts/qa/sources.ts checks for and is
   never hidden while the strip is painted; it wraps to two lines at this width
   and that is why the masthead aligns to start rather than to a baseline. */
/* THE SLOT, not the component, carries the placement — and a reserved height.
   SessionClock renders null until it hydrates, which is right (a time that is
   not known yet is not drawn as a shape where a time will go) but means there
   is no element to size until it appears. Measured before this: the masthead
   went 37px -> 75px on every phone and 40px -> 46px at 1920 when the clock
   arrived, and everything under it moved down — CLS 0.0295 at 412 throttled,
   which is a §9 gate failure on its own. 32px is what the component's dense
   row occupies; the slot holds it open from the first paint. If dense ever
   comes off the call below, this number moves to 44 with it. */
.hv2-clockslot{grid-column:10 / span 3;min-height:32px;}
/* Density and the caption are the component's own props now — dense,
   caption={false}, rows="open" — passed at the call site below. The three
   local overrides that stood in for them -- a zeroed row height, a compressed
   mono line-height, and nothing at all for the two-line caption, which simply
   sat in the band -- are gone. */
/* .t-mono carries the family, the 13px §6.3 floor, the tracking and the case.
   .hv2-mono-lit is gone with the ground it existed for: it was the brighter
   grey for a fact sitting over the aperture, and the masthead bar is an opaque
   ground-2 strip now. Emphasis on paper is ink against .t-mono's ink-2. */
.hv2-mono-strong{color:var(--color-ink);}

/* The free space is split ABOVE and BELOW the message, never inside it. Both
   spacers sit outside the headline / record / lead / actions group, so that
   group reads as one block and the leftover height becomes air around it
   instead of a gap through it. The lower spacer used to sit between the record
   and the lead, i.e. inside the group: at 393x852 that put 130px of nothing
   between the record and the sentence it belongs to, and the hero read as
   three floating bands again. */
.hv2-gap{flex:1 1 0;min-height:40px;}
.hv2-gap-b{flex:.55 1 0;min-height:24px;}

/* display type. Above 767px this is the site's .t-display tier, unmodified:
   96px from 768 to 1920 and rising to 128px above it, with .t-display's own
   line-height and colour. The hero used to run a private 11.1vw ramp derived
   from "eight columns of the 1200 measure", which stopped tracking the moment
   foundation made the measure and the tier fluid. Seven columns is what
   "Evidence first." needs at the tier's ceiling: 577px at 96px against 662px
   of column at 1280 and 802px at 1920. */
/* line-height is set here and not left to .t-display, and that is not a
   preference: globals.css writes every fluid line-height as
   clamp(.9, calc(.9857 - .01116vw), .95), and calc() cannot subtract a length
   from a number, so the whole declaration is invalid and every .t-display /
   .t-h1 on the site is currently falling back to body's 1.5. Measured here at
   1920: computed line-height 144.138px against a 96.092px font. Reported to
   the Conductor for foundation; until it is fixed the hero states its own,
   because a 1.5 display line-height is not a hero. */
.hv2-h1{grid-column:1 / span 7;margin-block:34px 30px;}
.hv2-l{display:block;}
/* Each display line is one line by construction. nowrap makes that structural:
   a webfont swap, a metric change or a rounding error can no longer break
   "Evidence first." across two lines and silently halve the headline. */
.hv2-l > span{display:block;white-space:nowrap;}
/* deep-iris, 6.80:1 on ground — the only one of the six that may be set as
   text on paper. On the dark ground this line was pale-iris, which measures
   1.43:1 here and would have been the single worst thing on the page. */
.hv2-l2{color:var(--color-accent-deep-iris);}

/* two explicit rows on the left, the curve on the right, so the reading path
   runs down-left and then out to the object that closes the frame */
.hv2-foot{padding-top:0;align-items:start;row-gap:26px;}
.hv2-lead{grid-row:1;grid-column:1 / span 5;font-size:18px;line-height:1.55;
  font-weight:300;color:var(--color-ink-2);max-width:30em;hyphens:manual;padding-top:20px;}
/* the actions sit on the column-1 line, under the sentence they close, so the
   masthead, the headline, the lead and the buttons all share one left edge. */
.hv2-cta{grid-row:2;grid-column:1 / span 5;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-start;}
/* Colour comes from globals' .btn / .btn-ghost — the one black button, ink
   fill on ground, and its outline twin. The hero's own rule now carries only
   what is about THIS layout: the 48px tap height and the centred label. The
   dark build painted its own white fill here, which on paper would have been
   an invisible button. */
.hv2-btn{justify-content:center;min-height:48px;padding:12px 22px;}

/* ---- the curve slot ----------------------------------------------------
   Columns 6-12, hanging from the rule the striped field stops on, running off
   the right viewport edge. No ground of its own any more: round 0 gave it a
   near-black slab to cut the light, which is what turned it into a second
   rectangle. The field ends where this begins instead.

   padding-right, though, and not a true bleed to the pixel: YieldCurve pins its
   last tenor label to the right edge of the plot, and "30Y" hard against the
   glass is a defect, not a bleed. The 1px rule is on the border box and does
   reach the edge. */
.hv2-curve{position:relative;grid-row:1 / span 2;grid-column:6 / span 7;
  margin-right:calc(-1 * var(--hv2-bleed-r));padding:20px 24px 0 0;
  align-self:start;border-top:1px solid var(--color-hairline);}

/* ---- the scroll cue ------------------------------------------------------
   A word and a hairline at the foot of the frame. Positioned, not in flow:
   pinned to the hero's bottom edge, it costs the composition no height, which
   at 1920 is the difference between a 915px hero and an 845px one. It also
   means the cue is where a cue belongs — at the bottom of the frame — rather
   than wherever the content happens to stop. It grows downward once, at
   the end of the load sequence, and it is gone by 120px of scroll. Left-aligned
   on the column-1 line like everything else; ink-3, because it is the quietest
   thing on the screen and should stay that way. aria-hidden: it tells a
   sighted reader that there is more below the fold, which is not information a
   screen reader is missing. */
.hv2-cue{position:absolute;z-index:1;bottom:20px;left:var(--hv2-side);
  display:flex;flex-direction:column;align-items:flex-start;gap:8px;}
.hv2-cue-word{color:var(--color-ink-3);line-height:1;}
.hv2-cue-line{display:block;width:1px;height:30px;transform-origin:50% 0;
  background:var(--color-hairline-strong);}

/* ---- narrow ----------------------------------------------------------- */
@media (max-width:767px){
  .hv2{--hv2-pt:20px;--hv2-pb:24px;
       min-height:min(calc(100vh - var(--nav-h, 56px)), 820px);}
  @supports (height: 100dvh){
    .hv2{min-height:min(calc(100dvh - var(--nav-h, 56px)), 820px);}
  }
  .hv2-fg{padding-block:var(--hv2-pt) var(--hv2-pb);}
  /* The wedge is off on the phone. With the headline set to fill the whole
     measure there is no column left beside it, and every version that parked
     the light above the type put the light ON the type. The five-strip band
     that replaced it (below the headline, running off the right edge) read as
     amputated rather than bled on every 393 and 430 contact sheet, so it is
     gone too: on the poster the curve is the object, and the ground's bloom
     carries the atmosphere. */
  .hv2-measure{display:none;}
  /* The wash is worth more on a phone, where the field is off and it is the
     only atmosphere in the frame — same two tokens, a wider throw. */
  .hv2-ground{background:
    radial-gradient(160% 52% at 88% 2%,
      rgba(209,201,255,.34) 0%, rgba(209,201,255,.11) 46%, rgba(247,245,240,0) 76%),
    radial-gradient(170% 70% at 90% 0%,
      rgba(20,19,17,.05) 0%, rgba(20,19,17,.015) 50%, rgba(20,19,17,0) 76%),
    var(--color-ground);}

  .hv2-row{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:20px;}
  /* The masthead is a wrapping flex row, not four grid cells: at 13px (the
     §6.3 mono floor, up from 11px) "MIAMI, FLORIDA" measures 142px against a
     126px two-column cell at 320 and wrapped mid-fact. City and clock take the
     first line; the two standing facts take a full line each underneath,
     because "PRIVATE PARTNERSHIP" (193px) and "LIQUID MARKETS, GLOBAL" (224px)
     both fit a 272px measure whole and neither fits beside anything. This is
     the default phone masthead; a tall phone hands the two standing facts to
     the ruled record instead, and the 320x568 class drops them (they are one
     tap away on /firm, and the alternative is an action below the fold). */
  .hv2-mast{display:flex;flex-wrap:wrap;align-items:baseline;
    column-gap:12px;row-gap:0;}
  /* 1.75 rather than the tier's 2: four mono lines at 26px is 104px of a
     795px poster, and these are labels, not reading copy. The clock is not in
     this rule any more -- dense is its own answer to the same question. */
  .hv2-mast .t-mono{line-height:1.75;}
  /* CSS order, and not source order: the two standing facts are full-width flex
     items, so in DOM order they sit BETWEEN the city and the clock and push
     the clock onto a fourth line (measured at 360x740 before this). City and
     clock share line one; the standing facts take a line each below. */
  .hv2-m1{order:1;flex:1 0 100%;}
  /* Two lines, on every phone: city, then the session strip. The two standing
     facts used to take a line each between them, and at 430 that made the band
     four lines and 22% of the screen before the headline had started. They are
     on /firm and in the footer; a masthead is not where a phone reads them. */
  .hv2-m2,.hv2-m3{display:none;}
  /* The session strip is a block, not a word: it takes its own full-width line
     under the three facts. flex-basis 100% and not auto on purpose — the
     component sets container-type: inline-size, and an inline-size container
     with an indefinite basis has no content-derived width to resolve to. */
  .hv2-clockslot{order:2;flex:1 0 100%;margin-top:6px;}

  /* Two lines, at every phone width, in both engines. Sized off the measure
     rather than off a guess: DM Serif Display sets "Evidence first." at
     6.006x its font-size, so 92% of (100vw - 48px) is 15.318vw - 7.83px — the
     8% of headroom is deliberate, because Chromium on Android measures this
     face wider than WebKit and 98% is what tipped 412 and 393 into a
     four-line headline. The 96px ceiling is .t-display's value at 768, so the
     phone clamp and the tier meet across the breakpoint instead of stepping.
     The tall-phone "cover" treatment that sized to the longest WORD and let
     the headline stack four deep is gone: it is the thing that broke. */
  .hv2-h1{grid-column:1 / -1;
          font-size:clamp(2.5rem, calc(15.318vw - 7.83px), 96px);
          letter-spacing:-.03em;margin-block:16px 0;}
  .hv2-lead{grid-row:1;grid-column:1 / -1;font-size:15px;line-height:1.5;
    color:var(--color-ink-2);max-width:none;}
  /* On a phone the poster wants its block high and its air at the foot, not a
     hole under the masthead: 38% of the slack above, 62% below. */
  .hv2-gap{flex:.6 1 0;min-height:16px;}
  .hv2-gap-b{flex:1 1 0;min-height:12px;}
  .hv2-foot{padding-top:16px;row-gap:16px;}
  .hv2-lead{padding-top:0;}
  /* Under the lead, per §5.2's poster: the rule bleeds to both edges, the
     plot and its labels stay inside the 24px measure. */
  .hv2-curve{grid-row:2;grid-column:1 / -1;align-self:stretch;
    margin-inline:-24px;padding:14px 24px 0;}
  /* The band is the picture on the phones the curve cannot fit. It is the same
     five steps and the same louvre, laid on its side and run from viewport edge
     to viewport edge, so every strip is whole — the round-0 version stopped at
     the page gutter and read as amputated, which is what got it deleted. It
     shows only where .hv2-curve does not; the two never both paint. */
  .hv2-band{display:none;grid-row:2;grid-column:1 / -1;align-self:stretch;
    margin:16px -24px 0;height:72px;gap:12px;}
  .hv2-cta{grid-row:3;grid-column:1 / -1;justify-content:flex-start;gap:10px;}
  /* Content-width buttons on one row, exactly as on desktop, rather than two
     identical full-width pills with centred labels. 15px of side padding and a
     10px gap are what make both fit inside a 312px measure at 360px. */
  .hv2-btn{flex:0 1 auto;padding:12px 15px;}
}

/* THE CURVE'S HEIGHT GATE, and the hero's, because they are the same decision.

   The curve block is 221px at 393-412 and 247px at 320-360, where the source
   line wraps; motion round 4 adds "Public market data. Not fund performance."
   under it, another ~40px. It is a third of a poster, and on a phone short
   enough it costs the actions their place above the fold. Re-measured after
   the masthead lost its two caption lines, with the actions' bottom against
   the fold, and again with r4's line added:

     412x839   738 -> 778 against 839    fits, 61px clear   CURVE ON (new)
     393x852   733 -> 773 against 852    fits, 79px clear   CURVE ON
     430x739   721 -> 761 against 739    over by 22         off
     393x659   651 -> 691 against 659    over by 32         off
     360x658   738 -> 778 against 658    over by 120        off
     320x568   738 -> 778 against 568    over by 210        off

   So the threshold moves from 840 to 820 and 412x839 gains the curve. 430x739
   and 393x659 clear it today and would not once r4 lands, and a gate that has
   to be re-cut in a week is not a gate.

   AND: below the threshold the hero stops holding a height it has nothing to
   fill. It kept min(100dvh - nav, 820px) whether or not the curve was in it,
   so a 360x740 phone got 683px of hero for 445px of content — 238px of empty
   ground under the buttons, and more of it on the full-page view where the
   next section's own padding follows. With the curve the hero may fill the
   frame; without it, it is its content and the section padding, full stop.
   (Landscape is not this case: §7 rule 8 makes the letterbox exactly 100dvh
   by design, and its block at the foot of this file still says so.) */
@media (max-width:767px) and (max-height:819px){
  .hv2-curve{display:none;}
  .hv2-band{display:flex;}
  .hv2{min-height:0;}
  /* No frame to be at the foot of: this hero is exactly its content, so a cue
     saying "there is more below" is pointing at the next section from two
     inches above it. The poster keeps it. */
  .hv2-cue{display:none;}
}

/* Short phones: the 320x568 floor, and every phone measured with the browser
   chrome actually on screen (Galaxy S9+ reports 658px of viewport, iPhone 15
   Pro 659, iPhone SE 667). The hero is allowed to be exactly one screen and no
   more: the actions are the last thing in it, and an action you have to scroll
   to find is not an action. The three mono lines of masthead are 92px of a
   511px budget at 320, so here the masthead is city and clock only — both
   standing facts are one tap away on /firm, and a button under the fold is not
   recoverable anywhere. Everything that is air gives some back with them.
   Measured: 320x568 570 -> 556 against a 568 fold; 360x658 678 -> 582. */
@media (max-width:767px) and (max-height:700px){
  .hv2-band{height:64px;margin-top:12px;}
  .hv2-h1{margin-block:10px 0;}
  .hv2-gap{min-height:8px;}
  .hv2-gap-b{min-height:6px;}
  .hv2-foot{padding-top:10px;row-gap:8px;}
}

/* ---- tablets are not big phones (§7 rule 7) ---------------------------- */
@media (min-width:768px) and (max-width:1023px){
  /* the two middle masthead facts wrap to two lines and collide once the
     columns get this narrow — city and time only */
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-m1{grid-column:1 / span 6;}
  .hv2-clockslot{grid-column:7 / span 6;}
}
@media (min-width:768px) and (max-width:1024px) and (orientation:portrait){
  /* A portrait tablet is a tall frame, not a wide one: the headline takes the
     whole measure (at 96px "Evidence first." is 577px against 720px of measure
     at 768), and the block underneath becomes two columns — the argument on
     the left, the object on the right, still bleeding off the edge. This is
     the composition 768 and 1024x1366 were missing; they were rendering the
     desktop rules at phone proportions. */
  .hv2{min-height:min(calc(100vh - var(--nav-h, 56px)), 820px);}
  @supports (height: 100dvh){
    .hv2{min-height:min(calc(100dvh - var(--nav-h, 56px)), 820px);}
  }
  .hv2-h1{grid-column:1 / -1;}
  .hv2-lead{grid-column:1 / span 6;}
  .hv2-cta{grid-column:1 / span 6;}
  .hv2-curve{grid-column:7 / span 6;}
  .hv2-foot{row-gap:24px;}
  /* The wedge starts a column earlier so the light is not a sliver beside a
     tall frame — and it is cut to a block in the upper right with a hard
     bottom edge, because a headline set across the whole measure runs under a
     full-height wedge here (measured at 768: the type reaches x=601, the
     column-8 line is at x=458). 34% of an 820px hero stops at 279px; the
     headline's cap line is at 341. */
  .hv2-measure{left:calc(7 * (var(--hv2-col) + 24px));}
  .hv2-strip{align-self:start;height:46%;}
}

/* ---- short desktop frames (1280x720, 1366x768: the corporate laptop) ----
   647px of hero on a 720px screen has to hold the same six blocks a 1080p
   frame holds in 900. Everything that is air gives some back, and the curve
   slot takes a lower cap so it stops being the tallest thing in the frame —
   at 1280 it was 181px of a 750px hero and pushed the actions past the fold. */
@media (min-width:1024px) and (max-height:820px){
  .hv2{--hv2-pt:16px;--hv2-pb:20px;}
  /* A cue is a promise that the frame ends below the fold. On a 720p laptop
     the hero is already taller than the viewport — the curve's one shape costs
     that — so the promise is redundant and the 50px is not free. */
  .hv2-cue{display:none;}
  /* No --yc-aspect here any more. It changed the BOX and not the DRAWING: the
     SVG keeps its 1000x260 viewBox, so a flatter box letterboxed the curve —
     measured by sec-motion at 761px of line inside a 1042px plot at 1920. One
     shape, at every width (counsel's rule, Conductor's call). A short frame
     pays for it in height instead, which is what the numbers below are. */
  .hv2-h1{margin-block:14px 12px;}
  .hv2-gap{min-height:10px;}
  .hv2-gap-b{min-height:8px;}
  .hv2-foot{padding-top:12px;row-gap:14px;}
  .hv2-curve{padding-top:12px;}
}
/* ---- above 1920: anchor left, exactly as .wrap does ---------------------
   Foundation r1 deliverable 9 stopped centring the page container above 1920
   and pinned its left margin to the gap it would have had at exactly 1920
   ((1920 - --page-max) / 2 = 240px), so the extra ground is all on the right.
   The hero ran its own margin-inline: auto and so drifted right of every
   section below it -- 1024px of left margin at 3440 against the page's 240px.
   Same rule here, same expression, so the two cannot fall out of step; and
   --hv2-side follows, which is what carries the column-9 line and both bleeds.

   .t-display also climbs to 128px here, 32px more headline than at 1920. The
   hero is capped at 900px tall, so the margins around the headline pay for it
   rather than the cap being broken. Line-height is no longer stated locally:
   foundation r1 replaced the invalid clamp(.9, calc(.9857 - .01116vw), .95)
   -- calc() cannot subtract a length from a number, so every display tier was
   silently rendering at body's 1.5 -- with a constant .9, which is what this
   hero was overriding to anyway. The token carries it now. */
@media (min-width:1920px){
  .hv2{--hv2-side: calc((1920px - var(--page-max)) / 2 + 24px);}
  .hv2-fg{margin-inline: calc((1920px - var(--page-max)) / 2) auto;}
  .hv2-h1{margin-block:18px 14px;}
  /* The field still bleeds to the right edge; it just stops starting so far
     left. Unclamped it is 1352px at 2560 and 2232px at 3440, and on paper that
     is not "light arriving from off-frame", it is five large pale rectangles
     that read as unloaded images. 980px keeps the same proportion the frame
     has at 1920 (712px of a 1920 viewport), and the cap does not bite there:
     min() leaves 1920 exactly as it was. */
  .hv2-measure{left:auto;
    width:min(calc(100vw - var(--hv2-side) - var(--hv2-c9)), 980px);}
  /* The plot stops widening past 1200px, for the same reason the field stops
     at 980. Motion r4 made the box follow the viewBox ratio, so the slot's
     width now sets the plot's height: at 2560 the slot is 1682px and the plot
     437px, at 3440 it is 2562 and 666, and the hero measured 1308px against a
     900px ceiling. --yc-aspect cannot fix this — a ratio scales with the box,
     and the box is what is growing — so the constraint is a max-width on the
     figure. That is a slot saying how much room it has, not a restyle of the
     component; a --yc-max or a maxWidth prop would say the same thing in
     motion's own vocabulary and I would rather use that. The rule still bleeds
     to the viewport edge — it is on .hv2-curve's border box, not the figure's.
     1000px and not 1200: the plot is drawn at the viewBox's own 1000/260 at
     every width now, so its width sets its height, and 1200 x .26 is 312px of
     plot plus ~152 of title, axis, source and note — which put the hero at 921
     (2560) and 954 (3440) against a 900px ceiling. At 1000 the block fits
     under it, and the line spans the whole plot instead of being letterboxed
     inside a flattened box. */
  .hv2-curve .yc{max-width:1000px;}
}

/* ---- landscape phones: a letterbox, composed as one (§7 rule 8) --------
   852x393 and 932x430 are wider than 767px, so before this block they were
   getting the desktop composition inside 393px of height and cutting "Then
   capital." at the fold on every device on the contact sheet. Here the hero is
   exactly the viewport with no minimum, the headline caps at 44px (§7 rule 8's
   own number), and the two blocks that cannot pay for their height — the
   record and the curve — come off. The lead stays: measured, the whole stack
   is ~250px against 345px of letterbox at 852x393.
   Last in the file on purpose: a landscape phone matches the phone, tablet and
   desktop width rules too, and this has to win over all of them. */
@media (max-height:500px) and (orientation:landscape){
  /* The 12-column grid, restated. Playwright's own landscape descriptors are
     734x393 and 852x393 -- browser chrome comes off the 852 -- so a landscape
     phone can be NARROWER than 767px and pick up the phone block's 4-column
     grid. Every span below is written against 12: on a 4-column grid "span 6"
     runs into implicit tracks and takes the whole width, which is how the lead
     ended up printed across the striped field at 734. */
  .hv2-row{grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;}
  .hv2{--hv2-pt:16px;--hv2-pb:20px;min-height:calc(100vh - var(--nav-h, 48px));}
  @supports (height: 100dvh){
    .hv2{min-height:calc(100dvh - var(--nav-h, 48px));}
  }
  .hv2-fg{padding-block:var(--hv2-pt) var(--hv2-pb);}
  .hv2-mast{padding-bottom:10px;}
  .hv2-m1{grid-column:1 / span 12;}
  /* 345px of letterbox cannot carry a 106px session strip on top of a
     headline, a lead and two actions -- measured, the stack would run 401px.
     It comes off here for the same reason the record and the curve do, and the
     same strip is one tap away in the menu and the footer (sec-chrome). */
  .hv2-clockslot{display:none;}
  .hv2-cue{display:none;}
  .hv2-h1{grid-column:1 / span 8;
          font-size:clamp(2rem, calc(15.318vw - 7.83px), 44px);
          line-height:.92;letter-spacing:-.028em;margin-block:14px 0;}
  .hv2-curve{display:none;}
  .hv2-gap{min-height:8px;}
  .hv2-gap-b{min-height:8px;}
  .hv2-foot{padding-top:12px;row-gap:12px;}
  /* Eight columns, not six, and the same eight the headline takes: at 734 a
     six-column lead is 331px and wraps to three lines, which is the 13px that
     put the actions under the fold. Eight is 450px there and stops 23px short
     of the column-9 line the field starts on, so it gains a line back without
     ever running into the light. */
  .hv2-lead{grid-row:1;grid-column:1 / span 8;font-size:15px;line-height:1.45;}
  .hv2-cta{grid-row:2;grid-column:1 / span 8;gap:10px;}
  .hv2-btn{min-height:44px;padding:10px 16px;font-size:15px;}
  /* The wedge stays — it is the only light in a letterbox — but it starts at
     the column-9 line of a very wide, very short frame, so it reads as a band
     down the right rather than a panel. */
  /* .hv2-upper now bounds the field, and in a letterbox that would stop the
     light two thirds of the way down for no reason — there is no curve here
     for it to stop on. Negative bottom, clipped by .hv2's overflow. */
  .hv2-measure{display:flex;gap:16px;bottom:-100vh;}
  .hv2-band{display:none;}
}
/* Landscape phones under ~400px tall — 568x320 and 740x360, the small Androids
   and the old iPhones turned sideways. §7 rule 8's "100dvh with no minimum" is
   right for a 393-tall letterbox and wrong here: the stack does not fit in
   272px of usable height, so forcing the frame to exactly one viewport put the
   actions across the bottom edge and sliced them. The hero flows to its
   content instead. The buttons then sit below the fold and whole, and a phone
   held sideways scrolls, which is a thing phones do; a cut button is not. */
@media (max-height:400px) and (orientation:landscape){
  .hv2{min-height:0;}
  .hv2-gap{flex:0 0 auto;}
  .hv2-gap-b{flex:0 0 auto;}
}
/* And under ~340px the lead comes off, which §7 rule 8 allows in as many
   words ("the lead optional"). Letting the hero flow stops the actions being
   sliced by the frame, but at 568x320 they still land 36px below a 320px fold
   and a button you have to scroll a sideways phone to reach is barely better
   than a cut one. Without the lead the whole composition is 235px against 272
   of usable height: masthead, headline, actions, all whole, all on the screen.
   The sentence is the first thing on the page the moment the phone is turned
   back. 740x360 keeps it — it fits there. */
@media (max-height:340px) and (orientation:landscape){
  .hv2-lead{display:none;}
}

/* ---- print --------------------------------------------------------------
   globals' print block hides .hv2-bg and .hv2-grain, but the striped field
   moved into the foreground in round 1 and the masthead bar is a ::before —
   neither is reached by "background-color: transparent" on divs. On paper
   there is no field and no band, only ink. */
@media print{
  .hv2-measure{display:none !important;}
  .hv2-mast::before{background:none !important;border-bottom-color:var(--color-hairline-strong) !important;}
  .hv2{min-height:0 !important;}
}

/* ---- motion ------------------------------------------------------------
   Every duration, delay and curve below is var(--dur-*) / var(--stagger) /
   var(--ease) — globals.css's mirror of src/lib/motion.ts, and the same way
   YieldCurve and SessionClock state their timing.

   Round 0 interpolated the values out of motion.ts into this template literal
   instead. That was a true single source at build time, but it was invisible
   to scripts/qa/killist.sh's motion gate, which reads the SOURCE line: a
   template hole carries no time literal, so the gate could neither fail nor verify
   it, and HeroV2 was passing its 14-line pin by being unreadable rather than by
   being right. A gate that cannot see a value is not a gate. Custom properties
   are legible to it, and the pin is now 0.

   Opacity and transform are split, and the split is the whole point. It is the
   site's documented entrance from globals.css: originFadeIn lands the content
   fast, originRise keeps the travel underneath it. This block used to gate
   content, which DESIGN.md forbids in writing ("It never gates content becoming
   visible"); it came back once in transform form, masking the LCP element
   entirely for the first 200ms. Everything here is painted in the first frame
   and only settles after. */
@media (prefers-reduced-motion: no-preference){
  .hv2-l > span,.hv2-mast > *,.hv2-foot > *{
    animation:originFadeIn var(--dur-base) var(--ease) both,
              originRise var(--dur-base) var(--ease) both;}
  /* ONE LADDER, one rung per stagger step: the masthead settles, the two
     display lines rise a step apart, then the sentence, then the actions, and
     only then the curve — which draws itself over --dur-draw and does not put
     a tenor label on the axis until the line has reached it. Every value is
     --stagger and --dur-*; there is not a literal here. */
  .hv2-m2{animation-delay:var(--stagger),var(--stagger);}
  .hv2-m3{animation-delay:var(--stagger),var(--stagger);}
  .hv2-clockslot{animation-delay:var(--stagger),var(--stagger);}
  .hv2-l > span{animation-delay:var(--stagger),var(--stagger);}
  .hv2-l2 > span{animation-delay:calc(var(--stagger) * 2),calc(var(--stagger) * 2);}
  .hv2-lead{animation-delay:calc(var(--stagger) * 3),calc(var(--stagger) * 3);}
  .hv2-cta{animation-delay:calc(var(--stagger) * 4),calc(var(--stagger) * 4);}
  .hv2-curve,.hv2-band{animation-delay:calc(var(--stagger) * 5),calc(var(--stagger) * 5);}
  /* The line's own wipe is the component's ycDraw; the hero only says when.
     Its title arrives with it — a picture and its name — and the axis, the
     source and the note wait out the full draw so no label is on the page
     before the line has got to it. */
  .hv2-curve .yc-line{animation-delay:calc(var(--stagger) * 5);}
  .hv2-curve .yc-title{
    animation:originFadeIn var(--dur-base) var(--ease) calc(var(--stagger) * 5) both;}
  .hv2-curve .yc-tick,.hv2-curve .yc-source,.hv2-curve .yc-note{
    animation:originFadeIn var(--dur-base) var(--ease)
              calc(var(--stagger) * 5 + var(--dur-draw)) both;}
  /* The cue is the last thing to arrive, after the curve has finished. The
     entrance sits on the word and the rule and NOT on .hv2-cue, because the
     scroll-out below also animates opacity: two animations on one element do
     not compose, the later one simply wins, and the first strip showed the cue
     present at t=0 with no fade at all. The wrapper is the scroll's; what is
     inside it is the sequence's. */
  .hv2-cue-word{animation:originFadeIn var(--dur-base) var(--ease)
                calc(var(--stagger) * 6 + var(--dur-draw)) both;}
  .hv2-cue-line{animation:hv2Grow var(--dur-base) var(--ease)
                calc(var(--stagger) * 6 + var(--dur-draw)) both;}
  /* the wedge wipes down one step at a time, left to right */
  .hv2-strip{animation:hv2Wipe var(--dur-base) var(--ease) both;}
  .hv2-strip[data-s="1"]{animation-delay:var(--stagger);}
  .hv2-strip[data-s="2"]{animation-delay:calc(var(--stagger) * 2);}
  .hv2-strip[data-s="3"]{animation-delay:calc(var(--stagger) * 3);}
  .hv2-strip[data-s="4"]{animation-delay:calc(var(--stagger) * 4);}
  /* The 22s drift is gone with the dark ground. It existed to make ONE LIGHT
     SOURCE feel alive behind a fixed louvre, which is a thing light does and a
     thing a printed swatch does not; on paper the field is a tinted, ruled
     block and a block that breathes reads as a bug. It was also never on
     §8.2's list of what moves, and — the part that forced the decision — an
     infinite alternate animation makes the page a different picture on every
     load, so §6.2's "the dark-scheme render must be pixel-identical to the
     light one" could not pass on the hero for a reason that had nothing to do
     with the theme. Measured: light-vs-light differed as much as light-vs-dark
     while it ran; with it gone all three hash the same. */
}
@keyframes hv2Wipe{from{transform:scaleY(0)}to{transform:none}}
@keyframes hv2Grow{from{transform:scaleY(0)}to{transform:none}}
/* The scroll response. Not parallax: nothing with words in it moves. The lit
   field recedes — up a little, and down in strength — across the first 600px,
   so the frame keeps changing while the reading column stays exactly where it
   was put. Scroll-linked in CSS, so it is the compositor's job and there is no
   handler on the main thread and nothing to throttle. */
@keyframes hv2Recede{
  from{transform:translate3d(0,0,0);opacity:1;}
  to{transform:translate3d(0,-9%,0);opacity:.42;}
}
@keyframes hv2CueOut{from{opacity:1}to{opacity:0}}

/* Both scroll-linked animations are inside @supports, and that is not
   politeness: with animation-timeline unsupported the declaration is dropped
   and the animation would fall back to the document timeline and simply run —
   the field would recede on load and the cue would vanish on its own. Where
   the timeline does not exist the field is static and the cue stays, which is
   the honest degradation. */
@supports (animation-timeline: scroll()){
  @media (prefers-reduced-motion: no-preference){
    .hv2-strip-light{
      animation:hv2Recede linear both;
      animation-timeline:scroll(root block);
      animation-range:0 600px;}
    /* Gone after the first scroll, and back if the reader returns to the top,
       which is what a scroll-linked cue means and is better than a one-way
       flag: the cue is only ever true when it is true. */
    .hv2-cue{
      animation:hv2CueOut linear both;
      animation-timeline:scroll(root block);
      animation-range:0 120px;}
  }
}
`);

export default function HeroV2() {
  return (
    <section className="hv2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="hv2-bg" aria-hidden="true">
        <div className="hv2-ground" />
        <div className="hv2-grain" />
      </div>

      <div className="hv2-fg">
        <div className="hv2-upper">
          {/* The striped field is bounded by this block, so its bottom edge is
              the foot's top edge is the curve's rule. */}
          <div className="hv2-measure" aria-hidden="true">
            {WEDGE.map((w, i) => (
              <div key={i} data-s={i} className="hv2-strip">
                <div className="hv2-strip-light" style={{ background: light(w.o) }} />
                <div className="hv2-strip-louvre" style={{ background: louvre(w.pitch) }} />
              </div>
            ))}
          </div>

          <div className="hv2-row hv2-mast">
            <span className="t-mono hv2-m1">{site.city}</span>
            <span className="t-mono hv2-m2">{site.structure}</span>
            <span className="t-mono hv2-m3 hv2-mono-strong">{site.mandate}</span>
            {/* Cross-section object (OWNERSHIP.md): sec-motion builds it,
                sec-chrome places it in the nav and the footer, the hero shows
                it where its own local clock used to be. It renders nothing
                until it hydrates, so the server HTML carries no time-shaped
                placeholder — STATE.md §0.2 item 6. */}
            <div className="hv2-clockslot">
              <SessionClock
                className="hv2-clock"
                caption={false}
                rows="open"
                dense
              />
            </div>
          </div>

          <div className="hv2-gap" />

          <div className="hv2-row">
            <h1 className="t-display hv2-h1">
              <span className="hv2-l">
                <span>Evidence first.</span>
              </span>
              <span className="hv2-l hv2-l2">
                <span>Then capital.</span>
              </span>
            </h1>
          </div>
        </div>

        <div className="hv2-row hv2-foot">
          <p className="hv2-lead">
            Concentrated systematic strategies in liquid global markets. One research
            process, one risk framework, and a risk seat that runs independently of
            the desk.
          </p>
          <div className="hv2-cta">
            <Link href="/firm" className="btn hv2-btn">
              Our approach
            </Link>
            <Link href="/contact" className="btn btn-ghost hv2-btn">
              Investor inquiries
            </Link>
          </div>
          {/* sec-motion's component; this is its box and its placement. It is
              a server component with ISR, which is why HeroV2 is no longer a
              client one — its only hooks were the local clock SessionClock
              replaced. If the Treasury fetch fails it renders nothing at all,
              and the slot collapses to its rule rather than showing a shape
              where a curve would go. */}
          <div className="hv2-curve">
            <YieldCurve />
          </div>
          {/* Phone-only, and only where the curve does not fit: the same wedge
              turned on its side and run edge to edge, so the first screen is
              never all ground. */}
          <div className="hv2-band" aria-hidden="true">
            {WEDGE.map((w, i) => (
              <div key={i} data-s={i} className="hv2-strip">
                <div className="hv2-strip-light" style={{ background: light(w.o) }} />
                <div className="hv2-strip-louvre" style={{ background: louvre(w.pitch) }} />
              </div>
            ))}
          </div>
        </div>

        <div className="hv2-gap-b" />

        {/* Round 5: the frame says there is more below it. One word and one
            hairline, last in the load sequence, gone by 120px of scroll. */}
        <div className="hv2-cue" aria-hidden="true">
          <span className="t-caption hv2-cue-word">Scroll</span>
          <span className="hv2-cue-line" />
        </div>
      </div>
    </section>
  );
}
