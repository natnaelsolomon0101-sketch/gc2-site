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
/* The surface fills the hero corner to corner and the paper shows through it.
   Opacity is a variable so the phone can turn it down without the component
   knowing: over a 393px column the headline sits ON the surface rather than
   beside it, and the ink has to keep 7:1. */
.hv2-surface{position:absolute;inset:0;opacity:var(--hv2-surface-o, .9);}
.hv2-surface > *{width:100%;height:100%;display:block;}
/* The stand-in. One quiet diagonal of the page's own tones — enough to prove
   the box and the fade, deliberately not enough to look like a design, because
   a placeholder that looks finished is a placeholder nobody replaces. */
.hv2-surface-ph{width:100%;height:100%;
  background:linear-gradient(118deg,
    color-mix(in srgb, var(--color-ground-2) 92%, transparent) 0%,
    color-mix(in srgb, var(--color-surface) 78%, transparent) 46%,
    color-mix(in srgb, var(--color-ground-2) 30%, transparent) 100%);}
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

/* ---- the actions ---------------------------------------------------------
   One glass, one ghost. The glass is the MotionSites pill translated to paper:
   a white veil rather than a dark one, because on a warm off-white ground the
   thing glass does is lift toward the page's own light; a blur behind it so
   the surface it sits on is present but not legible through it; and the
   gradient hairline drawn with the mask-composite trick in INK alpha, so the
   edge catches on two corners the way a real bevel would.

   The white is a literal, and it is the one colour in this file that is not a
   token: the semantic set has ground, ground-2 and surface, all of which are
   the page's own tones, and a glass fill made of them is invisible on them.
   Written as color-mix, not as a white-with-alpha literal, so it reads as a
   deliberate white and not as a leftover from the dark build. If this pattern
   spreads past the hero it wants a --color-glass token from foundation. */
.hv2-btn{justify-content:center;min-height:48px;padding:12px 22px;}
.hv2-btn-glass{position:relative;border:0;border-radius:8px;
  background:color-mix(in srgb, #ffffff 55%, transparent);
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  color:var(--color-ink);
  transition:transform var(--dur-fast) var(--ease),
             background var(--dur-fast) var(--ease);}
.hv2-btn-glass::before{content:"";position:absolute;inset:0;border-radius:inherit;
  padding:1px;pointer-events:none;
  background:linear-gradient(135deg,
    rgba(20,19,17,.46) 0%, rgba(20,19,17,.10) 46%, rgba(20,19,17,.40) 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;}
@media (hover: hover) and (pointer: fine){
  .hv2-btn-glass:hover{transform:scale(1.03);
    background:color-mix(in srgb, #ffffff 72%, transparent);}
}
.hv2-btn-glass:active{transform:scale(.99);}
/* A transform on a control is a motion effect like any other. */
@media (prefers-reduced-motion: reduce){
  .hv2-btn-glass:hover,.hv2-btn-glass:active{transform:none;}
}
/* The ghost's border steps down from ink to hairline-strong HERE and not in
   globals: side by side, a full-ink outline is heavier than any glass can be
   on paper, and the secondary action was reading as the primary one. This is
   the hero saying which of its two actions is which, not a restyle of .btn. */
.hv2-cta .btn-ghost{border-color:var(--color-hairline-strong);}
.hv2-cta{grid-column:1 / span 6;display:flex;flex-wrap:wrap;gap:12px;
  justify-content:flex-start;}

/* ---- the scroll cue ------------------------------------------------------
   Positioned, not in flow: pinned to the hero's bottom edge it costs the
   composition no height and sits where a cue belongs rather than wherever the
   content stops. It grows downward once at the end of the sequence and is gone
   by 120px of scroll. aria-hidden — it tells a sighted reader there is more
   below the fold, which is not information a screen reader is missing. */
.hv2-cue{position:absolute;z-index:1;bottom:20px;left:var(--hv2-side);
  display:flex;flex-direction:column;align-items:flex-start;gap:8px;}
.hv2-cue-word{color:var(--color-ink-3);line-height:1;}
.hv2-cue-line{display:block;width:1px;height:30px;transform-origin:50% 0;
  background:var(--color-hairline-strong);}

/* ---- narrow -------------------------------------------------------------- */
@media (max-width:767px){
  .hv2{--hv2-pb:28px;
       min-height:min(calc(100vh - var(--nav-h, 56px)), 820px);
       /* The headline sits ON the surface here, not beside it, so the surface
          comes down to where ink still measures past 7:1 against it. */
       --hv2-surface-o:.55;}
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
  .hv2-gap{min-height:20px;}
  .hv2-gap-b{min-height:16px;}
}

/* Short phones: the 320x568 floor, and every phone measured with the browser
   chrome on screen. The hero is exactly one screen and no more — the actions
   are the last thing in it, and an action you have to scroll to find is not an
   action. */
@media (max-width:767px) and (max-height:700px){
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
  .hv2{--hv2-pb:20px;--hv2-surface-o:.7;
       min-height:calc(100vh - var(--nav-h, 48px));}
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

@media (prefers-reduced-motion: no-preference){
  .hv2-facts > *,.hv2-l > span,.hv2-lead,.hv2-cta{
    animation:originFadeIn var(--dur-base) var(--ease) both,
              hv2Rise var(--dur-base) var(--ease) both;}
  .hv2-l2 > span{animation-delay:var(--stagger),var(--stagger);}
  .hv2-lead{animation-delay:calc(var(--stagger) * 3),calc(var(--stagger) * 3);}
  .hv2-cta{animation-delay:calc(var(--stagger) * 6),calc(var(--stagger) * 6);}
  .hv2-surface{animation:originFadeIn var(--dur-draw) var(--ease) both;}
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

/** The surface's stand-in until src/components/viz/YieldSurface.tsx lands.
 *  It occupies the box and states nothing: no data, no source line, no
 *  data-source attribute, because there is nothing yet to source. It is a
 *  single very quiet token wash, deliberately not a picture — a placeholder
 *  that looks like a design is a placeholder nobody replaces. */
function SurfacePlaceholder() {
  return <div className="hv2-surface-ph" data-hv2-surface="placeholder" />;
}

export default function HeroV2() {
  return (
    <section className="hv2">
      <style>{CSS}</style>

      <div className="hv2-bg" aria-hidden="true">
        <div className="hv2-wash" />
        {/* Swap SurfacePlaceholder for <YieldSurface/> when it lands; the box,
            the fade and the phone's opacity step are already here. */}
        <div className="hv2-surface">
          <SurfacePlaceholder />
        </div>
        <div className="hv2-grain" />
      </div>

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
            <Link href="/firm" className="hv2-btn hv2-btn-glass">
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
