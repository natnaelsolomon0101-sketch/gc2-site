/** Renders the favicon set large enough to actually look at. Output: docs/qa/icons/. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "qa", "icons");

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 560, height: 560 } });

  const svg = fs.readFileSync("public/favicon.svg", "utf8").replace(/width="\d+" height="\d+"/, 'width="512" height="512"');
  await p.setContent(`<body style="margin:24px;background:#888">${svg}</body>`);
  await p.screenshot({ path: path.join(OUT, "favicon-svg-512.png") });

  // The two PNGs at true size and blown up, so aliasing at 32 is visible.
  const uri = (f: string) =>
    `data:image/png;base64,${fs.readFileSync(path.join("public", f)).toString("base64")}`;
  await p.setContent(
    `<body style="margin:24px;background:#888;display:flex;gap:24px;align-items:flex-start">
       <img src="${uri("icon.png")}" width="32" height="32">
       <img src="${uri("icon.png")}" width="256" height="256" style="image-rendering:pixelated">
       <img src="${uri("apple-touch-icon.png")}" width="180" height="180">
     </body>`,
  );
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, "png-set.png") });

  await b.close();
  console.log(`wrote ${OUT}`);
}
main();
