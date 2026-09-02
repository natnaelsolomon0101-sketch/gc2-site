import { STRATEGIES } from "@/content/site";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function Strategies() {
  return (
    <section id="strategies" className="border-b border-rule bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow">Strategies</p>
            <h2 className="display h-sec mt-7 max-w-[14ch]">Six mandates, one risk framework.</h2>
          </div>
          <p className="col-span-12 max-w-[44ch] text-[16px] leading-[1.7] text-ink-70 md:col-span-5 md:col-start-8">
            Each mandate is underwritten independently and sized against the same risk budget.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-16 border-t border-ink/85 md:mt-20">
          {STRATEGIES.map((s) => (
            <AccordionItem key={s.name} value={s.name}>
              <AccordionTrigger>
                <span className="display text-[24px] tracking-[-0.02em] md:text-[32px]">{s.name}</span>
                <span className="hidden text-[16px] leading-[1.6] text-ink-70 md:block">{s.summary}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-12">
                  <p className="col-span-12 max-w-[62ch] text-[17px] leading-[1.75] text-ink-70 md:col-span-6 md:col-start-6">
                    <span className="mb-3 block text-[16px] md:hidden">{s.summary}</span>
                    {s.detail}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
