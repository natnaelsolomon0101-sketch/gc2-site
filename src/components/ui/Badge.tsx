import * as React from "react";

/**
 * Badge — a small mono label. Not a pill.
 *
 * Every badge in the 21st catalog is `rounded-full`. Pills are on the banned
 * list here, so this is an 8px rectangle on the same radius as a Button, which
 * also keeps it visually related to the controls it sits beside.
 *
 * Contrast (WCAG 2.1, sRGB):
 *   outline  ash #9f9fa0 on obsidian #0f1011 ...... 7.20:1
 *   outline  ash on graphite #2e2e2e .............. 5.14:1
 *   inherit  void on every light tile tone ........ 6.36:1 min (iris)
 *   inherit  pure on deep-iris .................... 7.41:1
 *
 * The `inherit` edge is currentColor at 55%: 4.21:1 on pale-iris, 3.45:1 on
 * deep-iris, so the box itself clears the 3:1 non-text threshold as well as the
 * label clearing 4.5:1.
 *
 * `t-mono-xs` is the shipped 11px mono tier (uppercase, .182em tracking). It is
 * used rather than a local letter-spacing so the badge stays in step with the
 * eyebrow labels the rest of the site already sets.
 */
export type BadgeVariant = "outline" | "plain" | "inherit";

const VARIANTS: Record<BadgeVariant, string> = {
  /** Default. Steel hairline, ash label, on obsidian or graphite. */
  outline: "border border-steel text-ash",
  /** No edge. For dense rows where a box per item would be noise. */
  plain: "text-ash",
  /** Inside a Tile: takes the tile's guaranteed foreground via currentColor. */
  inherit: "border border-current/55 text-inherit",
};

export type BadgeProps = {
  variant?: BadgeVariant;
  as?: "span" | "li" | "div";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

export default function Badge({
  variant = "outline",
  as = "span",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const cls = [
    "inline-flex items-center rounded-control px-2 py-0.5 t-mono-xs whitespace-nowrap",
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { ...rest, className: cls }, children);
}
