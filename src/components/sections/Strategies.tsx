import { strategies } from "@/content/strategies";
import ECBGrid from "@/components/viz/ECBGrid";

/* ===========================================================================
   STRATEGIES — six hairline rows.

   Replaces the earlier pinned/fanned-tile deck (position: sticky over a
   240vh–260svh scroll track, a rAF scroll listener driving which card was
   "open"). That deck put six full-height chromatic tiles on screen at 393 —
   about four viewports for a list of six names — and a sticky-scroll track is
   exactly the "sticky-scroll storytelling" EVERY-SCREEN.md §8.2 rules out.

   The row is the design: name / one-liner / markets, a 12px gap between the
   three, 24px of padding from hairline to hairline, and the whole row is the
   link — a real ≥44px tap target, not a decorative surface with a button
   floating on it. Colour survives as a rationed accent (a small swatch keyed
   to the tile hue below) rather than as a full chromatic fill, per DESIGN.md
   principle 2 ("colour is confined to the strategy tiles" — here, a chip of
   it). No box-shadow: DESIGN.md's "Known drift" names this file as the source
   of the shipped shadow a real ground/surface step was meant to replace, and
   there's no shadow left to remove that step for.

   No client JS. The first-reveal stagger is a CSS animation keyed off
   `--dur-base` / `--stagger` (globals.css's mirror of src/lib/motion.ts), runs
   once on load, and is gone under `prefers-reduced-motion: reduce` — so a
   no-JS client and a reduced-motion client both get the full list, readable,
   with nothing pinned and nothing to scroll-jack.

   Round 1: the ECB euro reference-rate grid (sec-motion's, src/components/
   viz/ECBGrid.tsx) sits under the six rows as a quiet full-width strip —
   "Markets" is this section's own vocabulary, so a grid of majors reads as
   the section finishing its sentence rather than a bolted-on widget. It is
   rendered directly, with no wrapping element of ours around it: ECBGrid
   returns null when its feed is unreachable, and because there is no div
   here to carry margin or a border in that case, a down feed leaves no gap
   — the section just ends one row earlier.
   ========================================================================= */

/** Index-matched to `strategies`. A swatch, not a card ground — no text sits
    on these, so there is no foreground pairing to guarantee here (contrast
    that ui/Tile.tsx enforces for the chromatic-card case doesn't apply). */
const accents = [
  "#847dff", // iris gleam
  "#00b3dd", // cyan signal
  "#d1c9ff", // pale iris
  "#4b49aa", // deep iris
  "#dd90d8", // orchid bloom
  "#90b8f0", // periwinkle
];

const css = `
.stx-list { margin-top: 32px; }
/* Phone chrome tightened so six rows of real content (not padded up to
   fill a poster) stay close to the 2-viewport budget: the row's own 24px
   padding and 12px gaps are the spec and are not touched here, only the
   surrounding band/heading air, which is where the old six-tile deck's
   height actually came from. */
@media (max-width: 767px) {
  .stx.band { padding-block: 56px 64px; }
  .stx-list { margin-top: 24px; }
}
.stx-row {
  border-top: 1px solid var(--color-hairline);
  animation: stxIn var(--dur-base) var(--ease) both;
  animation-delay: calc(var(--stx-i, 0) * var(--stagger));
}
.stx-list .stx-row:last-child { border-bottom: 1px solid var(--color-hairline); }

.stx-link {
  display: flex; flex-direction: column; gap: 12px;
  padding-block: 24px; min-height: 44px; justify-content: center;
  color: inherit; text-decoration: none;
  transition: background var(--dur-fast) var(--ease);
}
.stx-top { display: flex; align-items: center; gap: 12px; }
/* The rationed accent: the tile hue as a small fill, not a card ground. No
   foreground pairing is needed the way ui/Tile.tsx guarantees one — nothing
   is set in type on the swatch itself. */
.stx-swatch { width: 9px; height: 9px; border-radius: 50%; flex: none; background: var(--stx-accent); }
.stx-name { color: var(--color-ink); }
.stx-one { color: var(--color-ink-2); max-width: 46em; }
.stx-markets { color: var(--color-ink-3); }

@media (hover: hover) and (pointer: fine) {
  .stx-link:hover { background: rgba(20,19,17,.04); }
  .stx-link:hover .stx-swatch { background: var(--color-ink); }
}
.stx-link:active { background: rgba(20,19,17,.07); }
.stx-link:focus-visible {
  outline: 2px solid var(--color-ink); outline-offset: -2px;
  border-radius: 4px; background: rgba(20,19,17,.04);
}

@media (min-width: 1280px) {
  .stx-list { display: grid; grid-template-columns: 1fr 1fr; column-gap: 56px; margin-top: 40px; }
  .stx-top { gap: 16px; }
}

/* The ECB strip. A sibling of .stx-list, not a child, so the two-column
   split above does not touch it — full section width at every size. */
.stx-ecb {
  margin-top: 40px; padding-top: 24px;
  border-top: 1px solid var(--color-hairline);
}
@media (max-width: 767px) {
  .stx-ecb { margin-top: 32px; padding-top: 20px; }
}
@media (min-width: 1280px) {
  .stx-ecb { margin-top: 48px; }
}

@keyframes stxIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .stx-row { animation: none; }
}
`;

export default function Strategies() {
  return (
    <section id="strategies" aria-labelledby="strategies-h" className="stx band">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">
        <p className="t-mono">Strategies</p>
        <h2 id="strategies-h" className="t-display-sm mt-4 md:mt-6">
          Six strategies. One risk framework.
        </h2>
        <p className="t-sub stx-lede mt-4 md:mt-6" style={{ maxWidth: "31em" }}>
          Six separate books, each underwritten by our own research before it is allowed
          to carry capital, and every one of them sized by the same risk framework rather
          than by conviction.
        </p>

        <ul className="stx-list">
          {strategies.map((s, k) => (
            <li key={s.slug} className="stx-row" style={{ ["--stx-i" as string]: k }}>
              <a href={`/strategies#${s.slug}`} className="stx-link">
                <span className="stx-top">
                  <span
                    className="stx-swatch"
                    style={{ ["--stx-accent" as string]: accents[k] }}
                    aria-hidden="true"
                  />
                  <span className="t-heading-sm stx-name">{s.name}</span>
                </span>
                <span className="t-small stx-one">{s.oneLiner}</span>
                <span className="t-mono-xs stx-markets">{s.markets}</span>
              </a>
            </li>
          ))}
        </ul>

        <ECBGrid className="stx-ecb" />
      </div>
    </section>
  );
}
