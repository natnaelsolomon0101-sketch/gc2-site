import Link from "next/link";
import { stagger } from "@/lib/motion";

/**
 * APPROACH — the four stages, the veto, and the tail overlay.
 *
 * Two named compositions, one DOM, switched by a container query on the
 * section's own inline size (§7 rule 4 — `.wrap` and `.container-gc2` both
 * carry `container-type: inline-size`, so this section lays itself out from
 * the width it was given rather than from the viewport, and behaves the same
 * on /governance as it does on home):
 *
 *   THE STORY  (one column, container < 42rem)
 *     A vertical narrative. A hairline spine runs down the left of the whole
 *     list; each stage's numeral sits in the margin to the right of it, so
 *     the sequence is legible before a word is read. The spine and the
 *     per-stage top rule meet at every stage, which is what makes four
 *     separate bands read as one ladder. "Advances when" is a caption block
 *     under its own hairline — the gate is the last thing you read in a
 *     stage, and it is set apart from the argument above it.
 *
 *   THE STRIP  (four columns, container >= 72rem)
 *     The same four stages side by side, each column keeping its own left
 *     hairline so the rules connect the row rather than boxing each cell.
 *     The numeral moves above the label because a 40px margin column is a
 *     phone idea, not a 1920 one. The tail overlay sits underneath as a
 *     full-width band, because it is not a stage — it is the floor the four
 *     stages stand on.
 *
 *   Between them (42rem–72rem, i.e. tablet) the strip is two columns.
 *
 * Numerals are legitimate here and stay: the stages are ordered. Stage 04 is
 * the risk veto, which is why its gate line reads "Standing authority" rather
 * than "Advances when" — it is not a step an idea passes, it is a power that
 * stays live, and the section's own copy counts it as one of "the other four
 * stages" the overlay stands under.
 *
 * Colour: one chromatic accent in the whole section (DESIGN.md principle 2) —
 * the iris-gleam rule on the tail-overlay band. Everything else is achromatic.
 *
 * Every claim here is sourced from firm copy already in the repo. No people,
 * no titles, no headcount, no numbers. Server component: no client JS.
 */

export type Stage = {
  n: string;
  label: string;
  heading: string;
  body: string;
  holder: string;
  gateLabel: string;
  gate: string;
  /** 04 is the standing power, not a step. It is set in the brighter ink. */
  standing?: boolean;
};

/** The single source for the four stages. /governance imports this, so the
 *  two pages cannot drift apart. */
export const stages: Stage[] = [
  {
    n: "01",
    label: "Research",
    heading: "We build the data before we build the view.",
    body:
      "Datasets are assembled in-house and the models are written in-house, so the evidence behind a position is ours rather than rented. An idea arrives as a written claim: what should be true, and what would prove it wrong.",
    holder: "The author of the idea",
    gateLabel: "Advances when",
    gate: "The claim is written down together with the evidence that would kill it.",
  },
  {
    n: "02",
    label: "Adversarial review",
    heading: "Every idea is argued against before it is funded.",
    body:
      "The desk argues the other side in good faith and the author defends the idea in front of the room. Nothing earns capital because the house believes it — there is no house view that overrides the person carrying the risk.",
    holder: "The desk, in the room",
    gateLabel: "Advances when",
    gate: "It survives the case made against it, argued by people who wanted it to fail.",
  },
  {
    n: "03",
    label: "Sizing",
    heading: "Sized to survive the tail, not to flatter the mean.",
    body:
      "Size follows what a position must withstand rather than what it is expected to earn. A book that cannot hold through a drawdown it did not cause is mis-sized, whatever the case for it.",
    holder: "The named owner, inside Committee limits",
    gateLabel: "Advances when",
    gate: "It fits the mandate and the limits the Investment Committee has set.",
  },
  {
    n: "04",
    label: "The veto",
    heading: "Risk runs independently of the desk and can cut any position.",
    body:
      "That authority is not advisory and does not require the desk to agree. It applies after capital is committed, to any position, including one the room liked. The firm is deliberately small and every position has a named owner, so a cut lands on a person rather than on nobody.",
    holder: "Risk, independent of the desk",
    gateLabel: "Standing authority",
    gate: "Not a stage an idea passes. A power that stays live for as long as the position does.",
    standing: true,
  },
];

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

/* -------------------------------------------------------------------------
   THE STRIP / THE STORY. One component, used by home and by /governance so
   the two hold literally the same objects.

   `link` is off on /governance, where "Governance in full" would point at the
   page you are already reading.
   ---------------------------------------------------------------------- */
export function StageStrip({ link = true }: { link?: boolean }) {
  return (
    <div>
      {/* The five explicit rows at @6xl are what makes THE STRIP a row rather
          than four stacks: every column takes its row heights from the list
          via `grid-rows-subgrid`, so labels, titles and the "Advances when"
          rules line up across all four even though the copy lengths differ.
          The body row is `1fr`, which pins each gate block to the same
          baseline at the bottom. Below @6xl the rows are irrelevant and the
          items lay out in normal flow. */}
      <ol className="grid @2xl:grid-cols-2 @2xl:gap-x-8 @2xl:gap-y-12 @6xl:grid-cols-4 @6xl:grid-rows-[auto_auto_auto_1fr_auto] @6xl:gap-y-0">
        {stages.map((s, i) => (
          <li
            key={s.n}
            /* border-l is the spine at one column and the connecting rule
               between columns at two and four; border-t is the rung. */
            className="fade-in relative border-t border-l border-white/12 pt-6 pb-7 pl-12 @2xl:pt-8 @2xl:pb-8 @2xl:pl-14 @6xl:row-span-5 @6xl:grid @6xl:grid-rows-subgrid @6xl:pl-6"
            style={{ animationDelay: `${i * stagger}ms` }}
          >
            {/* In the margin, beside the spine, until there is room to stack it
                above the label — a 48px numeral gutter is a phone idea. */}
            <p
              className="t-heading-sm absolute top-6 left-3 text-fog @2xl:top-8 @2xl:left-4 @6xl:static @6xl:mb-3"
              aria-hidden="true"
            >
              {s.n}
            </p>

            <div>
              <p className={`t-mono ${s.standing ? "text-pure" : "text-cloud"}`}>
                <span className="sr-only">Stage {s.n}. </span>
                {s.label}
              </p>
              <p className="t-small mt-1 text-fog">
                Held by{" "}
                <span className={s.standing ? "text-cloud" : "text-ash"}>{s.holder}</span>
              </p>
            </div>

            <h3 className={`t-h3 mt-3 hyphens-none ${s.standing ? "text-pure" : ""}`}>
              {s.heading}
            </h3>
            <p className="t-body measure-body mt-3">{s.body}</p>

            <div className="rule-t mt-5 pt-3">
              <p className="t-caption text-fog">{s.gateLabel}</p>
              <p className="t-small measure-body mt-1">{s.gate}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* ------------------------------------- underneath all of it, permanently */}
      <div className="border-t border-white/12 pt-6 @2xl:pt-12">
        <div className="rounded-card border-t-2 border-iris-gleam bg-graphite p-6 @2xl:p-10">
          <div className="grid gap-6 @4xl:grid-cols-12">
            <div className="@4xl:col-span-7">
              <p className="t-caption text-fog">{tailOverlay.kicker}</p>
              <h3 className="t-heading-lg mt-3 hyphens-none text-pure">
                {tailOverlay.heading}
              </h3>
              <p className="t-body measure-body mt-4">{tailOverlay.body}</p>
            </div>

            <div className="border-t border-white/12 pt-6 @4xl:col-span-4 @4xl:col-start-9 @4xl:border-t-0 @4xl:pt-0">
              <p className="t-caption text-fog">{tailOverlay.asideLabel}</p>
              <p className="t-body mt-2 text-cloud">{tailOverlay.aside}</p>
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
    <section id="approach" className="wrap band" aria-labelledby="approach-title">
      {/* ---------------------------------------------------------------- head */}
      <div className="grid gap-10 @4xl:grid-cols-12 @4xl:gap-8">
        <div className="@4xl:col-span-7">
          <p className="t-mono">Approach</p>
          <h2 id="approach-title" className="t-display-sm mt-4 hyphens-none">
            How an idea earns capital.
          </h2>
          <p className="t-sub measure-lead mt-6 text-ash">
            Durable returns in liquid markets come from process, not prediction. We build
            our own data, write our own models, and put every idea through adversarial
            review before it earns capital.
          </p>
        </div>

        <div className="@4xl:col-span-4 @4xl:col-start-9">
          <p className="t-caption text-fog">Who holds what</p>
          <dl className="mt-2">
            {accountability.map((a) => (
              <div key={a.term} className="border-t border-white/12 py-3">
                <dt className="t-small text-fog">{a.term}</dt>
                <dd className="t-body text-cloud">{a.held}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-12 @2xl:mt-16">
        <StageStrip />
      </div>
    </section>
  );
}
