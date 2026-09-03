import * as React from "react";

/**
 * Rule — a hairline that spans its container.
 *
 * One device carries most of the structure on this site, so it is a component
 * rather than a `border-t` repeated at forty call sites.
 *
 * Contrast against the ground it sits on (WCAG 2.1, sRGB; see DESIGN.md
 * "Measured — hairlines"):
 *   tone="hairline"        (13% ink alpha) ..... 1.31:1   decorative divider
 *   tone="hairline-strong" (28% ink alpha) ..... 1.86:1   the rule a reader
 *                                                          actually has to see
 *   inherit currentColor at 55% on pale-iris ... 4.21:1
 *   inherit currentColor at 55% on deep-iris ... 3.45:1
 *
 * `tone="hairline"` is exempt from 1.4.11 as pure decoration: nothing is
 * identified by it and no information is lost if it is not perceived. Use
 * `tone="hairline-strong"` for any rule that is load-bearing structure, e.g.
 * the divider that separates one record from the next in a list with no
 * other boundary.
 *
 * (This tone enum used to be named after the two dark-canvas greys it drew
 * from. There are no call sites for this component today, so the light-pass
 * migration renames the values to the semantic tokens they now select,
 * rather than keeping colour names that no longer describe a colour.)
 */
export type RuleTone = "hairline" | "hairline-strong" | "inherit";

const TONES: Record<RuleTone, string> = {
  hairline: "border-hairline",
  "hairline-strong": "border-hairline-strong",
  inherit: "border-current/55",
};

export type RuleProps = {
  tone?: RuleTone;
  /** Vertical margin. `none` when the parent already owns the spacing. */
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
} & Omit<React.HTMLAttributes<HTMLHRElement>, "className">;

const SPACING = {
  none: "",
  sm: "my-3",
  md: "my-6",
  lg: "my-10",
} as const;

export default function Rule({
  tone = "hairline",
  spacing = "none",
  className = "",
  ...rest
}: RuleProps) {
  const cls = [
    "w-full border-0 border-t",
    TONES[tone],
    SPACING[spacing],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <hr {...rest} className={cls} />;
}
