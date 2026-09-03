import * as React from "react";
import styles from "./Tile.module.css";

/**
 * Tile — the chromatic island. The strongest visual idea on the site, and the
 * one most easily ruined.
 *
 * The foreground is NOT uniform across the six tones. White is legible on
 * exactly one of them:
 *
 *   iris        #847dff  on black   6.36:1     white would be  3.30:1
 *   cyan        #00b3dd  on black   8.49:1     white would be  2.47:1
 *   pale-iris   #d1c9ff  on black  13.51:1     white would be  1.55:1   <-- fails badly
 *   deep-iris   #4b49aa  on WHITE   7.41:1     black would be  2.83:1
 *   orchid      #dd90d8  on black   9.06:1     white would be  2.32:1
 *   periwinkle  #90b8f0  on black  10.30:1     white would be  2.04:1
 *
 * So the API takes ONE prop. There is no `foreground`, no `color`, no `bg`, no
 * `className` escape onto the surface colour. A caller picks a tone and the
 * pairing arrives with it; there is no call site at which the wrong foreground
 * can be supplied. `assertPairings()` below re-derives every ratio from the hex
 * values at module load and throws, failing the build, if an edit to this table
 * ever drops a pair under 4.5:1.
 */
export type TileTone =
  | "iris"
  | "cyan"
  | "paleIris"
  | "deepIris"
  | "orchid"
  | "periwinkle";

type TonePairing = {
  /** Token name of the surface. */
  readonly surface: string;
  readonly surfaceHex: string;
  /** Token name of the only legible foreground for this surface. */
  readonly foreground: string;
  readonly foregroundHex: string;
  /** Tailwind utilities. Written out in full so the class scanner sees them. */
  readonly className: string;
};

export const TILE_TONES: Readonly<Record<TileTone, TonePairing>> = Object.freeze({
  iris: {
    surface: "iris-gleam",
    surfaceHex: "#847dff",
    foreground: "void",
    foregroundHex: "#000000",
    className: "bg-iris-gleam text-void",
  },
  cyan: {
    surface: "cyan-signal",
    surfaceHex: "#00b3dd",
    foreground: "void",
    foregroundHex: "#000000",
    className: "bg-cyan-signal text-void",
  },
  paleIris: {
    surface: "pale-iris",
    surfaceHex: "#d1c9ff",
    foreground: "void",
    foregroundHex: "#000000",
    className: "bg-pale-iris text-void",
  },
  deepIris: {
    surface: "deep-iris",
    surfaceHex: "#4b49aa",
    foreground: "pure",
    foregroundHex: "#ffffff",
    className: "bg-deep-iris text-pure",
  },
  orchid: {
    surface: "orchid-bloom",
    surfaceHex: "#dd90d8",
    foreground: "void",
    foregroundHex: "#000000",
    className: "bg-orchid-bloom text-void",
  },
  periwinkle: {
    surface: "periwinkle",
    surfaceHex: "#90b8f0",
    foreground: "void",
    foregroundHex: "#000000",
    className: "bg-periwinkle text-void",
  },
} as const);

export const TILE_TONE_KEYS = Object.keys(TILE_TONES) as readonly TileTone[];

/* ---- the pairings are asserted, not asserted-to ------------------------- */

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG 2.1 relative luminance of a `#rrggbb` string. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

/** WCAG 2.1 contrast ratio between two `#rrggbb` strings. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Runs once at module load. If someone later edits TILE_TONES and pairs white
 * with pale-iris, the build fails here rather than shipping 1.55:1 text.
 */
function assertPairings(): void {
  for (const key of TILE_TONE_KEYS) {
    const t = TILE_TONES[key];
    const ratio = contrastRatio(t.surfaceHex, t.foregroundHex);
    if (ratio < 4.5) {
      throw new Error(
        `Tile tone "${key}" pairs ${t.foreground} (${t.foregroundHex}) with ` +
          `${t.surface} (${t.surfaceHex}) at ${ratio.toFixed(2)}:1. ` +
          `Every tile pairing must clear 4.5:1.`,
      );
    }
  }
}
assertPairings();

/* ---- component ---------------------------------------------------------- */

export type TilePadding = "none" | "md" | "lg";

const PADDING: Record<TilePadding, string> = {
  none: "",
  md: "p-6",
  lg: "p-8",
};

export type TileProps = {
  /** The only colour decision a caller makes. Foreground comes with it. */
  tone: TileTone;
  as?: "div" | "section" | "article" | "li" | "figure";
  padding?: TilePadding;
  /**
   * Layout and type utilities only. Colour utilities are overridden by the
   * tone pairing, which is applied last.
   */
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "color">;

export default function Tile({
  tone,
  as = "div",
  padding = "lg",
  className = "",
  children,
  ...rest
}: TileProps) {
  const pairing = TILE_TONES[tone];
  const cls = [
    "rounded-tile",
    PADDING[padding],
    className,
    styles.tile,
    // last, so a stray colour utility in `className` cannot win
    pairing.className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    as,
    { ...rest, "data-tone": tone, className: cls },
    children,
  );
}
