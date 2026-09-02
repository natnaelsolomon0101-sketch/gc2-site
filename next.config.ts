import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * SWARM §4.3 content security policy: self, inline styles, `data:` images,
 * no third parties.
 *
 * `script-src` carries 'unsafe-inline' because the App Router streams its
 * payload through inline `<script>self.__next_f.push(...)</script>` tags. The
 * alternative is a per-request nonce, which requires middleware and makes every
 * route dynamic — A.9 requires every route prerendered. No third-party origin
 * appears anywhere in the policy, which is the property that matters here:
 * the site loads no analytics, no tag manager, no embed, and self-hosts both
 * fonts through next/font.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const security = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/:path*", headers: security },
      {
        // §4.3: served immutable. The file is generated at build time by
        // scripts/generate-surface.ts and its content only changes when that
        // script is re-run and the result committed.
        source: "/surface.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The icons are stable but not content-hashed, so a day rather than a
        // year: long enough to stop the refetch on every navigation, short
        // enough that a re-cut wordmark lands without a cache-buster.
        source: "/:icon(favicon.svg|icon.png|apple-touch-icon.png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ];
  },
};

export default createMDX({})(nextConfig);
