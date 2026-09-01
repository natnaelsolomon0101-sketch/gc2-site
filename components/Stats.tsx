"use client";
import { useEffect, useRef, useState } from "react";
import { STATS } from "@/content/site";

function useCountOnce(target: number, decimals: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fired.current = true; setN(target); return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || fired.current) return;
      fired.current = true;                 // fire exactly once
      io.unobserve(e.target);
      const dur = 1500, t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(target * eased);
        if (p < 1) requestAnimationFrame(step); else setN(target);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals]);

  return { ref, n };
}

function Stat({ s }: { s: (typeof STATS)[number] }) {
  const decimals = s.decimals ?? 0;
  const { ref, n } = useCountOnce(s.value, decimals);
  return (
    <div className="stat" ref={ref}>
      <div className="stat-n">
        {s.prefix ?? ""}{n.toFixed(decimals)}{s.suffix ?? ""}
      </div>
      <div className="stat-l">{s.label}</div>
      <div className="stat-note">{s.note}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="stats" aria-label="Fund at a glance">
      <div className="wrap stats-grid">
        {STATS.map((s) => <Stat key={s.label} s={s} />)}
      </div>
    </section>
  );
}
