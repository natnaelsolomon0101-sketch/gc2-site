import { SCALE } from "@/content/site";

const fmtAsOf = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function Scale() {
  return (
    <section id="scale" className="border-b border-rule bg-band">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow">{SCALE.label}</p>
            <h2 className="display mt-7 text-[clamp(34px,4.4vw,58px)]">{SCALE.statement}</h2>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-14">
            <p className="max-w-[46ch] text-[17px] leading-[1.7] text-ink-70">{SCALE.support}</p>

            {SCALE.value ? (
              <div className="mt-12 border-t border-rule pt-10">
                <div className="display leading-[0.9] text-[clamp(64px,9vw,132px)]">
                  {SCALE.value}
                  {SCALE.unit && <span className="align-top text-[0.5em]">{SCALE.unit}</span>}
                </div>
                <p className="mt-4 text-[15px] text-ink-70">{SCALE.caption}</p>
                {SCALE.asOf && <p className="mt-1 text-[13px] text-ink-45">All figures as of {fmtAsOf(SCALE.asOf)}.</p>}
              </div>
            ) : (
              <dl className="mt-12 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3">
                {SCALE.facts.map((f) => (
                  <div key={f.k} className="bg-band px-6 py-7">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-ink-45">{f.k}</dt>
                    <dd className="mt-2 text-[16px] leading-snug">{f.v}</dd>
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
