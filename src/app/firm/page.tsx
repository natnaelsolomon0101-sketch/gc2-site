import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import RevealLines from "@/components/ui/RevealLines";
import { css } from "@/lib/css";
import { fund } from "@/config/fund";
import { site, siteUrl } from "@/config/site";

/* Section frame (TRANSFORM.md rule 1 / rule 3 / rule 6): a section becomes a
   frame — min-height 80vh at lg+ with its content at the optical centre, an
   iris-haze wash under it, and one `.t-caption` foot line carrying the same
   standing facts HeroV2's own foot carries (`site.city` / `site.structure`
   / `site.mandate` — nothing invented, nothing this page did not already
   have a source for). Phones keep natural height per the rule; the frame is
   a flex column so the foot sits at the frame's own bottom rather than
   immediately under the last paragraph, without needing a second flex
   parent per section. */
const CSS = css`
.firm-frame{position:relative;isolation:isolate;overflow:hidden;
  display:flex;flex-direction:column;padding-block:16px;}
.firm-wash{position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(55% 60% at 92% 12%, rgba(209,201,255,.16) 0%, rgba(209,201,255,.05) 45%, transparent 75%);}
.firm-content{position:relative;z-index:1;flex:1;display:flex;align-items:center;}
.firm-content > .grid-gc2{width:100%;}
.firm-foot{position:relative;z-index:1;margin-top:40px;}
@media (min-width:1024px){ .firm-frame{min-height:80vh;padding-block:24px;} }
.firm-fact{padding:22px 24px;}
.firm-content h2 em{font-style:italic;color:var(--color-accent-deep-iris);}
`;

const standingFacts = `${site.city} · ${site.structure} · ${site.mandate}`;

export const metadata: Metadata = {
  title: "The firm",
  description: "A research house that trades. How we work, how we govern risk, and where we are.",
};

/* AboutPage / Organization JSON-LD, round 4 (search): foundingDate from
   `site.foundedISO`, foundingLocation from `site.city`'s "Miami". Nothing
   else: no `founder`/`employee` — `fund.people` is null, and putting a
   person in structured data the visible page won't name would be the exact
   failure /team's own copy exists to refuse. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    alternateName: site.mark,
    url: siteUrl,
    foundingDate: site.foundedISO,
    foundingLocation: { "@type": "Place", name: "Miami" },
  },
};

/* ------------------------------------------------------------ key person ----
   `fund.people` is null, so nobody is named — not a founder, not a role holder,
   not a count. The existing Origins copy says the firm was built small and that
   headcount is a constraint it chose; that is the only source, and it is not a
   number, so nothing here turns it into one.

   The band itself is STRUCTURE and renders today: what key-person risk is for a
   firm this size, what the firm has already done about it, and what an
   allocator should ask. /governance carries the mechanics of the day it
   happens — authority, notification, the order of operations — so this band
   points there rather than restating it.

   The named-seat list is gated the way /diligence gates its provider table:
   the rows are derived from `fund`, and when there are none the block is not
   pushed into the band at all. No placeholder, no greyed row, no "TBD". The
   band's ordinal comes from the rendered section index either way, so a
   populated `fund.people` adds a list and never a number. */
const people = fund.people ?? [];

/* Each named seat is a fact, so it renders as a <Glass> pane that tilts
   (TRANSFORM.md rule 4), one per named person, inside a `<dl>` — HTML5
   permits a `<div>` wrapping one dt/dd group inside a `<dl>`, so the
   semantics survive the glass treatment. */
const seats =
  people.length > 0 ? (
    <dl className="mt-10 grid gap-5 sm:grid-cols-2">
      {people.map((p) => (
        <Tilt key={p.name} max={5} as="div">
          <Glass as="div" radius={18} className="firm-fact">
            <dt className="t-mono-xs text-ink-3">{p.role}</dt>
            <dd className="t-h3 mt-2">{p.name}</dd>
            <dd className="t-body measure-body mt-3">{p.bio}</dd>
            {p.priorFirms.length > 0 && (
              <dd className="t-small mt-3 text-ink-3">Previously {p.priorFirms.join(", ")}</dd>
            )}
          </Glass>
        </Tilt>
      ))}
    </dl>
  ) : null;

type Section = { h: string; p: string[]; node?: React.ReactNode };

const sections: Section[] = [
  { h: "Origins", p: [
    `${site.name} was founded in ${site.foundedLabel} in ${site.city} on a narrow premise: durable returns in liquid markets come from process, not prediction.`,
    "The firm was built small and has stayed small. Headcount is a constraint we chose, because every position has to be defensible by the person who owns it.",
  ]},
  { h: "How we work", p: [
    "We build our own data and write our own models. An idea earns capital only after adversarial review, where the desk argues the other side in good faith.",
    "Every position has a named owner who defends it in front of the desk. There is no house view that overrides the person carrying the risk.",
    "We size to survive the tail, not to flatter the mean. A book that cannot hold through a drawdown it did not cause is mis-sized, whatever the case for it.",
  ]},
  { h: "Governance", p: [
    "The Investment Committee sets mandate and limits. It does not pick trades.",
    "Risk runs independently of the desk and can cut any position. That authority is not advisory and does not require the desk to agree.",
    "The tail overlay is permanent, not discretionary. It is never switched off to improve a quarter.",
  ]},
  { h: "Key-person risk", p: [
    "A firm this small concentrates judgement, not only signatures. The exposure worth pricing is not that somebody cannot approve a ticket on a given morning; it is that the reasoning behind a position lives in one head and could leave with it.",
    "So the method is written rather than remembered. The data is ours and the models are ours, which means they can be read, argued with and run by someone who did not build them. A position is owned by a named person precisely so its reasoning has to survive the desk before it gets capital, and the tail overlay is permanent so the book's worst case never depends on anyone being at a screen to defend it.",
    "None of that makes the exposure disappear, and we would rather say so than dress it. Staying small is a choice, and this is what the choice costs: someone who can run the book is not the same as someone who would run it the same way. An allocator should price that instead of being reassured out of asking about it.",
    "The useful questions are the specific ones. Which decisions stop when a particular person is unavailable, and which carry on. Whether the models and the data behind them can be run by someone who did not write them. Whether the answer is different for a week away and a permanent departure. What the fund documents, rather than a public page, commit the manager to.",
    "Ask the administrator and the brokers to confirm the operational half of any answer instead of taking it from us. What happens on the day itself — who holds authority, who is told, and in what order — is set out under governance.",
  ],
    node: (
      <>
        {seats}
        <p className="t-body mt-6">
          <TextLink standalone href="/governance#key-person">
            Key person and continuity
          </TextLink>
        </p>
      </>
    ),
  },
  { h: "Where we are", p: [
    `${site.city}.`,
  ]},
];

export default function Firm() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="The firm"
        title="A research house that trades."
        standfirst="We are a small partnership. The work is research; trading is how the research is expressed."
        caption={`The firm was formed in ${site.foundedLabel}. What is described here is the policy the firm operates under, not a record of periods it has run.`}
      />
      <style>{CSS}</style>
      {/* Bands alternate ground / ground-2 rather than every section sitting on
          one flat ground, so the page has rhythm the way the home page does.
          On the light canvas the ground->ground-2 step is 1.10 — DESIGN.md:
          "bands read as bands only with a hairline or a real tonal step" — so
          the step alone is not enough; every band now also gets its own
          top hairline (previously only the first one did, closing the page
          header, on the dark build's theory that a colour change was rule
          enough on its own). Heading ink 17.04:1 (ground) / 15.47:1
          (ground-2); body ink-2 7.55:1 / 6.85:1; ordinal ink-3 5.61:1 / 5.09:1.

          Each band is now also a FRAME (TRANSFORM.md rule 1): 80vh at lg+
          with the copy at the optical centre, an iris-haze wash, and a foot
          caption of the same standing facts the home hero closes on. */}
      {sections.map((s, si) => {
        const words = s.h.split(" ");
        return (
        <section key={s.h} className={`firm-frame ${si % 2 ? "bg-ground-2" : ""}`}>
          <div className="firm-wash" aria-hidden="true" />
          <Container className="firm-content">
            <div className="grid-gc2 rule-t">
              {/* h2 left / prose right is a 5/7 split of the 12-col grid, but
                  only at ≥1024: `grid-gc2` is already 12 columns at ≥768, so
                  without the `md:col-span-12` bridge this pair would go
                  side-by-side at tablet width too, which the spec reserves
                  for ≥1024. `break-after-avoid` keeps the h2 from ever being
                  the last line visible on a screen with none of its prose. */}
              <div className="col-span-4 md:col-span-12 lg:col-span-5 break-after-avoid">
                <p className="t-mono-xs text-ink-3">{String(si + 1).padStart(2, "0")}</p>
                <RevealLines
                  as="h2"
                  className="t-h2 mt-3"
                  lines={[
                    <>
                      {words.slice(0, -1).join(" ")}
                      {words.length > 1 ? " " : ""}
                      <em>{words[words.length - 1]}</em>
                    </>,
                  ]}
                />
              </div>
              <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
                {s.p.map((t, i) => (
                  <p key={i} className={`t-body measure-body ${i ? "mt-6" : ""}`}>{t}</p>
                ))}
                {s.node}
                {s.h === "Where we are" && site.address && (
                  <p className="t-body measure-body mt-6">{site.address}</p>
                )}
              </div>
            </div>
          </Container>
          <Container>
            <p className="t-caption text-ink-3 firm-foot">{standingFacts}</p>
          </Container>
        </section>
        );
      })}
    </>
  );
}
