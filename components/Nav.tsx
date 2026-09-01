"use client";
import { useEffect, useState } from "react";
import { FUND, NAV, CONTACT } from "@/content/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("is-locked"); window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled && !open ? "scrolled" : ""}`}>
        <div className="wrap nav-in">
          <a href="#top" className="mark" aria-label={`${FUND.mark} home`}><b>{FUND.mark}</b></a>
          <nav className="nav-links" aria-label="Primary">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <a className="nav-cta" href={`mailto:${CONTACT.email}`}>Investor enquiries</a>
          <button className={`burger ${open ? "open" : ""}`} onClick={() => setOpen(!open)}
                  aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div id="menu" className={`sheet ${open ? "open" : ""}`} hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
        ))}
        <div className="sheet-meta">{CONTACT.email}</div>
      </div>
    </>
  );
}
