import { chromium } from "playwright";
const main = async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  await p.addInitScript(() => {
    (window as any).__lcp = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        const el = (e as any).element as Element | undefined;
        (window as any).__lcp.push({
          t: Math.round(e.startTime),
          tag: el?.tagName, cls: (el as HTMLElement)?.className?.toString().slice(0, 50),
          size: (e as any).size,
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await p.goto("http://localhost:4400", { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  console.log(JSON.stringify(await p.evaluate(() => (window as any).__lcp), null, 1));
  await b.close();
};
main();
