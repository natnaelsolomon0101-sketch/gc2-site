import { FIRM } from "@/content/site";
import Emphasis from "./Emphasis";
import Surface from "./Surface";

export default function Firm() {
  return (
    <section id="firm" className="border-b border-stone bg-paper-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 items-stretch">
        <div className="relative order-2 col-span-12 min-h-[38vh] bg-linen-cream md:order-1 md:col-span-5 md:min-h-[62vh]">
          <Surface className="absolute inset-0 h-full w-full" lines={26} tone="#111417" />
        </div>
        <div className="order-1 col-span-12 px-6 py-24 md:order-2 md:col-span-6 md:col-start-7 md:py-32 md:pl-4 md:pr-10 lg:pr-16">
          <p className="eyebrow">{FIRM.label}</p>
          <h2 className="tiempos t-h mt-7 max-w-[15ch]">
            <Emphasis text={FIRM.heading} word={FIRM.emphasis} />
          </h2>
          <div className="mt-10 max-w-[54ch] space-y-6">
            {FIRM.body.map((p, i) => (
              <p key={i} className="text-[17px] leading-[1.75] text-graphite-ink">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
