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
      for (let a = 0; a <= 48; a++) {
        const theta = yawAt((a / 48) * HALF_CYCLE_MS);
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
      const padX = chart ? 44 : 8;
      const padY = chart ? 30 : 6;
      scale = Math.min(
        (width / 2 - padX) / (maxX || 1),
        (boxH / 2 - padY) / (maxY || 1)
      );
      const half = maxX * scale + padX;
      originX =
        fit === "band"
          ? Math.min(width - half, Math.max(half, width * 0.62))
          : width / 2;
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
      const top = chart.ticks[chart.ticks.length - 1].y + 0.04;
      const ax0 = project(rows[0].xs[0], floorY, zOf(0), theta);
      const ax1 = project(rows[0].xs[0], top, zOf(0), theta);
      ctx.beginPath(); ctx.moveTo(ax0.sx, ax0.sy); ctx.lineTo(ax1.sx, ax1.sy); ctx.stroke();
      for (const t of chart.ticks) {
        const p = project(rows[0].xs[0], t.y, zOf(0), theta);
        ctx.beginPath(); ctx.moveTo(p.sx - 5, p.sy); ctx.lineTo(p.sx, p.sy); ctx.stroke();
        label(t.label, p.sx - 9, p.sy, "right", .62);
      }
      /* Tenor labels along the front edge, every other one where they crowd. */
      for (let k = 0; k < tenors; k++) {
        if (tenors > 9 && k % 2 === 1 && k !== tenors - 1) continue;
        const p = project(rows[0].xs[k], floorY, zOf(n - 1), theta);
        label(chart.tenorLabels[k], p.sx, p.sy + 14, "center", .62);
      }
      /* The window's first date at the far-right corner. Today's is in the
         attribution, and at the near corner it fought the 30Y label. */
      const d0 = project(rows[0].xs[tenors - 1], floorY, zOf(0), theta);
      label(chart.firstDate, d0.sx + 10, d0.sy, "left", .62);
    };

    const drawSeries = (theta: number) => {
      if (!chart) return;
      const k = chart.seriesIndex;
      const n = rows.length;
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
      const n = rows.length;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const p = project(rows[i].xs[k], rows[i].ys[k], zOf(i), theta);
        if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = DEEP_IRIS;
      ctx.lineWidth = 2.25;
      ctx.stroke();
      /* The marker on the last value: a paper halo, an accent dot, a label. */
      const last = project(rows[n - 1].xs[k], rows[n - 1].ys[k], zOf(n - 1), theta);
      ctx.beginPath(); ctx.arc(last.sx, last.sy, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PAPER}, .9)`; ctx.fill();
      ctx.beginPath(); ctx.arc(last.sx, last.sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = DEEP_IRIS; ctx.fill();
      /* Leader and value pill, to the upper right of the marker. */
      const lx = last.sx + 18;
      const ly = last.sy - 22;
      ctx.strokeStyle = `rgba(${DEEP_IRIS_RGB}, .6)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(last.sx + 6, last.sy - 6); ctx.lineTo(lx - 4, ly + 8); ctx.stroke();
      const text = `${chart.seriesLabel}  ${chart.seriesLast}`;
      ctx.font = `500 12px ${mono}`;
      const w = ctx.measureText(text).width + 22;
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
        ctx.strokeStyle = `rgba(${INK}, ${fade(sum / row.xs.length).toFixed(3)})`;
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
    };

    const frame = (t: number) => {
      if (!start) start = t;
      bob = bobAt(t - start);
      draw(yawAt(t - start));
      raf = requestAnimationFrame(frame);
    };

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
