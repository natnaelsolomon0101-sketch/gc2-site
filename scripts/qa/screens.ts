import { chromium, type Browser } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const WIDTHS = [390, 768, 1280, 1600];

export async function runScreens(base: string, outDir: string, routes: string[]) {
  fs.mkdirSync(path.join(outDir, "screens"), { recursive: true });
  const browser: Browser = await chromium.launch();
  const axeResults: Record<string, unknown> = {};
  const consoleErrors: Record<string, string[]> = {};

  for (const route of routes) {
    const slug = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      const errs: string[] = [];
      page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
      await page.goto(base + route, { waitUntil: "networkidle" });
      // A.6 reveals run once on load; wait them out so shots are of the settled page.
      await page.waitForTimeout(900);
      await page.screenshot({
        path: path.join(outDir, "screens", `${slug}-${width}.png`),
        fullPage: true,
      });
      if (width === 1280) {
        consoleErrors[slug] = errs;
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        axeResults[slug] = {
          violations: axe.violations.map((v) => ({
            id: v.id, impact: v.impact, help: v.help,
            nodes: v.nodes.map((n) => n.target.join(" ")),
          })),
        };
      }
      await ctx.close();
    }
  }

  // Reduced motion: the hero must render in its final state (A.6).
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outDir, "screens", "home-1280-reduced.png"), fullPage: true });
    await ctx.close();
  }

  // Mobile nav open at 390.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const btn = page.locator("button[aria-controls], button[aria-label*='enu'], header button").first();
    if (await btn.count()) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outDir, "screens", "home-390-nav-open.png") });
    }
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, "axe.json"), JSON.stringify(axeResults, null, 2));
  fs.writeFileSync(path.join(outDir, "console-errors.json"), JSON.stringify(consoleErrors, null, 2));
  const violations = Object.values(axeResults).reduce(
    (n, r) => n + ((r as { violations: unknown[] }).violations.length), 0) as number;
  const cErrs = Object.values(consoleErrors).reduce((n, e) => n + e.length, 0);
  return { violations, consoleErrors: cErrs };
}
