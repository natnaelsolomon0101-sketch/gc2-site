import * as React from "react";
import styles from "./RevealLines.module.css";

/**
 * RevealLines — the 21st "Text Reveal (Mask)" idea (19257) with no JS: each
 * line sits in an overflow-hidden mask and rises into it once on load, one
 * stagger step after the last. Server component. Under reduced motion the
 * lines are simply there.
 *
 * <RevealLines as="h2" className="t-h2" lines={[<>Evidence <em>first</em>.</>, "Then capital."]} />
 */
export type RevealLinesProps = {
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  /** First line's stagger tier on the .fade / Reveal scale. Default 1. */
  from?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

export default function RevealLines({
  lines, as = "div", from = 1, className = "", ...rest
}: RevealLinesProps) {
  return React.createElement(
    as,
    { ...rest, className: [styles.block, className].filter(Boolean).join(" ") },
    lines.map((line, i) => (
      <span key={i} className={styles.mask}>
        <span
          className={styles.line}
          style={{ animationDelay: `calc(var(--stagger) * ${from - 1 + i * 2})` }}
        >
          {line}
        </span>
      </span>
    ))
  );
}
