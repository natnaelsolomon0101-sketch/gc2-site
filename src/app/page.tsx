import type { Metadata } from "next";
import Container from "@/components/Container";
import Surface from "@/components/Surface";
import Button from "@/components/Button";
import TextLink from "@/components/TextLink";
import FactsRow from "@/components/FactsRow";
import Statement from "@/components/Statement";
import { HairlineList, HairlineRow } from "@/components/HairlineList";
import { site, siteUrl } from "@/config/site";
import { strategies } from "@/content/strategies";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: `${site.name} — Private investment partnership, Austin`,
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.mark,
  url: siteUrl,
  email: site.emails.investors,
  foundingDate: String(site.founded),
  address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
};

export default function Home() {
  return (
    <>
      {/* ---- hero ---- */}
      <section className="relative overflow-hidden bg-paper">
        <Surface className="surface-mask absolute right-0 top-0 hidden h-full w-3/5 md:block" />
        <Container className="relative">
          <div className="hero-frame flex flex-col justify-center">
            <h1 className="t-display reveal reveal-1 measure-hero text-black">
              Evidence first. Then capital.
            </h1>
            <p className="t-lead reveal reveal-2 measure-lead mt-10 text-slate">
              {site.name} is a private investment partnership in {site.city}. We run
              concentrated, systematic strategies across liquid global markets,
              underwritten by our own research and a single risk framework.
            </p>
            <div className="reveal reveal-3 mt-12 flex flex-wrap items-center gap-6">
              <Button href="/firm">Our approach</Button>
              <TextLink href="/contact">Investor inquiries</TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- facts ---- */}
      <section className="bg-paper">
        <Container><FactsRow /></Container>
      </section>

      {/* ---- the firm ---- */}
      <section className="bg-paper">
        <Container>
          <div className="grid-gc2 section-y">
            <h2 className="t-h2 col-span-4 text-black md:col-span-5">The firm</h2>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <p className="t-body measure-body text-ink">
                Durable returns in liquid markets come from process, not prediction. We
                build our own data, write our own models, and hold an idea to a single
                standard: it earns capital only when the evidence survives adversarial
                review.
              </p>
              <p className="t-body measure-body mt-6 text-ink">
                Every position has a named owner who defends it in front of the desk. We
                carry no external mandate that would force us into a trade we do not
                believe, and we size to survive the tail rather than to flatter the mean.
              </p>
              <p className="mt-8"><TextLink href="/firm">About the firm</TextLink></p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- strategies ---- */}
      <section className="bg-paper">
        <Container>
          <div className="section-y">
            <h2 className="t-h2 text-black">Six strategies. One risk framework.</h2>
            <div className="mt-12">
              <HairlineList>
                {strategies.map((s) => (
                  <HairlineRow key={s.slug} href={`/strategies#${s.slug}`}>
                    <span className="t-h3 col-span-4 text-black">{s.name}</span>
                    <span className="t-body col-span-4 text-ink md:col-span-5">{s.oneLiner}</span>
                    <span className="t-small col-span-4 text-slate md:col-span-3">{s.markets}</span>
                  </HairlineRow>
                ))}
              </HairlineList>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- statement ---- */}
      <Statement attribution="Investment Committee">
        Risk is not the price of return. It is what we manage so that we are still here
        when the return arrives.
      </Statement>

      {/* ---- insights ---- */}
      <section className="bg-paper">
        <Container>
          <div className="section-y">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="t-h2 text-black">Notes from the desk.</h2>
              <TextLink href="/insights">All notes</TextLink>
            </div>
            <div className="mt-12">
              <HairlineList>
                {notes.map((n) => (
                  <HairlineRow key={n.slug} href={`/insights/${n.slug}`}>
                    <span className="t-small col-span-4 text-slate md:col-span-2">{formatDate(n.date)}</span>
                    <span className="col-span-4 md:col-span-8">
                      <span className="t-h3 block text-black">{n.title}</span>
                      <span className="t-body measure-body mt-2 block text-slate">{n.dek}</span>
                    </span>
                    <span className="t-small col-span-4 text-slate md:col-span-2">{n.category}</span>
                  </HairlineRow>
                ))}
              </HairlineList>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- contact (the one inverted band; the footer continues it) ---- */}
      <section className="on-black bg-black text-stone">
        <Container>
          <div className="grid-gc2 section-y">
            <div className="col-span-4 md:col-span-5">
              <h2 className="t-h2 text-stone">Inquiries</h2>
              <p className="t-body measure-body mt-6 text-muted-on-black">
                We speak with a small number of aligned partners each year. Introductions
                are welcome.
              </p>
            </div>
            <dl className="col-span-4 grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-6 md:col-start-7">
              <div>
                <dt className="t-caption text-muted-on-black">Investors</dt>
                <dd className="t-small mt-2">
                  <TextLink href={`mailto:${site.emails.investors}`} onBlack>{site.emails.investors}</TextLink>
                </dd>
              </div>
              <div>
                <dt className="t-caption text-muted-on-black">Press</dt>
                <dd className="t-small mt-2">
                  <TextLink href={`mailto:${site.emails.press}`} onBlack>{site.emails.press}</TextLink>
                </dd>
              </div>
              <div>
                <dt className="t-caption text-muted-on-black">Office</dt>
                <dd className="t-small mt-2 text-stone">{site.address ?? site.city}</dd>
                {site.phone && <dd className="t-small mt-1 text-stone">{site.phone}</dd>}
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
