import { chromium, webkit, devices } from "playwright";
import { execFileSync } from "node:child_process";

const base = "http://localhost:3106";
const out = "docs/v4/shots/light-insights";

// Crops a document-relative CSS-px rect out of a fullPage PNG. Avoids every
// cross-engine scrollIntoView difference (locator.screenshot() re-scrolls
// before capturing -- confirmed WebKit does this even after a manual
// pre-scroll, which re-aligns the element under the fixed nav -- and a
// manual scroll + viewport-relative clip breaks for elements taller than
// the viewport, since scrollIntoViewIfNeeded on an overlong element can
// leave its top above y=0). fullPage capture + a document-relative crop
// has no scroll-position dependency at all.
function cropFullPage(srcPath, dstPath, docBox, dpr) {
  const [x, y, w, h] = [docBox.x * dpr, docBox.y * dpr, docBox.width * dpr, docBox.height * dpr];
  execFileSync("python3", ["-c", `
from PIL import Image
im = Image.open("${srcPath}")
im.crop((${x}, ${y}, ${x + w}, ${y + h})).save("${dstPath}")
`]);
}

const shots = [
  ["320", "webkit", { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["393", "webkit", { ...devices["iPhone 15 Pro"] }],
  ["768", "webkit", { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["1280", "chromium", { viewport: { width: 1280, height: 800 } }],
  ["1920", "chromium", { viewport: { width: 1920, height: 1080 } }],
  ["3440", "chromium", { viewport: { width: 3440, height: 1440 } }],
];

const routes = [
  ["home", "/", "section"],
  ["insights-index", "/insights", "full"],
  ["article", "/insights/capacity-is-a-research-problem", "full"],
];

const browsers = { chromium: await chromium.launch(), webkit: await webkit.launch() };

for (const [label, browserName, ctxOpts] of shots) {
  const b = browsers[browserName];
  const ctx = await b.newContext({ ...ctxOpts, reducedMotion: "reduce" });
  for (const [slug, route, mode] of routes) {
    const p = await ctx.newPage();
    await p.goto(base + route, { waitUntil: "load", timeout: 60000 });
    await p.waitForTimeout(500);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${slug} ${label}: overflow=${overflow}px`);
    if (mode === "section") {
      const docBox = await p.locator("#insights").evaluate((node) => {
        const r = node.getBoundingClientRect();
        return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
      });
      const dpr = await p.evaluate(() => window.devicePixelRatio);
      const tmp = `${out}/.tmp-${slug}-${label}.png`;
      await p.screenshot({ path: tmp, fullPage: true });
      cropFullPage(tmp, `${out}/${slug}--${label}.png`, docBox, dpr);
      execFileSync("rm", ["-f", tmp]);
    } else {
      await p.screenshot({ path: `${out}/${slug}--${label}.png`, fullPage: true });
    }
    await p.close();
  }
  await ctx.close();
}

// Dark-scheme identity check: the site must not change under
// prefers-color-scheme: dark. One representative shot per owned route,
// diffed by eye against the light shot above (colorScheme forced dark).
const identCtx = await browsers.chromium.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "dark", reducedMotion: "reduce" });
for (const [slug, route, mode] of routes) {
  const p = await identCtx.newPage();
  await p.goto(base + route, { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(400);
  if (mode === "section") {
    const docBox = await p.locator("#insights").evaluate((node) => {
      const r = node.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
    });
    const dpr = await p.evaluate(() => window.devicePixelRatio);
    const tmp = `${out}/.tmp-${slug}-dark.png`;
    await p.screenshot({ path: tmp, fullPage: true });
    cropFullPage(tmp, `${out}/${slug}--1280--dark-scheme.png`, docBox, dpr);
    execFileSync("rm", ["-f", tmp]);
  } else {
    await p.screenshot({ path: `${out}/${slug}--1280--dark-scheme.png`, fullPage: true });
  }
  await p.close();
}
await identCtx.close();

for (const b of Object.values(browsers)) await b.close();
