/**
 * Surface — deterministic, server-rendered SVG line field.
 *
 * Mercury tuning: a quiet contour / signal field rather than a draped cloth.
 * Thin, non-crossing strokes on a slow envelope, a faint measurement grid
 * behind them, and a soft radial + horizontal mask so the artwork dissolves
 * into the page instead of ending on a hard rectangular crop.
 *
 * No randomness, no dates, no hooks — identical output on server and client.
 */

/** Tiny deterministic hash so concurrent instances get unique <defs> ids. */
function uidFrom(lines: number, tone: string, opacity: number) {
  let h = 2166136261;
  const seed = `${lines}|${tone}|${opacity}`;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `sf${(h >>> 0).toString(36)}`;
}

export default function Surface({
  className = "",
  lines = 40,
  tone = "#fcfcfc",
  opacity = 1,
}: { className?: string; lines?: number; tone?: string; opacity?: number }) {
  const W = 720;
  const H = 720;
  const PAD_Y = 56;
  const STEP = 8;

  const count = Math.max(2, Math.round(lines));
  const uid = uidFrom(count, tone, opacity);

  // ---- contour field -------------------------------------------------------
  const paths: { d: string; index: boolean; strength: number }[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y0 = PAD_Y + t * (H - PAD_Y * 2);

    // Smooth swell that peaks through the middle of the field.
    const env = Math.pow(Math.sin(Math.PI * t), 1.5);
    const amp = 26 + 46 * Math.sin(t * Math.PI);
    const phase = t * 1.15;

    const pts: string[] = [];
    for (let x = 0; x <= W; x += STEP) {
      const u = x / W;
      const y =
        y0 -
        Math.sin(u * Math.PI * 1.6 + phase) * amp -
        Math.sin(u * Math.PI * 0.7 - phase * 0.6) * amp * 0.34 -
        Math.sin(u * Math.PI * 3.7 + phase * 1.9) * amp * 0.16;
      pts.push(`${x} ${y.toFixed(2)}`);
    }

    paths.push({
      d: `M${pts.join("L")}`,
      index: i % 6 === 0, // index contours, as on a topographic sheet
      strength: 0.14 + 0.34 * Math.sin(Math.PI * t),
    });
  }

  // ---- measurement grid ----------------------------------------------------
  const rules: number[] = [];
  for (let g = 1; g < 10; g++) rules.push(Math.round((g / 10) * W));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${uid}-r`} cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="58%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-x`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="14%" stopColor="#fff" stopOpacity="1" />
          <stop offset="86%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${uid}-m`}>
          <rect width={W} height={H} fill={`url(#${uid}-r)`} />
          <rect
            width={W}
            height={H}
            fill={`url(#${uid}-x)`}
            style={{ mixBlendMode: "multiply" }}
          />
        </mask>
      </defs>

      <g mask={`url(#${uid}-m)`} opacity={opacity} fill="none" stroke={tone}>
        {/* faint vertical measure */}
        <g strokeWidth={0.6} strokeOpacity={0.09}>
          {rules.map((x) => (
            <line key={x} x1={x} y1={PAD_Y * 0.5} x2={x} y2={H - PAD_Y * 0.5} />
          ))}
        </g>

        {/* contours */}
        <g strokeLinecap="round">
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              strokeWidth={i % 6 === 0 ? 1.1 : 0.7}
              strokeOpacity={0.26 + 0.54 * Math.sin((i / lines) * Math.PI)}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
