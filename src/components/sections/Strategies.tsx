import { strategies } from "@/content/strategies";
import ECBGrid from "@/components/viz/ECBGrid";
import PinnedStrategies from "@/components/PinnedStrategies";

/* ===========================================================================
   STRATEGIES — the sliding/fanning tile deck, every width.

   Round 0 replaced the deck with six hairline rows because it cost four
   phone viewports and clipped its own tile bodies. "Bring the sliding thing
   back" rebuilt it (PinnedStrategies.tsx) instead of restoring it, fixing
   both, and shipped it >=768px only, phone keeping the rows. Owner decision,
   this round: the deck goes on phones too — see PinnedStrategies.tsx for the
   phone-tier sizing and the landscape-phone / reduced-motion static-grid
   gating that makes that safe. The rows are gone; the deck's own static
   grid mode is the reduced-motion (and no-JS/SSR) fallback everywhere now,
   so a second, parallel "phone-only" presentation had nothing left to do.

   Composition: the heading block (eyebrow, h2, lede) is written once. Below
   1024px it sits in normal document flow above the deck — nothing measures
   the window to arrange that, it is just DOM order. At >=1024px `.stx-wrap`
   becomes a two-column grid — the deck on the left, the heading sticky on
   the right — so the deck's own column width no longer leaves the rest of
   the viewport as empty paper for the whole scroll-through. `.stx-header`
   is deliberately not itself the grid item: see the comment on `.stx-header`
   below for why the sticky element and the stretched grid cell have to be
   two different elements.

   Colour: the deck's tiles are full chromatic fills with the paired `-fg`
   token, the pairing DESIGN.md's "Chromatic tiles" table and Tile.tsx both
   define. No box-shadow — depth is the ground/surface step and a hairline,
   same as everywhere else on the light canvas. Motion: `--dur-base` /
   `--dur-fast` / `--ease` throughout, all in PinnedStrategies.tsx.
   ========================================================================= */

const css = `
@media (max-width: 767px) {
  .stx.band { padding-block: 56px 64px; }
}

.stx-deck-wrap { margin-top: 32px; }
@media (min-width: 768px) {
  .stx-deck-wrap { margin-top: 40px; }
}
@media (min-width: 1280px) {
  .stx-deck-wrap { margin-top: 48px; }
}

/* A heading tier sized for a full-width band can be wider than its own
   sentence once it is squeezed into the sidebar column below — "framework."
   set at .t-display-sm's 80px ceiling does not fit inside a ~404px column
   at 1024px viewport width (measured: a document 100px wider than the
   viewport). overflow-wrap:anywhere is a safety net, not the primary fix —
   it only ever engages where normal wrapping would otherwise overflow, so
   it changes nothing at the widths where the column is already wide enough
   (>=1280px, where this heading already wraps cleanly on its own). */
.stx-header h2 { overflow-wrap: anywhere; }

/* ---- >=1024: header moves beside the deck, not above it -------------------
   Below this the header stays exactly where DOM order already puts it —
   above the deck, no CSS needed. At >=1024 the deck (640px, matching
   PinnedStrategies.tsx's own --pin max-width) takes the left column and the
   header takes the right, sticky, so the right half of the viewport a
   scroll-through deck used to leave as empty paper is now reading the
   section header the whole time instead. */
@media (min-width: 1024px) {
  .stx-wrap { display: grid; grid-template-columns: 640px 1fr; column-gap: 56px; }
  /* Both get an explicit grid-row, not just grid-column: auto-placement with
     only a column specified does not reliably backfill row 1's other column
     once the first item has been placed — deck-wrap landed in row 2, under
     header-wrap, in testing, which is exactly the "header stacked above,
     not beside" bug this round exists to fix. Pin both to row 1. */
  .stx-deck-wrap { grid-column: 1; grid-row: 1; margin-top: 0; }
  /* .stx-header-wrap is the grid item and stretches (default align-items) to
     the row's full height; .stx-header, its child, is the actual sticky
     element and stays its own natural (short) content height — the same
     wrapper/child split the /strategies rail uses for the same reason: a
     sticky element that IS the stretched grid item has nothing to stick
     within, because its own box already spans the whole row. */
  .stx-header-wrap { grid-column: 2; grid-row: 1; }
  .stx-header { position: sticky; top: calc(var(--nav-h) + 32px); }
  /* The ECB strip spans both columns, below the deck row — a grid item with
     no explicit placement would otherwise auto-place into whatever column
     falls next in DOM order, not full width. */
  .stx-ecb { grid-column: 1 / -1; grid-row: 2; }
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
      <div className="wrap stx-wrap">
        <div className="stx-header-wrap">
          <div className="stx-header">
            <p className="t-mono">Strategies</p>
            <h2 id="strategies-h" className="t-display-sm mt-4 md:mt-6">
              Six strategies. One risk framework.
            </h2>
            <p className="t-sub stx-lede mt-4 md:mt-6" style={{ maxWidth: "31em" }}>
              Six separate books, each underwritten by our own research before it is allowed
              to carry capital, and every one of them sized by the same risk framework rather
              than by conviction.
            </p>
          </div>
        </div>

        <div className="stx-deck-wrap">
          <PinnedStrategies strategies={strategies} />
        </div>

        <ECBGrid className="stx-ecb" />
      </div>
    </section>
  );
}
