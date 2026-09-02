"use client";
import { useEffect, useState } from "react";
import { FUND, NAV, NAV_CTA } from "@/content/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
      <header className={cn(
        "fixed inset-x-0 top-0 z-50 h-[68px] transition-colors duration-300",
        scrolled ? "border-b border-graphite bg-obsidian/92 backdrop-blur-md" : "border-b border-transparent"
      )}>
        <div className="wrap flex h-full items-center justify-between">
          <a href="#top" className="ivy text-[22px]" aria-label={`${FUND.mark} home`}>{FUND.mark}</a>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}
                 className="rounded-[2px] px-[10px] py-[6px] text-[14px] text-fog transition-colors hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a href="#contact" className="px-[10px] py-[6px] text-[14px] text-fog transition-colors hover:text-white">Sign in</a>
            <a href={NAV_CTA.href} className={buttonVariants({ variant: "primary", size: "md" })}>{NAV_CTA.label}</a>
          </div>

          <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden">
            <span className={cn("block h-px w-5 bg-white transition-transform", open && "translate-y-[3px] rotate-45")} />
            <span className={cn("block h-px w-5 bg-white transition-transform", open && "-translate-y-[3px] -rotate-45")} />
          </button>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-obsidian px-6 transition-opacity duration-300 md:hidden",
                          open ? "opacity-100" : "pointer-events-none opacity-0")} hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="ivy t-h-sm py-3">{n.label}</a>
        ))}
        <a href={NAV_CTA.href} onClick={() => setOpen(false)}
           className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-8 w-fit")}>{NAV_CTA.label}</a>
      </div>
    </>
  );
}
