"use client";
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

export default function Reveal({
  children, as: Tag = "div", className = "", delay = 0,
}: { children: ReactNode; as?: ElementType; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSeen(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.unobserve(e.target); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`.trim()}
         style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
