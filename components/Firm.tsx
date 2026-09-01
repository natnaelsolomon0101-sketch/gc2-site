import { FIRM } from "@/content/site";
import Emphasis from "./Emphasis";

export default function Firm() {
  return (
    <section id="firm" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-band md:px-10">
        <p className="eyebrow">{FIRM.label}</p>
        <h2 className="display h-sec mt-7 max-w-[18ch]">
          <Emphasis text={FIRM.heading} word={FIRM.emphasis} />
        </h2>
        <div className="mt-12 max-w-[70ch] space-y-6 md:mt-16">
          {FIRM.body.map((p, i) => (
            <p key={i} className="text-[17px] leading-[1.7] text-ink-70">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
