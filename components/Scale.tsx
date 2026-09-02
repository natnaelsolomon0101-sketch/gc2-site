import { SCALE } from "@/content/site";

/** Server-side only. The figure is printed as text — never counted up, never 0. */
const fmtAsOf = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function Scale() {
  const hasFigure = Boolean(SCALE.value);

  return (
    <section id="scale" className="band border-t border-line bg-white">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 md:gap-x-8">
          {/* Statement + support */}
          <div className={hasFigure ? "col-span-12 md:col-span-6" : "col-span-12 md:col-span-8"}>
            <p className="eyebrow">{SCALE.label}</p>
            <h2 className="t-h2 mt-4 max-w-[18ch] text-ink">{SCALE.statement}</h2>
            <p className="t-body mt-6 max-w-[52ch]">{SCALE.support}</p>
          </div>

          {/* Headline figure */}
          {hasFigure && (
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <div className="card-soft px-6 py-8 sm:px-8 sm:py-10">
                <div className="flex items-start gap-1 text-ink">
                  <span className="block text-[clamp(64px,12vw,116px)] font-medium leading-[0.9] tracking-[-0.04em] tabular-nums">
                    {SCALE.value}
                  </span>
                  {SCALE.unit && (
                    <span
                      aria-hidden="true"
                      className="mt-[0.18em] block text-[clamp(26px,4.6vw,44px)] font-medium leading-none tracking-[-0.03em] text-blue"
                    >
                      {SCALE.unit}
                    </span>
                  )}
                </div>
                <p className="t-cap mt-6 border-t border-line pt-4 text-ink">{SCALE.caption}</p>
                {SCALE.asOf && (
                  <p className="t-cap mt-1">All figures as of {fmtAsOf(SCALE.asOf)}.</p>
                )}
              </div>
            </div>
          )}

          {/* Facts — hairline-topped columns */}
          <dl className="col-span-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 md:gap-x-8">
            {SCALE.facts.map((f) => (
              <div key={f.k} className="border-t border-line pt-5">
                <dt className="t-cap">{f.k}</dt>
                <dd className="t-h3 mt-2 text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
