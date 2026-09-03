import * as React from "react";
import styles from "./Reveal.module.css";

/**
 * Reveal — a load or scroll reveal with no JavaScript at all.
 *
 * `mode="scroll"` uses a scroll-driven animation timeline (`animation-timeline:
 * view()`), so progress is bound to the element's position in the viewport and
 * runs off the main thread. Where that is unsupported, the `@supports` guard
 * falls through to the same keyframes played once on load, so nothing is ever
 * left invisible waiting for a feature or a script that is not there.
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
  /** Stagger step. 0 / 1 / 2 / 3 -> 0 / 1 / 2 / 3 x `--stagger` (70ms) in
   *  load mode; in scroll mode the timeline range is shifted instead. */
  delay?: 0 | 1 | 2 | 3;
  as?: "div" | "section" | "article" | "li" | "p" | "span" | "figure";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

const DELAY = [undefined, styles.d1, styles.d2, styles.d3] as const;

export default function Reveal({
  mode = "scroll",
  delay = 0,
  as = "div",
  className = "",
  children,
  ...rest
}: RevealProps) {
  const cls = [
    styles.reveal,
    mode === "scroll" ? styles.scroll : undefined,
    DELAY[delay],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { ...rest, className: cls }, children);
}
