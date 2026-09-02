import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { fund } from "@/config/fund";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "The firm",
  description: "A research house that trades. How we work, how we govern risk, and where we are.",
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

const seats =
  people.length > 0 ? (
    <dl className="mt-10">
      {people.map((p) => (
        <div key={p.name} className="rule-t py-8">
          <dt className="t-mono-xs text-fog">{p.role}</dt>
          <dd className="t-h3 mt-2">{p.name}</dd>
          <dd className="t-body measure-body mt-3">{p.bio}</dd>
          {p.priorFirms.length > 0 && (
            <dd className="t-small mt-3 text-fog">Previously {p.priorFirms.join(", ")}</dd>
          )}
        </div>
      ))}
    </dl>
  ) : null;

type Section = { h: string; p: string[]; node?: React.ReactNode };

const sections: Section[] = [
  { h: "Origins", p: [
    `${site.name} was founded in ${site.founded} in ${site.city} on a narrow premise: durable returns in liquid markets come from process, not prediction.`,
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
      <PageHeader
        eyebrow="The firm"
        title="A research house that trades."
        standfirst="We are a small partnership. The work is research; trading is how the research is expressed."
      />
      {/* Bands alternate obsidian / abyss rather than every section sitting on
          one flat ground, so the page has rhythm the way the home page does.
          The hairline only closes the page header — once the ground itself
          changes between sections, a rule as well is noise.
          Heading pure 19.05:1 (obsidian) / 19.81:1 (abyss); body ash 7.20:1 /
          7.49:1; ordinal fog 4.61:1 / 4.80:1. */}
      {sections.map((s, si) => (
        <section key={s.h} className={si % 2 ? "bg-abyss" : ""}>
          <Container>
            <div className={`grid-gc2 py-16 md:py-24 ${si === 0 ? "rule-t" : ""}`}>
              <div className="col-span-4 md:col-span-5">
                <p className="t-mono-xs text-fog">{String(si + 1).padStart(2, "0")}</p>
                <h2 className="t-h2 mt-3">{s.h}</h2>
              </div>
              <div className="col-span-4 md:col-span-6 md:col-start-7">
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
        </section>
      ))}
    </>
  );
}
