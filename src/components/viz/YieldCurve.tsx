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
 * ONE 1px INK HAIRLINE ON PAPER. The rule never changed — one hairline, no
 * fill, no gradient — only which end of the scale it sits at: it is now
 * `--color-ink` on `--color-ground` (LIGHT-PASS.md). Nothing else about the drawing changes: no fill, no
 * gradient, no second colour, and the accents stay out of it — a data
 * component is the one place DESIGN.md's "one accent per section" ration is
 * spent on nothing at all.
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

export type YieldCurveProps = {
  className?: string;
  /**
   * Share-card mode. securities-counsel's round-2 read (docs/v4/COUNSEL.md,
   * finding 1, BLOCKING): on the page the curve sits inside a section that says
   * what it is, but a card travels alone — an unlabelled rising hairline beside
   * a fund's wordmark can be read as the fund's own record. So a card NAMES the
   * plot in type and says what it is not, and it drops the vertical
   * exaggeration: the page fills its box with preserveAspectRatio="none", a
   * card renders the viewBox's own 1000:260 so the line on the card is never
   * steeper than the line in the data.
   */
  card?: boolean;
};

export default async function YieldCurve({ className = "", card = false }: YieldCurveProps) {
  const curve = await fetchYieldCurve();
  if (!curve) return null;

  const { x, d } = geometry(curve.points, VIEW.w, VIEW.h);
  const date = asOf(curve.date);
  const ticks = curve.points.filter((p) => LABELLED.has(p.label));

  return (
    <figure
      className={`yc ${className}`}
      data-card={card ? "true" : undefined}
      data-source={TREASURY_SOURCE}
      data-asof={curve.date}
    >
      <style>{css}</style>
      {card ? <h3 className="t-h3 yc-title">U.S. Treasury par yield curve</h3> : null}
      <div className="yc-plot">
        <svg
          className="yc-svg"
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio={card ? "xMidYMid meet" : "none"}
          role="img"
          aria-label={`United States Treasury par yield curve as of ${date}, from one month to thirty years.`}
        >
          <path
            className="yc-line"
            d={d}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
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
      {card ? (
        <p className="t-caption yc-note">Public market data. Not fund performance.</p>
      ) : null}
    </figure>
  );
}

/* Timing reads --dur-draw and --ease, the globals.css mirror of src/lib/motion.ts.

   THE DRAW IS A CLIP, NOT A DASH. It was `pathLength={1}` with
   `stroke-dasharray: 1` and `stroke-dashoffset` animated 1 -> 0, which is what
   EVERY-SCREEN.md §2 names. That is broken in combination with
   `vector-effect="non-scaling-stroke"`, which this component needs for the 1px
   hairline: non-scaling-stroke moves the dash properties into SCREEN space
   while `pathLength` normalizes the path in USER units, so the two disagree the
   moment the rendered plot is wider than the path's ~1036 user units. sec-hero
   caught it in the hero: at 2560 the line stopped just past 1Y and 10Y and 30Y
   never painted; at 3440 it drew, broke, and resumed. A Treasury curve that
   ends at 1Y is a false statement, which is worse than no animation.

   A left-to-right inset clip does the same thing to the eye on a curve that is
   read left to right, costs one composited property, is independent of path
   length and of width, and leaves the stroke geometry — and therefore
   non-scaling-stroke — completely alone. The insets are negative on three
   sides because `inset()` resolves against the SVG fill-box, which is the
   path's bounding box and excludes the stroke: without the slack the top and
   bottom of a 1px hairline get shaved.

   The base rule sets no clip-path, so anything that stops the animation from
   running leaves the whole line painted rather than an empty box. */
const css = `
.yc { margin: 0; container-type: inline-size; }
.yc-plot { position: relative; }
.yc-svg {
  display: block;
  width: 100%;
  /* A consumer sets its slot's height by assigning --yc-h on the figure rather
     than reaching inside for .yc-svg — the hero's short-desktop slot height is
     the case this exists for. */
  height: var(--yc-h, clamp(132px, 15vw, 240px));
  overflow: visible;
}
.yc-axis { position: relative; height: 1.9em; margin-top: 12px; }
.yc-tick { position: absolute; top: 0; white-space: nowrap; }
.yc-source { display: block; margin-top: 6px; }

/* Card mode. The heading is .t-h3 — the display face at the caption-to-h3 size
   counsel asked for — and the plot takes its own aspect from the viewBox rather
   than a forced height, which is what removes the stretch. */
.yc-title { margin: 0 0 22px; }
.yc-note { display: block; margin: 2px 0 0; color: var(--color-ink-3); hyphens: none; }
.yc[data-card="true"] .yc-svg { height: auto; }

/* Label collision, and where the 470px comes from.
 *
 * The labels are placed by the SAME x() the path is drawn with — log-spaced in
 * years — so they sit over their own points at every width. What that mapping
 * cannot help with is that a log axis crowds the long end: 1M to 1Y is 42% of
 * the width, 1Y to 10Y is another 39%, and 10Y to 30Y is 18.6%. Only the last
 * pair can ever touch.
 *
 * The rule, from the geometry rather than from a guess. A .t-caption label is
 * about 4.5ch wide at .182em tracking; 30Y is pinned inward at the right edge
 * and 10Y is centred on its own x, so the space between the two boxes is
 * 18.6% of the plot minus half of each. Holding the Conductor's 3ch minimum,
 * with headroom for the tracking that makes a mono gap look tighter than it
 * measures, wants about 10.5ch between their centres: 10.5 x ~7.8px / 0.186 =
 * ~440px of plot. 470px is that with a margin.
 *
 * Below it, the intermediate label goes and 1M / 1Y / 30Y still span the axis.
 * CONTAINER width, not viewport (§7 rule 4): the component has to survive a
 * narrow column at 1920 the same way it survives a 320 phone — and a share card
 * scaled to fill its frame, which is the case that made this wrong. Round 2
 * forced 10Y back on in card mode on the theory that a card is never a phone.
 * It is not a phone, but the square card's block is zoomed 2.54x to fill 1080,
 * so its layout container is 423px and the crowding is real: zoom scales the
 * label and the plot together, which is exactly why measuring in layout px is
 * the right test and the override was the wrong answer. It is gone. */
@container (max-width: 470px) {
  .yc-tick[data-t="10Y"] { display: none; }
}

@keyframes ycDraw {
  from { clip-path: inset(-8% 100% -8% -2%); }
  to   { clip-path: inset(-8% -2% -8% -2%); }
}
.yc-line { animation: ycDraw var(--dur-draw) var(--ease) both; }

@media (prefers-reduced-motion: reduce) {
  .yc-line { animation: none; clip-path: none; }
}
/* A half-drawn curve under a source line would be a false statement, and on
   paper there is no moment at which it finishes. */
@media print {
  .yc-line { animation: none; clip-path: none; }
}
`;
