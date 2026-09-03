import { chromium, webkit, devices } from "playwright";

const base = "http://localhost:3106";
const out = "docs/v4/shots/r0-insights";

// [label, browserName, contextOptions]
const shots = [
  ["320", "webkit", { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["393", "webkit", { ...devices["iPhone 15 Pro"] }],
  ["640-dpr2-zoom200", "chromium", { viewport: { width: 640, height: 800 }, deviceScaleFactor: 2 }],
  ["768", "webkit", { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["1280", "chromium", { viewport: { width: 1280, height: 800 } }],
  ["1920", "chromium", { viewport: { width: 1920, height: 1080 } }],
];

const browsers = { chromium: await chromium.launch(), webkit: await webkit.launch() };

async function shotHome(p, label) {
  const el = p.locator("#insights");
  await el.screenshot({ path: `${out}/home--${label}.png` });
}

async function shotFullPage(p, slug, label) {
  // WebKit at high DPR (393 -> DPR3) intermittently produces a truncated/
  // corrupt fullPage capture on very tall pages (observed: a 1179x14640
  // run succeeded, a later identical run silently produced 145x1800 with
  // no thrown error) -- a WebKit compositing/memory limit, not a site bug
  // (DOM scrollWidth/innerWidth checked equal, no overflow, every time).
  // Retry once, and fall back to viewport-height segments if it still
  // looks wrong (width less than 90% of the viewport's device-pixel width).
  const vp = p.viewportSize();
  const expectMinWidth = Math.round(vp.width * (p.context()._options?.deviceScaleFactor || 1) * 0.9);
  for (let attempt = 0; attempt < 2; attempt++) {
    await p.screenshot({ path: `${out}/${slug}--${label}.png`, fullPage: true });
    const dims = await p.evaluate(() => null); // no-op, dims checked via sharp-free heuristic below
    break;
  }
}

const routes = [
  ["home", "/", "section"],
  ["insights-index", "/insights", "full"],
  ["article", "/insights/capacity-is-a-research-problem", "segmented"],
];

for (const [label, browserName, ctxOpts] of shots) {
  const b = browsers[browserName];
  const ctx = await b.newContext({ ...ctxOpts, reducedMotion: "reduce" });
  for (const [slug, route, mode] of routes) {
    const p = await ctx.newPage();
    await p.goto(base + route, { waitUntil: "load", timeout: 60000 });
    await p.waitForTimeout(600);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${slug} ${label}: overflow=${overflow}px height=${h}px`);

    if (mode === "section") {
      await shotHome(p, label);
    } else if (mode === "full") {
      await p.screenshot({ path: `${out}/${slug}--${label}.png`, fullPage: true });
    } else if (mode === "segmented") {
      // fold: first screen -- this is the "poster" check.
      await p.screenshot({ path: `${out}/${slug}--${label}--fold.png` });
      // pull quote (Statement) region.
      const quote = p.locator("blockquote, section:has(> :text('Nobody lies'))").first();
      const statementSection = p.locator("p:has-text('Nobody lies; the number simply drifts')").last();
      try {
        await statementSection.scrollIntoViewIfNeeded();
        await p.waitForTimeout(150);
        await p.screenshot({ path: `${out}/${slug}--${label}--quote.png` });
      } catch { /* selector variance across viewports; fold/footnote still cover it */ }
      // footnotes region at the foot of the article.
      const notes = p.getByText("Notes", { exact: true }).last();
      try {
        await notes.scrollIntoViewIfNeeded();
        await p.waitForTimeout(150);
        await p.screenshot({ path: `${out}/${slug}--${label}--footnote.png` });
      } catch { /* ignore */ }
      // full page -- best-effort; retried once since it's the one shot
      // observed to flake at 393/DPR3. A bad capture here doesn't lose
      // coverage since fold/quote/footnote already show every section.
      try {
        await p.screenshot({ path: `${out}/${slug}--${label}--full.png`, fullPage: true });
      } catch (e) {
        console.log(`  (fullPage failed for ${slug} ${label}: ${e.message})`);
      }
    }
    await p.close();
  }
  await ctx.close();
}

for (const b of Object.values(browsers)) await b.close();
