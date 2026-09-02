import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import { site, siteUrl } from "@/config/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";
import "./print.css";

/*
 * Variable font: omit `weight` so the full 200-800 range and the opsz axis load.
 *
 * MEASURED, NOT SHIPPED — this is the single largest remaining LCP lever and
 * it needs a typographer's ruling, not a perf engineer's. This file ships
 * 132,692 bytes of Newsreader woff2, which is ~70% of the high-priority bytes
 * on every route. globals.css uses the display face at exactly two weights,
 * 300 and 400. Swapping to `weight: ["300", "400"]` cuts the file to 58,994
 * bytes (-73,698, -56%), takes high-priority bytes on /contact from 189,885 to
 * 116,131, and moved Lighthouse mobile LCP from ~2.86s to 2.0-2.5s with the
 * performance score going 96 -> 98/99.
 *
 * It is not shipped because static instances drop the `opsz` axis, and
 * `font-optical-sizing: auto` is live across a 15px caption to a 56px article
 * title. That is a visible change to the letterforms, so it is a design call.
 * The weight range is dead capability; the optical size axis is not.
 */
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
  // No `canonical` here on purpose. Root-layout metadata is inherited, not
  // recomputed per route, so `canonical: "/"` made every page — /firm,
  // /strategies, every note — declare itself a duplicate of the homepage and
  // ask to be dropped from the index. Absent is neutral; wrong is not. The
  // real fix is `alternates: { canonical: "/firm" }` in each page's own
  // metadata, which lives in files this agent does not own.
  alternates: {
    types: { "application/rss+xml": [{ url: "/insights/feed.xml", title: "Notes from the desk" }] },
  },
  robots: { index: true, follow: true },
  // Cut from the wordmark by scripts/generate-icons.ts. Paper ground, no
  // rounded tile: the tile is the platform's business, not the mark's.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  // `url` is omitted for the same reason as `canonical`: inherited, it stamped
  // the homepage URL onto every share card on the site.
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF", width: "device-width", initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${instrument.variable}`}>
      <body>
        {/* No <link rel="preload"> for /surface.svg. It lived here, in the root
            layout, so it fired on all seven routes — but only / and /firm
            render a Surface, so on the other five it spent ~12KB of
            high-priority bandwidth, ahead of the render-blocking stylesheet,
            on an image the page never paints. On the two routes that do use
            it, Surface.tsx already ships the <img> in the initial HTML with
            fetchPriority="high", so the preload scanner finds it in the same
            parse; DECISIONS.md round 1 recorded that the preload moved LCP by
            nothing. Removing it is free on / and /firm and a real saving on
            the rest. */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-black focus:px-4 focus:py-3 focus:text-stone">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
