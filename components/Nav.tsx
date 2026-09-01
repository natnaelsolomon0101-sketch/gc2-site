"use client";
import { useEffect, useState } from "react";
import { FUND, NAV, NAV_CTA } from "@/content/site";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-16 bg-white/85 backdrop-blur-md transition-colors duration-300",
          scrolled ? "border-b border-rule" : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 md:px-10">
          <a href="#top" className="text-[19px] font-600 tracking-tight" aria-label={`${FUND.mark} home`}>
            <span className="font-semibold">{FUND.mark}</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}
                 className="text-[14px] text-ink-70 transition-colors hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>

          <a href={NAV_CTA.href}
             className="hidden rounded-none border border-ink px-5 py-2.5 text-[13px] tracking-wide transition-colors hover:bg-ink hover:text-white md:inline-flex">
            {NAV_CTA.label}
          </a>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className={cn("block h-px w-5 bg-ink transition-transform", open && "translate-y-[3px] rotate-45")} />
            <span className={cn("block h-px w-5 bg-ink transition-transform", open && "-translate-y-[3px] -rotate-45")} />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-white px-6 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        hidden={!open}
      >
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)}
             className="display h-sub py-3">{n.label}</a>
        ))}
        <a href={NAV_CTA.href} onClick={() => setOpen(false)}
           className="mt-6 inline-flex w-fit border border-ink px-6 py-3 text-[14px]">
          {NAV_CTA.label}
        </a>
      </div>
    </>
  );
}
