/**
 * The §4.3 infrastructure gate, run against a real `next start`.
 *
 *   docs/qa/og/          every OG card, as a PNG, to be looked at
 *   docs/qa/perf/headers.txt      curl -I for every route and asset
 *   docs/qa/perf/lighthouse.json  mobile Lighthouse, all four categories, EVERY route
 *   docs/qa/perf/vitals.json      LCP element and CLS per route, measured in-page
 *
 * Run: npx tsx scripts/qa/perf.ts   (expects `next build` to have run)
 */
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/firm",
  "/strategies",
  "/insights",
  "/insights/trade-the-regime-not-the-forecast",
  "/contact",
  "/disclosures",
];

const OG = [
  ["/opengraph-image", "home.png"],
  ["/insights/trade-the-regime-not-the-forecast/opengraph-image", "note-trade-the-regime.png"],
  ["/insights/the-honest-cost-of-convexity/opengraph-image", "note-honest-cost.png"],
  ["/insights/capacity-is-a-research-problem/opengraph-image", "note-capacity.png"],
] as const;

const ASSETS = ["/surface.svg", "/favicon.svg", "/icon.png", "/apple-touch-icon.png", "/insights/feed.xml", "/robots.txt", "/sitemap.xml"];

const OG_DIR = path.join("docs", "qa", "og");
const PERF_DIR = path.join("docs", "qa", "perf");

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function freePort(): Promise<number> {
  return new Promise((res) => {
    const s = net.createServer();
    s.listen(0, () => {
      const p = (s.address() as net.AddressInfo).port;
      s.close(() => res(p));
    });
  });
}

async function waitForServer(base: string, tries = 90) {
  for (let i = 0; i < tries; i++) {
    try {
      if ((await fetch(base)).ok) return true;
    } catch {
      /* not up yet */
    }
    await wait(500);
  }
  return false;
}

/** LCP element and cumulative layout shift, measured the way a browser sees them. */
async function vitals(base: string) {
  const browser = await chromium.launch();
  const out: Record<string, unknown> = {};
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: unknown[]; __cls: number };
      w.__lcp = [];
      w.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          const el = (e as unknown as { element?: Element }).element;
          w.__lcp.push({
            t: Math.round(e.startTime),
            tag: el?.tagName ?? null,
            cls: (el as HTMLElement | undefined)?.className?.toString().slice(0, 60) ?? null,
            size: (e as unknown as { size: number }).size,
          });
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          const s = e as unknown as { value: number; hadRecentInput: boolean };
          if (!s.hadRecentInput) w.__cls += s.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const v = await page.evaluate(() => {
      const w = window as unknown as { __lcp: { t: number; tag: string; size: number }[]; __cls: number };
      const last = w.__lcp[w.__lcp.length - 1];
      return { lcpMs: last?.t ?? null, lcpElement: last?.tag ?? null, lcpSize: last?.size ?? null, cls: Number(w.__cls.toFixed(4)) };
    });
    out[route] = v;
    await ctx.close();
  }
  await browser.close();
  return out;
}

async function main() {
  fs.mkdirSync(OG_DIR, { recursive: true });
  fs.mkdirSync(PERF_DIR, { recursive: true });

  const port = await freePort();
  const base = `http://localhost:${port}`;
  const server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", detached: true });
  const stop = () => {
    try {
      process.kill(-server.pid!);
    } catch {
      /* already gone */
    }
  };

  try {
    if (!(await waitForServer(base))) throw new Error("server never came up");

    console.log("[perf] og cards");
    for (const [route, file] of OG) {
      const r = await fetch(base + route);
      if (!r.ok) throw new Error(`${route} -> ${r.status}`);
      fs.writeFileSync(path.join(OG_DIR, file), Buffer.from(await r.arrayBuffer()));
    }

    console.log("[perf] headers");
    let headers = "";
    for (const p of [...ROUTES, ...ASSETS]) {
      headers += `$ curl -I ${base}${p}\n`;
      headers += execFileSync("curl", ["-sI", base + p], { encoding: "utf8" });
      headers += "\n";
    }
    fs.writeFileSync(path.join(PERF_DIR, "headers.txt"), headers);

    console.log("[perf] vitals");
    const v = await vitals(base);
    fs.writeFileSync(path.join(PERF_DIR, "vitals.json"), JSON.stringify(v, null, 2));

    console.log("[perf] lighthouse mobile, every route");
    const lh: Record<string, Record<string, number>> = {};
    for (const route of ROUTES) {
      const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      const out = path.join(PERF_DIR, `lighthouse-${slug}.json`);
      try {
        // Lighthouse launches its own Chrome; back to back on one machine it
        // intermittently fails to connect. Retry rather than record a -1 that
        // is a harness artefact, not a page defect.
        let lastErr: unknown;
        let ok = false;
        for (let attempt = 0; attempt < 3 && !ok; attempt++) {
          if (attempt) await wait(4000);
          try {
            execFileSync(
              "npx",
              [
                "lighthouse",
                base + route,
                "--form-factor=mobile",
                "--output=json",
                `--output-path=${out}`,
                "--quiet",
                "--chrome-flags=--headless",
              ],
              { stdio: "ignore", timeout: 240000 },
            );
            ok = true;
          } catch (err) {
            lastErr = err;
          }
        }
        if (!ok) throw lastErr;
        const j = JSON.parse(fs.readFileSync(out, "utf8"));
        lh[route] = Object.fromEntries(
          Object.entries(j.categories as Record<string, { score: number }>).map(([k, val]) => [
            k,
            Math.round((val.score ?? 0) * 100),
          ]),
        );
        lh[route].lcpMs = Math.round(j.audits["largest-contentful-paint"]?.numericValue ?? -1);
        lh[route].cls = Number((j.audits["cumulative-layout-shift"]?.numericValue ?? -1).toFixed(3));
        lh[route].tbtMs = Math.round(j.audits["total-blocking-time"]?.numericValue ?? -1);
      } catch (e) {
        lh[route] = { error: -1 };
        console.error(`  ${route} failed`, (e as Error).message.slice(0, 200));
      }
      console.log(" ", route, JSON.stringify(lh[route]));
    }
    fs.writeFileSync(path.join(PERF_DIR, "lighthouse.json"), JSON.stringify(lh, null, 2));

    stop();
    console.log("\n[perf] done");
  } catch (e) {
    stop();
    throw e;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
