import { notes } from "@/content/notes";
import { site, siteUrl } from "@/config/site";

/**
 * RSS 2.0 for the notes. SWARM §4.3.
 *
 * Prerendered: the notes are a build-time constant, so there is nothing to
 * compute per request and A.9 wants every route static.
 */
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS dates are RFC 822. Notes carry a date with no time; midnight UTC. */
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export function GET() {
  const self = `${siteUrl}/insights/feed.xml`;
  const items = notes
    .map((n) => {
      const url = `${siteUrl}/insights/${n.slug}`;
      return [
        "    <item>",
        `      <title>${esc(n.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(n.date)}</pubDate>`,
        `      <category>${esc(n.category)}</category>`,
        `      <description>${esc(n.dek)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${esc(site.name)} — Notes from the desk</title>`,
    `    <link>${siteUrl}/insights</link>`,
    `    <atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    "    <description>Notes from the desk on regimes, risk, and capacity.</description>",
    "    <language>en-us</language>",
    `    <copyright>${new Date().getFullYear()} ${esc(site.name)}</copyright>`,
    notes[0] ? `    <lastBuildDate>${rfc822(notes[0].date)}</lastBuildDate>` : "",
    items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter((l) => l !== "")
    .join("\n");

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
