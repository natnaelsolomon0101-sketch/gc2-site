"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { nav } from "@/config/nav";
import { site } from "@/config/site";

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const node = panel.current;
    const focusables = node?.querySelectorAll<HTMLElement>('a[href], button');
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !focusables?.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  return (
    <div
      ref={panel}
      id="mobile-nav"
      hidden={!open}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-paper md:hidden"
    >
      {nav.map((n) => (
        <Link key={n.href} href={n.href} onClick={onClose}
          className="t-nav-mobile text-black">
          {n.label}
        </Link>
      ))}
      <a href={`mailto:${site.emails.investors}`} className="t-small link link-block mt-6">
        {site.emails.investors}
      </a>
    </div>
  );
}
