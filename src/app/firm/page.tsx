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
    "We build our own data and write our own models. An idea earns capital only after adversarial review, where the desk argues the other side in good faith.",
    "Every position has a named owner who defends it in front of the desk. There is no house view that overrides the person carrying the risk.",
    "We size to survive the tail, not to flatter the mean. A book that cannot hold through a drawdown it did not cause is mis-sized regardless of its expected return.",
  ]},
  { h: "Governance", p: [
    "The Investment Committee sets mandate and limits. It does not pick trades.",
    "Risk runs independently of the desk and can cut any position. That authority is not advisory and does not require the desk to agree.",
    "The tail overlay is permanent, not discretionary. It is never switched off to improve a quarter.",
  ]},
  { h: "Where we are", p: [
    `${site.city}.`,
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
              <h2 className="t-h2 col-span-4 text-black md:col-span-5">{s.h}</h2>
              <div className="col-span-4 md:col-span-6 md:col-start-7">
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
