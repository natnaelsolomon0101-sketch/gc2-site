import { HERO, FUND } from "@/content/site";
import Emphasis from "./Emphasis";
import Surface from "./Surface";

export default function Hero() {
  return (
    <section id="top" className="on-bronze relative overflow-hidden bg-bronze-field text-paper-white">
      <div className="wrap relative grid grid-cols-12 items-center gap-y-14 py-20 md:py-28 lg:py-32">
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <p className="eyebrow text-paper-white/70">{FUND.city}, {FUND.state}</p>
          <h1 className="tiempos t-display mt-4 text-paper-white">
            <Emphasis text={HERO.headline} word={HERO.emphasis} />
          </h1>
          <p className="t-lede mt-6 max-w-[44ch] text-paper-white/80">
            {HERO.supporting}
            <sup className="ml-1 text-[11px] text-paper-white/60">{HERO.footnote}</sup>
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="btn-fill ws-label">Get started</a>
            <a href="#firm" className="btn-out btn-out-light ws-label">Learn more</a>
          </div>
        </div>

        {/* sculptural form, gallery-lit, never cropped by text */}
        <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[100px] md:aspect-[5/4]">
            <Surface className="absolute inset-0 h-full w-full" lines={44} tone="#faf8f5" opacity={0.9} />
          </div>
        </div>
      </div>
    </section>
  );
}
