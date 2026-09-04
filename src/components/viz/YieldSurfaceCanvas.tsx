"use client";

import { useEffect, useRef } from "react";

/**
 * The canvas half of <YieldSurface/>. It receives the surface already fetched
 * and already projected into model space — it never talks to Treasury, and it
 * never decides what the data is.
 *
 * WHY A CANVAS AND NOT SVG. 13 tenors x 90 days is 1,170 points and ~103
 * polylines, redrawn every frame for ninety seconds. As SVG that is a thousand
 * DOM nodes the compositor has to keep alive and the layout engine has to skip;
 * as canvas it is one element and about 1.2ms of 2D context work per frame.
 *
 * WHY NO THREE.JS. The camera is one Y rotation, one X tilt and a divide. That
 * is fifteen lines below. A WebGL scene graph for fifteen lines of arithmetic
 * would be the largest dependency on the site by an order of magnitude, on the
 * page that has to paint fastest.
 *
 * THE CHART LAYER (hero r9). With `chart` set the floating mesh becomes a
 * floating chart: a gridded floor under the surface, tenor labels along the
 * front edge, the date range along the side, three yield ticks up the back
 * corner, the ten-year as a bold line with an area ribbon dropped to the
 * floor, and a marker on its last value with the number beside it. Every
 * label is a real value from the feed. It is the same object, drawn as the
 * instrument it is rather than as a sculpture of one.
 */

/** One day's curve in model space: x across tenor, y up in yield. */
export type SurfaceRow = { date: string; xs: number[]; ys: number[] };

export type ChartSpec = {
  /** Printed tenor labels, one per column ("1M" … "30Y"). */
  tenorLabels: string[];
  /** Column index of the highlighted series (the ten-year). */
  seriesIndex: number;
  /** Printed name of the highlighted series. */
  seriesLabel: string;
  /** Last value of the highlighted series, printed. */
  seriesLast: string;
  /** Three printed yield ticks, low to high, and their model-space y. */
  ticks: { label: string; y: number }[];
  /** Printed first and last dates of the window. */
  firstDate: string;
  lastDate: string;
  /** One printed date + value per row, for the hover readout. */
  series: { date: string; value: string }[];
};

export type YieldSurfaceCanvasProps = {
  rows: SurfaceRow[];
  /** CSS height of the canvas. 0 fills the parent box. */
  height: number;
  /** Camera tilt above the horizon, in degrees. */
  tilt: number;
  /** Half-depth of the time axis in model units: z runs -depth..+depth. */
  depth: number;
  /** Middle of the rock, in degrees of yaw. */
  yawCenter: number;
  /** Half-width of the rock. The yaw runs yawCenter ± yawRange. */
  yawRange: number;
  /** "band" anchors the surface into the right two-thirds of a wide slot;
   *  "natural" centres it. */
  fit: "band" | "natural";
  /** Alpha ceiling for the history strokes; the near edge gets this, the far
   *  edge gets 60% of it. */
  opacity: number;
  /** Draw one frame and stop. */
  isStatic: boolean;
  /** Draw the chart furniture. */
  chart?: ChartSpec;
};

const INK = "20, 19, 17";           // --color-ink, as channels for rgba()
const DEEP_IRIS = "#4b49aa";        // the one accent, spent on today's curve
const DEEP_IRIS_RGB = "75, 73, 170";
const PAPER = "247, 245, 240";
/* Half a cycle — one extreme to the other — takes 40s, so a full there-and-back
   is 80s. The yaw is a sine of time rather than a ramp, which gives the
   ease-in-out for free: the surface slows as it reaches each extreme and never
   turns a corner. */
const HALF_CYCLE_MS = 40_000;
/* The float: a slow vertical bob, 9s per cycle, ±6px, on its own sine so it
   never phase-locks with the rock. */
const BOB_MS = 9_000;
const BOB_PX = 6;
/* Pointer parallax (chart mode, hover devices only): the object leans up to
   ±PARALLAX_DEG of yaw toward the pointer and rides ±PARALLAX_PX with it,
   eased at PARALLAX_EASE per frame, so it floats with you rather than
   snapping. Measured into the scale so it never clips. */
const PARALLAX_DEG = 7;
const PARALLAX_PX = 10;
const PARALLAX_EASE = 0.045;
/* The ten-year line draws in over REVEAL_MS from the first frame; the marker
   arrives when the line does. */
const REVEAL_MS = 1400;
const CAMERA_DISTANCE = 3.2;        // in model units, from the origin

export default function YieldSurfaceCanvas({
  rows, height, tilt, depth, yawCenter, yawRange, fit, opacity, isStatic, chart,
}: YieldSurfaceCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || rows.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* A coarse pointer on a small screen is a phone. It gets the animation
       only if it can afford it — see the observer below, which takes it away
       again if the main thread is actually blocking. */
    const phone =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none) and (max-width: 767px)").matches;

    let animate = !isStatic && !reduced;
    let raf = 0;
    let start = 0;
    let width = 0;
    let boxH = height;
    let dpr = 1;
    let mono = "monospace";
    let reveal = 1;
    let tx = 0, ty = 0, cx = 0, cy = 0;   // pointer parallax: target, current
    let px = -1, py = -1;                 // pointer in canvas px, -1 = away
    let hoverA = 0;                       // readout opacity, eased
    const hover =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const parallax = !!chart && hover && !isStatic && !reduced;

    const yawAt = (ms: number) =>
      ((yawCenter + yawRange * Math.sin((ms / HALF_CYCLE_MS) * Math.PI)) * Math.PI) / 180;
    const bobAt = (ms: number) => Math.sin((ms / BOB_MS) * Math.PI * 2) * BOB_PX;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      boxH = height > 0 ? height : canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(boxH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const face = getComputedStyle(canvas).getPropertyValue("--font-mono-face").trim();
      mono = face ? `${face}, ui-monospace, monospace` : "ui-monospace, monospace";
    };

    /* ---- the camera ------------------------------------------------------
       Rotate the point about the vertical axis, tip the whole scene forward by
       `tilt`, then divide by depth. `f` is the perspective term: nearer points
       (smaller z) spread further from the centre, which is the entire reason
       this reads as a landscape rather than as a chart with slanted lines. */
    const tiltRad = (tilt * Math.PI) / 180;
    const ct = Math.cos(tiltRad);
    const st = Math.sin(tiltRad);

    const camera = (x: number, y: number, z: number, theta: number) => {
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      const rx = x * c - z * s;
      const rz = x * s + z * c;
      const ry = y * ct - rz * st;
      const dz = y * st + rz * ct;
      const f = CAMERA_DISTANCE / (CAMERA_DISTANCE + dz);
      return { ux: rx * f, uy: ry * f, depth: dz };
    };

    const zOf = (i: number) => ((i / (rows.length - 1)) * 2 - 1) * depth;

    /* The chart floor sits a little under the lowest yield in the window. */
    let floorY = Infinity;
    for (const r of rows) for (const y of r.ys) if (y < floorY) floorY = y;
    floorY -= 0.09;

    /* ONE scale for the whole rock, not one per frame. The extent is measured
       once across the whole yaw range and the worst angle sets the scale for
       every angle; the surface never breathes as it turns. With the chart on,
       the floor and the label margins are part of the measured extent. */
    let scale = 1;
    let originX = 0;
    const measure = () => {
      let maxX = 0;
      let maxY = 0;
      const ys = chart ? [floorY] : [];
      const extra = parallax ? (PARALLAX_DEG * Math.PI) / 180 : 0;
      for (let a = 0; a <= 48; a++) {
        const base = yawAt((a / 48) * HALF_CYCLE_MS);
        for (const theta of extra ? [base - extra, base + extra] : [base]) {
        for (let i = 0; i < rows.length; i++) {
          const z = zOf(i);
          for (let k = 0; k < rows[i].xs.length; k++) {
            const p = camera(rows[i].xs[k], rows[i].ys[k], z, theta);
            if (Math.abs(p.ux) > maxX) maxX = Math.abs(p.ux);
            if (Math.abs(p.uy) > maxY) maxY = Math.abs(p.uy);
            for (const fy of ys) {
              const q = camera(rows[i].xs[k], fy, z, theta);
              if (Math.abs(q.uy) > maxY) maxY = Math.abs(q.uy);
            }
          }
        }
        }
      }
      const padX = chart ? 44 : 8;
      const padY = chart ? 30 : 6;
      /* On a phone the chart is width-bound and would be a postage stamp;
         let it run 22% past the edges there — the floor's corners bleed, the
         axis and the marker stay inside. */
      const fitW = chart && width < 600 ? width * 1.22 : width;
      scale = Math.min(
        (fitW / 2 - padX) / (maxX || 1),
        (boxH / 2 - padY) / (maxY || 1)
      );
      const half = maxX * scale + padX;
      /* The phone overscan above pushes the near-left axis labels off the
         edge; the whole object shifts right by their width to bring them
         back. The far right corner bleeds instead, which has no label. */
      const nudge = chart && width < 600 ? 30 : 0;
      originX =
        fit === "band"
          ? Math.min(width - half, Math.max(half, width * 0.62))
          : width / 2 + nudge;
    };

    let bob = 0;
    const project = (x: number, y: number, z: number, theta: number) => {
      const p = camera(x, y, z, theta);
      return {
        sx: originX + p.ux * scale,
        sy: boxH / 2 - p.uy * scale + bob,
        depth: p.depth,
      };
    };

    /* Depth decides alpha, so the far edge of the surface recedes instead of
       tangling with the near edge. */
    const near = -1.15;
    const far = 1.15;
    const fade = (d: number) => {
      const t = Math.min(1, Math.max(0, (d - far) / (near - far)));
      return opacity * (0.6 + 0.4 * t);
    };

    const label = (text: string, x: number, y: number, align: CanvasTextAlign,
                   alpha: number, size = 11, colour = INK) => {
      ctx.font = `500 ${size}px ${mono}`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(${colour}, ${alpha})`;
      ctx.fillText(text, x, y);
    };
    /* Axis labels are queued during the floor pass and drawn last, over the
       mesh, so no line runs through a numeral. */
    type Queued = { text: string; x: number; y: number; align: CanvasTextAlign };
    let queued: Queued[] = [];
    const queue = (text: string, x: number, y: number, align: CanvasTextAlign) =>
      queued.push({ text, x, y, align });
    const flush = () => {
      for (const q of queued) label(q.text, q.x, q.y, q.align, .66);
      queued = [];
    };

    const drawChartFloor = (theta: number) => {
      if (!chart) return;
      const tenors = rows[0].xs.length;
      const n = rows.length;
      ctx.lineWidth = 1;
      /* Floor grid: a line along time at every tenor, and across tenor every
         fifteen days. Ink at 8% — it is a floor, not a fence. */
      ctx.strokeStyle = `rgba(${INK}, .09)`;
      for (let k = 0; k < tenors; k++) {
        const x = rows[0].xs[k];
        const a = project(x, floorY, zOf(0), theta);
        const b = project(x, floorY, zOf(n - 1), theta);
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      }
      for (let i = 0; i < n; i += 15) {
        const a = project(rows[0].xs[0], floorY, zOf(i), theta);
        const b = project(rows[0].xs[tenors - 1], floorY, zOf(i), theta);
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      }
      /* Floor edge, a touch firmer, and the back-left yield axis. */
      ctx.strokeStyle = `rgba(${INK}, .22)`;
      const c0 = project(rows[0].xs[0], floorY, zOf(n - 1), theta);
      const c1 = project(rows[0].xs[tenors - 1], floorY, zOf(n - 1), theta);
      const c2 = project(rows[0].xs[0], floorY, zOf(0), theta);
      ctx.beginPath(); ctx.moveTo(c0.sx, c0.sy); ctx.lineTo(c1.sx, c1.sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(c0.sx, c0.sy); ctx.lineTo(c2.sx, c2.sy); ctx.stroke();
      /* The yield axis stands on whichever floor corner is nearest the
         viewer at this yaw (the one that projects lowest on screen): a far
         corner already sits near the top of the box under the tilt, so an
         axis there runs out of the frame and its upper ticks never print. */
      const x0 = rows[0].xs[0];
      const xN = rows[0].xs[tenors - 1];
      const nearX = project(x0, floorY, 0, theta).sy >= project(xN, floorY, 0, theta).sy ? x0 : xN;
      /* Of the two ends of the near edge, the axis takes the LEFT one, the
         way a chart's y-axis reads. */
      const nearZ = project(nearX, floorY, zOf(0), theta).sx <= project(nearX, floorY, zOf(n - 1), theta).sx ? zOf(0) : zOf(n - 1);
      const top = chart.ticks[chart.ticks.length - 1].y + 0.04;
      const ax0 = project(nearX, floorY, nearZ, theta);
      const ax1 = project(nearX, top, nearZ, theta);
      ctx.beginPath(); ctx.moveTo(ax0.sx, ax0.sy); ctx.lineTo(ax1.sx, ax1.sy); ctx.stroke();
      for (const t of chart.ticks) {
        const p = project(nearX, t.y, nearZ, theta);
        ctx.beginPath(); ctx.moveTo(p.sx - 5, p.sy); ctx.lineTo(p.sx, p.sy); ctx.stroke();
        queue(t.label, p.sx - 9, p.sy, "right");
      }
      /* Tenor labels along the front edge, every other one where they crowd. */
      const every = width < 600 ? 3 : 2;
      for (let k = 0; k < tenors; k++) {
        if (tenors > 9 && k % every !== 0 && k !== tenors - 1) continue;
        /* The near corner belongs to the date label on wide frames. */
        if (k === 0 && width >= 600) continue;
        const p = project(rows[0].xs[k], floorY, zOf(n - 1), theta);
        queue(chart.tenorLabels[k], p.sx, p.sy + 14, "center");
      }
      /* The window's first date at the far-right corner. Today's is in the
         attribution, and at the near corner it fought the 30Y label. */
      /* The window's dates sit under the two ends of the NEAR edge, so with
         time running across the frame they read as a stock chart's x-axis. */
      if (width >= 600) {
        const d0 = project(nearX, floorY, zOf(0), theta);
        const d1 = project(nearX, floorY, zOf(n - 1), theta);
        queue(chart.firstDate, d0.sx, d0.sy + 16, "center");
        queue(chart.lastDate, d1.sx, d1.sy + 16, "center");
      }
    };

    const drawSeries = (theta: number) => {
      if (!chart) return;
      const k = chart.seriesIndex;
      const n = Math.max(2, Math.round(rows.length * reveal));
      /* The area ribbon: the ten-year line with its drop to the floor, filled
         in the accent at low alpha. Painted before the mesh so the mesh's
         lines stay crisp over it. */
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p = project(rows[i].xs[k], rows[i].ys[k], zOf(i), theta);
        if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      for (let i = n - 1; i >= 0; i--) {
        const p = project(rows[i].xs[k], floorY, zOf(i), theta);
        ctx.lineTo(p.sx, p.sy);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${DEEP_IRIS_RGB}, .14)`;
      ctx.fill();
    };

    const drawSeriesLine = (theta: number) => {
      if (!chart) return;
      const k = chart.seriesIndex;
      const n = Math.max(2, Math.round(rows.length * reveal));
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p = project(rows[i].xs[k], rows[i].ys[k], zOf(i), theta);
        if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = DEEP_IRIS;
      ctx.lineWidth = 2.25;
      ctx.stroke();
      if (reveal < 1) return;
      /* The marker on the last value: a paper halo, an accent dot, a label. */
      const last = project(rows[n - 1].xs[k], rows[n - 1].ys[k], zOf(n - 1), theta);
      ctx.beginPath(); ctx.arc(last.sx, last.sy, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PAPER}, .9)`; ctx.fill();
      ctx.beginPath(); ctx.arc(last.sx, last.sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = DEEP_IRIS; ctx.fill();
      /* Leader and value pill, to the upper right of the marker, or the
         upper left when the marker sits near the right edge of the box. */
      const text = `${chart.seriesLabel}  ${chart.seriesLast}`;
      ctx.font = `500 12px ${mono}`;
      const w = ctx.measureText(text).width + 22;
      const flip = last.sx + 18 + w + 8 > width;
      const lx = flip ? last.sx - 18 - w : last.sx + 18;
      const ly = last.sy - 22;
      ctx.strokeStyle = `rgba(${DEEP_IRIS_RGB}, .6)`; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(last.sx + (flip ? -6 : 6), last.sy - 6);
      ctx.lineTo(flip ? lx + w + 4 : lx - 4, ly + 8);
      ctx.stroke();
      const h = 26;
      const r = 13;
      ctx.beginPath();
      ctx.moveTo(lx + r, ly - h / 2);
      ctx.arcTo(lx + w, ly - h / 2, lx + w, ly + h / 2, r);
      ctx.arcTo(lx + w, ly + h / 2, lx, ly + h / 2, r);
      ctx.arcTo(lx, ly + h / 2, lx, ly - h / 2, r);
      ctx.arcTo(lx, ly - h / 2, lx + w, ly - h / 2, r);
      ctx.closePath();
      ctx.fillStyle = DEEP_IRIS; ctx.fill();
      label(text, lx + 11, ly + 0.5, "left", 1, 12, PAPER);
    };

    /* THE READOUT. With the pointer over the chart, the nearest day on the
       highlighted series gets a crosshair down to the floor and a paper pill
       with its date and value, like a terminal's hover. Eased in and out so
       it never pops. Hover devices only (parallax gates the listener). */
    const drawReadout = (theta: number) => {
      if (!chart || !parallax) return;
      const want = px >= 0 && reveal >= 1 ? 1 : 0;
      hoverA += (want - hoverA) * 0.18;
      if (hoverA < 0.02) return;
      const k = chart.seriesIndex;
      const n = rows.length;
      let best = -1, bestD = Infinity;
      const pts: { sx: number; sy: number }[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const p = project(rows[i].xs[k], rows[i].ys[k], zOf(i), theta);
        pts[i] = p;
        if (px >= 0) {
          const d = (p.sx - px) * (p.sx - px) + (p.sy - py) * (p.sy - py) * 0.35;
          if (d < bestD) { bestD = d; best = i; }
        }
      }
      if (best < 0) best = n - 1;
      const p = pts[best];
      const f = project(rows[best].xs[k], floorY, zOf(best), theta);
      ctx.globalAlpha = hoverA;
      ctx.strokeStyle = `rgba(${INK}, .45)`; ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(f.sx, f.sy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(p.sx, p.sy, 7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PAPER}, .95)`; ctx.fill();
      ctx.beginPath(); ctx.arc(p.sx, p.sy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${INK})`; ctx.fill();
      const d = chart.series[best];
      const text = d ? `${d.date}  ${chart.seriesLabel} ${d.value}` : "";
      ctx.font = `500 12px ${mono}`;
      const w = ctx.measureText(text).width + 22;
      const h = 26, r = 13;
      const flip = p.sx + 16 + w + 8 > width;
      const lx = flip ? p.sx - 16 - w : p.sx + 16;
      const ly = p.sy + 24;
      ctx.beginPath();
      ctx.moveTo(lx + r, ly - h / 2);
      ctx.arcTo(lx + w, ly - h / 2, lx + w, ly + h / 2, r);
      ctx.arcTo(lx + w, ly + h / 2, lx, ly + h / 2, r);
      ctx.arcTo(lx, ly + h / 2, lx, ly - h / 2, r);
      ctx.arcTo(lx, ly - h / 2, lx + w, ly - h / 2, r);
      ctx.closePath();
      ctx.fillStyle = `rgba(${PAPER}, .96)`; ctx.fill();
      ctx.strokeStyle = `rgba(${INK}, .28)`; ctx.stroke();
      label(text, lx + 11, ly + 0.5, "left", 1, 12, INK);
      ctx.globalAlpha = 1;
    };

    const draw = (theta: number) => {
      ctx.clearRect(0, 0, width, boxH);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      drawChartFloor(theta);
      drawSeries(theta);

      /* Ribs: one polyline per day, across the tenors. Every third day, not
         every day — ninety 1px lines inside a 300px band is a grey wash, and a
         wireframe you cannot see through is a fill by another name. */
      ctx.lineWidth = 1;
      for (let i = 0; i < rows.length - 1; i += 3) {
        const row = rows[i];
        const z = zOf(i);
        let sum = 0;
        ctx.beginPath();
        for (let k = 0; k < row.xs.length; k++) {
          const p = project(row.xs[k], row.ys[k], z, theta);
          sum += p.depth;
          if (k === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        /* In chart mode the ribs are the quiet layer under the spines. */
        ctx.strokeStyle = `rgba(${INK}, ${(fade(sum / row.xs.length) * (chart ? 0.55 : 1)).toFixed(3)})`;
        ctx.stroke();
      }

      /* Spines: one polyline per tenor, along time. These are what make it a
         surface — the ribs alone read as a stack of separate curves. */
      const tenors = rows[0].xs.length;
      for (let k = 0; k < tenors; k++) {
        if (chart && k === chart.seriesIndex) continue;
        let sum = 0;
        ctx.beginPath();
        for (let i = 0; i < rows.length; i++) {
          const p = project(rows[i].xs[k], rows[i].ys[k], zOf(i), theta);
          sum += p.depth;
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = `rgba(${INK}, ${(fade(sum / rows.length) * 0.8).toFixed(3)})`;
        ctx.stroke();
      }

      /* Today, at full alpha in the one accent. */
      const today = rows[rows.length - 1];
      ctx.beginPath();
      for (let k = 0; k < today.xs.length; k++) {
        const p = project(today.xs[k], today.ys[k], zOf(rows.length - 1), theta);
        if (k === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = DEEP_IRIS;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      drawSeriesLine(theta);
      flush();
      drawReadout(theta);
    };

    const frame = (t: number) => {
      if (!start) start = t;
      const ms = t - start;
      const u = Math.min(1, ms / REVEAL_MS);
      reveal = 1 - (1 - u) * (1 - u) * (1 - u);   // cubic falloff of the draw-in
      cx += (tx - cx) * PARALLAX_EASE;
      cy += (ty - cy) * PARALLAX_EASE;
      bob = bobAt(ms) + cy * PARALLAX_PX;
      draw(yawAt(ms) + (cx * PARALLAX_DEG * Math.PI) / 180);
      raf = requestAnimationFrame(frame);
    };
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      const r = canvas.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      px = inside ? e.clientX - r.left : -1;
      py = inside ? e.clientY - r.top : -1;
    };
    if (parallax) window.addEventListener("pointermove", onPointer, { passive: true });

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const run = () => {
      stop();
      resize();
      measure();
      if (!animate) {
        bob = 0;
        reveal = 1;
        draw(yawAt(0));
        return;
      }
      start = 0;
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (animate) run();
    };

    let longTasks = 0;
    let observer: PerformanceObserver | null = null;
    if (phone && animate && typeof PerformanceObserver === "function") {
      try {
        observer = new PerformanceObserver((list) => {
          longTasks += list.getEntries().length;
          if (longTasks >= 3) {
            animate = false;
            observer?.disconnect();
            run();
          }
        });
        observer.observe({ entryTypes: ["longtask"] });
      } catch {
        observer = null;
      }
    }

    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => run()) : null;
    ro?.observe(canvas);
    const onResize = () => { if (!ro) run(); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      stop();
      ro?.disconnect();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [rows, height, tilt, depth, yawCenter, yawRange, fit, opacity, isStatic, chart]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: height > 0 ? `${height}px` : "100%" }}
    />
  );
}
