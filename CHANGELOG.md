# Changelog

All notable changes to this site are recorded here. Dates are the day the work landed.

## [0.2.0.0] - 2026-09-02

The dark redesign. The site goes from a single marketing page to a full allocator-facing
site on a near-black ground, with a documented design system behind it.

### Added

- **The Origin design system.** A near-black ground, serif display type against small mono
  labels, depth from a surface step rather than shadows, and colour confined to the
  strategy tiles. `DESIGN.md` records the tokens, the type scale, the measured contrast
  ratio behind every colour pairing, and the reasoning for each.
- **A new home page** composed of seven sections: the hero, the risk-framework band, the
  pinned strategies deck, the process ledger, the insights index, the allocator index, and
  the contact band.
- **Six strategies, presented as one interaction.** A pinned panel steps through Systematic
  Macro, Volatility Arbitrage, Statistical Relative Value, Commodity Carry, Event
  Dislocation and Tail Overlay as you scroll, each on its own chromatic tile with its
  markets and instruments. Every card is a real button with accordion semantics, so it
  works by tap and by keyboard, and it degrades to a plain readable grid with JavaScript
  off or reduced motion on.
- **Eight pages written for allocators**: the process ledger with named decision holders and
  a standing risk veto, a pre-answered due-diligence questionnaire, the governance seats and
  what to demand of each, the document index and what is released on request, what a letter
  contains, what a tearsheet must carry, the three partnership structures, and the team.
- **A 506(b) access gate** that is structural rather than a banner, so what is public and
  what is offered on request are separated by the site's own routing.
- **A print stylesheet.** Allocators print the diligence, governance, questions and tearsheet
  pages; the site is dark and paper is not, and before this it failed in both directions.
- **Insights**, with the first note dated after the firm existed rather than backdated.

### Changed

- **The hero is one composition at every width.** The display type is sized from the grid it
  has to land on rather than a guessed viewport value, so "Evidence first." meets the
  eight-column line at 759px against a 760px target from 1200px up, and the graded light is
  five equal steps anchored to that same line instead of four slivers beside a slab.
- **The phone gets its own hero, not a narrowed desktop one.** The headline is sized to the
  longest word so it fills the measure and stacks four deep, the two standing facts move
  below it into a numbered record, the light turns on its side to become the rule between
  the argument and the evidence, and the actions become full-bleed stamps. Everything lands
  above the fold from 320x568 up.
- **The strategies scroll-through works on a phone.** It was gated to 1024px and wider, so
  every phone got the static deck. It is gated on height now, which is what a pin actually
  needs.
- **The hero lead is written in the site's own voice** rather than in category words.
- **Miami, Florida**, not Austin.

### Fixed

- **The hero entrance no longer hides the thing it is animating.** The headline was moved
  102% of its own height under a mask, so the largest element on the first screen was absent
  rather than faint for the first fifth of a second, and the lead and both buttons were held
  at zero opacity for 340ms. Content now paints in the first frame and settles afterwards,
  using the same entrance the rest of the site already had.
- **The clock told the wrong time.** It kept running on Central after the firm moved to
  Miami, so the masthead read ET beside a time that was an hour out. The zone is derived
  from the city now, so it cannot drift from the fact it describes.
- **Contrast.** Seven UI primitives carry contrast guards, and the fog tone was lifted from
  `#6a6b6b` to `#7c7d7d` after four 14px usages, the footer legal line among them, measured
  at 3.56:1 and failed AA.
- **No horizontal scroll** at any width from 320px up.

### Removed

- The previous light marketing page and the city-as-office block.
- Reproducible QA artifacts are no longer tracked in the repository.

[0.2.0.0]: https://github.com/natnaelsolomon0101-sketch/gc2-site/compare/main...redesign/origin-100k
