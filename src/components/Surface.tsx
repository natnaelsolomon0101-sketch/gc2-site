/** The signature visual. Static SVG generated at build time by scripts/generate-surface.ts. */
export default function Surface({
  className = "", opacity = 1,
}: { className?: string; opacity?: number }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/surface.svg" alt="" className="surface-drift h-full w-full object-cover" />
    </div>
  );
}
