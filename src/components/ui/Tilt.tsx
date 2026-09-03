"use client";

import * as React from "react";

/**
 * Tilt — a floating object that leans toward the pointer, with a soft
 * spotlight where the pointer is. The 21st "Tilt Card" idea (12246) with no
 * library: one pointermove handler writing four custom properties, CSS does
 * the rest. Off on touch, off under reduced motion, and it never moves the
 * layout — transform only.
 *
 * Usage: <Tilt className="my-card" max={6}>…</Tilt>. Style the child with
 * `.my-card{ transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)); }`
 * or leave it: the default inline style below already applies the transform.
 * `--spot-x/--spot-y` are 0–100% for a radial-gradient highlight if wanted.
 */
export type TiltProps = {
  /** Max lean in degrees. Default 6. */
  max?: number;
  as?: "div" | "article" | "li" | "a";
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "style">;

export default function Tilt({
  max = 6, as = "div", className = "", style, children, ...rest
}: TiltProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [live, setLive] = React.useState(false);

  React.useEffect(() => {
    const ok =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLive(ok);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || !live) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--tilt-x", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return React.createElement(
    as,
    {
      ...rest,
      ref,
      className,
      onPointerMove: onMove,
      onPointerLeave: onLeave,
      style: {
        transform: "perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        transition: "transform var(--dur-base) var(--ease)",
        willChange: live ? "transform" : undefined,
        ...style,
      },
    },
    children
  );
}
