/**
 * Proves the §4.3 print rules fire on a note and nowhere else.
 * Output: docs/qa/print/.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { chromium } from "playwright";

const OUT = path.join("docs", "qa", "print");
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
  fs.mkdirSync(OUT, { recursive: true });
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
    const results: Record<string, unknown> = {};

    for (const [route, name] of [
      ["/insights/trade-the-regime-not-the-forecast", "note"],
      ["/disclosures", "disclosures"],
    ] as const) {
      const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.emulateMedia({ media: "print" });
      await page.waitForTimeout(300);

      // Evaluated as source text: tsx's transform injects an esbuild helper
      // (`__name`) into function literals, which does not exist in the page.
      results[route] = await page.evaluate(`(function () {
        function vis(sel) {
          var el = document.querySelector(sel);
          if (!el) return "absent";
          return getComputedStyle(el).display === "none" ? "hidden" : "visible";
        }
        var link = document.querySelector("main a[href]");
        var h1 = document.querySelector("h1");
        var prose = document.querySelector(".prose-gc2");
        return {
          header: vis("body > header"),
          footer: vis("body > footer"),
          skipLink: vis('body > a[href="#main"]'),
          headingColor: h1 ? getComputedStyle(h1).color : null,
          proseMaxWidth: prose ? getComputedStyle(prose).maxWidth : null,
          linkUrlAfter: link ? getComputedStyle(link, "::after").content : null
        };
      })()`);

      await page.screenshot({ path: path.join(OUT, `${name}-print.png`), fullPage: true });
      await page.close();
    }

    await browser.close();
    fs.writeFileSync(path.join(OUT, "print.json"), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally {
    stop();
  }
}
main();
