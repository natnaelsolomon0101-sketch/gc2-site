import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "The firm",
  description: "A research house that trades. How we work, how we govern risk, and where we are.",
};

const sections = [
  { h: "Origins", p: [
    `${site.name} was founded in ${site.founded} in ${site.city} on a narrow premise: durable returns in liquid markets come from process, not prediction.`,
    "The firm was built small and has stayed small. Headcount is a constraint we chose, because every position has to be defensible by the person who owns it.",
  ]},
  { h: "How we work", p: [
    "Data and models are built in house. An idea earns capital only after adversarial review, where the desk argues the other side in good faith.",
    "Every position has a named owner who defends it in front of the desk. There is no house view that overrides the person carrying the risk.",
    "Positions are sized to survive the tail, not to flatter the mean. A strategy that cannot hold through a loss it did not cause is mis-sized, whatever the case for it.",
  ]},
  { h: "Governance", p: [
    "The Investment Committee sets mandate and limits. It does not pick trades.",
    "Risk runs independently of the desk and can cut any position. That authority is not advisory and does not require the desk to agree.",
    "The tail overlay is permanent, not discretionary. It is never switched off to improve a quarter.",
  ]},
  { h: "Where we are", p: [
    `${site.name} sits in ${site.city}. The desk, the research, and the risk function share one room, which is deliberate: the review that decides whether an idea earns capital happens in person, and it happens often.`,
    `Being outside a financial center costs us some proximity and saves us a great deal of noise. We do not need to be near the flow to model it, and the people who join us tend to be the kind who would rather read the data than the tape.`,
    `There are no branch offices and no external sales desk. Introductions come through people who already know the work.`,
  ]},
];

export default function Firm() {
  return (
    <>
      <PageHeader
        title="A research house that trades."
        standfirst="We are a small partnership. The work is research; trading is how the research is expressed."
        withSurface
      />
      {sections.map((s) => (
        <section key={s.h} className="bg-paper">
          <Container>
            <div className="grid-gc2 rule-t py-16 md:py-24">
              <h2 className="t-h2 col-span-4 text-black lg:col-span-5">{s.h}</h2>
              <div className="col-span-4 lg:col-span-6 lg:col-start-7">
                {s.p.map((t, i) => (
                  <p key={i} className={`t-body measure-body text-ink ${i ? "mt-6" : ""}`}>{t}</p>
                ))}
                {s.h === "Where we are" && site.address && (
                  <p className="t-body measure-body mt-6 text-ink">{site.address}</p>
                )}
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
