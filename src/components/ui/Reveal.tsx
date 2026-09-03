import * as React from "react";
import styles from "./Reveal.module.css";

/**
 * Reveal — a once-only load reveal with no JavaScript at all.
 *
 * There is no scroll mode. It was `animation-timeline: view()`, which is
 * scroll-LINKED rather than scroll-triggered: progress tracked scroll position,
 * so scrolling back up played the reveal backwards and the content faded out
 * again. EVERY-SCREEN.md §8.2 allows a first reveal "once per page load, not on
 * scroll-back" and forbids scroll-linked storytelling in the same breath, so
 * the timeline is gone rather than tuned. `mode` is kept as an argument so a
 * caller can say which it means, but both values now play once on load.
 *
 * `prefers-reduced-motion: reduce` removes the animation entirely rather than
 * shortening it: content is present, opaque and untransformed on first paint.
 *
 * This is a server component. It adds no client bundle, no observer, and no
 * hydration boundary — which is the whole reason it is not a port of any of the
 * three 21st reveal entries, all of which are `"use client"` wrappers around
 * framer-motion's `whileInView`.
 */
export type RevealMode = "load" | "scroll";

export type RevealProps = {
  /** `scroll` (default) reveals on entry; `load` reveals once on first paint. */
  mode?: RevealMode;
  /**
   * Stagger tier, on the SAME scale as globals.css `.fade-1 … .fade-8`: tier N
   * delays (N - 1) x `--stagger` (70ms), so `delay={3}` and `.fade-3` are the
   * same beat. One scale, because two would be the exact drift `motion.ts`
   * exists to prevent.
   */
  delay?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  as?: "div" | "section" | "article" | "li" | "p" | "span" | "figure";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

const DELAY = [undefined, styles.d1, styles.d2, styles.d3, styles.d4,
               styles.d5, styles.d6, styles.d7, styles.d8] as const;

export default function Reveal({
  mode = "scroll",
  delay = 1,
  as = "div",
  className = "",
  children,
  ...rest
}: RevealProps) {
  /* `mode` no longer changes the CSS — both values are the same once-only load
     reveal (see Reveal.module.css). It is kept in the API because a caller
     saying `mode="load"` is saying something true about its intent, and because
     removing it would silently change every call site's meaning. */
  void mode;
  const cls = [styles.reveal, DELAY[delay], className]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { ...rest, className: cls }, children);
}
