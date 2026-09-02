import { HERO, FUND } from "@/content/site";
import Emphasis from "./Emphasis";
import Surface from "./Surface";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-graphite bg-obsidian">
      <div className="mx-auto grid min-h-[88vh] max-w-[1216px] grid-cols-12 items-stretch">
        {/* type column */}
        <div className="col-span-12 flex flex-col justify-center px-6 pb-16 pt-32 md:col-span-7 md:px-10 md:pb-20 md:pt-36 lg:col-span-6 lg:pl-16">
          <p className="eyebrow">{FUND.city}, {FUND.state}</p>
          <h1 className="ivy t-display mt-8 max-w-[13ch]">
            <Emphasis text={HERO.headline} word={HERO.emphasis} />
          </h1>
          <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.7] text-mist md:mt-10">
            {HERO.supporting}
            <sup className="ml-1 text-[11px] text-fog">{HERO.footnote}</sup>
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-graphite pt-7 md:mt-16">
            {[["Mandate", "Liquid markets"], ["Structure", "Private partnership"], ["Strategies", "Six"]].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] uppercase tracking-[0.16em] text-fog">{k}</div>
                <div className="mt-1 text-[15px]">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* full-bleed visual anchor */}
        <div className="relative col-span-12 min-h-[46vh] bg-onyx md:col-span-5 md:min-h-0 lg:col-span-6">
          <Surface className="absolute inset-0 h-full w-full" lines={38} />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent md:w-2/5" />
        </div>
      </div>
    </section>
  );
}
