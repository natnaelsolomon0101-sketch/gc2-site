import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { fund } from "@/config/fund";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Partnership",
  description:
    "Three structures a family can hold capital in, how alignment works, and how a relationship starts.",
};

/* =============================================================================
   REGULATION D — READ BEFORE EDITING THIS FILE

   The partnership relies on Rule 506(b). Under 506(b) the firm may not take the
   fund to the public, so this page describes STRUCTURE and never TERMS: no
   minimum, no fee, no lock-up, no redemption mechanics, no figure of any kind,
   and never the verb "invest" as an invitation.

   The terms table is gated on `fund.regime === "506c"`. That is a STRUCTURAL
   gate, not a visual one: under 506(b) the component is never called, so the
   markup is not in the document, not in the RSC payload, and not reachable by
   disabling CSS or reading the DOM. `display:none` would be a disclosure with a
   stylesheet in front of it.

   `scripts/qa/regime.ts` scans the rendered text of this route on every pass.
   ========================================================================== */

/* Bound to the union deliberately. `fund.regime` is asserted to the union in
   fund.ts, but binding it here keeps the 506(c) branch type-checkable even if a
   later edit narrows the config to a single literal. */
const regime: "506b" | "506c" = fund.regime;

const CSS = `
/* Doors are full-width hairline blocks, not cards and not a comparison grid.
   The only ornament is a 2px chromatic bar over the door name, drawn from the
   warm end of the palette per the build brief. Cyan is not used. */
.pt-door{ border-bottom:1px solid rgba(255,255,255,.12); }
.pt-door:first-child{ border-top:1px solid rgba(255,255,255,.12); }
.pt-accent{ display:block; width:40px; height:2px; }

/* Real tables, hairline rows, mono row header, cloud value (17.49:1 on
   obsidian / 18.17:1 on abyss). Stacks to label-over-value under 640px so a
   38% column does not crush a date into four lines on a phone. */
.pt-table{ width:100%; border-collapse:collapse; }
.pt-table th, .pt-table td{ text-align:left; vertical-align:top;
  padding:20px 0; border-top:1px solid rgba(255,255,255,.12); }
.pt-table th{ font-family:var(--font-mono); font-size:11px; line-height:2;
  text-transform:uppercase; letter-spacing:.182em; font-weight:500;
  color:var(--color-ash); padding-right:24px; width:38%; }
.pt-table td{ font-size:16px; line-height:1.5; color:var(--color-cloud); }
/* Rows carry a top rule, so the last one needs a bottom rule to close the
   table. Without it the final value hangs off the end of an open box. */
.pt-table tbody tr:last-child th,
.pt-table tbody tr:last-child td{ border-bottom:1px solid rgba(255,255,255,.12); }
@media (max-width:640px){
  .pt-table th, .pt-table td{ display:block; width:auto; padding-right:0; }
  .pt-table td{ border-top:0; padding-top:0; padding-bottom:20px; }
  .pt-table th{ padding-bottom:2px; }
  .pt-table tbody tr:last-child th{ border-bottom:0; }
}

.pt-step{ border-top:1px solid rgba(255,255,255,.12); }
`;

const doors = [
  {
    n: "01",
    accent: "bg-orchid-bloom",
    kicker: "Commingled",
    name: "The fund",
    body: [
      "The commingled partnership. One book, one set of positions, every family in the same seat. The strategies run together, the tail overlay runs across all of them, and no family holds a different version of the book from any other.",
      "Because it is one book, it is also the only door where a family gets the whole process rather than a part of it.",
    ],
  },
  {
    n: "02",
    accent: "bg-pale-iris",
    kicker: "On the family's balance sheet",
    name: "Separate account",
    body: [
      "The same process, run on the family's own balance sheet. Assets are held in the family's name at the family's custodian, and the family sees the positions as they are held rather than as they are summarised.",
      "The trade-off is real and we will not talk around it: an account that is not commingled cannot hold everything the book holds, because some positions only size sensibly at the size of the whole book.",
    ],
  },
  {
    n: "03",
    accent: "bg-periwinkle",
    kicker: "Alongside the book",
    name: "Co-investment",
    body: [
      "Selected positions alongside the book, taken one at a time. This is where a newer family office often begins, because a single position can be underwritten on its own terms and judged on its own outcome.",
      "It is also the narrowest door. Co-investment shows a family one decision, and one decision is a poor sample of a process.",
    ],
  },
];

/* ---------------------------------------------------------------------------
   Terms. GATED — under 506(b) this function is never called.

   Every field is null until intake supplies it, so even under 506(c) the table
   renders only the rows that exist and disappears entirely when none do. No
   placeholder row, no "TBD", no greyed line.
   ------------------------------------------------------------------------ */
function termsRows() {
  return [
    { k: "Minimum", v: fund.terms.minimum },
    { k: "Management fee", v: fund.terms.managementFee },
    { k: "Performance fee", v: fund.terms.performanceFee },
    { k: "Hurdle", v: fund.terms.hurdle },
    {
      k: "High-water mark",
      v: fund.terms.highWaterMark === null ? null : fund.terms.highWaterMark ? "Yes" : "No",
    },
    { k: "Lock-up", v: fund.terms.lockup },
    { k: "Redemption frequency", v: fund.terms.redemptionFrequency },
    { k: "Redemption notice", v: fund.terms.redemptionNotice },
    { k: "Gate", v: fund.terms.gate },
    { k: "Share classes", v: fund.terms.shareClasses },
    { k: "Fee offsets", v: fund.terms.feeOffsets },
    { k: "Side letters", v: fund.terms.sideLetterPolicy },
  ].filter((r): r is { k: string; v: string } => r.v !== null);
}

function TermsTable({
  ordinal, ground, rows,
}: { ordinal: string; ground: string; rows: { k: string; v: string }[] }) {
  return (
    <section className={ground}>
      <Container>
        <div className="grid-gc2 py-16 md:py-24">
          <div className="col-span-4 md:col-span-3">
            <p className="t-mono-xs text-fog">{ordinal}</p>
            <h2 className="t-h2 mt-3">Terms</h2>
          </div>
          <div className="col-span-4 md:col-span-8 md:col-start-5">
            <table className="pt-table">
              <caption className="sr-only">
                Terms of the partnership. The offering documents govern in all respects.
              </caption>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k}>
                    <th scope="row">{r.k}</th>
                    <td>{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="t-small mt-8 text-fog">
              Summary only. The offering documents govern in all respects and
              prevail wherever the two disagree.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Reporting. PUBLIC under both regimes: cadence is operational, not an offer.
   Telling a family when the K-1 lands is not soliciting them.
   ------------------------------------------------------------------------ */
function reportingRows() {
  return [
    { k: "NAV frequency", v: fund.reporting.navFrequency },
    { k: "NAV struck by", v: fund.providers.administrator },
    { k: "Estimate", v: fund.reporting.estimateTiming },
    { k: "Final", v: fund.reporting.finalTiming },
    { k: "Letters", v: fund.reporting.letterCadence },
    { k: "Investor calls", v: fund.reporting.investorCallCadence },
    { k: "Audited financials", v: fund.reporting.auditDelivery },
    { k: "K-1 target", v: fund.reporting.k1Target },
  ].filter((r): r is { k: string; v: string } => r.v !== null);
}

const steps = [
  {
    n: "One",
    h: "An introduction",
    p: "Usually from someone who knows both sides. Where there is no introduction, a short note explaining how you came to the firm does the same work.",
  },
  {
    n: "Two",
    h: "A conversation",
    p: "Long, and more about the family's situation than about ours. We are trying to work out whether there is a fit, and so are you. Neither of us can do that from a document.",
  },
  {
    n: "Three",
    h: "Materials, if there is mutual fit",
    p: "Only then, and only if both sides still think the reading is worth it. The offering documents govern everything, and nothing said before them survives them.",
  },
];

export default function Partnership() {
  const alignment = fund.alignment;
  const reporting = reportingRows();

  /* Section ordinals are computed rather than hard-coded, because two sections
     appear and disappear with the config. A page that skips from 02 to 04 is a
     visible hole where a gated section used to be. */
  const terms = regime === "506c" ? termsRows() : [];
  const showTerms = terms.length > 0;

  /* Two sections appear and disappear with the config, so neither the ordinals
     nor the alternating obsidian/abyss grounds can be hard-coded. Hard-coding
     them produced both failure modes at once with all fields null: the page
     skipped from 02 to 04, and Alignment sat directly against "How a
     relationship starts" as one undifferentiated 1,400px slab of abyss. */
  const order = [
    "doors",
    "alignment",
    ...(showTerms ? ["terms"] : []),
    ...(reporting.length ? ["reporting"] : []),
    "start",
  ];
  const at = (key: string) => {
    const i = order.indexOf(key);
    return { ordinal: String(i + 1).padStart(2, "0"), ground: i % 2 ? "bg-abyss" : "" };
  };
  const sTerms = at("terms");
  const sReporting = at("reporting");
  const sStart = at("start");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <PageHeader
        eyebrow="Partnership"
        title="How families work with us."
        standfirst="The firm is built for capital with a long horizon and a small number of relationships. There are three structures a family can hold that capital in. The structure is the choice; the research behind all three is the same."
      />

      {/* ---- 01 · Three doors -------------------------------------------- */}
      <section>
        <Container>
          <div className="pb-16 md:pb-24">
            {/* Closes the page header, the way /firm closes its own. */}
            <div className="grid-gc2 rule-t pt-14 md:pt-16">
              <div className="col-span-4 md:col-span-3">
                <p className="t-mono-xs text-fog">01</p>
                <h2 className="t-h2 mt-3">Three doors</h2>
              </div>
              <div className="col-span-4 md:col-span-8 md:col-start-5">
                <p className="t-lead measure-lead">
                  Direct and co-investment are increasingly where a family office
                  begins rather than where it ends up. All three doors stay open,
                  and none of them is a lesser version of another.
                </p>
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              {doors.map((d) => (
                <article key={d.n} className="pt-door grid-gc2 py-12 md:py-16">
                  <div className="col-span-4 md:col-span-4">
                    <span className={`pt-accent ${d.accent}`} aria-hidden="true" />
                    <h3 className="t-h3 mt-5">{d.name}</h3>
                    <p className="t-mono-xs mt-3 text-fog">{d.kicker}</p>
                  </div>
                  <div className="col-span-4 md:col-span-7 md:col-start-6">
                    {d.body.map((t, i) => (
                      <p key={i} className={`t-body measure-body ${i ? "mt-5" : ""}`}>
                        {t}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <p className="t-small measure-body mt-10 text-fog">
              Which structure suits a family is a function of size, horizon and
              what the family already holds — not of what we would rather sell.
            </p>
          </div>
        </Container>
      </section>

      {/* ---- 02 · Alignment ----------------------------------------------- */}
      <section className="bg-abyss">
        <Container>
          <div className="grid-gc2 py-16 md:py-24">
            <div className="col-span-4 md:col-span-3">
              <p className="t-mono-xs text-fog">02</p>
              <h2 className="t-h2 mt-3">Alignment</h2>
            </div>
            <div className="col-span-4 md:col-span-8 md:col-start-5">
              {/* Principals' own capital renders only when the firm has decided
                  to disclose it AND has supplied the words. Nothing about the
                  principals' money is written on the firm's behalf. */}
              {alignment.gpCommitmentDisclosed && alignment.gpCommitmentText && (
                <p className="t-body measure-body mb-5">{alignment.gpCommitmentText}</p>
              )}

              <p className="t-body measure-body">
                Capacity is a research constraint before it is anything else. We
                establish what a market absorbs, at what participation rate and
                with what slippage, before we establish whether an idea has edge
                worth having — and we size against the market we would face while
                exiting under stress, not the one on the screen on a calm day.
              </p>
              <p className="t-body measure-body mt-5">
                That number is uncomfortably smaller than the screen suggests. It
                is also the only one that has ever mattered, because the day
                capacity is tested is never an average day. It sets how much
                capital the firm can hold, which makes it a policy the firm is
                bound by rather than a line in a pitch.
              </p>

              {alignment.capacityStated && alignment.capacityText && (
                <p className="t-body measure-body mt-5">{alignment.capacityText}</p>
              )}

              <p className="t-body measure-body mt-5">
                The person on the call is the person managing the money. The firm
                was built small and has stayed small; headcount is a constraint we
                chose, and one consequence of choosing it is that there is nobody
                standing between a family and the desk.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- Terms — 506(c) ONLY. Under 506(b) this JSX never executes. ---- */}
      {showTerms && <TermsTable ordinal={sTerms.ordinal} ground={sTerms.ground} rows={terms} />}

      {/* ---- Reporting ----------------------------------------------------- */}
      {reporting.length > 0 && (
        <section className={sReporting.ground}>
          <Container>
            <div className="grid-gc2 py-16 md:py-24">
              <div className="col-span-4 md:col-span-3">
                <p className="t-mono-xs text-fog">{sReporting.ordinal}</p>
                <h2 className="t-h2 mt-3">Reporting</h2>
              </div>
              <div className="col-span-4 md:col-span-8 md:col-start-5">
                <p className="t-lead measure-lead">
                  Cadence is operational, so it is public under any regime. A
                  commitment is only worth making where the interesting case is
                  the one we miss.
                </p>
                <table className="pt-table mt-10">
                  <caption className="sr-only">
                    Reporting cadence: valuation, letters, calls, audited
                    financials and tax documents.
                  </caption>
                  <tbody>
                    {reporting.map((r) => (
                      <tr key={r.k}>
                        <th scope="row">{r.k}</th>
                        <td>{r.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {fund.updatedAt && (
                  <p className="t-small mt-8 text-fog">Last updated {fund.updatedAt}.</p>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ---- How a relationship starts ------------------------------------ */}
      <section className={sStart.ground}>
        <Container>
          <div className="grid-gc2 py-16 md:py-24">
            <div className="col-span-4 md:col-span-3">
              <p className="t-mono-xs text-fog">{sStart.ordinal}</p>
              <h2 className="t-h2 mt-3">How a relationship starts</h2>
            </div>
            <div className="col-span-4 md:col-span-8 md:col-start-5">
              <p className="t-lead measure-lead">
                The partnership relies on Regulation D, Rule 506(b). That rule
                permits the firm to discuss the fund only with people it already
                knows, and it prohibits taking the fund to the public. The
                practical consequence is this sequence, in this order, with no
                shortcut through it.
              </p>

              <div className="mt-10">
                {steps.map((s) => (
                  <div key={s.n} className="pt-step py-7">
                    <p className="t-mono-xs text-fog">{s.n}</p>
                    <h3 className="t-heading-sm mt-2 text-cloud">{s.h}</h3>
                    <p className="t-body measure-body mt-3">{s.p}</p>
                  </div>
                ))}
              </div>

              <a href="/access" className="btn mt-10 min-h-11">
                How to ask for an introduction
              </a>
              <p className="t-small measure-body mt-6 text-fog">
                There is no download on that page and no form on it either. The
                reason it works that way is written out in full when you get
                there. Written enquiries reach us at {site.emails.investors}.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
