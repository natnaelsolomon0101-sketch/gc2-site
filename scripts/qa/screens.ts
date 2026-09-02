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
      // Native-resolution fold shot: never scaled, always trustworthy.
      await page.screenshot({
        path: path.join(outDir, "screens", `${slug}-${width}-fold.png`),
      });
      // Full page, but clipped so Chromium never scales it down. Anything past
      // MAX_TALL is captured as a second frame rather than shrunk.
      const MAX_TALL = 4000;
      const full = await page.evaluate(() => document.documentElement.scrollHeight);
      if (full <= MAX_TALL) {
        await page.screenshot({
          path: path.join(outDir, "screens", `${slug}-${width}.png`),
          fullPage: true,
        });
      } else {
        let i = 0;
        for (let y = 0; y < full; y += MAX_TALL, i++) {
          const h = Math.min(MAX_TALL, full - y);
          await page.screenshot({
            path: path.join(outDir, "screens", `${slug}-${width}${i === 0 ? "" : `-part${i + 1}`}.png`),
            // clip is page-relative only when fullPage is set; without it the
            // clip is viewport-relative and anything below the fold throws.
            fullPage: true,
            clip: { x: 0, y, width, height: h },
          });
        }
      }
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

  // Focus states. A.9 mandates a 2px ledger ring on paper and a stone ring on
  // the black band; neither axe nor Lighthouse tests ring visibility.
  for (const route of ["/", "/contact"]) {
    const slug = route === "/" ? "home" : route.slice(1);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.screenshot({ path: path.join(outDir, "screens", `${slug}-focus-nav.png`) });
    // Focus a link inside the black band directly. A fixed tab count landed
    // mid-page and produced a capture that could not evidence the stone ring.
    await page.evaluate(() => {
      const onBlack = [...document.querySelectorAll("footer a, footer button")];
      const target = onBlack[onBlack.length - 1] as HTMLElement | undefined;
      if (target) { target.scrollIntoView({ block: "center" }); target.focus(); }
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "screens", `${slug}-focus-black.png`) });
    await ctx.close();
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
  const violations = Object.values(axeResults).reduce<number>(
    (n, r) => n + (r as { violations: unknown[] }).violations.length, 0);
  const cErrs = Object.values(consoleErrors).reduce<number>((n, e) => n + e.length, 0);
  return { violations, consoleErrors: cErrs };
}
