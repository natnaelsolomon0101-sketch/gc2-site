import { STRATEGIES } from "@/content/site";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Strategies() {
  return (
    <section id="strategies" className="band bg-white">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end md:gap-12">
          <div>
            <p className="eyebrow">Strategies</p>
            <h2 className="t-h2 mt-4 max-w-[16ch] text-balance">
              Six mandates, one risk framework.
            </h2>
          </div>
          <p className="t-body max-w-[46ch] md:pb-1">
            Each mandate is underwritten independently and sized against the
            same risk budget.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-12 border-t border-line md:mt-16"
        >
          {STRATEGIES.map((s) => (
            <AccordionItem key={s.name} value={s.name} className="border-line">
              <AccordionTrigger className="text-muted-2">
                <span className="t-h3 min-w-0 text-ink transition-colors group-hover:text-blue">
                  {s.name}
                </span>
                <span className="t-body hidden min-w-0 md:block">
                  {s.summary}
                </span>
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto]">
                  <div className="hidden md:block" aria-hidden />
                  <div className="min-w-0">
                    <p className="t-body mb-3 max-w-[62ch] md:hidden">
                      {s.summary}
                    </p>
                    <p className="t-body max-w-[62ch] text-ink">{s.detail}</p>
                  </div>
                  <span className="hidden w-4 md:block" aria-hidden />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
