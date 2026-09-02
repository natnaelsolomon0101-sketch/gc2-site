/** One route, one mobile Lighthouse run, the numbers that matter. For A/B work. */
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";

const route = process.argv[2] ?? "/contact";
const label = process.argv[3] ?? "run";
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
        if ((await fetch(base + route)).ok) break;
      } catch {
        /* not up */
      }
      await wait(500);
    }
    const out = `/tmp/lh-${label}.json`;
    execFileSync(
      "npx",
      ["lighthouse", base + route, "--form-factor=mobile", "--output=json", `--output-path=${out}`, "--quiet", "--chrome-flags=--headless"],
      { stdio: "ignore", timeout: 240000 },
    );
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    const hi = j.audits["network-requests"].details.items.filter(
      (i: { priority: string }) => i.priority === "High" || i.priority === "VeryHigh",
    );
    console.log(
      JSON.stringify({
        label,
        route,
        perf: Math.round(j.categories.performance.score * 100),
        lcp: j.audits["largest-contentful-paint"].displayValue,
        lcpMs: Math.round(j.audits["largest-contentful-paint"].numericValue),
        fcp: j.audits["first-contentful-paint"].displayValue,
        cls: j.audits["cumulative-layout-shift"].numericValue,
        highPriorityBytes: hi.reduce((a: number, b: { transferSize?: number }) => a + (b.transferSize ?? 0), 0),
      }),
    );
  } finally {
    stop();
  }
}
main();
