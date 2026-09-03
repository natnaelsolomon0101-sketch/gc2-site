import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Roboto_Mono } from "next/font/google";
import { site, siteUrl } from "@/config/site";
import Nav from "@/components/sections/SiteNav";
import Footer from "@/components/Footer";
import "./globals.css";

/* Lyon Display is not a webfont; DM Serif Display is the spec's listed substitute.
   DM Serif ships weight 400 only, so tracking is tightened in CSS instead of using 300. */
const dmserif = DM_Serif_Display({
  subsets: ["latin"], weight: ["400"], variable: "--font-dmserif",
  display: "swap", adjustFontFallback: true,
});
const inter = Inter({
  subsets: ["latin"], variable: "--font-inter", display: "swap", adjustFontFallback: true,
});
const monoFace = Roboto_Mono({
  subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face",
  display: "swap", adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Private investment partnership, Miami`,
    template: `%s — ${site.name}`,
  },
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
  /* Foundation r1: `alternates.canonical: "./"` is relative-to-pathname, the
     same trick `openGraph.url` already uses below — Next resolves it against
     each route's own URL before applying metadataBase, so every page gets its
     own correct absolute canonical (home -> metadataBase, /firm -> metadataBase
     + "/firm") without any of the 17 routes setting one itself, and no page
     overrides it to a literal "/". Previously there was no `alternates.canonical`
     at all: Next shallow-merges root-layout metadata into every child that
     doesn't override it, and none did, so earlier in this branch's history a
     literal `canonical: "/"` here told Google that /diligence, /governance,
     /questions, /tearsheet and 15 others were all duplicates of the homepage
     (verified in built HTML: firm.html and tearsheet.html both carried
     rel="canonical" href="https://gc2.fund") while sitemap.ts submitted all 17
     for indexing and robots said index: true. "./" fixes that without
     reintroducing it: verified in the built HTML of / and /firm (Next resolves
     the root path's canonical to the bare origin, https://girlscantrade2.com,
     rather than adding a trailing slash — that's Next's own
     resolveAbsoluteUrlWithPathname behavior, not a bug here). */
  alternates: { canonical: "./" },
  robots: { index: true, follow: true },
  /* `url: "./"` is relative-to-pathname, not a literal path: Next resolves it
     against each route's own URL before applying metadataBase, so every page
     gets its own correct absolute og:url (home -> metadataBase, /firm ->
     metadataBase + "/firm") without any page setting one itself. Leaving
     `openGraph.url` unset — the prior state — emits no og:url at all. */
  openGraph: { type: "website", siteName: site.name, locale: "en_US", url: "./" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0f1011", width: "device-width", initialScale: 1, viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmserif.variable} ${inter.variable} ${monoFace.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-pure focus:px-4 focus:py-3 focus:text-void">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
