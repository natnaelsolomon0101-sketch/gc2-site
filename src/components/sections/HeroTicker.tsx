"use client";
import Link from "next/link";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { site } from "@/config/site";
import { strategies } from "@/content/strategies";
import Atmosphere from "@/components/sections/Atmosphere";

/**
 * Hero built on the 21st "hero-section-5" structure, adapted.
 *
 * Two things from the original were deliberately NOT carried over:
 *
 * 1. The logo wall (Nvidia / Stripe / GitHub / Nike / Figma / Vercel under
 *    "Powering the best teams"). Those are not this firm's clients, and on a
 *    real fund's site that is a false claim about business relationships. The
 *    slider instead carries the markets and instruments the six strategies
 *    actually trade, read from src/content/strategies.ts.
 *
 * 2. The DNA video on a third-party CDN. No market footage exists for this
 *    firm and none may be invented, so the backdrop is the generative
 *    Atmosphere layer already in the codebase.
 */

// Every token below is derived from the six real strategies. Nothing invented.
const titleCase = (s: string) =>
  s.length ? s[0].toUpperCase() + s.slice(1) : s;

// Splitting the comma lists yields mixed case and near-duplicates
// ("equity index" vs "Equity index"), so dedupe case-insensitively first,
// then title-case once for a consistent ticker.
const marketTerms = Array.from(
  new Map(
    strategies
      .flatMap((s) => [
        ...s.markets.split(","),
        ...s.instruments.split(","),
      ])
      .map((raw) => raw.trim())
      .filter(Boolean)
      .map((term) => [term.toLowerCase(), titleCase(term)]),
  ).values(),
);

export default function HeroTicker() {
  return (
    <section className="relative isolate overflow-hidden">
      <Atmosphere />

      <div className="relative z-10 pb-24 pt-28 md:pb-28 lg:pb-32 lg:pt-40">
        <div className="wrap">
          <div className="max-w-3xl">
            <p className="t-mono text-fog">{site.city}</p>
            <h1 className="t-display mt-6 text-pure">Evidence first. Then capital.</h1>
            <p className="t-sub mt-8 max-w-xl text-ash">
              {site.name} runs concentrated, systematic strategies across liquid global
              markets, underwritten by our own research and a single risk framework.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/firm" className="btn">Our approach</Link>
              <Link href="/contact" className="btn btn-ghost">Investor inquiries</Link>
            </div>
          </div>
        </div>
      </div>

      {/* The markets actually traded, on the original's slider mechanics. */}
      <div className="relative z-10 border-t border-steel/60 pb-2">
        <div className="wrap group relative">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="shrink-0 md:max-w-44 md:border-r md:border-steel/60 md:pr-6">
              <p className="t-mono text-fog md:text-end">Markets we trade</p>
            </div>
            <div className="relative w-full py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider durationOnHover={90} duration={45} gap={64}>
                {marketTerms.map((term) => (
                  <span key={term} className="t-small whitespace-nowrap text-ash">
                    {term}
                  </span>
                ))}
              </InfiniteSlider>
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left" blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right" blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
