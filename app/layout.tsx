import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo } from "next/font/google";
import { FUND, SITE_URL } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"], variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"], display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"], variable: "--font-archivo",
  weight: ["400", "500", "600"], display: "swap",
});

const title = `${FUND.name} · ${FUND.kind}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${FUND.mark}` },
  description: FUND.description,
  applicationName: FUND.name,
  keywords: [FUND.name, FUND.mark, FUND.kind, `${FUND.city} ${FUND.state}`,
             "systematic trading", "liquid markets", "private fund"],
  authors: [{ name: FUND.name }],
  openGraph: {
    type: "website", siteName: FUND.name, url: SITE_URL,
    title, description: FUND.description, locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: FUND.description },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0A1422",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
