import * as React from "react";

/**
 * Rule — a hairline that spans its container.
 *
 * One device carries most of the structure on this site, so it is a component
 * rather than a `border-t` repeated at forty call sites.
 *
 * Contrast against the ground it sits on (WCAG 2.1, sRGB):
 *   steel #3f4041 on obsidian #0f1011 ..... 1.83:1   decorative divider
 *   steel on graphite #2e2e2e ............. 1.31:1   decorative divider
 *   ash   #9f9fa0 on obsidian ............. 7.20:1   use when the rule is
 *                                                     load-bearing structure
 *   inherit currentColor at 55% on pale-iris .... 4.21:1
 *   inherit currentColor at 55% on deep-iris .... 3.45:1
 *
 * Steel hairlines are exempt from 1.4.11 as pure decoration: nothing is
 * identified by them and no information is lost if they are not perceived. Use
 * `tone="ash"` for any rule that a reader actually has to see, e.g. the divider
 * that separates one record from the next in a list with no other boundary.
 */
export type RuleTone = "steel" | "ash" | "inherit";

const TONES: Record<RuleTone, string> = {
  steel: "border-steel",
  ash: "border-ash",
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
  tone = "steel",
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
