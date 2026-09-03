import * as React from "react";
import { site } from "@/config/site";
import { strategies } from "@/content/strategies";

/**
 * Stat — a label/value pair, and a closed door.
 *
 * GC2 is a real fund. No return, AUM, Sharpe ratio, drawdown, percentage or
 * dollar figure may appear anywhere on this site. The usual shape of a stat
 * component makes that a matter of discipline:
 *
 *     <Stat label="YTD" value="+18.4%" />        // nothing stops this
 *
 * So this component does not accept a value. It accepts a KEY into the
 * registry below, and every entry in that registry is derived from
 * `src/config/site.ts` or `src/content/strategies.ts` — the two files that hold
 * the firm's real structural facts. There is no prop through which a figure can
 * be introduced, and no string in this file that a designer typed from memory.
 *
 *     <Stat fact="founded" />                    // -> Founded / September 2026
 *
 * `assertNoFigures()` runs at module load and throws — failing the build — if a
 * future edit puts a percentage, a currency amount, or a performance word into
 * the registry.
 *
 * Rejected outright: 21st's "Number Ticker Real-Time Metrics Counter" (id
 * 21515). A counter that animates a large number upward with a live pulse dot
 * is the exact pattern this component exists to prevent. On a fund site an
 * animated rising figure reads as performance whatever the caption says, and
 * the "real-time" pulse implies a data feed that does not exist. See
 * docs/21st/HARVEST.md.
 *
 * Contrast (WCAG 2.1, sRGB):
 *   label ash #9f9fa0 on obsidian #0f1011 ..... 7.20:1
 *   label ash on graphite #2e2e2e ............. 5.14:1
 *   value cloud #f5f5f7 on obsidian ........... 17.49:1
 *   value cloud on graphite ................... 12.47:1
 *   inherit tone on any Tile .................. the tile's own 6.36:1+
 */

const COUNT_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
] as const;

function spell(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

/** Flattens the comma lists on the strategy records, case-insensitively. */
function collect(field: "markets" | "instruments"): string {
  const seen = new Map<string, string>();
  for (const s of strategies) {
    for (const part of s[field].split(",")) {
      const term = part.trim();
      if (!term) continue;
      const key = term.toLowerCase();
      if (!seen.has(key)) seen.set(key, term);
    }
  }
  return Array.from(seen.values()).join(", ");
}

type Fact = { readonly label: string; readonly value: string };

/**
 * The complete set of facts this site is allowed to state as a figure. Every
 * value is read from source, never written here.
 */
export const STRUCTURAL_FACTS = Object.freeze({
  founded: { label: "Founded", value: site.foundedLabel },
  base: { label: "Base", value: site.city },
  structure: { label: "Structure", value: site.structure },
  mandate: { label: "Mandate", value: site.mandate },
  strategies: { label: "Strategies", value: spell(strategies.length) },
  markets: { label: "Markets", value: collect("markets") },
  instruments: { label: "Instruments", value: collect("instruments") },
}) satisfies Readonly<Record<string, Fact>>;

export type StatFact = keyof typeof STRUCTURAL_FACTS;

export const STAT_FACT_KEYS = Object.keys(STRUCTURAL_FACTS) as readonly StatFact[];

/* ---- the guard ---------------------------------------------------------- */

const BANNED = [
  /[%$£€]/,
  /\bAUM\b/i,
  /\bsharpe\b/i,
  /\breturns?\b/i,
  /\bdrawdown/i,
  /\bCAGR\b/i,
  /\bIRR\b/i,
  /\bbps\b/i,
  /\balpha\b/i,
  /\byield\b/i,
  /\bperformance\b/i,
  /\b(million|billion|trillion)\b/i,
  /\d\s*x\b/i,
  /[+-]\s*\d/,
];

function assertNoFigures(): void {
  for (const key of STAT_FACT_KEYS) {
    const { label, value } = STRUCTURAL_FACTS[key];
    for (const text of [label, value]) {
      for (const rule of BANNED) {
        if (rule.test(text)) {
          throw new Error(
            `Stat fact "${key}" contains a performance figure: ${JSON.stringify(text)} ` +
              `matched ${rule}. This site states structural facts only — no returns, ` +
              `AUM, Sharpe, drawdowns, percentages or dollar figures.`,
          );
        }
      }
    }
  }
}
assertNoFigures();

/* ---- component ---------------------------------------------------------- */

export type StatSize = "sm" | "lg";
export type StatTone = "dark" | "inherit";

const VALUE_SIZE: Record<StatSize, string> = {
  sm: "text-lg leading-tight",
  lg: "t-heading-sm",
};

export type StatProps = {
  /** The only content prop. Values come from STRUCTURAL_FACTS. */
  fact: StatFact;
  size?: StatSize;
  /** `inherit` for use inside a Tile, where the foreground is the tile's. */
  tone?: StatTone;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children">;

export default function Stat({
  fact,
  size = "lg",
  tone = "dark",
  className = "",
  ...rest
}: StatProps) {
  const { label, value } = STRUCTURAL_FACTS[fact];
  const labelTone = tone === "inherit" ? "text-inherit" : "text-ash";
  const valueTone = tone === "inherit" ? "text-inherit" : "text-cloud";

  return (
    <div
      {...rest}
      className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}
    >
      <span className={`t-mono-xs ${labelTone}`}>{label}</span>
      <span className={`font-ui font-light ${VALUE_SIZE[size]} ${valueTone}`}>
        {value}
      </span>
    </div>
  );
}
