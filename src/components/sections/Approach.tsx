import Link from "next/link";

/**
 * APPROACH — the process ledger.
 *
 * The allocator's three questions were: is anyone accountable, how do you
 * actually decide, and what happens when it goes wrong. So the section is
 * built as a ledger rather than a card grid: a fixed left column that names
 * WHO HOLDS each stage, and a narrative column that steps further right as the
 * idea travels, so the sequence is legible before a word is read.
 *
 * Stage 04 breaks the staircase on purpose. The risk veto is not a step an
 * idea passes; it is a standing power, so it is drawn as an interrupt. The
 * tail overlay is not a stage at all, so it sits under the whole ledger.
 *
 * Every claim here is sourced from firm copy already in the repo. No people,
 * no titles, no headcount, no numbers. Static markup, no motion, no client JS.
 */

type Stage = {
  n: string;
  label: string;
  heading: string;
  body: string;
  holder: string;
  gateLabel: string;
  gate: string;
  /** Literal classes — Tailwind scans source text, so these are never built. */
  step: string;
};

const stages: Stage[] = [
  {
    n: "01",
    label: "Research",
    heading: "We build the data before we build the view.",
    body:
      "Datasets are assembled in-house and the models are written in-house, so the evidence behind a position is ours rather than rented. An idea arrives as a written claim: what should be true, and what would prove it wrong.",
    holder: "The author of the idea",
    gateLabel: "Advances when",
    gate: "The claim is written down together with the evidence that would kill it.",
    step: "md:col-span-8 md:col-start-5",
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
    step: "md:col-span-7 md:col-start-6",
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
    step: "md:col-span-6 md:col-start-7",
  },
];

const veto = {
  n: "04",
  label: "The veto",
  heading: "Risk runs independently of the desk and can cut any position.",
  body:
    "That authority is not advisory and does not require the desk to agree. It applies after capital is committed, to any position, including one the room liked. The firm is deliberately small and every position has a named owner, so a cut lands on a person rather than on nobody.",
  holder: "Risk, independent of the desk",
  gateLabel: "Standing authority",
  gate: "Not a stage an idea passes. A power that stays live for as long as the position does.",
};

const accountability = [
  { term: "Mandate and limits", held: "Investment Committee" },
  { term: "Each position", held: "A named owner who defends it" },
  { term: "Cutting a position", held: "Risk, independently of the desk" },
];

export default function Approach() {
  return (
    <section id="approach" className="wrap band" aria-labelledby="approach-title">
      {/* ---------------------------------------------------------------- head */}
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="t-mono">Approach</p>
          <h2 id="approach-title" className="t-display-sm mt-6">
            How an idea earns capital.
          </h2>
          <p className="t-sub measure-lead mt-8 text-ash">
            Durable returns in liquid markets come from process, not prediction. We build
            our own data, write our own models, and put every idea through adversarial
            review before it earns capital.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <p className="t-mono-xs text-fog">Who holds what</p>
          <dl className="mt-4">
            {accountability.map((a) => (
              <div key={a.term} className="border-t border-steel py-4">
                <dt className="t-mono-xs text-fog">{a.term}</dt>
                <dd className="t-body mt-1 text-cloud">{a.held}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ------------------------------------------------------------- the rail */}
      {/* No left rail. The rail plus each stage's top rule closed three sides of
          every band, so the stages read as boxes rather than as a sequence. The
          horizontal rules alone carry the order, which is how the rest of the
          site separates bands. */}
      <div className="mt-16 md:mt-24">
        <ol>
          {stages.map((s) => (
            <li
              key={s.n}
              className="border-t border-steel pt-10 pb-14 md:pt-12 md:pb-20"
            >
              <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                {/* who — the column that never moves */}
                <div className="md:col-span-3">
                  <p className="t-display-sm text-fog" aria-hidden="true">
                    {s.n}
                  </p>
                  <p className="t-mono mt-3 text-cloud">
                    <span className="sr-only">Stage {s.n}. </span>
                    {s.label}
                  </p>
                  <p className="t-mono-xs mt-6 text-fog">Held by</p>
                  <p className="t-small mt-1 text-ash">{s.holder}</p>
                </div>

                {/* what — the column that steps away */}
                <div className={s.step}>
                  <h3 className="t-heading-lg text-cloud">{s.heading}</h3>
                  <p className="t-prose measure-body mt-6">{s.body}</p>
                  <p className="mt-8 border-t border-steel pt-4">
                    <span className="t-mono-xs text-fog">{s.gateLabel} — </span>
                    <span className="t-small text-ash">{s.gate}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}

          {/* -------------------------------------------- 04 breaks the staircase */}
          <li className="border-t border-steel pt-10 pb-14 md:pt-12 md:pb-20">
            <div className="card-dark p-8 md:p-12">
              <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3">
                  <p className="t-display-sm text-fog" aria-hidden="true">
                    {veto.n}
                  </p>
                  <p className="t-mono mt-3 text-pure">
                    <span className="sr-only">Stage {veto.n}. </span>
                    {veto.label}
                  </p>
                  <p className="t-mono-xs mt-6 text-ash">Held by</p>
                  <p className="t-small mt-1 text-cloud">{veto.holder}</p>
                </div>

                <div className="md:col-span-9">
                  <h3 className="t-heading-lg text-pure">{veto.heading}</h3>
                  <p className="t-prose measure-body mt-6 text-silver">{veto.body}</p>
                  <p className="mt-8 border-t border-steel pt-4">
                    <span className="t-mono-xs text-ash">{veto.gateLabel} — </span>
                    <span className="t-small text-cloud">{veto.gate}</span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ol>

        {/* ------------------------------------- underneath all of it, permanently */}
        <div className="border-t border-steel pt-10 md:pt-12">
          <div className="rounded-card border-t-2 border-iris-gleam bg-abyss p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="t-mono-xs text-pale-iris">Applies to 01 – 04, always</p>
                <h3 className="t-heading-lg mt-4 text-pure">
                  The tail overlay is permanent, not discretionary.
                </h3>
                <p className="t-prose measure-body mt-6">
                  It is never switched off to improve a quarter, and it is not a position
                  anyone has to argue for. It is the floor the other four stages stand on.
                </p>
              </div>

              <div className="border-t border-steel pt-8 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:pt-0">
                <p className="t-mono-xs text-fog">One framework</p>
                <p className="t-body mt-3 text-cloud">
                  Six strategies run against one risk framework, because correlated risk
                  does not respect a mandate boundary.
                </p>
                <Link
                  href="/firm"
                  className="link t-body mt-8 inline-flex min-h-11 items-center"
                >
                  Governance in full
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
