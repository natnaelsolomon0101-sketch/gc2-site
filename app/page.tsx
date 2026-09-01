import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Firm from "@/components/Firm";
import Strategies from "@/components/Strategies";
import Quote from "@/components/Quote";
import Insights from "@/components/Insights";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FUND, SITE_URL, CONTACT } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: FUND.name,
  alternateName: FUND.mark,
  description: FUND.description,
  url: SITE_URL,
  foundingDate: String(FUND.founded),
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address[1],
    addressLocality: FUND.city,
    addressRegion: FUND.state,
    addressCountry: "US",
  },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
        <Firm />
        <Strategies />
        <Quote />
        <Insights />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
