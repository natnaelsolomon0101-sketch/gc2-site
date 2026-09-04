"use client";

import * as React from "react";

/**
 * CountRow — the 21st "Bold Stats" idea (18908) on the site's own facts. A
 * row of large serif numerals with mono captions; each numeral counts up
 * from zero the first time the row scrolls into view, over --dur-draw, on the
 * site's easing. Under reduced motion the finished values are simply there.
 *
 * NUMBERS ARE STRUCTURAL FACTS ONLY. Every value is derived from the site's
 * own content and config (how many strategies, stages, allocator pages, the
 * founding year). Nothing here is, or may become, a performance figure.
 */
export type Count = { value: number; label: string; pad?: number };

const DRAW_MS = 900; // --dur-draw; a literal because rAF cannot read a CSS var

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountRow({ items, className = "" }: { items: Count[]; className?: string }) {
  const ref = React.useRef<HTMLDListElement | null>(null);
  const [shown, setShown] = React.useState<number[]>(() => items.map((i) => i.value));
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver !== "function") return;
    setShown(items.map(() => 0));
    setArmed(true);
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const u = Math.min(1, (t - start) / DRAW_MS);
        const k = ease(u);
        setShown(items.map((i) => Math.round(i.value * k)));
        if (u < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [items]);

  const fmt = (n: number, pad?: number) => (pad ? String(n).padStart(pad, "0") : String(n));

  return (
    <dl ref={ref} className={`countrow ${className}`} data-armed={armed ? "true" : "false"}>
      {items.map((it, i) => (
        <div key={it.label} className="countrow-item">
          <dd className="countrow-value t-display-sm">
            <span aria-hidden="true">{fmt(shown[i], it.pad)}</span>
            <span className="sr-only">{fmt(it.value, it.pad)}</span>
          </dd>
          <dt className="countrow-label t-caption">{it.label}</dt>
        </div>
      ))}
    </dl>
  );
}
