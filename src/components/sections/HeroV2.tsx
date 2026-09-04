/* ===========================================================================
   HeroV2 — the first screen, r9: the floating chart.

   THE COMPOSITION (owner's two calls, 3–4 Sep): the MotionSites "Aethera"
   structure — nav floating over the frame, one centred editorial serif line
   with its two operative words in italic, a two-line lead, pill actions — and
   under it, as the picture, the thing the owner said he loved on r8: the
   floating term-structure mesh. Now drawn as what it is, a stock chart in
   the air: <YieldSurface mode="chart"/> — the same ninety Treasury curves,
   with a gridded floor, tenor labels along the front edge, the date range
   down the side, yield ticks up the back corner, the ten-year as a bold line
   with an area ribbon dropped to the floor, and a marker on its last value
   with the number beside it. It rocks and it bobs. Every label is a value
   from the feed; the citation is on the frame.

   WHERE THINGS SIT. The copy is centred in the upper part of the frame on
   clean paper. The chart owns the lower part, centred, and bleeds a little
   past the fold so it reads as continuing. The standing facts run as one
   caption line at the foot-left; the attribution at the foot-right.

   NAV. The section pulls up under the sticky nav by --nav-h and pads by the
   same, so the glass pills sit over the frame. sec-chrome's transparent-
   until-scroll behaviour on "/" is what makes this work.

   CHOREOGRAPHY. Fade-rise on headline, lead, actions at 0 / 3 / 6 stagger
   steps; the chart fades and rises in over --dur-draw beneath them; the foot
   last. On scroll the chart parallaxes down and the copy rises out ahead of
   it (scroll-driven, in @supports, reduced-motion off). The LCP element is
   the h1 and nothing gates it beyond --dur-base.
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
  --hv2-copy-top: 5vh;
  --hv2-chart-h: 60%;
  --hv2-foot-h: 64px;
  position:relative; isolation:isolate; overflow:hidden;
  margin-top:calc(-1 * var(--nav-h, 72px));
  min-height:min(100vh, 980px);
  display:flex; flex-direction:column;
  background:var(--color-ground);
}
@supports (height: 100dvh){ .hv2{min-height:min(100dvh, 980px);} }

/* ---- ground ------------------------------------------------------------- */
.hv2-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.hv2-wash{position:absolute;inset:0;
  background:
    radial-gradient(70% 55% at 50% 78%,
      rgba(209,201,255,.34) 0%, rgba(209,201,255,.12) 45%, rgba(247,245,240,0) 75%),
    radial-gradient(120% 60% at 50% 0%,
      rgba(255,250,240,.7) 0%, rgba(247,245,240,0) 70%);}
.hv2-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.26;}

/* ---- the picture: the floating chart ------------------------------------ */
/* Desktop: the chart floats in the right half, beside the words, from under
   the nav to the foot band, bleeding a little past the right edge. Under
   1024 it drops below the copy as a band (the phone stack). */
.hv2-chart{position:absolute;left:49%;right:-1%;
  top:calc(var(--nav-h, 72px) + 3vh);bottom:calc(var(--hv2-foot-h) + 7vh);
  height:auto;z-index:0;pointer-events:none;}
@media (max-width:1023px){
  .hv2-chart{left:0;right:0;top:auto;bottom:var(--hv2-foot-h);
    height:calc(var(--hv2-chart-h) - var(--hv2-foot-h));}
}
.hv2-chart canvas{position:absolute;inset:0;}
.hv2-chart .ys-source{position:absolute;margin:0;
  bottom:calc(20px - var(--hv2-foot-h));
  /* The figure box overhangs the right edge by 10%; the caption comes back
     to the container's right edge. */
  right:calc(var(--hv2-side) + 10vw);left:auto;max-width:calc((var(--hv2-meas) - 48px) * .46);
  text-align:right;color:var(--color-ink-3);pointer-events:auto;}

/* ---- the copy ------------------------------------------------------------- */
.hv2-fg{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;
  align-items:flex-start;text-align:left;
  max-width:var(--page-max, 1200px);width:100%;margin-inline:auto;
  padding:calc(var(--nav-h, 72px) + var(--hv2-copy-top)) 24px 0;}
.hv2-gap-t{flex:1 1 0;min-height:8px;}
.hv2-copy{display:flex;flex-direction:column;align-items:flex-start;width:100%;
  max-width:54%;}
.hv2-h1{margin:0 0 24px;
  font-size:clamp(44px, 6.6vw, 108px);letter-spacing:-.025em;line-height:.98;}
.hv2-l{display:block;white-space:nowrap;}
.hv2-h1 em{font-style:italic;color:var(--color-accent-deep-iris);}
.hv2-lead{margin:0;font-size:19px;line-height:1.5;font-weight:300;
  color:var(--color-ink-2);max-width:30em;text-wrap:pretty;}
.hv2-cta{display:flex;flex-wrap:wrap;gap:12px;justify-content:flex-start;margin-top:30px;}
.hv2-btn{justify-content:center;min-height:50px;padding:12px 26px;border-radius:999px;}
.hv2-btn.btn-ghost{background:color-mix(in srgb, var(--color-ground) 70%, transparent);}

.hv2-gap{flex:1 1 0;min-height:24px;}

/* ---- the foot: the standing facts as one caption line ---------------------- */
.hv2-foot{position:relative;width:100%;display:flex;flex-wrap:wrap;gap:6px 28px;
  align-items:baseline;justify-content:flex-start;text-align:left;
  padding:0 52% 20px 0;color:var(--color-ink-3);}
.hv2-foot .t-caption,.hv2-foot span{color:inherit;}
.hv2-foot .hv2-f3{color:var(--color-ink);}
.hv2-clockslot{min-height:32px;display:flex;align-items:baseline;}

/* ---- narrow ---------------------------------------------------------------- */
@media (max-width:767px){
  .hv2{--hv2-copy-top:3vh;--hv2-chart-h:60%;--hv2-foot-h:136px;
       margin-top:calc(-1 * var(--nav-h, 56px));min-height:min(100vh, 900px);}
  @supports (height: 100dvh){ .hv2{min-height:min(100dvh, 900px);} }
  .hv2-fg{padding-inline:20px;}
  .hv2-gap-t{flex:0 0 auto;min-height:0;}
  .hv2-copy{max-width:none;}
  .hv2-h1{font-size:clamp(2.4rem, calc(15.318vw - 6.6px), 72px);
          margin-bottom:16px;letter-spacing:-.03em;line-height:1.0;}
  .hv2-lead{font-size:15.5px;line-height:1.5;max-width:26em;}
  .hv2-cta{margin-top:22px;gap:10px;}
  .hv2-btn{flex:0 1 auto;padding:12px 20px;min-height:48px;}
  .hv2-foot{padding:0 0 118px;gap:4px 16px;}
  .hv2-f2,.hv2-f3{display:none;}
  .hv2-chart .ys-source{left:20px;right:20px;bottom:calc(14px - var(--hv2-foot-h));text-align:left;max-width:none;}
}
@media (max-width:767px) and (max-height:700px){
  .hv2{--hv2-chart-h:48%;--hv2-foot-h:118px;}
  .hv2-h1{margin-bottom:12px;}
  .hv2-cta{margin-top:16px;}
  .hv2-foot{padding-bottom:108px;}
  .hv2-clockslot{display:none;}
}

/* ---- tablets are not big phones ------------------------------------------- */
@media (min-width:768px) and (max-width:1023px){
  .hv2{--hv2-chart-h:56%;--hv2-foot-h:92px;}
  .hv2-gap-t{flex:0 0 auto;min-height:0;}
  .hv2-copy{max-width:none;}
  .hv2-f2{display:none;}
  .hv2-foot{padding-right:0;padding-bottom:62px;}
  .hv2-chart .ys-source{left:var(--hv2-side);right:var(--hv2-side);bottom:calc(16px - var(--hv2-foot-h));text-align:left;max-width:none;}
}

/* ---- short desktop frames (1280x720, 1366x768) ------------------------------ */
@media (min-width:1024px) and (max-height:820px){
  .hv2{--hv2-copy-top:2vh;--hv2-chart-h:56%;--hv2-foot-h:56px;}
  .hv2-h1{margin-bottom:16px;font-size:clamp(44px, 5.6vw, 80px);}
  .hv2-cta{margin-top:22px;}
}

/* ---- landscape phones ------------------------------------------------------ */
@media (max-height:500px) and (orientation:landscape){
  .hv2{--hv2-copy-top:2vh;--hv2-chart-h:46%;--hv2-foot-h:40px;
       margin-top:calc(-1 * var(--nav-h, 48px));min-height:100vh;}
  @supports (height: 100dvh){ .hv2{min-height:100dvh;} }
  .hv2-gap-t{flex:0 0 auto;min-height:0;}
  .hv2-copy{max-width:none;}
  .hv2-h1{font-size:clamp(2rem, 6vw, 44px);margin-bottom:10px;}
  .hv2-lead{font-size:15px;line-height:1.4;}
  .hv2-cta{margin-top:14px;gap:10px;}
  .hv2-btn{min-height:44px;padding:10px 18px;}
  .hv2-foot{padding:0 0 14px;}
  .hv2-f2,.hv2-f3,.hv2-clockslot{display:none;}
  .hv2-chart .ys-source{display:none;}
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
@keyframes hv2ChartIn{from{opacity:0;transform:translate3d(0,40px,0)}to{opacity:1;transform:none}}
/* THE SCROLL-AWAY, turned up (owner: "I like the effect that disappears when
   you scroll, make that very obvious"). The copy lifts 160px, shrinks to 90%
   and is gone by half a viewport; the chart sinks a quarter of its box and
   fades to a third by the time the frame has scrolled off. Both are scroll-
   driven, so scrolling back plays them back. */
@keyframes hv2Par{to{transform:translate3d(0,26%,0) scale(.96);opacity:.32}}
@keyframes hv2CopyOut{
  40%{opacity:.55}
  to{opacity:0;transform:translate3d(0,-160px,0) scale(.9);filter:blur(6px)}}
@keyframes hv2FootOut{to{opacity:0;transform:translate3d(0,-40px,0)}}

@media (prefers-reduced-motion: no-preference){
  .hv2-h1,.hv2-lead,.hv2-cta,.hv2-foot > *{
    animation:originFadeIn var(--dur-base) var(--ease) both,
              hv2Rise var(--dur-base) var(--ease) both;}
  .hv2-lead{animation-delay:calc(var(--stagger) * 3),calc(var(--stagger) * 3);}
  .hv2-cta{animation-delay:calc(var(--stagger) * 6),calc(var(--stagger) * 6);}
  .hv2-foot > *{animation-delay:calc(var(--stagger) * 9),calc(var(--stagger) * 9);}
  .hv2-chart canvas{animation:hv2ChartIn var(--dur-draw) var(--ease) both;}
}
@supports (animation-timeline: scroll()){
  @media (prefers-reduced-motion: no-preference){
    .hv2-chart{animation:hv2Par linear both;
      animation-timeline:scroll(root block);animation-range:0 90vh;}
    .hv2-copy{animation:hv2CopyOut linear both;transform-origin:0 50%;
      animation-timeline:scroll(root block);animation-range:0 55vh;}
    .hv2-foot{animation:hv2FootOut linear both;
      animation-timeline:scroll(root block);animation-range:0 60vh;}
  }
}

/* ---- print ------------------------------------------------------------------ */
@media print{
  .hv2-bg,.hv2-chart{display:none !important;}
  .hv2{min-height:0 !important;margin-top:0 !important;}
  .hv2-h1 em{color:var(--color-ink) !important;}
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
      <YieldSurface
        mode="chart"
        fit="natural"
        height={0}
        opacity={0.5}
        yawCenter={-84}
        yawRange={3}
        tilt={14}
        className="hv2-chart"
      />

      <div className="hv2-fg">
        <div className="hv2-gap-t" />
        <div className="hv2-copy">
          <h1 className="t-display hv2-h1">
            <span className="hv2-l">Evidence <em>first</em>.</span>
            <span className="hv2-l">Then <em>capital</em>.</span>
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
