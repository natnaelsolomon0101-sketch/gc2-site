import { SCALE } from "@/content/site";

const fmtAsOf = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function Scale() {
  return (
    <section id="scale" className="border-b border-stone bg-linen-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow">{SCALE.label}</p>
            <h2 className="tiempos mt-7 text-[clamp(34px,4.4vw,58px)]">{SCALE.statement}</h2>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-14">
            <p className="max-w-[46ch] text-[17px] leading-[1.7] text-graphite-ink">{SCALE.support}</p>

            {SCALE.value ? (
              <div className="mt-12 border-t border-stone pt-10">
                <div className="tiempos leading-[0.9] text-[clamp(64px,9vw,132px)]">
                  {SCALE.value}
                  {SCALE.unit && <span className="align-top text-[0.5em]">{SCALE.unit}</span>}
                </div>
                <p className="mt-6 text-[14px] text-pebble">{SCALE.caption}</p>
                {SCALE.asOf && <p className="mt-1 text-[13px] text-pebble">All figures as of {fmtAsOf(SCALE.asOf)}.</p>}
              </div>
            ) : (
              <dl className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-3">
                {SCALE.facts.map((f) => (
                  <div key={f.k} className="rule-top pt-5">
                    <dt className="text-[14px] text-pebble">{f.k}</dt>
                    <dd className="mt-2 text-[18px] font-medium leading-[1.3]">{f.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
