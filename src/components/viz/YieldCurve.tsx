import {
  fetchYieldCurve, geometry, asOf, TREASURY_SOURCE, TREASURY_ATTRIBUTION,
} from "./treasury";

/**
 * The U.S. Treasury par yield curve, today. EVERY-SCREEN.md §2 candidate 1.
 *
 * A server component with ISR: the fetch runs at build and again every six
 * hours (see `YIELD_CURVE_REVALIDATE`), so the shape is current, the page costs
 * the reader no JavaScript, and no client ever talks to Treasury.
 *
 * If the fetch fails, this renders nothing. Not a placeholder, not a skeleton,
 * not yesterday's line — nothing. A drawn curve carries a date under it, and a
 * dated line that is not the data is worse than an empty slot.
 *
 * WHAT IT CLAIMS. Thirteen published par rates joined by one hairline, tenor
 * labels, the source, the date. No y scale, so it states a shape and not a
 * level; no fund data of any kind, per §1 and the 506(b) list.
 *
 * preserveAspectRatio="none", DELIBERATELY, with vector-effect="non-scaling-
 * stroke" on the path. The alternative, "xMidYMid meet", scales the drawing
 * uniformly: at 320 the hairline thins below a pixel and at 3440 it fattens to
 * three, and the letterboxing leaves dead bands the composition has no use for.
 * With "none" the plot fills its box at every width and the stroke stays
 * exactly 1px, which is what APPENDIX-A means by a hairline. The distortion
 * that buys is vertical exaggeration of a curve with no printed y scale, which
 * claims nothing either way. Tenor labels are HTML, not SVG text, so they hold
 * .t-caption at its own size instead of scaling with the box — that is the
 * other half of the same decision, and it is why the 13px floor survives at
 * 320 and the labels do not become billboards at 3440. Checked at both.
 */

/* Four labels, not thirteen. On a log axis 1Y and 2Y sit twelve percent apart,
   which at 320px is 38px between two uppercase mono words — they touch. These
   four are spread across the axis at every width the site supports. */
const LABELLED = new Set(["1M", "1Y", "10Y", "30Y"]);

const VIEW = { w: 1000, h: 260 };

export default async function YieldCurve({ className = "" }: { className?: string }) {
  const curve = await fetchYieldCurve();
  if (!curve) return null;

  const { x, d } = geometry(curve.points, VIEW.w, VIEW.h);
  const date = asOf(curve.date);
  const ticks = curve.points.filter((p) => LABELLED.has(p.label));

  return (
    <figure
      className={`yc ${className}`}
      data-source={TREASURY_SOURCE}
      data-asof={curve.date}
    >
      <style>{css}</style>
      <div className="yc-plot">
        <svg
          className="yc-svg"
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`United States Treasury par yield curve as of ${date}, from one month to thirty years.`}
        >
          <path
            className="yc-line"
            d={d}
            pathLength={1}
            fill="none"
            stroke="var(--color-pure)"
            strokeWidth={1}
            strokeLinecap="square"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Tenor labels sit on the same log x as the path. The first is pinned
            to the left edge and the last to the RIGHT EDGE — `right: 0`, not
            `left: 100%` with a translate. A transform does not change layout,
            so the translated version left the last label's box starting at the
            container's right edge and genuinely overflowing it by its own
            width. Nothing looked wrong, but the element was outside its box,
            which the share kit's overflow check caught the first time it tried
            to fit the curve into a square card. */}
        <div className="yc-axis" aria-hidden="true">
          {ticks.map((p, i) => (
            <span
              key={p.label}
              data-t={p.label}
              className="t-caption yc-tick"
              style={
                i === ticks.length - 1
                  ? { right: 0 }
                  : {
                      left: `${(x(p.years) / VIEW.w) * 100}%`,
                      transform: i === 0 ? "none" : "translateX(-50%)",
                    }
              }
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="t-caption yc-source">
        {TREASURY_ATTRIBUTION} · as of {date}
      </figcaption>
    </figure>
  );
}

/* Timing reads --dur-draw and --ease, the globals.css mirror of
   src/lib/motion.ts. pathLength={1} normalizes the path so the dash length is
   1 regardless of the curve's real length, which changes daily — without it the
   draw would run at a different apparent speed on a steep day than a flat one. */
const css = `
.yc { margin: 0; container-type: inline-size; }
.yc-plot { position: relative; }
.yc-svg {
  display: block;
  width: 100%;
  height: clamp(132px, 15vw, 240px);
  overflow: visible;
}
.yc-axis { position: relative; height: 1.9em; margin-top: 12px; }
.yc-tick { position: absolute; top: 0; white-space: nowrap; }
.yc-source { display: block; margin-top: 6px; }

/* Below ~430px of CONTAINER width — not viewport: the component has to survive
   a narrow column at 1920 the same way it survives a 320 phone — 10Y (81% of
   the axis) and 30Y (pinned to the right edge) collide. Three labels still
   span the axis. §7 rule 4. */
@container (max-width: 430px) {
  .yc-tick[data-t="10Y"] { display: none; }
}

@keyframes ycDraw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
.yc-line {
  stroke-dasharray: 1;
  animation: ycDraw var(--dur-draw) var(--ease) both;
}

@media (prefers-reduced-motion: reduce) {
  .yc-line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
}
/* A dash offset has no meaning on paper, and a half-drawn curve under a source
   line would be a false statement. */
@media print {
  .yc-line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
}
`;
