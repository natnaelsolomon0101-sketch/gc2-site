import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { site } from "@/config/site";

/**
 * /legal — the register. It ROUTES, it does not restate.
 *
 * /disclosures already carries the securities disclaimers and predates this
 * section. This page links to it and describes it in one line; it does not
 * reproduce a word of it. Two copies of a disclaimer drift apart, and the one
 * that drifts is the one a reader relies on.
 *
 * Deliberately a different treatment from /legal/terms and /legal/privacy: a
 * hairline register of linked rows rather than the numbered two-column bands
 * those pages use. An index that looks identical to the documents it indexes
 * gives a reader no signal about where they are.
 *
 * NOT LEGAL ADVICE. Counsel reviews the section before production, which the
 * closing band says on the page rather than only in a report.
 */

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Disclosures, terms of use and privacy. Three short documents covering this website, and a note on what governs everything else.",
  robots: { index: true, follow: true },
};

/* Print styles, scoped to this route. Consistent with /legal/terms and
   /legal/privacy: the site's ground is near-black and these pages get printed. */
const CSS = `
@page { margin: 18mm 16mm; }
@media print {
  .sn-header { display: none !important; }
  footer nav { display: none !important; }
  footer { background: transparent !important; border-top: 1px solid #cccccc; }
  html, body { background: #ffffff !important; color: #111111 !important; }
  section { background: transparent !important; }
  .t-h1, .t-h2, .t-h3 { color: #000000 !important; }
  p, li, dd, dt, td, th, span, a { color: #111111 !important; }
  .t-h1 { font-size: 26pt !important; line-height: 1.1 !important; }
  .t-h2 { font-size: 16pt !important; }
  .t-h3 { font-size: 13pt !important; }
  .t-body, .t-small, .t-lead { font-size: 10.5pt !important; line-height: 1.5 !important; }
  .t-mono, .t-mono-xs { font-size: 8pt !important; }
  a, .link { border-bottom: 0 !important; text-decoration: underline !important; }
  .rule-t { border-color: #cccccc !important; }
  .measure-legal, .measure-lead, .measure-head, .measure-prose { max-width: none !important; }
  .grid-gc2 { display: block !important; }
  .section-y { padding-block: 0 12pt !important; }
  .lg-row { break-inside: avoid; page-break-inside: avoid; padding: 10pt 0 !important; }
  .lg-band { break-inside: avoid; page-break-inside: avoid; }
}
.lg-row{ transition: opacity .2s ease; }
@media (hover:hover){ .lg-row:hover .lg-row-title{ opacity:.72; } }
`;

/* `/disclosures` sits outside this directory on purpose: it predates the legal
   section and is linked from the footer in its own right. It is listed first
   because it is the document a visitor is most often sent here to find. */
const documents: { href: string; title: string; blurb: string; note: string }[] = [
  {
    href: "/disclosures",
    title: "Disclosures",
    blurb:
      "The securities disclaimers. That nothing on this website is an offer, how statements about the future should be read, and why no performance figure appears anywhere on it.",
    note: "Published separately, and linked from the footer in its own right.",
  },
  {
    href: "/legal/terms",
    title: "Terms of use",
    blurb:
      "The conditions on which this website is published, and why it has no account, no form and nothing to download.",
    note: "Covers the website only. Not the partnership.",
  },
  {
    href: "/legal/privacy",
    title: "Privacy",
    blurb:
      "What this site collects, which is nothing, and what happens to an email you send us.",
    note: "No analytics, no cookies of ours, no form on any page.",
  },
];

export default function Legal() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <PageHeader
        eyebrow="Legal"
        title="Legal."
        standfirst="Three short documents. Between them they cover this website — what it says, how it may be used, and what it does with data. What governs the partnership is a different thing entirely, and it is not on this website."
      />

      {/* The register. Each row is one link, so the whole row is the target. */}
      <section>
        <Container>
          <div className="pb-16 md:pb-24">
            <p className="t-mono-xs rule-t pt-8 text-fog">The documents</p>
            <ul className="mt-2">
              {documents.map((d, i) => (
                <li key={d.href} className="lg-row rule-t">
                  <Link href={d.href} className="grid-gc2 block py-8 md:grid md:py-10">
                    <div className="col-span-4 md:col-span-4">
                      <p className="t-mono-xs text-fog">{String(i + 1).padStart(2, "0")}</p>
                      <h2 className="lg-row-title t-h3 mt-3 text-pure">{d.title}</h2>
                    </div>
                    <div className="col-span-4 md:col-span-7 md:col-start-6">
                      <p className="t-body measure-legal">{d.blurb}</p>
                      <p className="t-small mt-4 text-fog">{d.note}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Boundary + status. One band, two things a reader needs and would
          otherwise have to infer. */}
      <section className="lg-band bg-abyss">
        <Container>
          <div className="grid-gc2 py-16 md:py-24">
            <div className="col-span-4 md:col-span-4">
              <h2 className="t-h2">What these pages are not</h2>
            </div>
            <div className="col-span-4 md:col-span-7 md:col-start-6">
              <p className="t-body measure-legal">
                These three documents describe a website. None of them describes an
                investment, states a term, or creates an obligation on either side.
                Nothing on this website is an offer to sell or a solicitation of an
                offer to buy any security.
              </p>
              <p className="t-body measure-legal mt-6">
                What governs the partnership is its offering documents. Those
                documents are definitive, they govern in all respects, and where
                anything on this website reads differently from them, they win.
              </p>
              <p className="t-body measure-legal mt-6">
                This section was written to describe {site.name}&rsquo;s website as it
                actually is rather than assembled from a template, and it leaves out
                the clauses a template would supply that are not true of it. It has
                not yet been reviewed by counsel, and it carries no effective date for
                that reason.
              </p>
              <p className="t-body measure-legal mt-6">
                Questions about any of it may be sent to{" "}
                <TextLink href={`mailto:${site.emails.investors}`}>
                  {site.emails.investors}
                </TextLink>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
