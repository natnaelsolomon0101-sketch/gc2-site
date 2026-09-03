/**
 * The six chromatic tile fills, shared between PinnedStrategies.tsx (the
 * home deck) and /strategies' chapter headers so the two can never drift —
 * round 8 asks for /strategies' chapter tiles to use "the same chromatic
 * fill and -fg text as the home deck," which means one array, not two
 * hand-kept copies. Index-matched to `strategies`. Reads the paired
 * accent/-fg tokens DESIGN.md defines and ui/Tile.tsx already asserts
 * >=4.5:1 for — no hex here, so there is nothing to fall out of sync with
 * that table.
 *
 * `dark` marks the one tile (deep-iris) whose fill is dark enough that its
 * paired foreground is `ground`, not `ink` — both consumers need this to
 * pick the right print override (see PinnedStrategies.tsx's data-tone
 * handling and DESIGN.md's "Chromatic tiles" table).
 */
export type TileAccent = { bg: string; fg: string; dark?: boolean };

export const tileAccents: TileAccent[] = [
  { bg: "var(--color-accent-iris-gleam)", fg: "var(--color-accent-iris-gleam-fg)" },
  { bg: "var(--color-accent-cyan-signal)", fg: "var(--color-accent-cyan-signal-fg)" },
  { bg: "var(--color-accent-pale-iris)", fg: "var(--color-accent-pale-iris-fg)" },
  { bg: "var(--color-accent-deep-iris)", fg: "var(--color-accent-deep-iris-fg)", dark: true },
  { bg: "var(--color-accent-orchid-bloom)", fg: "var(--color-accent-orchid-bloom-fg)" },
  { bg: "var(--color-accent-periwinkle)", fg: "var(--color-accent-periwinkle-fg)" },
];
