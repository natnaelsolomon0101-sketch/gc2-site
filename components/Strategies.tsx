"use client";
import { useState } from "react";
import { STRATEGIES } from "@/content/site";
import { cn } from "@/lib/utils";

export default function Strategies() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="strategies" className="bg-band">
      <div className="mx-auto max-w-[1280px] px-6 py-band md:px-10">
        <p className="eyebrow">Strategies</p>
        <h2 className="display h-sec mt-7 max-w-[16ch]">Six mandates, one risk framework.</h2>

        <div className="mt-14 border-t border-rule md:mt-20">
          {STRATEGIES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.name} className="border-b border-rule">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-6 py-9 text-left md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] md:py-11"
                >
                  <span className="display text-[22px] tracking-[-0.02em] md:text-[28px]">{s.name}</span>
                  <span className="hidden text-[15px] text-ink-70 md:block">{s.summary}</span>
                  <span className={cn("justify-self-end text-ink-45 transition-transform duration-300", isOpen && "rotate-45")}>
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </span>
                </button>
                <div className={cn("grid transition-all duration-500 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <p className="max-w-[70ch] pb-10 text-[16px] leading-[1.7] text-ink-70 md:pb-12">
                      <span className="mb-3 block text-[15px] text-ink-70 md:hidden">{s.summary}</span>
                      {s.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
