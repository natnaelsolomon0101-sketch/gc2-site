"use client";
import { useEffect, useState } from "react";
import { FUND, NAV, NAV_CTA, CONTACT } from "@/content/site";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* hairline appears only after 8px of scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* body scroll lock + Escape to close */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-colors duration-200",
          "border-b",
          scrolled ? "border-line" : "border-transparent"
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <a
            href="#top"
            className="text-[17px] font-semibold tracking-[-0.01em] text-ink"
            aria-label={`${FUND.mark} home`}
          >
            {FUND.mark}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-[15px] text-muted transition-colors hover:text-ink"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-[12px] px-3 py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink"
            >
              Log in
            </a>
            <a href={NAV_CTA.href} className="btn btn-primary">
              {NAV_CTA.label}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-[10px] md:hidden"
          >
            <span
              className={cn(
                "block h-[1.5px] w-5 rounded-full bg-ink transition-transform duration-200",
                open && "translate-y-[3.25px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-5 rounded-full bg-ink transition-transform duration-200",
                open && "-translate-y-[3.25px] -rotate-45"
              )}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-white px-5 pb-10 pt-8 transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="t-h3 border-b border-line py-4 text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={NAV_CTA.href}
            onClick={() => setOpen(false)}
            className="btn btn-primary w-full"
          >
            {NAV_CTA.label}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            onClick={() => setOpen(false)}
            className="btn btn-ghost w-full"
          >
            Log in
          </a>
        </div>
      </div>
    </>
  );
}
