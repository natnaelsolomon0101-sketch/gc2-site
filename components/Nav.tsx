"use client";
import { useEffect, useState } from "react";
import { FUND, NAV, NAV_CTA, CONTACT } from "@/content/site";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <header className="relative z-50 bg-paper-white">
        {/* thin segmented top row */}
        <div className="border-b border-stone">
          <div className="wrap flex h-9 items-center gap-4 text-[13px] text-pebble">
            <span className="text-graphite-ink">Investors</span>
            <span className="text-stone">|</span>
            <a href="#insights" className="transition-colors hover:text-graphite-ink">Press</a>
          </div>
        </div>

        {/* main bar */}
        <div className="wrap flex h-[72px] items-center justify-between">
          <a href="#top" className="text-[18px] font-medium tracking-[.005em]" aria-label={`${FUND.mark} home`}>
            {FUND.mark}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-[16px] text-graphite-ink transition-opacity hover:opacity-65">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href={`mailto:${CONTACT.email}`} className="btn-out ws-label !py-3 !px-6">Log in</a>
            <a href={NAV_CTA.href} className="btn-fill ws-label !py-3 !px-6">Get started</a>
          </div>

          <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden">
            <span className={cn("block h-px w-5 bg-graphite-ink transition-transform", open && "translate-y-[3px] rotate-45")} />
            <span className={cn("block h-px w-5 bg-graphite-ink transition-transform", open && "-translate-y-[3px] -rotate-45")} />
          </button>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-paper-white px-6 transition-opacity duration-300 md:hidden",
                          open ? "opacity-100" : "pointer-events-none opacity-0")} hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="tiempos t-h py-3">{n.label}</a>
        ))}
        <a href={NAV_CTA.href} onClick={() => setOpen(false)} className="btn-fill ws-label mt-8 w-fit">Get started</a>
      </div>
    </>
  );
}
