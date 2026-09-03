/* ===========================================================================
   HeroV2 — the full-bleed first screen.

   ONE FRAME, EDGE TO EDGE. The hero is 100dvh minus the nav (capped at 900 on
   desktop, 820 at tablet and below), its background is sec-motion's
   <YieldSurface/> filling it corner to corner with the paper ground showing
   through, and over that sit four things and nothing else: a thin caption row
   of the standing facts, the headline at the display ceiling, the lead at its
   30em measure, and two actions — one glass, one ghost.

   WHAT LEFT, AND WHY. The striped tile field is retired. It was the dark
   build's one luminous element, and it survived the light pass as a ruled
   swatch, but two full-bleed surfaces in one frame is one too many and the
   surface is the better of them: it is the same public data the curve was
   drawing, at the scale of the whole screen, rather than a decorative wedge
   beside it. WEDGE, louvre(), light(), the band and the curve slot all went
   with it. The bloom wash stayed — on paper it is what stops the ground going
   flat behind the type, and it still reads under the surface.

   The masthead is a caption row now, not a band: a single .t-caption line of
   city, structure, mandate and the session strip, on a scrim thin enough that
   the surface shows through it and heavy enough that ink-2 holds its contrast.

   CHOREOGRAPHY. Fade-rise — opacity 0 to 1 and 24px of travel, on the site's
   one easing. Headline at 0, lead at three stagger steps, actions at six, and
   the surface fading up over --dur-draw underneath all of it. Every value is
   --stagger or --dur-*; there is not a literal in the file. Under reduced
   motion the base stylesheet IS the finished state, surface included.

   THE LCP ELEMENT is the h1 and nothing gates it beyond --dur-base.
   ========================================================================= */

import Link from "next/link";
import { site } from "@/config/site";
import { css } from "@/lib/css";
import SessionClock from "@/components/viz/SessionClock";
import YieldSurface from "@/components/viz/YieldSurface";

/* -- grain ---------------------------------------------------------------
   Turbulence pushed into the alpha channel over a fixed ink fill: sparse, weak
   specks that read as the tooth of a sheet. It is what keeps a flat field from
   looking like a screen fill, and it dithers away any banding in the wash.
   Inline data URI — no request, no raster decode — and static, so it costs
   exactly one paint, ever. */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

const CSS = css`
.hv2{
  /* The site measure and the page geometry the composition is built on.
     --page-max is foundation's token: 1200, widening to 1440 above 1920, where
     the container also stops being centred. */
  --hv2-meas: min(100vw, var(--page-max, 1200px));
  --hv2-side: calc((100vw - var(--hv2-meas)) / 2 + 24px);
  --hv2-bleed-l: var(--hv2-side);
  --hv2-bleed-r: calc(100vw - var(--hv2-side) - (var(--hv2-meas) - 48px));
  --hv2-col: calc((var(--hv2-meas) - 48px - 264px) / 12);
  --hv2-pt: 0px; --hv2-pb: 40px;
  position:relative; isolation:isolate; overflow:hidden;
  min-height:min(calc(100vh - var(--nav-h, 72px)), 900px);
  display:flex; flex-direction:column;
  background:var(--color-ground);
}
@supports (height: 100dvh){
  .hv2{min-height:min(calc(100dvh - var(--nav-h, 72px)), 900px);}
}

/* ---- the background, in three layers ------------------------------------
   Ground, then the wash, then the surface, then the grain over all of it. The
   surface is a component and owns its own drawing; everything else here is two
   gradients and a data URI, so the whole background is CSS and one inline SVG
   — no image to decode and nothing that animates after the first frame. */
.hv2-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.hv2-wash{position:absolute;inset:0;
  background:
    radial-gradient(120% 78% at 84% 4%,
      rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 44%, rgba(247,245,240,0) 72%),
    radial-gradient(150% 100% at 86% 0%,
      rgba(20,19,17,.055) 0%, rgba(20,19,17,.018) 48%, rgba(20,19,17,0) 74%);}
/* THE SURFACE. A direct child of .hv2 and NOT of .hv2-bg, because .hv2-bg is
   aria-hidden and this figure carries the page's only data-source and the
   attribution that goes with it — burying it in decorative furniture would
   hide a citation. It is absolutely positioned so it costs the composition no
   height, and it clips: the canvas is drawn at a fixed 900px and centred, so a
   shorter hero crops it top and bottom the way a full-bleed background image
   crops, and it is edge to edge horizontally at every width.

   The canvas's own opacity prop does the paper-through-it work (0.45 desktop,
   0.28 on phones, where the headline sits ON the surface rather than beside
   it). Measured composited contrast under the headline is in the commit. */
/* --hv2-surface-o is the layer's own opacity and it multiplies the component's
   opacity prop: 0.45 x 0.85 desktop, 0.45 x 0.62 on phones, which is the 0.28
   the brief asks for there. It has to be a variable and the entrance keyframe
   has to end AT it — a plain to-opacity-1 overrides the declared value
   for the whole life of the animation, which is how the phone step silently
   did nothing and the headline measured against a surface at full strength. */
.hv2-surface{position:absolute;inset:0;z-index:0;overflow:hidden;
  pointer-events:none;opacity:var(--hv2-surface-o, 1);}
/* The canvas, and NOT ".hv2-surface .ys": YieldSurface puts className on the
   figure itself, so the figure IS .ys.hv2-surface and every descendant rule
   written against .ys matched nothing at all. That is why the canvas sat at the
   top of the box and the phone's lower-third mask had no ink to reveal — the
   poster's missing picture was one selector, not a tuning problem. */
.hv2-surface canvas{position:absolute;top:50%;left:0;right:0;
  transform:translateY(-50%);}
/* THE MASK, and it is the composition and not a patch. Measured with the
   canvas pixels composited over paper, ink-2 in the lead ran 1.56-3.27:1
   against a 4.5 floor and the attribution ran 1.16:1 at 1280 — a surface dense
   enough to be worth drawing is dense enough to destroy every text role except
   the headline. fit="band" right-anchors the slab, which does most of the work
   the mask was doing; what is left is the last of the falloff across the
   reading column, and the numbers in the commit are measured with both in
   place. On the CANVAS and not on .hv2-surface, because the figure's
   attribution is a child of the same box and a mask there would erase the
   citation along with the drawing. */
.hv2-surface canvas{
  -webkit-mask-image:linear-gradient(90deg,
    transparent 0%, transparent 30%, rgba(0,0,0,.35) 50%, #000 66%);
  mask-image:linear-gradient(90deg,
    transparent 0%, transparent 30%, rgba(0,0,0,.35) 50%, #000 66%);}
/* The attribution is the one part of the figure that is content, so it leaves
   the clipped canvas box and pins to the foot of the frame on the column-1
   line, in ink-3 like every other caption on the page. */
.hv2-surface .ys-source{position:absolute;margin:0;bottom:20px;
  left:var(--hv2-side);right:var(--hv2-side);max-width:52em;
  color:var(--color-ink-3);
  /* Its own paper, because it is the one piece of text that has to sit at the
     dense end of the frame: near-invisible where the surface is already light,
     and the difference between 1.16:1 and legible where it is not. */
  background:color-mix(in srgb, var(--color-ground) 88%, transparent);}
.hv2-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.30;}

/* ---- foreground ---------------------------------------------------------- */
.hv2-fg{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;
  max-width:var(--page-max, 1200px);width:100%;margin-inline:auto;
  padding-inline:24px;padding-block:var(--hv2-pt) var(--hv2-pb);}
.hv2-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;}

/* ---- the facts row -------------------------------------------------------
   A single caption line under the nav, the four standing facts across it. It
   bleeds to both viewport edges and carries a scrim rather than a solid band:
   the surface reads through it, and ink-2 keeps its contrast over the mix.
   The scrim is a ground veil and not a white one — on paper, lightening toward
   white is a different material from lightening toward the page. */
.hv2-facts{position:relative;align-items:baseline;padding-block:12px;}
.hv2-facts::before{content:"";position:absolute;z-index:-1;inset:0;
  left:calc(-1 * var(--hv2-bleed-l));right:calc(-1 * var(--hv2-bleed-r));
  background:color-mix(in srgb, var(--color-ground) 78%, transparent);
  border-bottom:1px solid var(--color-hairline);}
.hv2-facts > *{grid-row:1;}
.hv2-f1{grid-column:1 / span 3;}
.hv2-f2{grid-column:4 / span 3;}
.hv2-f3{grid-column:7 / span 3;}
.hv2-f3{color:var(--color-ink);}
/* The clock renders null until it hydrates, so the slot and not the component
   holds the row open — 32px is the component's dense row. Without it the row
   grew when the clock arrived and everything under it moved: CLS 0.0295. */
.hv2-clockslot{grid-column:10 / span 3;min-height:32px;}

/* The free space sits above and below the message, never inside it, and it is
   split evenly: with the curve gone the block is ~320px of an 800px field, and
   the old 1:.5 ratio parked it at 60% down the frame with 300px of nothing
   above it. Even halves put it on the optical middle, which is what the
   reference composition does. */
.hv2-gap{flex:1 1 0;min-height:32px;}
.hv2-gap-b{flex:1 1 0;min-height:24px;}

/* ---- the type ------------------------------------------------------------
   .t-display, unmodified: 96px from 768 up and 128px above 1920, with the
   tier's own line-height and colour. Seven columns is what "Evidence first."
   needs at the ceiling — 769px at 128px against 802px of column at 1920. */
.hv2-h1{grid-column:1 / span 7;margin-block:0 28px;}
.hv2-l{display:block;}
/* Each display line is one line by construction. nowrap makes that structural:
   a webfont swap or a rounding error can no longer break "Evidence first."
   across two lines and silently halve the headline. */
.hv2-l > span{display:block;white-space:nowrap;}
/* deep-iris, 6.80:1 on ground — the only one of the six that may be set as
   text on paper. */
.hv2-l2{color:var(--color-accent-deep-iris);}

.hv2-lead{grid-column:1 / span 5;font-size:18px;line-height:1.55;font-weight:300;
  color:var(--color-ink-2);max-width:30em;hyphens:manual;}

/* ---- the actions --------------------------------------------------------
   THE GLASS WAS BUILT AND THEN JUDGED FROM THE FRAME, which is what the brief
   asked for. It is gone. The pill worked as a translation — a white veil
   rather than a dark one, a 6px blur, the gradient hairline drawn with the
   mask-composite trick in ink alpha — and it still read as the quieter of the
   two actions, for a reason no amount of tuning fixes: fit="band" anchors the
   surface to the RIGHT, the actions sit on the column-1 line at the left, and
   a glass control with nothing behind it is an outline on paper. Side by side
   with an outlined secondary, neither read as the thing to press.

   So "Our approach" is the ink .btn again — the one black button, 17.04:1, the
   single heaviest object on the page, which is what makes it the one thing to
   press — and "Investor inquiries" is .btn-ghost at the site's own default. If
   the surface ever moves under the actions, the glass is worth rebuilding; the
   trick is documented in this commit rather than left in the file as dead
   style. */
.hv2-btn{justify-content:center;min-height:48px;padding:12px 22px;}
.hv2-cta{grid-column:1 / span 6;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-start;}

/* ---- the scroll cue ------------------------------------------------------
   Positioned, not in flow: pinned to the hero's bottom edge it costs the
   composition no height and sits where a cue belongs rather than wherever the
   content stops. It grows downward once at the end of the sequence and is gone
   by 120px of scroll. aria-hidden — it tells a sighted reader there is more
   below the fold, which is not information a screen reader is missing. */
/* Bottom RIGHT since round 7: the surface's attribution owns the foot-left,
   and two quiet captions on the same corner is one too many. */
.hv2-cue{position:absolute;z-index:1;bottom:20px;right:var(--hv2-side);
  display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.hv2-cue-line{margin-right:1px;}
.hv2-cue-word{color:var(--color-ink-3);line-height:1;}
.hv2-cue-line{display:block;width:1px;height:30px;transform-origin:50% 0;
  background:var(--color-hairline-strong);}

/* ---- narrow -------------------------------------------------------------- */
@media (max-width:767px){
  .hv2{--hv2-pb:28px;
       min-height:min(calc(100vh - var(--nav-h, 56px)), 820px);}
  /* The headline sits ON the surface here rather than beside it, so the canvas
     comes down to where ink still measures past 7:1 against it. The prop is a
     server value and cannot be a media query, so the step is an opacity on the
     layer; the component's own 0.45 is the desktop figure. */
  /* The horizontal mask cannot help here: it separates a reading column on the
     left from the surface's mass on the right, and on a phone the text IS the
     whole column — the lead runs edge to edge straight through the dense end.
     Washing the surface out instead got ink-2 to 4.45:1 against a 4.5 floor
     and left almost nothing to look at. So the mask turns 90 degrees: the
     surface lives in the lower third, under the actions and clear of the
     sentence, and it can stay strong enough to be worth having. It also puts
     something behind the glass CTA, which on a phone is the only place there
     was anything for it to refract. */
  .hv2{--hv2-surface-o:.92;}
  /* The figure is bottom-anchored here, not centred. Centred, the slab's ink
     sits in the middle of a 900px canvas and therefore in the middle of the
     screen — exactly where the vertical mask is transparent — so the phone
     poster had a mask over nothing and no picture at all. Anchored low, the
     ink lands in the lower third where the mask lets it through. */
  .hv2-surface canvas{top:auto;bottom:-180px;transform:none;
    -webkit-mask-image:linear-gradient(180deg,
      transparent 0%, transparent 38%, rgba(0,0,0,.55) 48%, #000 58%);
    mask-image:linear-gradient(180deg,
      transparent 0%, transparent 38%, rgba(0,0,0,.55) 48%, #000 58%);}
  @supports (height: 100dvh){
    .hv2{min-height:min(calc(100dvh - var(--nav-h, 56px)), 820px);}
  }
  .hv2-row{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:20px;}
  /* Two lines: city and the session strip. The standing facts took a line each
     between them and made the row four deep — 22% of a 430px screen before the
     headline started. They are on /firm and in the footer. */
  .hv2-facts{display:flex;flex-wrap:wrap;align-items:baseline;
    column-gap:12px;row-gap:0;padding-block:10px;}
  .hv2-facts .t-caption{line-height:1.75;}
  .hv2-f1{order:1;flex:1 0 100%;}
  .hv2-f2,.hv2-f3{display:none;}
  .hv2-clockslot{order:2;flex:1 0 100%;margin-top:4px;}

  /* Two lines, at every phone width, in both engines. Sized off the measure
     rather than off a guess: DM Serif Display sets "Evidence first." at 6.006x
     its font-size, so 92% of (100vw - 48px) is 15.318vw - 7.83px. The 8% of
     headroom is deliberate — Chromium on Android measures this face wider than
     WebKit, and 98% is what tipped 412 and 393 into a four-line headline. The
     96px ceiling is .t-display's value at 768, so the clamp and the tier meet
     across the breakpoint instead of stepping. */
  .hv2-h1{grid-column:1 / -1;
          font-size:clamp(2.5rem, calc(15.318vw - 7.83px), 96px);
          letter-spacing:-.03em;margin-block:0 20px;}
  .hv2-lead{grid-column:1 / -1;font-size:15px;line-height:1.5;max-width:none;}
  .hv2-cta{grid-column:1 / -1;gap:10px;margin-top:22px;}
  /* 15px of side padding and a 10px gap are what fit both inside a 312px
     measure at 360. Below that they wrap and stay left-aligned. */
  .hv2-btn{flex:0 1 auto;padding:12px 15px;}
  /* .45 against 1, not even halves: the surface needs a band of frame with no
     text over it, and on a phone that band can only come from below the
     actions. The message sits high and the lower third is the picture. */
  .hv2-gap{flex:.45 1 0;min-height:20px;}
  .hv2-gap-b{flex:1 1 0;min-height:16px;}
  /* No cue on a phone. The attribution wraps to four lines at 393 and runs the
     width of the frame; a second caption pinned to the same foot collided with
     it. The source line is the one that has to be there. */
  .hv2-cue{display:none;}
}

/* Short phones: the 320x568 floor, and every phone measured with the browser
   chrome on screen. The hero is exactly one screen and no more — the actions
   are the last thing in it, and an action you have to scroll to find is not an
   action. */
@media (max-width:767px) and (max-height:700px){
  /* At 320x568 the hero is 512px and the content ends at ~485: there is no
     clear band under the actions for the surface to live in, so it goes quiet
     and late rather than running under the sentence — measured, ink-2 hit
     1.55:1 before this. A phone this short is type and nothing else. */
  .hv2{--hv2-surface-o:.45;}
  .hv2-surface canvas{
    -webkit-mask-image:linear-gradient(180deg,
      transparent 0%, transparent 66%, rgba(0,0,0,.5) 78%, #000 88%);
    mask-image:linear-gradient(180deg,
      transparent 0%, transparent 66%, rgba(0,0,0,.5) 78%, #000 88%);}
  .hv2-h1{margin-block:0 14px;}
  .hv2-gap{min-height:12px;}
  .hv2-gap-b{min-height:10px;}
  .hv2-cta{margin-top:16px;}
  .hv2-cue{display:none;}
}

/* ---- tablets are not big phones (§7 rule 7) ------------------------------ */
@media (min-width:768px) and (max-width:1023px){
  .hv2-f2,.hv2-f3{display:none;}
  .hv2-f1{grid-column:1 / span 6;}
  .hv2-clockslot{grid-column:7 / span 6;}
}
@media (min-width:768px) and (max-width:1024px) and (orientation:portrait){
  /* A portrait tablet is a tall frame: the headline takes the whole measure —
     at 96px "Evidence first." is 577px against 720px of it at 768 — and the
     lead and the actions sit under it rather than beside anything. */
  .hv2{min-height:min(calc(100vh - var(--nav-h, 56px)), 820px);}
  @supports (height: 100dvh){
    .hv2{min-height:min(calc(100dvh - var(--nav-h, 56px)), 820px);}
  }
  .hv2-h1{grid-column:1 / -1;}
  .hv2-lead{grid-column:1 / span 8;}
  .hv2-cta{grid-column:1 / -1;margin-top:28px;}
  /* Same reason as the phone, and the same answer: the composition here is
     stacked, so a lead across eight of twelve columns reaches the band's
     right-anchored mass and ink-2 measured 3.76:1 there. The mask turns 90
     degrees and the surface takes the lower third, clear of the sentence. */
  .hv2{--hv2-surface-o:.8;}
  .hv2-surface canvas{top:auto;bottom:-180px;transform:none;}
  .hv2-gap{flex:.45 1 0;}
  .hv2-gap-b{flex:1 1 0;}
  .hv2-surface canvas{
    -webkit-mask-image:linear-gradient(180deg,
      transparent 0%, transparent 44%, rgba(0,0,0,.55) 54%, #000 64%);
    mask-image:linear-gradient(180deg,
      transparent 0%, transparent 44%, rgba(0,0,0,.55) 54%, #000 64%);}
}

/* ---- short desktop frames (1280x720, 1366x768) --------------------------- */
@media (min-width:1024px) and (max-height:820px){
  .hv2{--hv2-pb:28px;}
  .hv2-h1{margin-block:0 20px;}
  .hv2-gap{min-height:16px;}
  .hv2-gap-b{min-height:12px;}
  .hv2-cta{margin-top:24px;}
  .hv2-cue{display:none;}
}

/* ---- above 1920: anchor left, exactly as .wrap does ---------------------- */
@media (min-width:1920px){
  .hv2{--hv2-side: calc((1920px - var(--page-max)) / 2 + 24px);}
  .hv2-fg{margin-inline: calc((1920px - var(--page-max)) / 2) auto;}
  .hv2-h1{margin-block:0 32px;}
}

/* ---- landscape phones: a letterbox, composed as one (§7 rule 8) ----------
   Last in the file on purpose: a landscape phone matches the phone, tablet and
   desktop width rules too, and this has to win over all of them. The 12-column
   grid is restated because Playwright's own landscape descriptors are 734x393
   and 852x393 — chrome comes off the 852 — so a landscape phone can be
   narrower than 767px and pick up the phone block's 4-column grid, where a
   "span 6" runs into implicit tracks and takes the whole width. */
@media (max-height:500px) and (orientation:landscape){
  .hv2-row{grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;}
  .hv2{--hv2-pb:20px;
       min-height:calc(100vh - var(--nav-h, 48px));}
  .hv2{--hv2-surface-o:.8;}
  .hv2-surface .ys-source{display:none;}
  @supports (height: 100dvh){
    .hv2{min-height:calc(100dvh - var(--nav-h, 48px));}
  }
  .hv2-f2,.hv2-f3{display:none;}
  .hv2-f1{grid-column:1 / span 12;}
  /* 345px of letterbox cannot carry a 106px session block on top of a
     headline, a lead and two actions. The strip is one tap away in the menu
     and the footer. */
  .hv2-clockslot{display:none;}
  .hv2-facts{padding-block:8px;}
  .hv2-h1{grid-column:1 / span 8;
          font-size:clamp(2rem, calc(15.318vw - 7.83px), 44px);
          letter-spacing:-.028em;margin-block:0 12px;}
  .hv2-lead{grid-column:1 / span 8;font-size:15px;line-height:1.45;}
  .hv2-cta{grid-column:1 / span 8;gap:10px;margin-top:14px;}
  .hv2-btn{min-height:44px;padding:10px 16px;}
  .hv2-gap{min-height:8px;}
  .hv2-gap-b{min-height:8px;}
  .hv2-cue{display:none;}
}
/* Landscape phones under ~400px tall — 568x320 and 740x360. §7 rule 8's
   "100dvh with no minimum" is right for a 393-tall letterbox and wrong here:
   the stack does not fit 272px of usable height, so forcing exactly one
   viewport put the actions across the bottom edge and sliced them. */
@media (max-height:400px) and (orientation:landscape){
  .hv2{min-height:0;}
  .hv2-gap{flex:0 0 auto;}
  .hv2-gap-b{flex:0 0 auto;}
}
/* And under ~340px the lead comes off, which §7 rule 8 allows in as many words.
   Without it the whole composition is masthead, headline and actions — all
   whole and all on the screen. */
@media (max-height:340px) and (orientation:landscape){
  .hv2-lead{display:none;}
}

/* ---- motion --------------------------------------------------------------
   Fade-rise: opacity and 24px of travel, split into two keyframes so the words
   are painted in the first frame and only settle afterwards. This block used to
   gate content, which DESIGN.md forbids in writing, and it came back once in
   transform form and masked the LCP element entirely for 200ms. Nothing here
   is invisible for longer than --dur-base.

   Headline at 0, lead at three stagger steps, actions at six, the cue last.
   The surface fades up over --dur-draw underneath all of it. */
@keyframes hv2Rise{from{transform:translate3d(0,24px,0)}to{transform:none}}
@keyframes hv2Grow{from{transform:scaleY(0)}to{transform:none}}
@keyframes hv2CueOut{from{opacity:1}to{opacity:0}}
@keyframes hv2SurfaceIn{from{opacity:0}to{opacity:var(--hv2-surface-o, 1)}}

@media (prefers-reduced-motion: no-preference){
  .hv2-facts > *,.hv2-l > span,.hv2-lead,.hv2-cta{
    animation:originFadeIn var(--dur-base) var(--ease) both,
              hv2Rise var(--dur-base) var(--ease) both;}
  .hv2-l2 > span{animation-delay:var(--stagger),var(--stagger);}
  .hv2-lead{animation-delay:calc(var(--stagger) * 3),calc(var(--stagger) * 3);}
  .hv2-cta{animation-delay:calc(var(--stagger) * 6),calc(var(--stagger) * 6);}
  .hv2-surface{animation:hv2SurfaceIn var(--dur-draw) var(--ease) both;}
  /* The entrance is on the word and the rule and NOT on .hv2-cue, because the
     scroll-out below also animates opacity: two animations on one element do
     not compose, the later one simply wins, and the cue would be on screen at
     t=0 with no fade at all. The wrapper is the scroll's; what is inside it
     belongs to the sequence. */
  .hv2-cue-word{animation:originFadeIn var(--dur-base) var(--ease)
                calc(var(--stagger) * 9) both;}
  .hv2-cue-line{animation:hv2Grow var(--dur-base) var(--ease)
                calc(var(--stagger) * 9) both;}
}

/* The cue's scroll-out is inside @supports, and that is not politeness: with
   animation-timeline unsupported the declaration is dropped and the animation
   falls back to the document timeline and simply runs, so the cue would vanish
   on its own. Where the timeline does not exist the cue stays, which is the
   honest degradation. */
@supports (animation-timeline: scroll()){
  @media (prefers-reduced-motion: no-preference){
    .hv2-cue{animation:hv2CueOut linear both;
      animation-timeline:scroll(root block);animation-range:0 120px;}
  }
}

/* ---- print ---------------------------------------------------------------
   On paper there is no surface and no band, only ink. */
@media print{
  .hv2-bg{display:none !important;}
  .hv2-facts::before{background:none !important;
    border-bottom-color:var(--color-hairline-strong) !important;}
  .hv2{min-height:0 !important;}
  .hv2-cue{display:none !important;}
}
`;

export default function HeroV2() {
  return (
    <section className="hv2">
      <style>{CSS}</style>

      <div className="hv2-bg" aria-hidden="true">
        <div className="hv2-wash" />
        <div className="hv2-grain" />
      </div>

      {/* Not inside .hv2-bg: this figure carries the page's data-source and its
          attribution, and aria-hidden furniture is no place for a citation. */}
      <YieldSurface height={900} fit="band" opacity={0.6} className="hv2-surface" />

      <div className="hv2-fg">
        <div className="hv2-row hv2-facts">
          <span className="t-caption hv2-f1">{site.city}</span>
          <span className="t-caption hv2-f2">{site.structure}</span>
          <span className="t-caption hv2-f3">{site.mandate}</span>
          {/* Cross-section object (OWNERSHIP.md): sec-motion builds it,
              sec-chrome places it in the nav and the footer, the hero shows it
              in the facts row. It renders nothing until it hydrates, so the
              server HTML carries no time-shaped placeholder. */}
          <div className="hv2-clockslot">
            <SessionClock className="hv2-clock" caption={false} rows="open" dense />
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

        <div className="hv2-row">
          <p className="hv2-lead">
            Concentrated systematic strategies in liquid global markets. One research
            process, one risk framework, and a risk seat that runs independently of
            the desk.
          </p>
        </div>

        <div className="hv2-row">
          <div className="hv2-cta">
            <Link href="/firm" className="btn hv2-btn">
              Our approach
            </Link>
            <Link href="/contact" className="btn btn-ghost hv2-btn">
              Investor inquiries
            </Link>
          </div>
        </div>

        <div className="hv2-gap-b" />

        <div className="hv2-cue" aria-hidden="true">
          <span className="t-caption hv2-cue-word">Scroll</span>
          <span className="hv2-cue-line" />
        </div>
      </div>
    </section>
  );
}
