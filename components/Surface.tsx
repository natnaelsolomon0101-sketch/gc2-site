/**
 * Abstract market-surface field. Deterministic, server-rendered SVG.
 * Gives the page a real visual anchor without stock photography.
 */
export default function Surface({
  className = "", lines = 34, tone = "#ae9357",
}: { className?: string; lines?: number; tone?: string }) {
  const W = 800, H = 900;
  const paths: string[] = [];

  for (let i = 0; i < lines; i++) {
    const t = i / (lines - 1);
    const y0 = 90 + t * (H - 190);
    const amp = 26 + Math.sin(t * Math.PI) * 96;
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 16) {
      const u = x / W;
      const y =
        y0 -
        Math.sin(u * Math.PI * 2.1 + t * 3.4) * amp * (0.35 + 0.65 * Math.sin(t * Math.PI)) -
        Math.sin(u * Math.PI * 5.3 + t * 1.7) * amp * 0.16;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    paths.push(`M ${pts.join(" L ")}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sfGild" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(13)">
          <stop offset="0%" stopColor="rgb(174,147,87)" />
          <stop offset="40%" stopColor="rgb(255,240,204)" />
          <stop offset="70%" stopColor="rgb(174,147,87)" />
          <stop offset="100%" stopColor="rgba(189,157,79,0)" />
        </linearGradient>
        <linearGradient id="sfFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="18%" stopColor="#fff" stopOpacity="1" />
          <stop offset="82%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="sfMask"><rect width={W} height={H} fill="url(#sfFade)" /></mask>
      </defs>
      <g mask="url(#sfMask)">
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="url(#sfGild)" strokeWidth={0.75}
                strokeOpacity={0.10 + 0.42 * Math.sin((i / lines) * Math.PI)} />
        ))}
      </g>
    </svg>
  );
}
