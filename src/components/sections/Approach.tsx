"use client";

/* ===========================================================================
   APPROACH — "How an idea earns capital" as a sticky chapter sequence.

   THE COMPOSITION. Desktop (>=1024): a left column pins in place with
   `position: sticky` while the right column's four stage cards scroll past
   it. The pinned column carries the section's editorial h2 (one italic word,
   via RevealLines — it never changes) above a huge serif numeral that DOES
   change, tracking whichever card is nearest the middle of the viewport. No
   scroll library: a single IntersectionObserver in the small client
   component below (`useActiveStage`) watches the four `<li>` rows against a
   thin band at the vertical centre (`rootMargin: "-40% 0 -40% 0"`) and picks
   whichever one is most intersecting. That is the only reason this file is
   a client component — RevealLines, Glass and the stage data stay exactly as
   inert as before.

   Under 1024 there is no pin and no observer cost worth paying: `.apr-grid`
   drops to a single column, the huge tracking numeral hides, and each card
   carries its own small numeral inline — "a plain stacked list with the
   numerals" the brief asks for, not a smaller version of the desktop object.

   Cards are `<Glass>` panes wrapped in `<Tilt>` (DESIGN.md rule 4). Below
   1024 the glass chrome is stripped back to a plain hairline-topped row via
   an `!important` override in `.apr-card` — Glass writes its look inline, so
   the phone list is a CSS override of the same DOM rather than a duplicate
   tree, and Tilt is already inert there (`hover: hover` gates it off touch).

   GROUND. `.apr-bg` is the hero's iris wash + grain, copied: a pale-iris
   radial haze over paper, then the same GRAIN data-URI at low opacity. It
   sits behind the whole section, not just the chapters.

   COLOUR. One accent, twice, same as the section always carried: deep iris
   on the h2's italic word, deep iris on the tail-overlay's top rule. The
   numeral, the cards and the gate blocks are all achromatic ink.

   Every claim below is sourced from firm copy already in the repo. No
   people, no titles, no headcount, no numbers beyond the stage index.
   ========================================================================= */

import * as React from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { stagger } from "@/lib/motion";
import { css } from "@/lib/css";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import RevealLines from "@/components/ui/RevealLines";

/* Copied verbatim from HeroV2 — TRANSFORM.md rule 3: "the grain (copy the
   hero's GRAIN data-URI)." Kept local rather than shared so this file's
   ownership stays a single file (OWNERSHIP.md). */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

import { stages, type Stage } from "@/content/stages";
/* Re-exported for any client-side consumer; server components import from
   @/content/stages directly. */
export { stages };
export type { Stage };

export const tailOverlay = {
  kicker: "Applies to 01 – 04, always",
  heading: "The tail overlay is permanent, not discretionary.",
  body:
    "It is never switched off to improve a quarter, and it is not a position anyone has to argue for. It is the floor the other four stages stand on.",
  asideLabel: "One framework",
  aside:
    "Six strategies run against one risk framework, because correlated risk does not respect a mandate boundary.",
};

export const accountability = [
  { term: "Mandate and limits", held: "Investment Committee" },
  { term: "Each position", held: "A named owner who defends it" },
  { term: "Cutting a position", held: "Risk, independently of the desk" },
];

const CSS = css`
.apr{position:relative;isolation:isolate;}
.apr-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;z-index:0;}
.apr-wash{position:absolute;inset:0;
  background:
    radial-gradient(60% 55% at 85% 10%,
      rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 45%, rgba(247,245,240,0) 75%),
    radial-gradient(70% 60% at 8% 100%,
      rgba(209,201,255,.16) 0%, rgba(247,245,240,0) 70%);}
.apr-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.22;}

.apr-intro,.apr-seq,.apr-foot{position:relative;z-index:1;}

/* ---- the h2, in the pinned column: one italic word, deep iris ------------ */
.apr-h2 em{font-style:italic;color:var(--color-accent-deep-iris);}

/* ---- the sticky chapter grid ---------------------------------------------- */
.apr-grid{display:block;}
.apr-pin{position:static;margin-bottom:40px;}
.apr-num{display:none;}
.apr-pin-label{display:none;}

.apr-cards{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:20px;}
.apr-card-row{}
.apr-tilt{display:block;}
.apr-card{padding:24px 0;}
.apr-card-n{font-size:15px;}

@media (min-width:1024px){
  .apr-grid{display:grid;grid-template-columns:minmax(200px, 30%) 1fr;gap:56px;align-items:start;}
  .apr-pin{position:sticky;top:calc(var(--nav-h, 72px) + 64px);margin-bottom:0;}
  .apr-num{display:block;margin-top:24px;font-family:var(--font-display);font-weight:400;
    font-size:clamp(120px, 13vw, 240px);line-height:.82;letter-spacing:-.02em;
    color:var(--color-ink);}
  .apr-pin-label{display:block;margin-top:6px;}
  .apr-cards{gap:14vh;}
  .apr-card-row{min-height:48vh;display:flex;align-items:center;}
  .apr-card{padding:40px;width:100%;}
  .apr-card-n{font-size:16px;}
}

/* ---- below 1024: Glass strips to a plain hairline row, Tilt is already
   inert (hover:hover gates it). One DOM, an override, not a second tree. --- */
@media (max-width:1023px){
  .apr-card{background:transparent !important;border:none !important;
    border-top:1px solid var(--color-hairline) !important;
    -webkit-backdrop-filter:none !important;backdrop-filter:none !important;
    box-shadow:none !important;border-radius:0 !important;}
}

/* ---- numeral swap, gated behind reduced motion like everything else ------ */
@media (prefers-reduced-motion:no-preference){
  .apr-num{transition:opacity var(--dur-fast) var(--ease);}
}

/* ---- foot caption ---------------------------------------------------------- */
.apr-foot{margin-top:56px;display:flex;flex-wrap:wrap;gap:6px 28px;color:var(--color-ink-3);}
.apr-foot span{color:inherit;}

@media print{
  .apr-bg{display:none !important;}
}
`;

/* -------------------------------------------------------------------------
   useActiveStage — the whole scroll-driven mechanism. One IntersectionObserver
   watching a thin band at the vertical centre of the viewport
   (`rootMargin: "-40% 0 -40% 0"` shrinks the root to that band); whichever
   `<li>` intersects it most becomes `active`. No scroll listener, no
   library, off entirely below 1024 because `.apr-num` is `display:none`
   there and the state has nothing to draw.
   ---------------------------------------------------------------------- */
function useActiveStage(count: number) {
  const [active, setActive] = React.useState(0);
  const elsRef = React.useRef<Array<HTMLLIElement | null>>([]);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = elsRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        setActive((prev) => {
          let best = prev;
          let bestRatio = -1;
          for (const entry of entries) {
            const idx = els.indexOf(entry.target as HTMLLIElement);
            if (idx === -1) continue;
            if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio;
              best = idx;
            }
          }
          return bestRatio >= 0 ? best : prev;
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const setRef = React.useCallback(
    (i: number) => (el: HTMLLIElement | null) => {
      elsRef.current[i] = el;
    },
    []
  );

  return { active, setRef } as const;
}

/* -------------------------------------------------------------------------
   StageStrip — the sticky chapter sequence. One component, used by home and
   by /governance so the two hold literally the same objects (and the same
   observer behaviour).

   `link` is off on /governance, where "Governance in full" would point at
   the page you are already reading.

   `heading` is the pinned column's h2. Home passes it so the editorial line
   lives inside the same sticky column as the numeral; /governance omits it
   because the page already prints "How an idea earns capital" as its own
   section heading immediately above this component, and a second h2 with
   the same text would be a duplicate landmark, not "the same header
   treatment" the brief asks for.
   ---------------------------------------------------------------------- */
export function StageStrip({
  link = true,
  heading,
}: {
  link?: boolean;
  heading?: React.ReactNode;
}) {
  const { active, setRef } = useActiveStage(stages.length);
  const current = stages[active];

  return (
    <div>
      {/* The whole section's CSS lives here rather than in Approach()'s own
          JSX: /governance renders this component directly, never Approach()
          itself, so a <style> tag on Approach() alone would leave the sticky
          grid, the numeral and the phone override completely unstyled there
          (found live: 1440px /governance rendered a single, still-glassy
          column with no pin, because .apr-grid had no `display:grid` rule to
          apply). Putting it here means every consumer gets it once. */}
      <style>{CSS}</style>

      <div className="apr-grid">
        <div className="apr-pin">
          {heading}
          <p className="apr-num" aria-hidden="true">
            {current.n}
          </p>
          <p className="t-mono text-ink-3 apr-pin-label" aria-hidden="true">
            {current.label}
          </p>
        </div>

        <ol className="apr-cards" aria-label="How an idea earns capital, four stages">
          {stages.map((s, i) => (
            <li
              key={s.n}
              ref={setRef(i)}
              className="apr-card-row fade-in"
              style={{ animationDelay: `${i * stagger}ms` }}
            >
              <Tilt as="article" className="apr-tilt" max={5}>
                <Glass className="apr-card" radius={24}>
                  <p className="t-mono text-ink-3 apr-card-n" aria-hidden="true">
                    {s.n}
                  </p>
                  <p className="t-mono text-ink">
                    <span className="sr-only">Stage {s.n}. </span>
                    {s.label}
                  </p>
                  <p className="t-small mt-1 text-ink-3">
                    Held by{" "}
                    <span className={s.standing ? "text-ink" : "text-ink-2"}>{s.holder}</span>
                  </p>

                  <h3 className="t-h3 mt-3 hyphens-none">{s.heading}</h3>
                  <p className="t-body measure-body mt-3">{s.body}</p>

                  <div className="rule-t mt-5 pt-3">
                    <p className="t-caption text-ink-3">{s.gateLabel}</p>
                    <p className="t-small measure-body mt-1">{s.gate}</p>
                  </div>
                </Glass>
              </Tilt>
            </li>
          ))}
        </ol>
      </div>

      {/* ------------------------------------- underneath all of it, permanently */}
      <div className="border-t border-hairline pt-6 mt-12 @2xl:pt-12">
        <div className="card-surface border-t-2 border-accent-deep-iris p-6 @2xl:p-10">
          <div className="grid gap-6 @4xl:grid-cols-12">
            <div className="@4xl:col-span-7">
              <p className="t-caption text-ink-3">{tailOverlay.kicker}</p>
              <h3 className="t-heading-lg mt-3 hyphens-none">{tailOverlay.heading}</h3>
              <p className="t-body measure-body mt-4">{tailOverlay.body}</p>
            </div>

            <div className="border-t border-hairline pt-6 @4xl:col-span-4 @4xl:col-start-9 @4xl:border-t-0 @4xl:pt-0">
              <p className="t-caption text-ink-3">{tailOverlay.asideLabel}</p>
              <p className="t-body mt-2">{tailOverlay.aside}</p>
              {link && (
                <Link
                  href="/governance"
                  className="link t-body mt-6 inline-flex min-h-11 items-center"
                >
                  Governance in full
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Approach() {
  return (
    <section id="approach" className="apr wrap band" aria-labelledby="approach-title">
      <div className="apr-bg" aria-hidden="true">
        <div className="apr-wash" />
        <div className="apr-grain" />
      </div>

      {/* ---------------------------------------------------------------- head */}
      <div className="apr-intro grid gap-10 @4xl:grid-cols-12 @4xl:gap-8">
        <div className="@4xl:col-span-7">
          <p className="t-mono">Approach</p>
          <p className="t-sub measure-lead mt-6 text-ink-2">
            Durable returns in liquid markets come from process, not prediction. We build
            our own data, write our own models, and put every idea through adversarial
            review before it earns capital.
          </p>
        </div>

        {/* Not a heading: the section's h2 now lives in the pinned column
            inside StageStrip below, which is LATER in the DOM than this
            block — an <h3> here would put "Who holds what" before the h2
            that is supposed to head the outline, an orphaned sub-heading
            with nothing above it. The <dl> still gets its accessible name
            from aria-labelledby; the id just no longer needs heading
            semantics to do that. */}
        <div className="@4xl:col-span-4 @4xl:col-start-9">
          <p id="approach-ledger" className="t-caption text-ink-3">
            Who holds what
          </p>
          <dl className="mt-2" aria-labelledby="approach-ledger">
            {accountability.map((a) => (
              <div key={a.term} className="border-t border-hairline py-3">
                <dt className="t-small text-ink-3">{a.term}</dt>
                <dd className="t-body text-ink">{a.held}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ------------------------------------------------------------- chapters */}
      <div className="apr-seq mt-14 @2xl:mt-16">
        <StageStrip
          heading={
            <h2 id="approach-title" className="t-display-sm apr-h2 hyphens-none">
              <RevealLines lines={[<>How an idea earns <em>capital</em>.</>]} />
            </h2>
          }
        />
      </div>

      {/* ------------------------------------------------------------------ foot */}
      <p className="apr-foot t-caption" aria-hidden="true">
        <span>{site.city}</span>
        <span>{site.structure}</span>
        <span>{site.mandate}</span>
      </p>
    </section>
  );
}
