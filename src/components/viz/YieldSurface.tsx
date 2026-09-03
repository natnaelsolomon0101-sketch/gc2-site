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
 * MOTION. The surface ROCKS rather than revolves: the yaw is a sine through
 * 45°±30°, forty seconds from one extreme to the other. A full revolution — the
 * first version — spent a quarter of its cycle edge-on, which is the one angle
 * at which a landscape reads as a chart, and another quarter showing the back
 * of the surface with today's curve hidden behind ninety days of history. The
 * rock never reaches either: the surface is always oblique and today is always
 * at the front. The sine is also the ease-in-out for free, slowing into each
 * extreme instead of turning a corner.
 *
 * This is continuous ambient motion, which is NOT what the --dur-* tokens are
 * for — they time transitions and one-shot reveals, and EVERY-SCREEN.md §8.2's
 * list of what moves does not include this. It is here because the owner asked
 * for it directly, and it is logged as the deviation it is. It is gated
 * entirely under prefers-reduced-motion, it stops when the tab is hidden, and
 * it stops on a phone whose main thread is measurably blocking.
 *
 * COLOUR. Ink at 20-35% for the ninety days of history, depth-faded so the far
 * edge recedes; today's curve in deep-iris at full alpha. That accent is the
 * section's whole ration (DESIGN.md principle 2) and it is spent on the one
 * line that is a statement about now. No fills, no gradients, no shadows — the
 * surface sits on transparent and the hero owns the ground.
 */

export type YieldSurfaceProps = {
  /** CSS height of the canvas. Default 520. */
  height?: number;
  /** Camera tilt above the horizon, in degrees. Defaults per `fit`. */
  tilt?: number;
  /** Middle of the rock, in degrees of yaw. Default 45. */
  yawCenter?: number;
  /** Half-width of the rock: the yaw runs yawCenter ± yawRange. Default 30. */
  yawRange?: number;
  /**
   * "band" is the hero: a shallow slab shaped to fill a wide short slot, and
   * anchored into the right two-thirds so the headline keeps the left.
   * "natural" is the deeper landscape, centred, for a slot nearer square.
   */
  fit?: "band" | "natural";
  /** Alpha ceiling for the history strokes. Default 0.45 — it has to hold its
   *  own behind type on paper. */
  opacity?: number;
  /**
   * Floor, in CSS px, for how tall the drawn surface may get. A narrow canvas
   * is width-bound, so without this the whole landscape scales down with the
   * slot and the band collapses to a line: measured 57px of ink at 393 and
   * nothing usable at 320. Below the floor the canvas deepens the model — more
   * amplitude, more time-depth — rather than cropping, so nothing is ever cut
   * off the ends of the curve. Default 140.
   */
  minInkHeight?: number;
  /** Force the single static frame — no rAF, no observer. */
  static?: boolean;
  className?: string;
};

/* The two shapes, and why they differ.
 *
 * A rock through 45°±30° sweeps an envelope whose width barely changes (about
 * 9%) while its height changes by half. Width is therefore free and height is
 * what the slot has to pay for, so the only way to fill a wide short band is to
 * flatten the model: less tilt, a shallower time axis, a smaller yield
 * amplitude. Measured envelope ratios: "natural" 1.9:1, "band" 3.1:1.
 *
 * The band shape was tuned by measuring the drawn ink, not by eye. At the two
 * slots the Conductor named it fills 88% of the width at 1920x520 and 79% at
 * 3440x520, against targets of 80% and 70%. Flatter shapes fill more — 89% at
 * both — but at 520px of slot the surface becomes a 134px ribbon with no
 * vertical presence, so the extra fill is bought with the thing the surface is
 * for. This is the flattest shape that still reads as depth.
 *
 * None of these numbers are claims about the data: the surface prints no y
 * axis and no z axis, so its proportions are composition, exactly like the
 * yield curve's aspect. What would be dishonest is a non-uniform scale, and
 * there isn't one. */
const SHAPE = {
  band:    { tilt: 16, depth: 0.95, amplitude: 0.52 },
  natural: { tilt: 22, depth: 1.0,  amplitude: 0.62 },
} as const;

export default async function YieldSurface({
  height = 520,
  tilt,
  yawCenter = 45,
  yawRange = 30,
  fit = "band",
  opacity = 0.45,
  minInkHeight = 140,
  static: isStatic = false,
  className = "",
}: YieldSurfaceProps) {
  const shape = SHAPE[fit];
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
      /* Normalized to [-0.5, 0.5] and NOT amplified here. The amplitude is the
         canvas's to set, because how tall the surface has to be depends on how
         wide the canvas turns out to be, and the server does not know that. */
      ys: row.points.map((p) => (p.rate - min) / span - 0.5),
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
        tilt={tilt ?? shape.tilt}
        depth={shape.depth}
        amplitude={shape.amplitude}
        minInkHeight={minInkHeight}
        yawCenter={yawCenter}
        yawRange={yawRange}
        fit={fit}
        opacity={opacity}
        isStatic={isStatic}
      />
      {/* Two lines by construction, not by wrapping. The attribution and the
          date are one statement; the disclaimer is another, and letting the two
          run together meant the second half landed wherever the measure
          happened to break. The sentence itself is counsel's, unchanged. */}
      <figcaption className="t-caption ys-source">
        <span className="ys-line">
          {TREASURY_ATTRIBUTION} par yield curves · {rows.length} days · as of{" "}
          {asOf(asOfDate)}
        </span>
        <span className="ys-line">Public market data. Not fund performance.</span>
      </figcaption>
    </figure>
  );
}

const CSS = css`
  .ys { margin: 0; }
  .ys-source { display: block; margin-top: 14px; hyphens: none; }
  .ys-line { display: block; }
`;
