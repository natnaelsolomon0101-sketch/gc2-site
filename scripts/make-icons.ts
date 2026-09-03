/**
 * The favicon set. `npx tsx scripts/make-icons.ts`.
 *
 * Google shows a site's own favicon in mobile results only when it finds a
 * square icon, at least 48x48 and a multiple of 48, at a stable crawlable URL,
 * consistent across the site — and it strongly prefers /favicon.ico plus a
 * <link rel="icon">. Before this the site had one 32x32 SVG, so the results
 * page drew a globe.
 *
 * The mark is the wordmark: "GC2" in DM Serif Display, ink on the paper ground,
 * tight-cropped with an even margin and no border. Rendered from the SAME
 * vendored TTF the Open Graph cards and the share kit use — setting it in a
 * named serif would render whatever the machine had lying around, which is a
 * different mark on every build.
 *
 * AT 16 AND 32 THE MARK IS "G". Three glyphs across 16 device pixels is five
 * pixels each; it renders as a grey smudge, and a smudge is worse than no
 * favicon because it still occupies the slot. The G alone is the wordmark's own
 * first letter at a legible size, which is what src/app/icon.svg has always
 * drawn. 48 and above carry the full GC2 — that is the size Google actually
 * asks for and the size a browser tab uses on a retina screen.
 *
 * The ICO is written by hand rather than pulled from a package: it is a 6-byte
 * header, a 16-byte directory entry per image, and the PNG bytes. PNG-in-ICO is
 * read by every browser still shipping and by Googlebot, and this is not worth
 * a dependency.
 */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import zlib from "node:zlib";
import { site } from "../src/config/site";

const GROUND = "#f7f5f0";
const INK = "#141311";

const APP = join(process.cwd(), "src", "app");
const PUBLIC = join(process.cwd(), "public");
const FONT = join(APP, "fonts", "DMSerifDisplay-Regular.ttf");

/** Below this the full wordmark is a smudge; see the note above. */
const WORDMARK_FLOOR = 48;

async function page() {
  const ttf = (await readFile(FONT)).toString("base64");
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent(
    `<style>
      @font-face{font-family:"GC2 Display";font-style:normal;font-weight:400;
        font-display:block;src:url(data:font/ttf;base64,${ttf}) format("truetype")}
      html,body{margin:0;padding:0;background:${GROUND}}
      #box{display:flex;align-items:center;justify-content:center;background:${GROUND}}
      #mark{font-family:"GC2 Display";color:${INK};line-height:1;white-space:nowrap;
        letter-spacing:-0.02em}
     </style>
     <div id="box"><span id="mark">GC2</span></div>`,
    { waitUntil: "load" }
  );
  await p.evaluate(async () => {
    await document.fonts.ready;
    await document.fonts.load('400 100px "GC2 Display"');
  });
  if (!(await p.evaluate(() => document.fonts.check('400 100px "GC2 Display"')))) {
    throw new Error("DM Serif Display did not load; the mark would render in a fallback");
  }
  return { browser, p };
}

/** Renders one square PNG with the mark fitted to `size` minus an even margin. */
async function render(p: Awaited<ReturnType<typeof page>>["p"], size: number) {
  const text = size >= WORDMARK_FLOOR ? "GC2" : "G";
  /* 12% margin on the wordmark, 16% on the single letter: one glyph needs more
     air around it to read as a mark rather than as a crop. */
  const margin = Math.max(1, Math.round(size * (text === "GC2" ? 0.12 : 0.16)));
  const inner = size - margin * 2;

  await p.setViewportSize({ width: size, height: size });
  const fitted = await p.evaluate(
    ({ size, text, inner }) => {
      const box = document.getElementById("box") as HTMLElement;
      const mark = document.getElementById("mark") as HTMLElement;
      box.style.width = `${size}px`;
      box.style.height = `${size}px`;
      mark.textContent = text;
      /* Fit by measurement, not by a ratio guess: the wordmark is width-bound
         and the single letter is height-bound, and the two want different
         font sizes for the same box. */
      let fs = inner;
      for (let i = 0; i < 24; i++) {
        mark.style.fontSize = `${fs}px`;
        const r = mark.getBoundingClientRect();
        const over = Math.max(r.width / inner, r.height / inner);
        if (Math.abs(over - 1) < 0.01) break;
        fs = fs / over;
      }
      mark.style.fontSize = `${fs}px`;
      return Math.round(fs * 100) / 100;
    },
    { size, text, inner }
  );
  const buf = await p.locator("#box").screenshot({ type: "png" });
  return { buf, text, fitted };
}

/* CRC-32, for the PNG chunks rewritten below. */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
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
 * captured is fully opaque, and `omitBackground` does not change that because
 * the element paints its own ground. Next's image pipeline then refuses the
 * ICO outright: "Format error decoding Ico: The PNG is not in RGBA format!".
 *
 * The alternative fixes are worse. Making one corner pixel alpha 254 to force
 * the encoder's hand puts a real, if imperceptible, hole in the mark. Adding an
 * image library adds a dependency for a build-time script that runs once. So:
 * inflate the IDATs, undo the five PNG filters, append an opaque alpha byte per
 * pixel, and write the chunks back with fresh CRCs. The pixels are unchanged —
 * only the channel count is.
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
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
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
 * images themselves, here as PNG.
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
  const { browser, p } = await page();
  await mkdir(PUBLIC, { recursive: true });

  const made: string[] = [];
  const out = new Map<number, Buffer>();
  /* 16 and 32 are for the ICO only. 48/96/144/192 are Google's multiples of 48;
     180 is the iOS home-screen size; 512 is the manifest's large icon and the
     schema.org logo. */
  for (const size of [16, 32, 48, 96, 144, 180, 192, 512]) {
    const { buf, text, fitted } = await render(p, size);
    out.set(size, buf);
    made.push(`${String(size).padStart(3)}  "${text}" at ${fitted}px  ${buf.length}B`);
  }
  await browser.close();

  const write = async (path: string, buf: Buffer, label: string) => {
    await writeFile(path, buf);
    console.log(`  ${label.padEnd(26)} ${buf.length}B`);
  };

  await write(join(APP, "favicon.ico"),
    ico([16, 32, 48].map((size) => ({ size, buf: toRgba(out.get(size)!) }))),
    "src/app/favicon.ico 16/32/48");
  await write(join(APP, "icon.png"), out.get(512)!, "src/app/icon.png 512");
  await write(join(APP, "apple-icon.png"), out.get(180)!, "src/app/apple-icon.png 180");
  await write(join(PUBLIC, "logo.png"), out.get(512)!, "public/logo.png 512");
  /* The manifest's own two sizes, as real files rather than as the 512 scaled
     down by whichever launcher happens to be asking. */
  await write(join(PUBLIC, "icon-192.png"), out.get(192)!, "public/icon-192.png");
  await write(join(PUBLIC, "icon-512.png"), out.get(512)!, "public/icon-512.png");

  /* The manifest is generated here rather than hand-written, so the fund name
     is read out of src/config/site.ts like everywhere else — README's rule is
     that the name has one home, and a checked-in JSON file is exactly where a
     second copy goes stale. It stays at /site.webmanifest (a public file)
     rather than moving to Next's app/manifest.ts convention, which would serve
     it at /manifest.webmanifest and change the URL the metadata declares. */
  await write(
    join(PUBLIC, "site.webmanifest"),
    Buffer.from(
      JSON.stringify(
        {
          name: site.name,
          short_name: site.mark,
          start_url: "/",
          display: "minimal-ui",
          /* Both the ground: the site does not change under
             prefers-color-scheme and neither should its chrome. */
          background_color: GROUND,
          theme_color: GROUND,
          icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          ],
        },
        null,
        2
      ) + "\n"
    ),
    "public/site.webmanifest"
  );

  console.log("\n  rendered:");
  for (const m of made) console.log("   " + m);
}

main();
