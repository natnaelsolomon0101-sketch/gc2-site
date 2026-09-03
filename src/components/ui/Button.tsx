import * as React from "react";

/**
 * Button — two variants only.
 *
 *   filled : ink fill, ground label. The single primary action — the same
 *            object `.btn` names in globals.css.
 *   text   : label-weight action. Same 44px target, no fill until hover.
 *
 * 8px radius (`--radius-control`). No pills, no shadows, no gradients, no icon
 * slots — an icon library is a banned dependency on this project.
 *
 * Contrast (WCAG 2.1, sRGB; see DESIGN.md "Measured — ink on every ground"
 * and "Controls"):
 *   filled  ground on ink .......................... 17.04:1
 *   filled  ground on ink-2 (hover) ................. 7.55:1
 *   filled  ground on ink-3 (active) ................ 5.61:1
 *   text    ink on ground ........................... 17.04:1
 *   focus   ink ring on ground ...................... 17.04:1
 *
 * The focus ring is `ink`, never a chromatic colour: a chromatic ring against
 * paper is not guaranteed to clear the 3:1 non-text minimum at every accent.
 */
export type ButtonVariant = "filled" | "text";

const BASE =
  "inline-flex min-h-11 select-none items-center justify-center gap-2.5 " +
  "rounded-control font-ui text-base font-normal leading-none no-underline " +
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  filled: "bg-ink px-5 text-ground hover:bg-ink-2 active:bg-ink-3",
  text: "bg-transparent px-3 text-ink hover:bg-ink/10 active:bg-ink/15",
};

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type AsButton = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AsLink = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = AsButton | AsLink;

export default function Button(props: ButtonProps) {
  const { variant = "filled", className = "", children, ...rest } = props;
  const cls = `${BASE} ${VARIANTS[variant]}${className ? ` ${className}` : ""}`;

  if (typeof (rest as AsLink).href === "string") {
    const anchor = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchor} className={cls}>
        {children}
      </a>
    );
  }

  const button = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...button} type={button.type ?? "button"} className={cls}>
      {children}
    </button>
  );
}
