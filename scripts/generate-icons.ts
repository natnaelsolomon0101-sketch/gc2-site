/**
 * Generates the favicon set from the wordmark. SWARM §4.3: cut from the
 * wordmark, on paper, no rounded tile.
 *
 *   public/favicon.svg          scalable, Newsreader 400 outlines as real paths
 *   public/icon.png             32
 *   public/apple-touch-icon.png 180
 *
 * The two PNGs are rasterised from that same SVG rather than typeset a second
 * time, so all three icons are the one artwork at three sizes. Verified against
 * the live webfont in scripts/qa/fontcheck.ts.
 *
 * Run: npx tsx scripts/generate-icons.ts
 * Outputs are committed; this does not run at build time.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { readFont } from "./lib/glyf";
import { palette } from "../src/config/tokens";
import { site } from "../src/config/site";

const round = (n: number, p = 2) => Number(n.toFixed(p));

const root = process.cwd();
// A.4 puts the wordmark in Newsreader 400; globals.css `.t-wordmark` agrees.
const font = readFont(readFileSync(path.join(root, "src/app/_og/Newsreader-Regular.ttf")));

const BOX = 64;
const PAD = 4;

/**
 * The wordmark laid out to fill `box` with `pad` of paper on every side.
 * Cap height, not em height, drives the vertical fit: the mark is three
 * cap-height forms with no ascender and no descender, so centring on the em
 * box would sit it visibly low.
 */
function wordmark(box: number, pad: number) {
  const glyphs = [...site.mark];
  const widths = glyphs.map((g) => font.advance(g));
  const widthUnits = widths.reduce((a, b) => a + b, 0);
  const capUnits = font.unitsPerEm * 0.7;

  const inner = box - pad * 2;
  const scale = Math.min(inner / widthUnits, inner / capUnits);
  const originX = (box - widthUnits * scale) / 2;
  const baselineY = (box - capUnits * scale) / 2 + capUnits * scale;

  let cursor = 0;
  const paths: string[] = [];
  glyphs.forEach((g, i) => {
    const d = font.path(g);
    if (d) paths.push(`<path transform="translate(${round(cursor)} 0)" d="${d}"/>`);
    cursor += widths[i];
  });

  return (
    `<g transform="translate(${round(originX)} ${round(baselineY)}) ` +
    `scale(${round(scale, 6)} ${round(-scale, 6)})" fill="${palette.black}">` +
    paths.join("") +
    `</g>`
  );
}

function svg(width = BOX) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}" width="${width}" height="${width}">` +
    `<rect width="${BOX}" height="${BOX}" fill="${palette.paper}"/>` +
    wordmark(BOX, PAD) +
    `</svg>`
  );
}

async function main() {
  writeFileSync(path.join(root, "public/favicon.svg"), svg());

  const browser = await chromium.launch();
  for (const [size, file] of [
    [32, "public/icon.png"],
    [180, "public/apple-touch-icon.png"],
  ] as const) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(
      `<body style="margin:0;line-height:0">${svg(size)}</body>`,
      { waitUntil: "load" },
    );
    await page.screenshot({ path: path.join(root, file), omitBackground: false });
    await page.close();
  }
  await browser.close();
  console.log("wrote public/favicon.svg, public/icon.png, public/apple-touch-icon.png");
}

main();
