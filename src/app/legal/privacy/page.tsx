import type { Metadata } from "next";
import Container from "@/components/Container";
import TextLink from "@/components/TextLink";
import { site } from "@/config/site";
import { fund } from "@/config/fund";
import EditorialHeader from "@/app/legal/_components/EditorialHeader";

/**
 * /legal/privacy — what this website actually does with data.
 *
 * NOT LEGAL ADVICE, AND NOT COUNSEL'S WORK. Privacy counsel signs this off
 * before production. See the closing "Status of this document" band, which is
 * on the page for the reader as well as in the report for the owner.
 *
 * EVERY CLAIM BELOW WAS VERIFIED AGAINST THIS REPOSITORY, not assumed from a
 * template. The verification, so the next person can repeat it:
 *
 *   analytics   grep for gtag / googletagmanager / plausible / fathom /
 *               posthog / mixpanel / segment / hotjar / clarity / sentry /
 *               @vercel/analytics across src/ and package.json -> no hits.
 *   cookies     grep for document.cookie / cookies() / localStorage /
 *               sessionStorage / indexedDB across src/ -> no hits. There is
 *               also no middleware.ts, so nothing sets a cookie on the way out.
 *   forms       grep for <form / <input / <textarea / onSubmit / "use server"
 *               -> the only hits are the comments in /access saying there is
 *               none. Nothing on this site can be submitted.
 *   embeds      grep for <iframe / next/script / <script / src="https ->
 *               no hits.
 *   links out   grep for href="http across src/ -> no hits. The site links
 *               nowhere off its own domain, which is why this policy has no
 *               "third-party links" section. A clause describing traffic that
 *               does not happen is as false as an invented figure.
 *   fonts       next/font/google SELF-HOSTS at build time. Verified in the
 *               build output, not taken on trust: the prerendered HTML
 *               references /_next/static/media/*.woff2, and the only external
 *               hostname anywhere in the prerendered HTML is this site's own
 *               domain. No request reaches a font service.
 *
 * The one thing this page must never become is a SaaS privacy policy about
 * "your account". There are no accounts. Describing collection that does not
 * occur would misrepresent the business to a data subject, which is the same
 * failure as a fabricated number.
 *
 * Nothing is dated here. `fund.updatedAt` is null, so the stamp renders
 * nothing rather than an invented date, exactly as /governance does.
 */

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "This site runs no analytics, sets no cookies of its own and has no form. What that leaves, and what happens to an email you send.",
  robots: { index: true, follow: true },
};

/* Print is a first-class target here: a privacy policy is among the few pages
   on a site anyone actually prints, and this site's ground is near-black.
   Scoped to this route rather than added to globals.css, which this page does
   not own. The footer's nav lists are dropped but its securities disclaimer is
   kept, so the printed sheet still carries it. */
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
  .pv-band { break-inside: avoid; page-break-inside: avoid; }
  .pv-band h2 { margin-top: 14pt; }
}
`;

/* The summary ledger. A real <table> with a visually-hidden caption and
   <th scope="row">, matching the pattern /governance already uses, so the
   two pages read as one site to a screen reader as well as to an eye. */
const collected: { term: string; value: string }[] = [
  {
    term: "Analytics",
    value:
      "None. No analytics or tracking script runs on this site, so no page view, session or visitor is recorded by us.",
  },
  {
    term: "Cookies",
    value:
      "None of ours. This site sets no cookie of its own, which is why there is no banner asking you to accept any.",
  },
  {
    term: "Forms",
    value:
      "None. There is no form and no field on any page, so there is nothing you can submit to us through the site.",
  },
  {
    term: "Accounts",
    value:
      "None. There is nothing to register for, log into, or delete.",
  },
  {
    term: "Embedded content",
    value:
      "None. No third-party video, map, chat widget or social embed loads on any page.",
  },
  {
    term: "Typefaces",
    value:
      "Served from this domain. The fonts are built into the site rather than fetched from a font service, so opening a page sends no request to one.",
  },
];

function Ledger() {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        What this website collects, by category. Every entry is none.
      </caption>
      <thead className="sr-only md:not-sr-only">
        <tr className="block md:table-row">
          <th scope="col" className="t-mono-xs block pb-3 text-left text-ink-3 md:table-cell md:w-1/3 md:pr-6">
            Category
          </th>
          <th scope="col" className="t-mono-xs block pb-3 text-left text-ink-3 md:table-cell">
            What this site does
          </th>
        </tr>
      </thead>
      <tbody>
        {collected.map((r) => (
          <tr key={r.term} className="rule-t block py-5 md:table-row md:py-0">
            <th
              scope="row"
              className="t-body block text-left font-normal text-ink-3 md:table-cell md:w-1/3 md:py-6 md:pr-6 md:align-top"
            >
              {r.term}
            </th>
            <td className="block pt-2 md:table-cell md:py-6 md:align-top">
              <span aria-hidden="true" className="t-mono-xs block text-ink-3 md:hidden">
                What this site does
              </span>
              <span className="t-body block text-ink">{r.value}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type Block = { id: string; title: string; kicker?: string; node: React.ReactNode };

export default function Privacy() {
  const blocks: Block[] = [
    {
      id: "summary",
      title: "What this site collects",
      kicker:
        "The honest answer is nothing, and it is worth being specific about it rather than saying so in one line and moving on.",
      node: (
        <>
          <Ledger />
          <p className="t-body measure-legal mt-8">
            This is a static website. Every page is built in advance and served as
            finished HTML, so there is no database behind it, no session, and no
            profile of you for one to hold. Reading these pages leaves nothing with
            us.
          </p>
        </>
      ),
    },
    {
      id: "email",
      title: "When you email us",
      kicker:
        "This is the only route by which we come to hold anything about you, and you open it deliberately.",
      node: (
        <>
          <p className="t-body measure-legal">
            The addresses on this site are plain email links. They open your own
            mail client, which means nothing is captured at the moment you click —
            the message reaches us only if you write it and send it.
          </p>
          <p className="t-body measure-legal mt-6">
            When you do, we receive what you chose to put in it: your email address,
            your name if you sign it, whatever you tell us, and anything you attach.
            We use it to reply and to work out whether there is a fit. We do not use
            it for anything else, and we do not add you to a list you did not ask to
            be on.
          </p>
          <p className="t-body measure-legal mt-6">
            Enquiries are read by the people who manage the money rather than routed
            through a sales team. Correspondence is kept for as long as there is a
            business reason to keep it, and records connected with the partnership
            are kept for the periods the firm is required to keep them.
          </p>
          <p className="t-body measure-legal mt-6">
            The mail itself is carried and stored by the firm&rsquo;s email provider,
            as every organisation&rsquo;s email is. That provider is not named on this
            page because we would rather name nobody than name the wrong party.
          </p>
        </>
      ),
    },
    {
      id: "logs",
      title: "Server logs",
      kicker: "The one place data exists without you doing anything.",
      node: (
        <>
          <p className="t-body measure-legal">
            Serving a web page requires a server to receive a request, and every
            request carries technical detail with it: the network address it came
            from, the time, the page asked for, and the identifier your browser
            sends about itself. The provider that hosts this site processes those in
            order to deliver pages and to keep the site up and secure. That is true
            of every website, including the ones that tell you they collect nothing.
          </p>
          <p className="t-body measure-legal mt-6">
            We do not combine that technical detail with anything else, we do not use
            it to build a picture of you, and it is not joined to any correspondence
            you send us.
          </p>
        </>
      ),
    },
    {
      id: "never",
      title: "What we do not do",
      node: (
        <>
          <p className="t-body measure-legal">
            We do not sell personal information, and we do not share it for anyone
            else&rsquo;s advertising. There is no advertising on this site and no
            advertising network attached to it.
          </p>
          <p className="t-body measure-legal mt-6">
            We do not profile visitors, and no decision about you is made
            automatically from anything you did on this website — there is no record
            of what you did on this website for such a decision to draw on.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your rights",
      kicker:
        "Which rights you have depends on where you live. The route to exercising them is the same either way.",
      node: (
        <>
          <p className="t-body measure-legal">
            Depending on your jurisdiction, the law may give you the right to ask what
            personal information we hold about you, to have it corrected, to have it
            deleted, to object to how it is used, or to receive a copy. Because the
            site itself collects nothing, in practice the only thing we are likely to
            hold is an exchange of email you started.
          </p>
          <p className="t-body measure-legal mt-6">
            To ask any of that, write to the address below. We will confirm we have
            received it and tell you what we hold or why we cannot act on the request.
          </p>
          <p className="t-body mt-6">
            <TextLink standalone href={`mailto:${site.emails.investors}`}>
              {site.emails.investors}
            </TextLink>
          </p>
        </>
      ),
    },
    {
      id: "scope",
      title: "Who this site is for",
      node: (
        <p className="t-body measure-legal">
          This website is addressed to institutional and professional investors and
          to their advisers. It is not directed to children, and we do not knowingly
          hold personal information belonging to one.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      node: (
        <>
          <p className="t-body measure-legal">
            If what this site does changes, this page changes with it. The version
            published here is the one that applies, and we would rather amend it than
            leave a sentence standing that has stopped being true.
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
          <p className="t-body measure-legal">
            This policy was written to describe what this website actually does, and
            each statement above was checked against the site&rsquo;s own source
            before it was written down. It has not yet been reviewed by privacy
            counsel, and it carries no effective date for that reason.
          </p>
          <p className="t-body measure-legal mt-6">
            Anything concerning the partnership rather than this website — how
            investor information is handled once a relationship exists — is governed
            by the offering documents and the agreements that come with them, not by
            this page.
          </p>
          <p className="t-body measure-legal mt-6">
            For the securities disclaimers that apply to this website, see{" "}
            <TextLink href="/disclosures">Disclosures</TextLink>.
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* The "Last updated" stamp moved here from the "Changes to this
          policy" block above: same fund.updatedAt gate, now the foot line of
          the header instead of a trailing paragraph. */}
      <EditorialHeader
        eyebrow="Legal · Privacy"
        lines={[<><em>Privacy</em>.</>]}
        standfirst="This site runs no analytics, sets no cookies of its own, and has no form on any page. The short version is that reading it leaves nothing with us. The rest of this page is the longer version, including the two places where data does exist."
        caption={fund.updatedAt ? `Effective ${fund.updatedAt}` : undefined}
      />

      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`pv-band scroll-mt-24 ${i % 2 ? "bg-ground-2" : ""}`}>
          <Container>
            <div className={`grid-gc2 py-16 md:py-24 ${i === 0 ? "rule-t" : ""}`}>
              <div className="col-span-4 md:col-span-4">
                <p className="t-mono-xs text-ink-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="t-h2 mt-3">{b.title}</h2>
                {b.kicker && <p className="t-small measure-legal mt-6">{b.kicker}</p>}
              </div>
              <div className="col-span-4 md:col-span-7 md:col-start-6">{b.node}</div>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
