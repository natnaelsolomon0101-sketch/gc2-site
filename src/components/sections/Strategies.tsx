import { strategies } from "@/content/strategies";
import ECBGrid from "@/components/viz/ECBGrid";
import PinnedStrategies from "@/components/PinnedStrategies";

/* ===========================================================================
   STRATEGIES — hairline rows on phone, the sliding/fanning tile deck from
   768px up.

   Round 0 replaced the deck with six hairline rows everywhere: it was six
   full-height chromatic tiles stacked, about four viewports for a list of
   six names on a phone. Round "bring the sliding thing back" restores the
   deck (PinnedStrategies.tsx, a client component — the scroll-progress
   tracking it needs is real interactivity, not a layout decision) but keeps
   it scoped to >=768px, where the four-viewport phone cost never applied in
   the first place: the deck's own natural height at that width is a few
   hundred pixels, not several screens.

   Both are always in the DOM; CSS alone decides which one is visible
   (`.stx-rows`/`.stx-deck-wrap`'s min-width:768px media queries below), same
   technique the /strategies rail already uses for its sticky-column vs.
   horizontal-strip split — nothing here measures the window in JavaScript to
   choose a layout. The heading and lede are written once and shared by both;
   only the list beneath them differs.

   Colour: rows keep the rationed-swatch treatment from round 0 (a chip of
   the tile hue, not a card ground — DESIGN.md principle 2). The deck's tiles
   are full chromatic fills with the paired `-fg` token, same pairing
   Tile.tsx and DESIGN.md's "Chromatic tiles" table define; see
   PinnedStrategies.tsx for the rest of that rebuild's reasoning (no dead
   ground, no clipped bodies, no phone).

   No box-shadow anywhere in this file's own CSS (rows never had one; the
   deck doesn't get one back — depth is the ground/surface step and a
   hairline, same as everywhere else on the light canvas).

   Motion: the rows' first-reveal stagger is unchanged from round 0
   (`--dur-base`/`--stagger`, load-once, reduced-motion off). The deck's own
   timings are `--dur-base`/`--dur-fast`/`--ease` throughout — see that file.
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
/* ---- shared heading block ------------------------------------------------ */
@media (max-width: 767px) {
  .stx.band { padding-block: 56px 64px; }
}

/* ---- phone: hairline rows ------------------------------------------------ */
.stx-rows-wrap { margin-top: 24px; }
@media (min-width: 768px) {
  .stx-rows-wrap { display: none; }
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

@keyframes stxIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .stx-row { animation: none; }
}

/* ---- >=768: the deck ------------------------------------------------------ */
.stx-deck-wrap { display: none; }
@media (min-width: 768px) {
  .stx-deck-wrap { display: block; margin-top: 40px; }
}
@media (min-width: 1280px) {
  .stx-deck-wrap { margin-top: 48px; }
}

/* ---- the ECB strip. Full section width at every size. --------------------- */
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

        <div className="stx-rows-wrap">
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
        </div>

        <div className="stx-deck-wrap">
          <PinnedStrategies strategies={strategies} />
        </div>

        <ECBGrid className="stx-ecb" />
      </div>
    </section>
  );
}
