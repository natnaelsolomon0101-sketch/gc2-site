import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Inquiries",
  description: "We speak with a small number of aligned partners each year. Introductions are welcome.",
};

export default function Contact() {
  return (
    <>
      <PageHeader
        title="Inquiries."
        standfirst="We speak with a small number of aligned partners each year, and we would rather have one long conversation than ten short ones. Introductions are welcome."
      />
      <section className="bg-paper">
        <Container>
          <dl className="rule-t grid grid-cols-1 gap-10 py-16 sm:grid-cols-3 md:py-24">
            <div>
              <dt className="t-caption text-slate">Investors</dt>
              <dd className="t-body mt-3">
                <TextLink href={`mailto:${site.emails.investors}`}>{site.emails.investors}</TextLink>
              </dd>
            </div>
            <div>
              <dt className="t-caption text-slate">Press</dt>
              <dd className="t-body mt-3">
                <TextLink href={`mailto:${site.emails.press}`}>{site.emails.press}</TextLink>
              </dd>
            </div>
            <div>
              <dt className="t-caption text-slate">Office</dt>
              <dd className="t-body mt-3 text-ink">{site.address ?? site.city}</dd>
              {site.phone && <dd className="t-body mt-1 text-ink">{site.phone}</dd>}
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
