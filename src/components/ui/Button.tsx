import * as React from "react";

/**
 * Button — two variants only.
 *
 *   filled : white fill, black label. The single primary action.
 *   text   : label-weight action. Same 44px target, no fill until hover.
 *
 * 8px radius (`--radius-control`). No pills, no shadows, no gradients, no icon
 * slots — an icon library is a banned dependency on this project.
 *
 * Contrast (WCAG 2.1, sRGB, measured in-browser):
 *   filled  void #000000 on pure #ffffff .......... 21.00:1
 *   filled  void on cloud #f5f5f7 (hover) ......... 19.05:1
 *   text    cloud #f5f5f7 on obsidian #0f1011 ..... 17.49:1
 *   text    cloud on graphite #2e2e2e ............. 12.47:1
 *   focus   cloud ring on obsidian ................ 17.49:1
 *
 * The focus ring is `cloud`, never a chromatic or dark colour: a dark ring on a
 * near-black ground measures under 2:1 and is effectively invisible.
 */
export type ButtonVariant = "filled" | "text";

const BASE =
  "inline-flex min-h-11 select-none items-center justify-center gap-2.5 " +
  "rounded-control font-ui text-base font-normal leading-none no-underline " +
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cloud " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  filled: "bg-pure px-5 text-void hover:bg-cloud active:bg-silver",
  text: "bg-transparent px-3 text-cloud hover:bg-pure/10 hover:text-pure active:bg-pure/15",
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
