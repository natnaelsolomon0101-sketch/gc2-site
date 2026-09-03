import * as React from "react";

/**
 * Card — the graphite surface.
 *
 * Depth on this project is a surface step (obsidian -> graphite) plus radius.
 * There is no shadow. `box-shadow` is on the banned list, so the elevation cue
 * every 21st card entry reaches for (`shadow-sm`, `shadow-lg`, inset bevels) is
 * replaced by the 0x0f -> 0x2e ground step, which reads at 1.99:1 against the
 * page and needs no blur to be legible.
 *
 * Contrast on graphite #2e2e2e (WCAG 2.1, sRGB):
 *   cloud  #f5f5f7 .... 12.47:1
 *   silver #cacaca ....  7.19:1
 *   ash    #9f9fa0 ....  5.14:1
 *   fog    #7c7d7d ....  3.29:1  <- below 4.5, do not use fog on a Card
 *
 * `bordered` adds a steel hairline. Steel on graphite is 1.31:1: that is a
 * decorative edge, not a control boundary, and nothing depends on seeing it.
 */
export type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-6 md:p-8",
};

export type CardProps = {
  /** Element to render. Sections and list items are common. */
  as?: "div" | "section" | "article" | "li";
  padding?: CardPadding;
  /** Adds a steel hairline edge. Decorative. */
  bordered?: boolean;
  /**
   * Hover affordance for a card that is itself a link target. Shifts the
   * hairline steel -> ash rather than lifting the card, because there is no
   * shadow to lift with.
   */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

export default function Card({
  as = "div",
  padding = "lg",
  bordered = false,
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const cls = [
    "bg-graphite rounded-card",
    PADDING[padding],
    bordered || interactive ? "border border-steel" : "",
    interactive
      ? "transition-colors duration-200 hover:border-ash focus-within:border-ash"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { ...rest, className: cls }, children);
}
