import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Two published addresses and no form. Which one to use if you are an allocator, an existing investor, a journalist, or a counterparty — and what each can and cannot do.",
};

/* =============================================================================
   /contact — four readers, four different answers.

   THIS IS NOT THE HOME BAND. `src/components/sections/ContactBand.tsx` is the
   closing band on `/`: an ask plus a two-row mailto ledger. Duplicating it here
   would make the page a larger version of something the reader has already
   scrolled past. This page does the thing the band structurally cannot — it
   sorts the reader first and answers each kind separately.

   THE ONLY TWO ADDRESSES THAT EXIST are `site.emails.investors` and
   `site.emails.press`. There is no careers@, ops@, ir@, info@ or hello@, and
   there is no third address waiting to be added. Where an audience has no
   dedicated channel this page says so in words, the way /diligence declines to
   point an ODD address at a mailbox nobody staffs. Inventing one would be the
   same failure as inventing an administrator on /diligence.

   `site.address` and `site.phone` are null. They render NOTHING here — not a
   placeholder, not “by appointment”, not a map. The previous version of this
   file fell back to `site.address ?? site.city` under a heading reading
   “Office”, which presented a city as a street address. A city is not an
   office. This page renders no location line at all; the home band already
   carries the city, correctly labelled and not standing in for an address.

   506(b): this is the page most likely to drift into an invitation, because
   every contact page ever written wants to end with one. Nothing here may read
   as an offer, an invitation, or an inducement to invest — no “get in touch to
   learn more”, no “introductions welcome”, no turnaround promise, no capacity
   language. `scripts/qa/regime.ts` scans rendered textContent across this
   route. It is a word list, so it will not catch tone; the tone is on us.

   NO <form>, NO <input>, NO <button>, NO checkbox, NO select, NO textarea.
   /access states the reason at length and this page must not contradict it by
   quietly offering the shortcut that page refuses.
   ========================================================================== */

type Block = { id: string; title: string; node: React.ReactNode };

const blocks: Block[] = [
  {
    id: "allocators",
    title: "Allocators and prospective investors",
    node: (
      <>
        <p className="t-body measure-body">
          The page to read first is Access, not this one. It explains why there
          is nothing on this site to download and no form to complete: the
          partnership relies on Regulation D, Rule 506(b), and under that rule
          the relationship has to exist before the conversation about the fund
          does. A website cannot manufacture one. A box you tick asserting your
          own eligibility manufactures even less.
        </p>
        <p className="t-body measure-body mt-6">
          That page also sets out what a first note usefully contains, and what
          happens after one arrives. Both are worth reading before writing,
          because a note sent without them is answered with a link to them.
        </p>
        <p className="t-body measure-body mt-6">
          The address for this is the one Access gives, and it is the only one
          for it. We are not going to tell you how long a reply takes. Any
          figure published here would be one we could keep in a quiet month and
          not in a busy one, which makes it a decoration rather than a
          commitment.
        </p>
        <p className="t-body mt-8">
          <TextLink standalone href="/access">
            Access to materials
          </TextLink>
        </p>
      </>
    ),
  },
  {
    id: "existing-investors",
    title: "Existing investors",
    node: (
      <>
        <p className="t-body measure-body">
          Use the person you already deal with, and the address on your own
          documents. That relationship exists and is the channel; a public page
          is not a substitute for it and is not trying to be.
        </p>
        <p className="t-body measure-body mt-6">
          Plainly, then, what this page cannot do for you: there is no login on
          this site, no statement retrieval, no document store, and no mechanism
          anywhere on it for establishing who you are. Anything specific to your
          position in the partnership — capital instructions above all — belongs
          where both sides can verify each other, which a mailbox readable by
          anyone who can read a website is not.
        </p>
        <p className="t-body measure-body mt-6">
          If you have lost the thread altogether, the investor address below
          will put you back in touch with the right person. It will do that and
          nothing else, and it confirms nothing on its own: instructions about
          money that arrive by email deserve a call to somebody you already know
          before anyone acts on them. That is true of every firm, and it is true
          of this one.
        </p>
        <p className="t-body mt-8">
          <TextLink standalone href={`mailto:${site.emails.investors}`}>
            <span className="break-all">{site.emails.investors}</span>
          </TextLink>
        </p>
      </>
    ),
  },
  {
    id: "press",
    title: "Press",
    node: (
      <>
        <p className="t-body measure-body">
          There is a published address for this and it is read by the same small
          group that reads everything else.
        </p>
        <p className="t-body measure-body mt-6">
          What it can settle: the spelling and form of the firm’s name, the shape
          of the structure, the year it began, and the correction of something
          already in print that is wrong. What it will not discuss is positions,
          what the partnership holds or has held, or figures of any kind. That is
          not media strategy. A partnership relying on 506(b) does not discuss
          those things in public, and a journalist is a member of the public in
          exactly the sense the rule means.
        </p>
        <p className="t-body measure-body mt-6">
          There is no press office, no media kit, and no spokesperson to name.
          Naming one would be the first invented fact on a site built to avoid
          them.
        </p>
        <p className="t-body mt-8">
          <TextLink standalone href={`mailto:${site.emails.press}`}>
            <span className="break-all">{site.emails.press}</span>
          </TextLink>
        </p>
      </>
    ),
  },
  {
    id: "counterparties",
    title: "Service providers and counterparties",
    node: (
      <>
        <p className="t-body measure-body">
          Administrators, auditors, brokers, exchanges, counsel — anyone with an
          operational reason to reach the firm rather than a commercial one.
          There is no third address for you. Use the investor address and say in
          the subject line what the mail actually is, so it is read as
          operational and not sorted behind an allocator queue it does not
          belong in.
        </p>
        <p className="t-body measure-body mt-6">
          That is a workaround, and it is worth naming as one rather than
          dressing it up. Diligence declines to publish a dedicated operational
          due diligence address on the grounds that pointing one at a mailbox
          nobody is staffed to watch is worse than saying there isn’t one yet.
          The same reasoning holds here. Two addresses exist, both reach the same
          people, and a third minted for the look of the thing would be a sign
          rather than a door.
        </p>
        <p className="t-body measure-body mt-6">
          Unsolicited vendor and recruiter mail sent to either address is not
          answered, and there is no separate channel for it. Saying so is more
          use to you than silence, which reads identically from the outside and
          costs you a follow-up to find out.
        </p>
        <p className="t-body mt-8">
          <TextLink standalone href="/diligence">
            Diligence
          </TextLink>
        </p>
      </>
    ),
  },
];

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Where to write."
        standfirst="Four kinds of correspondence reach this firm and they do not want the same answer. There are two published addresses, no form, and no queue you can join. This page says which address applies to you, and what it can and cannot do."
      />

      {/* On a phone the investors mailto lives inside the second block, after
          three paragraphs — past the first screen on a 320 or 393 viewport.
          This repeats nothing but that block's own title and address (no new
          copy) as a single tap-to-mail row directly under the header, so the
          address itself is always visible without scrolling and is reachable
          before the reader has to sort themselves into an audience. */}
      <section className="rule-t">
        <Container>
          <a
            href={`mailto:${site.emails.investors}`}
            className="flex min-h-11 flex-col gap-2 py-5"
          >
            <span className="t-mono-xs text-fog">Existing investors</span>
            <span className="t-h3 break-all text-pure">{site.emails.investors}</span>
          </a>
        </Container>
      </section>

      {/* Bands alternate obsidian / abyss to match /firm and /diligence, so an
          inner page reads as the same site. The "01/02/03/04" ordinal that
          shipped here read as a sequence; these are four audiences, not four
          steps, and the preamble's numerals rule ("no numerals on things that
          are not sequences") applies — removed. Heading pure 19.05:1 /
          19.81:1, body ash 7.20:1 / 7.49:1. */}
      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`scroll-mt-24 ${i % 2 ? "bg-abyss" : ""}`}>
          <Container>
            <div className={`grid-gc2 py-16 md:py-24 ${i === 0 ? "rule-t" : ""}`}>
              <div className="col-span-4 md:col-span-4">
                <h2 className="t-h2">{b.title}</h2>
              </div>
              <div className="col-span-4 md:col-span-7 md:col-start-6">{b.node}</div>
            </div>
          </Container>
        </section>
      ))}

      {/* Closing strip. Not a third mailto ledger — the addresses are already
          linked in the two blocks that own them. This is the inventory: what
          exists, stated once, so an address arriving from somewhere else can be
          checked against it. `site.address` and `site.phone` are null and are
          deliberately absent rather than substituted for. Alternation continues
          off blocks.length: four blocks end on abyss, so this lands on
          obsidian. */}
      <section className={blocks.length % 2 ? "bg-abyss" : ""}>
        <Container>
          <div className="rule-t py-16 md:py-24">
            <p className="t-mono-xs text-fog">The published addresses</p>
            <p className="t-body measure-body mt-6">
              Two, and there is not a third: {site.emails.investors} and{" "}
              {site.emails.press}. No telephone line is published on this site,
              there is no form on any page of it, and there is no portal behind
              any of it. Anything presenting itself as another route into the
              firm did not come from here.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
