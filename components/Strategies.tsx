import { STRATEGIES } from "@/content/site";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function Strategies() {
  return (
    <section id="strategies" className="bg-band">
      <div className="mx-auto max-w-[1280px] px-6 py-band md:px-10">
        <p className="eyebrow">Strategies</p>
        <h2 className="display h-sec mt-7 max-w-[16ch]">Six mandates, one risk framework.</h2>

        <Accordion type="single" collapsible className="mt-14 border-t border-rule md:mt-20">
          {STRATEGIES.map((s) => (
            <AccordionItem key={s.name} value={s.name}>
              <AccordionTrigger>
                <span className="display text-[22px] tracking-[-0.02em] md:text-[28px]">{s.name}</span>
                <span className="hidden text-[15px] text-ink-70 md:block">{s.summary}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[70ch] text-[16px] leading-[1.7] text-ink-70">
                  <span className="mb-3 block text-[15px] md:hidden">{s.summary}</span>
                  {s.detail}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
