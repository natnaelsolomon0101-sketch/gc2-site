/* Third-party headlines for the Markets page.
 *
 * SOURCES. CNBC's Markets RSS, Google News RSS for the wider tape, and a
 * Google News query for David Rubenstein. Headline, source, link and time
 * only: no article text, no images, every item links out to its publisher.
 * Fetched on the server, half-hour ISR window.
 *
 * THE RULE. These are other people's headlines. The firm does not endorse
 * them and a headline here is not a view of the firm. Items whose title
 * carries language the site itself may not use (the 506(b) word list) are
 * dropped rather than shown. A feed that fails renders nothing. */

export type Headline = {
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO
};

export const NEWS_REVALIDATE = 1800;

const UA = { "user-agent": "Mozilla/5.0 (compatible; gc2-site)" };

/* Words the firm may not put on its own pages. A third-party headline that
   uses them is skipped, so the page can never be read as the firm saying it. */
const SKIP = /\b(buy|sell|guarantee[sd]?|returns?|outperform|profit|track record|hot stock|must[- ]own|top picks?|projected|irr|aum|assets under management|subscribe|target(?:ed)? return|expected return|now raising|closing date|oversubscribed)\b/i;

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, " ").trim();
}

function parseRss(xml: string, fallbackSource: string): Headline[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const out: Headline[] = [];
  for (const it of items) {
    const title = decode(it.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const link = decode(it.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "");
    const pub = it.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "";
    const src = decode(it.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? fallbackSource);
    if (!title || !link) continue;
    const d = new Date(pub);
    if (Number.isNaN(d.getTime())) continue;
    /* Google News appends " - Source" to titles; strip it since we print the source. */
    const clean = src && title.endsWith(` - ${src}`) ? title.slice(0, -(src.length + 3)) : title;
    if (SKIP.test(clean)) continue;
    out.push({ title: clean, source: src, url: link, publishedAt: d.toISOString() });
  }
  return out;
}

/* For aggregated feeds, only publishers an allocator would recognise. The
   CNBC feed is its own source and is not filtered by name. */
const ALLOW = /^(Reuters|WSJ|The Wall Street Journal|Bloomberg(?:\.com| Law| Wealth)?|Financial Times|CNBC|MarketWatch|Barron's|The New York Times|AP News|Associated Press|PBS|The Economist|Fortune|Axios|Forbes|Yahoo Finance|The Guardian|BBC(?: News)?)$/i;

async function feed(url: string, fallbackSource: string, limit: number, allowlist = false): Promise<Headline[]> {
  try {
    const res = await fetch(url, { headers: UA, next: { revalidate: NEWS_REVALIDATE } });
    if (!res.ok) return [];
    const xml = await res.text();
    const seen = new Set<string>();
    return parseRss(xml, fallbackSource)
      .filter((h) => !allowlist || ALLOW.test(h.source))
      .filter((h) => (seen.has(h.title) ? false : (seen.add(h.title), true)))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export const fetchCnbc = () =>
  feed("https://www.cnbc.com/id/20910258/device/rss/rss.html", "CNBC", 6);

export const fetchTape = () =>
  feed(
    "https://news.google.com/rss/search?q=%22stock+market%22+OR+%22treasury+yields%22+OR+%22federal+reserve%22+when:3d&hl=en-US&gl=US&ceid=US:en",
    "Google News", 8, true,
  );

/** Headlines about a named host, last 30 days, recognised publishers only. */
export const fetchAbout = (query: string) =>
  feed(
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+when:30d&hl=en-US&gl=US&ceid=US:en`,
    "Google News", 4, true,
  );

export function fmtWhen(iso: string): string {
  const d = new Date(iso);
  const h = (Date.now() - d.getTime()) / 36e5;
  if (h < 1) return "just now";
  if (h < 24) return `${Math.floor(h)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
