/* ===========================================================================
   HeroV2 — the first screen, r9: a place, not a chart.

   THE COMPOSITION (from the owner's reference, MotionSites "Aethera Studio"):
   a picture fills the whole frame edge to edge, the nav floats over it, and
   in the sky above the picture sits one centred stack — a single editorial
   serif line with its two operative words in italic, a two-line lead, and
   the actions as pills. Nothing else competes with the picture. The standing
   facts and the data attribution move to the foot of the frame, as captions
   over the near ground, the way a plate carries its caption.

   THE PICTURE is the same Treasury term structure the r6–r8 hero drew as a
   wireframe, now painted: <YieldSurface mode="painted"/> — ninety days of
   curves as layered hills receding into a paper sky, in the iris ramp, today
   at the front. It is public data with its citation on the frame, so it can
   carry the first screen the way a photograph would without being a stock
   photograph, and without pretending a meadow has anything to do with a
   partnership. The horizon is --ys-horizon: 44% of the frame on desktop,
   lower on phones where the copy needs the height.

   WHY THE MESH LEFT. Two rounds of measured contrast work masked the
   wireframe to 45% alpha and anchored it away from the type, and what was
   left read as a diagram someone had faded. A first screen has to be a
   picture you would stop on; a faint drawing of one is not that. Painting the
   same data at full strength and putting the type where the sky is solves
   the contrast problem by composition rather than by dimming the thing you
   came to see.

   NAV. The section pulls up under the sticky nav by --nav-h and pads by the
   same, so the glass pills sit over the sky exactly as they do over the
   reference. sec-chrome's transparent-until-scroll behaviour on "/" is what
   makes this work; nothing here touches the nav.

   CHOREOGRAPHY. Fade-rise on the headline, lead and actions at 0 / 3 / 6
   stagger steps; the landscape fades up over --dur-draw beneath them; the
   foot captions last. On scroll the landscape parallaxes down and the copy
   rises out ahead of it (scroll-driven, in @supports, reduced-motion off).
   The LCP element is the h1 and nothing gates it beyond --dur-base.
   ========================================================================= */

import Link from "next/link";
import { site } from "@/config/site";
import { css } from "@/lib/css";
import SessionClock from "@/components/viz/SessionClock";
import YieldSurface from "@/components/viz/YieldSurface";

const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

const CSS = css`
.hv2{
  --hv2-meas: min(100vw, var(--page-max, 1200px));
  --hv2-side: calc((100vw - var(--hv2-meas)) / 2 + 24px);
  --ys-horizon: .44;
  --hv2-copy-top: 6vh;
  position:relative; isolation:isolate; overflow:hidden;
  /* Under the nav, and one full screen tall: the picture owns the fold. */
  margin-top:calc(-1 * var(--nav-h, 72px));
  min-height:min(100vh, 980px);
  display:flex; flex-direction:column;
  background:var(--color-ground);
}
@supports (height: 100dvh){ .hv2{min-height:min(100dvh, 980px);} }

/* ---- the sky ---------------------------------------------------------------
   Paper at the top, warming into the haze the landscape rises out of, with a
   low sun on the horizon line. All CSS; nothing here animates. */
.hv2-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.hv2-sky{position:absolute;inset:0;
  background:
    radial-gradient(60% 34% at 50% calc(var(--ys-horizon) * 100%),
      rgba(255,246,228,.85) 0%, rgba(255,246,228,.35) 40%, rgba(247,245,240,0) 72%),
    linear-gradient(180deg,
      #f7f5f0 0%, #f4f2ee 30%, #ede9f3 62%, #e5e1f1 calc(var(--ys-horizon) * 100%),
      #e5e1f1 100%);}
.hv2-grain{position:absolute;inset:0;z-index:2;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.22;mix-blend-mode:multiply;}

/* ---- the picture ---------------------------------------------------------- */
.hv2-land.ys-painted{position:absolute;inset:0;z-index:0;pointer-events:none;
  opacity:var(--hv2-land-o, 1);will-change:transform;}
.hv2-land canvas{position:absolute;inset:0;}
/* The attribution is the one part of the figure that is content. It pins to
   the foot, right, in paper over the near ground. */
.hv2-land .ys-source{position:absolute;margin:0;bottom:22px;
  right:var(--hv2-side);left:auto;max-width:42%;text-align:right;
  color:rgba(247,245,240,.82);pointer-events:auto;}

/* ---- the copy ------------------------------------------------------------- */
.hv2-fg{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;
  align-items:center;text-align:center;
  max-width:var(--page-max, 1200px);width:100%;margin-inline:auto;
  padding:calc(var(--nav-h, 72px) + var(--hv2-copy-top)) 24px 0;}
.hv2-copy{display:flex;flex-direction:column;align-items:center;width:100%;}
.hv2-h1{margin:0 0 26px;max-width:14em;
  font-size:clamp(44px, 6.7vw, 108px);letter-spacing:-.025em;line-height:1.02;
  text-wrap:balance;}
.hv2-h1 em{font-style:italic;color:var(--color-accent-deep-iris);}
.hv2-lead{margin:0;font-size:19px;line-height:1.5;font-weight:300;
  color:var(--color-ink-2);max-width:34em;text-wrap:pretty;}
.hv2-cta{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:34px;}
.hv2-btn{justify-content:center;min-height:50px;padding:12px 26px;border-radius:999px;}
.hv2-btn.btn-ghost{background:color-mix(in srgb, var(--color-ground) 55%, transparent);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}

.hv2-gap{flex:1 1 0;min-height:24px;}

/* ---- the foot: the standing facts, as captions over the near ground -------- */
.hv2-foot{position:relative;width:100%;display:flex;flex-wrap:wrap;gap:8px 28px;
  align-items:baseline;justify-content:flex-start;text-align:left;
  padding:0 0 22px;color:rgba(247,245,240,.92);}
.hv2-foot .t-caption,.hv2-foot span{color:inherit;}
.hv2-foot .hv2-f3{color:#fff;}
.hv2-clockslot{min-height:32px;display:flex;align-items:baseline;}
/* Leave the right side of the foot to the attribution. */
.hv2-foot{padding-right:50%;}

/* ---- narrow ---------------------------------------------------------------- */
@media (max-width:767px){
  .hv2{--ys-horizon:.52;--hv2-copy-top:3vh;
       margin-top:calc(-1 * var(--nav-h, 56px));min-height:min(100vh, 900px);}
  @supports (height: 100dvh){ .hv2{min-height:min(100dvh, 900px);} }
  .hv2-fg{padding-inline:20px;}
  /* Two lines at every phone width: DM Serif sets "Evidence first." at 6.006x
     its size, so 92% of (100vw - 40px) is 15.318vw - 6.6px. */
  .hv2-h1{font-size:clamp(2.4rem, calc(15.318vw - 6.6px), 72px);
          margin-bottom:18px;letter-spacing:-.03em;line-height:1.0;}
  .hv2-lead{font-size:15.5px;line-height:1.5;max-width:26em;}
  .hv2-cta{margin-top:24px;gap:10px;}
  .hv2-btn{flex:0 1 auto;padding:12px 20px;min-height:48px;}
  .hv2-foot{padding-right:0;padding-bottom:106px;gap:4px 16px;}
  .hv2-f2,.hv2-f3{display:none;}
  .hv2-land .ys-source{left:20px;right:20px;bottom:16px;text-align:left;max-width:none;color:rgba(247,245,240,.7);}
}
@media (max-width:767px) and (max-height:700px){
  .hv2{--ys-horizon:.58;}
  .hv2-h1{margin-bottom:12px;}
  .hv2-cta{margin-top:16px;}
  .hv2-foot{padding-bottom:96px;}
  .hv2-clockslot{display:none;}
}

/* ---- tablets are not big phones ------------------------------------------- */
@media (min-width:768px) and (max-width:1023px){
  .hv2{--ys-horizon:.48;}
  .hv2-f2{display:none;}
  .hv2-foot{padding-right:0;padding-bottom:64px;}
  .hv2-land .ys-source{left:var(--hv2-side);right:var(--hv2-side);text-align:left;max-width:none;}
}

/* ---- short desktop frames (1280x720, 1366x768) ------------------------------ */
@media (min-width:1024px) and (max-height:820px){
  .hv2{--ys-horizon:.46;--hv2-copy-top:3vh;}
  .hv2-h1{margin-bottom:18px;font-size:clamp(44px, 5.8vw, 84px);}
  .hv2-cta{margin-top:24px;}
}

/* ---- landscape phones ------------------------------------------------------ */
@media (max-height:500px) and (orientation:landscape){
  .hv2{--ys-horizon:.46;--hv2-copy-top:2vh;
       margin-top:calc(-1 * var(--nav-h, 48px));min-height:100vh;}
  @supports (height: 100dvh){ .hv2{min-height:100dvh;} }
  .hv2-h1{font-size:clamp(2rem, 6vw, 44px);margin-bottom:10px;}
  .hv2-lead{font-size:15px;line-height:1.4;}
  .hv2-cta{margin-top:14px;gap:10px;}
  .hv2-btn{min-height:44px;padding:10px 18px;}
  .hv2-foot{padding-right:0;padding-bottom:14px;}
  .hv2-f2,.hv2-f3,.hv2-clockslot{display:none;}
  .hv2-land .ys-source{display:none;}
}
@media (max-height:400px) and (orientation:landscape){
  .hv2{min-height:0;}
  .hv2-gap{flex:0 0 auto;min-height:40px;}
}
@media (max-height:340px) and (orientation:landscape){
  .hv2-lead{display:none;}
}

/* ---- motion ---------------------------------------------------------------- */
@keyframes hv2Rise{from{transform:translate3d(0,24px,0)}to{transform:none}}
@keyframes hv2LandIn{from{opacity:0}to{opacity:var(--hv2-land-o, 1)}}
@keyframes hv2Par{to{transform:translate3d(0,14%,0)}}
@keyframes hv2CopyOut{to{opacity:0;transform:translate3d(0,-48px,0)}}

@media (prefers-reduced-motion: no-preference){
  .hv2-h1,.hv2-lead,.hv2-cta,.hv2-foot > *{
    animation:originFadeIn var(--dur-base) var(--ease) both,
              hv2Rise var(--dur-base) var(--ease) both;}
  .hv2-lead{animation-delay:calc(var(--stagger) * 3),calc(var(--stagger) * 3);}
  .hv2-cta{animation-delay:calc(var(--stagger) * 6),calc(var(--stagger) * 6);}
  .hv2-foot > *{animation-delay:calc(var(--stagger) * 9),calc(var(--stagger) * 9);}
  .hv2-land{animation:hv2LandIn var(--dur-draw) var(--ease) both;}
}
@supports (animation-timeline: scroll()){
  @media (prefers-reduced-motion: no-preference){
    /* The landscape's entrance and its parallax are on the same element and
       would not compose, so the entrance moves to the canvas box and the
       wrapper carries the scroll. */
    .hv2-land{animation:hv2Par linear both;
      animation-timeline:scroll(root block);animation-range:0 100vh;}
    .hv2-land canvas{animation:hv2LandIn var(--dur-draw) var(--ease) both;}
    .hv2-copy{animation:hv2CopyOut linear both;
      animation-timeline:scroll(root block);animation-range:0 70vh;}
  }
}

/* ---- print ------------------------------------------------------------------ */
@media print{
  .hv2-bg,.hv2-land{display:none !important;}
  .hv2{min-height:0 !important;margin-top:0 !important;}
  .hv2-foot{color:var(--color-ink) !important;}
  .hv2-h1 em{color:var(--color-ink) !important;}
}
`;

export default function HeroV2() {
  return (
    <section className="hv2">
      <style>{CSS}</style>

      <div className="hv2-bg" aria-hidden="true">
        <div className="hv2-sky" />
        <div className="hv2-grain" />
      </div>

      {/* Not inside .hv2-bg: this figure carries the page's data-source and its
          attribution, and aria-hidden furniture is no place for a citation. */}
      <YieldSurface mode="painted" className="hv2-land" />

      <div className="hv2-fg">
        <div className="hv2-copy">
          <h1 className="t-display hv2-h1">
            Evidence <em>first</em>. Then <em>capital</em>.
          </h1>
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
        </div>

        <div className="hv2-gap" />

        <div className="hv2-foot">
          <span className="t-caption hv2-f1">{site.city}</span>
          <span className="t-caption hv2-f2">{site.structure}</span>
          <span className="t-caption hv2-f3">{site.mandate}</span>
          <div className="hv2-clockslot">
            <SessionClock className="hv2-clock" caption={false} rows="open" dense />
          </div>
        </div>
      </div>

    </section>
  );
}
