"use client";

import { useEffect, useRef } from "react";
import type { SurfaceRow } from "./YieldSurfaceCanvas";

/**
 * The PAINTED half of <YieldSurface mode="painted"/>: the same ninety Treasury
 * curves the wireframe draws, rendered as a landscape instead of a mesh.
 *
 * WHAT CHANGED FROM THE WIREFRAME. Nothing about the data, the camera or the
 * rock. What changed is the material: each day is a filled strip between its
 * curve and the next day's, painted back to front, so the surface is a range of
 * layered hills receding into haze rather than a drawing of one. Depth sets the
 * colour — near strips in deep iris, far strips dissolving into the paper sky
 * — and the slope between one day and the next sets the light, lit from the
 * upper left like every other object on the page. The result reads as a place,
 * which is what a first screen needs and a mesh at 45% alpha never was.
 *
 * IT FILLS ITS BOX. The wireframe was fitted inside a slot; this is the ground
 * the hero stands on. It overscans the width so the range runs off both edges
 * (a landscape with visible corners is a picture frame, not a horizon), sets
 * its horizon at --ys-horizon of the box's height (a CSS custom property, so
 * the composition can move it per breakpoint without a prop), and runs to the
 * bottom edge through an apron in the near tone. The scale is uniform: the
 * vertical extent is whatever the tilt makes it. There is no non-uniform axis.
 *
 * TENOR INTERPOLATION. Thirteen tenors is a faceted hill. Each curve is
 * resampled to SAMPLES points with a monotone cubic (Fritsch–Carlson), which
 * never overshoots the published points: every drawn value lies between its
 * two neighbours, the same tolerance the wireframe's straight segments already
 * claimed. Nothing is invented between days — the time axis stays at one strip
 * per published curve.
 *
 * MOTION is the wireframe's rock, unchanged: yawCenter ± yawRange on a sine,
 * forty seconds per half-cycle, off under reduced motion, off in a hidden tab,
 * off on a phone whose main thread is blocking.
 */

export type YieldLandscapeCanvasProps = {
  rows: SurfaceRow[];
  tilt: number;
  depth: number;
  yawCenter: number;
  yawRange: number;
  /** Fallback horizon (0..1 of box height) when --ys-horizon is unset. */
  horizon: number;
  isStatic: boolean;
};

const SAMPLES = 56;
const HALF_CYCLE_MS = 40_000;
const CAMERA_DISTANCE = 3.2;
const OVERSCAN = 1.34;

/* The palette, as depth stops from far (0) to near (1). Paper-sky haze at the
   horizon through the iris ramp to deep iris at the front — the site's one
   accent family, spent on the picture. The apron below the last strip goes one
   step past the near stop. */
const STOPS: [number, [number, number, number]][] = [
  [0.0, [229, 225, 241]],
  [0.22, [206, 199, 238]],
  [0.5, [160, 152, 222]],
  [0.78, [108, 104, 196]],
  [1.0, [75, 73, 170]],
];
const APRON: [number, number, number] = [58, 56, 132];
const PAPER = "247, 245, 240";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const colourAt = (t: number, light: number) => {
  let i = 1;
  while (i < STOPS.length - 1 && STOPS[i][0] < t) i++;
  const [t0, c0] = STOPS[i - 1];
  const [t1, c1] = STOPS[i];
  const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  const r = lerp(c0[0], c1[0], u) + light;
  const g = lerp(c0[1], c1[1], u) + light;
  const b = lerp(c0[2], c1[2], u) + light * 0.6;
  return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
};

/* Monotone cubic resample of (xs, ys) onto SAMPLES uniform x in [xs[0], xs[n-1]]. */
function resample(xs: number[], ys: number[]): { xs: number[]; ys: number[] } {
  const n = xs.length;
  const d: number[] = new Array(n - 1);
  const m: number[] = new Array(n);
  for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  const outX: number[] = new Array(SAMPLES);
  const outY: number[] = new Array(SAMPLES);
  let seg = 0;
  for (let k = 0; k < SAMPLES; k++) {
    const x = lerp(xs[0], xs[n - 1], k / (SAMPLES - 1));
    while (seg < n - 2 && x > xs[seg + 1]) seg++;
    const h = xs[seg + 1] - xs[seg];
    const t = (x - xs[seg]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    outX[k] = x;
    outY[k] = h00 * ys[seg] + h10 * h * m[seg] + h01 * ys[seg + 1] + h11 * h * m[seg + 1];
  }
  return { xs: outX, ys: outY };
}

export default function YieldLandscapeCanvas({
  rows, tilt, depth, yawCenter, yawRange, horizon, isStatic,
}: YieldLandscapeCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || rows.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none) and (max-width: 767px)").matches;

    let animate = !isStatic && !reduced;
    let raf = 0;
    let start = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let horizonY = 0;

    const smooth = rows.map((r) => resample(r.xs, r.ys));

    const yawAt = (ms: number) =>
      ((yawCenter + yawRange * Math.sin((ms / HALF_CYCLE_MS) * Math.PI)) * Math.PI) / 180;

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
      return { ux: rx * f, uy: ry * f };
    };

    const zOf = (i: number) => ((i / (rows.length - 1)) * 2 - 1) * depth;

    let scale = 1;
    let topUY = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const h = parseFloat(getComputedStyle(canvas).getPropertyValue("--ys-horizon"));
      horizonY = height * (Number.isFinite(h) ? h : horizon);
    };

    /* ONE scale for the whole rock, measured across the yaw range so the
       range never breathes as it turns. Uniform, and the larger of two fits:
       the width (overscanned, so the range runs off both edges) or the
       height from the horizon to 92% of the box — a phone is tall and
       narrow, and a width-fitted range there is a ribbon. Anchored so the
       highest far point over the whole rock sits on the horizon line. */
    const measure = () => {
      let maxX = 0;
      let maxY = -Infinity;
      let minY = Infinity;
      for (let a = 0; a <= 32; a++) {
        const theta = yawAt((a / 32) * HALF_CYCLE_MS);
        for (let i = 0; i < smooth.length; i += 3) {
          const z = zOf(i);
          const row = smooth[i];
          for (let k = 0; k < row.xs.length; k += 5) {
            const p = camera(row.xs[k], row.ys[k], z, theta);
            if (Math.abs(p.ux) > maxX) maxX = Math.abs(p.ux);
            if (p.uy > maxY) maxY = p.uy;
            if (p.uy < minY) minY = p.uy;
          }
        }
      }
      const byWidth = ((width * OVERSCAN) / 2) / (maxX || 1);
      const byHeight = (height * 0.92 - horizonY) / ((maxY - minY) || 1);
      scale = Math.max(byWidth, byHeight);
      topUY = maxY;
    };

    const project = (x: number, y: number, z: number, theta: number) => {
      const p = camera(x, y, z, theta);
      return { sx: width / 2 + p.ux * scale, sy: horizonY + (topUY - p.uy) * scale };
    };

    const draw = (theta: number) => {
      ctx.clearRect(0, 0, width, height);
      const n = smooth.length;

      /* Far haze: from above the horizon down to the first strip, on a
         vertical gradient from nothing to the far tone, so the range
         dissolves into the sky instead of starting on a hard edge. */
      const first = smooth[0];
      const haze = ctx.createLinearGradient(0, horizonY - 90, 0, horizonY + 24);
      haze.addColorStop(0, "rgba(229, 225, 241, 0)");
      haze.addColorStop(1, colourAt(0, 0));
      ctx.beginPath();
      ctx.moveTo(-4, horizonY - 90);
      for (let k = 0; k < first.xs.length; k++) {
        const p = project(first.xs[k], first.ys[k], zOf(0), theta);
        ctx.lineTo(p.sx, p.sy);
      }
      ctx.lineTo(width + 4, horizonY - 90);
      ctx.closePath();
      ctx.fillStyle = haze;
      ctx.fill();

      /* The strips, back to front. Each is the polygon between day i's curve
         and day i+1's, coloured by depth and lit by its slope. */
      for (let i = 0; i < n - 1; i++) {
        const a = smooth[i];
        const b = smooth[i + 1];
        const za = zOf(i);
        const zb = zOf(i + 1);
        const t = i / (n - 2);
        let rise = 0;
        ctx.beginPath();
        for (let k = 0; k < a.xs.length; k++) {
          const p = project(a.xs[k], a.ys[k], za, theta);
          if (k === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        for (let k = b.xs.length - 1; k >= 0; k--) {
          const p = project(b.xs[k], b.ys[k], zb, theta);
          ctx.lineTo(p.sx, p.sy);
          rise += b.ys[k] - a.ys[k];
        }
        ctx.closePath();
        /* Light: a strip that rises toward the viewer faces the sky and
           lightens; one that falls away darkens. ±18 on the channels at
           the amplitudes this data reaches. */
        const light = Math.max(-18, Math.min(18, (rise / a.xs.length) * 900));
        ctx.fillStyle = colourAt(t, light);
        ctx.fill();
        /* A paper-light ridge on each strip's near edge, faint far away and
           firmer near — the contour that makes layered hills read as layers. */
        ctx.beginPath();
        for (let k = 0; k < b.xs.length; k++) {
          const p = project(b.xs[k], b.ys[k], zb, theta);
          if (k === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = `rgba(${PAPER}, ${(0.06 + 0.3 * t).toFixed(3)})`;
        ctx.lineWidth = i === n - 2 ? 1.5 : 0.75;
        ctx.stroke();
      }

      /* The apron: from today's curve to the bottom edge, in the tone one
         step past the near stop, so the ground reaches the frame. */
      const last = smooth[n - 1];
      const zl = zOf(n - 1);
      ctx.beginPath();
      const p0 = project(last.xs[0], last.ys[0], zl, theta);
      ctx.moveTo(-4, p0.sy);
      for (let k = 0; k < last.xs.length; k++) {
        const p = project(last.xs[k], last.ys[k], zl, theta);
        ctx.lineTo(p.sx, p.sy);
      }
      const pn = project(last.xs[last.xs.length - 1], last.ys[last.xs.length - 1], zl, theta);
      ctx.lineTo(width + 4, pn.sy);
      ctx.lineTo(width + 4, height + 4);
      ctx.lineTo(-4, height + 4);
      ctx.closePath();
      ctx.fillStyle = `rgb(${APRON.join(", ")})`;
      ctx.fill();
    };

    const frame = (t: number) => {
      if (!start) start = t;
      draw(yawAt(t - start));
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const run = () => {
      stop();
      resize();
      measure();
      if (!animate) { draw(yawAt(0)); return; }
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
          if (longTasks >= 3) { animate = false; observer?.disconnect(); run(); }
        });
        observer.observe({ entryTypes: ["longtask"] });
      } catch { observer = null; }
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
  }, [rows, tilt, depth, yawCenter, yawRange, horizon, isStatic]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
