import * as React from "react";

/**
 * Glass — the floating pane the nav pills already use, as a block. Paper at
 * 62% with a blur, a hairline ring, a soft inner highlight. No shadow (DESIGN
 * principle 4). Sits over whatever ground a section draws; on plain paper it
 * reads as a slightly whiter card, which is fine.
 */
export type GlassProps = {
  as?: "div" | "article" | "section" | "li" | "aside";
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "style">;

export default function Glass({
  as = "div", radius = 20, className = "", style, children, ...rest
}: GlassProps) {
  return React.createElement(
    as,
    {
      ...rest,
      className,
      style: {
        background: "color-mix(in srgb, var(--color-ground) 62%, transparent)",
        WebkitBackdropFilter: "blur(14px)",
        backdropFilter: "blur(14px)",
        border: "1px solid var(--color-hairline-strong)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.55)",
        borderRadius: radius,
        ...style,
      },
    },
    children
  );
}
