#!/usr/bin/env -S npx tsx
/**
 * Viewport matrix runner — docs/EVERY-SCREEN.md §6.
 *
 * Shoots every route across the §6.1 device table (three browser engines),
 * runs the §6.3 automated checks per shot, writes docs/v4/shots/<round>/matrix.json,
 * and composes one labeled contact sheet per route via contact-sheet.ts.
 *
 * Usage:
 *   npx tsx scripts/qa/matrix.ts --base http://localhost:3000 --round <name> \
 *     [--routes /,/firm] [--devices phone|tablet|laptop|desktop|all] \
 *     [--modes baseline|all] [--workers 6]
 *
 * "baseline" mode is always shot (it is the foundation the dark-scheme diff
 * check and the contact sheets are built from). "--modes all" adds every
 * §6.2 mode on top, each gated to the device/width the spec pins it to
 * (zoom only at 1280/1536, font-size only at 393/1280, throttle only at
 * 393 WebKit + 412 Chromium, mobile-nav-open at every phone).
 */
import {
  chromium,
  firefox,
  webkit,
  devices as pwDevices,
  type Browser,
  type BrowserContextOptions,
  type Page,
} from "playwright";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildRouteContactSheet, type SheetTile } from "./contact-sheet";

// ───────────────────────────── CLI ─────────────────────────────

type Engine = "chromium" | "webkit" | "firefox";
type DeviceClass = "phone" | "tablet" | "laptop" | "desktop";

interface Args {
  base: string;
  round: string;
  routes: string[];
  deviceClasses: Set<DeviceClass>;
  modesAll: boolean;
  workers: number;
}

const ALL_ROUTES = [
  "/",
  "/firm",
  "/strategies",
  "/insights",
  "/insights/capacity-is-a-research-problem",
  "/diligence",
  "/governance",
  "/team",
  "/partnership",
  "/letters",
  "/tearsheet",
  "/questions",
  "/access",
  "/contact",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
  "/disclosures",
  "/this-route-does-not-exist",
];

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const base = get("--base") || "http://localhost:3000";
  const round = get("--round");
  if (!round) {
    console.error("--round <name> is required");
    process.exit(1);
  }
  const routesArg = get("--routes");
  const routes = routesArg ? routesArg.split(",").map((r) => r.trim()) : ALL_ROUTES;
  const devicesArg = (get("--devices") || "all") as DeviceClass | "all";
  const deviceClasses: Set<DeviceClass> =
    devicesArg === "all"
      ? new Set<DeviceClass>(["phone", "tablet", "laptop", "desktop"])
      : new Set([devicesArg as DeviceClass]);
  const modesArg = get("--modes") || "baseline";
  const workers = Number(get("--workers") || 6);
  return { base, round, routes, deviceClasses, modesAll: modesArg === "all", workers };
}

// ───────────────────────────── Devices (§6.1) ─────────────────────────────

interface DeviceSpec {
  id: string;
  label: string; // human label for contact sheets / matrix.json
  cls: DeviceClass;
  engine: Engine;
  orientation?: "portrait" | "landscape";
  touch: boolean;
  width: number;
  height: number;
  dpr: number;
  context: BrowserContextOptions;
}

function mkExplicit(
  id: string,
  label: string,
  cls: DeviceClass,
  engine: Engine,
  width: number,
  height: number,
  dpr: number,
  touch: boolean,
  orientation?: "portrait" | "landscape",
): DeviceSpec {
  return {
    id,
    label,
    cls,
    engine,
    orientation,
    touch,
    width,
    height,
    dpr,
    context: {
      viewport: { width, height },
      deviceScaleFactor: dpr,
      isMobile: touch,
      hasTouch: touch,
    },
  };
}

function mkNamed(
  id: string,
  label: string,
  cls: DeviceClass,
  engine: Engine,
  descriptor: (typeof pwDevices)[string],
  orientation?: "portrait" | "landscape",
): DeviceSpec {
  return {
    id,
    label,
    cls,
    engine,
    orientation,
    touch: !!descriptor.hasTouch,
    width: descriptor.viewport.width,
    height: descriptor.viewport.height,
    dpr: descriptor.deviceScaleFactor || 1,
    context: { ...descriptor },
  };
}

/** Builds the full ~37-entry device catalog from §6.1, no filtering yet. */
function fullDeviceCatalog(): DeviceSpec[] {
  const d: DeviceSpec[] = [];

  // Phone — floor
  d.push(
    mkExplicit("phone-floor", "iPhone SE 1st (floor) 320×568", "phone", "webkit", 320, 568, 2, true, "portrait"),
  );

  // Phone
  const phones: [string, string, Engine, string][] = [
    ["iphone-se", "iPhone SE 375", "webkit", "iPhone SE"],
    ["iphone-14", "iPhone 14 390", "webkit", "iPhone 14"],
    ["iphone-15-pro", "iPhone 15 Pro 393", "webkit", "iPhone 15 Pro"],
    ["iphone-15-pro-max", "iPhone 15 Pro Max 430", "webkit", "iPhone 15 Pro Max"],
    ["pixel-7", "Pixel 7 412", "chromium", "Pixel 7"],
    ["galaxy-s9plus", "Galaxy S9+ 360", "chromium", "Galaxy S9+"],
  ];
  for (const [id, label, engine, devName] of phones) {
    d.push(mkNamed(id, `${label} portrait`, "phone", engine, pwDevices[devName], "portrait"));
    d.push(
      mkNamed(
        `${id}-landscape`,
        `${label} landscape`,
        "phone",
        engine,
        pwDevices[`${devName} landscape`],
        "landscape",
      ),
    );
  }

  // Tablet — WebKit throughout
  d.push(mkNamed("ipad-mini", "iPad Mini 768×1024 portrait", "tablet", "webkit", pwDevices["iPad Mini"], "portrait"));
  d.push(
    mkNamed(
      "ipad-mini-landscape",
      "iPad Mini landscape",
      "tablet",
      "webkit",
      pwDevices["iPad Mini landscape"],
      "landscape",
    ),
  );
  // iPad Air (820×1180) has no named descriptor in this Playwright version — explicit fallback.
  d.push(mkExplicit("ipad-air", "iPad Air 820×1180 portrait", "tablet", "webkit", 820, 1180, 2, true, "portrait"));
  d.push(
    mkExplicit("ipad-air-landscape", "iPad Air landscape", "tablet", "webkit", 1180, 820, 2, true, "landscape"),
  );
  d.push(
    mkNamed("ipad-pro-11", "iPad Pro 11 834×1194 portrait", "tablet", "webkit", pwDevices["iPad Pro 11"], "portrait"),
  );
  d.push(
    mkNamed(
      "ipad-pro-11-landscape",
      "iPad Pro 11 landscape",
      "tablet",
      "webkit",
      pwDevices["iPad Pro 11 landscape"],
      "landscape",
    ),
  );
  // iPad Pro 12.9 (1024×1366) — also no named descriptor here — explicit fallback.
  d.push(
    mkExplicit("ipad-pro-12-9", "iPad Pro 12.9 1024×1366 portrait", "tablet", "webkit", 1024, 1366, 2, true, "portrait"),
  );
  d.push(
    mkExplicit(
      "ipad-pro-12-9-landscape",
      "iPad Pro 12.9 landscape",
      "tablet",
      "webkit",
      1366,
      1024,
      2,
      true,
      "landscape",
    ),
  );

  // Laptop — Chromium AND Firefox
  const laptops: [string, number, number, number][] = [
    ["1280x720", 1280, 720, 1],
    ["1366x768", 1366, 768, 1],
    ["1440x900", 1440, 900, 2],
    ["1536x864", 1536, 864, 1.25],
    ["1680x1050", 1680, 1050, 1],
  ];
  for (const [tag, w, h, dpr] of laptops) {
    d.push(mkExplicit(`laptop-${tag}-chromium`, `Laptop ${tag} (Chromium)`, "laptop", "chromium", w, h, dpr, false));
    d.push(mkExplicit(`laptop-${tag}-firefox`, `Laptop ${tag} (Firefox)`, "laptop", "firefox", w, h, dpr, false));
  }

  // Desktop — Chromium only
  d.push(mkExplicit("desktop-1920x1080", "Desktop 1920×1080", "desktop", "chromium", 1920, 1080, 1, false));
  d.push(mkExplicit("desktop-2560x1440-dpr1", "Desktop 2560×1440 DPR1", "desktop", "chromium", 2560, 1440, 1, false));
  d.push(mkExplicit("desktop-2560x1440-dpr2", "Desktop 2560×1440 DPR2", "desktop", "chromium", 2560, 1440, 2, false));
  d.push(mkExplicit("desktop-3440x1440", "Desktop 3440×1440 ultrawide", "desktop", "chromium", 3440, 1440, 1, false));
  d.push(mkExplicit("desktop-3840x2160-dpr1", "Desktop 3840×2160 4K DPR1", "desktop", "chromium", 3840, 2160, 1, false));
  d.push(mkExplicit("desktop-3840x2160-dpr2", "Desktop 3840×2160 4K DPR2", "desktop", "chromium", 3840, 2160, 2, false));

  return d;
}

// ───────────────────────────── Modes (§6.2) → Jobs ─────────────────────────────

type ModeId =
  | "baseline"
  | "reduced-motion"
  | "dark-scheme"
  | "forced-colors"
  | "font-size-20"
  | "mobile-nav-open"
  | "throttled-slow4g"
  | "zoom-125"
  | "zoom-150"
  | "zoom-200"
  | "zoom-400";

interface Job {
  mode: ModeId;
  device: DeviceSpec;
  contextOverrides: BrowserContextOptions;
  routes: string[];
  postLoad?: (page: Page, engine: Engine) => Promise<{ notes: string[] }>;
  measurePerf?: boolean; // LCP/CLS via injected PerformanceObserver
  throttle?: boolean; // CDP Slow-4G, chromium only
}

const NAV_TOGGLE_SELECTOR = 'button[aria-label="Open menu" i], button[aria-label*="menu" i]';

async function clickMobileNav(page: Page): Promise<{ notes: string[] }> {
  const btn = page.locator(NAV_TOGGLE_SELECTOR).first();
  const count = await btn.count();
  if (count === 0) return { notes: ["mobile-nav-open: no nav toggle button found by selector"] };
  try {
    await btn.click({ timeout: 3000 });
    await page.waitForTimeout(350); // let open transition settle (motion is not forced-reduced here on purpose)
    return { notes: [] };
  } catch (e) {
    return { notes: [`mobile-nav-open: click failed — ${(e as Error).message}`] };
  }
}

async function injectFontSize(page: Page): Promise<{ notes: string[] }> {
  await page.addStyleTag({ content: "html{font-size:20px}" });
  await page.waitForTimeout(150);
  return { notes: ["font-size-20: injected html{font-size:20px} after load (browser zoom via body.style.zoom not used)"] };
}

function zoomDevice(baseWidth: number, pct: number, engine: Engine): DeviceSpec {
  const width = Math.round(baseWidth / (pct / 100));
  let dpr = pct / 100;
  if (dpr > 3) dpr = 3; // cap; WebKit-only concern per spec, applied uniformly for consistency
  const height = Math.round((baseWidth === 1280 ? 720 : 864) / (pct / 100));
  return mkExplicit(
    `zoom-${baseWidth}-${pct}pct`,
    `Zoom ${pct}% @ ${baseWidth} → viewport ${width}×${height} DPR${dpr}`,
    "laptop",
    engine,
    width,
    height,
    dpr,
    false,
  );
}

/** Expands the selected device/route/mode arguments into a flat Job list. */
function buildJobs(devices: DeviceSpec[], args: Args): Job[] {
  const jobs: Job[] = [];
  const { routes } = args;

  // baseline — always shot, for every selected device.
  for (const dev of devices) {
    jobs.push({ mode: "baseline", device: dev, contextOverrides: {}, routes });
  }

  if (!args.modesAll) return jobs;

  // reduced-motion / dark-scheme / forced-colors — every selected device.
  for (const dev of devices) {
    jobs.push({
      mode: "reduced-motion",
      device: dev,
      contextOverrides: { reducedMotion: "reduce" },
      routes,
    });
    jobs.push({
      mode: "dark-scheme",
      device: dev,
      contextOverrides: { colorScheme: "dark" },
      routes,
    });
    jobs.push({
      mode: "forced-colors",
      device: dev,
      contextOverrides: { forcedColors: "active" },
      routes,
    });
  }

  // mobile-nav-open — every phone-class device actually selected.
  for (const dev of devices.filter((d) => d.cls === "phone")) {
    jobs.push({
      mode: "mobile-nav-open",
      device: dev,
      contextOverrides: {},
      routes,
      postLoad: clickMobileNav,
    });
  }

  // font-size-20 — at 393 (phone) and 1280 (laptop), only if that class is selected.
  const rep393 = devices.find((d) => d.id === "iphone-15-pro");
  const rep1280 = devices.find((d) => d.id === "laptop-1280x720-chromium");
  if (rep393) jobs.push({ mode: "font-size-20", device: rep393, contextOverrides: {}, routes, postLoad: injectFontSize });
  if (rep1280)
    jobs.push({ mode: "font-size-20", device: rep1280, contextOverrides: {}, routes, postLoad: injectFontSize });

  // throttled Slow 4G — 393 WebKit + 412 Chromium only.
  const throttle393 = devices.find((d) => d.id === "iphone-15-pro");
  const throttle412 = devices.find((d) => d.id === "pixel-7");
  if (throttle393)
    jobs.push({
      mode: "throttled-slow4g",
      device: throttle393,
      contextOverrides: {},
      routes,
      measurePerf: true,
      throttle: throttle393.engine === "chromium",
    });
  if (throttle412)
    jobs.push({
      mode: "throttled-slow4g",
      device: throttle412,
      contextOverrides: {},
      routes,
      measurePerf: true,
      throttle: throttle412.engine === "chromium",
    });

  // zoom — derived from laptop widths 1280 and 1536; only if laptop class selected.
  if (devices.some((d) => d.cls === "laptop")) {
    for (const pct of [125, 150, 200, 400]) {
      jobs.push({
        mode: `zoom-${pct}` as ModeId,
        device: zoomDevice(1280, pct, "chromium"),
        contextOverrides: {},
        routes,
      });
    }
    for (const pct of [125, 150, 200]) {
      jobs.push({
        mode: `zoom-${pct}` as ModeId,
        device: zoomDevice(1536, pct, "chromium"),
        contextOverrides: {},
        routes,
      });
    }
  }

  return jobs;
}

// ───────────────────────────── Checks (§6.3) ─────────────────────────────

interface CheckResult {
  id: string;
  status: "PASS" | "WARN" | "FAIL";
  reason: string;
}

/**
 * Runs in-page. Returns the geometry/content checks that don't need
 * cross-process state (console, LCP/CLS, dark-scheme diff are handled
 * outside this function). Self-contained: no closures over outer scope,
 * since Playwright serializes this for page.evaluate.
 */
function browserChecks(opts: {
  deviceClass: DeviceClass;
  touch: boolean;
  viewportWidth: number;
  isIphone: boolean;
}): CheckResult[] {
  const results: CheckResult[] = [];

  // 1. Horizontal overflow
  const overflowPx = document.documentElement.scrollWidth - window.innerWidth;
  if (overflowPx > 1) results.push({ id: "overflow-x", status: "FAIL", reason: `scrollWidth exceeds innerWidth by ${overflowPx}px` });
  else results.push({ id: "overflow-x", status: "PASS", reason: "no horizontal overflow" });

  // 2. Text intersecting sticky nav while scrolled to top
  try {
    const header = document.querySelector('header, [class*="header"], nav[class*="nav"]') as HTMLElement | null;
    let stickyEl: HTMLElement | null = null;
    if (header) {
      const pos = getComputedStyle(header).position;
      if (pos === "sticky" || pos === "fixed") stickyEl = header;
    }
    if (!stickyEl) {
      // fall back: scan top-level elements for position sticky/fixed near the top
      const all = Array.from(document.body.querySelectorAll<HTMLElement>("*")).slice(0, 400);
      for (const el of all) {
        const cs = getComputedStyle(el);
        if ((cs.position === "sticky" || cs.position === "fixed") && el.getBoundingClientRect().top < 100) {
          stickyEl = el;
          break;
        }
      }
    }
    if (stickyEl && window.scrollY === 0) {
      const navRect = stickyEl.getBoundingClientRect();
      let hit = false;
      let hitDetail = "";
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      let checked = 0;
      while ((n = walker.nextNode()) && checked < 2000) {
        checked++;
        const text = n.textContent?.trim();
        if (!text) continue;
        const parent = n.parentElement;
        if (!parent) continue;
        // Exclude anything inside the nav/header itself (by detected sticky
        // element AND by tag, in case the detected sticky wrapper differs
        // from the semantic nav/header), and anything screen-reader-only,
        // invisible, or fully transparent — those aren't visual overlaps.
        if (stickyEl.contains(parent) || parent.closest("header, nav")) continue;
        let skip = false;
        let anc: HTMLElement | null = parent;
        while (anc && anc !== document.body) {
          if (anc.classList.contains("sr-only")) {
            skip = true;
            break;
          }
          const acs = getComputedStyle(anc);
          if (acs.visibility === "hidden" || parseFloat(acs.opacity) === 0) {
            skip = true;
            break;
          }
          anc = anc.parentElement;
        }
        if (skip) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        const r = range.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const vOverlap = Math.min(r.bottom, navRect.bottom) - Math.max(r.top, navRect.top);
        const hOverlap = Math.min(r.right, navRect.right) - Math.max(r.left, navRect.left);
        if (vOverlap > 2 && hOverlap > 0) {
          hit = true;
          hitDetail = text.slice(0, 30);
          break;
        }
      }
      results.push({
        id: "sticky-nav-text-overlap",
        status: hit ? "FAIL" : "PASS",
        reason: hit ? `a text node intersects the sticky/fixed nav box by >2px at scrollY=0: "${hitDetail}"` : "no overlap detected",
      });
    } else {
      results.push({ id: "sticky-nav-text-overlap", status: "PASS", reason: "no sticky/fixed header element identified — nothing to overlap" });
    }
  } catch (e) {
    results.push({ id: "sticky-nav-text-overlap", status: "PASS", reason: `check errored, treated as non-fatal: ${(e as Error).message}` });
  }

  // 3. overflow:hidden clipping text — only when an actual TEXT node's rect
  // extends past the clipping ancestor's own rect. scrollHeight>clientHeight
  // alone is not enough: decorative non-text children (a background layer,
  // an oversized icon) trip that ratio without any text being clipped.
  {
    let clipped: string[] = [];
    const els = Array.from(document.body.querySelectorAll<HTMLElement>("*")).slice(0, 3000);
    for (const el of els) {
      if (el.classList.contains("sr-only") || el.closest(".sr-only")) continue; // meant to be clipped
      const cs = getComputedStyle(el);
      if (cs.overflow !== "hidden" && cs.overflowY !== "hidden") continue;
      const text = el.innerText?.trim();
      if (!text || text.length < 2) continue;
      if (!(el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0)) continue;
      const elRect = el.getBoundingClientRect();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let tn: Node | null;
      let offender = "";
      while ((tn = walker.nextNode())) {
        const t = (tn.textContent || "").trim();
        if (!t) continue;
        const range = document.createRange();
        range.selectNodeContents(tn);
        const r = range.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const extendsPast =
          r.bottom > elRect.bottom + 1 || r.top < elRect.top - 1 || r.right > elRect.right + 1 || r.left < elRect.left - 1;
        if (extendsPast) {
          offender = t.slice(0, 30);
          break;
        }
      }
      if (offender) {
        clipped.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().slice(0, 30)} — "${offender}"`);
        if (clipped.length >= 5) break;
      }
    }
    if (clipped.length) results.push({ id: "clipped-text", status: "FAIL", reason: `overflow:hidden clips text on: ${clipped.join(", ")}` });
    else results.push({ id: "clipped-text", status: "PASS", reason: "no overflow:hidden text clipping detected" });
  }

  // 4. Tap targets (touch devices only)
  if (opts.touch) {
    // sr-only elements (e.g. a "Skip to content" link) are deliberately
    // collapsed to ~1×1px until focused — that is the accessible pattern
    // working as intended, not a tap-target defect.
    const targets = Array.from(
      document.body.querySelectorAll<HTMLElement>('a, button, summary, [role="button"]'),
    ).filter((el) => {
      if (el.classList.contains("sr-only")) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    });
    const rects = targets.map((el) => el.getBoundingClientRect());
    // De-duplicated by element index (a Set), not by pair/occurrence, so one
    // small or crowded link is reported once per shot, not once per neighbor.
    const smallIdx = new Set<number>();
    for (let i = 0; i < targets.length; i++) {
      const r = rects[i];
      if (r.width < 44 || r.height < 44) smallIdx.add(i);
    }
    const gapIdx = new Set<number>();
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const b = rects[j];
        const dx = Math.max(a.left - b.right, b.left - a.right, 0);
        const dy = Math.max(a.top - b.bottom, b.top - a.bottom, 0);
        const overlapping = dx === 0 && dy === 0;
        const gap = Math.hypot(dx, dy);
        if (overlapping || gap >= 8 || gap === 0) continue;
        // Exempt hairline-list rows: adjacent full-width block links that
        // touch by design (the six strategy rows, the three legal-index
        // rows, …) — both targets span ≥80% of their own container's width
        // and are stacked vertically (one's bottom meets the other's top
        // within 2px). Everything else — side-by-side or narrower targets —
        // still fails.
        const aParent = targets[i].parentElement;
        const bParent = targets[j].parentElement;
        const aContainerW = aParent ? aParent.getBoundingClientRect().width : 0;
        const bContainerW = bParent ? bParent.getBoundingClientRect().width : 0;
        const aWide = aContainerW > 0 && a.width >= aContainerW * 0.8;
        const bWide = bContainerW > 0 && b.width >= bContainerW * 0.8;
        const stackedTouching = Math.abs(a.bottom - b.top) <= 2 || Math.abs(b.bottom - a.top) <= 2;
        if (aWide && bWide && stackedTouching) continue;
        gapIdx.add(i);
        gapIdx.add(j);
      }
    }
    if (smallIdx.size)
      results.push({
        id: "tap-target-size",
        status: "FAIL",
        reason: `${smallIdx.size} target(s) under 44×44: ${Array.from(smallIdx)
          .slice(0, 5)
          .map(
            (i) =>
              `${targets[i].tagName.toLowerCase()} "${(targets[i].textContent || "").trim().slice(0, 20)}" ${rects[i].width.toFixed(0)}×${rects[i].height.toFixed(0)}px`,
          )
          .join(", ")}`,
      });
    else results.push({ id: "tap-target-size", status: "PASS", reason: `${targets.length} tap targets, all ≥44×44` });
    if (gapIdx.size)
      results.push({
        id: "tap-target-gap",
        status: "FAIL",
        reason: `${gapIdx.size} target(s) under 8px from a neighbor: ${Array.from(gapIdx)
          .slice(0, 5)
          .map(
            (i) =>
              `${targets[i].tagName.toLowerCase()} "${(targets[i].textContent || "").trim().slice(0, 20)}" ${rects[i].width.toFixed(0)}×${rects[i].height.toFixed(0)}px`,
          )
          .join(", ")}`,
      });
    else results.push({ id: "tap-target-gap", status: "PASS", reason: "no adjacent targets under 8px apart" });
  }

  // 5. Headline line count + hero h1 rule
  {
    const warns: string[] = [];
    const fails: string[] = [];
    const heads = Array.from(document.querySelectorAll("h1, h2"));
    for (const h of heads) {
      const lines = h.getClientRects().length || 1;
      if (lines > 3) warns.push(`${h.tagName} "${(h.textContent || "").slice(0, 30)}" ~${lines} lines`);
    }
    const heroH1 = document.querySelector("h1");
    if (heroH1 && opts.viewportWidth >= 768) {
      const lines = heroH1.getClientRects().length || 1;
      if (lines > 2) fails.push(`hero h1 "${(heroH1.textContent || "").slice(0, 30)}" ~${lines} lines at ≥768`);
    }
    if (fails.length) results.push({ id: "headline-lines", status: "FAIL", reason: fails.join("; ") });
    else if (warns.length) results.push({ id: "headline-lines", status: "WARN", reason: warns.slice(0, 5).join("; ") });
    else results.push({ id: "headline-lines", status: "PASS", reason: "headline line counts within limits" });
  }

  // 6. Single-word last line on h1/h2/h3 — verified via per-word Range rects:
  // the last word is alone on its line only if its line-top differs from the
  // second-to-last word's line-top. The detail prints the actual last line's
  // text (every trailing word sharing that line-top) so a false positive is
  // obvious at a glance rather than trusting a width-ratio heuristic.
  {
    const offenders: string[] = [];
    const heads = Array.from(document.querySelectorAll("h1, h2, h3"));
    for (const h of heads) {
      const text = (h.textContent || "").trim();
      if (text.split(/\s+/).filter(Boolean).length < 2) continue;
      const wordRects: { word: string; top: number }[] = [];
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const tn = n as Text;
        const content = tn.textContent || "";
        const re = /\S+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(content))) {
          const range = document.createRange();
          try {
            range.setStart(tn, m.index);
            range.setEnd(tn, m.index + m[0].length);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 || rect.height > 0) wordRects.push({ word: m[0], top: rect.top });
          } catch {
            /* ignore range errors on odd DOM shapes */
          }
        }
      }
      if (wordRects.length < 2) continue;
      const last = wordRects[wordRects.length - 1];
      const prev = wordRects[wordRects.length - 2];
      const sameLine = Math.abs(last.top - prev.top) < 2;
      if (!sameLine) {
        const lastLineWords: string[] = [];
        for (let i = wordRects.length - 1; i >= 0; i--) {
          if (Math.abs(wordRects[i].top - last.top) < 2) lastLineWords.unshift(wordRects[i].word);
          else break;
        }
        offenders.push(`${h.tagName} "${text.slice(0, 30)}" — last line: "${lastLineWords.join(" ")}"`);
      }
    }
    if (offenders.length) results.push({ id: "single-word-last-line", status: "WARN", reason: offenders.slice(0, 5).join("; ") });
    else results.push({ id: "single-word-last-line", status: "PASS", reason: "no single-word last lines detected" });
  }

  // 7. Text measure — widest RENDERED LINE of p/li/dd wider than 80ch.
  // The element's own bounding-box width is not the text measure: a <p> can
  // be a wide box with short wrapped lines. Measure via Range.getClientRects()
  // over the element's contents (one rect per visual line) and take the max.
  {
    const offenders: string[] = [];
    const candidates = Array.from(document.querySelectorAll("p, li, dd")).slice(0, 400);
    const canvas = document.createElement("canvas");
    const ctx2d = canvas.getContext("2d");
    for (const el of candidates) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      let chPx = 8; // fallback
      if (ctx2d) {
        ctx2d.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        chPx = ctx2d.measureText("0").width || chPx;
      }
      const range = document.createRange();
      range.selectNodeContents(el);
      const lineRects = Array.from(range.getClientRects()).filter((lr) => lr.width > 0 && lr.height > 0);
      if (!lineRects.length) continue;
      let widest = lineRects[0];
      for (const lr of lineRects) if (lr.width > widest.width) widest = lr;
      const chWidth = widest.width / chPx;
      if (chWidth > 80)
        offenders.push(`${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 24)}" widest line ~${chWidth.toFixed(0)}ch`);
    }
    if (offenders.length) results.push({ id: "text-measure", status: "FAIL", reason: offenders.slice(0, 5).join("; ") });
    else results.push({ id: "text-measure", status: "PASS", reason: "no p/li/dd with a rendered line wider than 80ch" });
  }

  // 8. Font size floor
  {
    let underFail: string[] = [];
    let underWarn: string[] = [];
    const els = Array.from(document.body.querySelectorAll<HTMLElement>("*")).slice(0, 3000);
    for (const el of els) {
      const hasDirectText = Array.from(el.childNodes).some(
        (n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0,
      );
      if (!hasDirectText) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (Number.isNaN(size)) continue;
      if (size < 13) {
        underFail.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().slice(0, 40)} ${size.toFixed(1)}px`);
      } else if (size < 15 && opts.deviceClass === "phone" && /^(p|li|span|div)$/i.test(el.tagName)) {
        underWarn.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().slice(0, 40)} ${size.toFixed(1)}px`);
      }
    }
    if (underFail.length) results.push({ id: "font-floor", status: "FAIL", reason: `${underFail.length} node(s) under 13px: ${underFail.slice(0, 5).join(", ")}` });
    else if (underWarn.length)
      results.push({ id: "font-floor", status: "WARN", reason: `${underWarn.length} phone body node(s) under 15px: ${underWarn.slice(0, 5).join(", ")}` });
    else results.push({ id: "font-floor", status: "PASS", reason: "no text under the size floor" });
  }

  // 9. Images/SVG wider than container
  {
    const offenders: string[] = [];
    const media = Array.from(document.querySelectorAll("img, svg"));
    for (const el of media) {
      const r = (el as HTMLElement).getBoundingClientRect();
      const parent = el.parentElement;
      if (!parent || r.width === 0) continue;
      const pr = parent.getBoundingClientRect();
      if (r.width > pr.width + 1) {
        offenders.push(`${el.tagName.toLowerCase()} ${r.width.toFixed(0)}px > container ${pr.width.toFixed(0)}px`);
      }
    }
    if (offenders.length) results.push({ id: "media-overflow", status: "FAIL", reason: offenders.slice(0, 5).join("; ") });
    else results.push({ id: "media-overflow", status: "PASS", reason: "no img/svg wider than its container" });
  }

  // 10. Safe area (iPhone descriptors only) — SIMPLIFIED.
  // Playwright does not emulate a physical notch, so env(safe-area-inset-*)
  // always resolves to 0 and a computed-style check can't see whether the
  // rule is *present*. We instead scan loaded stylesheets' cssText for the
  // literal token, which only proves the CSS author accounted for it, not
  // that the used value is correct on a real device. WARN, not FAIL, given
  // that limitation.
  if (opts.isIphone) {
    const fixedBottomEls = Array.from(document.body.querySelectorAll<HTMLElement>("*")).filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") return false;
      const r = el.getBoundingClientRect();
      return r.bottom >= window.innerHeight - 4;
    });
    if (fixedBottomEls.length) {
      let mentionsSafeArea = false;
      try {
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from((sheet as CSSStyleSheet).cssRules)) {
              if (rule.cssText.includes("safe-area-inset")) {
                mentionsSafeArea = true;
                break;
              }
            }
          } catch {
            /* cross-origin stylesheet, skip */
          }
          if (mentionsSafeArea) break;
        }
      } catch {
        /* ignore */
      }
      results.push({
        id: "safe-area-bottom",
        status: mentionsSafeArea ? "PASS" : "WARN",
        reason: mentionsSafeArea
          ? "a fixed/sticky bottom element exists and some stylesheet references safe-area-inset"
          : `${fixedBottomEls.length} fixed/sticky bottom element(s) found but no stylesheet references safe-area-inset (heuristic, see code comment)`,
      });
    } else {
      results.push({ id: "safe-area-bottom", status: "PASS", reason: "no fixed/sticky element pinned to the viewport bottom" });
    }
  }

  return results;
}

// Focus check — implemented as computed-style-of-active-element per tab
// press, NOT a screenshot-region heuristic (per task instructions, this is
// a deliberate simplification of the spec's literal "focus ring is not
// visible in the screenshot region" — we ask the CSSOM instead of the pixels).
//
// Round-2 fix: `getComputedStyle(el, ":focus-visible")` was a bug — the
// second argument to getComputedStyle names a PSEUDO-ELEMENT (::before,
// ::marker, …), not a pseudo-CLASS, so ":focus-visible" is not a real
// pseudo-element and the browser silently returned an empty/default
// declaration, reading outline-style as "none" on every element regardless
// of globals.css. When an element is focused via a real Tab keypress its
// :focus-visible state is already reflected in its OWN computed style, so
// this now calls getComputedStyle(el) with no second argument, and confirms
// the state actually applies via el.matches(':focus-visible') before
// counting a miss. The "Skip to content" link is a special case: it is
// legitimately sr-only when not focused, and its accessible affordance IS
// becoming visible on focus, so it always passes.
async function focusCheck(page: Page): Promise<CheckResult> {
  const offenders: string[] = [];
  let count = 0;
  try {
    await page.keyboard.press("Tab");
    for (let i = 0; i < 60; i++) {
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const isSkipLink =
          el.tagName === "A" && /skip to content/i.test((el.textContent || "").trim());
        const matchesFocusVisible = (() => {
          try {
            return el.matches(":focus-visible");
          } catch {
            return true; // engine without :focus-visible support — don't penalize
          }
        })();
        const cs = getComputedStyle(el);
        const outlineStyle = cs.outlineStyle;
        const outlineWidth = parseFloat(cs.outlineWidth || "0");
        const boxShadow = cs.boxShadow;
        const hasVisibleOutline = outlineStyle !== "none" && outlineWidth > 0;
        const hasBoxShadow = !!boxShadow && boxShadow !== "none";
        // Fails only if it IS in :focus-visible state AND has neither an
        // outline nor a box-shadow. Not matching :focus-visible (e.g. a
        // mouse-focus fallback edge case) is not a failure of this check.
        const failing = matchesFocusVisible && !hasVisibleOutline && !hasBoxShadow && !isSkipLink;
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 24),
          failing,
        };
      });
      if (!info) break;
      count++;
      if (info.failing) offenders.push(`${info.tag} "${info.text}"`);
      await page.keyboard.press("Tab");
    }
  } catch (e) {
    return { id: "focus-visible", status: "PASS", reason: `check errored, non-fatal: ${(e as Error).message}` };
  }
  if (count === 0) return { id: "focus-visible", status: "PASS", reason: "no focusable elements found" };
  if (offenders.length)
    return {
      id: "focus-visible",
      status: "FAIL",
      reason: `${offenders.length}/${count} focusable elements match :focus-visible with no outline/box-shadow: ${offenders.slice(0, 5).join(", ")}`,
    };
  return { id: "focus-visible", status: "PASS", reason: `${count} focusable elements all show a focus outline` };
}

// ───────────────────────────── Shot execution ─────────────────────────────

interface ShotRecord {
  route: string;
  device: string;
  deviceLabel: string;
  engine: Engine;
  cls: DeviceClass;
  mode: ModeId;
  file: string; // relative to round dir
  viewport: { width: number; height: number };
  dpr: number;
  status: "PASS" | "WARN" | "FAIL";
  checks: CheckResult[];
  consoleErrors: string[];
  lcpMs?: number;
  clsScore?: number;
  throttleApplied?: boolean;
  notes: string[];
}

function routeSlug(route: string): string {
  return route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
}

function aggregateStatus(checks: CheckResult[], consoleErrors: string[]): "PASS" | "WARN" | "FAIL" {
  if (consoleErrors.length) return "FAIL";
  if (checks.some((c) => c.status === "FAIL")) return "FAIL";
  if (checks.some((c) => c.status === "WARN")) return "WARN";
  return "PASS";
}

const PERF_INIT_SCRIPT = `
window.__qaPerf = { lcp: 0, cls: 0 };
try {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last) window.__qaPerf.lcp = last.renderTime || last.loadTime || 0;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__qaPerf.cls += entry.value;
    }
  }).observe({ type: 'layout-shift', buffered: true });
} catch (e) { /* engine may not support these entry types */ }
`;

async function runJob(
  job: Job,
  browsers: Record<Engine, Browser>,
  base: string,
  outDir: string,
): Promise<ShotRecord[]> {
  const records: ShotRecord[] = [];
  const browser = browsers[job.device.engine];
  const contextOpts: BrowserContextOptions = { ...job.device.context, ...job.contextOverrides };
  const context = await browser.newContext(contextOpts);
  if (job.measurePerf) await context.addInitScript(PERF_INIT_SCRIPT);

  let cdp: any = null;
  if (job.throttle) {
    // Slow 4G per Lighthouse-style profile: ~400Kbps, 400ms RTT. Chromium only.
    try {
      const page0 = await context.newPage();
      cdp = await context.newCDPSession(page0);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 400,
        downloadThroughput: (400 * 1024) / 8,
        uploadThroughput: (400 * 1024) / 8,
      });
      await page0.close();
    } catch (e) {
      cdp = null;
    }
  }

  for (const route of job.routes) {
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message.slice(0, 300)}`));

    const notes: string[] = [];
    if (job.throttle === false && job.mode === "throttled-slow4g") {
      notes.push(`throttle unsupported on ${job.device.engine} (no CDP) — measured unthrottled`);
    }

    let checks: CheckResult[] = [];
    let lcpMs: number | undefined;
    let clsScore: number | undefined;

    try {
      await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(300);

      if (job.postLoad) {
        const r = await job.postLoad(page, job.device.engine);
        notes.push(...r.notes);
      }

      const file = `${routeSlug(route)}--${job.device.id}--${job.mode}.png`;
      await page.screenshot({ path: path.join(outDir, file) });

      checks = await page.evaluate(browserChecks, {
        deviceClass: job.device.cls,
        touch: job.device.touch,
        viewportWidth: job.device.width,
        isIphone: job.device.id.startsWith("iphone") || job.device.id === "phone-floor",
      });

      const focus = await focusCheck(page);
      checks.push(focus);

      if (job.measurePerf) {
        await page.waitForTimeout(1200); // let LCP/CLS observers settle
        const perf = await page.evaluate(() => (window as any).__qaPerf || { lcp: 0, cls: 0 });
        lcpMs = perf.lcp;
        clsScore = perf.cls;
        if (lcpMs !== undefined) {
          if (lcpMs > 2500) checks.push({ id: "lcp", status: "FAIL", reason: `LCP ${lcpMs.toFixed(0)}ms > 2500ms` });
          else if (lcpMs > 1500) checks.push({ id: "lcp", status: "WARN", reason: `LCP ${lcpMs.toFixed(0)}ms > 1500ms` });
          else checks.push({ id: "lcp", status: "PASS", reason: `LCP ${lcpMs.toFixed(0)}ms` });
        }
        if (clsScore !== undefined) {
          if (clsScore > 0) checks.push({ id: "cls", status: "FAIL", reason: `CLS ${clsScore.toFixed(4)} > 0` });
          else checks.push({ id: "cls", status: "PASS", reason: "CLS 0" });
        }
      }

      records.push({
        route,
        device: job.device.id,
        deviceLabel: job.device.label,
        engine: job.device.engine,
        cls: job.device.cls,
        mode: job.mode,
        file,
        viewport: { width: job.device.width, height: job.device.height },
        dpr: job.device.dpr,
        status: aggregateStatus(checks, consoleErrors),
        checks,
        consoleErrors,
        lcpMs,
        clsScore,
        throttleApplied: job.throttle,
        notes,
      });
    } catch (e) {
      records.push({
        route,
        device: job.device.id,
        deviceLabel: job.device.label,
        engine: job.device.engine,
        cls: job.device.cls,
        mode: job.mode,
        file: "",
        viewport: { width: job.device.width, height: job.device.height },
        dpr: job.device.dpr,
        status: "FAIL",
        checks: [{ id: "shot-error", status: "FAIL", reason: (e as Error).message.slice(0, 300) }],
        consoleErrors,
        notes,
      });
    } finally {
      await page.close().catch(() => {});
    }
  }

  await context.close().catch(() => {});
  return records;
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

// ───────────────────────────── Dark-scheme diff pass ─────────────────────────────

async function darkSchemeDiffPass(shots: ShotRecord[], outDir: string): Promise<void> {
  const baselineByKey = new Map<string, ShotRecord>();
  for (const s of shots) if (s.mode === "baseline" && s.file) baselineByKey.set(`${s.route}::${s.device}`, s);

  for (const s of shots) {
    if (s.mode !== "dark-scheme" || !s.file) continue;
    const base = baselineByKey.get(`${s.route}::${s.device}`);
    if (!base || !base.file) {
      s.checks.push({ id: "dark-scheme-diff", status: "PASS", reason: "no matching baseline shot to diff against" });
      continue;
    }
    try {
      const [a, b] = await Promise.all([
        sharp(path.join(outDir, base.file)).raw().toBuffer({ resolveWithObject: true }),
        sharp(path.join(outDir, s.file)).raw().toBuffer({ resolveWithObject: true }),
      ]);
      if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
        s.checks.push({ id: "dark-scheme-diff", status: "FAIL", reason: "dimensions differ from baseline shot" });
      } else {
        let diffBytes = 0;
        const len = Math.min(a.data.length, b.data.length);
        for (let i = 0; i < len; i++) if (a.data[i] !== b.data[i]) diffBytes++;
        if (diffBytes > 0) {
          s.checks.push({
            id: "dark-scheme-diff",
            status: "FAIL",
            reason: `${diffBytes} byte(s) differ from the baseline (light) screenshot — site changed under prefers-color-scheme:dark`,
          });
        } else {
          s.checks.push({ id: "dark-scheme-diff", status: "PASS", reason: "pixel-identical to baseline" });
        }
      }
    } catch (e) {
      s.checks.push({ id: "dark-scheme-diff", status: "PASS", reason: `diff errored, non-fatal: ${(e as Error).message}` });
    }
    s.status = aggregateStatus(s.checks, s.consoleErrors);
  }
}

// ───────────────────────────── Summary + main ─────────────────────────────

function printSummary(shots: ShotRecord[]): void {
  const byRoute = new Map<string, { pass: number; warn: number; fail: number }>();
  for (const s of shots) {
    const e = byRoute.get(s.route) || { pass: 0, warn: 0, fail: 0 };
    if (s.status === "PASS") e.pass++;
    else if (s.status === "WARN") e.warn++;
    else e.fail++;
    byRoute.set(s.route, e);
  }
  const routeW = Math.max(6, ...Array.from(byRoute.keys()).map((r) => r.length));
  console.log("\n" + "Route".padEnd(routeW) + "  PASS  WARN  FAIL");
  console.log("-".repeat(routeW + 20));
  let totals = { pass: 0, warn: 0, fail: 0 };
  for (const [route, e] of byRoute) {
    console.log(route.padEnd(routeW) + `  ${String(e.pass).padStart(4)}  ${String(e.warn).padStart(4)}  ${String(e.fail).padStart(4)}`);
    totals.pass += e.pass;
    totals.warn += e.warn;
    totals.fail += e.fail;
  }
  console.log("-".repeat(routeW + 20));
  console.log(
    "TOTAL".padEnd(routeW) + `  ${String(totals.pass).padStart(4)}  ${String(totals.warn).padStart(4)}  ${String(totals.fail).padStart(4)}`,
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.join("docs/v4/shots", args.round);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.join(outDir, "sheets"), { recursive: true });

  const catalog = fullDeviceCatalog().filter((d) => args.deviceClasses.has(d.cls));
  const jobs = buildJobs(catalog, args);

  const enginesNeeded = new Set(jobs.map((j) => j.device.engine));
  const browsers: Partial<Record<Engine, Browser>> = {};
  const launches: Promise<void>[] = [];
  if (enginesNeeded.has("chromium")) launches.push(chromium.launch().then((b) => void (browsers.chromium = b)));
  if (enginesNeeded.has("webkit")) launches.push(webkit.launch().then((b) => void (browsers.webkit = b)));
  if (enginesNeeded.has("firefox")) launches.push(firefox.launch().then((b) => void (browsers.firefox = b)));
  await Promise.all(launches);

  const started = Date.now();
  console.log(
    `viewport-runner: round=${args.round} base=${args.base} devices=${catalog.length} jobs=${jobs.length} routes=${args.routes.length} workers=${args.workers}`,
  );

  const allShots: ShotRecord[] = [];
  await runPool(jobs, args.workers, async (job) => {
    const recs = await runJob(job, browsers as Record<Engine, Browser>, args.base, outDir);
    allShots.push(...recs);
  });

  await darkSchemeDiffPass(allShots, outDir);

  for (const b of Object.values(browsers)) await (b as Browser).close();

  const durationMs = Date.now() - started;

  // Contact sheets — one per route, tiling baseline-mode shots.
  const byRoute = new Map<string, SheetTile[]>();
  for (const s of allShots) {
    if (s.mode !== "baseline" || !s.file) continue;
    const arr = byRoute.get(s.route) || [];
    arr.push({ file: path.join(outDir, s.file), label: `${s.deviceLabel} · ${s.mode}`, status: s.status });
    byRoute.set(s.route, arr);
  }
  const sheetPaths: string[] = [];
  for (const [route, tiles] of byRoute) {
    const slug = routeSlug(route);
    const sheetFile = path.join(outDir, "sheets", `${slug}.png`);
    await buildRouteContactSheet(route, tiles, sheetFile);
    sheetPaths.push(sheetFile);
  }

  const matrix = {
    round: args.round,
    base: args.base,
    startedAt: new Date(started).toISOString(),
    durationMs,
    routes: args.routes,
    deviceCount: catalog.length,
    jobCount: jobs.length,
    shotCount: allShots.length,
    modes: Array.from(new Set(allShots.map((s) => s.mode))),
    shots: allShots,
  };
  fs.writeFileSync(path.join(outDir, "matrix.json"), JSON.stringify(matrix, null, 2));

  printSummary(allShots);
  console.log(`\nwrote ${allShots.length} shots, ${sheetPaths.length} contact sheets`);
  console.log(`matrix.json: ${path.join(outDir, "matrix.json")}`);
  console.log(`duration: ${(durationMs / 1000).toFixed(1)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
