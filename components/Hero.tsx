import { HERO } from "@/content/site";
import Emphasis from "./Emphasis";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[90vh] items-center overflow-hidden bg-white">
      {/* very subtle slow-moving abstract gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="gc2-drift absolute -left-[15%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.55]
                        bg-[radial-gradient(circle_at_50%_50%,#E8EFEB_0%,rgba(232,239,235,0)_68%)]" />
        <div className="gc2-drift-2 absolute right-[-20%] bottom-[-25%] h-[75vh] w-[65vw] rounded-full opacity-[0.5]
                        bg-[radial-gradient(circle_at_50%_50%,#F1EFE9_0%,rgba(241,239,233,0)_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10">
        <h1 className="display h-hero max-w-[17ch]">
          <Emphasis text={HERO.headline} word={HERO.emphasis} />
        </h1>
        <p className="body-copy mt-8 text-[17px] md:mt-10 md:text-[18px]">
          {HERO.supporting}
          <sup className="ml-1 text-[11px] text-ink-45">{HERO.footnote}</sup>
        </p>
      </div>
    </section>
  );
}
