import { FIRM } from "@/content/site";
import Emphasis from "./Emphasis";

export default function Firm() {
  return (
    <section id="firm" className="band border-t border-line bg-surface">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 md:gap-x-8">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow">{FIRM.label}</p>
            <h2 className="t-h2 mt-4 max-w-[16ch] text-ink [&_strong]:font-semibold [&_strong]:text-ink">
              <Emphasis text={FIRM.heading} word={FIRM.emphasis} />
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <div className="max-w-[68ch] space-y-5">
              {FIRM.body.map((p, i) => (
                <p key={i} className="t-body">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
