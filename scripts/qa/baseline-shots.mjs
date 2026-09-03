import { chromium, devices } from "playwright";
const out = "docs/v4/shots/baseline";
const shots = [
  ["320", { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["393", { ...devices["iPhone 15 Pro"] }],
  ["768", { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["1280", { viewport: { width: 1280, height: 720 } }],
  ["1920", { viewport: { width: 1920, height: 1080 } }],
  ["3440", { viewport: { width: 3440, height: 1440 } }],
];
const routes = ["/", "/strategies", "/questions", "/contact", "/insights/capacity-is-a-research-problem"];
const b = await chromium.launch();
for (const [name, ctxOpts] of shots) {
  const ctx = await b.newContext({ ...ctxOpts, reducedMotion: "reduce" });
  for (const r of routes) {
    const p = await ctx.newPage();
    await p.goto("http://localhost:3000" + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    const slug = r === "/" ? "home" : r.replace(/\//g, "_").replace(/^_/, "");
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.screenshot({ path: `${out}/${slug}--${name}--fold.png` });
    if (r === "/") await p.screenshot({ path: `${out}/${slug}--${name}--full.png`, fullPage: true });
    console.log(`${slug} ${name}: overflow=${overflow}px height=${h}px`);
    await p.close();
  }
  await ctx.close();
}
await b.close();
