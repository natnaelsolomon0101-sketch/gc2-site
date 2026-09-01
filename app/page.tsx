import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Scale from "@/components/Scale";
import Firm from "@/components/Firm";
import Strategies from "@/components/Strategies";
import Insights from "@/components/Insights";
import Newsletter from "@/components/Newsletter";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import { FUND, SITE_URL, CONTACT } from "@/content/site";

/* Only emit fields we actually have. No invented facts in structured data. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: FUND.name,
  alternateName: FUND.mark,
  description: FUND.description,
  url: SITE_URL,
  email: CONTACT.email,
  ...(FUND.founded ? { foundingDate: String(FUND.founded) } : {}),
  ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
  address: {
    "@type": "PostalAddress",
    addressLocality: FUND.city,
    addressRegion: FUND.state,
    addressCountry: "US",
    ...(CONTACT.address ? { streetAddress: CONTACT.address[0] } : {}),
  },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Scale />
        <Firm />
        <Strategies />
        <Insights />
        <Newsletter />
      </main>
      <Ticker />
      <Footer />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
