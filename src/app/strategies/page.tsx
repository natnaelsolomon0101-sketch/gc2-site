import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { strategies } from "@/content/strategies";

export const metadata: Metadata = {
  title: "Strategies",
  description: "Six strategies across liquid global markets, governed by one risk framework.",
};

export default function Strategies() {
  return (
    <>
      <PageHeader
        title="Six strategies. One risk framework."
        standfirst="Six books run independently and are underwritten against the same limits. One framework governs them because correlated risk does not respect a mandate boundary."
      />
      {strategies.map((s) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-24 bg-paper">
          <Container>
            <div className="grid-gc2 rule-t py-16 md:py-24">
              <div className="col-span-4 lg:col-span-5">
                <h2 className="t-h2 text-black">{s.name}</h2>
                <dl className="mt-8">
                  <div className="rule-t grid grid-cols-3 gap-6 py-3">
                    <dt className="t-small text-slate">Markets</dt>
                    <dd className="t-body col-span-2 text-ink">{s.markets}</dd>
                  </div>
                  <div className="rule-t rule-b grid grid-cols-3 gap-6 py-3">
                    <dt className="t-small text-slate">Instruments</dt>
                    <dd className="t-body col-span-2 text-ink">{s.instruments}</dd>
                  </div>
                </dl>
              </div>
              <div className="col-span-4 lg:col-span-6 lg:col-start-7">
                {s.body.map((t, i) => (
                  <p key={i} className={`t-body measure-body text-ink ${i ? "mt-6" : ""}`}>{t}</p>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
