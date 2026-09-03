import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { fund } from "@/config/fund";
import PrintButton from "./PrintButton";

/**
 * /tearsheet — a page about tearsheets, which is not a tearsheet.
 *
 * A tearsheet is, by definition, performance data on one page. Under Regulation
 * D Rule 506(b) the firm may not take the fund to the public, and a tearsheet is
 * the most portable form of doing exactly that. Separately, every figure that
 * would go on one is unsupplied in `src/config/fund.ts`.
 *
 * WHAT THIS FILE MUST NEVER CONTAIN, and does not:
 *   - a number presented as this fund's result, of any kind, in any unit
 *   - a chart, a sparkline, an axis, a bar, a grid, an empty plot frame
 *   - an adjective implying an outcome ("strong", "consistent", "compounded",
 *     "outperformed"). A blank chart frame is a placeholder wearing a suit and
 *     is banned for the same reason a greyed row is.
 *
 * There is no figure row-builder in this file. `fund.ts` carries no performance
 * fields, and inventing the shape of one here — even gated, even unreachable —
 * would be writing the schema for numbers nobody has produced. The one gated
 * fact block is PROVENANCE: who struck the sheet and who audited it, read out
 * of `fund.providers`. Both are null, so `provenanceRows` is empty, the block is
 * never pushed, and the ordinals close over the hole. The row-builder is a plain
 * filter over the config and is therefore never called with null data.
 *
 * Everything that does render is STRUCTURE: what a tearsheet is, what an
 * allocator should refuse to accept one without, why this site does not carry
 * one, and where the non-numeric half of the same material actually lives.
 */

export const metadata: Metadata = {
  title: "Tearsheet",
  description:
    "What a tearsheet contains, what an allocator should insist on seeing in one, and why this site does not publish one.",
};

/* ------------------------------------------------------------------ ledger --
   Same construction as /diligence and /governance: real <table>, visually
   hidden <caption>, <th scope="row"> on the term, hairline between rows only.
   Below md each row becomes a block and stacks term-over-value, so nothing
   scrolls sideways at 390px. The mobile cell label is aria-hidden because the
   <thead> is sr-only rather than display:none, so a screen reader already has
   the column header and would otherwise hear it twice. */
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
          <th scope="col" className="t-mono-xs block pb-3 text-left text-fog md:table-cell md:w-1/3 md:pr-6">
            {termHead}
          </th>
          <th scope="col" className="t-mono-xs block pb-3 text-left text-fog md:table-cell md:pr-6">
            {valueHead}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.term} className="rule-t block py-5 md:table-row md:py-0">
            <th
              scope="row"
              className="t-body block text-left font-normal text-fog md:table-cell md:w-1/3 md:py-6 md:pr-6 md:align-top"
            >
              {r.term}
            </th>
            <td className="block pt-2 md:table-cell md:py-6 md:align-top">
              <span aria-hidden="true" className="t-mono-xs block text-fog md:hidden">
                {valueHead}
              </span>
              <span className="t-body measure-body block text-cloud">{r.value}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* --------------------------------------------------------- the demand list --
   The most useful thing this page can carry: the standard to hold ANY manager's
   sheet to, including this one when it exists. Nothing here is a claim about
   this fund, so nothing here needs a figure to be true. */
const demands: { term: string; value: string }[] = [
  {
    term: "Whose figures they are",
    value:
      "The fund's own results, a single representative account, or a composite. Those are three different claims. A sheet that does not say which one it is making is making whichever one reads best.",
  },
  {
    term: "Audited or not",
    value:
      "Which periods an audit covers, which are unaudited, and who the auditor is. An unaudited period is not disqualifying. An unmarked one is.",
  },
  {
    term: "Net of what, exactly",
    value:
      "The fees and expenses actually deducted, and whether they match what a new investor would be charged. A figure struck after a fee schedule nobody pays is a marketing figure with a decimal point.",
  },
  {
    term: "Live or simulated",
    value:
      "Any period that is backtested, hypothetical or reconstructed, marked as such and kept separate from the rest. A history that changes its own basis part way through without saying where is worse than a shorter one.",
  },
  {
    term: "Who struck the marks",
    value:
      "Anything that does not trade on an exchange should be valued under a written policy, by people who do not carry the position, with the administrator's mark governing. The sheet should name that party rather than imply it.",
  },
  {
    term: "The worst period, in full",
    value:
      "The largest peak-to-trough decline, when it started, how long recovery took, and whether recovery is complete. A sheet that reports the best month and rounds the worst drawdown has already chosen its reader.",
  },
  {
    term: "Exposure, not only outcome",
    value:
      "Gross and net exposure through the period, given as a range rather than an average. An average exposure hides the fortnight that decided the year, which is usually the fortnight worth asking about.",
  },
  {
    term: "The size of the book",
    value:
      "How much capital the strategy runs, and how that has moved. What a process did at one size is not evidence about what it does at ten times that size, and the sheet should let a reader see which one they are holding.",
  },
  {
    term: "Ratios with their inputs",
    value:
      "Every statistic on the page rests on assumptions: the rate it is measured against, the window, the observation frequency. A ratio quoted without them is a number rather than a measurement.",
  },
  {
    term: "The date, and the party behind it",
    value:
      "A sheet with no as-of date is a screenshot, not a document. A sheet the manager produced with nobody independent behind it is the manager's opinion of the manager's own year.",
  },
];

/* ----------------------------------------------------------- 0X · provenance -
   FACTS. Both fields are null today, so this comes back empty and the section
   is never pushed into the page. It renders the day intake Tier 1 lands. */
const provenanceRows: { term: string; value: string }[] = [
  { term: "Struck by", value: fund.providers.administrator },
  { term: "Audited by", value: fund.providers.auditor },
].filter((r): r is { term: string; value: string } => r.value !== null);

/* Where the non-numeric half of a tearsheet actually lives on this site. */
const elsewhere: { href: string; label: string; note: string }[] = [
  {
    href: "/diligence",
    label: "Diligence",
    note: "Service providers, registrations, the document index and how each item is released.",
  },
  {
    href: "/governance",
    label: "Governance",
    note: "Who sets the limits, who can cut a position without asking, and whose mark is final.",
  },
  {
    href: "/partnership",
    label: "Partnership",
    note: "The three structures a family can hold capital in, and how a relationship starts.",
  },
  {
    href: "/questions",
    label: "Questions we expect",
    note: "The hard questions an allocator asks an emerging manager, answered before they are asked.",
  },
];

type Block = { id: string; title: string; kicker?: string; node: React.ReactNode };

export default function Tearsheet() {
  const blocks: Block[] = [];

  /* 01 — structure. */
  blocks.push({
    id: "what",
    title: "What a tearsheet is",
    kicker: "One page, struck on a schedule, built to be laid next to twenty others.",
    node: (
      <>
        <p className="t-body measure-body">
          The top of the sheet carries identity: the entity, the manager, the jurisdiction, the
          strategy, the share class, the currency, and the date the sheet was struck. The middle
          carries the return history and the statistics derived from it. The foot carries terms,
          service providers and a contact.
        </p>
        <p className="t-body measure-body mt-6">
          Its whole value is that it is comparable. Its whole danger is the same property: a page
          built to be compared is a page built to be skimmed, and a figure that has been skimmed
          has not been checked. The sheet is a starting point for questions, and it is worth
          nothing to a reader who treats it as the answer.
        </p>
      </>
    ),
  });

  /* 02 — structure, and the reason to keep the page at all. */
  blocks.push({
    id: "insist",
    title: "What to insist on",
    kicker:
      "The standard worth holding any manager's sheet to, including this firm's when there is one. None of it is a claim about this fund.",
    node: (
      <Ledger
        caption="What an allocator should insist on seeing in a tearsheet, and why each item matters."
        termHead="Insist on"
        valueHead="Why"
        rows={demands}
      />
    ),
  });

  /* 0X — FACTS. Collapses entirely today. */
  if (provenanceRows.length > 0) {
    blocks.push({
      id: "provenance",
      title: "Provenance",
      kicker: "A figure is worth what the party that struck it is worth.",
      node: (
        <Ledger
          caption="The parties that would produce and audit the fund's own sheet."
          termHead="Role"
          valueHead="Party"
          rows={provenanceRows}
        />
      ),
    });
  }

  /* 03 — the reason this page is not a tearsheet. */
  blocks.push({
    id: "why-not",
    title: "Why this site does not publish one",
    node: (
      <>
        <p className="t-body measure-body">
          The partnership relies on Regulation D, Rule 506(b), which permits the firm to discuss
          the fund with people it already knows and prohibits taking it to the public. A tearsheet
          is the most portable form of taking a fund to the public that exists — it is designed to
          be forwarded. Publishing one here would put the whole partnership&rsquo;s reliance on the
          exemption at risk in order to save a reader one email.
        </p>
        <p className="t-body measure-body mt-6">
          The second reason is simpler and would survive a change of regime. This site prints no
          figure the firm has not supplied and stood behind. There is no rounded version, no
          approximation, no last-quarter estimate and no worked example that makes an unsupplied
          number publishable, and the moment a page feels the pull to print one is the moment it
          should print nothing instead.
        </p>
        <p className="t-body measure-body mt-6">
          That is also why there is no chart on this page and no empty frame waiting for one. A
          blank axis is a promise that a figure is coming and an invitation to imagine its shape.
          It is a placeholder wearing a suit, and it is banned here for the same reason a greyed
          row is.
        </p>
        <p className="t-body measure-body mt-6">
          If the regime and the disclosures ever permit it, the figures will be struck by the
          administrator rather than by the desk, and they will travel with the context that makes
          them checkable. They will not arrive as a graphic on a public page.
        </p>
      </>
    ),
  });

  /* 04 — where the rest of the same material lives. */
  blocks.push({
    id: "instead",
    title: "What is published instead",
    kicker:
      "Everything on a tearsheet that does not depend on a figure is on this site in full, and at more length than one page allows.",
    node: (
      <>
        <ul>
          {elsewhere.map((e) => (
            <li key={e.href} className="rule-t py-5">
              <TextLink standalone href={e.href}>
                {e.label}
              </TextLink>
              <p className="t-small measure-body mt-1">{e.note}</p>
            </li>
          ))}
        </ul>
        <p className="t-body measure-body mt-8">
          What is missing from that list is the half a tearsheet exists for, and it is missing on
          purpose rather than by omission. An allocator who needs it should ask for it through the
          route the partnership actually runs on.
        </p>
        <p className="t-body mt-6">
          <TextLink standalone href="/access">
            How to ask for an introduction
          </TextLink>
        </p>
      </>
    ),
  });

  return (
    <>
      <PageHeader
        eyebrow="Tearsheet"
        title="The tearsheet."
        standfirst="A tearsheet is performance on one page. Under Rule 506(b) it cannot sit on a public one, and every figure that would go on ours is unpublished. So this page does the next most useful thing: it sets out what a tearsheet contains, what an allocator should refuse to accept one without, and why this site does not carry one."
      />

      {/* The preview. A `<header>`, not a `<section>`: it is print utility
          chrome for the page below it — a paper-proportioned object and the
          one control that produces it — not article content, exactly the
          same distinction `scripts/qa/print.ts` already draws for the nav
          and the footer ("a menu is not content, and a reader holding the
          sheet cannot click it"). `print:hidden` drops it from the printed
          page; the same landmark tells the print gate it was dropped on
          purpose rather than lost. The object itself carries no text of its
          own — everything it would say is already the `<h1>` two lines up —
          so it reads as an abstraction of a printed sheet (title bar, a few
          lines) rather than a duplicate caption. Letter's own 8.5:11 ratio,
          the shape `scripts/qa/print.ts` emulates. Centered in its own
          viewport-height band rather than left with the rest of the grid,
          because it is an object, not a column of text. */}
      <header className="print:hidden">
        <Container>
          <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-8 py-16">
            <div
              aria-hidden="true"
              className="flex aspect-[8.5/11] w-full max-w-xs flex-col gap-3 rounded-card border border-void/10 bg-pure p-8 md:max-w-sm"
            >
              <div className="h-3 w-2/3 rounded-control bg-void/15" />
              <div className="mt-4 h-2 w-full rounded-control bg-void/10" />
              <div className="h-2 w-full rounded-control bg-void/10" />
              <div className="h-2 w-5/6 rounded-control bg-void/10" />
              <div className="mt-auto h-2 w-1/3 rounded-control bg-void/10" />
            </div>
            <PrintButton />
          </div>
        </Container>
      </header>

      {/* Bands alternate obsidian / abyss, matching /firm, /diligence and
          /governance. Ordinals come from the RENDERED index rather than a fixed
          list, so the collapsed provenance block leaves no gap in the numbering.
          Heading pure 19.05:1 / 19.81:1, body ash 7.20:1 / 7.49:1, fog labels
          4.61:1 / 4.80:1. */}
      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`scroll-mt-24 ${i % 2 ? "bg-abyss" : ""}`}>
          <Container>
            <div className={`grid-gc2 py-16 md:py-24 ${i === 0 ? "rule-t" : ""}`}>
              <div className="col-span-4 md:col-span-4">
                <p className="t-mono-xs text-fog">{String(i + 1).padStart(2, "0")}</p>
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
        <section className={blocks.length % 2 ? "bg-abyss" : ""}>
          <Container>
            <p className="t-mono-xs rule-t py-8 text-fog">Last updated {fund.updatedAt}</p>
          </Container>
        </section>
      )}
    </>
  );
}
