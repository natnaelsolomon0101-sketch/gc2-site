/**
 * Data-source gate. EVERY-SCREEN.md §2 and §9.
 *
 * Every visual on this site that looks like data has to BE data, with a source
 * and an as-of date printed as part of the design. The machine-readable half of
 * that promise is a `data-source` attribute on the component's root; this gate
 * reads the rendered HTML of every public route and fails on:
 *
 *   1. a `data-source` value that is not in the whitelist below — an
 *      unreviewed feed reaching a public page,
 *   2. a whitelisted component whose visible text does not carry its source
 *      line — the attribute present and the caption quietly dropped, which is
 *      the failure mode that actually happens in a refactor,
 *   3. a `data-asof` that is not an ISO date, or that is in the future.
 *
 * It does NOT fail when a route renders no data component. A component whose
 * feed was unreachable renders nothing on purpose (never fake data), and a
 * gate that demanded its presence would turn "the feed is down" into "the build
 * is broken".
 *
 * Adding a source is a deliberate act: a new entry needs the endpoint, the
 * terms that permit display, and the caption the reader will see.
 */
import { chromium } from "playwright";

type Source = {
  /** The `data-source` value. */
  id: string;
  /** Where it comes from, and under what terms — the reviewed part. */
  endpoint: string;
  terms: string;
  /** A substring that must appear in the component's visible text. */
  caption: string;
  /** False for a component computed locally, which has no as-of date to print. */
  dated: boolean;
};

const WHITELIST: Source[] = [
  {
    id: "home.treasury.gov",
    endpoint:
      "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml" +
      "?data=daily_treasury_yield_curve&field_tdr_date_value_month=YYYYMM",
    terms:
      "Open U.S. government data. Bureau of the Fiscal Service: offered free, " +
      "without restriction, to copy, adapt, redistribute or otherwise use for " +
      "non-commercial or commercial purposes. 17 U.S.C. §105.",
    caption: "U.S. Treasury",
    dated: true,
  },
  {
    id: "ecb.europa.eu",
    endpoint: "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml",
    terms:
      "ECB website terms: reuse permitted provided the information appears " +
      "accurately and the ECB is cited as the source.",
    caption: "European Central Bank",
    dated: true,
  },
  {
    id: "published-exchange-hours",
    endpoint:
      "No fetch. Arithmetic over Intl.DateTimeFormat and the published cash " +
      "sessions: jpx.co.jp (TSE 09:00-11:30, 12:30-15:30 JST), " +
      "londonstockexchange.com (SETS 08:00-16:30), nyse.com (Core 09:30-16:00 ET).",
    terms: "Published session hours, cited in src/components/viz/SessionClock.tsx.",
    caption: "Scheduled cash sessions",
    dated: false,
  },
];

const ROUTES = [
  "/", "/firm", "/strategies", "/insights", "/insights/capacity-is-a-research-problem",
  "/team", "/partnership", "/diligence", "/governance", "/letters", "/tearsheet",
  "/questions", "/access", "/contact", "/legal", "/legal/terms", "/legal/privacy",
  "/disclosures",
];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

async function main() {
  const base = process.env.SOURCES_BASE ?? "http://localhost:3000";
  const extra = (process.env.SOURCES_ROUTES ?? "").split(",").filter(Boolean);
  const routes = [...ROUTES, ...extra];

  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const fails: string[] = [];
  const seen = new Map<string, string[]>();
  let scanned = 0;

  /* Tomorrow in UTC, not today: a European feed publishes on a date that is
     still "tomorrow" for a machine running behind UTC, and failing that would
     be the gate being wrong about the clock rather than the data being wrong. */
  const limit = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  for (const route of routes) {
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) {
      console.log(`  skip ${route} (${res?.status()})`);
      continue;
    }
    scanned++;
    const found = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-source]")).map((el) => ({
        id: el.getAttribute("data-source") ?? "",
        asof: el.getAttribute("data-asof"),
        text: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
      }))
    );

    for (const el of found) {
      const src = WHITELIST.find((s) => s.id === el.id);
      if (!src) {
        fails.push(`${route}  data-source="${el.id}" is not whitelisted`);
        continue;
      }
      (seen.get(src.id) ?? seen.set(src.id, []).get(src.id)!).push(route);

      if (!el.text.includes(src.caption)) {
        fails.push(
          `${route}  data-source="${el.id}" renders no source line ` +
            `(expected "${src.caption}" in its text)`
        );
      }
      if (src.dated) {
        if (!el.asof || !ISO.test(el.asof)) {
          fails.push(`${route}  data-source="${el.id}" has no ISO data-asof`);
        } else if (el.asof > limit) {
          fails.push(`${route}  data-source="${el.id}" is dated ${el.asof}, in the future`);
        }
      }
    }
  }
  await browser.close();

  if (fails.length) {
    console.log(`[sources] ${fails.length} failure(s):`);
    for (const f of fails) console.log("  " + f);
    process.exit(1);
  }

  /* Report what was found, not what is allowed: a whitelist entry that appears
     on no route is dead, and a run that found nothing at all should say so
     rather than print a reassuring "clean". */
  const used = [...seen.entries()].map(([id, r]) => `${id} (${r.length})`);
  console.log(
    `[sources] clean across ${scanned} routes — ` +
      (used.length ? used.join(", ") : "no data component rendered on any route")
  );
}

main();
