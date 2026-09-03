#!/usr/bin/env -S npx tsx
/**
 * Lighthouse gate runner — docs/EVERY-SCREEN.md §9.
 *
 * Runs Lighthouse (via a one-off `npx lighthouse` — no new runtime
 * dependency in package.json) against every route in matrix.ts's route
 * list, mobile and desktop presets, against a given base URL. Writes
 * docs/v4/lighthouse/<round>/<route>--<preset>.json (the raw Lighthouse
 * report) plus docs/v4/lighthouse/<round>/summary.json and a printed
 * summary table.
 *
 * Gate (§9, mobile only — desktop is captured and reported, not gated):
 *   - Performance / Accessibility / Best Practices / SEO all ≥95
 *   - LCP < 1.5s
 *   - CLS 0 (≤0.001, to absorb float noise around an exact zero)
 * Desktop's four category scores are printed for visibility but do not
 * affect PASS/FAIL — §9 only states a mobile gate.
 *
 * There is no system Chrome in this environment, so every Lighthouse
 * invocation points CHROME_PATH at Playwright's own bundled Chromium
 * (chromium.executablePath()) — the same browser matrix.ts already uses,
 * not a new download.
 *
 * Usage:
 *   npx tsx scripts/qa/lighthouse.ts --base https://girlscantrade2.com \
 *     --round prod-1 [--routes /,/firm] [--workers 3]
 */
import { chromium } from "playwright";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { ALL_ROUTES } from "./matrix";

const execFileAsync = promisify(execFile);

// ───────────────────────────── CLI ─────────────────────────────

interface Args {
  base: string;
  round: string;
  routes: string[];
  workers: number;
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const base = get("--base");
  const round = get("--round");
  if (!base || !round) {
    console.error("usage: npx tsx scripts/qa/lighthouse.ts --base <url> --round <name> [--routes /,/firm] [--workers 3]");
    process.exit(1);
  }
  const routesArg = get("--routes");
  const routes = routesArg ? routesArg.split(",").map((r) => r.trim()) : ALL_ROUTES;
  const workers = Number(get("--workers") || 3);
  return { base: base.replace(/\/$/, ""), round, routes, workers };
}

function routeSlug(route: string): string {
  return route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
}

// ───────────────────────────── Lighthouse invocation ─────────────────────────────

type Preset = "mobile" | "desktop";

interface Opportunity {
  id: string;
  title: string;
  savingsMs: number | null;
}

interface LhResult {
  route: string;
  preset: Preset;
  file: string; // relative path to the raw report JSON
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  lcpMs: number | null;
  clsScore: number | null;
  tbtMs: number | null;
  inpMs: number | null;
  opportunities: Opportunity[];
  error: string | null;
}

/** Every performance-category audit that isn't a clean pass, ranked by
 * estimated time saved (falls back to a low-score-first ordering when an
 * audit carries no numeric savings, e.g. LCP itself scored under threshold). */
function extractOpportunities(report: any): Opportunity[] {
  const perf = report?.categories?.performance;
  if (!perf?.auditRefs) return [];
  const items: Opportunity[] = [];
  for (const ref of perf.auditRefs) {
    const audit = report.audits?.[ref.id];
    if (!audit) continue;
    if (audit.scoreDisplayMode === "notApplicable" || audit.scoreDisplayMode === "informative") continue;
    if (audit.score !== null && audit.score >= 0.9) continue;
    const savingsMs =
      typeof audit.details?.overallSavingsMs === "number" ? audit.details.overallSavingsMs : null;
    items.push({ id: ref.id, title: audit.title || ref.id, savingsMs });
  }
  items.sort((a, b) => {
    if (a.savingsMs !== null && b.savingsMs !== null) return b.savingsMs - a.savingsMs;
    if (a.savingsMs !== null) return -1;
    if (b.savingsMs !== null) return 1;
    return 0;
  });
  return items.slice(0, 3);
}

async function runOne(base: string, route: string, preset: Preset, outDir: string): Promise<LhResult> {
  const slug = routeSlug(route);
  const file = `${slug}--${preset}.json`;
  const outFile = path.join(outDir, file);
  const url = base + route;
  const chromePath = chromium.executablePath();

  const args = [
    "--yes",
    "lighthouse",
    url,
    "--output=json",
    `--output-path=${outFile}`,
    "--chrome-flags=--headless=new --no-sandbox",
    "--quiet",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--max-wait-for-load=45000",
  ];
  if (preset === "desktop") args.push("--preset=desktop");

  const base0: LhResult = {
    route,
    preset,
    file,
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
    lcpMs: null,
    clsScore: null,
    tbtMs: null,
    inpMs: null,
    opportunities: [],
    error: null,
  };

  try {
    await execFileAsync("npx", args, {
      env: { ...process.env, CHROME_PATH: chromePath },
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 32,
    });
    const report = JSON.parse(fs.readFileSync(outFile, "utf8"));
    const cat = (id: string) => {
      const s = report.categories?.[id]?.score;
      return typeof s === "number" ? Math.round(s * 100) : null;
    };
    return {
      ...base0,
      performance: cat("performance"),
      accessibility: cat("accessibility"),
      bestPractices: cat("best-practices"),
      seo: cat("seo"),
      lcpMs: report.audits?.["largest-contentful-paint"]?.numericValue ?? null,
      clsScore: report.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
      tbtMs: report.audits?.["total-blocking-time"]?.numericValue ?? null,
      inpMs: report.audits?.["interaction-to-next-paint"]?.numericValue ?? null,
      opportunities: extractOpportunities(report),
    };
  } catch (e) {
    const err = e as Error & { stderr?: string };
    const detail = (err.stderr || err.message || "").trim();
    // Lighthouse refuses to score a non-2xx response ("unable to reliably
    // load the page"). /this-route-does-not-exist is deliberately a 404 (it
    // exists in matrix.ts's route list to exercise the not-found page
    // across viewports), so this is an expected, correctly-behaving
    // rejection, not a tool failure — label it as such rather than an
    // unexplained error.
    if (/Status code: 4\d\d|Status code: 5\d\d/.test(detail)) {
      return {
        ...base0,
        error: `expected: Lighthouse will not score a non-2xx response (${detail.match(/Status code: \d+/)?.[0] || "non-2xx"}) — ${route} is intentionally a 404 test route`,
      };
    }
    return { ...base0, error: detail.slice(0, 500) };
  }
}

// ───────────────────────────── Worker pool ─────────────────────────────

async function runPool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>): Promise<void> {
  let idx = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      await fn(items[i]);
    }
  });
  await Promise.all(workers);
}

// ───────────────────────────── Gate + report ─────────────────────────────

function gatePass(m: LhResult): boolean {
  if (m.error) return false;
  if (m.performance === null || m.accessibility === null || m.bestPractices === null || m.seo === null) return false;
  if (m.performance < 95 || m.accessibility < 95 || m.bestPractices < 95 || m.seo < 95) return false;
  if (m.lcpMs === null || m.lcpMs >= 1500) return false;
  if (m.clsScore === null || m.clsScore > 0.001) return false;
  return true;
}

function fmtMs(v: number | null): string {
  return v === null ? "—" : `${Math.round(v)}ms`;
}

function printSummary(round: string, base: string, results: LhResult[]): void {
  const mobiles = results.filter((r) => r.preset === "mobile");
  const routeW = Math.max(6, ...mobiles.map((r) => r.route.length));
  console.log(`\nLighthouse — round "${round}" — ${base}`);
  console.log(
    routeW.toString().length ? "" : "",
  );
  const header =
    "Route".padEnd(routeW) +
    "  Perf  A11y  BP  SEO   LCP     CLS     INP/TBT  Gate";
  console.log(header);
  console.log("-".repeat(header.length));
  let passCount = 0;
  for (const m of mobiles) {
    const pass = gatePass(m);
    if (pass) passCount++;
    const inpTbt = m.inpMs !== null ? `${fmtMs(m.inpMs)}(INP)` : `${fmtMs(m.tbtMs)}(TBT)`;
    console.log(
      m.route.padEnd(routeW) +
        `  ${String(m.performance ?? "—").padStart(4)}  ${String(m.accessibility ?? "—").padStart(4)}  ${String(m.bestPractices ?? "—").padStart(2)}  ${String(m.seo ?? "—").padStart(3)}   ${fmtMs(m.lcpMs).padStart(7)}  ${(m.clsScore === null ? "—" : m.clsScore.toFixed(3)).padStart(6)}  ${inpTbt.padStart(9)}  ${pass ? "PASS" : "FAIL"}`,
    );
    if (m.error) console.log(`    error: ${m.error.split("\n")[0]}`);
  }
  console.log("-".repeat(header.length));
  console.log(`${passCount}/${mobiles.length} routes pass the mobile gate (≥95 ×4, LCP<1.5s, CLS≤0.001)\n`);

  const failing = mobiles.filter((m) => !gatePass(m));
  for (const m of failing) {
    if (m.error || m.opportunities.length === 0) continue;
    console.log(`${m.route} — top opportunities:`);
    for (const op of m.opportunities) {
      console.log(`  - ${op.title}${op.savingsMs !== null ? ` (~${Math.round(op.savingsMs)}ms)` : ""}`);
    }
  }
}

// ───────────────────────────── main ─────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.join("docs/v4/lighthouse", args.round);
  fs.mkdirSync(outDir, { recursive: true });

  const jobs: { route: string; preset: Preset }[] = [];
  for (const route of args.routes) {
    jobs.push({ route, preset: "mobile" });
    jobs.push({ route, preset: "desktop" });
  }

  console.log(
    `lighthouse: round=${args.round} base=${args.base} routes=${args.routes.length} jobs=${jobs.length} workers=${args.workers}`,
  );
  const started = Date.now();

  const results: LhResult[] = [];
  await runPool(jobs, args.workers, async (job) => {
    const r = await runOne(args.base, job.route, job.preset, outDir);
    results.push(r);
  });

  const durationMs = Date.now() - started;

  fs.writeFileSync(
    path.join(outDir, "summary.json"),
    JSON.stringify(
      {
        round: args.round,
        base: args.base,
        durationMs,
        routes: args.routes,
        results,
      },
      null,
      2,
    ),
  );

  printSummary(args.round, args.base, results);
  console.log(`duration: ${(durationMs / 1000).toFixed(1)}s`);
  console.log(`summary: ${path.join(outDir, "summary.json")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
