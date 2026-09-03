import { css } from "@/lib/css";
import YieldSurfaceCanvas, { type SurfaceRow } from "./YieldSurfaceCanvas";
import YieldLandscapeCanvas from "./YieldLandscapeCanvas";
import {
  fetchYieldHistory, asOf, TREASURY_SOURCE, TREASURY_ATTRIBUTION,
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
 * TWO MATERIALS, ONE SURFACE. `mode="wire"` is the original drawing: ink
 * polylines at low alpha, a mesh you see through, fitted inside a slot.
 * `mode="painted"` (hero r9) is the same rows rendered as filled, lit, depth-
 * fogged strips — a landscape that fills its box and the page stands on. Same
 * fetch, same projection, same rock; the difference is entirely in the canvas
 * component that receives the numbers. See YieldLandscapeCanvas.tsx.
 *
 * SERVER-FETCHED, ISR 6h, PASSED AS PROPS. The island never talks to Treasury.
 * If the fetch fails this renders nothing — no placeholder mesh, no last-known
 * surface. The same rule every data component here follows, and it matters more
 * on this one: an invented landscape is a much bigger lie than an invented line.
 *
 * MOTION. The surface ROCKS rather than revolves: the yaw is a sine through
 * yawCenter ± yawRange, forty seconds from one extreme to the other. A full
 * revolution spent a quarter of its cycle edge-on, which is the one angle at
 * which a landscape reads as a chart, and another quarter showing the back of
 * the surface with today's curve hidden behind ninety days of history. The
 * rock never reaches either: the surface is always oblique and today is always
 * at the front. This is continuous ambient motion, here because the owner
 * asked for it directly; it is gated under prefers-reduced-motion, it stops
 * when the tab is hidden, and it stops on a phone whose main thread is
 * measurably blocking.
 */

export type YieldSurfaceProps = {
  /** CSS height of the canvas (wire mode only; painted fills its box). Default 520. */
  height?: number;
  /** Camera tilt above the horizon, in degrees. Defaults per `fit`. */
  tilt?: number;
  /** Middle of the rock, in degrees of yaw. Default 45 (wire), 14 (painted). */
  yawCenter?: number;
  /** Half-width of the rock: the yaw runs yawCenter ± yawRange. Default 30 (wire), 9 (painted). */
  yawRange?: number;
  /**
   * "band" is the wire hero: a shallow slab shaped to fill a wide short slot,
   * anchored into the right two-thirds. "natural" is the deeper landscape,
   * centred, for a slot nearer square. "landscape" is the painted shape.
   */
  fit?: "band" | "natural" | "landscape";
  /** Alpha ceiling for the history strokes (wire only). Default 0.45. */
  opacity?: number;
  /** "wire" strokes a mesh; "painted" fills a landscape. Default "wire". */
  mode?: "wire" | "painted";
  /** Painted only: fallback horizon as a fraction of the box height when
   *  --ys-horizon is not set in CSS. Default 0.44. */
  horizon?: number;
  /** Force the single static frame — no rAF, no observer. */
  static?: boolean;
  className?: string;
};

/* The shapes, and why they differ.
 *
 * A rock through 45°±30° sweeps an envelope whose width barely changes (about
 * 9%) while its height changes by half. Width is therefore free and height is
 * what the slot has to pay for, so the only way to fill a wide short band is to
 * flatten the model: less tilt, a shallower time axis, a smaller yield
 * amplitude. "band" and "natural" are the wire shapes, measured in r6–r8.
 *
 * "landscape" is the painted shape: a little more tilt and a longer time axis
 * so the ninety strips stack into visible hills rather than a ribbon, and an
 * amplitude that puts a real skyline on the range. None of these numbers are
 * claims about the data: the surface prints no y axis and no z axis, so its
 * proportions are composition, exactly like the yield curve's aspect. What
 * would be dishonest is a non-uniform scale, and there isn't one. */
const SHAPE = {
  band:      { tilt: 16, depth: 0.95, amplitude: 0.52 },
  natural:   { tilt: 22, depth: 1.0,  amplitude: 0.62 },
  landscape: { tilt: 21, depth: 1.15, amplitude: 0.78 },
} as const;

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
  const yc = yawCenter ?? (painted ? 14 : 45);
  const yr = yawRange ?? (painted ? 9 : 30);

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

  const rows: SurfaceRow[] = history
    /* Every row has to carry the same tenors in the same order or the spines
       would join a 2-year on one day to a 3-year on the next. A short row is
       dropped rather than interpolated: a hole in this feed is a day Treasury
       did not publish that tenor, and inventing it is inventing data. */
    .filter((row) => row.points.length === tenors.length)
    .map((row) => ({
      date: row.date,
      xs: row.points.map((p) => ((Math.log(p.years) - lo) / (hi - lo)) * 2 - 1),
      ys: row.points.map((p) => ((p.rate - min) / span - 0.5) * shape.amplitude),
    }));

  if (rows.length < 2) return null;

  const asOfDate = rows[rows.length - 1].date;

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
