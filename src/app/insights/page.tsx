import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { HairlineList, HairlineRow } from "@/components/HairlineList";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes from the desk",
  description: "Commentary from the desk on regime, risk, convexity, and capacity.",
};

export default function Insights() {
  return (
    <>
      <PageHeader
        title="Notes from the desk."
        standfirst="Occasional notes on how the firm thinks about regime, risk, convexity, and capacity."
      />
      <section className="bg-paper">
        <Container>
          <div className="pb-16 md:pb-24">
            <HairlineList>
              {notes.map((n) => (
                <HairlineRow key={n.slug} href={`/insights/${n.slug}`}>
                  <span className="t-small col-span-4 text-slate lg:col-span-2">{formatDate(n.date)}</span>
                  <span className="col-span-4 lg:col-span-8">
                    <span className="t-h3 block text-black">{n.title}</span>
                    <span className="t-body measure-body mt-2 block text-slate">{n.dek}</span>
                  </span>
                  <span className="t-small col-span-4 text-slate lg:col-span-2">{n.category}</span>
                </HairlineRow>
              ))}
            </HairlineList>
          </div>
        </Container>
      </section>
    </>
  );
}
