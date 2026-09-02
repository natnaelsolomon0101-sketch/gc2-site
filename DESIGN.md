# GC2 — Design system

The Origin system. Dark ground, serif display, chromatic tiles used only inside
the pinned strategies panel. Every contrast number below was computed from the
shipped token values, not copied from a spec.

## Principles

1. The ground is near-black and stays that way. Light surfaces are cards, never pages.
2. Color is confined to the strategy tiles. Everything else is achromatic.
3. Authority comes from scale: very large, light-weight serif display against small mono labels.
4. Depth is a surface step (obsidian to graphite) plus radius. No shadows.
5. Motion is slow and additive. It never gates content becoming visible.

## Color

| Token | Hex | Role |
|---|---|---|
| `obsidian` | `#0f1011` | Page ground |
| `abyss` | `#090a0b` | Deeper band, section inversion |
| `graphite` | `#2e2e2e` | Card surface |
| `steel` | `#3f4041` | Hairlines, control borders |
| `pure` | `#ffffff` | Display type, wordmark, primary button fill |
| `cloud` | `#f5f5f7` | Card headings |
| `silver` | `#cacaca` | Light tile ground |
| `ash` | `#9f9fa0` | Body text |
| `fog` | `#7c7d7d` | De-emphasized text: dates, legal, inactive rows |
| `void` | `#000000` | Type on chromatic tiles |

Measured on `obsidian` (WCAG 2.1, sRGB):

`pure` 19.05 · `cloud` 17.49 · `silver` 11.62 · `ash` 7.20 · `fog` 4.61.
On `graphite`: `cloud` 12.47 · `ash` 5.14. All at or above 4.5.

`fog` is `#7c7d7d`, not the original `#6a6b6b`. That value measured 3.56:1 and
failed AA on four 14px usages, the footer legal disclaimer among them.

## Chromatic tiles

Used only by `PinnedStrategies`. Foreground is per-tile, not uniform: white
passes on exactly one of the six.

| Tile | Background | Foreground | Ratio |
|---|---|---|---|
| iris gleam | `#847dff` | `#000000` | 6.36 |
| cyan signal | `#00b3dd` | `#000000` | 8.49 |
| pale iris | `#d1c9ff` | `#000000` | 13.51 |
| deep iris | `#4b49aa` | `#ffffff` | 7.41 |
| orchid bloom | `#dd90d8` | `#000000` | 9.06 |
| periwinkle | `#90b8f0` | `#000000` | 10.30 |

White on `pale iris` would be 1.55:1. Do not make the foreground uniform.

## Type

Display is DM Serif Display, UI is Inter, data and labels are mono.

| Class | Size | Role |
|---|---|---|
| `t-display` | 52 / 96px | Page hero |
| `t-display-sm` | 40 / 80px | Section heading |
| `t-heading-lg` | 32 / 38px | Strategy tile heading |
| `t-heading-sm` | 26px | Card title |
| `t-wordmark` | 24px | GC2 mark, Nav and Footer |
| `t-sub` | 18px | Hero subhead |
| `t-body` | 16px | Body |
| `t-small` | 14px | Captions, dates, legal |
| `t-mono` | 12px | Eyebrow labels |
| `t-mono-xs` | 11px | Card eyebrows, definition terms |

Second numbers are at `min-width: 768px`. There are no inline `font-size`
overrides in the codebase; if a size is missing from this table, add a tier
rather than patching at the call site.

## Motion

`fade-in` splits opacity from transform on purpose. Opacity resolves in 620ms on
an ease-out; the 14px rise runs 1600ms on the slow atmospheric curve. They were
one 2.5s ease-in-out, which left the h1 (the LCP element) near zero opacity for
roughly two seconds while first paint had already landed at 140ms.

Every animation is behind `prefers-reduced-motion`. No `transition: all`, and no
animation of layout-affecting properties.

## Targets

Interactive elements clear 44x44 at 390px. The `sr-only` skip link measures 1x1
at rest by design and expands to 146x48 on focus.

## Content rules

`site.ts` is the only place the fund name appears. `site.address` and
`site.phone` are `null` and render nothing rather than a placeholder. The panel
figures carry an "Illustrative" marker. Do not ship an invented number.
