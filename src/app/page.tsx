import type { Metadata } from "next";
import Link from "next/link";
import Strategies from "@/components/sections/Strategies";
import HeroV2 from "@/components/sections/HeroV2";
import MarketsStrip from "@/components/sections/MarketsStrip";
import Feature from "@/components/sections/Feature";
import Approach from "@/components/sections/Approach";
import Insights from "@/components/sections/Insights";
import ForAllocators from "@/components/sections/ForAllocators";
import ContactBand from "@/components/sections/ContactBand";
import { site, siteUrl } from "@/config/site";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: `${site.name} · Private investment partnership, Miami`,
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "Organization",
  name: site.name, alternateName: site.mark, url: siteUrl,
  /* Absolute, not "/logo.png": schema.org consumers do not resolve a relative
     URL, and this is the image Google may put beside the name. Same mark as the
     favicon set, from scripts/make-icons.ts. */
  logo: `${siteUrl}/logo.png`,
  email: site.emails.investors, foundingDate: site.foundedISO,
  address: { "@type": "PostalAddress", addressLocality: "Miami", addressRegion: "FL", addressCountry: "US" },
};

export default function Home() {
  return (
    <>
      {/* The Organization graph. This object had been declared and rendered
          nowhere since it was written, so the site was shipping no structured
          data at all — silently, because nothing tests for the absence of a
          script tag. Every less-than is escaped to its JSON unicode form:
          JSON.stringify does not escape it, so the day a string in site.ts or
          fund.ts contains a closing script tag, that tag would close this one
          early and the rest of the JSON would land on the page as markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <HeroV2 />
      <MarketsStrip />

      <Feature />

      <Strategies />

      <Approach />

      <Insights />

      <ForAllocators />

      <ContactBand />
    </>
  );
}
