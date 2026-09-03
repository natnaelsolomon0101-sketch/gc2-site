import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { site } from "@/config/site";
import { fund } from "@/config/fund";

/**
 * /legal/terms — the terms on which this WEBSITE is published.
 *
 * NOT LEGAL ADVICE, AND NOT COUNSEL'S WORK. Securities counsel signs this off
 * before production. Said on the page too, in the closing band.
 *
 * Scope discipline, which is the whole design of this page: these terms govern
 * a static marketing website and nothing else. They do not govern the
 * partnership, they do not describe an investment, and they do not restate the
 * securities disclaimers — /disclosures already carries those, and a second
 * copy that drifts out of step with the first is worse than no copy.
 *
 * WHAT IS DELIBERATELY ABSENT, because it is not true of this site:
 *
 *   - No "user accounts", "registration", "your password", "termination of
 *     your account". There is no account and nothing to register for.
 *   - No "user-generated content" or "acceptable use" clause. Nothing on this
 *     site accepts input: grep for <form / <input / "use server" across src/
 *     returns only the comments in /access saying there is none.
 *   - No "third-party links" clause. grep for href="http across src/ returns
 *     nothing; the site links nowhere off its own domain.
 *   - No governing-law and jurisdiction clause. fund.entities.jurisdiction is
 *     null. Naming a state or a court would be an invention, and an invented
 *     forum clause is worse than an absent one because a reader would rely on
 *     it. Counsel supplies this; it is flagged as the largest single gap.
 *   - No effective date. fund.updatedAt is null, so the stamp renders nothing
 *     rather than a date nobody can source, as on /governance.
 */

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms on which this website is published. They govern the website only; the offering documents govern everything else.",
  robots: { index: true, follow: true },
};

/* Print styles, scoped to this route. See /legal/privacy for the reasoning:
   these are the pages people print, and the site's ground is near-black. */
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
  .measure-body, .measure-lead, .measure-head, .measure-prose { max-width: none !important; }
  .grid-gc2 { display: block !important; }
  .section-y { padding-block: 0 12pt !important; }
  .tm-band { break-inside: avoid; page-break-inside: avoid; }
  .tm-band h2 { margin-top: 14pt; }
}
`;

type Block = { id: string; title: string; kicker?: string; node: React.ReactNode };

export default function Terms() {
  const blocks: Block[] = [
    {
      id: "scope",
      title: "What these terms cover",
      kicker:
        "A short scope, and it is the most important sentence on the page.",
      node: (
        <>
          <p className="t-body measure-body">
            These terms apply to this website and to nothing else. They are the
            conditions on which {site.name} publishes these pages and on which you
            read them.
          </p>
          <p className="t-body measure-body mt-6">
            They do not govern the partnership, they do not describe its terms, and
            they are not part of any agreement between you and the firm. Anything
            concerning the partnership itself is governed by its offering documents,
            and those documents govern in all respects.
          </p>
          <p className="t-body measure-body mt-6">
            The securities disclaimers that apply to this website — the absence of
            any offer, the treatment of forward-looking statements, the absence of
            performance information — are set out at{" "}
            <TextLink href="/disclosures">Disclosures</TextLink> and are not repeated
            here.
          </p>
        </>
      ),
    },
    {
      id: "informational",
      title: "This website is informational",
      node: (
        <>
          <p className="t-body measure-body">
            The contents of these pages are general in nature. They are not advice of
            any kind, they are not tailored to your circumstances, and they are not a
            recommendation to do anything.
          </p>
          <p className="t-body measure-body mt-6">
            What is written here reflects the firm&rsquo;s position at the time of
            writing. Pages may be changed, corrected or withdrawn at any time without
            notice, and we give no undertaking to keep any particular page current.
          </p>
        </>
      ),
    },
    {
      id: "nothing-to-join",
      title: "There is nothing here to sign up for",
      kicker:
        "Worth stating as a term, because on most sites in this industry it would not be true.",
      node: (
        <>
          <p className="t-body measure-body">
            This site has no account, no login, no form and no download. There is
            nothing you can submit and nothing you can register for. Reading these
            pages creates no relationship between you and the firm, and no obligation
            on either side.
          </p>
          <p className="t-body measure-body mt-6">
            That is deliberate rather than unfinished. The reasoning is set out at{" "}
            <TextLink href="/access">Access to materials</TextLink>.
          </p>
          <p className="t-body measure-body mt-6">
            Sending us an email does not change it either. Correspondence is
            correspondence; it establishes nothing on its own, and eligibility is
            established through the offering documents rather than through anything
            that happens on a website.
          </p>
        </>
      ),
    },
    {
      id: "ownership",
      title: "Ownership of the content",
      node: (
        <>
          <p className="t-body measure-body">
            The text, design, images and code of this site belong to the firm or to
            the parties that licensed them to it. The firm&rsquo;s name and mark are
            its own.
          </p>
          <p className="t-body measure-body mt-6">
            You may read these pages, print them, and keep a copy for your own
            reference or for your professional advisers. You may quote briefly from
            them with attribution. Please do not republish a page wholesale, present
            this material as your own, or use the firm&rsquo;s name or mark in a way
            that suggests an association or an endorsement that does not exist.
          </p>
        </>
      ),
    },
    {
      id: "accuracy",
      title: "Accuracy and availability",
      kicker:
        "The clause every site has. Written plainly here rather than in the usual block of capitals.",
      node: (
        <>
          <p className="t-body measure-body">
            This site is prepared with care, but it is provided as it stands. We do
            not promise that it is free of error or omission, that it will always be
            reachable, or that it is complete or current at the moment you read it.
          </p>
          <p className="t-body measure-body mt-6">
            To the extent the law allows, the firm is not liable for loss arising from
            reliance on this website or from an inability to reach it. Nothing here
            limits any liability that cannot lawfully be limited, and nothing here
            affects rights you have under the offering documents if you are an
            investor in the partnership.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Questions about this website",
      node: (
        <>
          <p className="t-body measure-body">
            Questions about these terms, or about anything published here, may be sent
            to:
          </p>
          <p className="t-body mt-4">
            <TextLink standalone href={`mailto:${site.emails.investors}`}>
              {site.emails.investors}
            </TextLink>
          </p>
          <p className="t-body measure-body mt-6">
            The firm is based in {site.city}.
          </p>
        </>
      ),
    },
    {
      id: "status",
      title: "Status of this document",
      kicker: "Said here rather than only in an internal note, because a reader is entitled to know.",
      node: (
        <>
          <p className="t-body measure-body">
            These terms were written to describe this website as it actually is, and
            they leave out the clauses that a template would supply but that would not
            be true of it. They have not yet been reviewed by counsel.
          </p>
          <p className="t-body measure-body mt-6">
            They do not yet state a governing law or a forum for disputes. That is an
            omission rather than a position: the firm&rsquo;s entities and their
            jurisdictions are not published, and naming one here without a source
            would be inventing it.
          </p>
          {fund.updatedAt && (
            <p className="t-mono-xs mt-6 text-fog">Last updated {fund.updatedAt}</p>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <PageHeader
        eyebrow="Legal · Terms of use"
        title="Terms of use."
        standfirst="These terms cover this website and nothing else. They are short because the site is small: there is no account to hold, nothing to submit, and nothing to buy. The offering documents govern everything that matters beyond it."
      />

      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`tm-band scroll-mt-24 ${i % 2 ? "bg-abyss" : ""}`}>
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
    </>
  );
}
