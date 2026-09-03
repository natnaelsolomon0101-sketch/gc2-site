import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { fund } from "@/config/fund";
import { strategies } from "@/content/strategies";

/**
 * /strategies — the six books, then the two questions the six raise.
 *
 * The strategy bands are unchanged: same order, same `#slug` deep links, same
 * copy. `scripts/qa/killist.sh` allows `strategies#` hrefs specifically, so the
 * anchors are load-bearing and the cross-references below use the full
 * `/strategies#slug` form rather than a bare hash, which the anchor-nav rule
 * would reject.
 *
 * Two structural bands follow them.
 *
 * CAPACITY. `fund.alignment.capacityStated` and `capacityText` are both null,
 * so no figure exists to print and none is written here — not in dollars, not
 * as a range, not as a band, not as an illustration. The gated block is pushed
 * into the ordinal array only when BOTH fields are set, so with nulls it is
 * absent from the DOM rather than hidden, and the ordinals close over the hole
 * instead of skipping a number. That is the same gate /partnership puts on its
 * terms table. What renders today is why a capacity figure is a research output
 * rather than a headline, what constrains these particular six, and the
 * questions an allocator should put to any manager, including this one. The
 * insight "Capacity is a research problem" argues the ordering — impact before
 * edge. This band does not restate it; it links to it and takes the next step.
 *
 * WHAT WOULD MAKE US STOP. Conditions in kind, no thresholds. /governance
 * already states that the risk triggers are categories rather than thresholds,
 * and this band is written to agree with it rather than to quantify it: no
 * drawdown percentage, no Sharpe floor, no VaR limit, no capital trigger, no
 * number of months. It also promises no action and no timetable, because the
 * firm has not committed to one in public and a page that invents the response
 * is worse than a page that names the condition. Where the levels live is
 * stated plainly.
 *
 * 506(b): nothing here invites anyone to invest, and no adjective implies an
 * outcome.
 */

export const metadata: Metadata = {
  title: "Strategies",
  description:
    "Six strategies across liquid global markets, governed by one risk framework — what constrains their capacity, and the conditions under which we would stop running one.",
};

/* Two-digit ordinals, computed from position in the array that actually
   renders. Nothing in this file hardcodes a number in a label. */
const ord = (i: number) => String(i + 1).padStart(2, "0");

/* --------------------------------------------------------------- capacity --
   One constraint per strategy, keyed by slug so the copy cannot drift from the
   book it describes and the list order follows `strategies` rather than a
   second hand-kept order. Each entry says what KIND of limit binds that book.
   None of them states a size, because none is known to this file. */
const capacityConstraint: Record<string, string> = {
  "systematic-macro":
    "The markets a regime position is expressed in are among the deepest anywhere, so the binding limit is rarely the market. It is how much of the same state the other five books are already carrying, which makes this book's capacity a question about the firm rather than about rates and FX.",
  "volatility-arbitrage":
    "Option liquidity concentrates in a handful of strikes and expiries. A position large enough to move the surface changes the price of the thing it was put on to measure, so the limit arrives well before the screen suggests it should, and it moves as the surface moves.",
  "statistical-relative-value":
    "Every leg carries a borrow, funding and capacity assumption before it is allowed to size. That is the constraint stated as a rule: a cohort is only as large as the least tradeable name inside it, and the cost of getting in is paid at the size of the whole basket.",
  "commodity-carry":
    "The book is sized against delivery capacity, not against the notional the screen will let us trade. Storage and delivery are physical and finite in a way a futures screen does not show, which makes this the one book whose limit can be counted in things rather than estimated.",
  "event-dislocation":
    "Sizing is set by the impact estimate built before the event, and impact is the whole strategy: being paid to absorb a forced flow stops working at the size where we become the flow. The limit is per event, so it does not accumulate into a single figure the way an allocator might expect.",
  "tail-overlay":
    "The overlay is sized by risk against the rest of the book, so its capacity is a function of the other five rather than of its own market. It is also the book whose size we least want set by what is convenient, which is why the desk cannot override it.",
};

const constraints = strategies
  .filter((s) => capacityConstraint[s.slug])
  .map((s) => ({ slug: s.slug, name: s.name, text: capacityConstraint[s.slug] }));

/* The standard to hold any manager to on this subject, this one included.
   Nothing here is a claim about this fund, so nothing here needs a figure. */
const capacityQuestions: { q: string; why: string }[] = [
  {
    q: "At what size does the edge stop paying for the cost of reaching it?",
    why: "That is the only definition of capacity that means anything. A figure derived some other way is a preference with a decimal point.",
  },
  {
    q: "What participation rate does the figure assume, and over how many days is the exit?",
    why: "The same market absorbs very different amounts depending on the answer. A capacity figure carrying neither is not wrong so much as unfinished.",
  },
  {
    q: "Was it estimated from median conditions, or from the conditions in which you would need to reduce?",
    why: "Liquidity that exists on a calm day is exactly the liquidity that is not there on the day it is tested.",
  },
  {
    q: "Is it per strategy or for the firm, and what happens when several books want the same liquidity at once?",
    why: "Capacity across strategies is not additive. A manager who adds the figures up has not asked the question that matters.",
  },
  {
    q: "What has the firm declined to run because it did not survive this question?",
    why: "A manager who has never abandoned research on capacity grounds has either been very lucky or has been asking the question last.",
  },
  {
    q: "Once the figure is stated, who is bound by it?",
    why: "A capacity figure that lives in a presentation binds nobody. One that lives in the fund documents binds the manager.",
  },
];

/* ------------------------------------------------------ what makes us stop --
   Categories, matching the vocabulary /governance already uses for its risk
   triggers. Deliberately no level, no period and no committed response. */
const stopConditions: { h: string; p: string }[] = [
  {
    h: "The premise stops being true",
    p: "Every book here rests on a stated reason a price should behave a particular way: a regime that persists out of sample, a cointegration that holds outside the window it was found in, storage economics that anchor a curve. When the reason stops holding, the position is no longer the position that was underwritten, and the fact that it is still working is not evidence that it is still right. A book that makes money for a reason nobody on the desk can now state is a book we would stop.",
  },
  {
    h: "It can no longer be sized",
    p: "Capacity is a condition to stop as much as a condition to start. Where the size at which a book can be entered and left falls below the size at which running it is worth the risk and operational overhead it carries, the answer is to stop it rather than to run it smaller and describe the remainder as diversification.",
  },
  {
    h: "The exit stops being credible",
    p: "The test was never whether a position can be held. It is whether it can be reduced in the conditions that would make us want to reduce it. Where the market a book depends on no longer clears at a size we could leave through, the book stops — and it stops while the exit still exists, rather than at the point the question gets settled for us.",
  },
  {
    h: "The six stop being six",
    p: "The books are underwritten against one framework because correlated risk does not respect a mandate boundary. Where exposure that reads as reasonable inside each book adds to a single position across all of them, and the cause is structural rather than a passing episode, the response is to remove a book rather than to net the exposure and carry on with the same count.",
  },
  {
    h: "Something underneath the trade changes",
    p: "Borrow, financing, margin treatment, exchange rules, the regulatory or tax treatment of an instrument: these sit under a position rather than inside it, and a change to one can make a sound idea uneconomic without the idea being wrong. Where the change is structural rather than a squeeze that will pass, the strategy stops, and the research still holding is not a reason to keep it.",
  },
  {
    h: "Nobody can defend it",
    p: "Every position has a named owner who defends it in front of the desk. Where the owner cannot — because the reasoning has quietly been replaced by the P&L, or because the person who understood the position is no longer here — risk can cut it without the desk agreeing. A book that survives only because it is nobody's job to argue against it is already gone.",
  },
  {
    h: "The operation cannot carry it",
    p: "A strategy the firm cannot value independently of the desk, reconcile daily, finance through a stressed week, or run without one particular person is a strategy the firm cannot run, whatever the research says about it. Operational capability is a condition for continuing, not an administrative detail behind one.",
  },
  {
    h: "It would need explaining away",
    p: "The last condition is the cheapest to write and the one most likely to be tested: where a book could only continue by doing something we would not want set out plainly to the person whose capital it is, it stops. It is on the list because a condition nobody wrote down is a condition that gets discovered late.",
  },
];

/* Each capacity block is an entry here, so the gated figure is numbered by its
   position and the ordinals stay contiguous whether or not it exists. */
type CapBlock = { key: string; h: string; node: React.ReactNode };

export default function Strategies() {
  const capacityBlocks: CapBlock[] = [
    {
      key: "no-figure",
      h: "Why there is no figure on this page",
      node: (
        <>
          <p className="t-body measure-body">
            A capacity figure means nothing detached from the assumptions that produced it: which
            markets, at what participation rate, against whose liquidity, over what exit horizon.
            Published alone it is a round number with the arguable part removed, and the arguable
            part is the whole of it.
          </p>
          <p className="t-body measure-body mt-5">
            Capacity is also not a constant. It is a property of the strategy, the market and the
            moment together, and it moves — usually in the direction nobody wants — precisely when
            it is being tested. A figure carried on a public page has to be either stale or
            re-stated often enough that it stops reading as a commitment.
          </p>
          <p className="t-body measure-body mt-5">
            So it belongs where the assumptions can be handed over with it and taken apart: the fund
            documents, and diligence. The reasoning that gets there first is set out in{" "}
            <TextLink href="/insights/capacity-is-a-research-problem">
              Capacity is a research problem
            </TextLink>
            , which argues the ordering — what a market absorbs is established before whether the
            idea has edge, so that nobody has to negotiate the answer afterwards.
          </p>
        </>
      ),
    },
    {
      key: "what-binds",
      h: "What binds each of these six",
      node: (
        <>
          <p className="t-body measure-body">
            The six are constrained by different things, which is one reason a single figure across
            all of them would hide more than it showed. What follows is the kind of limit that binds
            each book, not its size.
          </p>
          <dl className="mt-8">
            {constraints.map((c) => (
              <div key={c.slug} className="rule-t py-6">
                <dt className="t-mono text-cloud">
                  <TextLink href={`/strategies#${c.slug}`}>{c.name}</TextLink>
                </dt>
                <dd className="t-body measure-body mt-3">{c.text}</dd>
              </div>
            ))}
          </dl>
          <p className="t-small measure-body mt-6 text-fog">
            The constraints do not add. Six books that each look sized correctly can still want the
            same liquidity on the same afternoon, which is why capacity is governed at the firm
            rather than at the book.
          </p>
        </>
      ),
    },
    {
      key: "questions",
      h: "What to ask, of us and of anyone else",
      node: (
        <dl>
          {capacityQuestions.map((c) => (
            <div key={c.q} className="rule-t py-6">
              <dt className="t-body text-cloud">{c.q}</dt>
              <dd className="t-small measure-body mt-2 text-fog">{c.why}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ];

  /* Both fields, or neither. With one set the figure would render without the
     firm having decided to state it, which is the failure this gate exists to
     prevent. Nothing is written on the firm's behalf: the words are the
     owner's. */
  if (fund.alignment.capacityStated && fund.alignment.capacityText) {
    capacityBlocks.push({
      key: "figure",
      h: "The figure, and what it is bound to",
      node: <p className="t-body measure-body">{fund.alignment.capacityText}</p>,
    });
  }

  /* Two structural bands after six obsidian strategy bands: abyss, then
     obsidian, so the ground alternates from the point of insertion and the page
     closes on the body ground rather than on a deeper one. */
  const bands: { id: string; title: string; kicker: string; node: React.ReactNode }[] = [
    {
      id: "capacity",
      title: "Capacity",
      kicker:
        "The size at which a strategy still does what it was built to do. It is a research output, and it is not a figure this page can honestly carry.",
      node: (
        <>
          <p className="t-lead measure-lead">
            Past its capacity the same idea, traded the same way, is a different and worse idea. The
            fills move against you, the exit takes longer than the reasoning was good for, and what
            made the position worth holding is spent getting into it.
          </p>
          <div className="mt-10">
            {capacityBlocks.map((b, i) => (
              <div key={b.key} className={i ? "mt-12" : ""}>
                <p className="t-mono-xs text-fog">{ord(i)}</p>
                <h3 className="t-h3 mt-2">{b.h}</h3>
                <div className="mt-5">{b.node}</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "what-would-make-us-stop",
      title: "What would make us stop",
      kicker:
        "The conditions under which we would stop running a strategy. Stated in kind, because that is the form in which they are decided.",
      node: (
        <>
          <p className="t-lead measure-lead">
            Every book here has a condition under which the honest response is to stop running it.
            Before it arrives is the only time such a condition can be written honestly. In the
            moment there is always a reason it does not quite apply yet.
          </p>
          <p className="t-body measure-body mt-6">
            The risk framework holds these as categories rather than as thresholds, and that is
            deliberate rather than vague. A published level becomes a number to be managed up to; a
            category is a question somebody has to answer out loud, in front of people who can
            overrule them. The same choice is set out on{" "}
            <TextLink href="/governance">governance</TextLink>, which says who holds each of these
            decisions and who can act without the desk agreeing.
          </p>
          <dl className="mt-10">
            {stopConditions.map((c, i) => (
              <div key={c.h} className="rule-t py-8">
                <dt>
                  <span className="t-mono-xs block text-fog">{ord(i)}</span>
                  <span className="t-h3 mt-2 block">{c.h}</span>
                </dt>
                <dd className="t-body measure-body mt-4">{c.p}</dd>
              </div>
            ))}
          </dl>
          <p className="t-body measure-body mt-10">
            Stopping a strategy, returning capital and closing a book are three different actions
            with three different consequences, and they are not held by the same party. Mandate sits
            with the Investment Committee, cutting a position sits with risk independently of the
            desk, and what happens to capital sits in the fund documents. This page can say which
            conditions put the question on the table. It cannot say in advance what the firm would
            do in a case it has not met, and a page that promises the response is promising
            something no manager is in a position to promise.
          </p>
          <p className="t-body measure-body mt-5">
            The specific levels — where each of these sits, measured how, on which book — are in the
            fund documents and the risk framework, and they are confirmed in diligence rather than
            summarised here. They are not on a public page for the reason above: a level published
            without the framework around it is a target, and a limit that is being aimed at has
            stopped being a limit.
          </p>
        </>
      ),
    },
  ];

  return (
    <div id="strategies-page">
      {/* Scoped to this page only — PageHeader (sec-firm) ships a global 80px
          `.section-y` top padding meant to clear a *sticky* nav that only
          takes 56–72px of flow height, which reads as dead air before the h1
          on phones. This does not edit PageHeader.tsx: it raises specificity
          from within the one route that needs it tightened, and only the
          top half of the padding — the 80px bottom half is what separates
          the standfirst from the rail/strip below it and stays. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
#strategies-page > section:first-of-type .section-y { padding-block-start: 32px; }
@media (min-width: 768px) {
  #strategies-page > section:first-of-type .section-y { padding-block-start: 48px; }
}
@media (min-width: 1280px) {
  /* align-items stays at its default (stretch) on purpose: the rail's
     containing block (.stx-rail-wrap) has to span the full row height,
     matching .stx-rows, the tall column, for position:sticky on the nav
     inside it to have any room to stick within. align-items:start here
     would cap that box at the nav's own height and the rail would just
     scroll off with the page. */
  .stx-layout { display: grid; grid-template-columns: 220px 1fr; column-gap: 56px; }
  .stx-rail { position: sticky; top: calc(var(--nav-h) + 32px); }
  .stx-rail ul { display: flex; flex-direction: column; gap: 8px; }
}
.stx-rail a {
  display: flex; align-items: center; min-height: 44px;
  color: var(--color-ash); text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
  animation: stxRailIn var(--dur-base) var(--ease) both;
  animation-delay: calc(var(--stx-i, 0) * var(--stagger));
}
@media (hover: hover) and (pointer: fine) {
  .stx-rail a:hover { color: var(--color-cloud); }
}
.stx-rail a:active { color: var(--color-cloud); }
.stx-rail a:focus-visible {
  outline: 2px solid var(--color-pure); outline-offset: 2px; border-radius: 4px;
}
@keyframes stxRailIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .stx-rail a { animation: none; } }

/* Below 1280: the rail becomes the one horizontal-scroll strip the site
   permits (APPENDIX-A, §7 rule: "no horizontal scroll except the one
   /strategies strip"). scroll-snap-type + no trailing inline padding so the
   last link is cut by the viewport edge at rest rather than sitting flush —
   that cut is the "there is more" affordance instead of a scrollbar. */
@media (max-width: 1279px) {
  .stx-rail-wrap { padding-block: 16px; border-top: 1px solid rgba(255,255,255,.12); border-bottom: 1px solid rgba(255,255,255,.12); }
  .stx-rail { margin-inline: -24px; }
  .stx-rail ul {
    display: flex; gap: 28px; overflow-x: auto; scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch; scrollbar-width: none;
    padding-inline-start: 24px; padding-inline-end: 4px;
  }
  .stx-rail ul::-webkit-scrollbar { display: none; }
  .stx-rail li { flex: none; scroll-snap-align: start; }
  .stx-rail a { white-space: nowrap; }
}
`,
        }}
      />
      <PageHeader
        title="Six strategies. One risk framework."
        standfirst="Six books run independently and are underwritten against the same limits. One framework governs them because correlated risk does not respect a mandate boundary."
      />

      <section className="scroll-mt-24 bg-obsidian">
        <Container>
          {/* One nav, two CSS layouts: `.stx-layout` is a plain flow at
              ≤1279 (the rail, first in source, reads as the horizontal
              strip under the page header) and a 220px + content grid at
              ≥1280 (the same rail becomes the sticky left column). Nothing
              is duplicated in the DOM and nothing picks the layout in JS. */}
          <div className="stx-layout">
            <div className="stx-rail-wrap">
              <nav className="stx-rail" aria-label="Jump to a strategy">
                <ul>
                  {strategies.map((s, k) => (
                    <li key={s.slug} style={{ ["--stx-i" as string]: k }}>
                      <a href={`#${s.slug}`} className="t-small">{s.name}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="stx-rows">
              {strategies.map((s) => (
                <div key={s.slug} id={s.slug} className="grid-gc2 rule-t py-16 md:py-24 scroll-mt-24">
                  <div className="col-span-4 md:col-span-5">
                    <h2 className="t-h2 text-pure">{s.name}</h2>
                    <dl className="mt-8">
                      <div className="rule-t flex justify-between gap-6 py-3">
                        <dt className="t-small text-fog">Markets</dt>
                        <dd className="t-body text-right text-ash">{s.markets}</dd>
                      </div>
                      <div className="rule-t rule-b flex justify-between gap-6 py-3">
                        <dt className="t-small text-fog">Instruments</dt>
                        <dd className="t-body text-right text-ash">{s.instruments}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="col-span-4 md:col-span-6 md:col-start-7">
                    {s.body.map((t, i) => (
                      <p key={i} className={`t-body measure-body text-ash ${i ? "mt-6" : ""}`}>{t}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {bands.map((b, i) => (
        <section
          key={b.id}
          id={b.id}
          className={`scroll-mt-24 ${i % 2 === 0 ? "bg-abyss" : "bg-obsidian"}`}
        >
          <Container>
            <div className="grid-gc2 rule-t py-16 md:py-24">
              <div className="col-span-4 md:col-span-4">
                <h2 className="t-h2 text-pure">{b.title}</h2>
                <p className="t-small measure-body mt-6 text-fog">{b.kicker}</p>
              </div>
              <div className="col-span-4 md:col-span-7 md:col-start-6">{b.node}</div>
            </div>
          </Container>
        </section>
      ))}
    </div>
  );
}
