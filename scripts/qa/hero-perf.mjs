/* sec-hero's LCP / CLS probe for the §9 gate.
 *
 * WebKit cannot throttle — Playwright exposes no network or CPU emulation for
 * it — so the throttled numbers come from Chromium over CDP at the Pixel 7
 * descriptor, on Lighthouse's own "Slow 4G" figures (1.6 Mbps down, 750 Kbps
 * up, 150ms RTT) with a 4x CPU slowdown. WebKit at 393 is measured unthrottled
 * alongside it, because that is the engine the poster actually ships on and its
 * layout-shift behaviour is what CLS 0 has to hold in.
 *
 * Usage: node scripts/qa/hero-perf.mjs [port] [runs]
 */
import { chromium, webkit, devices } from "playwright";

const port = process.argv[2] ?? "3102";
const RUNS = Number(process.argv[3] ?? 3);
const url = `http://localhost:${port}/`;

/* Collected in the page before anything else runs. LCP reports the largest
   contentful paint so far and can fire several times; the last one before the
   page is idle is the real one. Layout shifts without recent input sum to CLS. */
const PROBE = `
  window.__perf = { lcp: 0, cls: 0, lcpEl: "", shifts: [] };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      window.__perf.lcp = e.startTime;
      window.__perf.lcpEl = e.element
        ? e.element.tagName.toLowerCase() +
          (e.element.className ? "." + String(e.element.className).split(" ").join(".") : "")
        : "(none)";
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__perf.cls += e.value;
      if (e.value > 0.0001) {
        window.__perf.shifts.push({
          v: +e.value.toFixed(5),
          t: Math.round(e.startTime),
          nodes: (e.sources || []).map((s) =>
            s.node ? s.node.nodeName.toLowerCase() +
              (s.node.className ? "." + String(s.node.className).split(" ")[0] : "") : "?"),
        });
      }
    }
  }).observe({ type: "layout-shift", buffered: true });
`;

async function measure(engine, ctxOpts, throttle, label) {
  const browser = await (engine === "chromium" ? chromium : webkit).launch();
  const out = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.newContext(ctxOpts);
    const page = await ctx.newPage();
    await page.addInitScript(PROBE);
    if (throttle) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
        latency: 150,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.goto(url, { waitUntil: "load" });
    /* Long enough for the clock to hydrate (its first tick) and for any late
       font swap or image decode to shift something if it is going to. */
    await page.waitForTimeout(4000);
    const p = await page.evaluate(() => window.__perf);
    out.push(p);
    await ctx.close();
  }
  await browser.close();
  const med = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  const lcp = med(out.map((o) => o.lcp));
  const cls = med(out.map((o) => o.cls));
  const shifts = out.flatMap((o) => o.shifts);
  console.log(
    `${label.padEnd(34)} LCP ${(lcp / 1000).toFixed(3)}s ${lcp < 1500 ? "PASS" : "FAIL (>1.5s)"}   ` +
      `CLS ${cls.toFixed(4)} ${cls === 0 ? "PASS" : "FAIL (>0)"}   LCP element: ${out[0].lcpEl}`
  );
  if (shifts.length) {
    console.log("    shifts:", JSON.stringify(shifts.slice(0, 6)));
  }
  return { lcp, cls };
}

await measure(
  "chromium",
  { ...devices["Pixel 7"] },
  true,
  "412 Chromium, Slow 4G + 4x CPU"
);
await measure(
  "webkit",
  { ...devices["iPhone 15 Pro"], viewport: { width: 393, height: 852 } },
  false,
  "393 WebKit, unthrottled"
);
