/**
 * Sculptural draped-form field. Deterministic server-rendered SVG.
 * Monochrome by design — the Wealthsimple system forbids gradients and accent
 * hues, so this reads as a gallery object rather than a data visualisation.
 */
export default function Surface({
  className = "", lines = 40, tone = "#fcfcfc", opacity = 1,
}: { className?: string; lines?: number; tone?: string; opacity?: number }) {
  const W = 760, H = 820;
  const paths: string[] = [];

  for (let i = 0; i < lines; i++) {
    const t = i / (lines - 1);
    const y0 = 70 + t * (H - 150);
    const amp = 22 + Math.sin(t * Math.PI) * 104;
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 14) {
      const u = x / W;
      const y =
        y0 -
        Math.sin(u * Math.PI * 1.9 + t * 3.1) * amp * (0.32 + 0.68 * Math.sin(t * Math.PI)) -
        Math.sin(u * Math.PI * 4.7 + t * 1.4) * amp * 0.14;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    paths.push(`M ${pts.join(" L ")}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="drapeFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="20%" stopColor="#fff" stopOpacity="1" />
          <stop offset="80%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="drapeFadeX" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="16%" stopColor="#fff" stopOpacity="1" />
          <stop offset="84%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="drapeMask">
          <rect width={W} height={H} fill="url(#drapeFade)" />
          <rect width={W} height={H} fill="url(#drapeFadeX)" style={{ mixBlendMode: "multiply" }} />
        </mask>
      </defs>
      <g mask="url(#drapeMask)" opacity={opacity}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={tone} strokeWidth={0.8}
                strokeOpacity={0.12 + 0.5 * Math.sin((i / lines) * Math.PI)} />
        ))}
      </g>
    </svg>
  );
}
