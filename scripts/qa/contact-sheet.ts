/**
 * Contact-sheet composer.
 *
 * Tiles every screenshot for one route into a single labeled PNG so a human
 * (or the Conductor, per docs/EVERY-SCREEN.md §6.5) can look at one image
 * instead of forty. Composition uses `sharp`, which resolves from this
 * worktree's (symlinked) node_modules even though it is not a declared
 * dependency in package.json — see the "Notes" section of the final report
 * for why matrix.ts does not fall back to the Playwright-HTML-grid method.
 *
 * Each tile carries a small label bar (device + mode) burned in via an SVG
 * rasterized by sharp — sharp has no native text API, so the label is drawn
 * as SVG and composited as a PNG layer, same technique either way.
 */
import sharp from "sharp";
import type { OverlayOptions } from "sharp";
import fs from "node:fs";
import path from "node:path";

export interface SheetTile {
  /** Absolute path to the source screenshot PNG. */
  file: string;
  /** Label burned under the tile, e.g. "iPhone 15 Pro · 393×852 · baseline". */
  label: string;
  /** Aggregate shot status, used to tint the label bar. */
  status: "PASS" | "WARN" | "FAIL";
}

const TILE_W = 260; // thumbnail width, px
const LABEL_H = 34; // label bar height, px
const GUTTER = 8;
const MAX_TILE_H = 480; // cap so very tall mobile fullpage shots don't blow up the sheet

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusColor(status: SheetTile["status"]): string {
  if (status === "FAIL") return "#7a1f1f";
  if (status === "WARN") return "#7a5a1f";
  return "#1f3d2a";
}

/**
 * Builds one contact-sheet PNG tiling every shot for a route, in a roughly
 * square grid, each tile labeled with device/mode and tinted by status.
 */
export async function buildRouteContactSheet(
  routeLabel: string,
  tiles: SheetTile[],
  outFile: string,
): Promise<void> {
  if (tiles.length === 0) return;

  const cols = Math.max(1, Math.ceil(Math.sqrt(tiles.length * 1.3)));
  const rows = Math.ceil(tiles.length / cols);

  // Pre-scale every source PNG to a fixed thumbnail width so the grid is
  // regular; height varies per shot (preserve aspect, capped).
  const thumbs: { buf: Buffer; w: number; h: number }[] = [];
  for (const t of tiles) {
    const img = sharp(t.file);
    const meta = await img.metadata();
    const srcW = meta.width || TILE_W;
    const srcH = meta.height || TILE_W;
    let h = Math.round((srcH / srcW) * TILE_W);
    if (h > MAX_TILE_H) h = MAX_TILE_H;
    const buf = await img
      .resize({ width: TILE_W, height: h, fit: "cover", position: "top" })
      .png()
      .toBuffer();
    thumbs.push({ buf, w: TILE_W, h });
  }

  const rowHeights: number[] = [];
  for (let r = 0; r < rows; r++) {
    let maxH = 0;
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i < thumbs.length) maxH = Math.max(maxH, thumbs[i].h);
    }
    rowHeights.push(maxH + LABEL_H);
  }

  const sheetW = cols * (TILE_W + GUTTER) + GUTTER;
  const sheetH =
    rowHeights.reduce((a, b) => a + b + GUTTER, 0) + GUTTER + 60; // +60 title bar

  const composites: OverlayOptions[] = [];
  let y = 60 + GUTTER;

  // Title bar
  const titleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="60">
    <rect width="100%" height="100%" fill="#0b0b0d"/>
    <text x="16" y="38" font-family="monospace" font-size="24" fill="#e8e8e8">${escapeXml(routeLabel)}</text>
  </svg>`;
  composites.push({ input: Buffer.from(titleSvg), left: 0, top: 0 });

  for (let r = 0; r < rows; r++) {
    let x = GUTTER;
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= thumbs.length) continue;
      const th = thumbs[i];
      const tile = tiles[i];
      composites.push({ input: th.buf, left: x, top: y });
      const labelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${LABEL_H}">
        <rect width="100%" height="100%" fill="${statusColor(tile.status)}"/>
        <text x="4" y="14" font-family="monospace" font-size="10" fill="#f2f2f2">${escapeXml(tile.label)}</text>
        <text x="4" y="27" font-family="monospace" font-size="10" fill="#f2f2f2">${tile.status}</text>
      </svg>`;
      composites.push({ input: Buffer.from(labelSvg), left: x, top: y + th.h });
      x += TILE_W + GUTTER;
    }
    y += rowHeights[r] + GUTTER;
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 3,
      background: "#0b0b0d",
    },
  })
    .composite(composites)
    .png()
    .toFile(outFile);
}

// Allow standalone invocation: rebuild every contact sheet for a round from
// an existing matrix.json (useful if tiles are re-labeled without a re-shoot).
if (import.meta.url === `file://${process.argv[1]}`) {
  const round = process.argv[2];
  if (!round) {
    console.error("usage: npx tsx scripts/qa/contact-sheet.ts <round>");
    process.exit(1);
  }
  const dir = path.join("docs/v4/shots", round);
  const matrixPath = path.join(dir, "matrix.json");
  const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
  const byRoute = new Map<string, SheetTile[]>();
  for (const shot of matrix.shots as any[]) {
    if (shot.mode !== "baseline") continue;
    const arr = byRoute.get(shot.route) || [];
    arr.push({
      file: path.join(dir, shot.file),
      label: `${shot.deviceLabel} · ${shot.mode}`,
      status: shot.status,
    });
    byRoute.set(shot.route, arr);
  }
  (async () => {
    for (const [route, tiles] of byRoute) {
      const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
      await buildRouteContactSheet(route, tiles, path.join(dir, "sheets", `${slug}.png`));
      console.log(`sheet: ${slug}.png (${tiles.length} tiles)`);
    }
  })();
}
