import type { Metadata } from "next";
import Link from "next/link";
import Strategies from "@/components/sections/Strategies";
import Atmosphere from "@/components/sections/Atmosphere";
import BloomField from "@/components/sections/BloomField";
import Approach from "@/components/sections/Approach";
import Insights from "@/components/sections/Insights";
import ContactBand from "@/components/sections/ContactBand";
import { site, siteUrl } from "@/config/site";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: `${site.name} — Private investment partnership, Austin`,
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "Organization",
  name: site.name, alternateName: site.mark, url: siteUrl,
  email: site.emails.investors, foundingDate: String(site.founded),
  address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
};

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden" style={{ paddingBlock: "120px" }}>
        <Atmosphere />
        <BloomField intensity={0.85} className="mix-blend-screen" />
        <div className="wrap relative z-10 mx-auto max-w-4xl text-center">
          <span className="chip fade-in fade-1">
            <span className="t-mono" style={{ letterSpacing: ".16em" }}>{site.city}</span>
          </span>
          <h1 className="t-display fade-in fade-2 mt-8">Evidence first. Then capital.</h1>
          <p className="t-sub fade-in fade-3 mx-auto mt-8 max-w-xl text-ash">
            {site.name} runs concentrated, systematic strategies across liquid global
            markets, underwritten by our own research and a single risk framework.
          </p>
          <div className="fade-in fade-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/firm" className="btn">Our approach</Link>
            <Link href="/contact" className="btn btn-ghost">Investor inquiries</Link>
          </div>
        </div>
      </section>

      {/* the pinned scroll section */}

      <Approach />

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

      <Insights />

      <ContactBand />
    </>
  );
}
