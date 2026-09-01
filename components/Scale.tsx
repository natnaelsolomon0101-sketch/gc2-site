import { SCALE } from "@/content/site";

const fmtAsOf = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function Scale() {
  return (
    <section id="scale" className="bg-band">
      <div className="mx-auto max-w-[1280px] px-6 py-band md:px-10">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <p className="eyebrow">{SCALE.label}</p>
            <p className="display h-sub mt-7 max-w-[24ch]">{SCALE.statement}</p>
          </div>

          {/* One giant figure. Rendered server-side — never animates, never shows 0. */}
          {SCALE.value && (
            <div className="md:pl-10">
              <div className="display leading-[0.92] text-[clamp(72px,12vw,168px)]">
                {SCALE.value}
                {SCALE.unit && <span className="text-[0.5em] align-top">{SCALE.unit}</span>}
              </div>
              <p className="mt-5 text-[15px] text-ink-70">{SCALE.caption}</p>
              {SCALE.asOf && (
                <p className="mt-2 text-[13px] text-ink-45">All figures as of {fmtAsOf(SCALE.asOf)}.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
