import type { Metadata } from "next";
import Link from "next/link";
import PinnedStrategies from "@/components/PinnedStrategies";
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
      <section className="wrap" style={{ paddingBlock: "120px" }}>
        <div className="mx-auto max-w-4xl text-center">
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
      <PinnedStrategies />

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

      {/* insights */}
      <section className="wrap band">
        <p className="t-mono">Insights</p>
        <h2 className="t-display-sm mt-6">Notes from the desk.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {notes.map((n) => (
            <Link key={n.slug} href={`/insights/${n.slug}`} className="card-dark block p-8">
              <p className="t-mono-xs">{n.category}</p>
              <h3 className="t-heading-sm mt-5 text-cloud">
                {n.title}
              </h3>
              <p className="t-small mt-4">{n.dek}</p>
              <p className="t-small mt-6 text-fog">{formatDate(n.date)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* contact */}
      <section className="wrap band">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="t-mono">Contact</p>
            <h2 className="t-display-sm mt-6">Inquiries</h2>
          </div>
          <dl className="grid gap-8 sm:grid-cols-3 md:col-span-6 md:col-start-7">
            <div>
              <dt className="t-mono-xs">Investors</dt>
              <dd><a href={`mailto:${site.emails.investors}`} className="t-body text-pure inline-flex min-h-11 items-center">{site.emails.investors}</a></dd>
            </div>
            <div>
              <dt className="t-mono-xs">Press</dt>
              <dd><a href={`mailto:${site.emails.press}`} className="t-body text-pure inline-flex min-h-11 items-center">{site.emails.press}</a></dd>
            </div>
            <div>
              <dt className="t-mono-xs">Office</dt>
              <dd className="t-body mt-3 text-pure">{site.address ?? site.city}</dd>
              {site.phone && <dd className="t-body mt-1 text-pure">{site.phone}</dd>}
            </div>
          </dl>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
