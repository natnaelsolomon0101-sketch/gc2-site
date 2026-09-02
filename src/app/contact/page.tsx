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
        eyebrow="Contact"
        title="Inquiries."
        standfirst="We speak with a small number of aligned partners each year, and we would rather have one long conversation than ten short ones. Introductions are welcome."
      />
      <section>
        <Container>
          {/* Labels use `t-mono-xs` (ash, 7.20:1) — the same eyebrow the home
              page puts over its contact block — and the values use `text-pure`
              (19.05:1), matching how home renders the office line. */}
          <dl className="rule-t grid grid-cols-1 gap-10 py-16 sm:grid-cols-3 md:py-24">
            <div>
              <dt className="t-mono-xs">Investors</dt>
              <dd className="t-lead mt-3">
                <TextLink standalone href={`mailto:${site.emails.investors}`}>{site.emails.investors}</TextLink>
              </dd>
            </div>
            <div>
              <dt className="t-mono-xs">Press</dt>
              <dd className="t-lead mt-3">
                <TextLink standalone href={`mailto:${site.emails.press}`}>{site.emails.press}</TextLink>
              </dd>
            </div>
            <div>
              <dt className="t-mono-xs">Office</dt>
              <dd className="t-lead mt-3 text-pure">{site.address ?? site.city}</dd>
              {site.phone && <dd className="t-lead mt-1 text-pure">{site.phone}</dd>}
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
