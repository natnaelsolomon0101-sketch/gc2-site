/* The single source for motion on this site (APPENDIX-A §Motion, EVERY-SCREEN.md
   §8.1). Every animated component imports its timing from here rather than
   writing a literal duration or easing — that is what `scripts/qa/killist.sh`
   and §8.1's grep gate are checking for.

   Durations: 150ms is a hover/focus transition, 500ms is the default
   reveal (fade, stagger step base), 900ms is a slow "draw" for data
   components (the yield curve, anything that traces a line on first
   visibility), 200ms is the menu open/close fade. `stagger` is the delay
   step between successive staggered items (70ms per item, so item N
   delays N * 70ms). `easing` is the one curve the whole site uses. */
export const duration = {
  fast: 150,
  base: 500,
  draw: 900,
  menu: 200,
} as const;

export const stagger = 70;

export const easing = "cubic-bezier(.22,.61,.36,1)";

/**
 * SSR-safe prefers-reduced-motion check. `window.matchMedia` does not exist
 * on the server, and Next prerenders every route here, so a bare
 * `matchMedia(...)` call at module scope or during a server render would
 * throw. Call this inside an effect / event handler, never at render time
 * on the server.
 */
export function reduced(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
