import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { fund } from "@/config/fund";

/**
 * /letters — the investor letters, described rather than published.
 *
 * THE CONSTRAINT: the partnership relies on Regulation D Rule 506(b), so no
 * offering or fund-discussing material may sit on a public page. A letter is
 * the most fund-discussing document the firm produces. It cannot be here, and
 * that is structural rather than a gap waiting to be filled.
 *
 * So this is NOT an archive with the rows emptied out. There is no list of
 * dates with the links removed, no letter count, no first-letter date, no page
 * length and no sample excerpt. `src/config/fund.ts` names no letters, and a
 * null renders NOTHING — not a placeholder, not "TBD", not a greyed row.
 *
 * Split by kind, the same way /diligence is:
 *
 *   STRUCTURE — what a letter is, the sections every one of them carries, why
 *               none is downloadable, where they go. True today, renders today.
 *   FACTS     — the cadence table, built from `fund.reporting`. Every field is
 *               null, so `cadenceRows` is empty, the block is never pushed, and
 *               the section ordinals close over the hole rather than skipping a
 *               number. It renders the day intake Tier 3 lands and not before.
 *
 * The one sentence that could have been a fabrication is the frequency itself.
 * "Quarterly" is the answer nine funds in ten would give and we do not have it,
 * so the page says what governs the schedule and declines to state it.
 */

export const metadata: Metadata = {
  title: "Letters",
  description:
    "What the investor letters contain, what governs when they go out, and the structural reason none of them is readable on a public page.",
};

/* ------------------------------------------------------------------ ledger --
   Same construction as /diligence and /governance: real <table>, visually
   hidden <caption>, <th scope="row"> on the term, hairline between rows only.
   Below md each row becomes a block and stacks term-over-value, so the page
   never scrolls sideways at 390px. The mobile cell label is aria-hidden
   because the <thead> is sr-only rather than display:none, so a screen reader
   already has the column header and would otherwise hear it twice. */
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
          <th scope="col" className="t-caption block pb-3 text-left text-ink-3 md:table-cell md:w-1/2 md:pr-6">
            {termHead}
          </th>
          <th scope="col" className="t-caption block pb-3 text-left text-ink-3 md:table-cell md:pr-6">
            {valueHead}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          /* Below md the row becomes its own grid rather than a plain block
             stack, so the term and value line up as a term-over-value pair
             with a consistent gap, per §5.7/§7.10. */
          <tr key={r.term} className="rule-t grid gap-y-1 py-5 md:table-row md:gap-y-0 md:py-0">
            <th
              scope="row"
              className="t-body block text-left font-normal text-ink-3 md:table-cell md:w-1/2 md:py-6 md:pr-6 md:align-top"
            >
              {r.term}
            </th>
            <td className="block md:table-cell md:py-6 md:align-top">
              <span aria-hidden="true" className="t-caption block text-ink-3 md:hidden">
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

/* ------------------------------------------------------------- the cadence --
   Read out of `fund.reporting`, never hardcoded. Every field is null today, so
   this comes back empty and the whole section is skipped. "NAV struck by" is
   gated on the administrator's name for the same reason: a role with nobody in
   it is a placeholder. */
const cadenceRows: { term: string; value: string }[] = [
  { term: "Letters", value: fund.reporting.letterCadence },
  { term: "Investor calls", value: fund.reporting.investorCallCadence },
  { term: "Valuation", value: fund.reporting.navFrequency },
  { term: "Estimate", value: fund.reporting.estimateTiming },
  { term: "Final", value: fund.reporting.finalTiming },
  { term: "Struck by", value: fund.providers.administrator },
].filter((r): r is { term: string; value: string } => r.value !== null);

/* ------------------------------------------------------- what is in a letter -
   Standing sections. This describes the form the firm holds its letters to,
   which is a policy the firm can be held to — not a claim about a letter that
   has already been written, and not a summary of one. */
const sections: { h: string; p: string }[] = [
  {
    h: "What changed in the book",
    p: "Positions opened, closed and resized during the period, with the reasoning that was used at the time rather than the reasoning that reads best afterwards. An investor should be able to reconstruct the period from the letter alone, including the parts of it nobody enjoyed.",
  },
  {
    h: "Where the framework was wrong",
    p: "The decisions that did not work, named as such, with what has changed as a result and what has deliberately not changed. A firm that revises its process only after a loss does not have a process, it has a mood.",
  },
  {
    h: "Risk and the tail overlay",
    p: "How exposure moved through the period, and what the overlay cost while it was carried. The overlay is permanent rather than discretionary, so it is a standing line in every letter rather than an item that appears in the periods where it flatters.",
  },
  {
    h: "The regime we think we are in",
    p: "Which regime the framework is reading, what would change that read, and what the book would do if it changed. A view that cannot be falsified by the next letter is not a view, and writing it down in advance is what makes the next letter worth reading.",
  },
  {
    h: "Operational notes",
    p: "Anything an investor would want to know that is not about markets: a change of provider, a change in the people, a change to the documents, a change in how the fund is run. Operational news should never reach an investor from somebody else first.",
  },
  {
    h: "What the research is doing",
    p: "Work in progress, including the work that has produced nothing. Capacity work belongs here, because what a market absorbs is established before whether an idea has edge, and the constraint is more durable than the idea.",
  },
];

type Block = { id: string; title: string; kicker?: string; node: React.ReactNode };

export default function Letters() {
  const blocks: Block[] = [];

  /* 01 — structure. */
  blocks.push({
    id: "what",
    title: "What a letter is",
    kicker: "Written by the person managing the money, to the people whose money it is.",
    node: (
      <>
        <p className="t-body measure-body">
          A letter is not a marketing document with a chart on the front, and it is not a summary
          assembled afterwards by someone who was not in the room when the decisions were made. It
          is the one place a manager has to write down what they did, what it cost, and where they
          were wrong.
        </p>
        <p className="t-body measure-body mt-6">
          That constrains the form more than it sounds. A letter that explains only the good
          decisions is a newsletter with a fund attached. The test a letter has to pass here is
          whether a reader could reconstruct what changed in the book during the period, and why,
          from the letter alone.
        </p>
        <p className="t-body measure-body mt-6">
          It is also the document a diligence team should ask for before anything written to be
          handed out. A letter addressed to existing investors, covering a period the manager did
          not enjoy, says more about a firm than any material produced for a prospective reader.
        </p>
      </>
    ),
  });

  /* 02 — structure. The schedule discipline is a policy; the frequency is a
     fact nobody has supplied, so it is described and not stated. */
  blocks.push({
    id: "cadence",
    title: "Cadence",
    kicker: "The schedule does not move with the results.",
    node: (
      <>
        <p className="t-body measure-body">
          A letter that is late after a difficult period and prompt after an easy one has told its
          reader something the manager did not intend to tell them. The date is fixed in advance
          precisely so that it carries no information.
        </p>
        <p className="t-body measure-body mt-6">
          The same discipline governs the contents. The sections below appear in every letter, in
          the same order, whether or not the period was one anybody would choose to write about.
          A section that appears only when there is something flattering to put in it is an
          argument dressed as a format.
        </p>
        <p className="t-body measure-body mt-6">
          The frequency itself is fixed in the fund documents, and it is stated here when it is
          stated there rather than a day earlier. A cadence published on a website before it is
          committed to in a document is a preference, not an obligation, and the difference is the
          entire point of publishing one.
        </p>
      </>
    ),
  });

  /* Facts. Empty today, so this is never pushed and the ordinals close up. */
  if (cadenceRows.length > 0) {
    blocks.push({
      id: "schedule",
      title: "The schedule",
      kicker: "Read from the fund's reporting commitments, not written for this page.",
      node: (
        <Ledger
          caption="Reporting cadence: letters, investor calls and valuation."
          termHead="Item"
          valueHead="Cadence"
          rows={cadenceRows}
        />
      ),
    });
  }

  /* 03 — structure. */
  blocks.push({
    id: "contents",
    title: "What is in one",
    kicker:
      "Six standing sections. None of them is optional, and none of them is dropped in a period where it would read badly.",
    node: (
      <dl>
        {sections.map((s) => (
          <div key={s.h} className="rule-t py-8">
            <dt className="t-mono text-ink">{s.h}</dt>
            <dd className="t-body measure-body mt-3">{s.p}</dd>
          </div>
        ))}
      </dl>
    ),
  });

  /* 04 — the reason the page exists in this shape. */
  blocks.push({
    id: "why-not-here",
    title: "Why none of them is here",
    node: (
      <>
        <p className="t-body measure-body">
          The partnership relies on Regulation D, Rule 506(b). That rule permits the firm to
          discuss the fund with people it already knows and prohibits taking it to the public. A
          letter discusses the fund in detail and is built to be read closely, so a letter posted
          here would be exactly the thing the rule forbids — and the consequence would land on the
          whole partnership rather than on the page.
        </p>
        <p className="t-body measure-body mt-6">
          There is a second reason, and it would hold even if the first disappeared. A letter
          carries position-level detail and the marks behind it, written for readers who are
          already carrying that risk. Putting it in front of anyone with the address is not
          transparency; it publishes the book to people who can trade against it, at the expense
          of the investors who own it.
        </p>
        <p className="t-body measure-body mt-6">
          So this page is not an archive with its rows emptied out. There is no list of dates with
          the links stripped off, no count of letters written, no first-letter date, and no
          excerpt selected because it reads well out of context. Where something cannot be
          published, the honest page describes it and stops.
        </p>
      </>
    ),
  });

  /* 05 — where they actually go, and the reason there is no form here. */
  blocks.push({
    id: "where",
    title: "Where the letters go",
    node: (
      <>
        <p className="t-body measure-body">
          Investors of record receive every letter directly. There is no mailing list on this
          site, no form and nothing to sign up to, because a public sign-up is one of the ways a
          private placement stops being private.
        </p>
        <p className="t-body measure-body mt-6">
          A diligence team receives letters the way it receives everything else: on request, once
          there is a relationship in which to have the conversation. That route is set out on the
          diligence page, and it is the only one.
        </p>
        <ul className="mt-8">
          <li className="rule-t py-4">
            <TextLink standalone href="/diligence">
              Diligence
            </TextLink>
            <p className="t-small measure-body mt-1">
              What is released, to whom, and on what terms.
            </p>
          </li>
          <li className="rule-t py-4">
            <TextLink standalone href="/access">
              How to ask for an introduction
            </TextLink>
            <p className="t-small measure-body mt-1">
              The sequence a relationship starts through, and why there is no shortcut past it.
            </p>
          </li>
        </ul>
      </>
    ),
  });

  return (
    <>
      <PageHeader
        eyebrow="Letters"
        title="Investor letters."
        standfirst="A letter is where a manager has to write down what they did, what it cost and where they were wrong. This page sets out what ours carry, what governs when they go out, and the structural reason none of them is readable on a public page."
      />

      {/* Bands alternate ground / ground-2, matching /firm, /diligence and
          /governance, so an inner page reads as the same site. Ordinals come
          from the RENDERED index rather than a fixed list, so the collapsed
          cadence block leaves no gap in the numbering. Heading ink 17.04:1 /
          15.47:1, body ink-2 7.55:1 / 6.85:1, ink-3 labels 5.61:1 / 5.09:1. */}
      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`scroll-mt-24 ${i % 2 ? "bg-ground-2" : ""}`}>
          <Container>
            <div className={`grid-gc2 py-16 md:py-24 ${i === 0 ? "rule-t" : ""}`}>
              <div className="col-span-4 md:col-span-4">
                <p className="t-mono-xs text-ink-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="t-h2 mt-3">{b.title}</h2>
                {b.kicker && <p className="t-small measure-body mt-6">{b.kicker}</p>}
              </div>
              <div className="col-span-4 md:col-span-7 md:col-start-6">{b.node}</div>
            </div>
          </Container>
        </section>
      ))}

      {/* Stamped only when there is a date to stamp. */}
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
