import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import TextLink from "@/components/TextLink";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclosures",
  description: "Informational purposes only. Offering documents govern any investment.",
  robots: { index: true, follow: true },
};

const sections: { h: string; p: string[] }[] = [
  { h: "Nature of this website", p: [
    `This website is published by ${site.name} for informational purposes only. Its contents are general in nature, are not tailored to any person's circumstances, and may be changed or withdrawn at any time without notice.`,
  ]},
  { h: "No offer", p: [
    "Nothing on this website constitutes an offer to sell, or a solicitation of an offer to buy, any security or interest in any fund. Any such offer would be made only through definitive offering documents, and those documents govern in all respects.",
  ]},
  { h: "Qualified investors", p: [
    "Access to the partnership is limited to investors who meet the eligibility requirements set out in the offering documents. Nothing here should be read as a representation that any person is eligible to invest.",
  ]},
  { h: "Forward-looking statements", p: [
    "Statements on this website that are not historical fact reflect views held at the time of writing. Those views involve assumptions and uncertainties, may change without notice, and should not be relied upon as predictions.",
  ]},
  { h: "No performance information", p: [
    "This website does not present investment performance. No figure here should be construed as a return, a track record, or an indication of future results. Past performance is not indicative of future results.",
  ]},
  { h: "Third-party content", p: [
    "Where this website refers to third-party sources, those sources are believed to be reliable but have not been independently verified, and no representation is made as to their accuracy or completeness.",
  ]},
  { h: "Contact", p: [] },
];

export default function Disclosures() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Disclosures." />
      <section>
        <Container>
          {/* Legal copy still has to be readable: `.t-h3` is cloud (17.49:1) and
              `.t-body` is ash (7.20:1) on obsidian — the `text-black` /
              `text-ink` the paper build set here were both invisible on the
              Origin ground. */}
          <div className="measure-prose pb-16 md:pb-24">
            {sections.map((s) => (
              <div key={s.h} className="rule-t py-8">
                <h2 className="t-h3">{s.h}</h2>
                {s.p.map((t, i) => (
                  <p key={i} className="t-body mt-4">{t}</p>
                ))}
                {s.h === "Contact" && (
                  <>
                    {/* Split off the sentence so the address is a standalone
                        control. Inline in the sentence it was a 21px tap
                        target; `standalone` gives TextLink `min-h-11`, which an
                        inline link inside running text cannot take without
                        breaking the line box. */}
                    <p className="t-body mt-4">Questions about this website may be sent to:</p>
                    <p className="t-body mt-1">
                      <TextLink standalone href={`mailto:${site.emails.investors}`}>
                        {site.emails.investors}
                      </TextLink>
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
