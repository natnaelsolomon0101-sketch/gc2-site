import { chromium } from "playwright";
const main = async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
  // Assert styles actually loaded — the a11y-auditor warned that a degraded
  // next start serves CSS as 500/404 and every geometry read becomes garbage.
  const styled = await p.evaluate(() => getComputedStyle(document.querySelector("header")!).position);
  console.log("header position (must be 'sticky'):", styled);
  if (styled !== "sticky") { console.log("STYLES NOT LOADED — measurements would be garbage"); await b.close(); return; }

  await p.keyboard.press("Tab");
  const skip = await p.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const r = el.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
    const hit = document.elementFromPoint(cx, cy);
    return { text: (el.textContent || "").trim(), zIndex: getComputedStyle(el).zIndex,
             hitIsSkipLink: hit === el || el.contains(hit),
             hitTag: hit?.tagName, hitClass: (hit as HTMLElement)?.className?.toString().slice(0, 40) };
  });
  console.log("skip link on first Tab:", JSON.stringify(skip));

  const mainFocusable = await p.evaluate(() => document.querySelector("main")?.getAttribute("tabindex"));
  console.log("main tabindex:", mainFocusable);

  // Drawer focus return at 390.
  const m = await b.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await m.newPage();
  await mp.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await mp.click("header button");
  await mp.waitForTimeout(300);
  await mp.keyboard.press("Escape");
  await mp.waitForTimeout(300);
  console.log("focus after Escape:", await mp.evaluate(() => {
    const a = document.activeElement as HTMLElement;
    return a.tagName + " " + (a.getAttribute("aria-label") || "");
  }));
  await b.close();
};
main();
