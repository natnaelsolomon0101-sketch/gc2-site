import { chromium, webkit, devices } from "playwright";

const base = "http://localhost:3106";
const out = "docs/v4/shots/r1-insights";

// [label, browserName, contextOptions]
const shots = [
  ["320", "webkit", { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["393", "webkit", { ...devices["iPhone 15 Pro"] }],
  ["1280", "chromium", { viewport: { width: 1280, height: 800 } }],
  ["1920", "chromium", { viewport: { width: 1920, height: 1080 } }],
  ["3440", "chromium", { viewport: { width: 3440, height: 1440 } }],
];

const routes = [
  ["home", "/", "section"],
  ["article", "/insights/capacity-is-a-research-problem", "segmented"],
];

const browsers = { chromium: await chromium.launch(), webkit: await webkit.launch() };

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
      // Plain locator.screenshot() scrolls the element's top edge to y=0,
      // which puts it directly under the fixed nav -- the nav then paints
      // over the top of the captured region (a capture artifact, not a
      // site bug: scrollIntoView doesn't know about position:fixed chrome).
      // Scroll manually so the section sits clear of the nav first.
      const el = p.locator("#insights");
      await el.scrollIntoViewIfNeeded();
      const navH = await p.evaluate(() => {
        const nav = document.querySelector("header, nav, [class*='nav-frame']");
        return nav ? Math.ceil(nav.getBoundingClientRect().height) : 96;
      });
      await p.evaluate((offset) => window.scrollBy(0, -offset - 8), navH);
      await p.waitForTimeout(120);
      await el.screenshot({ path: `${out}/${slug}--${label}.png` });
    } else if (mode === "segmented") {
      // fold: first screen -- poster check.
      await p.screenshot({ path: `${out}/${slug}--${label}--fold.png` });
      // pull quote (Statement) region.
      const statementSection = p.locator("p:has-text('Nobody lies; the number simply drifts')").last();
      try {
        await statementSection.scrollIntoViewIfNeeded();
        await p.waitForTimeout(150);
        await p.screenshot({ path: `${out}/${slug}--${label}--quote.png` });
      } catch { /* ignore */ }
      // footnotes region.
      const notesHeading = p.getByText("Notes", { exact: true }).last();
      try {
        await notesHeading.scrollIntoViewIfNeeded();
        await p.waitForTimeout(150);
        await p.screenshot({ path: `${out}/${slug}--${label}--footnote.png` });
      } catch { /* ignore */ }
      // full page best-effort (can flake on very tall WebKit/high-DPR
      // pages -- see r0-shots.mjs note; fold/quote/footnote already cover
      // every section so a failure here loses no coverage).
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
