import { HERO, FUND } from "@/content/site";
import Emphasis from "./Emphasis";
import Surface from "./Surface";

export default function Hero() {
  return (
    <section id="top" className="bg-paper-white">
      <div className="wrap pb-6 pt-6 md:pb-10 md:pt-8">
        {/* the hero is a soft card on the canvas, not a full-bleed band */}
        <div className="overflow-hidden rounded-[32px] bg-linen-cream md:rounded-[44px]">
          <div className="grid grid-cols-12 items-stretch">
            <div className="col-span-12 px-8 py-14 md:col-span-5 md:py-20 md:pl-14 md:pr-8 lg:pl-16">
              <p className="eyebrow">{FUND.mark} Portfolios</p>
              <h1 className="tiempos mt-5 text-[clamp(34px,3.8vw,52px)] leading-[1.1]">
                <Emphasis text={HERO.headline} word={HERO.emphasis} />
              </h1>
              <p className="mt-6 max-w-[38ch] text-[16px] leading-[1.5] text-pebble">
                {HERO.supporting}
                <sup className="ml-1 text-[11px]">{HERO.footnote}</sup>
              </p>
              <a href="#firm" aria-label="Read about the firm"
                 className="mt-10 flex h-12 w-12 items-center justify-center rounded-full border border-graphite-ink transition-colors hover:bg-graphite-ink hover:text-paper-white">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
            </div>

            {/* imagery bleeds to the card edge. Colour is permitted inside the
                artwork; the surrounding chrome stays monochrome. */}
            <div className="relative col-span-12 min-h-[300px] md:col-span-7 md:min-h-[520px]">
              <div className="absolute inset-0"
                   style={{ background: "linear-gradient(168deg,#e9e4dd 0%,#f2ece2 38%,#f7f1e6 68%,#faf8f5 100%)" }} />
              <Surface className="absolute inset-0 h-full w-full" lines={46} tone="#3a3525" opacity={0.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
