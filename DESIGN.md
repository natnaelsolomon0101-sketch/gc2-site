# GC2 — Design system

The Origin system. Dark ground, serif display, chromatic tiles rationed across
the page. Every contrast number below was computed from the shipped token values
in `src/app/globals.css`, not copied from a spec. Where the shipped code has
moved away from a principle below, it is recorded in "Known drift" at the end
rather than quietly written out of the doc.

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
| `graphite` | `#1c1d21` | Card surface |
| `steel` | `#26272b` | Hairlines, control borders |
| `pure` | `#ffffff` | Display type, wordmark, primary button fill |
| `cloud` | `#f5f5f7` | Card headings |
| `silver` | `#cacaca` | Light tile ground |
| `ash` | `#9f9fa0` | Body text |
| `fog` | `#7c7d7d` | De-emphasized text: dates, legal, inactive rows |
| `void` | `#000000` | Type on chromatic tiles |

Measured on `obsidian` (WCAG 2.1, sRGB):

`pure` 19.05 · `cloud` 17.49 · `silver` 11.62 · `ash` 7.20 · `fog` 4.61.
On `graphite` (`#1c1d21`): `cloud` 15.46 · `ash` 6.37. All at or above 4.5.

`graphite` and `steel` are darker than the first Origin draft (`#2e2e2e` and
`#3f4041`). Text contrast improved; the obsidian-to-graphite surface step did
not survive it. See "Known drift".

`fog` is `#7c7d7d`, not the original `#6a6b6b`. That value measured 3.56:1 and
failed AA on four 14px usages, the footer legal disclaimer among them.

## Chromatic tiles

The six accents. `Strategies` is the primary consumer, one tile per strategy;
`Feature`, `Insights`, `HeroV2`, `Approach`, `SiteNav`, `/partnership` and
`/questions` also draw on them. Foreground is per-tile, not uniform: white
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

Second numbers are at `min-width: 768px`.

The 17 inner routes run on a second, parallel scale (`.t-h1`/`.t-h2`/`.t-h3`
rather than `.t-display`/`.t-display-sm`), paired with `.container-gc2` and
`.section-y` instead of `.wrap` and `.band`:

| Class | Size | Role |
|---|---|---|
| `t-h1` | 44 / 80px | Inner-route page title |
| `t-h2` | 32 / 38px | Inner-route section heading |
| `t-h3` | 24 / 28px | Inner-route subheading |
| `t-article-title` | 56px | Insight note title |
| `t-nav-mobile` | 40px | Mobile nav item |
| `t-lead` | 18px | Inner-route lead paragraph |
| `t-prose` | 17 / 18px | Long-form body, 1.65 / 1.7 line-height |
| `t-caption` | 12px | Inner-route mono caption |

Second numbers are at `min-width: 769px`. Both systems are live; the home page
uses the first, everything under it uses the second.

If a size is missing from these tables, add a tier rather than patching at the
call site. Six pages break that rule today: `access`, `partnership` and
`questions` declare screen `font-size` inside their own scoped `<style>` blocks,
and the three `legal/` pages do the same in `pt` for print. The print overrides
are defensible; the three screen ones are missing tiers.

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

`src/config/site.ts` is the only place the fund name appears. `site.address` and
`site.phone` are `null` and render nothing rather than a placeholder.
`src/config/fund.ts` extends the same rule to providers, registrations, terms
and people: a null field renders nothing, and a section with no facts does not
render at all. Do not ship an invented number.

## Known drift

Recorded rather than removed, so the next reader knows the difference between a
rule and a description.

- **Principle 2 (colour confined to the strategy tiles).** Chromatic tokens also
  paint `Feature`, `Insights`, `HeroV2`, `Approach`, the `SiteNav` underline, and
  the `/partnership` and `/questions` pages. The rule is still the intent; the
  page is no longer achromatic outside the tiles.
- **Principle 4 (no shadows).** `box-shadow` ships in
  `src/components/sections/Strategies.tsx` and
  `src/components/sections/Feature.tsx`. The stated depth mechanism is the
  obsidian-to-graphite surface step, and at the shipped values that step is
  1.13:1 — close to invisible — which is what the shadows are standing in for.
  Fix the step, then remove the shadows; do not add more.
- **Two primitive systems.** `globals.css` ships `.wrap`/`.band`/`.t-display*`
  for the home page and `.container-gc2`/`.section-y`/`.t-h*` for the inner
  routes. Neither is deprecated. Match the file you are editing.
- **Unshipped primitives.** `src/components/ui/` (`Tile`, `Badge`, `Card`,
  `Stat`, `Rule`, `Reveal`) and the `BloomField`, `MarketsBand`, `HeroTicker`
  and `PinnedStrategies` sections are not imported by any route. They are
  documented in `docs/21st/HARVEST.md` but do not describe what renders.
- **`t-prose` tier change (foundation r1).** Was a flat 18px/1.7 on every
  viewport. Now a phone variant: 17px/1.65 below 768, 18px/1.7 at and
  above, ramped with a clamp() over that range rather than a hard step.
