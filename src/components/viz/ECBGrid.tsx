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
 * the downs red. DESIGN.md principle 2 rations colour to one accent per
 * section, and APPENDIX-A gives a data component no gradient and no fill — so
 * direction is carried by the sign, which is what the number already says, and
 * by nothing else. It is also the only version of this grid that works for a
 * red-green colour-blind reader without a second cue, and the only one that
 * survives being printed. On paper the rate is ink, the change is ink-2 and
 * the rules are hairlines; the accents are not spent here.
 *
 * Rows reveal ONCE, on load, through <Reveal/> on the shared .fade-1 … .fade-8
 * stagger scale — no client JavaScript. It used to be a scroll-driven
 * `animation-timeline: view()`, which is scroll-LINKED: scrolling back up ran
 * it backwards and the rows faded out again. §8.2 allows a first reveal "once
 * per page load, not on scroll-back", and forbids scroll-linked storytelling
 * outright, so the timeline is gone from Reveal entirely.
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
            mode="load"
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
        {/* Counsel's second read: the same sentence the curve carries, on every
            surface. A grid of rates on a fund's page is read as the fund's
            rates unless it says otherwise, and it costs one line to say so. */}
        <span className="eg-note">Public market data. Not fund performance.</span>
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
  border-bottom: 1px solid var(--color-hairline);
}
/* Shared column tracks, so six rates line up on one edge instead of six.
   Same reason as SessionClock; same fallback where subgrid is missing. */
@supports (grid-template-columns: subgrid) {
  .eg-row { grid-template-columns: subgrid; }
}
.eg-row:last-of-type { border-bottom: 0; }
.eg-rate { color: var(--color-ink); font-variant-numeric: tabular-nums;
           text-align: right; }
.eg-chg { color: var(--color-ink-2); font-variant-numeric: tabular-nums;
          text-align: right; min-width: 7ch; }
.eg-source { display: block; margin-top: 12px; hyphens: none; }
.eg-note { display: block; color: var(--color-ink-3); }

/* Under ~360px of container width the three columns and .t-caption's .182em
   tracking stop fitting on one line. The change moves under the rate rather
   than being dropped: it is the half of the row that is actually news. */
@container (max-width: 360px) {
  .eg-rows, .eg-row { grid-template-columns: 1fr auto; }
  .eg-row { row-gap: 0; padding-block: 6px; }
  .eg-chg { grid-column: 2; }
}
`;
