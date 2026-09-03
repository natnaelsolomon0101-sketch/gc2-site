/* sec-hero's own look-at-it script (the preamble permits one under scripts/qa/).
   Shoots the hero at the viewports the Conductor named for round 0, in the
   engine each of them actually runs, and prints the three numbers a screenshot
   cannot show: horizontal overflow, hero height, and the h1's line count.

   Usage: node scripts/qa/hero-shots.mjs [outDir] [port]
*/
import { chromium, webkit, devices } from "playwright";

const out = process.argv[2] ?? "docs/v4/shots/r0-hero";
const port = process.argv[3] ?? "3102";
const url = `http://localhost:${port}/`;

const SHOTS = [
  // name, engine, context options
  ["568x320-landscape", "webkit", { viewport: { width: 568, height: 320 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["740x360-landscape", "chromium", { viewport: { width: 740, height: 360 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["320", "webkit", { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["360-chromium", "chromium", { ...devices["Galaxy S9+"], viewport: { width: 360, height: 740 } }],
  ["360-chromium-chrome", "chromium", { ...devices["Galaxy S9+"] }],
  ["393-poster", "webkit", { ...devices["iPhone 15 Pro"], viewport: { width: 393, height: 852 } }],
  ["393-chrome", "webkit", { ...devices["iPhone 15 Pro"] }],
  ["412-chromium", "chromium", { ...devices["Pixel 7"], viewport: { width: 412, height: 915 } }],
  ["412-chromium-chrome", "chromium", { ...devices["Pixel 7"] }],
  ["430x932", "webkit", { ...devices["iPhone 15 Pro Max"], viewport: { width: 430, height: 932 } }],
  ["430-chrome", "webkit", { ...devices["iPhone 15 Pro Max"] }],
  ["734x393-landscape", "webkit", { ...devices["iPhone 15 Pro landscape"] }],
  ["852x393-landscape", "webkit", { ...devices["iPhone 15 Pro landscape"], viewport: { width: 852, height: 393 } }],
  ["932x430-landscape", "webkit", { ...devices["iPhone 15 Pro Max landscape"], viewport: { width: 932, height: 430 } }],
  ["768", "webkit", { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["1024x1366", "webkit", { viewport: { width: 1024, height: 1366 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["1280", "chromium", { viewport: { width: 1280, height: 720 } }],
  ["1366x768", "chromium", { viewport: { width: 1366, height: 768 } }],
  ["1920-frame", "chromium", { viewport: { width: 1920, height: 1080 } }],
  ["2560", "chromium", { viewport: { width: 2560, height: 1440 } }],
  ["3440", "chromium", { viewport: { width: 3440, height: 1440 } }],
];

const engines = { chromium, webkit };
const browsers = {};
for (const key of new Set(SHOTS.map((s) => s[1]))) browsers[key] = await engines[key].launch();

let bad = 0;
for (const [name, engine, ctxOpts] of SHOTS) {
  const ctx = await browsers[engine].newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400); // let the one-shot entrance finish

  const m = await page.evaluate(() => {
    const hero = document.querySelector(".hv2");
    const h1 = document.querySelector(".hv2-h1");
    const nav = document.querySelector(".sn-header");
    const lines = h1 ? h1.getClientRects().length : 0;
    // count real visual lines: each nowrap span is one, unless it wrapped
    const spans = [...document.querySelectorAll(".hv2-l > span")];
    const spanLines = spans.reduce((n, s) => n + s.getClientRects().length, 0);
    const cta = document.querySelector(".hv2-cta");
    const curve = document.querySelector(".hv2-curve");
    const r = (el) => (el ? el.getBoundingClientRect() : null);
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      heroH: hero ? Math.round(hero.getBoundingClientRect().height) : null,
      navH: nav ? Math.round(nav.getBoundingClientRect().height) : null,
      h1Lines: lines,
      spanLines,
      h1W: Math.round(Math.max(0, ...spans.map((s) => s.getBoundingClientRect().width))),
      h1Cell: h1 ? Math.round(h1.getBoundingClientRect().width) : null,
      h1Font: h1 ? getComputedStyle(h1).fontSize : null,
      ctaBottom: cta ? Math.round(r(cta).bottom) : null,
      curveBottom: curve && getComputedStyle(curve).display !== "none" ? Math.round(r(curve).bottom) : null,
      fold: window.innerHeight,
      clockText: document.querySelector(".hv2-m4")?.textContent?.trim() ?? "",
    };
  });

  await page.screenshot({ path: `${out}/home--${name}--fold.png` });
  const belowFold = [m.ctaBottom, m.curveBottom].filter((v) => v != null && v > m.fold);
  const flags = [];
  if (m.overflow > 0) flags.push(`OVERFLOW ${m.overflow}px`);
  if (m.spanLines !== 2 && !name.includes("landscape")) flags.push(`H1 LINES ${m.spanLines}`);
  if (m.spanLines !== 2) flags.push(`h1 spanLines=${m.spanLines}`);
  if (belowFold.length) flags.push(`BELOW FOLD by ${Math.max(...belowFold) - m.fold}px`);
  if (errors.length) flags.push(`CONSOLE ${errors[0]}`);
  if (flags.length) bad++;
  console.log(
    `${name.padEnd(18)} hero=${String(m.heroH).padStart(4)} nav=${String(m.navH).padStart(3)} fold=${String(m.fold).padStart(4)} ` +
      `h1=${m.h1Font} text=${m.h1W}/${m.h1Cell} lines=${m.spanLines} ctaBottom=${m.ctaBottom} curveBottom=${m.curveBottom} ` +
      `clock="${m.clockText}" ${flags.length ? "→ " + flags.join(" | ") : "ok"}`
  );
  await ctx.close();
}
for (const b of Object.values(browsers)) await b.close();
console.log(bad ? `\n${bad} viewport(s) flagged.` : "\nAll clear.");
