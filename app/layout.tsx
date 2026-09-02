import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { FUND, SITE_URL } from "@/content/site";
import "./globals.css";

/* Ivy Presto is not a webfont; Playfair Display is the spec's listed substitute. */
const presto = Playfair_Display({
  subsets: ["latin"], weight: ["400", "500"], variable: "--font-presto", display: "swap",
});
const inter = Inter({
  subsets: ["latin"], weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter", display: "swap",
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
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${presto.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[200] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
