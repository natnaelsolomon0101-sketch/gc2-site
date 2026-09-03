import { css } from "@/lib/css";
import YieldSurfaceCanvas, { type SurfaceRow, type ChartSpec } from "./YieldSurfaceCanvas";
import YieldLandscapeCanvas from "./YieldLandscapeCanvas";
import {
  fetchYieldHistory, asOf, TENORS, TREASURY_SOURCE, TREASURY_ATTRIBUTION,
} from "./treasury";

/**
 * The term-structure landscape: the last ninety published U.S. Treasury par
 * yield curves, as one surface, turning slowly.
 *
 * x is tenor on the SAME log mapping <YieldCurve/> uses — a linear tenor axis
 * puts eight of thirteen points inside the first sixth and the front end, which
 * is the part that moves, disappears. z is the trading day. y is the yield.
 * What that makes visible is the thing a single curve cannot say: not the shape
 * today, but how the shape has been moving — the front end lifting, the belly
 * rolling, the long end standing still.
 *
 * THREE MATERIALS, ONE SURFACE. `mode="wire"` is the drawing: ink polylines at
 * low alpha, a mesh you see through. `mode="chart"` is the wire drawn as the
 * instrument it is — floor grid, tenor and date axes, yield ticks, the
 * ten-year as a bold line with an area ribbon and a marker on its last value.
 * `mode="painted"` is the same rows as filled, lit, depth-fogged hills. Same
 * fetch, same projection, same rock; the difference is entirely in what the
 * canvas does with the numbers.
 *
 * SERVER-FETCHED, ISR 6h, PASSED AS PROPS. The island never talks to Treasury.
 * If the fetch fails this renders nothing — no placeholder mesh, no last-known
 * surface. The same rule every data component here follows, and it matters more
 * on this one: an invented landscape is a much bigger lie than an invented line.
 *
 * MOTION. The surface ROCKS rather than revolves: the yaw is a sine through
 * yawCenter ± yawRange, forty seconds from one extreme to the other, and in
 * chart and wire modes it bobs on a second slow sine so it floats. This is
 * continuous ambient motion, here because the owner asked for it directly;
 * it is gated under prefers-reduced-motion, it stops when the tab is hidden,
 * and it stops on a phone whose main thread is measurably blocking.
 */

export type YieldSurfaceProps = {
  /** CSS height of the canvas. 0 fills the parent box. Default 520. */
  height?: number;
  /** Camera tilt above the horizon, in degrees. Defaults per `fit`. */
  tilt?: number;
  /** Middle of the rock, in degrees of yaw. */
  yawCenter?: number;
  /** Half-width of the rock: the yaw runs yawCenter ± yawRange. */
  yawRange?: number;
  /**
   * "band" is a shallow slab shaped to fill a wide short slot, anchored into
   * the right two-thirds. "natural" is the deeper landscape, centred, for a
   * slot nearer square. "landscape" is the painted shape.
   */
  fit?: "band" | "natural" | "landscape";
  /** Alpha ceiling for the history strokes (wire/chart). Default 0.45. */
  opacity?: number;
  /** "wire" strokes a mesh; "chart" strokes it with its instrument furniture;
   *  "painted" fills a landscape. Default "wire". */
  mode?: "wire" | "chart" | "painted";
  /** Painted only: fallback horizon as a fraction of the box height when
   *  --ys-horizon is not set in CSS. Default 0.44. */
  horizon?: number;
  /** Force the single static frame — no rAF, no observer. */
  static?: boolean;
  className?: string;
};

const SHAPE = {
  band:      { tilt: 16, depth: 0.95, span: 1,   amplitude: 0.52 },
  natural:   { tilt: 22, depth: 1.0,  span: 1,   amplitude: 0.62 },
  /* The painted shape is wide: time runs across the frame at 2.3 half-units
     against a 0.9 tenor depth, which is what a 3:1 first screen needs. */
  landscape: { tilt: 19, depth: 0.9,  span: 2.3, amplitude: 0.72 },
} as const;

const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .toUpperCase();

export default async function YieldSurface({
  height = 520,
  tilt,
  yawCenter,
  yawRange,
  fit,
  opacity = 0.45,
  mode = "wire",
  horizon = 0.44,
  static: isStatic = false,
  className = "",
}: YieldSurfaceProps) {
  const painted = mode === "painted";
  const shapeKey = fit ?? (painted ? "landscape" : "band");
  const shape = SHAPE[shapeKey];
  const yc = yawCenter ?? (painted ? 0 : 45);
  const yr = yawRange ?? (painted ? 8 : 30);

  const history = await fetchYieldHistory(90);
  if (!history || history.length < 2) return null;

  /* Project into model space HERE, on the server, so the island receives
     numbers and not a parsing problem: x in [-1, 1] across log tenor, y in
     [-0.5, 0.5] across the ninety-day range of yields, scaled by the shape's
     amplitude. */
  const tenors = history[history.length - 1].points.map((p) => p.years);
  const lo = Math.log(tenors[0]);
  const hi = Math.log(tenors[tenors.length - 1]);

  let min = Infinity;
  let max = -Infinity;
  for (const row of history) {
    for (const p of row.points) {
      if (p.rate < min) min = p.rate;
      if (p.rate > max) max = p.rate;
    }
  }
  const span = max - min || 1;
  const yOf = (rate: number) => ((rate - min) / span - 0.5) * shape.amplitude;

  const rows: SurfaceRow[] = history
    /* Every row has to carry the same tenors in the same order or the spines
       would join a 2-year on one day to a 3-year on the next. A short row is
       dropped rather than interpolated: a hole in this feed is a day Treasury
       did not publish that tenor, and inventing it is inventing data. */
    .filter((row) => row.points.length === tenors.length)
    .map((row) => ({
      date: row.date,
      xs: row.points.map((p) => ((Math.log(p.years) - lo) / (hi - lo)) * 2 - 1),
      ys: row.points.map((p) => yOf(p.rate)),
    }));

  if (rows.length < 2) return null;

  const asOfDate = rows[rows.length - 1].date;

  /* The chart furniture, every value from the feed. The highlighted series is
     the ten-year, or the longest tenor present if the feed ever lacks it. */
  let chart: ChartSpec | undefined;
  if (mode === "chart") {
    const labelFor = (years: number) =>
      TENORS.find((t) => Math.abs(t.years - years) < 1e-6)?.label ??
      (years < 1 ? `${Math.round(years * 12)}M` : `${years}Y`);
    let seriesIndex = tenors.findIndex((y) => y === 10);
    if (seriesIndex < 0) seriesIndex = tenors.length - 1;
    const lastRow = history[history.length - 1];
    const lastRate = lastRow.points[seriesIndex].rate;
    const mid = (min + max) / 2;
    chart = {
      tenorLabels: tenors.map(labelFor),
      seriesIndex,
      seriesLabel: labelFor(tenors[seriesIndex]),
      seriesLast: `${lastRate.toFixed(2)}%`,
      ticks: [min, mid, max].map((r) => ({ label: `${r.toFixed(1)}%`, y: yOf(r) })),
      firstDate: shortDate(rows[0].date),
      lastDate: shortDate(asOfDate),
    };
  }

  return (
    <figure
      className={`ys ${painted ? "ys-painted " : ""}${className}`}
      data-source={TREASURY_SOURCE}
      data-asof={asOfDate}
    >
      <style>{CSS}</style>
      {painted ? (
        <YieldLandscapeCanvas
          rows={rows}
          tilt={tilt ?? shape.tilt}
          depth={shape.depth}
          span={shape.span}
          yawCenter={yc}
          yawRange={yr}
          horizon={horizon}
          isStatic={isStatic}
        />
      ) : (
        <YieldSurfaceCanvas
          rows={rows}
          height={height}
          tilt={tilt ?? shape.tilt}
          depth={shape.depth}
          yawCenter={yc}
          yawRange={yr}
          fit={shapeKey === "natural" ? "natural" : "band"}
          opacity={opacity}
          isStatic={isStatic}
          chart={chart}
        />
      )}
      <figcaption className="t-caption ys-source">
        {TREASURY_ATTRIBUTION} par yield curves, last {rows.length} days · as of{" "}
        {asOf(asOfDate)} · Public market data. Not fund performance.
      </figcaption>
    </figure>
  );
}

const CSS = css`
  .ys { margin: 0; }
  .ys-source { display: block; margin-top: 14px; hyphens: none; }
  /* Painted fills whatever box the caller positions it in; it sets no
     position of its own so the caller's absolute/inset wins. */
  .ys-painted canvas { position: absolute; inset: 0; }
`;
