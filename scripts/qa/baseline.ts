import { chromium } from "playwright";
const W = [390, 768, 1280, 1600];
const main = async () => {
  const b = await chromium.launch();
  for (const w of W) {
    const c = await b.newContext({ viewport: { width: w, height: 900 } });
    const p = await c.newPage();
    await p.goto("https://gc2-site.vercel.app/", { waitUntil: "networkidle" });
    await p.waitForTimeout(3500); // the live build's hero fade is slow
    await p.screenshot({ path: `docs/baseline/live-${w}.png`, fullPage: true });
    await c.close();
    console.log("captured", w);
  }
  await b.close();
};
main();
