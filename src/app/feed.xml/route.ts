import { site, siteUrl } from "@/config/site";
import { notes } from "@/content/notes";

/* RSS 2.0 feed of the notes (round 3, EVERY-SCREEN.md §5.6's syndication
   ask). Fully derived from src/content/notes.ts, which is deterministic at
   build time, so this is force-static like sitemap.ts rather than
   regenerated per request.

   Title and description match /insights's own metadata (src/app/insights/
   page.tsx) so the feed reads as the same object, not a second description
   of the section invented here. Absolute URLs throughout — siteUrl, not a
   relative path — because a feed is read outside the site's own origin
   (a reader, an aggregator) where a relative link would resolve against
   the WRONG origin. */

const CHANNEL_TITLE = `Notes from the desk · ${site.name}`;
const CHANNEL_DESCRIPTION = "Commentary from the desk on regime, risk, convexity, and capacity.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export async function GET() {
  // notes.ts already sorts newest-first at module load; no need to re-sort.
  const latest = notes[0];
  const buildDate = latest
    ? new Date(`${latest.date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const items = notes
    .map((n) => {
      const url = `${siteUrl}/insights/${n.slug}`;
      const pubDate = new Date(`${n.date}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(n.category)}</category>
      <description>${escapeXml(n.dek)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(CHANNEL_TITLE)}</title>
    <link>${siteUrl}/insights</link>
    <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
