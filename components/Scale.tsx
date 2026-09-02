import { SCALE } from "@/content/site";

const fmtAsOf = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/**
 * Renders as a full-width pull statement while SCALE.value is null.
 * Set SCALE.value (+ unit, asOf) in content/site.ts and it becomes the
 * two-column statement + giant figure layout. No animation, ever — the
 * number is server-rendered so it can never display as 0.
 */
export default function Scale() {
  const hasFigure = Boolean(SCALE.value);

  return (
    <section id="scale" className="bg-band">
      <div className="mx-auto max-w-[1280px] px-6 py-band md:px-10">
        <p className="eyebrow">{SCALE.label}</p>

        {hasFigure ? (
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20">
            <p className="display h-sub max-w-[24ch]">{SCALE.statement}</p>
            <div className="md:pl-10">
              <div className="display leading-[0.92] text-[clamp(72px,12vw,168px)]">
                {SCALE.value}
                {SCALE.unit && <span className="align-top text-[0.5em]">{SCALE.unit}</span>}
              </div>
              <p className="mt-5 text-[15px] text-ink-70">{SCALE.caption}</p>
              {SCALE.asOf && (
                <p className="mt-2 text-[13px] text-ink-45">All figures as of {fmtAsOf(SCALE.asOf)}.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="display mt-10 max-w-[20ch] text-[clamp(34px,5.6vw,76px)] md:mt-14">
            {SCALE.statement}
          </p>
        )}
      </div>
    </section>
  );
}
