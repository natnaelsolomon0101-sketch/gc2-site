# GC2 — Design system

## Principles
1. Canvas is paper. A dark band is one deliberate inversion per page, never the default.
2. 95% achromatic. One accent, on links and focus only. Never a fill, never a surface.
3. Authority comes from restraint: very large, very light display type, tight leading.
4. Depth is surface steps and 1px hairlines. There are no shadows in this codebase.
5. Whitespace is the hierarchy. When in doubt, add space, not chrome.

## Color

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FFFFFF` | Page canvas |
| `stone` | `#F3F4F1` | Alternate band, row hover, text inside the inverted band |
| `hairline` | `#E3E5E1` | All rules, borders, dividers on paper |
| `mist` | `#C9CCC7` | Non-text only. See note below. |
| `slate` | `#696F76` | Secondary text, captions, labels |
| `ink` | `#1F2326` | Body text |
| `black` | `#000000` | Display, wordmark, the one filled button, the inverted band |
| `ledger` | `#0F4C3A` | Text links, focus ring, active nav underline. Never a fill. |
| `ledger-tint` | `#E8F0EC` | Selected/active row background only |
| `muted-on-black` | `#9AA0A6` | Secondary text inside the inverted band |
| `hairline-on-black` | `rgba(255,255,255,.14)` | Rules inside the inverted band |

Measured contrast (sRGB, WCAG 2.1):
`slate`/paper 5.08 · `slate`/stone 4.60 · `ink`/paper 15.83 · `ledger`/paper 9.93 ·
`stone`/black 19.02 · `muted-on-black`/black 7.95. All ≥ 4.5.

`slate` is `#696F76`, not the briefed `#6B7178`: that value measured 4.47:1 on `stone`
and failed AA wherever secondary text sits on an alternate band. `#696F76` is the
smallest darkening that clears 4.5 on both paper and stone.

`mist` measures 1.62:1 on paper and is never applied to text. Its briefed roles were
disabled text and placeholders; this site has no form, so it has no text role at all.

No gradients. No tinted near-blacks — display and the inverted band are true `#000000`.
No second accent.

## Typography
Display **Newsreader**, weight 300 (400 for h3, wordmark, statements). Never above 400, never italic.
Text **Instrument Sans**, weight 400 (500 for nav, buttons, labels). Never 600+.
No monospace. `font-variant-numeric: tabular-nums` globally.

| Token | Family / weight | Desktop | ≤768px | Leading | Tracking |
|---|---|---|---|---|---|
| `display` | Newsreader 300 | 96 | 52 | 1.00 | −0.01em |
| `h1` | Newsreader 300 | 72 | 44 | 1.02 | −0.01em |
| `h2` | Newsreader 300 | 48 | 34 | 1.08 | −0.005em |
| `h3` | Newsreader 400 | 28 | 24 | 1.20 | 0 |
| `lead` | Instrument Sans 400 | 22 | 19 | 1.45 | 0 |
| `body` | Instrument Sans 400 | 17 | 17 | 1.60 | 0 |
| `small` | Instrument Sans 400/500 | 15 | 15 | 1.50 | 0 |
| `caption` | Instrument Sans 400 | 13 | 13 | 1.50 | 0 |

Body measure 34em. Lead measure 30em. Headlines max 3 lines at desktop.

## Layout
Container 1240px, gutters 24 / 48 (≥1024). 12 columns, 24px gap.
Section padding 120 desktop / 72 mobile, never below 64. Nav 72px, sticky.
Base unit 4. Scale: 4 8 12 16 24 32 48 64 96 120 160.
Everything left-aligned except the mobile nav overlay.

## Shape
Buttons and inputs 2px. Cards and images 4px. No pills. Borders 1px `hairline`,
spanning the container, not the viewport.

## Elevation
None. No `shadow-*` exists in `src/`. The sticky nav gains a 1px hairline bottom
border after 8px of scroll. That is the only elevation cue.

## Motion
150ms hover/focus, 500ms reveals, `cubic-bezier(.2,.8,.2,1)`.
One orchestrated moment: the hero reveal on home load, staggered 70ms, once.
Nothing else animates on scroll. The surface drifts on a 90s loop.
`prefers-reduced-motion: reduce` renders the hero final and freezes the surface.
CSS only.

## The surface
~40 isolines from deterministic 2D simplex noise (seed committed in
`scripts/generate-surface.ts`), marching squares over a 240×160 grid, emitted once to
`public/surface.svg`. 1px `hairline` strokes, no fill. Masked so it dissolves left and
down. Hero right half; reused at 40% opacity top-right on `/firm`. Nowhere else.

## Iconography
None. The only glyph is a two-line hamburger on mobile. No arrows on links or buttons.
