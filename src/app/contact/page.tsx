import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import RevealLines from "@/components/ui/RevealLines";
import { css } from "@/lib/css";
import { site, siteUrl } from "@/config/site";

/* Section frame, matching /firm and /team (sec-firm owns all three): a
   block becomes a frame — min-height 80vh at lg+, copy at the optical
   centre, an iris-haze wash, a foot caption of the same standing facts the
   home hero closes on. Phones keep natural height. */
const CSS = css`
.cn-frame{position:relative;isolation:isolate;overflow:hidden;
  display:flex;flex-direction:column;padding-block:16px;}
.cn-wash{position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(55% 60% at 92% 12%, rgba(209,201,255,.16) 0%, rgba(209,201,255,.05) 45%, transparent 75%);}
.cn-content{position:relative;z-index:1;flex:1;display:flex;align-items:center;}
.cn-content > .grid-gc2{width:100%;}
.cn-foot{position:relative;z-index:1;margin-top:40px;}
@media (min-width:1024px){ .cn-frame{min-height:80vh;padding-block:24px;} }
.cn-fact{padding:20px 22px;}
.cn-content h2 em{font-style:italic;color:var(--color-accent-deep-iris);}
`;

const standingFacts = `${site.city} · ${site.structure} · ${site.mandate}`;

export const metadata: Metadata = {
  title: "Contact",
  // Trimmed to clear the 155-char description gate (round 4 search pass);
  // the dropped clause ("and what each can and cannot do") is still true of
  // the page, just not restated in the meta description.
  description:
    "Two published addresses and no form. Which one to use if you are an allocator, an existing investor, a journalist, or a counterparty.",
};

/* Organization JSON-LD, round 4 (search): contactPoint per published
   address, email only. contactType is lifted verbatim from the block title
   each address actually sits under below ("Existing investors", "Press"),
   not invented — the "Allocators and prospective investors" block links to
   /access instead of publishing an address, so it contributes no
   contactPoint. No telephone (`site.phone` is null) and no address
   (`site.address` is null): both fields are simply absent, the same "a null
   field renders nothing" rule the page itself follows. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.mark,
  url: siteUrl,
  contactPoint: [
    { "@type": "ContactPoint", email: site.emails.investors, contactType: "Existing investors" },
    { "@type": "ContactPoint", email: site.emails.press, contactType: "Press" },
  ],
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
        <div className="mt-8">
          <Tilt max={4} as="div">
            <Glass as="div" radius={18} className="cn-fact">
              <p className="t-mono-xs text-ink-3">Existing investors</p>
              <p className="t-heading-sm mt-2">
                <TextLink standalone href={`mailto:${site.emails.investors}`}>
                  <span className="break-all">{site.emails.investors}</span>
                </TextLink>
              </p>
            </Glass>
          </Tilt>
        </div>
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
        <div className="mt-8">
          <Tilt max={4} as="div">
            <Glass as="div" radius={18} className="cn-fact">
              <p className="t-mono-xs text-ink-3">Press</p>
              <p className="t-heading-sm mt-2">
                <TextLink standalone href={`mailto:${site.emails.press}`}>
                  <span className="break-all">{site.emails.press}</span>
                </TextLink>
              </p>
            </Glass>
          </Tilt>
        </div>
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

/* On a phone the investors mailto lives inside the second block, after three
   paragraphs — past the first screen on a 320 or 393 viewport, and on a
   landscape phone past the first screen even sooner, since there is less
   height and PageHeader's own standfirst sits between the h1 and this link.
   Passed to PageHeader as `quickLink` (round 3, thumb-critic) rather than
   rendered as this page's own section: (1) that puts it inside PageHeader's
   Container, so its own `rule-t` reads as the SAME inset hairline as every
   other divider on this page — as its own full-bleed section it was a
   different rule treatment 200px from the inset one under the first block's
   heading; (2) it lets PageHeader reorder it ahead of the standfirst on a
   landscape phone via `order`, which is the only way to actually put it
   "before the intro paragraph" there rather than just near it. This repeats
   nothing but that block's own title and address (no new copy). */
const investorsQuickLink = (
  <Tilt max={4} as="div">
    <Glass as="div" radius={18} className="cn-fact">
      <a
        href={`mailto:${site.emails.investors}`}
        className="flex min-h-11 flex-col gap-2"
      >
        <span className="t-mono-xs text-ink-3">Existing investors</span>
        <span className="t-h3 break-all text-ink">{site.emails.investors}</span>
      </a>
    </Glass>
  </Tilt>
);

export default function Contact() {
  return (
    <>
      <style>{CSS}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Contact"
        title="Where to write."
        standfirst="Four kinds of correspondence reach this firm and they do not want the same answer. There are two published addresses, no form, and no queue you can join. This page says which address applies to you, and what it can and cannot do."
        quickLink={investorsQuickLink}
      />

      {/* Bands alternate ground / ground-2 to match /firm and /diligence, so an
          inner page reads as the same site — and (light canvas) every band
          also gets its own top hairline, not only the first: the 1.10
          ground->ground-2 step does not read as a boundary on its own. The
          "01/02/03/04" ordinal that shipped here read as a sequence; these
          are four audiences, not four steps, and the preamble's numerals
          rule ("no numerals on things that are not sequences") applies —
          removed. Heading ink 17.04:1 / 15.47:1, body ink-2 7.55:1 / 6.85:1. */}
      {blocks.map((b, i) => {
        const words = b.title.split(" ");
        return (
        <section key={b.id} id={b.id} className={`cn-frame scroll-mt-24 ${i % 2 ? "bg-ground-2" : ""}`}>
          <div className="cn-wash" aria-hidden="true" />
          <Container className="cn-content">
            <div className="grid-gc2 rule-t">
              <div className="col-span-4 md:col-span-4">
                <RevealLines
                  as="h2"
                  className="t-h2"
                  lines={[
                    <>
                      {words.slice(0, -1).join(" ")}
                      {words.length > 1 ? " " : ""}
                      <em>{words[words.length - 1]}</em>
                    </>,
                  ]}
                />
              </div>
              <div className="col-span-4 md:col-span-7 md:col-start-6">{b.node}</div>
            </div>
          </Container>
          <Container>
            <p className="t-caption text-ink-3 cn-foot">{standingFacts}</p>
          </Container>
        </section>
        );
      })}

      {/* Closing strip. Not a third mailto ledger — the addresses are already
          linked in the two blocks that own them. This is the inventory: what
          exists, stated once, so an address arriving from somewhere else can be
          checked against it. `site.address` and `site.phone` are null and are
          deliberately absent rather than substituted for. Alternation continues
          off blocks.length: four blocks end on ground-2, so this lands on
          ground. Rendered as one <Glass> fact pane (TRANSFORM.md rule 4): the
          whole strip states facts and nothing else. */}
      <section className={`cn-frame ${blocks.length % 2 ? "bg-ground-2" : ""}`}>
        <div className="cn-wash" aria-hidden="true" />
        <Container className="cn-content">
          <div className="w-full">
            <Tilt max={3} as="div">
              <Glass as="div" radius={20} className="cn-fact">
                <p className="t-mono-xs text-ink-3">The published addresses</p>
                <p className="t-body measure-body mt-6">
                  Two, and there is not a third: {site.emails.investors} and{" "}
                  {site.emails.press}. No telephone line is published on this site,
                  there is no form on any page of it, and there is no portal behind
                  any of it. Anything presenting itself as another route into the
                  firm did not come from here.
                </p>
              </Glass>
            </Tilt>
          </div>
        </Container>
      </section>
    </>
  );
}
