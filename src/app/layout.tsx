import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import { site, siteUrl } from "@/config/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

/* Variable font: omit `weight` so the full 200-800 range and the opsz axis load. */
const newsreader = Newsreader({
  subsets: ["latin"], axes: ["opsz"],
  variable: "--font-newsreader", display: "swap", adjustFontFallback: true,
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument", display: "swap", adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Private investment partnership, Austin`,
    template: `%s — ${site.name}`,
  },
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: site.name, url: siteUrl, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF", width: "device-width", initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${instrument.variable}`}>
      <body>
        <link rel="preload" as="image" href="/surface.svg" fetchPriority="high" />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-black focus:px-4 focus:py-3 focus:text-stone">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
