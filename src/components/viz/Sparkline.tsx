/** A server-rendered SVG sparkline: one polyline over the series, a dot on
 *  the last value. No axes, no numbers; the tile prints those. */
export default function Sparkline({
  series, width = 160, height = 44, className = "",
}: { series: number[]; width?: number; height?: number; className?: string }) {
  if (series.length < 2) return null;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pad = 3;
  const pts = series.map((v, i) => {
    const x = pad + (i / (series.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="var(--color-accent-deep-iris)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="2.6" fill="var(--color-accent-deep-iris)" />
    </svg>
  );
}
