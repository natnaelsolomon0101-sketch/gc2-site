"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { nav } from "@/config/nav";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50" style={{ backdropFilter: "blur(24px)" }}>
        <div className="wrap flex items-center justify-between" style={{ height: "var(--nav-h)" }}>
          <Link href="/" aria-label={`${site.mark} home`}
                className="t-wordmark text-pure inline-flex min-h-11 min-w-11 items-center">
            {site.mark}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-3 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="nav-glass"
                    aria-current={pathname === n.href ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
            <Link href="/contact" className="btn">Investor inquiries</Link>
          </nav>

          <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}
                  aria-controls="m-nav" aria-label={open ? "Close menu" : "Open menu"}
                  className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden">
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
              {open
                ? <><path d="M2 2l18 10" stroke="#fff" strokeWidth="1.5"/><path d="M2 12L20 2" stroke="#fff" strokeWidth="1.5"/></>
                : <><path d="M0 3h22" stroke="#fff" strokeWidth="1.5"/><path d="M0 11h22" stroke="#fff" strokeWidth="1.5"/></>}
            </svg>
          </button>
        </div>
      </header>

      <div id="m-nav" hidden={!open}
           className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-obsidian md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="t-display-sm">
            {n.label}
          </Link>
        ))}
        <Link href="/contact" onClick={() => setOpen(false)} className="btn mt-4">Investor inquiries</Link>
      </div>
    </>
  );
}
