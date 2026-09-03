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
 */

/** One day's curve in model space: x across tenor, y up in yield. */
export type SurfaceRow = { date: string; xs: number[]; ys: number[] };

export type YieldSurfaceCanvasProps = {
  rows: SurfaceRow[];
  /** CSS height of the canvas. */
  height: number;
  /** Camera tilt above the horizon, in degrees. */
  tilt: number;
  /** Alpha ceiling for the history strokes; the near edge gets this, the far
   *  edge gets 60% of it. */
  opacity: number;
  /** Draw one frame and stop. */
  isStatic: boolean;
};

const INK = "20, 19, 17";           // --color-ink, as channels for rgba()
const DEEP_IRIS = "#4b49aa";        // the one accent, spent on today's curve
const REVOLUTION_MS = 90_000;       // one turn; the owner asked for "very slow"
const CAMERA_DISTANCE = 3.2;        // in model units, from the origin

export default function YieldSurfaceCanvas({
  rows, height, tilt, opacity, isStatic,
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
    let angle = 0;
    let width = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ---- the camera ------------------------------------------------------
       Rotate the point about the vertical axis, tip the whole scene forward by
       `tilt`, then divide by depth. `f` is the perspective term: nearer points
       (smaller z) spread further from the centre, which is the entire reason
       this reads as a landscape rather than as a chart with slanted lines. */
    const tiltRad = (tilt * Math.PI) / 180;
    const ct = Math.cos(tiltRad);
    const st = Math.sin(tiltRad);

    /* Unscaled: the camera in model units, before the fit below decides how
       many pixels a model unit is worth. */
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

    const zOf = (i: number) => (i / (rows.length - 1)) * 2 - 1;

    /* ONE scale for the whole revolution, not one per frame.
     *
     * The surface is widest when it is broadside to the camera and narrowest
     * when it is edge-on, so a scale fitted to the current angle would make the
     * whole thing breathe in and out as it turned — which reads as a zoom, and
     * a zoom on a data component reads as emphasis. Instead the extent is
     * measured across a full turn once, and the scale that fits the worst angle
     * is used at every angle. The first version fitted nothing at all and the
     * surface ran off both edges of the canvas.
     *
     * 48 samples over the revolution: the extremes are broad, not spiky, so
     * this lands within a fraction of a percent of the true maximum at a cost
     * of one pass at setup. */
    let scale = 1;
    const fit = () => {
      let maxX = 0;
      let maxY = 0;
      for (let a = 0; a < 48; a++) {
        const theta = (a / 48) * Math.PI * 2;
        for (let i = 0; i < rows.length; i++) {
          const z = zOf(i);
          for (let k = 0; k < rows[i].xs.length; k++) {
            const p = camera(rows[i].xs[k], rows[i].ys[k], z, theta);
            if (Math.abs(p.ux) > maxX) maxX = Math.abs(p.ux);
            if (Math.abs(p.uy) > maxY) maxY = Math.abs(p.uy);
          }
        }
      }
      const padX = 8;
      const padY = 6;
      scale = Math.min(
        (width / 2 - padX) / (maxX || 1),
        (height / 2 - padY) / (maxY || 1)
      );
    };

    const project = (x: number, y: number, z: number, theta: number) => {
      const p = camera(x, y, z, theta);
      return {
        sx: width / 2 + p.ux * scale,
        sy: height / 2 - p.uy * scale,
        depth: p.depth,
      };
    };

    /* Depth decides alpha, so the far edge of the surface recedes instead of
       tangling with the near edge. This is the only thing standing in for the
       fills and shadows the system does not allow. */
    const near = -1.15;
    const far = 1.15;
    const fade = (depth: number) => {
      const t = Math.min(1, Math.max(0, (depth - far) / (near - far)));
      return opacity * (0.6 + 0.4 * t);
    };

    const draw = (theta: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      /* Ribs: one polyline per day, across the tenors. Every third day, not
         every day — ninety 1px lines inside a 300px band is a grey wash, and a
         wireframe you cannot see through is a fill by another name. The data
         extent is still ninety days; the drawn mesh is thirty ribs of it. */
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

      /* Today, at full alpha in the one accent. It is the only line on the
         surface that is a statement about now rather than about the shape of
         the last quarter, so it is the only one that gets the colour. */
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
    };

    const frame = (t: number) => {
      if (!start) start = t;
      angle = (((t - start) % REVOLUTION_MS) / REVOLUTION_MS) * Math.PI * 2;
      draw(angle);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const run = () => {
      stop();
      resize();
      fit();
      if (!animate) {
        /* The static frame is not angle zero. Zero is the surface edge-on, which
           is the one angle at which a landscape looks like a chart. */
        draw(Math.PI * 0.22);
        return;
      }
      start = 0;
      raf = requestAnimationFrame(frame);
    };

    /* A hidden tab still runs rAF in some browsers and, more to the point, a
       backgrounded animation is work nobody is looking at. */
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (animate) run();
    };

    /* The phone rule, measured rather than assumed. If long tasks pile up while
       the surface is turning, the surface is what stops — it is ambient, and a
       janky scroll costs more than a still frame. Chromium-only API; where it
       does not exist the animation simply stays on, which is the same behaviour
       phones had before this observer. */
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

    const onResize = () => run();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [rows, height, tilt, opacity, isStatic]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: `${height}px` }}
    />
  );
}
