"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "./Wordmark";
import MobileNav from "./MobileNav";
import { nav } from "@/config/nav";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`nav-frame sticky top-0 z-40 bg-paper ${scrolled ? "border-b border-hairline" : "border-b border-transparent"}`}
      >
        <div className="container-gc2 flex h-full items-center justify-between">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((n) => {
              const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
              return (
                <Link key={n.href} href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`t-small inline-flex min-h-11 items-center font-medium ${active ? "nav-active text-black" : "text-ink"}`}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn">Investor inquiries</Link>
          </nav>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
              {open ? (
                <>
                  <path d="M2 2l18 10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 12L20 2" stroke="currentColor" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <path d="M0 3h22" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M0 11h22" stroke="currentColor" strokeWidth="1.5" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      <MobileNav open={open} onClose={() => { setOpen(false); burgerRef.current?.focus(); }} />
    </>
  );
}
