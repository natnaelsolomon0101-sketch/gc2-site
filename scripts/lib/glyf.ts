/**
 * A minimal TrueType outline reader.
 *
 * The favicon has to be the wordmark, not an approximation of it: SWARM §4.3
 * says "cut them from the wordmark". An SVG `<text>` element cannot carry
 * Newsreader — a favicon renders in a restricted context with no webfont — so
 * the glyphs are converted to real outlines here and the SVG ships as paths.
 *
 * Scope is deliberately narrow: `cmap` format 4, simple and composite glyphs,
 * quadratic contours. That covers G, C and 2 in Newsreader (its "2" is a
 * composite). Anything outside that throws rather than silently drawing the
 * wrong shape.
 */

type Tables = Map<string, { offset: number; length: number }>;
type Pt = { x: number; y: number; on: boolean };
/** 2x3 affine, in the order TrueType stores it: [a, b, c, d, dx, dy]. */
type Xform = [number, number, number, number, number, number];

function tables(b: Buffer): Tables {
  const n = b.readUInt16BE(4);
  const t: Tables = new Map();
  for (let i = 0; i < n; i++) {
    const p = 12 + i * 16;
    t.set(b.toString("ascii", p, p + 4), {
      offset: b.readUInt32BE(p + 8),
      length: b.readUInt32BE(p + 12),
    });
  }
  return t;
}

function need(t: Tables, tag: string) {
  const e = t.get(tag);
  if (!e) throw new Error(`font has no ${tag} table`);
  return e;
}

/** cmap format 4 — the Unicode BMP subtable every text font ships. */
function charMap(b: Buffer, cmapOff: number): Map<number, number> {
  const n = b.readUInt16BE(cmapOff + 2);
  let sub = -1;
  for (let i = 0; i < n; i++) {
    const p = cmapOff + 4 + i * 8;
    const plat = b.readUInt16BE(p);
    const enc = b.readUInt16BE(p + 2);
    const off = cmapOff + b.readUInt32BE(p + 4);
    if (b.readUInt16BE(off) !== 4) continue;
    if ((plat === 3 && enc === 1) || plat === 0) sub = off;
  }
  if (sub < 0) throw new Error("no format 4 unicode cmap subtable");

  const segX2 = b.readUInt16BE(sub + 6);
  const seg = segX2 / 2;
  const endO = sub + 14;
  const startO = endO + segX2 + 2;
  const deltaO = startO + segX2;
  const rangeO = deltaO + segX2;

  const map = new Map<number, number>();
  for (let i = 0; i < seg; i++) {
    const end = b.readUInt16BE(endO + i * 2);
    const start = b.readUInt16BE(startO + i * 2);
    const delta = b.readInt16BE(deltaO + i * 2);
    const rangeOff = b.readUInt16BE(rangeO + i * 2);
    if (start === 0xffff) continue;
    for (let c = start; c <= end; c++) {
      let g: number;
      if (rangeOff === 0) g = (c + delta) & 0xffff;
      else {
        const gi = rangeO + i * 2 + rangeOff + (c - start) * 2;
        if (gi + 1 >= b.length) continue;
        g = b.readUInt16BE(gi);
        if (g !== 0) g = (g + delta) & 0xffff;
      }
      if (g !== 0) map.set(c, g);
    }
  }
  return map;
}

function apply(p: Pt, m: Xform): Pt {
  return { x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5], on: p.on };
}

const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true });

/** Contours to SVG path data. TrueType allows two consecutive off-curve points, with an implied on-curve point at their midpoint. */
function toPath(contours: Pt[][], round = (n: number) => Number(n.toFixed(1))): string {
  let d = "";
  for (const pts of contours) {
    if (!pts.length) continue;
    const s = pts.findIndex((q) => q.on);
    const ring: Pt[] =
      s >= 0 ? [...pts.slice(s), ...pts.slice(0, s)] : [mid(pts[pts.length - 1], pts[0]), ...pts];
    const n = ring.length;

    d += `M${round(ring[0].x)} ${round(ring[0].y)}`;
    let i = 1;
    while (i <= n) {
      const cur = ring[i % n];
      if (cur.on) {
        d += `L${round(cur.x)} ${round(cur.y)}`;
        i++;
        continue;
      }
      const nxt = ring[(i + 1) % n];
      const to = nxt.on ? nxt : mid(cur, nxt);
      d += `Q${round(cur.x)} ${round(cur.y)} ${round(to.x)} ${round(to.y)}`;
      i += nxt.on ? 2 : 1;
    }
    d += "Z";
  }
  return d;
}

export type Font = {
  unitsPerEm: number;
  ascender: number;
  descender: number;
  /** SVG path data in font units, y-up. Empty string for a blank glyph. */
  path(ch: string): string;
  advance(ch: string): number;
};

export function readFont(buf: Buffer): Font {
  const t = tables(buf);
  const head = need(t, "head").offset;
  const unitsPerEm = buf.readUInt16BE(head + 18);
  const longLoca = buf.readInt16BE(head + 50) === 1;

  const hhea = need(t, "hhea").offset;
  const ascender = buf.readInt16BE(hhea + 4);
  const descender = buf.readInt16BE(hhea + 6);
  const numHMetrics = buf.readUInt16BE(hhea + 34);

  const numGlyphs = buf.readUInt16BE(need(t, "maxp").offset + 4);
  const loca = need(t, "loca").offset;
  const glyf = need(t, "glyf").offset;
  const hmtx = need(t, "hmtx").offset;
  const cmap = charMap(buf, need(t, "cmap").offset);

  const glyphOf = (ch: string) => {
    const g = cmap.get(ch.codePointAt(0)!);
    if (g === undefined || g >= numGlyphs) throw new Error(`font has no glyph for "${ch}"`);
    return g;
  };
  const locaAt = (i: number) =>
    longLoca ? buf.readUInt32BE(loca + i * 4) : buf.readUInt16BE(loca + i * 2) * 2;

  function outline(gid: number, depth = 0): Pt[][] {
    if (depth > 5) throw new Error("composite glyph nested too deep");
    const start = locaAt(gid);
    const end = locaAt(gid + 1);
    if (end <= start) return []; // blank glyph, e.g. space
    let p = glyf + start;
    const nContours = buf.readInt16BE(p);
    p += 10;

    if (nContours < 0) {
      // Composite: a list of component glyphs, each with its own placement.
      const out: Pt[][] = [];
      for (;;) {
        const flags = buf.readUInt16BE(p);
        const idx = buf.readUInt16BE(p + 2);
        p += 4;

        let a1: number;
        let a2: number;
        if (flags & 0x0001) {
          a1 = buf.readInt16BE(p);
          a2 = buf.readInt16BE(p + 2);
          p += 4;
        } else {
          a1 = buf.readInt8(p);
          a2 = buf.readInt8(p + 1);
          p += 2;
        }
        if (!(flags & 0x0002)) throw new Error("composite uses point matching; not supported");

        const f2 = () => {
          const v = buf.readInt16BE(p) / 16384;
          p += 2;
          return v;
        };
        let m: Xform = [1, 0, 0, 1, a1, a2];
        if (flags & 0x0008) {
          const s = f2();
          m = [s, 0, 0, s, a1, a2];
        } else if (flags & 0x0040) {
          const sx = f2();
          const sy = f2();
          m = [sx, 0, 0, sy, a1, a2];
        } else if (flags & 0x0080) {
          const a = f2();
          const b = f2();
          const c = f2();
          const d = f2();
          m = [a, b, c, d, a1, a2];
        }

        for (const c of outline(idx, depth + 1)) out.push(c.map((q) => apply(q, m)));
        if (!(flags & 0x0020)) break; // MORE_COMPONENTS
      }
      return out;
    }

    const ends: number[] = [];
    for (let i = 0; i < nContours; i++, p += 2) ends.push(buf.readUInt16BE(p));
    const nPts = nContours === 0 ? 0 : ends[ends.length - 1] + 1;
    p += 2 + buf.readUInt16BE(p); // skip hinting instructions

    const flags: number[] = [];
    while (flags.length < nPts) {
      const f = buf.readUInt8(p++);
      flags.push(f);
      if (f & 8) {
        let r = buf.readUInt8(p++);
        while (r-- > 0) flags.push(f);
      }
    }

    const read = (shortBit: number, sameBit: number) => {
      const out: number[] = [];
      let v = 0;
      for (const f of flags) {
        if (f & shortBit) {
          const d = buf.readUInt8(p++);
          v += f & sameBit ? d : -d;
        } else if (!(f & sameBit)) {
          v += buf.readInt16BE(p);
          p += 2;
        }
        out.push(v);
      }
      return out;
    };
    const xs = read(2, 16);
    const ys = read(4, 32);

    const contours: Pt[][] = [];
    let from = 0;
    for (const last of ends) {
      const pts: Pt[] = [];
      for (let i = from; i <= last; i++) pts.push({ x: xs[i], y: ys[i], on: !!(flags[i] & 1) });
      from = last + 1;
      contours.push(pts);
    }
    return contours;
  }

  return {
    unitsPerEm,
    ascender,
    descender,
    advance(ch) {
      const g = glyphOf(ch);
      const i = Math.min(g, numHMetrics - 1);
      return buf.readUInt16BE(hmtx + i * 4);
    },
    path(ch) {
      return toPath(outline(glyphOf(ch)));
    },
  };
}
