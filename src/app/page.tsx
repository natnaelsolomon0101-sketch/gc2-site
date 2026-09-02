import type { Metadata } from "next";
import Link from "next/link";
import Strategies from "@/components/sections/Strategies";
import HeroV2 from "@/components/sections/HeroV2";
import Feature from "@/components/sections/Feature";
import Approach from "@/components/sections/Approach";
import Insights from "@/components/sections/Insights";
import ForAllocators from "@/components/sections/ForAllocators";
import ContactBand from "@/components/sections/ContactBand";
import { site, siteUrl } from "@/config/site";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: `${site.name} — Private investment partnership, Miami`,
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "Organization",
  name: site.name, alternateName: site.mark, url: siteUrl,
  email: site.emails.investors, foundingDate: site.foundedISO,
  address: { "@type": "PostalAddress", addressLocality: "Miami", addressRegion: "FL", addressCountry: "US" },
};

export default function Home() {
  return (
    <>
      <HeroV2 />

      <Feature />

      <Strategies />

      {/* inverted stat card — breaks the dark rhythm once */}
      <section className="wrap band">
        <div className="card-lite on-light mx-auto max-w-3xl text-center">
          <p className="t-heading-lg" style={{ color: "#000" }}>
            Risk is not the price of return. It is what we manage so that we are still
            here when the return arrives.
          </p>
          <p className="t-mono mt-8" style={{ color: "#000", opacity: .7 }}>Investment Committee</p>
        </div>
      </section>

      <Approach />

      <Insights />

      <ForAllocators />

      <ContactBand />
    </>
  );
}
