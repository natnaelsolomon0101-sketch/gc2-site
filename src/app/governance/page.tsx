import type { Metadata } from "next";
import Container from "@/components/Container";
import { fund } from "@/config/fund";
import { StageStrip } from "@/components/sections/Approach";
import { css } from "@/lib/css";
import RevealLines from "@/components/ui/RevealLines";

/**
 * /governance — who can say no.
 *
 * The page answers one question: what stops one person from blowing this up.
 *
 * Everything here is STRUCTURE, which is why it renders today while
 * /diligence's fact blocks collapse. The material is sourced from copy already
 * in the repo — src/components/sections/Approach.tsx and src/app/firm/page.tsx:
 * the Investment Committee sets mandate and limits and does not pick trades;
 * risk runs independently of the desk and can cut any position; the tail
 * overlay is permanent, not discretionary; every position has a named owner who
 * defends it in front of the desk.
 *
 * `fund.people` is null, so nobody is named. That is not a gap in the page —
 * describing the seat rather than the occupant is the honest way to answer
 * key-person risk before intake Tier 4 lands, and it is what fund.ts asks for.
 *
 * There is no advisory board, so there is no advisory board section. A page
 * that lists a body the firm does not have is worse than a shorter page.
 *
 * 506(b): no invitation to invest, no terms, no figure of any kind.
 */

/* Title 52 chars rendered (the layout template appends the firm name), meta
   description 139. "Governance" alone was accurate and told a search result
   nothing; the two things this page is actually about are the limits and the
   veto that overrides them. The description ends on the honest caveat —
   fund.people is null, so every seat here is described by what it holds. */
export const metadata: Metadata = {
  title: "Governance and risk independence",
  description:
    "Who sets the limits, who can cut a position without asking, whose mark is final, and what happens if someone is not there. Roles, not names.",
};

/* ------------------------------------------------------------- the header --
   sec-approach's other file (Approach.tsx) draws its ground as an iris haze
   over paper plus the hero's grain, and sets its h2 through RevealLines. This
   page gets "the same header treatment" (its assignment's own words) rather
   than PageHeader (owned by sec-firm, still the plain pre-transform version
   in this worktree): the eyebrow/h1/standfirst content PageHeader used to
   render is unchanged, only wrapped in that same ground and revealed the
   same way. GRAIN is copied verbatim from HeroV2 / Approach.tsx, same as
   TRANSFORM.md rule 3 asks every section to do. */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

const HEADER_CSS = css`
.gv-em{font-style:italic;color:var(--color-accent-deep-iris);}
.gov-hd{position:relative;isolation:isolate;overflow:hidden;}
.gov-hd-bg{position:absolute;inset:0;pointer-events:none;contain:layout paint style;z-index:0;}
.gov-hd-wash{position:absolute;inset:0;
  background:
    radial-gradient(60% 60% at 88% 0%,
      rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 45%, rgba(247,245,240,0) 75%),
    radial-gradient(70% 55% at 6% 100%,
      rgba(209,201,255,.14) 0%, rgba(247,245,240,0) 70%);}
.gov-hd-grain{position:absolute;inset:0;background-image:${GRAIN_URL};
  background-size:140px 140px;opacity:.22;}
.gov-hd-inner{position:relative;z-index:1;}
@media print{ .gov-hd-bg{display:none !important;} }
`;

/* Title is one word ("Governance."), so there is no second word to leave in
   the roman weight — TRANSFORM.md rule 2's "pick the operative word; do not
   italicise two per line" assumes a line with more than one candidate. Rather
   than italicise the whole title (which would read as a font choice, not an
   emphasis), the ground and the RevealLines reveal carry the treatment here;
   copy is unchanged either way. */
function GovernanceHeader() {
  return (
    <section className="gov-hd">
      <style>{HEADER_CSS}</style>
      <div className="gov-hd-bg" aria-hidden="true">
        <div className="gov-hd-wash" />
        <div className="gov-hd-grain" />
      </div>
      <Container>
        <div className="gov-hd-inner flex flex-col pt-6 pb-8 md:pt-12 md:pb-14 lg:pt-20 lg:pb-20">
          <p className="t-mono text-ink-3">Governance</p>
          <h1 className="t-h1 measure-head mt-4 md:mt-6 hyphens-none">
            <RevealLines lines={[<><em className="gv-em">Governance</em>.</>]} />
          </h1>
          <p className="t-lead measure-lead mt-6 md:mt-8">
            The question behind every governance page is what stops one person from blowing
            this up. This is the answer: who sets the limits, who can cut a position without
            asking, whose mark is final, and what happens if someone is not there.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ ledger --
   Real <table>, visually-hidden <caption>, <th scope="row"> on the decision,
   hairline between rows only. Below md the rows become blocks and stack
   decision-over-holder rather than scrolling sideways. The mobile cell label is
   aria-hidden because the <thead> is sr-only, not display:none, so a screen
   reader already has the column header. */
function Ledger({
  caption, termHead, valueHead, rows,
}: {
  caption: string;
  termHead: string;
  valueHead: string;
  rows: { term: string; value: string }[];
}) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{caption}</caption>
      <thead className="sr-only md:not-sr-only">
        <tr className="block md:table-row">
          <th scope="col" className="t-mono-xs block pb-3 text-left text-ink-3 md:table-cell md:w-1/2 md:pr-6">
            {termHead}
          </th>
          <th scope="col" className="t-mono-xs block pb-3 text-left text-ink-3 md:table-cell md:pr-6">
            {valueHead}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.term} className="rule-t block py-5 md:table-row md:py-0">
            <th
              scope="row"
              className="t-body block text-left font-normal text-ink-3 md:table-cell md:w-1/2 md:py-6 md:pr-6 md:align-top"
            >
              {r.term}
            </th>
            <td className="block pt-2 md:table-cell md:py-6 md:align-top">
              <span aria-hidden="true" className="t-mono-xs block text-ink-3 md:hidden">
                {valueHead}
              </span>
              <span className="t-body block text-ink">{r.value}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Roles, not people. Nothing here needs a name to be true. */
const authority = [
  { term: "Mandate and limits", value: "The Investment Committee" },
  { term: "Sizing within those limits", value: "The named owner of the position" },
  { term: "Cutting a position", value: "Risk, independently of the desk" },
  { term: "The tail overlay", value: "Nobody. It is permanent and cannot be switched off" },
  { term: "The valuation mark", value: "The administrator" },
];

const conflicts: { h: string; p: string }[] = [
  {
    h: "Personal account dealing",
    p: "Personal trading is pre-cleared before it happens and reviewed by someone who does not sit on the desk. Anything the firm is working on is off limits while it is being worked on. The point of pre-clearance is that the awkward conversation happens before the trade rather than in an attestation a year later.",
  },
  {
    h: "Allocation between accounts",
    p: "Where more than one account the manager advises can take the same trade, orders are aggregated and filled pro rata, so the outcome does not depend on which account somebody thought of first. Any departure from pro rata is written down with its reason at the time it is made. If the fund and a separately managed account want the same fill, neither of them gets to be the favourite.",
  },
  {
    h: "Cross-trades",
    p: "A cross-trade between accounts the manager advises is an exception, not a tool. Where one is contemplated it is priced from an independent source, confirmed by the administrator, and documented with the reason it served both sides better than going to the market. The default is the market.",
  },
  {
    h: "Expense allocation",
    p: "What the fund bears and what the manager bears is fixed by the fund documents and applied by the administrator, not decided invoice by invoice. Where an item is genuinely ambiguous it is resolved in writing before it is charged, never after. Expenses are where a small firm quietly gets expensive, which is why the boundary is written down rather than remembered.",
  },
];

/* `wide` blocks put their node under the heading at the full container width
   instead of in the 7-column slot. The stage strip needs the whole container:
   it is a container-query layout and four columns inside a 7/12 slot would
   query the container it is not actually sitting in. */
type Block = { id: string; title: string; kicker?: string; node: React.ReactNode; wide?: boolean };

export default function Governance() {
  const blocks: Block[] = [
    {
      id: "authority",
      title: "Who holds what",
      kicker: "Five decisions, five holders. No holder appears twice.",
      node: (
        <Ledger
          caption="Governance decisions and the party that holds each one."
          termHead="Decision"
          valueHead="Held by"
          rows={authority}
        />
      ),
    },
    {
      id: "stages",
      title: "How an idea earns capital",
      kicker:
        "The four stages, the veto and the tail overlay, rendered from the same source as the home page so the two cannot drift apart.",
      wide: true,
      node: <StageStrip link={false} />,
    },
    {
      id: "committee",
      title: "Investment Committee",
      node: (
        <>
          <p className="t-body measure-body">
            The Investment Committee sets mandate and limits. It does not pick trades. That
            distinction is the whole point of it: a committee that trades is a second desk with
            better manners, and it dissolves the accountability that makes the first desk work.
          </p>
          <p className="t-body measure-body mt-6">
            What it cannot do matters as much as what it sets. It cannot instruct the desk into a
            position. It cannot overrule a decision by risk to cut one. It cannot switch off the
            tail overlay to improve a quarter, because the overlay is permanent rather than
            discretionary and is not a position anyone has to argue for.
          </p>
          {fund.people === null && (
            <p className="t-body measure-body mt-6">
              Seats are described here by what they hold rather than by who holds them. Names,
              roles and prior firms go up when the firm publishes them, and not a day before.
            </p>
          )}
        </>
      ),
    },
    {
      id: "risk",
      title: "Risk independence",
      node: (
        <>
          <p className="t-body measure-body">
            Risk reports outside the desk. It does not sit under the person running the book, and
            its authority does not depend on the desk agreeing with it: it can cut any position,
            including one the room liked, without the portfolio manager&rsquo;s consent. That
            authority is not advisory.
          </p>
          <p className="t-body measure-body mt-6">
            The triggers are written down rather than felt. A limit breached. Exposure that has
            drifted outside the mandate the Committee set. A position whose owner can no longer
            defend it in front of the desk. Correlated exposure building across strategies that
            each look reasonable on their own — six books run against one framework precisely
            because correlated risk does not respect a mandate boundary.
          </p>
          <p className="t-body measure-body mt-6">
            When a cut happens it lands on a person, because every position has a named owner who
            defends it. Nothing is unwound by an anonymous house view, and there is no house view
            that overrides the person carrying the risk.
          </p>
        </>
      ),
    },
    {
      id: "valuation",
      title: "Valuation",
      node: (
        <>
          <p className="t-body measure-body">
            Exchange-traded positions are valued from sources independent of the desk. Anything
            that does not trade on an exchange is valued under a written policy that fixes the
            method before the position exists, so the method cannot be chosen afterwards to suit
            the mark.
          </p>
          <p className="t-body measure-body mt-6">
            Review sits outside the desk, and the administrator&rsquo;s mark governs. Where the
            manager and the administrator disagree, the disagreement is documented and the
            administrator&rsquo;s number stands. A manager who can overwrite the official mark
            does not have a valuation policy, it has a preference.
          </p>
        </>
      ),
    },
    {
      id: "conflicts",
      title: "Conflicts",
      kicker:
        "A conflicts policy is only worth what it costs somebody. The rule underneath ours: where the manager's interest and the fund's interest can be served in a different order, the fund goes first.",
      node: (
        <dl>
          {conflicts.map((c) => (
            <div key={c.h} className="rule-t py-8">
              <dt className="t-mono text-ink">{c.h}</dt>
              <dd className="t-body measure-body mt-3">{c.p}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "key-person",
      title: "Key person and continuity",
      node: (
        <>
          <p className="t-body measure-body">
            The firm is small on purpose, so key-person risk is real and we would rather describe
            it than dress it.
          </p>
          <p className="t-body measure-body mt-6">
            Trading authority does not rest with one person by default. An alternate&rsquo;s
            authority is lodged in advance with the brokers and the administrator, so on
            incapacity or a sudden departure the book can be hedged and reduced the same day by
            someone whose access already works. The first action is to reduce risk, not to defend
            a view somebody else put on.
          </p>
          <p className="t-body measure-body mt-6">
            The Investment Committee is notified immediately and takes the mandate decisions until
            the book is stable. Key-person provisions in the fund documents, including any rights
            they carry for investors, are set out in those documents and confirmed in diligence
            rather than summarised on a public page.
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <GovernanceHeader />

      {/* Same band rhythm as /firm and /diligence: ground and ground-2 alternate
          so the page has cadence without a rule under every section. Heading
          pure 19.05:1 / 19.81:1, body ash 7.20:1 / 7.49:1, fog 4.61:1 / 4.80:1. */}
      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`scroll-mt-24 ${i % 2 ? "bg-ground-2" : ""}`}>
          <Container>
            {/* No 01-06 numerals on these headings. Six governance topics are
                not an ordered sequence, and EVERY-SCREEN.md 0.2 item 4 takes
                numerals off anything that is not one. The four process stages
                inside the "stages" block keep theirs, because they are. */}
            {b.wide ? (
              <div className={`py-16 md:py-24 ${i === 0 ? "rule-t" : ""}`}>
                <h2 className="t-h2 hyphens-none">{b.title}</h2>
                {b.kicker && <p className="t-small measure-body mt-4">{b.kicker}</p>}
                <div className="mt-10 md:mt-14">{b.node}</div>
              </div>
            ) : (
              <div className={`grid-gc2 py-16 md:py-24 ${i === 0 ? "rule-t" : ""}`}>
                <div className="col-span-4 md:col-span-4">
                  <h2 className="t-h2 hyphens-none">{b.title}</h2>
                  {b.kicker && <p className="t-small measure-body mt-6">{b.kicker}</p>}
                </div>
                <div className="col-span-4 md:col-span-7 md:col-start-6">{b.node}</div>
              </div>
            )}
          </Container>
        </section>
      ))}

      {fund.updatedAt && (
        <section className={blocks.length % 2 ? "bg-ground-2" : ""}>
          <Container>
            <p className="t-mono-xs rule-t py-8 text-ink-3">Last updated {fund.updatedAt}</p>
          </Container>
        </section>
      )}
    </>
  );
}
