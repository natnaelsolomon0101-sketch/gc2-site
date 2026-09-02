/**
 * Internal link gate.
 *
 * Crawls every public route in the RENDERED page and asserts that every link
 * goes somewhere real. Prints nothing and exits 0 when clean; prints the route,
 * the link text and the offending href and exits NON-ZERO on any failure.
 *
 * FAILS on:
 *   - href="" or href="   "                     (a control that goes nowhere)
 *   - href="#"                                  (an anchor with no target)
 *   - href="#frag" where no element has that id (a fragment that goes nowhere)
 *   - an internal path that is not a real route (404, or absent from sitemap.ts)
 *   - a mailto: address that is not in src/config/site.ts
 *   - a malformed external URL
 *   - javascript:/data:/vbscript: hrefs
 *
 * DOES NOT FAIL on: an external host being down. A third-party outage is not a
 * defect in this repo, and a gate that goes red when someone else's DNS blips
 * is a gate the team learns to re-run rather than read. External links are
 * inventoried instead — set LINKS_VERBOSE=1 to print the inventory.
 *
 * ROUTE LIST: read from src/app/sitemap.ts rather than retyped here. A
 * hardcoded list drifts silently — a route added to src/app/ and to the sitemap
 * would simply never be crawled, and the gate would keep reporting "clean" on a
 * page it has never loaded. Reading the sitemap also expands /insights/[slug]
 * from src/content/notes.ts for free. It is re-exported below so a caller can
 * see exactly what was crawled.
 *
 * The mailto assertion is the one that catches an INVENTED address: a plausible
 * "ir@gc2.fund" typed straight into JSX renders, looks correct, and bounces.
 * Only the addresses declared in site.emails are allowed.
 */
import { chromium } from "playwright";
import sitemap from "../../src/app/sitemap";
import { site, siteUrl } from "../../src/config/site";

/** Every public route, in sitemap order. Exported so callers can see the set. */
export const ROUTES: string[] = sitemap().map((e) => e.url.slice(siteUrl.length) || "/");

/** The only addresses this site is allowed to publish. */
const ALLOWED_EMAILS = new Set<string>(Object.values(site.emails));

type Link = { raw: string | null; resolved: string; text: string };
type Failure = { route: string; kind: string; detail: string };

/** A hostname a human could actually resolve: labels, dots, alphabetic TLD. */
function hostLooksReal(host: string): boolean {
  if (!host || /\s/.test(host)) return false;
  if (host === "localhost") return true;
  const labels = host.split(".");
  if (labels.length < 2) return false;
  if (labels.some((l) => l.length === 0)) return false;
  return /^[a-z]{2,}$/i.test(labels[labels.length - 1]);
}

async function main() {
  const base = process.env.BASE ?? "http://localhost:3000";
  const routeSet = new Set(ROUTES);
  const fails: Failure[] = [];
  /** external url -> routes it appears on */
  const external = new Map<string, Set<string>>();
  /** ids present on each route, so a cross-page #fragment can be resolved */
  const idsByRoute = new Map<string, Set<string>>();
  /** deferred fragment checks: [route, href, text, targetPath, fragment] */
  const fragments: { route: string; href: string; text: string; path: string; frag: string }[] = [];
  /** internal paths seen, so each is status-checked exactly once */
  const internalPaths = new Map<string, { route: string; text: string; href: string }>();

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // tsx compiles this file with esbuild's keepNames on, which wraps every named
  // function in a __name() helper. That helper does not exist inside the page,
  // so any evaluate() containing a named arrow throws ReferenceError there.
  // Defining an identity __name in the page is the smallest fix that lets these
  // gates use readable helper functions inside evaluate().
  await ctx.addInitScript(() => {
    (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f;
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) {
      fails.push({ route, kind: "route did not load", detail: `status ${res?.status() ?? "none"}` });
      continue;
    }

    const { links, ids } = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("a"));
      return {
        links: anchors.map((a) => ({
          raw: a.getAttribute("href"),
          resolved: a.href,
          text: (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
        })),
        ids: Array.from(document.querySelectorAll("[id]")).map((el) => el.id),
      };
    });
    idsByRoute.set(route, new Set(ids as string[]));

    for (const l of links as Link[]) {
      const label = l.text ? `"${l.text}"` : "<no text>";
      const where = (kind: string, detail: string) =>
        fails.push({ route, kind, detail: `${label}  ${detail}` });

      if (l.raw === null) {
        where("anchor with no href", "<a> element is not a link");
        continue;
      }
      const href = l.raw.trim();
      if (href === "") {
        where("empty href", `href="${l.raw}"`);
        continue;
      }
      if (href === "#") {
        where("dead anchor", 'href="#" goes nowhere');
        continue;
      }
      if (/^(javascript|data|vbscript):/i.test(href)) {
        where("script-scheme href", `href="${href}"`);
        continue;
      }

      if (href.startsWith("#")) {
        fragments.push({ route, href, text: label, path: route, frag: href.slice(1) });
        continue;
      }

      if (href.toLowerCase().startsWith("mailto:")) {
        const addr = decodeURIComponent(href.slice(7).split("?")[0]).trim().toLowerCase();
        if (!addr) where("empty mailto", `href="${href}"`);
        else if (!ALLOWED_EMAILS.has(addr))
          where("mailto address not in src/config/site.ts", `${addr}  (allowed: ${[...ALLOWED_EMAILS].join(", ")})`);
        continue;
      }

      if (href.toLowerCase().startsWith("tel:")) continue; // informational only

      let url: URL;
      try {
        url = new URL(href, base + route);
      } catch {
        where("unparseable href", `href="${href}"`);
        continue;
      }

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        where("unsupported scheme", `href="${href}"`);
        continue;
      }

      const isInternal = url.origin === new URL(base).origin;
      if (!isInternal) {
        if (!hostLooksReal(url.hostname)) {
          where("malformed external URL", `href="${href}" (host "${url.hostname}")`);
          continue;
        }
        const k = url.toString();
        if (!external.has(k)) external.set(k, new Set());
        external.get(k)!.add(route);
        continue;
      }

      const path = url.pathname.replace(/\/$/, "") || "/";
      if (!routeSet.has(path)) {
        where("link to a route that does not exist", `href="${href}" (not in src/app/sitemap.ts)`);
        continue;
      }
      if (!internalPaths.has(path)) internalPaths.set(path, { route, text: label, href });
      if (url.hash.length > 1) {
        fragments.push({ route, href, text: label, path, frag: url.hash.slice(1) });
      }
    }
  }

  // Every internal path is fetched once. sitemap membership proves the route is
  // declared; the status proves it is actually served.
  for (const [path, src] of internalPaths) {
    const r = await ctx.request.get(base + path, { maxRedirects: 5 });
    if (r.status() !== 200) {
      fails.push({
        route: src.route,
        kind: "internal link returns " + r.status(),
        detail: `${src.text}  href="${src.href}"`,
      });
    }
  }

  // Fragments resolve against the ids collected from the page they point at,
  // so /strategies#tail-overlay is checked on /strategies rather than on the
  // page that links to it.
  for (const f of fragments) {
    const ids = idsByRoute.get(f.path);
    if (!ids) {
      fails.push({ route: f.route, kind: "fragment target route not crawled", detail: `${f.text}  href="${f.href}"` });
      continue;
    }
    if (!ids.has(f.frag)) {
      fails.push({
        route: f.route,
        kind: "fragment goes nowhere",
        detail: `${f.text}  href="${f.href}" (no element with id="${f.frag}" on ${f.path})`,
      });
    }
  }

  await browser.close();

  if (fails.length) {
    console.log(`[links] ${fails.length} broken link(s) across ${ROUTES.length} public routes:`);
    for (const f of fails) console.log(`  ${f.route}  [${f.kind}]  ${f.detail}`);
    if (external.size) {
      console.log(`  ---- ${external.size} external link(s), not failed on: ----`);
      for (const [url, routes] of external) console.log(`  ${url}  (${[...routes].join(", ")})`);
    }
    process.exit(1);
  }

  if (process.env.LINKS_VERBOSE) {
    console.log(`[links] ${ROUTES.length} routes, ${internalPaths.size} internal targets, ${external.size} external link(s)`);
    for (const [url, routes] of external) console.log(`  ${url}  (${[...routes].join(", ")})`);
  }
}

main().catch((e) => {
  console.log("[links] gate crashed: " + (e instanceof Error ? e.message : String(e)));
  process.exit(1);
});
