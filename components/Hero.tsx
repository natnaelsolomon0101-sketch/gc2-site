import { HERO, FUND, SCALE, NAV_CTA, NAV } from "@/content/site";
import Emphasis from "./Emphasis";
import Surface from "./Surface";

/**
 * Mercury hero — white canvas, left-weighted type, one blue accent on the
 * eyebrow. The right column is a restrained product card: a bordered white
 * shell around an abstract line field, closed by a three-fact spec row.
 */
export default function Hero() {
  const secondary = NAV.find((n) => n.href === "#strategies") ?? NAV[1];

  return (
    <section id="top" className="bg-white">
      <div className="wrap pb-16 pt-[104px] md:pb-24 md:pt-[136px] lg:pt-[152px]">
        <div className="grid grid-cols-12 items-center gap-x-8 gap-y-14">
          {/* ---- copy ------------------------------------------------- */}
          <div className="col-span-12 min-w-0 lg:col-span-6">
            <p className="eyebrow">
              {FUND.city}, {FUND.state} &middot; {FUND.kind}
            </p>

            <h1 className="t-display mt-5 max-w-[15ch] text-ink [&_strong]:font-semibold">
              <Emphasis text={HERO.headline} word={HERO.emphasis} />
            </h1>

            <p className="t-lede mt-6 max-w-[46ch]">
              {HERO.supporting}
              <sup className="ml-0.5 align-super text-[11px] text-muted">{HERO.footnote}</sup>
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={NAV_CTA.href} className="btn btn-primary">
                {NAV_CTA.label}
              </a>
              <a href={secondary.href} className="btn btn-ghost">
                {secondary.label}
              </a>
            </div>

            <p className="mt-8 max-w-[52ch] text-[12px] leading-[1.5] text-muted">
              <sup className="mr-1 align-super">{HERO.footnote}</sup>
              {HERO.footnoteText}
            </p>
          </div>

          {/* ---- product card ----------------------------------------- */}
          <div className="col-span-12 min-w-0 lg:col-span-6">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
                <span className="text-[13px] font-medium tracking-[-0.01em] text-ink">
                  {FUND.mark}
                </span>
                <span className="text-[12px] text-muted">{SCALE.label}</span>
              </div>

              <div className="relative aspect-[16/11] bg-surface text-ink">
                <Surface
                  className="absolute inset-0 h-full w-full"
                  lines={44}
                  tone="currentColor"
                  opacity={0.45}
                />
                <p className="absolute left-5 top-5 max-w-[22ch] text-[13px] leading-[1.4] font-medium text-ink">
                  {SCALE.statement}
                </p>
              </div>

              <dl className="grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {SCALE.facts.map((f) => (
                  <div key={f.k} className="min-w-0 px-5 py-4">
                    <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                      {f.k}
                    </dt>
                    <dd className="mt-1 text-[13px] leading-[1.4] text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
