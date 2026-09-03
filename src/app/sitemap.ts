import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { nav, allocatorNav, legalNav } from "@/config/nav";
import { notes } from "@/content/notes";

/* Search hygiene round (Conductor grant — src/app/sitemap.ts is not this
   row's file the rest of the time). Route list is derived from
   `src/config/nav.ts` rather than hand-duplicated here, so a nav entry
   added or removed can't silently drift out of sync with the sitemap the
   way the old flat, hand-typed array could. `legalNav` only carries the two
   top-level footer links (/legal, /disclosures); the two documents that sit
   under /legal itself are listed separately below.

   Priority tiers (Conductor spec): home 1.0, allocator pages 0.8 (the
   audience this site is actually for), legal 0.3 (found, not sold). The
   `nav` group (firm/strategies/insights/contact) sits between the two at
   0.7 — general site content, more central than the legal pages, less than
   the allocator-facing document set. changeFrequency follows the same
   logic: home is the page most likely to change first, the content and
   allocator groups are edited occasionally, legal and insight notes are
   published once and rarely revised.

   No /does-not-exist entry: a 404 is not a page to be found. */
const LEGAL_SUBPAGES = ["/legal/terms", "/legal/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  /* Evaluated once, at build time (this route prerenders statically — see
     `npm run build`'s route list) — every URL below gets the same
     timestamp, which is what "the build date" means for a static sitemap. */
  const buildDate = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: siteUrl,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 1.0,
  };

  const siteContent = nav.map((n) => ({
    url: `${siteUrl}${n.href}`,
    lastModified: buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const allocatorContent = allocatorNav.map((n) => ({
    url: `${siteUrl}${n.href}`,
    lastModified: buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const legalContent = [...legalNav.map((n) => n.href), ...LEGAL_SUBPAGES].map((href) => ({
    url: `${siteUrl}${href}`,
    lastModified: buildDate,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const insightNotes = notes.map((n) => ({
    url: `${siteUrl}/insights/${n.slug}`,
    lastModified: new Date(n.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [home, ...siteContent, ...allocatorContent, ...legalContent, ...insightNotes];
}
