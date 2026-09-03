import * as React from "react";

/**
 * Card — the surface card.
 *
 * Depth on this project is a ground step (ground -> surface) plus radius.
 * There is no shadow. `box-shadow` is on the banned list, so the elevation cue
 * every 21st card entry reaches for (`shadow-sm`, `shadow-lg`, inset bevels) is
 * replaced by the ground -> surface step (measured 1.21:1 in DESIGN.md) and
 * needs no blur to be legible.
 *
 * Contrast on surface (WCAG 2.1, sRGB; see DESIGN.md "Measured — ink on
 * every ground"):
 *   ink   .... 14.12:1
 *   ink-2 .....6.25:1
 *   ink-3 .....4.65:1  <- the floor; still clears 4.5
 *
 * `bordered` adds a hairline-strong edge: a control border, not decoration.
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
  /** Adds a hairline-strong edge. Decorative. */
  bordered?: boolean;
  /**
   * Hover affordance for a card that is itself a link target. Shifts the
   * hairline hairline-strong -> ink-2 rather than lifting the card, because
   * there is no shadow to lift with.
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
    "bg-surface rounded-card",
    PADDING[padding],
    bordered || interactive ? "border border-hairline-strong" : "",
    interactive
      ? "transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] hover:border-ink-2 focus-within:border-ink-2"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { ...rest, className: cls }, children);
}
