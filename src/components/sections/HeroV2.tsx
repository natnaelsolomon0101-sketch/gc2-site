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

/** The step wedge, dimmest strip first. The five strips divide the field from
 *  the column-9 line to the viewport edge equally. `o` is the strip's share of
 *  the light; `pitch` is its louvre period in px — one 1px rule every `pitch`,
 *  so a tighter pitch swallows more light. Value and line density step
 *  together, which is what makes it read as a measured wedge. */
const WEDGE: { o: number; pitch: number }[] = [
  { o: 0.26, pitch: 4 },
  { o: 0.44, pitch: 5 },
  { o: 0.66, pitch: 7 },
  { o: 0.86, pitch: 9 },
  { o: 1, pitch: 12 }, // the brightest step, running out to the viewport edge
];

const louvre = (pitch: number) =>
  `repeating-linear-gradient(180deg,` +
  ` rgba(9,10,11,0) 0px, rgba(9,10,11,0) ${pitch - 1}px,` +
  ` rgba(9,10,11,.84) ${pitch - 1}px, rgba(9,10,11,.84) ${pitch}px)`;

const CSS = `
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
  background:#0f1011;
}
@supports (height: 100dvh){
  .hv2{min-height:min(calc(100dvh - var(--nav-h, 72px)), 900px);}
}

/* ---- background layer ------------------------------------------------- */
.hv2-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.hv2-ground{position:absolute;inset:0;
  background:
    radial-gradient(120% 78% at 84% 4%, rgba(75,73,170,.22) 0%, rgba(75,73,170,.06) 46%, rgba(9,10,11,0) 72%),
    linear-gradient(180deg, #0f1011 0%, #090a0b 100%);}

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
/* Deliberately EVEN light. The value modelling is done by the wedge and the
   louvre, not by the gradient — a gradient left to do its own falloff is how
   the last three attempts turned to haze. */
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
  background:rgba(9,10,11,.94);}
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
.hv2-clock{grid-column:10 / span 3;}
/* The session row is 44px tall in the component, which is nav and menu
   density: in a masthead it opens a blank line between the row and its own
   caption. Here the row is not a tap target -- three spans, no link -- so it
   collapses to the mono line box the facts beside it use, and the band reads
   as one set of rules rather than as a control. Reaching into another
   section's component to say so; reported to the Conductor. */
.hv2-clock .sc-row{min-height:0;}
/* .t-mono carries the family, the 13px §6.3 floor, the tracking and the case;
   only the colour variant is local. */
.hv2-mono-lit{color:#cacaca;}          /* anything sitting over the aperture */

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
.hv2-l2{color:#d1c9ff;}

/* two explicit rows on the left, the curve on the right, so the reading path
   runs down-left and then out to the object that closes the frame */
.hv2-foot{padding-top:0;align-items:start;row-gap:26px;}
.hv2-lead{grid-row:1;grid-column:1 / span 5;font-size:18px;line-height:1.55;
  font-weight:300;color:#9f9fa0;max-width:30em;hyphens:manual;padding-top:20px;}
/* the actions sit on the column-1 line, under the sentence they close, so the
   masthead, the headline, the lead and the buttons all share one left edge. */
.hv2-cta{grid-row:2;grid-column:1 / span 5;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-start;}
.hv2-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;
  min-height:48px;padding:12px 22px;border-radius:8px;font-size:16px;
  background:#fff;color:#000;border:1px solid #fff;
  transition:background var(--dur-fast) var(--ease),
              border-color var(--dur-fast) var(--ease),
              color var(--dur-fast) var(--ease);}
.hv2-btn-ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.42);}
@media (hover: hover) and (pointer: fine){
  .hv2-btn:hover{background:#f5f5f7;border-color:#f5f5f7;}
  .hv2-btn-ghost:hover{background:rgba(255,255,255,.08);border-color:#fff;}
}
.hv2-btn:active{background:#cacaca;border-color:#cacaca;}
.hv2-btn-ghost:active{background:rgba(255,255,255,.14);border-color:#fff;}

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
  align-self:start;border-top:1px solid rgba(255,255,255,.12);}

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
  /* The bloom is worth more on a phone, where it is the only light in the
     frame — same token, same two stops, a wider throw. */
  .hv2-ground{background:
    radial-gradient(150% 62% at 88% 3%, rgba(75,73,170,.26) 0%, rgba(75,73,170,.07) 48%, rgba(9,10,11,0) 76%),
    linear-gradient(180deg, #0f1011 0%, #090a0b 100%);}

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
  /* 1.75 rather than the tier's 2: five mono lines at 26px is 130px of a
     795px poster, and these are labels, not reading copy. */
  .hv2-mast .t-mono,.hv2-clock .t-caption{line-height:1.75;}
  /* CSS order, and not source order: the two standing facts are full-width flex
     items, so in DOM order they sit BETWEEN the city and the clock and push
     the clock onto a fourth line (measured at 360x740 before this). City and
     clock share line one; the standing facts take a line each below. */
  .hv2-m1{order:1;flex:1 0 100%;}
  .hv2-m2{order:2;flex:1 0 100%;}
  .hv2-m3{order:3;flex:1 0 100%;}
  /* The session strip is a block, not a word: it takes its own full-width line
     under the three facts. flex-basis 100% and not auto on purpose — the
     component sets container-type: inline-size, and an inline-size container
     with an indefinite basis has no content-derived width to resolve to. */
  .hv2-clock{order:4;flex:1 0 100%;margin-top:6px;}

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
    color:#7c7d7d;max-width:none;}
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
  .hv2-cta{grid-row:3;grid-column:1 / -1;justify-content:flex-start;gap:10px;}
  /* Content-width buttons on one row, exactly as on desktop, rather than two
     identical full-width pills with centred labels. 15px of side padding and a
     10px gap are what make both fit inside a 312px measure at 360px. */
  .hv2-btn{flex:0 1 auto;padding:12px 15px;}
}

/* The curve is 242px on a phone — its 132px plot floor, the tenor axis, and a
   source line that wraps to two lines under 430px. That is a third of the
   poster, and on anything shorter than a full-height 393x852 it costs the
   actions their place above the fold. Measured at 360x740: the stack runs 788px
   against 683px of usable height with the curve, 546 without. So it is gated on
   the viewport being at least as tall as the poster — the same devices with
   browser chrome showing (412x839, 430x739, 393x659) get the composition
   without it, which is the r0 poster plus a session strip. */
@media (max-width:767px) and (max-height:839px){
  .hv2-curve{display:none;}
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
  .hv2-m2,.hv2-m3{display:none;}
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
  .hv2-clock{grid-column:7 / span 6;}
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
  .hv2{--hv2-pt:20px;--hv2-pb:28px;}
  /* the plot is the one block in the frame with a free height, so it is what
     gives when a 720p laptop has 647px of hero to spend. */
  .hv2-curve .yc-svg{height:132px;}
  .hv2-h1{margin-block:20px 16px;}
  .hv2-gap{min-height:16px;}
  .hv2-gap-b{min-height:12px;}
  .hv2-foot{padding-top:16px;row-gap:18px;}
  .hv2-curve{padding-top:14px;}
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
  .hv2-h1{margin-block:24px 20px;}
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
  .hv2{--hv2-pt:16px;--hv2-pb:20px;min-height:calc(100vh - var(--nav-h, 48px));}
  @supports (height: 100dvh){
    .hv2{min-height:calc(100dvh - var(--nav-h, 48px));}
  }
  .hv2-fg{padding-block:var(--hv2-pt) var(--hv2-pb);}
  .hv2-mast{padding-bottom:10px;}
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-m1{grid-column:1 / span 12;}
  /* 345px of letterbox cannot carry a 106px session strip on top of a
     headline, a lead and two actions -- measured, the stack would run 401px.
     It comes off here for the same reason the record and the curve do, and the
     same strip is one tap away in the menu and the footer (sec-chrome). */
  .hv2-clock{display:none;}
  .hv2-h1{grid-column:1 / span 8;
          font-size:clamp(2rem, calc(15.318vw - 7.83px), 44px);
          line-height:.92;letter-spacing:-.028em;margin-block:14px 0;}
  .hv2-curve{display:none;}
  .hv2-gap{min-height:8px;}
  .hv2-gap-b{min-height:8px;}
  .hv2-foot{padding-top:12px;row-gap:12px;}
  .hv2-lead{grid-row:1;grid-column:1 / span 6;font-size:15px;line-height:1.45;}
  .hv2-cta{grid-row:2;grid-column:1 / span 6;gap:10px;}
  .hv2-btn{min-height:44px;padding:10px 16px;font-size:15px;}
  /* The wedge stays — it is the only light in a letterbox — but it starts at
     the column-9 line of a very wide, very short frame, so it reads as a band
     down the right rather than a panel. */
  /* .hv2-upper now bounds the field, and in a letterbox that would stop the
     light two thirds of the way down for no reason — there is no curve here
     for it to stop on. Negative bottom, clipped by .hv2's overflow. */
  .hv2-measure{display:flex;gap:16px;bottom:-100vh;}
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
  .hv2-l2 > span{animation-delay:var(--stagger),var(--stagger);}
  .hv2-m2{animation-delay:var(--stagger),var(--stagger);}
  .hv2-m3{animation-delay:var(--stagger),var(--stagger);}
  .hv2-clock{animation-delay:calc(var(--stagger) * 2),calc(var(--stagger) * 2);}
  .hv2-lead{animation-delay:calc(var(--stagger) * 2),calc(var(--stagger) * 2);}
  .hv2-cta{animation-delay:calc(var(--stagger) * 3),calc(var(--stagger) * 3);}
  .hv2-curve{animation-delay:calc(var(--stagger) * 4),calc(var(--stagger) * 4);}
  /* the wedge wipes down one step at a time, left to right */
  .hv2-strip{animation:hv2Wipe var(--dur-base) var(--ease) both;}
  .hv2-strip[data-s="1"]{animation-delay:var(--stagger);}
  .hv2-strip[data-s="2"]{animation-delay:calc(var(--stagger) * 2);}
  .hv2-strip[data-s="3"]{animation-delay:calc(var(--stagger) * 3);}
  .hv2-strip[data-s="4"]{animation-delay:calc(var(--stagger) * 4);}
  /* The one continuous movement in the frame: the light sliding behind the
     fixed louvre. One composited transform per strip, all in lockstep, so it
     reads as a single source moving rather than five things drifting. 44 x
     --dur-base is the 22s cycle; the curve was its own ease-in-out and is now
     the house curve, which under alternate runs out on the way down and in on
     the way back — a slower turnaround than before, which is the right
     direction for something meant to read as atmosphere. */
  .hv2-strip-light{animation:hv2Drift calc(var(--dur-base) * 44) var(--ease) infinite alternate both;}
}
@keyframes hv2Wipe{from{transform:scaleY(0)}to{transform:none}}
@keyframes hv2Drift{from{transform:translate3d(0,-7%,0)}to{transform:translate3d(0,7%,0)}}
`;

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
                <div className="hv2-strip-light" style={{ opacity: w.o }} />
                <div className="hv2-strip-louvre" style={{ background: louvre(w.pitch) }} />
              </div>
            ))}
          </div>

          <div className="hv2-row hv2-mast">
            <span className="t-mono hv2-m1">{site.city}</span>
            <span className="t-mono hv2-m2">{site.structure}</span>
            <span className="t-mono hv2-m3 hv2-mono-lit">{site.mandate}</span>
            {/* Cross-section object (OWNERSHIP.md): sec-motion builds it,
                sec-chrome places it in the nav and the footer, the hero shows
                it where its own local clock used to be. It renders nothing
                until it hydrates, so the server HTML carries no time-shaped
                placeholder — STATE.md §0.2 item 6. */}
            <SessionClock className="hv2-clock" />
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
            <Link href="/firm" className="hv2-btn">
              Our approach
            </Link>
            <Link href="/contact" className="hv2-btn hv2-btn-ghost">
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
        </div>

        <div className="hv2-gap-b" />
      </div>
    </section>
  );
}
