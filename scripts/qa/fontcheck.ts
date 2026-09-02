/** Sanity check: the wordmark as the real webfont renders it, next to the outlines cut for the favicon. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const OUT = path.join("docs", "qa", "icons");
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 320 } });
  const svg = fs.readFileSync("public/favicon.svg", "utf8").replace(/width="\d+" height="\d+"/, 'width="240" height="240"');
  await p.setContent(`
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&display=block">
    <body style="margin:0;display:flex;align-items:center;gap:40px;background:#fff">
      <div style="font-family:Newsreader;font-weight:400;font-size:150px;line-height:1">GC2</div>
      ${svg}
    </body>`);
  await p.waitForTimeout(3000);
  await p.screenshot({ path: path.join(OUT, "font-vs-outline.png") });
  await b.close();
  console.log("wrote docs/qa/icons/font-vs-outline.png");
}
main();
