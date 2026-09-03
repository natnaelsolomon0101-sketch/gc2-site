import Reveal from "@/components/ui/Reveal";
import { fetchEcbRates, signed, ECB_SOURCE, ECB_ATTRIBUTION } from "./ecb";
import { asOf } from "./treasury";

/**
 * The ECB euro reference rates: a quiet grid of majors with the day's change.
 * EVERY-SCREEN.md §2 candidate 3 — "used in a section, not the hero."
 *
 * A server component on the same six-hour ISR as the curve, so the two data
 * components on the site always carry dates from the same refresh. If the feed
 * is unreachable it renders nothing; there is no last-known-good and no partial
 * row (see ecb.ts for the source and the ECB's reuse terms, which this
 * satisfies by printing the rates as published and citing the ECB by name).
 *
 * ACHROMATIC, DELIBERATELY. Every FX grid in the world paints the ups green and
 * the downs red. DESIGN.md principle 2 confines colour to the strategy tiles,
 * and APPENDIX-A says a data component gets no gradient and no fill — so
 * direction is carried by the sign, which is what the number already says, and
 * by nothing else. It also happens to be the only version of this grid that
 * works for a red-green colour-blind reader without a second cue.
 *
 * Rows reveal on first visibility through <Reveal/>, on the shared
 * .fade-1 … .fade-8 stagger scale, which is a scroll-driven CSS timeline with a
 * load fallback and no client JavaScript. §8.2's "data components draw in
 * (once, on first visibility)" — the curve draws its line, this arrives in
 * order.
 */
export default async function ECBGrid({ className = "" }: { className?: string }) {
  const data = await fetchEcbRates();
  if (!data) return null;

  const date = asOf(data.date);

  return (
    <figure
      className={`eg ${className}`}
      data-source={ECB_SOURCE}
      data-asof={data.date}
    >
      <style>{css}</style>
      <ul className="eg-rows">
        {data.pairs.map((p, i) => (
          <Reveal
            as="li"
            key={p.pair}
            /* Tier 8 is the last on the shared scale; six rows never reach it,
               but the clamp means adding a currency cannot silently invent a
               ninth beat. */
            delay={(Math.min(i + 1, 8) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)}
            className="eg-row"
          >
            <span className="t-caption eg-pair">{p.pair}</span>
            <span className="t-caption eg-rate">{p.rate}</span>
            <span className="t-caption eg-chg">
              {/* A currency the ECB did not quote yesterday has no change. It
                  renders nothing rather than 0.00%, which would be a claim. */}
              {p.change === null ? "" : signed(p.change)}
            </span>
          </Reveal>
        ))}
      </ul>
      <figcaption className="t-caption eg-source">
        {ECB_ATTRIBUTION} · reference rates · as of {date}
      </figcaption>
    </figure>
  );
}

/* No timing literals: the reveal's duration, easing and stagger come from
   Reveal.module.css, which reads --dur-base / --ease / --stagger. */
const css = `
.eg { margin: 0; container-type: inline-size; }
.eg-rows { list-style: none; margin: 0; padding: 0; display: grid;
           grid-template-columns: 1fr auto auto; }
.eg-row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 1fr auto auto;
  align-items: baseline;
  column-gap: 24px;
  min-height: 44px;
  border-bottom: 1px solid rgba(255,255,255,.12);
}
/* Shared column tracks, so six rates line up on one edge instead of six.
   Same reason as SessionClock; same fallback where subgrid is missing. */
@supports (grid-template-columns: subgrid) {
  .eg-row { grid-template-columns: subgrid; }
}
.eg-row:last-of-type { border-bottom: 0; }
.eg-rate { color: var(--color-pure); font-variant-numeric: tabular-nums;
           text-align: right; }
.eg-chg { color: var(--color-ash); font-variant-numeric: tabular-nums;
          text-align: right; min-width: 7ch; }
.eg-source { display: block; margin-top: 12px; hyphens: none; }

/* Under ~360px of container width the three columns and .t-caption's .182em
   tracking stop fitting on one line. The change moves under the rate rather
   than being dropped: it is the half of the row that is actually news. */
@container (max-width: 360px) {
  .eg-rows, .eg-row { grid-template-columns: 1fr auto; }
  .eg-row { row-gap: 0; padding-block: 6px; }
  .eg-chg { grid-column: 2; }
}
`;
