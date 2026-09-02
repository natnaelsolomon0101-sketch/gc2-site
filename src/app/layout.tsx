import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Roboto_Mono } from "next/font/google";
import { site, siteUrl } from "@/config/site";
import Nav from "@/components/Nav";
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
  themeColor: "#0f1011", width: "device-width", initialScale: 1,
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
