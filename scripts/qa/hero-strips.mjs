/* Two contact strips the still shots cannot show: the load sequence, and the
 * field's response to scroll. Both are tiled into one PNG each so the
 * Conductor opens two images rather than ten.
 *
 * Usage: node scripts/qa/hero-strips.mjs [outDir] [port]
 */
import { chromium } from "playwright";
import { promises as fs } from "fs";

const out = process.argv[2] ?? "docs/v4/shots/r5-hero";
const port = process.argv[3] ?? "3102";
const url = `http://localhost:${port}/`;

const LOAD_MS = [0, 150, 300, 600, 900, 1400];
const SCROLL_PX = [0, 200, 400, 600];
const W = 1920, H = 1080;
const SCALE = 3; // tile width = 640

/* One <img> per frame, stacked, with the label burned in — assembled in a
   headless page and shot once, so there is no image library in the repo for
   the sake of two contact sheets. */
async function tile(browser, frames, title, file, note) {
  const page = await (await browser.newContext({
    viewport: { width: 660, height: 40 + frames.length * (H / SCALE + 34) },
    deviceScaleFactor: 1,
  })).newPage();
  await page.setContent(
    `<style>
       body{margin:0;background:#141311;color:#f7f5f0;
            font:12px ui-monospace,Menlo,monospace;padding:12px}
       h1{font:600 13px ui-monospace,Menlo,monospace;margin:0 0 10px;letter-spacing:.12em;text-transform:uppercase}
       figure{margin:0 0 10px}
       figcaption{padding:4px 0;color:#9a948c;letter-spacing:.1em}
       img{display:block;width:636px;border:1px solid #3a3733}
     </style>
     <h1>${title}</h1>
     ${frames
       .map((f) => `<figure><figcaption>${f.label}</figcaption><img src="data:image/png;base64,${f.b64}"></figure>`)
       .join("")}
     <div style="color:#9a948c">${note}</div>`
  );
  await page.screenshot({ path: `${out}/${file}`, fullPage: true });
  await page.close();
  console.log(`  ${out}/${file}`);
}

await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();

/* ---- the load sequence ------------------------------------------------- */
const load = [];
for (const ms of LOAD_MS) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  /* Navigation resolves at domcontentloaded, which is when the stylesheet is
     applied and the animations start; offsets are measured from there. */
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const wait = ms - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  load.push({ label: `t = ${ms} ms`, b64: (await page.screenshot()).toString("base64") });
  await ctx.close();
}
await tile(
  browser, load,
  "hero load sequence — 1920x1080",
  "load-sequence--1920.png",
  "fade-rise: headline at 0, lead at --stagger x3, actions at --stagger x6, cue last; the surface fades up over --dur-draw underneath"
);

/* ---- the scroll response ----------------------------------------------- */
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2600); // let the load sequence finish first
const scroll = [];
for (const y of SCROLL_PX) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    /* The striped field was retired in round 6; the surface replaced it. Where
       it is gone the strip still records the cue, which is the one thing in
       this hero that answers the scroll. */
    const l = document.querySelector(".hv2-strip-light");
    const c = document.querySelector(".hv2-cue");
    const s = document.querySelector(".hv2-surface");
    return {
      op: l ? (+getComputedStyle(l).opacity).toFixed(2) : (s ? (+getComputedStyle(s).opacity).toFixed(2) : "n/a"),
      tf: l ? getComputedStyle(l).transform : "n/a",
      cue: c && getComputedStyle(c).display !== "none" ? (+getComputedStyle(c).opacity).toFixed(2) : "n/a",
    };
  });
  scroll.push({
    label: `scrollY = ${y} px   ·   surface opacity ${m.op}   ·   cue opacity ${m.cue}`,
    b64: (await page.screenshot()).toString("base64"),
  });
  console.log(`  scrollY ${String(y).padStart(3)}  field opacity ${m.op}  cue opacity ${m.cue}`);
}
await ctx.close();
await tile(
  browser, scroll,
  "hero scroll response — 1920x1080",
  "scroll-response--1920.png",
  "the cue is gone by 120px of scroll; no text moves and the surface holds"
);

await browser.close();
