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
   - A masthead of real facts (city, structure, mandate, live local time),
     mono, ruled above and below. No invented numbers anywhere — everything
     shown is from config or is the actual clock.
   - The display type left-aligned on the column-1 line, sized so that
     "Evidence first." measures almost exactly eight columns. The layout is
     built around the type, not the other way round.
   - ONE luminous element, and it is made of the grid rather than laid over it:
     the field from the column-9 line out to the viewport edge is divided into
     five equal strips, each step brighter and more open than the one to its
     left, with the 24px gutters left black between them. The left edge is
     locked to the grid — it starts exactly where the reading column ends — and
     the five steps then divide whatever width the viewport gives them, so the
     wedge reads as the same measured wedge at 1280 and at 2560. (It used to be
     four fixed 74px grid columns plus a bleed strip sized by the leftover
     margin; that made the last step 40px at 1280 and 680px at 2560, so at
     desktop widths the "wedge" was four slivers beside one flat slab — the
     stock-gradient failure this composition exists to avoid.)
     Inside each strip the light is immediately cut into a louvre of 1px
     hard-stop rules.
     Hard stops, never blur: the light is dithered into structure, so it cannot
     go hazy. The masthead bar and the full-bleed rules cut across it.
   - Fine static grain over everything, which is what makes a flat dark field
     read filmic instead of empty.

   MOTION (exact, not floaty — and never in front of the content)
   --------------------------------------------------------------
   One-shot on load: content settles, light wipes. Content — the masthead, the
   two display lines, the lead, the actions — uses the site's own entrance from
   globals.css, originFadeIn 620ms on an ease-out beside originRise 1600ms on
   the slow atmospheric curve. Opacity and transform are split so the words are
   painted in the first frame and only settle afterwards; nothing in this hero
   waits on an animation to become readable. The wedge is the exception, and
   only because it is light rather than content: it still wipes down one step at
   a time, left to right.

   Steady state is one composited transform — the light sliding behind the fixed
   louvre (22s, ±7%) — plus one text node updated once a second for the clock.
   No rAF, no canvas, no layout, and no paint after the first frame.
   (There is no index hairline. One used to step down the lit field and this
   paragraph outlived it by several commits; the note at the top of the CSS
   explains why it and the traced grid lines were removed.)

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

/** The step wedge, dimmest strip first. The five strips divide the field from
 *  the column-9 line to the viewport edge equally (widths are set in CSS so the
 *  breakpoints can drop steps on narrow screens). `o` is the strip's share of
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
  /* distance from the wrap's content box to the viewport edge, so grid items
     can bleed out of the measure without leaving the grid */
  --hv2-bleed: calc((100vw - min(100vw, 1200px)) / 2 + 24px);
  /* the site measure, one of its 12 columns, and the column-9 line in page
     coordinates. The wedge is anchored to that line: it starts exactly where
     the reading column stops, at every width, without being made of columns. */
  --hv2-meas: min(100vw, 1200px);
  --hv2-col: calc((var(--hv2-meas) - 48px - 264px) / 12);
  --hv2-c9: calc((100vw - var(--hv2-meas)) / 2 + 24px + 8 * (var(--hv2-col) + 24px));
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

/* the lit field: from the column-9 line of the measure out to the viewport
   edge. Its left edge lands on the same line the foreground content stops on;
   the strips inside then share that width equally. */
.hv2-measure{position:absolute;top:0;bottom:0;left:var(--hv2-c9);right:0;
  display:flex;gap:24px;}
/* The 12 column hairlines, the two full-bleed rules and the index line
   that used to be drawn here are all gone. They read as graph paper laid
   over the picture rather than as structure, and the two rules put a hard
   horizontal straight through the one thing in the frame that is supposed
   to read as light. The wedge already states the grid: its four lit
   columns and their black gutters ARE the measure, on the same tracks the
   type is set on. The grid still governs every edge; it is just no longer
   traced. */

/* ---- the light: a step wedge built ON the grid ------------------------
   Not a panel laid over the layout. The last four columns of the measure are
   lit individually, each one brighter and more open than the one to its left,
   with the 24px gutters left black between them. So the light is made of the
   same columns as everything else, it steps in measured increments like a
   photographic step wedge, and every boundary in it is a hard edge the grid
   already explains. The source reads as off-frame right. */
.hv2-strip{position:relative;overflow:hidden;transform-origin:50% 0;flex:1 1 0;}
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

.hv2-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.30;}

/* ---- phone-only: the wedge on its side, and the record ------------------
   Both are off above 767px. See the block at the mobile breakpoint for why
   the phone gets a different composition rather than a narrowed desktop one. */
.hv2-band,.hv2-ledger{display:none;}

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


/* The free space is split ABOVE and BELOW the message, never inside it. Both
   spacers sit outside the headline/lead/actions group, so that group reads as
   one block sitting just below optical centre, and the leftover height becomes
   air around it instead of a gap through it.
   The spacers used to straddle the headline (1 above, .72 below), which put
   ~136px of nothing between the headline and the sentence that completes it.
   That is what made the hero read as three floating bands: 36% of an 880px
   hero was gap, and most of it fell between two elements that belong together. */
.hv2-gap{flex:1 1 0;min-height:40px;}
.hv2-gap-b{flex:.55 1 0;min-height:24px;}

/* display type — the layout is built to it: at every width "Evidence first."
   is set to run to the column-8 line.
   The size term is derived from that promise rather than guessed. Eight columns
   plus their seven gutters measure (2/3)(100vw - 312px) + 168px, and DM Serif
   Display sets "Evidence first." at 6.006x its font-size, so the size that
   lands the line exactly is 11.1vw - 6.66px. Above a 1200px viewport the
   measure stops growing, so the size has to stop too: the 7.9rem ceiling is
   that same formula evaluated at 1200px, and it holds the line at 759px
   against a 760px target from there up.
   It was 8.7vw, a viewport term with no relationship to the measure. Since
   the measure freezes at 1200px and the clamp did not bite until 1453px, every
   width in between sized the type off the viewport while the grid it was
   supposed to hit sized off the measure: 669px against 760px at 1280px, a 12%
   miss on the file's own central claim, across the most common laptop band. */
.hv2-h1{grid-column:1 / span 9;font-family:var(--font-display);font-weight:400;
  color:#fff;font-size:clamp(2.5rem, calc(11.1vw - 6.66px), 7.9rem);line-height:.88;
  letter-spacing:-.026em;margin-block:34px 30px;}
/* The mask is gone with the reveal it existed for. Keeping overflow:hidden
   here would only be a liability now: line-height is .88, so the descenders of
   "first." and "capital." already sit near the box edge, and DM Serif Display
   is a swapped webfont — a late metric change against Georgia could clip them
   past the .1em allowance the padding used to buy. */
.hv2-l{display:block;}
/* Each display line is one line by construction, and both clamps below size the
   type to a measured fraction of the column. nowrap makes that structural: a
   webfont swap, a metric change or a rounding error can no longer break
   "Evidence first." across two lines and silently halve the headline. */
.hv2-l > span{display:block;white-space:nowrap;}
.hv2-l2{color:#d1c9ff;}

/* two explicit rows, so the reading path runs down-left to down-right and the
   actions land on the corner of the composition rather than wherever grid
   auto-placement happens to drop them */
.hv2-foot{padding-top:24px;align-items:start;row-gap:26px;}
.hv2-lead{grid-row:1;grid-column:1 / span 6;font-size:18px;line-height:1.55;
  font-weight:300;color:#9f9fa0;max-width:30em;}
/* the actions sit on the column-1 line, under the sentence they close, so the
   masthead, the headline, the lead and the buttons all share one left edge and
   the reading path runs straight down it.
   They used to be right-aligned into columns 5-8, which aligned them to the
   column-9 line — a background feature, not anything in the foreground — so
   the eye ran left, left, left, then jumped right across an empty corner. */
.hv2-cta{grid-row:2;grid-column:1 / span 6;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-start;}
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
  /* The lit field starts on the column-3 line of the phone's 4-column grid and
     runs OFF the right edge. It used to stop at the 24px page padding, which
     made the one luminous element in the frame read as a panel someone placed
     near the corner rather than as light arriving from off-frame — the same
     thing the desktop bleed is for. */
  .hv2-measure{left:calc(24px + 2 * ((100vw - 108px) / 4 + 20px));right:0;gap:20px;}
  /* Three steps, not two: the three brightest. Two bars cannot show a gradient,
     so the wedge — the whole idea of the element — did not survive the phone.
     Three do, and they still stop above the type: on a phone the reading column
     is the full width, so the light stays a lit block in the upper right with a
     hard bottom edge instead of something the copy has to sit on top of. */
  .hv2-strip[data-s="0"],.hv2-strip[data-s="1"]{display:none;}
  /* 28%, not 34%. The hard bottom edge is only worth having if the type clears
     it, and 34% did not: measured with the entrance finished, the light landed
     7px into the headline at 375x667 and 9px into it at 360x640, so "first."
     sat on the brightest strip on two of the commonest phones. The block is a
     share of a hero whose height is capped, while the content above the
     headline is near enough constant, so the shorter the screen the further the
     type rides up into the light. 28% clears it by 16px at 360x640 and 86px at
     390x844; the short-screen rule below handles the rest. */
  .hv2-strip{align-self:start;height:28%;}
  .hv2-row{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:20px;}
  /* The masthead keeps all four facts on a phone. It used to drop two of them,
     and they were the two that say what the firm IS — a private partnership
     trading liquid global markets — leaving a first screen that named a city
     and told the time. They do not fit across: at 360px the measure is 312px
     and "PRIVATE PARTNERSHIP" plus "LIQUID MARKETS, GLOBAL" need ~371px. So the
     ledger goes vertical instead, city and clock across the top rule, the two
     standing facts stacked under it, flush to the same left edge as everything
     else. Line-height tightens to 1.75 so three rows cost ~58px, not 66. */
  /* The masthead is one line again — city left, clock right. The two standing
     facts are not dropped this time, they MOVE: they become the numbered record
     below the headline, where they read as evidence rather than as chrome. That
     also buys back the ~38px a three-row ledger up here was costing, and the
     display type spends it. */
  .hv2-mast{row-gap:0;}
  .hv2-mono{line-height:1.75;}
  .hv2-m1{grid-row:1;grid-column:1 / span 2;}
  .hv2-m4{grid-row:1;grid-column:3 / span 2;}
  .hv2-m2,.hv2-m3{display:none;}

  /* The vertical wedge is off on the phone. With the headline set to fill the
     whole measure there is no column left beside it, and parking the light
     above the type was what kept putting it on top of the type. Turned on its
     side it gets a job instead of a corner: it is the rule between the argument
     and the evidence, still five graded steps, still cut by the louvre, still
     running off the right edge. */
  .hv2-measure{display:none;}
  .hv2-band{display:flex;gap:12px;height:44px;margin:22px 0 0;
    margin-right:-24px;}
  .hv2-bandstrip{position:relative;overflow:hidden;flex:1 1 0;
    transform-origin:0 50%;}

  /* The record. Numbered, hairline-ruled, key left and value hard right, the
     way a tearsheet sets a fact. */
  .hv2-ledger{display:block;margin:20px 0 0;}
  .hv2-lrow{display:flex;align-items:baseline;justify-content:space-between;
    gap:16px;padding:11px 0;border-top:1px solid #3f4041;}
  .hv2-lrow:last-child{border-bottom:1px solid #3f4041;}
  .hv2-ledger dt,.hv2-ledger dd{margin:0;font-family:var(--font-mono);
    font-size:11px;line-height:1.6;letter-spacing:.182em;text-transform:uppercase;
    font-weight:500;}
  .hv2-ledger dt{color:#7c7d7d;}
  .hv2-ledger dd{color:#cacaca;text-align:right;margin-right:-.182em;}
  .hv2-lx{color:#4b49aa;margin-right:10px;}
  /* Same promise as the desktop rule, measured against the phone's grid: here
     the headline spans all four columns, so it is sized to fill the whole
     measure (100vw - 48px) rather than eight-twelfths of it. DM Serif Display
     sets the line at 6.0081x its font-size (measured with the webfont loaded,
     letter-spacing included), and the target is 98% of the measure rather than
     100%: at exactly 100% sub-pixel rounding tips the line over and it wraps,
     which costs the whole headline. So 0.98 * (100vw - 48px) / 6.0081, i.e.
     16.312vw - 7.83px, with the nowrap above as the hard guard.
     It was 12.4vw — a guess, and a low one: it left "Evidence first." at 85% of
     the measure (291px of 342px at 390px), stopping 50px short of the right
     edge with nothing to explain why. The 4.9rem ceiling is the desktop rule
     evaluated at 768px, so the two clamps meet across the breakpoint instead
     of stepping. */
  .hv2-h1{grid-column:1 / -1;font-size:clamp(2.4rem, calc(16.312vw - 7.83px), 4.9rem);
          margin-block:20px 0;}
  .hv2-lead{grid-row:1;grid-column:1 / -1;font-size:15px;line-height:1.5;
    color:#7c7d7d;max-width:none;}
  .hv2-gap{min-height:20px;}
  .hv2-gap-b{min-height:12px;}
  .hv2-cta{grid-row:2;grid-column:1 / -1;justify-content:flex-start;}
  /* Content-width buttons on one row, exactly as on desktop, rather than two
     identical full-width pills with centred labels. Everything else in this
     hero is flush left and set to its own measure; stacked full-bleed pills
     were the one element that looked like a different design system. 16px of
     side padding and a 10px gap are what make both fit inside a 312px measure
     at 360px: 134 + 159 + 10 = 303. At 16px and the desktop 12px gap it came to
     313 and wrapped on a 1px miss. Below 360px they wrap to their own widths and
     stay left-aligned. Height stays 48px, so the touch targets are unchanged. */
  .hv2-cta{gap:10px;}
  .hv2-btn{flex:0 1 auto;padding:12px 15px;}
  .hv2-foot{padding-top:16px;}
}
/* ---- tall phones: the cover treatment ----------------------------------
   Everything above fits any phone. This block is the part that needs room,
   so it is gated on height rather than shipped everywhere and then clipped:
   a 390x844 screen can carry it, a 375x667 cannot, and the difference is
   ~200px of display type. Below 820px tall the hero keeps the two-line
   headline and the content-width actions, which is the same composition at a
   quieter volume, not a different one.
   820 and not 780: measured, a 360x800 screen still ran 45px past the fold with
   the cover type, and an action you have to scroll to is not an action. */
@media (max-width:767px) and (min-height:820px){
  /* Sized to the longest WORD rather than the longest line, so each span breaks
     in two and the headline stacks four deep, filling the measure edge to edge.
     "Evidence" sets at 3.7802x its font-size, so 98% of the measure is
     25.925vw - 12.44px. nowrap comes off because here the wrap IS the
     composition. Past about 617px wide "Evidence first." fits on one line again
     and the headline settles back to two by itself, so the tablet case needs no
     extra breakpoint. */
  .hv2-l > span{white-space:normal;}
  .hv2-h1{font-size:clamp(2.4rem, calc(25.925vw - 12.44px), 6rem);
          line-height:.84;letter-spacing:-.038em;margin-block:8px 0;}
  /* the cover type is worth ~40px of surrounding air on a 844 screen */
  .hv2-band{margin-top:14px;}
  .hv2-ledger{margin-top:14px;}
  .hv2-lrow{padding:8px 0;}
  /* Actions as full-bleed stamps, not pills floating on a field. They continue
     the ledger's rhythm: same hairlines, label left, mono arrow hard right, so
     the foot of the screen reads as one ruled stack rather than as a form. */
  .hv2-foot{padding-top:16px;row-gap:0;}
  .hv2-cta{gap:0;flex-direction:column;align-items:stretch;
    margin-inline:-24px;margin-top:16px;}
  .hv2-btn{flex:0 0 auto;justify-content:space-between;min-height:56px;
    padding:16px 24px;border-radius:0;border:0;border-top:1px solid #3f4041;
    font-size:15px;letter-spacing:.02em;background:transparent;color:#fff;}
  .hv2-btn::after{content:"\\2192";font-family:var(--font-mono);color:#7c7d7d;}
  .hv2-btn:first-child{background:#f5f5f7;color:#000;border-top-color:#f5f5f7;}
  .hv2-btn:first-child::after{color:#000;}
  .hv2-btn:last-child{border-bottom:1px solid #3f4041;}
}
/* Short phones (iPhone SE 1st gen and the 320x568 class). The hero is allowed
   to be exactly one screen and no more: the actions are the last thing in it,
   and an action you have to scroll to find is not an action. At 320x568 the
   full layout runs 671px against a 568px viewport, so here the standing facts
   fold back into the city line, the display margins halve, and the two spacers
   give up the minimums they hold on taller screens. Nothing is removed that
   carries meaning except the two mono facts, which are the only content on the
   screen that also exists one tap away on /firm.
   Measured: 671px -> 556px, so the actions land above the fold on the smallest
   phone still in use. (They were below it before this hero was touched, too -
   at ~630px - so this is a fix, not a regression being papered over.) */
@media (max-width:767px) and (max-height:640px){
  .hv2-m2,.hv2-m3{display:none;}
  .hv2-h1{margin-block:14px 12px;}
  .hv2-gap{min-height:12px;}
  .hv2-gap-b{min-height:8px;}
  .hv2-foot{padding-top:12px;row-gap:14px;}
  .hv2-lead{font-size:14px;}
}
/* Very short screens (the 320x568 class). The band and the record are the two
   blocks that cost real height, and they are the two whose content survives
   elsewhere: the standing facts fold back into the masthead line, and the light
   is atmosphere. Cut them here rather than push the actions off the screen.
   Measured: 718px -> 552px against a 568px viewport. */
@media (max-width:767px) and (max-height:600px){
  .hv2-band,.hv2-ledger{display:none;}
  .hv2-m2{display:block;grid-row:2;grid-column:1 / -1;}
  .hv2-m3{display:block;grid-row:3;grid-column:1 / -1;}
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
/* Opacity and transform are split, and the split is the whole point. It is the
   site's documented entrance (the .fade-in rule in globals.css): originFadeIn
   lands the content fast on an ease-out, originRise keeps the slow atmospheric
   travel underneath it. Same keyframes, same curves, same stagger values as every
   other h1 on the site — a hero is not a reason to re-invent the motion.

   This block used to gate content, which DESIGN.md forbids in writing ("It
   never gates content becoming visible") and whose Motion note records fixing
   once already. It came back here in transform form, which is exactly why an
   opacity-based check never caught it: hv2Rise moved each display line 102% of
   its own height under overflow:hidden, so the headline was not faint early on,
   it was ABSENT — the LCP element, unpainted. Measured on the old block:

     line 1   still 51% behind the mask at 100ms, 25% at 200ms
     line 2   fully hidden until 110ms, still 55% hidden at 200ms
     lead     opacity 0.00 through 300ms, 0.56 at 500ms, solid at ~1000ms
     actions  identical — both buttons invisible for the first third of a second

   Every one of those is now painted in the first frame and only settles after.
   The 340ms hold on the lead and the actions is gone; the reading stagger it
   was trying to buy is kept, at the house 90/180ms, where it costs nothing. */
@media (prefers-reduced-motion: no-preference){
  .hv2-l > span,.hv2-mast > *,.hv2-foot > *{
    animation:originFadeIn 620ms cubic-bezier(.22,.61,.36,1) both,
              originRise 1600ms cubic-bezier(.455,.03,.515,.955) both;}
  .hv2-l2 > span{animation-delay:90ms,90ms;}
  .hv2-m2{animation-delay:60ms,60ms;}
  .hv2-m3{animation-delay:120ms,120ms;}
  .hv2-m4{animation-delay:180ms,180ms;}
  .hv2-foot > *{animation-delay:180ms,180ms;}
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
}
/* hv2Rise and hv2In are gone: the entrance uses originFadeIn / originRise from
   globals.css. hv2Wipe and hv2Drift stay — they move light, not content. */
@keyframes hv2Wipe{from{transform:scaleY(0)}to{transform:none}}
@keyframes hv2Drift{from{transform:translate3d(0,-7%,0)}to{transform:translate3d(0,7%,0)}}
`;

/** The real current time in the firm's stated city, not a decorative counter.
 *  Rendered as a placeholder on the server and filled on mount so the markup
 *  is deterministic.
 *
 *  The zone and its label are derived from site.city rather than written in.
 *  When the city moved from Austin to Miami this clock kept running on
 *  America/Chicago and kept printing "CT" — a masthead reading MIAMI, FLORIDA
 *  beside a Central-time clock, wrong by an hour, sitting under a headline
 *  that says "Evidence first." A hardcoded zone is a fact that cannot follow
 *  the fact it describes. */
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

export default function HeroV2() {
  const time = useCityTime();

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
          <span className="hv2-mono hv2-m1">{site.city}</span>
          <span className="hv2-mono hv2-m2">{site.structure}</span>
          <span className="hv2-mono hv2-m3 hv2-mono-lit">{site.mandate}</span>
          <span className="hv2-mono hv2-m4 hv2-mono-lit">
            <span className="hv2-clock">{time ?? "--:--:--"}</span> {zoneFor(site.city).label}
          </span>
        </div>

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

        {/* Phone only. The wedge turns on its side and becomes the rule between
            the argument and the evidence, and the two standing facts become a
            numbered record under it. Both are display:none above 767px, where
            the vertical wedge and the four-across masthead already do this job. */}
        <div className="hv2-band" aria-hidden="true">
          {WEDGE.map((s, i) => (
            <div key={i} data-s={i} className="hv2-bandstrip">
              <div className="hv2-strip-light" style={{ opacity: s.o }} />
              <div className="hv2-strip-louvre" style={{ background: louvre(s.pitch) }} />
            </div>
          ))}
        </div>

        <dl className="hv2-ledger">
          <div className="hv2-lrow">
            {/* "Vehicle" rather than "Structure": it is the word a tearsheet
                uses for this row, and the record should read like one. */}
            <dt><span className="hv2-lx">01</span>Vehicle</dt>
            <dd>{site.structure}</dd>
          </div>
          <div className="hv2-lrow">
            <dt><span className="hv2-lx">02</span>Mandate</dt>
            <dd>{site.mandate}</dd>
          </div>
        </dl>

        <div className="hv2-row hv2-foot">
          {/* Written to the voice the rest of the site already uses — "We build
              the data before we build the view", "Sized to survive the tail, not
              to flatter the mean", "Risk runs independently of the desk and can
              cut any position". Short declaratives, a term of art where a term
              of art is accurate, no category words doing the work.
              It was: "<name> runs concentrated, systematic strategies across
              liquid global markets, underwritten by our own research and a
              single risk framework." One 24-word sentence of institutional
              boilerplate, and the only line on the site that read like a
              brochure. Every claim below is one the firm already makes on /firm;
              nothing here is a number, a track record, or a capacity figure. */}
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
        </div>

        <div className="hv2-gap-b" />
      </div>
    </section>
  );
}
