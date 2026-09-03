"use client";
import { useEffect, useRef, useState } from "react";
import { strategies } from "@/content/strategies";

/**
 * The pinned scroll section. A tall track holds a sticky panel; scroll progress
 * through the track selects which strategy is shown. CSS sticky + one scroll
 * listener — no GSAP, no new dependency.
 *
 * Tile text colour is NOT the spec's "white or near-white": five of the six
 * chromatic backgrounds fail WCAG AA against white (pale-iris is 1.55:1).
 * Black clears 4.5 on all five; deep-iris is the one that takes white.
 */
const tiles = [
  { bg: "#847dff", fg: "#000000" }, // iris gleam
  { bg: "#00b3dd", fg: "#000000" }, // cyan signal
  { bg: "#d1c9ff", fg: "#000000" }, // pale iris
  { bg: "#4b49aa", fg: "#ffffff" }, // deep iris — the only one white passes on
  { bg: "#dd90d8", fg: "#000000" }, // orchid bloom
  { bg: "#90b8f0", fg: "#000000" }, // periwinkle
];

export default function PinnedStrategies() {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = track.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        if (total <= 0) return;
        const p = Math.min(Math.max(-r.top / total, 0), 0.9999);
        setI(Math.floor(p * strategies.length));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  const active = strategies[i] ?? strategies[0];
  const tile = tiles[i] ?? tiles[0];

  return (
    <section id="strategies-pin" aria-label="Strategies">
      {/* the track: one viewport of scroll per strategy */}
      <div ref={track} style={{ height: `${strategies.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="wrap w-full">
            <p className="t-mono">Strategies</p>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <h2 className="t-display-sm">Six strategies. One risk framework.</h2>
                <ol className="mt-10 space-y-3">
                  {strategies.map((s, k) => (
                    <li key={s.slug}>
                      <span className={`t-small transition-colors duration-200 ${k === i ? "text-pure" : "text-fog"}`}>
                        {s.name}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="md:col-span-6 md:col-start-7">
                <div className="tile transition-colors duration-500"
                     style={{ background: tile.bg, color: tile.fg, minHeight: 340 }}>
                  <p className="t-mono" style={{ color: tile.fg, opacity: .75 }}>
                    {String(i + 1).padStart(2, "0")} / {String(strategies.length).padStart(2, "0")}
                  </p>
                  <h3 className="t-heading-lg mt-6" style={{ color: tile.fg }}>{active.name}</h3>
                  <p className="t-sub mt-5" style={{ color: tile.fg, opacity: .9 }}>{active.oneLiner}</p>
                  <p className="t-small mt-8" style={{ color: tile.fg, opacity: .8 }}>
                    {active.markets} &nbsp;&middot;&nbsp; {active.instruments}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* reduced-motion / no-JS fallback: every tile, stacked, nothing pinned */}
      <noscript>
        <div className="wrap band grid gap-6 md:grid-cols-2">
          {strategies.map((s, k) => (
            <div key={s.slug} className="tile" style={{ background: tiles[k].bg, color: tiles[k].fg }}>
              <h3 className="t-heading-lg" style={{ color: tiles[k].fg }}>{s.name}</h3>
              <p className="t-sub mt-4" style={{ color: tiles[k].fg }}>{s.oneLiner}</p>
            </div>
          ))}
        </div>
      </noscript>
    </section>
  );
}
