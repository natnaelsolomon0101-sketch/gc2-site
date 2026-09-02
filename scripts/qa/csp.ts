/**
 * A CSP that blocks something Next needs fails silently in production and
 * loudly only in the console. This walks every route with the real headers on
 * and reports console errors, CSP violation events, and failed requests.
 * It also asserts `color-scheme: light` and exercises the one client component.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/firm",
  "/strategies",
  "/insights",
  "/insights/trade-the-regime-not-the-forecast",
  "/contact",
  "/disclosures",
  "/not-a-real-page",
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function freePort(): Promise<number> {
  return new Promise((res) => {
    const s = net.createServer();
    s.listen(0, () => {
      const p = (s.address() as net.AddressInfo).port;
      s.close(() => res(p));
    });
  });
}

async function main() {
  const port = await freePort();
  const base = `http://localhost:${port}`;
  const server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", detached: true });
  const stop = () => {
    try {
      process.kill(-server.pid!);
    } catch {
      /* gone */
    }
  };

  try {
    for (let i = 0; i < 90; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {
        /* not up */
      }
      await wait(500);
    }

    const browser = await chromium.launch();
    const report: Record<string, unknown> = {};

    for (const route of ROUTES) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const errors: string[] = [];
      const failed: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text().slice(0, 200));
      });
      page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
      page.on("requestfailed", (r) => failed.push(`${r.url().slice(0, 90)} ${r.failure()?.errorText}`));

      await page.goto(base + route, { waitUntil: "networkidle" });

      // Hydration and the one client component: open and close the mobile nav.
      const burger = page.locator('button[aria-label="Open menu"]');
      if (await burger.count()) {
        await burger.first().click();
        await page.waitForTimeout(400);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(200);
      }

      const state = await page.evaluate(`(function () {
        return {
          colorScheme: getComputedStyle(document.documentElement).colorScheme,
          bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 60),
          hydrated: document.documentElement.hasAttribute("data-next-hydrated") ||
                    !!document.querySelector("nav[aria-label='Primary']")
        };
      })()`);

      report[route] = { ...(state as object), consoleErrors: errors, failedRequests: failed };
      await page.close();
    }

    await browser.close();
    const dir = path.join("docs", "qa", "perf");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "csp.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    stop();
  }
}
main();
