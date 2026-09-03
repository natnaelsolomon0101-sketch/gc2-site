import { css } from "@/lib/css";
import YieldSurfaceCanvas, { type SurfaceRow } from "./YieldSurfaceCanvas";
import {
  fetchYieldHistory, asOf, TREASURY_SOURCE, TREASURY_ATTRIBUTION,
} from "./treasury";

/**
 * The term-structure landscape: the last ninety published U.S. Treasury par
 * yield curves, as one wireframe surface, turning slowly.
 *
 * x is tenor on the SAME log mapping <YieldCurve/> uses — a linear tenor axis
 * puts eight of thirteen points inside the first sixth and the front end, which
 * is the part that moves, disappears. z is the trading day. y is the yield.
 * What that makes visible is the thing a single curve cannot say: not the shape
 * today, but how the shape has been moving — the front end lifting, the belly
 * rolling, the long end standing still.
 *
 * SERVER-FETCHED, ISR 6h, PASSED AS PROPS. The island never talks to Treasury.
 * If the fetch fails this renders nothing — no placeholder mesh, no last-known
 * surface. The same rule every data component here follows, and it matters more
 * on this one: an invented landscape is a much bigger lie than an invented line.
 *
 * MOTION. One revolution takes ninety seconds. This is continuous ambient
 * motion, which is NOT what the --dur-* tokens are for — they time transitions
 * and one-shot reveals, and EVERY-SCREEN.md §8.2's list of what moves does not
 * include this. It is here because the owner asked for it directly, and it is
 * logged as the deviation it is. It is gated entirely under
 * prefers-reduced-motion, it stops when the tab is hidden, and it stops on a
 * phone whose main thread is measurably blocking.
 *
 * COLOUR. Ink at 20-35% for the ninety days of history, depth-faded so the far
 * edge recedes; today's curve in deep-iris at full alpha. That accent is the
 * section's whole ration (DESIGN.md principle 2) and it is spent on the one
 * line that is a statement about now. No fills, no gradients, no shadows — the
 * surface sits on transparent and the hero owns the ground.
 */

export type YieldSurfaceProps = {
  /** CSS height of the canvas. Default 380. */
  height?: number;
  /** Camera tilt above the horizon, in degrees. Default 22. */
  tilt?: number;
  /** Alpha ceiling for the history strokes. Default 0.35, the top of the range. */
  opacity?: number;
  /** Force the single static frame — no rAF, no observer. */
  static?: boolean;
  className?: string;
};

export default async function YieldSurface({
  height = 380,
  tilt = 22,
  opacity = 0.35,
  static: isStatic = false,
  className = "",
}: YieldSurfaceProps) {
  const history = await fetchYieldHistory(90);
  if (!history || history.length < 2) return null;

  /* Project into model space HERE, on the server, so the island receives
     numbers and not a parsing problem: x in [-1, 1] across log tenor, y in
     [-0.5, 0.5] across the ninety-day range of yields. The vertical scale is
     deliberately shallow — a surface scaled to fill its box vertically reads as
     a mountain range and claims a drama the data does not have. */
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
      ys: row.points.map((p) => ((p.rate - min) / span - 0.5) * 0.62),
    }));

  if (rows.length < 2) return null;

  const asOfDate = rows[rows.length - 1].date;

  return (
    <figure
      className={`ys ${className}`}
      data-source={TREASURY_SOURCE}
      data-asof={asOfDate}
    >
      <style>{CSS}</style>
      <YieldSurfaceCanvas
        rows={rows}
        height={height}
        tilt={tilt}
        opacity={opacity}
        isStatic={isStatic}
      />
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
`;
