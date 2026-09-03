import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Questions we expect",
  description:
    "The questions allocators actually ask an emerging manager, answered before they are asked.",
};

/* =============================================================================
   THE PRE-ANSWERED DDQ — READ BEFORE EDITING THIS FILE

   Two rules govern every answer below, and they pull against each other.

   1. The questions must be the hard ones. A softball here is worse than no
      page: it tells an allocator who has been pitched two hundred times that
      the manager either does not know what gets asked or would rather not be
      asked it.

   2. Under Regulation D Rule 506(b) the ANSWERS may not state terms, fees,
      minimums or performance of any kind. Where the honest answer is a number,
      the answer here is the firm's policy plus the plain statement that the
      specifics live in the offering materials.

   The third rule is the one that removed questions rather than softening them:
   nothing here is invented. Every answer is either structural truth about how
   this site and this firm are built, or the standard a family should hold ANY
   manager to. Where the repo does not support a claim, the question is answered
   at the level of policy or it is not on the page. Fewer real answers beat more
   invented ones.

   NOTE ON DRAWDOWN: "what was your largest drawdown" is answered WITHOUT a
   figure, permanently. No performance appears on a public page under any
   regime. Do not "improve" that answer by adding a number.

   Markup: native <details>/<summary>. No JavaScript, no icon, no chevron, no
   rotation. The whole open/closed affordance is the 1px hairline under the
   summary changing colour. Everything expands on print.
   ========================================================================== */

const CSS = `
.qa details{ }
.qa summary{
  display:flex; align-items:center;
  min-height:44px; padding:16px 0;
  cursor:pointer;
  list-style:none;
  font-family:var(--font-display); font-weight:400;
  font-size:19px; line-height:1.3; letter-spacing:-0.01em;
  color:var(--color-cloud);
  /* The affordance. The hairline itself is the marker: 12% white closed,
     pure white open. Nothing rotates, nothing appears, nothing is drawn. */
  border-bottom:1px solid rgba(255,255,255,.12);
  transition:color var(--dur-fast) var(--ease), border-bottom-color var(--dur-fast) var(--ease);
}
@media (min-width:769px){ .qa summary{ font-size:22px; } }
/* The whole summary is the tap target on phone: 56px, not 44px. */
@media (max-width:768px){ .qa summary{ min-height:56px; padding:18px 0; } }
.qa summary::-webkit-details-marker{ display:none; }
.qa summary::marker{ content:""; }
.qa summary:hover{ color:var(--color-pure); border-bottom-color:rgba(255,255,255,.24); }
.qa details[open] > summary{
  color:var(--color-pure);
  border-bottom-color:var(--color-pure);
}
.qa summary:focus-visible{
  outline:2px solid var(--color-pure); outline-offset:4px;
  border-radius:var(--radius-control);
}
.qa-a{ padding:20px 0 28px; max-width:34em; }
.qa-a p{ font-size:16px; line-height:1.6; color:var(--color-ash); }
.qa-a p + p{ margin-top:16px; }

/* Print: everything open. Chromium gates closed content behind
   ::details-content / content-visibility rather than display:none, so both
   escapes are needed and neither alone is enough. */
@media print{
  .qa details > *:not(summary){ display:block !important; }
  .qa details::details-content{
    content-visibility:visible !important;
    block-size:auto !important;
  }
  .qa summary{ border-bottom-color:#000; color:#000; }
  .qa-a p{ color:#000; }
}

@media (prefers-reduced-motion: reduce){
  .qa summary{ transition-duration:1ms !important; }
}
`;

type Group = { n: string; title: string; items: { q: string; a: string[] }[] };

const groups: Group[] = [
  {
    n: "01",
    title: "Strategy",
    items: [
      {
        q: "What breaks this?",
        a: [
          "Each book has its own failure mode and they do not arrive together, which is most of the argument for running six rather than one. The common thread is that a relationship we underwrote out of sample stops holding and we are slow to notice, because noticing requires data and data arrives after the loss.",
          "The regime work exists to shorten that lag, not to remove it. A manager who tells you the lag has been removed is describing a model rather than a market.",
        ],
      },
      {
        q: "What environment do you underperform in?",
        a: [
          "A long, calm, one-directional market. The tail overlay costs money every day and nothing pays for it. Mean reversion inside a cohort gets punished for being early. The regime classifier sits in a single state long enough that the process contributes nothing beyond a direction anybody could have taken without us.",
          "We would rather be flat through that than change the process to catch it, because the change is what costs you in the state that follows.",
        ],
      },
      {
        q: "What is your capacity, and how do you measure it?",
        a: [
          "We underwrite market impact before we underwrite edge, and that ordering is deliberate. A capacity number produced after months of work on a signal drifts toward the number that lets the work continue — nobody lies, the estimate simply acquires a constituency.",
          "The estimate is made against the market we would face while exiting under stress, not the median conditions on a screen. That number is materially smaller, and it is the only one that has ever mattered, because the day capacity is tested is never an average day.",
          "No capacity figure appears on this website. The method is the part you can actually check; the number is a conversation with the work in front of you.",
        ],
      },
      {
        q: "What would make you stop trading a book?",
        a: [
          "A broken assumption, not a loss. Every position carries an explicit statement of what the world would have to look like for it to be wrong. Losses inside the range we underwrote are the cost of holding the position, and closing there is how a process gets sold at the bottom of its own drawdown.",
          "The uncomfortable half of the same rule is that a book whose premise has failed gets closed while it is still making money.",
        ],
      },
      {
        q: "Why hold this rather than a multi-strategy platform?",
        a: [
          "Not because we can do something a platform cannot. Because of size. We size against the market we would face while exiting under stress, and a small book can hold — and, more to the point, can leave — positions a large one cannot.",
          "Several strategies that work beautifully in research do not survive our own capacity question, and we do not run them. That is the entire argument. A family that does not find it persuasive should not be here, and we would rather establish that early than late.",
        ],
      },
    ],
  },
  {
    n: "02",
    title: "Risk",
    items: [
      {
        q: "How do you define leverage, and what are the limits?",
        a: [
          "The definition is the question. Gross notional overstates risk in a book carrying options and futures to the point of being useless. Margin-to-equity understates it in exactly the conditions where margin models are calm. Delta-adjusted exposure hides convexity, and convexity is the point of one of the six books.",
          "We would rather hand a family more than one measure and let it form its own view than pick the flattering one. The limits themselves are set by the Investment Committee, which sets mandate and limits and does not pick trades. They are a term, and no term appears on this website — ask for them in writing and read the clause rather than the summary of it.",
        ],
      },
      {
        q: "How much risk is on overnight, and what do you assume about a gap?",
        a: [
          "The futures and options books hold overnight by design. A strategy that has to be flat at the close is a different strategy, with different economics, and we would rather run this one honestly than pretend it is that one.",
          "We size on the assumption that a stop cannot be filled at the stop, because on the day it matters it will not be. That assumption is the reason the tail overlay is permanent rather than tactical: convexity cannot be bought after the gap, only before it.",
        ],
      },
      {
        q: "What happens when correlations go to one?",
        a: [
          "Diversification across the directional books is not what protects the fund in that state, and we will not pretend otherwise. In a correlated liquidation, five books that made independent bets behave like one book that made a leveraged one.",
          "The overlay is what is supposed to work there. It runs continuously for that reason, risk sets its size rather than the desk, and it is never switched off to improve a quarter. It is a permanent cost of doing business, which is a sentence that is easy to write and expensive to mean.",
        ],
      },
      {
        q: "What was your largest drawdown?",
        a: [
          "We are not going to give you a figure here, and it is worth being exact about why.",
          "This website carries no performance of any kind — no result, no loss, no ratio. The partnership relies on Regulation D Rule 506(b), and a public page discussing results is precisely what that rule does not permit. It is also a restriction we happen to agree with: a drawdown figure stripped of the period, the positioning and the decisions around it tells a family almost nothing, and tends to be quoted back as though it did.",
          "Ask in a conversation and you get the worst one, month by month, with what we did, what we would do again and what we would not. What we will say in public is how the book is sized: to survive the tail rather than to flatter the mean.",
        ],
      },
      {
        q: "Who can cut a position, and can they do it over the objection of the person who put it on?",
        a: [
          "Yes. Risk runs independently of the desk and can cut any position. That authority is not advisory and does not require the desk to agree with it.",
          "The part that makes the authority usable is that every position has a named owner who defends it in front of the desk. There is always a specific person to ask, and a specific person who has to answer.",
        ],
      },
      {
        q: "Where would a stress test lie to you?",
        a: [
          "In its liquidity assumptions, nearly always. A scenario that reprices the book but assumes you can trade out of it at the repriced level is a statement about arithmetic, not about a bad day.",
          "Ours are run at the exit liquidity we underwrite in the capacity work, which makes them uglier and more useful. Ask any manager what liquidity its stress tests assume. The answer separates two very different kinds of risk function.",
        ],
      },
    ],
  },
  {
    n: "03",
    title: "Operations",
    items: [
      {
        q: "Who strikes the NAV?",
        a: [
          "The answer a family should insist on is a third-party name and a copy of the valuation policy — not a description of a process, and not the manager's own word about the manager's own marks.",
          "That name is not on this website yet, and the rule this site is built on is the reason. Nothing appears here — no provider, no auditor, no person, no figure — that the firm has not confirmed in writing for publication. When it is confirmed, it appears. Until then we give the name and the agreement directly rather than write it on a page, which is slower and is the correct way round.",
        ],
      },
      {
        q: "Who can move cash, and what stops one person doing it alone?",
        a: [
          "The control to look for is that no single person can both instruct a transfer and confirm it, and that any change to standing settlement instructions is verified on a channel other than the one that requested the change. Most of the failures a family reads about are that second control, missing.",
          "We show our actual controls in writing, in diligence, as the policy document rather than a paragraph. We deliberately do not publish the detail of our payment controls on a public page: a public description of how a firm moves money is useful mainly to the people trying to move it.",
        ],
      },
      {
        q: "What if the administrator is late?",
        a: [
          "The reporting commitments this site will carry — estimate timing, final timing, audit delivery, the K-1 date — are not on it yet. When they are, they are commitments, and the case worth asking about is the one we miss rather than the one we meet.",
          "A cadence a manager only holds to in a good quarter is not a cadence. What a family should extract from any manager on this question is who tells them, how quickly, and whether it is the family asking or the manager telling. We would rather publish a date and be held to it than describe our reporting as timely.",
        ],
      },
      {
        q: "What happens if the person running this stops being able to run it?",
        a: [
          "This website names nobody, and that is deliberate: no person appears here until the firm has confirmed the name for publication. It does not make the key-person question go away, and in a firm this size it is the largest single risk a family takes.",
          "The mitigations that are real are the ones written down — the process, the independence of risk from the desk, and whatever the offering documents say about a key-person event. Ask what those documents say, then read the clause rather than accept a summary of it.",
        ],
      },
    ],
  },
  {
    n: "04",
    title: "Terms",
    items: [
      {
        q: "Why can I not see the terms on this website?",
        a: [
          "Because of the rule the partnership relies on. Under Regulation D Rule 506(b) the fund may not be taken to the public, and a page listing fee, lock-up and redemption mechanics to anyone arriving from a search engine is exactly that.",
          "It is not coyness and it is not a funnel. There is no gate on this site that opens when you type an email address, because a gate like that would not create the relationship the rule requires — it would only produce a record that looks like one. How the sequence actually works is set out on the access page.",
        ],
      },
      {
        q: "Why is there a lock-up at all?",
        a: [
          "The only defensible argument for any lock-up is liquidity matching: the terms on which capital can leave should match the terms on which positions can be exited under stress, not on a calm day. Where those two do not match, somebody is being subsidised, and it is almost always the family that stays.",
          "That is the principle we would defend in a room. The specific term is a term, and terms do not appear on this website.",
        ],
      },
      {
        q: "What would a gate actually do — to me, and to the family that redeems first?",
        a: [
          "A gate exists to remove the first-mover advantage in a run. Its cost is that it converts a liquidity problem into a governance problem: somebody decides, and everybody else lives with the decision.",
          "The questions worth asking are who can invoke it, on what test, whether that person is independent of the desk, and what has to be disclosed afterwards. Read those answers as clauses with the documents in front of you, not as sentences on a website.",
        ],
      },
      {
        q: "Do fees offset against anything?",
        a: [
          "The principle a family should hold any manager to is that a fee arising from the fund's activity which ends up with the manager should reduce what the fund pays rather than accrue on top of it.",
          "Whether and how that is implemented is a term, and this page carries no terms. The more useful version of the question is not “are there offsets” but “what is the complete list of everything the manager receives”, because the second question contains the first.",
        ],
      },
      {
        q: "Are there side letters, and would I be told?",
        a: [
          "The useful question is not whether side letters exist — in a fund of any size they usually do — but whether the most-favoured-nation provision reaches you, what is carved out of it, and whether you see the letters or only a summary of them.",
          "Our policy on that is a term, and terms are not published here. A manager who answers “no side letters” without being asked about carve-outs has answered a narrower question than the one you asked.",
        ],
      },
    ],
  },
  {
    n: "05",
    title: "Business",
    items: [
      {
        q: "Do you make money anywhere other than the management fee?",
        a: [
          "Assume the answer for any manager is never simply “the fees”, and ask for the complete list: other vehicles, separate accounts, co-investment, principals' own capital, anything earned by a related entity.",
          "Every item on that list creates a question about where attention goes when two of them want the same fill, and the document that answers it is the allocation policy, not a sentence on a website. The list and that policy are what we hand over in diligence.",
        ],
      },
      {
        q: "How long can the management company operate on the revenue it has?",
        a: [
          "Runway is the question that tells a family whether a manager will be forced into decisions it does not want to make — accepting capital it should decline, or cutting the operations budget before the research budget.",
          "The figure belongs to the management company rather than the fund, and it is a diligence answer rather than a public one. What is public is the shape of the firm: it was built small on purpose and has stayed small, and headcount is a constraint we chose rather than one we are waiting to escape.",
        ],
      },
      {
        q: "How many families do you intend to have?",
        a: [
          "Fewer than the market would let us. The binding constraint is capacity, and capacity in this book is a research number computed against exit under stress rather than a sales number computed against demand.",
          "That is why the number of relationships is small, and it is why the smallness is not a scarcity tactic. The constraint would exist whether or not anybody found it appealing.",
        ],
      },
      {
        q: "Who owns the management company?",
        a: [
          "Ownership concentration is the key-person question in its most honest form, and the document that answers it is the manager's ownership schedule, not the fund's structure chart.",
          "This site names no entities and no people yet, for the same reason it names no service providers: nothing is published here that the firm has not confirmed in writing. Ask for the schedule, ask who holds consent rights over a sale of the manager, and ask what happens to those rights when a family leaves.",
        ],
      },
      {
        q: "What happens to the fund if your largest relationship leaves?",
        a: [
          "It is a risk to everybody who stays, because a large redemption means the book is reduced on somebody else's timetable rather than on the market's.",
          "It is one of the reasons the book is sized to be exited under stress rather than to the notional a screen will allow, and it is a reason to ask for the concentration of the investor base as a number during diligence. A manager who treats that question as impolite has told you something.",
        ],
      },
    ],
  },
];

export default function Questions() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <PageHeader
        eyebrow="Questions"
        title="Questions we expect."
        standfirst="These are the questions we get, answered before you ask them. Where the honest answer is a number this website cannot carry, the answer is the policy and where the number lives."
      />

      {groups.map((g, gi) => (
        <section key={g.n} className={gi % 2 ? "bg-abyss" : ""}>
          <Container>
            <div className={`grid-gc2 py-14 md:py-20 ${gi === 0 ? "rule-t" : ""}`}>
              <div className="col-span-4 md:col-span-3">
                {/* No numeral here: these are category labels (Strategy, Risk,
                    Operations, Terms, Business), not an ordered sequence. */}
                <h2 className="t-h2">{g.title}</h2>
              </div>
              <div className="qa col-span-4 md:col-span-8 md:col-start-5">
                {g.items.map((item, ii) => (
                  <details key={item.q} open={gi === 0 && ii === 0}>
                    <summary>{item.q}</summary>
                    <div className="qa-a">
                      {item.a.map((p, pi) => (
                        <p key={pi}>{p}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ))}

      <section>
        <Container>
          <div className="grid-gc2 pb-16 md:pb-24">
            <div className="col-span-4 md:col-span-8 md:col-start-5">
              <p className="t-small measure-body rule-t pt-8 text-fog">
                A question that is not here is not a question we are avoiding.
                Send it, and the answer comes back in writing. Where the answer
                is a term or a figure, it comes back with the documents rather
                than instead of them.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
