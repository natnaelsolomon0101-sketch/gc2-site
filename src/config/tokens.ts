/**
 * The A.3 palette as literals.
 *
 * globals.css `@theme` is the source of truth for anything the browser renders.
 * This module exists for the one place that cannot read a CSS custom property:
 * `next/og` renders through satori, which resolves no CSS variables, so the OG
 * cards must inline hex. Without a shared module those literals are copies, and
 * they had already drifted: the cards carried `#6B7178` for slate long after the
 * token moved to `#696F76` (the spec value measures 4.47:1 on stone and fails AA).
 *
 * Keep in step with the `@theme` block in globals.css.
 */
export const palette = {
  paper: "#FFFFFF",
  stone: "#F3F4F1",
  hairline: "#E3E5E1",
  slate: "#696F76",
  ink: "#1F2326",
  black: "#000000",
  ledger: "#0F4C3A",
} as const;
