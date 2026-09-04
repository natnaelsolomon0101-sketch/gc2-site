/**
 * The favicon set. `npx tsx scripts/make-icons.ts`.
 *
 * ROUND 8 (owner, 4 Sep 2026, TRANSFORM.md): the paper "G" is gone. The mark is
 * now a TILE — a rounded square in deep iris (--color-accent-deep-iris) with the
 * G in DM Serif Display **Italic** in paper, optically centred. The apple-touch
 * icon is the same tile in orchid bloom (--color-accent-orchid-bloom) with the G
 * in ink, which is the footer's own colour pair: the icon a woman long-presses
 * onto her home screen is the pink one.
 *
 * WHY A TILE AND NOT A LETTER ON PAPER. The old set was ink on the page ground,
 * so at 16px in a browser tab, on a light tab strip, it was a dark smudge on a
 * background the same colour as the tab. A favicon has to hold its own edge at
 * 16 device pixels; a solid coloured tile is the only thing that reliably does.
 * The tile is also what makes the mark legible on a phone home screen, where it
 * sits on an arbitrary wallpaper.
 *
 * WHY ITALIC. The site's one typographic move is the italic operative word in
 * deep iris (TRANSFORM.md rule 2). The mark is that move, compressed to one
 * glyph: the italic G is the site's voice, not a generic serif capital.
 *
 * THE GLYPH IS THE REAL OUTLINE, NOT A <text> ELEMENT AND NOT A FAUX SLANT.
 * `src/app/fonts/DMSerifDisplay-Italic.ttf` is vendored beside the Regular the
 * OG cards already use (SIL OFL, same licence file). GLYPH_G below is its "G"
 * contour, lifted with fontTools' SVGPathPen, units per em 1000, bbox
 * (48,-17)-(661,678). Setting the mark as <text font-family="serif"> would
 * render whatever the viewer's OS had lying around — a different mark on every
 * machine — and skewing the Regular by -12deg is a faux italic, which is not
 * the same drawing: the true italic G has a different bowl, a different spur
 * and a swash-ended crossbar.
 *
 * ONE SOURCE OF TRUTH. `svg()` below draws the mark; every artifact in the set
 * is that same SVG rasterised, and `src/app/icon.svg` is that same SVG written
 * to disk. There is no second drawing to keep in sync.
 *
 * Google shows a site's own favicon in mobile results only when it finds a
 * square icon, at least 48x48 and a multiple of 48, at a stable crawlable URL,
 * consistent across the site — and it strongly prefers /favicon.ico plus a
 * <link rel="icon">. That is why the .ico carries 16/32/48 and why the set is
 * one drawing in every size.
 */
import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import zlib from "node:zlib";
import { site } from "../src/config/site";

/* Tokens, copied by value because a build script cannot read globals.css.
   These are --color-ground, --color-ink, --color-accent-deep-iris and
   --color-accent-orchid-bloom, and nothing else. */
const PAPER = "#f7f5f0";
const INK = "#141311";
const DEEP_IRIS = "#4b49aa";
const ORCHID = "#dd90d8";

const APP = join(process.cwd(), "src", "app");
const PUBLIC = join(process.cwd(), "public");

/** DM Serif Display Italic, "G". See the header note. */
const GLYPH_G =
  "M357 -17Q212 -17 130 60Q48 136 48 274Q48 360 78 434Q107 507 160 562Q214 617 " +
  "286 648Q357 678 441 678Q546 678 636 628L612 471H602L564 575Q548 621 526 640Q503 " +
  "658 453 658Q376 658 317 608Q258 557 225 470Q192 382 192 270Q192 187 214 127Q237 " +
  "67 275 35Q313 3 361 3Q387 3 402 14Q418 24 423 55L429 86Q434 118 441 160Q448 202 " +
  "453 241Q463 294 410 311L388 318L390 328H661L659 318L637 308Q600 293 592 252L549 " +
  "25Q505 6 460 -6Q416 -17 357 -17Z";

/* The mark is drawn in a 32-unit square and scaled; every number below is in
   those units.

   SIZE. The glyph's ink box (695 units tall, 613 wide) is fitted to 17.6 of the
   32, i.e. 55% of the tile height and 48% of its width. Smaller and the tile
   reads as a coloured square with something in it; larger and the italic's
   top-right terminal touches the corner radius.

   OPTICAL CENTRE, not geometric. Two corrections, both small and both because
   the eye does not measure bounding boxes: the italic leans right, so its mass
   sits right of its box and the glyph moves 0.2 units LEFT of centre; and a
   cap-height letter centred on its own box reads slightly low, so it moves 0.3
   units UP. Verified against the 512 render, not guessed.

   CORNER RADIUS 7.2/32 = 22.5%, the iOS-ish superellipse approximation. It is
   the same on every size including the apple icon, which iOS masks again with
   its own squircle: a full-bleed square there would be masked to something
   noticeably rounder than the browser-tab mark, and this set is one mark. */
const GLYPH_BOX = { x0: 48, y0: -17, x1: 661, y1: 678 };
const GLYPH_H = 17.6;
const NUDGE_X = -0.2;
const NUDGE_Y = -0.3;
const RADIUS = 7.2;

const SCALE = GLYPH_H / (GLYPH_BOX.y1 - GLYPH_BOX.y0);
const CX = (GLYPH_BOX.x0 + GLYPH_BOX.x1) / 2;
const CY = (GLYPH_BOX.y0 + GLYPH_BOX.y1) / 2;
/* Font space is y-up, SVG is y-down: (x, y) -> (TX + s*x, TY - s*y). */
const TX = 16 + NUDGE_X - SCALE * CX;
const TY = 16 + NUDGE_Y + SCALE * CY;

const n = (v: number) => Number(v.toFixed(4)).toString();

/** The mark, as standalone SVG markup. `size` sets width/height; the artwork is
 *  always the same 32-unit drawing. */
function svg(tile: string, glyph: string, size = 32) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" role="img" aria-label="${site.mark}">
  <rect width="32" height="32" rx="${RADIUS}" ry="${RADIUS}" fill="${tile}"/>
  <path transform="translate(${n(TX)} ${n(TY)}) scale(${n(SCALE)} ${n(-SCALE)})" fill="${glyph}" d="${GLYPH_G}"/>
</svg>
`;
}

/** The file written to src/app/icon.svg, with the note a reader needs. */
function iconSvgFile() {
  /* NO DOUBLE HYPHEN ANYWHERE IN THIS COMMENT. XML forbids "--" inside a
     comment, and an SVG that names its CSS custom properties literally
     ("<--color-accent-deep-iris>") is a parse error, not a warning: the
     browser renders the error page instead of the icon and the tab falls back
     to a globe. Verified live at /icon.svg. Token names are spelled out in
     words below for that reason. */
  return `<!-- GENERATED by scripts/make-icons.ts. Do not hand edit; run the script.

     The GC2 mark: a rounded square in the deep iris accent token (#4b49aa)
     with the "G" of DM Serif Display Italic in the paper ground token
     (#f7f5f0), optically centred. The path is the real glyph outline, lifted
     from the vendored src/app/fonts/DMSerifDisplay-Italic.ttf. A <text>
     element in a named serif would render whatever the viewer's machine had
     lying around, which is a different mark on every screen, and a skewed
     Regular is a faux italic, not this drawing.

     Every other file in the set (favicon.ico, icon.png, apple-icon.png,
     public/icon-192.png, public/icon-512.png, public/logo.png) is this same
     artwork rasterised, so the whole set agrees, which is one of the things
     Google checks before it will show a site's own favicon instead of a
     globe. The apple touch icon is the one deliberate variant: an orchid
     bloom tile (#dd90d8) with an ink glyph, the footer's own colour pair. -->
${svg(DEEP_IRIS, PAPER)}`;
}

/* ------------------------------------------------------------------------- */

async function raster() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const p = await ctx.newPage();

  /** One square PNG of `markup` at `size`, transparent outside the tile's
   *  corner radius. */
  const shot = async (markup: string, size: number) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(
      `<style>html,body{margin:0;padding:0;background:transparent}
        #box{width:${size}px;height:${size}px;line-height:0}
        svg{display:block;width:${size}px;height:${size}px}</style>
       <div id="box">${markup}</div>`,
      { waitUntil: "load" }
    );
    return p.locator("#box").screenshot({ type: "png", omitBackground: true });
  };

  return { browser, shot };
}

/* CRC-32, for the PNG chunks rewritten below. */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Buffer) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/**
 * Re-encode an 8-bit RGB PNG as 8-bit RGBA.
 *
 * Chromium writes colour type 2 — no alpha channel — whenever the surface it
 * captured is fully opaque. Next's image pipeline then refuses the ICO outright:
 * "Format error decoding Ico: The PNG is not in RGBA format!". The rounded tile
 * has transparent corners, so in practice every capture here is already type 6
 * and this is a guard rather than a conversion — but a future square variant
 * would trip it, and the fix is eleven lines of PNG filtering rather than a
 * dependency, so it stays.
 */
function toRgba(png: Buffer): Buffer {
  const sig = png.subarray(0, 8);
  let pos = 8;
  let ihdr: Buffer | null = null;
  const idat: Buffer[] = [];
  while (pos < png.length) {
    const len = png.readUInt32BE(pos);
    const type = png.toString("latin1", pos + 4, pos + 8);
    const data = png.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") ihdr = Buffer.from(data);
    if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  if (!ihdr) throw new Error("PNG has no IHDR");

  const w = ihdr.readUInt32BE(0);
  const h = ihdr.readUInt32BE(4);
  const depth = ihdr[8];
  const colour = ihdr[9];
  if (colour === 6) return png;                      // already RGBA
  if (colour !== 2 || depth !== 8) {
    throw new Error(`unexpected PNG: colour type ${colour}, depth ${depth}`);
  }

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 3;
  const stride = w * bpp;
  const out = Buffer.alloc(h * (1 + w * 4));
  const line = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);

  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const q = a + b - c;
        const pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      line[i] = v & 0xff;
    }
    const at = y * (1 + w * 4);
    out[at] = 0;                                      // filter: none
    for (let x = 0; x < w; x++) {
      out[at + 1 + x * 4 + 0] = line[x * 3 + 0];
      out[at + 1 + x * 4 + 1] = line[x * 3 + 1];
      out[at + 1 + x * 4 + 2] = line[x * 3 + 2];
      out[at + 1 + x * 4 + 3] = 255;
    }
    line.copy(prev);
  }

  const head = Buffer.alloc(13);
  head.writeUInt32BE(w, 0);
  head.writeUInt32BE(h, 4);
  head[8] = 8;                                        // bit depth
  head[9] = 6;                                        // colour type: RGBA
  return Buffer.concat([
    sig,
    chunk("IHDR", head),
    chunk("IDAT", zlib.deflateSync(out, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * ICO container. Header: reserved(2)=0, type(2)=1 (icon), count(2). Then one
 * 16-byte directory entry per image — width, height (0 means 256), palette
 * count, reserved, planes, bit depth, byte length, byte offset — then the
 * images themselves, here as PNG. PNG-in-ICO is read by every browser still
 * shipping and by Googlebot, and this is not worth a dependency.
 */
function ico(images: { size: number; buf: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;
  images.forEach((img, i) => {
    const at = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, at + 0);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, at + 1);
    dir.writeUInt8(0, at + 2);           // palette: none, the PNG carries it
    dir.writeUInt8(0, at + 3);           // reserved
    dir.writeUInt16LE(1, at + 4);        // colour planes
    dir.writeUInt16LE(32, at + 6);       // bits per pixel
    dir.writeUInt32LE(img.buf.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += img.buf.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.buf)]);
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });
  const { browser, shot } = await raster();

  const IRIS_MARK = svg(DEEP_IRIS, PAPER);
  const ORCHID_MARK = svg(ORCHID, INK);

  /* 16 and 32 are for the ICO only. 48/96/144/192 are Google's multiples of 48;
     180 is the iOS home-screen size; 512 is the manifest's large icon and the
     schema.org logo. */
  const iris = new Map<number, Buffer>();
  for (const size of [16, 32, 48, 96, 144, 192, 512]) {
    iris.set(size, await shot(IRIS_MARK, size));
  }
  const apple = await shot(ORCHID_MARK, 180);
  await browser.close();

  const write = async (path: string, buf: Buffer | string, label: string) => {
    const b = typeof buf === "string" ? Buffer.from(buf) : buf;
    await writeFile(path, b);
    console.log(`  ${label.padEnd(32)} ${b.length}B`);
  };

  await write(join(APP, "icon.svg"), iconSvgFile(), "src/app/icon.svg");

  /* public/, not src/app/. As a Next file convention favicon.ico emits its own
     hashed <link rel="icon"> ALONGSIDE the one the metadata block declares —
     the one icon convention `metadata.icons` does not suppress — so the page
     would carry two links for the same bytes. Served from public/ there is no
     convention, the metadata entry is the single declaration, and /favicon.ico
     is a stable URL with no cache-busting query, which is what a crawler
     wants. */
  await write(join(PUBLIC, "favicon.ico"),
    ico([16, 32, 48].map((size) => ({ size, buf: toRgba(iris.get(size)!) }))),
    "public/favicon.ico 16/32/48");
  await write(join(APP, "icon.png"), iris.get(512)!, "src/app/icon.png 512");
  await write(join(APP, "apple-icon.png"), apple, "src/app/apple-icon.png 180 orchid");
  await write(join(PUBLIC, "logo.png"), iris.get(512)!, "public/logo.png 512");
  await write(join(PUBLIC, "icon-192.png"), iris.get(192)!, "public/icon-192.png");
  await write(join(PUBLIC, "icon-512.png"), iris.get(512)!, "public/icon-512.png");

  /* The manifest is generated here rather than hand-written, so the fund name
     is read out of src/config/site.ts like everywhere else — README's rule is
     that the name has one home, and a checked-in JSON file is exactly where a
     second copy goes stale. It stays at /site.webmanifest (a public file)
     rather than moving to Next's app/manifest.ts convention, which would serve
     it at /manifest.webmanifest and change the URL the metadata declares.

     theme_color stays PAPER: it is the browser-chrome colour and it has to
     agree with the `themeColor` in src/app/layout.tsx's viewport export, which
     is the page's own canvas. background_color is the SPLASH colour, the frame
     the icon is shown in while the app boots, and that is now the tile's own
     deep iris so the mark sits on its own ground rather than floating on paper.

     `purpose: "any maskable"` on the 512 is honest here and was not before: a
     maskable icon has to survive being cropped to the launcher's own shape,
     and this mark is a full-bleed tile with the glyph at 55% of the height,
     well inside the 80% safe zone. The old paper wordmark would have been
     clipped. */
  await write(
    join(PUBLIC, "site.webmanifest"),
    JSON.stringify(
      {
        name: site.name,
        short_name: site.mark,
        start_url: "/",
        display: "minimal-ui",
        background_color: DEEP_IRIS,
        theme_color: PAPER,
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
        ],
      },
      null,
      2
    ) + "\n",
    "public/site.webmanifest"
  );
}

main();
