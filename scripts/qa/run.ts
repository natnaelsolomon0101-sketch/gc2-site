import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { runScreens } from "./screens";
import { runChecklist } from "./checklist";

const ROUTES = ["/", "/firm", "/strategies", "/insights", "/contact", "/disclosures"];

function freePort(): Promise<number> {
  return new Promise((res) => {
    const s = net.createServer();
    s.listen(0, () => { const p = (s.address() as net.AddressInfo).port; s.close(() => res(p)); });
  });
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(base: string, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(base); if (r.ok) return true; } catch { /* not up yet */ }
    await wait(500);
  }
  return false;
}

function nextRoundDir(): string {
  const root = path.join("docs", "qa");
  fs.mkdirSync(root, { recursive: true });
  const ns = fs.readdirSync(root).map((d) => /^round-(\d+)$/.exec(d)?.[1]).filter(Boolean).map(Number);
  const n = ns.length ? Math.max(...ns) + 1 : 0;
  const dir = path.join(root, `round-${n}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function main() {
  const outDir = process.env.QA_DIR || nextRoundDir();
  const port = await freePort();
  const base = `http://localhost:${port}`;
  console.log(`[qa] ${outDir} on :${port}`);

  const server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", detached: true });
  const stop = () => { try { process.kill(-server.pid!); } catch { /* already gone */ } };

  try {
    if (!(await waitForServer(base))) throw new Error("server never came up");

    const first = ROUTES.map((r) => r);
    const notes = fs.existsSync("src/content/notes")
      ? fs.readdirSync("src/content/notes").filter((f) => f.endsWith(".mdx"))
      : [];
    if (notes[0]) first.push(`/insights/${notes[0].replace(/\.mdx$/, "")}`);

    console.log("[qa] kill list");
    const kill = execFileSync("bash", ["scripts/qa/killist.sh"], { encoding: "utf8" });
    fs.writeFileSync(path.join(outDir, "killist.txt"), kill);

    console.log("[qa] screens + axe");
    const s = await runScreens(base, outDir, first);

    console.log("[qa] checklist");
    const c = await runChecklist(base, outDir, first, "Girlscantrade2");

    console.log("[qa] lighthouse");
    const lh: Record<string, Record<string, number>> = {};
    for (const [route, preset] of [["/", "mobile"], ["/strategies", "mobile"], ["/", "desktop"]] as const) {
      const slug = (route === "/" ? "home" : route.slice(1)) + "-" + preset;
      const out = path.join(outDir, `lighthouse-${slug}.json`);
      try {
        execFileSync("npx", ["lighthouse", base + route,
          preset === "desktop" ? "--preset=desktop" : "--form-factor=mobile",
          "--output=json", `--output-path=${out}`, "--quiet",
          '--chrome-flags=--headless'], { stdio: "ignore", timeout: 180000 });
        const j = JSON.parse(fs.readFileSync(out, "utf8"));
        lh[slug] = Object.fromEntries(Object.entries(j.categories as Record<string, { score: number }>)
          .map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]));
      } catch { lh[slug] = { error: -1 }; }
    }
    fs.writeFileSync(path.join(outDir, "lighthouse.json"), JSON.stringify(lh, null, 2));

    const summary = {
      round: path.basename(outDir),
      killist: kill.trim() === "" ? "empty" : kill.trim(),
      axeViolations: s.violations,
      consoleErrors: s.consoleErrors,
      checklist: `${c.total - c.failed}/${c.total}`,
      checklistFailures: c.failures.map((f) => f.name + (f.detail ? ` (${f.detail})` : "")),
      lighthouse: lh,
    };
    fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));

    stop();
    if (kill.trim() !== "") process.exit(1);
  } catch (e) { stop(); throw e; }
}
main().catch((e) => { console.error(e); process.exit(1); });
