"use client";

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
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { duration, easing, stagger } from "@/lib/motion";

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

/* Motion, read from the single source. `d(n)` is n stagger steps. */
const D_BASE = `${duration.base}ms`;
const D_DRAW = `${duration.draw}ms`;
const D_FAST = `${duration.fast}ms`;
const d = (n: number) => `${n * stagger}ms`;

/* The curve slot's aspect. YieldCurve (sec-motion) renders into the same box;
   the placeholder below uses the same viewBox so nothing reflows when the real
   component lands. 4:1 is wide enough to read as a curve on a 320px phone and
   short enough that at 3440 the slot does not eat the frame — where it would,
   --hv2-curve-cap takes over and the drawing stretches rather than the box. */
const CURVE_VIEWBOX = "0 0 1200 300";

const CSS = `
.hv2{
  /* the page measure, one of its 12 columns, and the column lines the
     composition is built on, in page coordinates. --page-max is foundation's
     token: 1200, widening to 1440 above 1920, so the hero grows with the rest
     of the page instead of freezing at a private number. */
  --hv2-meas: min(100vw, var(--page-max, 1200px));
  --hv2-side: calc((100vw - var(--hv2-meas)) / 2 + 24px);
  /* distance from the wrap's content box to the viewport edge, so grid items
     can bleed out of the measure without leaving the grid */
  --hv2-bleed: var(--hv2-side);
  --hv2-col: calc((var(--hv2-meas) - 48px - 264px) / 12);
  --hv2-c9: calc(var(--hv2-side) + 8 * (var(--hv2-col) + 24px));
  --hv2-pt: 28px; --hv2-pb: 40px;
  --hv2-curve-cap: 150px;
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
.hv2-measure{position:absolute;top:0;bottom:0;left:var(--hv2-c9);right:0;
  display:flex;gap:24px;}

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
.hv2-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;}

/* masthead — real facts only. It carries its own full-bleed dark bar so the
   light stops at the rule underneath it: the mono line stays legible over the
   wedge, and the lit field gains a top edge instead of running off the page. */
.hv2-mast{position:relative;align-items:baseline;padding-bottom:14px;}
.hv2-mast::before{content:"";position:absolute;z-index:-1;
  top:calc(-1 * var(--hv2-pt));bottom:0;
  left:calc(-1 * var(--hv2-bleed));right:calc(-1 * var(--hv2-bleed));
  background:rgba(9,10,11,.94);}
.hv2-mast > *{grid-row:1;}
.hv2-m1{grid-column:1 / span 3;}
.hv2-m2{grid-column:4 / span 3;}
.hv2-m3{grid-column:7 / span 3;}
.hv2-m4{grid-column:10 / span 3;text-align:right;margin-right:-.182em;}
/* .t-mono carries the family, the 13px §6.3 floor, the tracking and the case;
   only the two colour variants and the tabular clock are local. */
.hv2-mono-lit{color:#cacaca;}          /* anything sitting over the aperture */
.hv2-clock{font-variant-numeric:tabular-nums;}

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
.hv2-h1{grid-column:1 / span 7;margin-block:34px 30px;line-height:.9;
  text-wrap:balance;}
.hv2-l{display:block;}
/* Each display line is one line by construction. nowrap makes that structural:
   a webfont swap, a metric change or a rounding error can no longer break
   "Evidence first." across two lines and silently halve the headline. */
.hv2-l > span{display:block;white-space:nowrap;}
.hv2-l2{color:#d1c9ff;}

/* two explicit rows on the left, the curve on the right, so the reading path
   runs down-left and then out to the object that closes the frame */
.hv2-foot{padding-top:24px;align-items:start;row-gap:26px;}
.hv2-lead{grid-row:1;grid-column:1 / span 5;font-size:18px;line-height:1.55;
  font-weight:300;color:#9f9fa0;max-width:30em;hyphens:manual;}
/* the actions sit on the column-1 line, under the sentence they close, so the
   masthead, the headline, the lead and the buttons all share one left edge. */
.hv2-cta{grid-row:2;grid-column:1 / span 5;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-start;}
.hv2-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;
  min-height:48px;padding:12px 22px;border-radius:8px;font-size:16px;
  background:#fff;color:#000;border:1px solid #fff;
  transition:background ${D_FAST} ${easing},border-color ${D_FAST} ${easing},color ${D_FAST} ${easing};}
.hv2-btn-ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.42);}
@media (hover: hover) and (pointer: fine){
  .hv2-btn:hover{background:#f5f5f7;border-color:#f5f5f7;}
  .hv2-btn-ghost:hover{background:rgba(255,255,255,.08);border-color:#fff;}
}
.hv2-btn:active{background:#cacaca;border-color:#cacaca;}
.hv2-btn-ghost:active{background:rgba(255,255,255,.14);border-color:#fff;}

/* ---- the curve slot ----------------------------------------------------
   Columns 6-12, bleeding to the right viewport edge, level with the lead and
   the actions. It carries its own near-black ground out to that edge: the
   wedge is stopped by a hard horizontal instead of running under a 1px line
   that then cannot be read, which is the same job .hv2-mast::before does at
   the top of the frame. No gradient touches it (APPENDIX-A: no gradient on a
   data component), and the placeholder claims nothing, so there is no source
   line until YieldCurve lands with one. */
/* the ruled record is a phone-only block; above 767px the same two facts
   sit in the masthead. */
.hv2-ledger{display:none;}

.hv2-curve{position:relative;grid-row:1 / span 2;grid-column:6 / span 7;
  margin-right:calc(-1 * var(--hv2-bleed));align-self:end;
  padding:20px 0 0;}
.hv2-curve::before{content:"";position:absolute;z-index:0;
  top:0;bottom:-100vh;left:0;right:0;
  background:rgba(9,10,11,.92);border-top:1px solid rgba(255,255,255,.12);}
.hv2-curve-box{position:relative;z-index:1;width:100%;aspect-ratio:4 / 1;
  max-height:var(--hv2-curve-cap);margin-left:auto;}
.hv2-curve-svg{display:block;width:100%;height:100%;max-width:100%;
  opacity:.6;}

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
  /* CSS order, and not source order: the two standing facts are full-width flex
     items, so in DOM order they sit BETWEEN the city and the clock and push
     the clock onto a fourth line (measured at 360x740 before this). City and
     clock share line one; the standing facts take a line each below. */
  .hv2-m1{order:1;flex:0 1 auto;min-width:0;}
  .hv2-m4{order:2;flex:0 0 auto;margin-left:auto;text-align:right;}
  .hv2-m2{order:3;flex:1 0 100%;}
  .hv2-m3{order:4;flex:1 0 100%;}

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
          line-height:.9;letter-spacing:-.03em;margin-block:16px 0;}
  .hv2-lead{grid-row:1;grid-column:1 / -1;font-size:15px;line-height:1.5;
    color:#7c7d7d;max-width:none;}
  /* On a phone the poster wants its block high and its air at the foot, not a
     hole under the masthead: 38% of the slack above, 62% below. */
  .hv2-gap{flex:.6 1 0;min-height:16px;}
  .hv2-gap-b{flex:1 1 0;min-height:12px;}
  .hv2-foot{padding-top:16px;row-gap:16px;}
  /* Full-bleed under the lead, per §5.2's poster. */
  .hv2-curve{grid-row:2;grid-column:1 / -1;align-self:stretch;
    margin-inline:-24px;padding-top:14px;}
  /* no wedge on the phone, so there is nothing to cut: the ground goes and
     only the full-bleed hairline above the curve stays (§5.2's poster). */
  .hv2-curve::before{bottom:0;background:none;}
  .hv2-curve-box{aspect-ratio:4 / 1;max-height:none;}
  .hv2-cta{grid-row:3;grid-column:1 / -1;justify-content:flex-start;gap:10px;}
  /* Content-width buttons on one row, exactly as on desktop, rather than two
     identical full-width pills with centred labels. 15px of side padding and a
     10px gap are what make both fit inside a 312px measure at 360px. */
  .hv2-btn{flex:0 1 auto;padding:12px 15px;}
}

/* Tall phones (393x852, 412x915, 430x932 — and the same devices with browser
   chrome on, above 760px). Here there is room for the record: the two standing
   facts leave the masthead and become a hairline-ruled tearsheet block under
   the headline, with the founding month, where they read as evidence rather
   than as chrome. Unnumbered: three standing facts are not a sequence
   (EVERY-SCREEN §0.2 item 4). A value never breaks mid-phrase — if it does not
   fit beside its label the ROW wraps and the value takes its own line whole,
   which is what "LIQUID MARKETS, / GLOBAL" at 360 was.
   Gated on height, not width, and additive rather than a second composition:
   below 760 the same three facts are simply mono lines in the masthead. */
@media (max-width:767px) and (min-height:760px){
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-ledger{display:block;margin:18px 0 0;}
  .hv2-lrow{display:flex;flex-wrap:wrap;align-items:baseline;
    justify-content:space-between;gap:4px 16px;padding:8px 0;
    border-top:1px solid rgba(255,255,255,.12);}
  .hv2-lrow:last-child{border-bottom:1px solid rgba(255,255,255,.12);}
  .hv2-ledger dt,.hv2-ledger dd{margin:0;font-family:var(--font-mono);
    font-size:13px;line-height:1.6;letter-spacing:.182em;text-transform:uppercase;
    font-weight:500;}
  .hv2-ledger dt{color:#7c7d7d;}
  .hv2-ledger dd{color:#cacaca;text-align:right;margin-right:-.182em;
    white-space:nowrap;}
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
  .hv2-foot{padding-top:10px;row-gap:10px;}
  .hv2-curve{padding-top:8px;}
}

/* ---- tablets are not big phones (§7 rule 7) ---------------------------- */
@media (min-width:768px) and (max-width:1023px){
  /* the two middle masthead facts wrap to two lines and collide once the
     columns get this narrow — city and time only */
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-m1{grid-column:1 / span 6;}
  .hv2-m4{grid-column:7 / span 6;}
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
  .hv2-measure{left:calc(var(--hv2-side) + 7 * (var(--hv2-col) + 24px));}
  .hv2-strip{align-self:start;height:34%;}
}

/* ---- short desktop frames (1280x720, 1366x768: the corporate laptop) ----
   647px of hero on a 720px screen has to hold the same six blocks a 1080p
   frame holds in 900. Everything that is air gives some back, and the curve
   slot takes a lower cap so it stops being the tallest thing in the frame —
   at 1280 it was 181px of a 750px hero and pushed the actions past the fold. */
@media (min-width:1024px) and (max-height:820px){
  .hv2{--hv2-pt:20px;--hv2-pb:28px;--hv2-curve-cap:130px;}
  .hv2-h1{margin-block:20px 16px;}
  .hv2-gap{min-height:16px;}
  .hv2-gap-b{min-height:12px;}
  .hv2-foot{padding-top:16px;row-gap:18px;}
  .hv2-curve{padding-top:14px;}
}
/* Above 1920 .t-display climbs to 128px, which is 60px more headline than the
   ceiling it replaced. The hero is capped at 900px tall, so the margins around
   the headline pay for it rather than the cap being broken. */
@media (min-width:1920px){
  .hv2-h1{margin-block:24px 20px;line-height:.86;}
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
  .hv2-m1{grid-column:1 / span 6;}
  .hv2-m4{grid-column:7 / span 6;}
  .hv2-h1{grid-column:1 / span 8;
          font-size:clamp(2rem, calc(15.318vw - 7.83px), 44px);
          line-height:.92;letter-spacing:-.028em;margin-block:14px 0;}
  .hv2-ledger,.hv2-curve{display:none;}
  .hv2-gap{min-height:8px;}
  .hv2-gap-b{min-height:8px;}
  .hv2-foot{padding-top:12px;row-gap:12px;}
  .hv2-lead{grid-row:1;grid-column:1 / span 6;font-size:15px;line-height:1.45;}
  .hv2-cta{grid-row:2;grid-column:1 / span 6;gap:10px;}
  .hv2-btn{min-height:44px;padding:10px 16px;font-size:15px;}
  /* The wedge stays — it is the only light in a letterbox — but it starts at
     the column-9 line of a very wide, very short frame, so it reads as a band
     down the right rather than a panel. */
  .hv2-measure{display:flex;gap:16px;}
}

/* ---- motion (every value from src/lib/motion.ts) ----------------------- */
/* Opacity and transform are split, and the split is the whole point. It is the
   site's documented entrance from globals.css: originFadeIn lands the content
   fast, originRise keeps the travel underneath it. Both run duration.base on
   the one site easing, and the reading stagger is motion.ts's own step.
   This block used to gate content, which DESIGN.md forbids in writing ("It
   never gates content becoming visible"); it came back once in transform form,
   masking the LCP element entirely for the first 200ms. Everything here is
   painted in the first frame and only settles after. */
@media (prefers-reduced-motion: no-preference){
  .hv2-l > span,.hv2-mast > *,.hv2-foot > *{
    animation:originFadeIn ${D_BASE} ${easing} both,
              originRise ${D_BASE} ${easing} both;}
  .hv2-l2 > span{animation-delay:${d(1)},${d(1)};}
  .hv2-m2{animation-delay:${d(1)},${d(1)};}
  .hv2-m3{animation-delay:${d(1)},${d(1)};}
  .hv2-m4{animation-delay:${d(2)},${d(2)};}
  .hv2-lead{animation-delay:${d(2)},${d(2)};}
  .hv2-cta{animation-delay:${d(3)},${d(3)};}
  .hv2-curve{animation-delay:${d(4)},${d(4)};}
  /* the curve draws in once, over duration.draw, after the words have settled */
  .hv2-curve-path{animation:hv2Draw ${D_DRAW} ${easing} ${d(4)} both;}
  /* the wedge wipes down one step at a time, left to right */
  .hv2-strip{animation:hv2Wipe ${D_BASE} ${easing} both;}
  .hv2-strip[data-s="1"]{animation-delay:${d(1)};}
  .hv2-strip[data-s="2"]{animation-delay:${d(2)};}
  .hv2-strip[data-s="3"]{animation-delay:${d(3)};}
  .hv2-strip[data-s="4"]{animation-delay:${d(4)};}
  /* the one continuous movement in the frame: the light sliding behind the
     fixed louvre. One composited transform per strip, all in lockstep, so it
     reads as a single source moving rather than five things drifting. */
  .hv2-strip-light{animation:hv2Drift calc(${D_BASE} * 44) cubic-bezier(.45,.05,.55,.95) infinite alternate both;}
}
@keyframes hv2Wipe{from{transform:scaleY(0)}to{transform:none}}
@keyframes hv2Drift{from{transform:translate3d(0,-7%,0)}to{transform:translate3d(0,7%,0)}}
@keyframes hv2Draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
`;

/** The real current time in the firm's stated city, not a decorative counter.
 *  Nothing renders until it hydrates — EVERY-SCREEN §0.2 item 6: the server
 *  HTML used to ship `--:--:-- ET`, which is a placeholder standing in for a
 *  fact, and this site does not print those. The cell sits in a grid row whose
 *  height is set by the masthead's other mono cells, so an empty cell costs
 *  nothing and shifts nothing (CLS stays 0).
 *
 *  The zone and its label are derived from site.city rather than written in.
 *  When the city moved from Austin to Miami this clock kept running on
 *  America/Chicago and kept printing "CT". A hardcoded zone is a fact that
 *  cannot follow the fact it describes. */
const ZONES: Record<string, { tz: string; label: string }> = {
  "Miami, Florida": { tz: "America/New_York", label: "ET" },
  "Austin, Texas": { tz: "America/Chicago", label: "CT" },
};

function zoneFor(city: string) {
  const z = ZONES[city];
  if (!z) {
    throw new Error(
      `HeroV2: no time zone mapped for site.city "${city}". Add it to ZONES ` +
        `rather than letting the masthead show another city's clock.`
    );
  }
  return z;
}

function useCityTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const still =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: zoneFor(site.city).tz,
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

/** The slot's stand-in until src/components/viz/YieldCurve.tsx (sec-motion)
 *  lands. Deliberately NOT data: one 1px stroke, no fill, no axes, no tenor
 *  ticks, no labels, no source line, at a quarter opacity — it holds the box
 *  and states nothing. It carries no `data-source`, because there is nothing
 *  to source; scripts/qa/sources.ts should see this slot appear on the
 *  whitelist only once the real component is in it. */
function CurvePlaceholder() {
  return (
    <svg
      className="hv2-curve-svg"
      viewBox={CURVE_VIEWBOX}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-hv2-curve="placeholder"
    >
      <path
        className="hv2-curve-path"
        d="M0 268 C 220 266 330 190 560 132 C 790 74 960 46 1200 26"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={0}
      />
    </svg>
  );
}

export default function HeroV2() {
  const time = useCityTime();
  const zone = zoneFor(site.city);

  return (
    <section className="hv2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="hv2-bg" aria-hidden="true">
        <div className="hv2-ground" />
        <div className="hv2-measure">
          {WEDGE.map((s, i) => (
            <div key={i} data-s={i} className="hv2-strip">
              <div className="hv2-strip-light" style={{ opacity: s.o }} />
              <div className="hv2-strip-louvre" style={{ background: louvre(s.pitch) }} />
            </div>
          ))}
        </div>
        <div className="hv2-grain" />
      </div>

      <div className="hv2-fg">
        <div className="hv2-row hv2-mast">
          <span className="t-mono hv2-m1">{site.city}</span>
          <span className="t-mono hv2-m2">{site.structure}</span>
          <span className="t-mono hv2-m3 hv2-mono-lit">{site.mandate}</span>
          <span className="t-mono hv2-m4 hv2-mono-lit">
            {time ? (
              <>
                <span className="hv2-clock">{time}</span> {zone.label}
              </>
            ) : null}
          </span>
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

        {/* Phone only: the two standing facts and the founding month as a
            ruled record, where they read as evidence rather than as chrome.
            Above 767px they are back in the masthead. */}
        <dl className="hv2-ledger">
          <div className="hv2-lrow">
            {/* "Vehicle" rather than "Structure": it is the word a tearsheet
                uses for this row, and the record should read like one. */}
            <dt>Vehicle</dt>
            <dd>{site.structure}</dd>
          </div>
          <div className="hv2-lrow">
            <dt>Mandate</dt>
            <dd>{site.mandate}</dd>
          </div>
          {/* The month, not the year. site.foundedLabel exists precisely because
              "2026" alone would let a reader assume January, and the firm is
              weeks old. */}
          <div className="hv2-lrow">
            <dt>Formed</dt>
            <dd>{site.foundedLabel}</dd>
          </div>
        </dl>

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
          {/* sec-motion builds src/components/viz/YieldCurve.tsx; this slot is
              its box and its placement. Swap CurvePlaceholder for <YieldCurve/>
              and add the source line under it — nothing else here moves. */}
          <div className="hv2-curve">
            <div className="hv2-curve-box">
              <CurvePlaceholder />
            </div>
          </div>
        </div>

        <div className="hv2-gap-b" />
      </div>
    </section>
  );
}
