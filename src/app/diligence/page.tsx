import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { fund, hasAny } from "@/config/fund";
import { site } from "@/config/site";

/**
 * /diligence — the operational spine.
 *
 * THE RULE THIS FILE IS BUILT AROUND: every allocator fact in `src/config/fund.ts`
 * is null, and a null renders NOTHING. No placeholder, no "TBD", no greyed row,
 * no em-dash stand-in. A block whose every field is null does not render at all.
 * Inventing an administrator, an auditor, a CRD or an NFA ID here would not be
 * embarrassing, it would be a misrepresentation to an allocator running ODD.
 *
 * So the page is split in two by kind:
 *
 *   FACTS  — providers, registrations. Data-driven off `fund`, collapse to
 *            nothing today, and render correctly the moment intake Tier 1 lands.
 *   STRUCTURE — document release policy, the operating controls. These describe
 *            how the firm is built rather than asserting an unknown fact, so
 *            they are true today and render today.
 *
 * Two conditional-COLUMN tricks keep the tables honest rather than empty:
 * the registrations table grows a "Verify" column only once an ID exists to
 * link, and the documents table grows an "As of" column only once a date is
 * supplied. A column of blank cells is a placeholder by another name.
 *
 * 506(b): nothing here may read as an invitation to invest, and no offering
 * material is downloadable from a public page. `scripts/qa/regime.ts` scans the
 * rendered text. No performance figure, chart or adjective implying one.
 */

export const metadata: Metadata = {
  title: "Diligence",
  description:
    "Service providers, registrations, document release and the operating controls, in one place.",
};

/* ------------------------------------------------------------------ ledger --
   A real <table>: visually-hidden <caption>, <th scope="row"> on the term,
   hairline between rows only — no verticals, no zebra. Below md every row
   becomes a block and stacks term-over-value, so the page never scrolls
   sideways. The mobile cell labels are aria-hidden because the <thead> is
   sr-only rather than display:none there, so a screen reader still gets proper
   column headers and would otherwise hear each one twice. */
function Ledger({
  caption, termHead, heads, rows,
}: {
  caption: string;
  termHead: string;
  heads: string[];
  rows: { term: string; cells: React.ReactNode[] }[];
}) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{caption}</caption>
      <thead className="sr-only md:not-sr-only">
        <tr className="block md:table-row">
          <th scope="col" className="t-caption block pb-3 text-left text-ink-3 md:table-cell md:w-5/12 md:pr-6">
            {termHead}
          </th>
          {heads.map((h) => (
            <th key={h} scope="col" className="t-caption block pb-3 text-left text-ink-3 md:table-cell md:pr-6">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          /* Below md the row becomes its own grid rather than a plain block
             stack, so the term and each value line up as term-over-value
             pairs with a consistent gap, per §5.7/§7.10. */
          <tr key={r.term} className="rule-t grid gap-y-1 py-5 md:table-row md:gap-y-0 md:py-0">
            <th
              scope="row"
              className="t-body block text-left font-normal text-ink-3 md:table-cell md:w-5/12 md:py-6 md:pr-6 md:align-top"
            >
              {r.term}
            </th>
            {r.cells.map((c, i) => {
              /* An empty cell is dropped from the stacked layout entirely. A
                 mono column label with nothing under it is a placeholder by
                 another name — the exact thing this page must never render.
                 On md the cell is still emitted so the table keeps its shape. */
              const empty = c === null || c === undefined || c === "";
              return (
                <td
                  key={i}
                  className={
                    empty
                      ? "hidden md:table-cell md:py-6 md:pr-6 md:align-top"
                      : "block md:table-cell md:py-6 md:pr-6 md:pt-6 md:align-top"
                  }
                >
                  {!empty && (
                    <>
                      <span aria-hidden="true" className="t-caption block text-ink-3 md:hidden">
                        {heads[i]}
                      </span>
                      <span className="t-body block text-ink">{c}</span>
                    </>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------- 01 · providers ----
   ODD's first question. Names in type, never logos. Every field is null today,
   so `rows` comes back empty, `hasAny` is false, and the block is not pushed
   into the page at all. */
const { providers, regulatory } = fund;

const providerRows: { term: string; cells: React.ReactNode[] }[] = ([
  { term: "Administrator", value: providers.administrator },
  { term: "Auditor", value: providers.auditor },
  { term: "Prime brokers", value: providers.primeBrokers?.length ? providers.primeBrokers : null },
  { term: "Custodian", value: providers.custodian },
  { term: "Legal counsel", value: providers.counsel },
  { term: "Tax", value: providers.taxPreparer },
  { term: "Information security", value: providers.cyberVendor },
] as { term: string; value: string | readonly string[] | null }[])
  .filter((r) => r.value !== null && r.value !== undefined)
  .map((r) => ({
    term: r.term,
    cells: [
      typeof r.value === "string" ? (
        r.value
      ) : (
        <>
          {(r.value ?? []).map((n) => (
            <span key={n} className="block">
              {n}
            </span>
          ))}
        </>
      ),
    ],
  }));

/* Independence is the sentence ODD is actually reading for, but it is only
   true of a provider that exists. Each clause is gated on its own name. */
const independence = [
  providers.administrator &&
    "The administrator is independent of the manager and strikes the official mark.",
  providers.auditor &&
    "The auditor is independent of the manager and reports to the fund rather than to the desk.",
].filter(Boolean) as string[];

/* ---------------------------------------------------- 02 · registrations ----
   The firm's books trade futures and options (see src/content/strategies.ts),
   so CPO/CTA status is a question every ODD analyst asks. Answering it
   unprompted is worth more than three paragraphs of philosophy — but only an
   answer is worth anything, and we do not have one yet, so this renders
   nothing rather than something approximate.

   Verification links are built from an ID the owner supplies. A URL template
   is not a fabricated fact; a made-up CRD would be. */
const adviserLabel: Record<string, string> = {
  RIA: "Registered investment adviser",
  ERA: "Exempt reporting adviser",
  state: "State-registered adviser",
  none: "Not registered as an investment adviser",
};

const registrationRows: { term: string; value: string | null; href: string | null }[] = [
  {
    term: "Adviser status",
    value: regulatory.advisorStatus ? adviserLabel[regulatory.advisorStatus] : null,
    href: null,
  },
  {
    term: "CRD number",
    value: regulatory.crd,
    href: regulatory.crd ? `https://adviserinfo.sec.gov/firm/summary/${regulatory.crd}` : null,
  },
  { term: "SEC file number", value: regulatory.secFileNumber, href: null },
  {
    term: "Form D",
    value: regulatory.formDCik ? `CIK ${regulatory.formDCik}` : null,
    href: regulatory.formDCik
      ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${regulatory.formDCik}&type=D&dateb=&owner=include&count=40`
      : null,
  },
  { term: "CFTC status", value: regulatory.cftc, href: null },
  {
    term: "NFA ID",
    value: regulatory.nfaId,
    href: regulatory.nfaId
      ? `https://www.nfa.futures.org/BasicNet/basic-profile.aspx?nfaid=${regulatory.nfaId}`
      : null,
  },
].filter((r) => r.value !== null);

const verifyLabel: Record<string, string> = {
  "CRD number": "SEC IAPD",
  "Form D": "EDGAR",
  "NFA ID": "NFA BASIC",
};

/* The column exists only if something in it does. */
const showVerify = registrationRows.some((r) => r.href);

/* -------------------------------------------------------- 03 · documents ----
   An index, not a download wall, and not an inventory either: a row is a thing
   we will answer for, with the document or with the reason there is not one.
   Release is set by the regime and by policy, both of which are true today.
   `asOf` is a fact nobody has supplied, so the whole column stays absent. */
type Doc = { name: string; asOf: string | null; release: string; requires?: "crd" | "auditor" };

const documents: Doc[] = [
  { name: "Due diligence questionnaire", asOf: null, release: "On request" },
  { name: "Private placement memorandum", asOf: null, release: "Direct to eligible investors" },
  { name: "Limited partnership agreement", asOf: null, release: "Direct to eligible investors" },
  { name: "Subscription agreement", asOf: null, release: "Direct to eligible investors" },
  // Gated on the auditor's name existing, the same fact the independence
  // sentence below is gated on: there is no audited period to release
  // without an auditor, and "On request" next to nothing to request is the
  // kind of row a diligence team reads as evasive rather than empty.
  { name: "Audited financial statements", asOf: null, release: "On request", requires: "auditor" },
  { name: "Form ADV Parts 1, 2A and 2B", asOf: null, release: "Public", requires: "crd" },
  { name: "Valuation policy", asOf: null, release: "On request" },
  { name: "Business continuity summary", asOf: null, release: "On request" },
  { name: "Information security summary", asOf: null, release: "On request" },
  { name: "Insurance summary", asOf: null, release: "On request" },
];

const visibleDocs = documents.filter((d) => {
  if (d.requires === "crd") return Boolean(regulatory.crd);
  if (d.requires === "auditor") return providers.auditor !== null;
  return true;
});
const showAsOf = visibleDocs.some((d) => d.asOf);

/* -------------------------------------------------------- 04 · operations ---
   Structure, not parameters. What each control is for and who holds it — never
   a threshold, a cut-off time, a system name or a vendor. Publishing an
   inventory of defences is security theatre that helps the people testing them,
   so the cyber entry says as much and stops. */
const operations: { h: string; p: string }[] = [
  {
    h: "Trade capture and reconciliation",
    p: "Trades are captured at execution rather than reassembled at the end of the day, and positions and cash are reconciled against broker and administrator records every business day. A break is owned by a person, escalated the day it appears, and cleared before the next session opens. A break that cannot be cleared is treated as a risk event, not as an admin task.",
  },
  {
    h: "Cash controls",
    p: "Moving money is separated from taking risk: the people who trade the book do not release payments. Instructions that move cash outside the fund's own accounts need more than one approver and are confirmed against records held by someone outside the desk. Standing settlement instructions change through a controlled process, never on the strength of an email that asks for it.",
  },
  {
    h: "Valuation",
    p: "Prices come from sources independent of the desk. Anything that does not trade on an exchange is valued under a written policy that fixes the method before the position exists, and the policy is applied by people who do not carry the position. The administrator strikes the official mark, and it is that mark, not the manager's, that reaches an investor's statement.",
  },
  {
    h: "Business continuity",
    p: "The firm is small enough that continuity is a question about people and access, not about a building. The book can be monitored, hedged and reduced from outside the office, and the plan is rehearsed rather than filed. It does not assume everyone is reachable: on a bad day the first obligation is to reduce risk, not to reach consensus.",
  },
  {
    h: "Information security",
    p: "Security is treated as an operational risk with a named owner, not as an IT line item. Access is granted by role and reviewed, authentication carries a second factor, and any request to move money or change account details is verified out of band regardless of who appears to have sent it. We do not publish the specific controls, because an inventory of defences is useful mainly to the people testing them.",
  },
  {
    h: "Insurance",
    p: "Coverage is evidenced from the certificates during diligence rather than described here. Lines, carriers and limits change at renewal, and a public page cannot be trusted to stay current with them. We would rather be asked for the certificate than be believed on a summary.",
  },
];

/* ----------------------------------------------------------------- render --- */
type Block = { id: string; title: string; kicker?: string; node: React.ReactNode };

export default function Diligence() {
  const blocks: Block[] = [];

  /* 01 — collapses entirely today. */
  if (hasAny(providers) && providerRows.length > 0) {
    blocks.push({
      id: "providers",
      title: "Service providers",
      kicker: "Named in type. We do not publish logos in place of an answer.",
      node: (
        <>
          <Ledger
            caption="Service providers to the fund, by role."
            termHead="Role"
            heads={["Name"]}
            rows={providerRows}
          />
          {independence.length > 0 && (
            <p className="t-body measure-body rule-t mt-0 pt-6">{independence.join(" ")}</p>
          )}
        </>
      ),
    });
  }

  /* 02 — collapses entirely today. */
  if (hasAny(regulatory) && registrationRows.length > 0) {
    blocks.push({
      id: "registrations",
      title: "Registrations",
      kicker:
        "Every identifier below links to the regulator's own record, so nothing here has to be taken on trust.",
      node: (
        <Ledger
          caption="Registrations and regulatory identifiers, with links to the regulator's record."
          termHead="Registration"
          heads={showVerify ? ["Status", "Verify"] : ["Status"]}
          rows={registrationRows.map((r) => ({
            term: r.term,
            cells: showVerify
              ? [
                  r.value,
                  r.href ? (
                    <TextLink standalone external href={r.href}>
                      {verifyLabel[r.term] ?? "Regulator record"}
                    </TextLink>
                  ) : null,
                ]
              : [r.value],
          }))}
        />
      ),
    });
  }

  /* 03 — structure, so it renders today. */
  blocks.push({
    id: "documents",
    title: "Documents",
    kicker: "An index of what a diligence team can work from, and how each item is released.",
    node: (
      <>
        <p className="t-body measure-body">
          This is an index, not a download wall. Under Regulation D 506(b) nothing that
          constitutes offering material may sit on a public page, so the offering documents are
          released directly to investors who qualify and never from here. That is what{" "}
          <TextLink href="/access">direct to eligible investors</TextLink> means below.
        </p>
        <p className="t-body measure-body mt-6">
          Everything else goes to diligence teams on request. A row in this index is something we
          will answer for: either with the document, or with the reason there is not one yet.
        </p>
        <div className="mt-10">
          <Ledger
            caption="Document index, showing how each document is released."
            termHead="Document"
            heads={showAsOf ? ["As of", "Release"] : ["Release"]}
            rows={visibleDocs.map((d) => ({
              term: d.name,
              cells: showAsOf ? [d.asOf, d.release] : [d.release],
            }))}
          />
        </div>
      </>
    ),
  });

  /* 04 — structure, so it renders today. */
  blocks.push({
    id: "operations",
    title: "Operations",
    kicker: "How the controls are built. Thresholds, systems and vendors are confirmed in diligence, not published.",
    node: (
      <dl>
        {operations.map((o) => (
          <div key={o.h} className="rule-t py-8">
            <dt className="t-mono text-ink">{o.h}</dt>
            <dd className="t-body measure-body mt-3">{o.p}</dd>
          </div>
        ))}
      </dl>
    ),
  });

  /* 05 — the honest version of a contact block. There is no dedicated ODD
     address yet, so none is rendered. Pointing diligence at a press mailbox
     would be worse than saying so. */
  blocks.push({
    id: "contact",
    title: "Operational due diligence",
    node: (
      <>
        <p className="t-body measure-body">
          Diligence is not an investor enquiry and should not share an inbox with one. We have not
          published a dedicated operational due diligence address yet, and we are not going to
          point one at a mailbox that is not staffed for it.
        </p>
        <p className="t-body measure-body mt-6">
          Until it exists, requests go through the contact page and are routed to the person who
          owns the answer.
        </p>
        <p className="t-body mt-6">
          <TextLink standalone href="/contact">
            Contact
          </TextLink>
        </p>
      </>
    ),
  });

  return (
    <>
      <PageHeader
        eyebrow="Diligence"
        title="Diligence."
        standfirst="What an allocator needs before a first call, in one place: who keeps the books, what we are registered as, which documents are released and on what terms, and how the operating controls are built."
        quickLink={
          <p className="t-caption">
            {`The firm was formed in ${site.foundedLabel}. What is described here is the policy the firm operates under, not a record of periods it has run.`}
          </p>
        }
      />

      {/* Bands alternate ground / ground-2, matching /firm, so an inner page
          reads as the same site. Ordinals are taken from the RENDERED index,
          not from a fixed list, so a collapsed block never leaves a gap in the
          numbering. Heading ink 17.04:1 / 15.47:1, body ink-2 7.55:1 / 6.85:1,
          ink-3 labels 5.61:1 / 5.09:1. */}
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
