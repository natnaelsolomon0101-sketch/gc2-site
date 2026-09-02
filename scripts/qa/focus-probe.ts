import { chromium } from "playwright";
const main = async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
  // Real keyboard focus so :focus-visible actually matches.
  for (let i = 0; i < 60; i++) {
    await p.keyboard.press("Tab");
    
    const info = await p.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || "").trim().slice(0, 26),
        href: el.getAttribute("href"),
        outline: cs.outlineColor, width: cs.outlineWidth,
        matchesFocusVisible: el.matches(":focus-visible"),
        tag: el.tagName,
        cls: el.className.toString().slice(0, 60),
      };
    });
    if (info?.href?.includes("/strategies#")) { console.log("STRATEGY ROW:", JSON.stringify(info)); break; }
  }
  await b.close();
};
main();
