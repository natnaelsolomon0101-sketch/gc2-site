import { TICKER } from "@/content/site";

/** Thin monochrome strip above the footer. Decorative — hidden from AT. */
export default function Ticker() {
  return (
    <div aria-hidden className="overflow-hidden border-y border-graphite bg-obsidian">
      <div className="flex w-max animate-[gc2Ticker_60s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((set) => (
          <div className="flex shrink-0" key={set}>
            {TICKER.map((t) => (
              <div key={`${set}-${t.symbol}`} className="flex items-baseline gap-2.5 whitespace-nowrap px-7 py-3.5">
                <span className="text-[12px] font-medium tracking-[0.06em] text-bone">{t.symbol}</span>
                <span className="text-[11px] uppercase tracking-[0.12em] text-fog">{t.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
