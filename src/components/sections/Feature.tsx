import Link from "next/link";
import { strategies } from "@/content/strategies";
import FactsRow from "@/components/FactsRow";
import CountRow from "@/components/CountRow";
import { stages } from "@/content/stages";
import { allocatorNav } from "@/config/nav";
import { site } from "@/config/site";
import Statement from "@/components/Statement";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import { css } from "@/lib/css";

/* ===========================================================================
   FEATURE — the thesis frame.

   TRANSFORM.md's "every section is a frame" (rule 1) applied to the risk
   framework: a full frame (min-height 80vh from 768px up, natural height on
   phones — a frame, not a fixed viewport lock, since the content here is
   longer than a hero's), an iris-haze ground under the hero's own grain
   (rule 3), one giant Statement across the frame with its one operative word
   italic in deep iris (rule 2/7, via Statement's new `lines` prop), and the
   section's two content blocks re-cast as floating <Glass> panes wrapped in
   <Tilt> (rule 4) rather than plain text blocks — one carries the eyebrow +
   headline ("Correlated risk does not respect a mandate boundary."), the
   other the lede and the "how risk is governed" link. Both are the same
   words Feature has always carried; nothing here is new copy.

   WHY A FRAME AND NOT A FIXED BAND. The hero locks to ~100vh because it is
   one screenful by definition. This section carries a statement, two cards
   and a facts caption — more copy than a hero, so 80vh is a floor the
   content is free to exceed (`min-height`, not `height`), and phones drop
   the floor entirely rather than compressing three stacked objects into 80
   of a short viewport's vh.

   THE GROUND. `.ft-wash` is the same pale-iris-at-.34-alpha radial gradient
   TRANSFORM.md rule 3 specifies, centred behind the statement rather than
   low on the frame the way the hero's wash sits behind its chart; `.ft-grain`
   is the hero's own GRAIN data-URI, copied per the same rule ("the grain
   (copy the hero's GRAIN data-URI)") — HeroV2.tsx does not export it, so it
   is reproduced verbatim here rather than imported across an ownership
   boundary sec-hero owns.

   THE STATEMENT. Unchanged string, unchanged attribution. The only change is
   *how* it renders: `lines` splits it at its one sentence break and marks
   "price" — the counterintuitive word the sentence turns on — italic in deep
   iris, via Statement's RevealLines path. `transparent` keeps it off its own
   paper field so the frame's iris ground shows through; `compact` because it
   now shares the frame with the two cards and the foot caption rather than
   owning a full section-band's worth of air by itself.

   THE CARDS. `<Glass>` (no shadow, DESIGN.md principle 4) inside `<Tilt>`
   (pointer lean + spotlight, off on touch and reduced motion). Beside each
   other from 768px, stacked on phone — "beside/below the statement".

   THE FOOT. FactsRow, now itself a `.t-caption` line (its own file, same
   change already recorded there) — the frame's standing facts in the foot,
   the way the hero's own foot caption carries its standing facts.

   MOTION. Fade-rise on load in four stagger tiers (eyebrow / statement /
   cards / foot — `.fade-in .fade-N`, the same utility every section uses,
   itself a no-op under reduced motion sitewide). The two cards carry
   `.fade-in` on a wrapper *around* `<Tilt>`, never on the element Tilt
   itself writes its pointer-lean transform to — see the inline comment at
   the call site. RevealLines drives the Statement's own line-by-line rise.
   Scroll parallax is additive only, on the decorative ground layer alone,
   and only inside `@supports (animation-timeline: scroll())` gated by
   `prefers-reduced-motion: no-preference` — the same double gate HeroV2
   uses for its own parallax.

   COLOUR is still rationed to the one chromatic accent this section has
   always used: deep iris, now on two things instead of one — the "Risk
   framework" eyebrow label and the Statement's italic word — plus the pale
   iris wash as ground per rule 3. No new colour, no shadows on the cards.

   SOURCES — nothing on this section is invented
     "risk framework" / strategy count   strategies.length, content/strategies.ts
     "correlated risk … mandate boundary" Approach.tsx, tail-overlay block
     "limits set once, firm-wide"         MarketsBand ledger, "One, firm-wide"
     Formed / Domicile / Structure / Mandate  src/config/site.ts, via FactsRow
     The quote                            firm copy, Investment Committee

   Server component. No client JS of its own — Tilt is the only client leaf,
   already built and owned elsewhere.
   ========================================================================= */

const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

/* The hero's own grain, reproduced verbatim (HeroV2.tsx GRAIN, not exported;
   TRANSFORM.md rule 3 says to copy it, not share a module across the
   sec-hero / sec-framework ownership boundary). */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

const CSS = css`
.ft{
  position:relative; isolation:isolate; overflow:hidden;
  background:var(--color-ground);
  display:flex; flex-direction:column;
}
@media (min-width:768px){
  .ft{min-height:80vh; justify-content:center;}
}
@supports (min-height: 80dvh){
  @media (min-width:768px){ .ft{min-height:80dvh;} }
}

/* ---- ground: iris haze + the hero's grain -------------------------------- */
.ft-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;}
.ft-wash{position:absolute;inset:0;
  background:radial-gradient(64% 56% at 50% 34%,
    rgba(209,201,255,.34) 0%, rgba(209,201,255,.14) 45%, rgba(247,245,240,0) 78%);}
.ft-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.26;}

/* ---- copy ----------------------------------------------------------------- */
/* .ft is a column flexbox (for the vertical-centering justify-content below).
   .ft-inner is a flex item that also carries .wrap's margin-inline:auto —
   an auto margin on a flex item's cross axis (width, here) suppresses the
   default align-items:stretch per spec, so without an explicit width the
   item shrinks to its content's min-content width instead of filling the
   row, which cascades into every child (the blockquote among them)
   computing a 0px width. HeroV2's own .hv2-fg carries the same
   width:100% alongside margin-inline:auto for the same reason. */
.ft-inner{position:relative;z-index:1;width:100%;padding-block:64px;}
@media (min-width:768px){ .ft-inner{padding-block:96px;} }

.ft-eyebrow{margin:0;}

.ft-statement{margin-top:20px;}
@media (min-width:768px){ .ft-statement{margin-top:28px;} }

.ft-cards{display:grid;grid-template-columns:1fr;gap:20px;margin-top:40px;}
@media (min-width:768px){
  .ft-cards{grid-template-columns:1fr 1fr;gap:24px;margin-top:48px;}
}

.ft-card-wrap{display:block;}
.ft-card{display:block;}
.ft-card-pane{padding:28px;height:100%;}
@media (min-width:768px){ .ft-card-pane{padding:32px;} }

.ft-card-head{margin:0;}
.ft-card-lede{margin:0;max-width:34em;}

.ft-link{display:inline-flex;align-items:center;gap:10px;min-height:44px;margin-top:20px;}
.ft-link svg{transition:transform var(--dur-fast) var(--ease);}
@media (hover:hover) and (pointer:fine){
  .ft-link:hover svg{transform:translateX(3px);}
}

/* The numbers row: four large numerals over their mono captions, counting up
   on first view (CountRow). Bold Stats on the site's structural facts only. */
.countrow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 24px;
  margin:0 0 28px;padding:0;}
@media (min-width:768px){ .countrow{grid-template-columns:repeat(4,minmax(0,1fr));gap:24px 32px;margin-bottom:36px;} }
.countrow-item{display:flex;flex-direction:column;gap:6px;margin:0;}
.countrow-value{margin:0;font-variant-numeric:tabular-nums;color:var(--color-ink);line-height:1;}
.countrow-label{margin:0;color:var(--color-ink-3);}
.ft-foot{margin-top:40px;}
@media (min-width:768px){ .ft-foot{margin-top:56px;} }

/* ---- motion: scroll parallax, ground only ---------------------------------- */
@keyframes ftPar{from{transform:translate3d(0,-3%,0)}to{transform:translate3d(0,3%,0)}}
@supports (animation-timeline: scroll()){
  @media (prefers-reduced-motion: no-preference){
    .ft-bg{animation:ftPar linear both;animation-timeline:view();animation-range:cover;}
  }
}

@media print{
  .ft-bg{display:none !important;}
  .ft{min-height:0 !important;}
}
`;

export default function Feature() {
  const count = COUNT[strategies.length] ?? String(strategies.length);

  return (
    <section id="framework" className="ft" aria-labelledby="feature-title">
      <style>{CSS}</style>

      <div className="ft-bg" aria-hidden="true">
        <div className="ft-wash" />
        <div className="ft-grain" />
      </div>

      <div className="wrap ft-inner">
        <p className="t-mono-xs text-deep-iris ft-eyebrow fade-in fade-1">Risk framework</p>

        <div className="ft-statement fade-in fade-2">
          <Statement
            transparent
            compact
            attribution="Investment Committee"
            lines={[
              <>
                Risk is not the <em>price</em> of return.
              </>,
              "It is what we manage so that we are still here if the return arrives.",
            ]}
          />
        </div>

        <div className="ft-cards">
          {/* fade-in lives on this wrapper, not on <Tilt> itself: Tilt writes
              its own inline `transform` (perspective + rotateX/Y from the
              pointer position) on this element, and a CSS animation on
              `transform` on that SAME node would win the cascade for the
              length of the animation and then, with fill-mode both, pin the
              element's rendered transform to the keyframe's end value
              (`none`) — permanently overriding Tilt's inline style once the
              load reveal finished. One node per job. */}
          <div className="ft-card-wrap fade-in fade-4">
            <Tilt as="article" className="ft-card">
              <Glass className="ft-card-pane" radius={24}>
                <h2 id="feature-title" className="t-heading-lg ft-card-head">
                  Correlated risk does not respect a mandate boundary.
                </h2>
              </Glass>
            </Tilt>
          </div>

          <div className="ft-card-wrap fade-in fade-5">
            <Tilt as="article" className="ft-card">
              <Glass className="ft-card-pane" radius={24}>
                <p className="t-body ft-card-lede">
                  So the limits are set once, firm-wide, and all {count.toLowerCase()} strategies
                  run inside them. One framework, not six.
                </p>
                <Link href="/firm" className="link ft-link">
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
              </Glass>
            </Tilt>
          </div>
        </div>

        <div className="ft-foot fade-in fade-7">
          <CountRow
            items={[
              { value: strategies.length, label: "Strategies", pad: 2 },
              { value: stages.length, label: "Stages an idea passes", pad: 2 },
              { value: allocatorNav.length, label: "Allocator pages", pad: 2 },
              { value: site.founded, label: "Founded" },
            ]}
          />
          <FactsRow />
        </div>
      </div>
    </section>
  );
}
