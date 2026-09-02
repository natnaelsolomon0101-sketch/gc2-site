import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import { FUND, SITE_URL } from "@/content/site";
import "./globals.css";

/* Tiempos is not a webfont; Source Serif 4 is the spec's listed substitute. */
const serif = Source_Serif_4({
  subsets: ["latin"], weight: ["400", "500"], variable: "--font-serif", display: "swap",
});
/* The Future -> Inter, per the spec's substitute list. */
const sans = Inter({
  subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans", display: "swap",
});

const title = `${FUND.name} · ${FUND.kind}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${FUND.mark}` },
  description: FUND.description,
  applicationName: FUND.name,
  openGraph: {
    type: "website", siteName: FUND.name, url: SITE_URL,
    title, description: FUND.description, locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: FUND.description },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fcfcfc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[200] focus:bg-graphite-ink focus:px-4 focus:py-3 focus:text-paper-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
