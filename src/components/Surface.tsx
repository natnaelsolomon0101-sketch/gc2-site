/** The signature visual. Static SVG generated at build time by scripts/generate-surface.ts. */
export default function Surface({
  className = "", opacity = 1,
}: { className?: string; opacity?: number }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* This is the LCP element on the home hero: it is the largest painted
          area on the page. Without the priority hints it was fetched at normal
          priority and LCP landed at 2.3s against A.9's 1.5s budget. */}
      <img src="/surface.svg" alt="" fetchPriority="high" decoding="sync"
           className="surface-drift h-full w-full object-cover" />
    </div>
  );
}
