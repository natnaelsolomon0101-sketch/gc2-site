# GC2 — Design system

The light canvas. Warm paper ground, warm-black ink, hairlines, serif display,
the six chromatic accents rationed across the page. Every contrast number below
was computed from the shipped token values in `src/app/globals.css` with a
WCAG 2.1 sRGB relative-luminance calculation, not copied from a spec and not
estimated. Where the shipped code has moved away from a principle below, it is
recorded in "Known drift" at the end rather than quietly written out of the doc.

## Light canvas (3 Sep 2026)

The site was the dark Origin system: obsidian ground, white display type, the
six accents glowing out of near-black. On 3 September 2026 the owner moved it to
a light canvas everywhere. Paper ground, ink type, hairlines, the same six
accents rationed on paper.

Why, in the terms of `docs/BUILD100K.md`: the brief asks for warmth that a woman
allocating capital reads as serious rather than soft, and it forbids buying that
warmth with decoration. Colour temperature is the one lever that buys it
honestly. The ground is `#f7f5f0`, not `#ffffff` — an off-white with a warm
cast; the ink is `#141311`, not `#000000` — a black with the same cast. Nothing
else about the system changed to get there: no new ornament, no new colour, no
softening of the type.

**One theme. No toggle. The site does not change under `prefers-color-scheme`.**
`html { color-scheme: light }` in `globals.css` is the whole mechanism, and
there is deliberately no `@media (prefers-color-scheme: dark)` rule anywhere in
the file. `scripts/qa/matrix.ts` diffs the dark-scheme render against the light
one and fails on a single changed pixel. `theme-color` is `#f7f5f0`, the ground
colour, resolving `docs/EVERY-SCREEN.md` §0.2 item 7 the paper way.

**The dark names are deprecated.** `obsidian`, `abyss`, `graphite`, `steel`,
`silver`, `fog`, `ash`, `cloud`, `pure` and `void` are still defined in `@theme`
and still hold their dark hexes, so the ten sections keep compiling while they
migrate. Every one of them now paints a dark object on a light page; that is
the point, and the mixed page is the migration checklist. Do not add a new use.
When the last section stops referencing them the block is deleted.

## Principles

1. The ground is warm paper and stays that way. Dark surfaces are objects — one
   button, one inverted card — never pages.
2. Colour is confined to the strategy tiles. Everything else is achromatic.
3. Authority comes from scale: very large, light-weight serif display against
   small mono labels.
4. Depth is a surface step (ground to ground-2 to surface) plus radius. No shadows.
5. Motion is slow and additive. It never gates content becoming visible.

## Colour

The semantic layer. This is the only layer new code uses.

| Token | Value | Role |
|---|---|---|
| `--color-ground` | `#f7f5f0` | Page ground: warm off-white paper |
| `--color-ground-2` | `#eeeae1` | Full-bleed band, one step darker: stone |
| `--color-surface` | `#e5e0d6` | Card and table surface, one step darker again |
| `--color-ink` | `#141311` | Display type, primary stroke, the button fill |
| `--color-ink-2` | `#544e45` | Body and secondary text |
| `--color-ink-3` | `#67615a` | De-emphasized: dates, legal, inactive rows |
| `--color-hairline` | `rgba(20,19,17,.13)` | Rules, dividers, table borders |
| `--color-hairline-strong` | `rgba(20,19,17,.28)` | Control borders, link underlines, print rules |

### Measured — ink on every ground

| | on `ground` | on `ground-2` | on `surface` |
|---|---|---|---|
| `ink` `#141311` | **17.04** | **15.47** | **14.12** |
| `ink-2` `#544e45` | **7.55** | **6.85** | **6.25** |
| `ink-3` `#67615a` | **5.61** | **5.09** | **4.65** |

`ink-3` clears 4.5:1 on all three grounds, so a 14px date, a legal line or an
inactive row is legal wherever it lands and not only on the page ground. That is
deliberate: the dark build's `fog` cleared 4.5 on `obsidian` alone and had to be
checked by hand every time it moved onto a card.

### Measured — the ground steps

`ground` → `ground-2` **1.10** · `ground-2` → `surface` **1.10** ·
`ground` → `surface` **1.21**.

The dark build's `obsidian`→`graphite` step was 1.13 and DESIGN.md called it
"close to invisible", which is what the shadows in `Strategies.tsx` and
`Feature.tsx` were standing in for. Two 1.10 steps and a 1.21 span read on
paper. Fix the step, then remove the shadows; do not add more.

### Measured — hairlines

`hairline` composites to `#d9d8d3` on ground and `#cac5bc` on surface — **1.31**
against whatever is under it in both cases, which is the reason it is an ink
alpha and not a solid grey. `hairline-strong` composites to `#b7b6b2` on ground,
**1.86**. A hairline is not text and is not held to 4.5:1; it is held to being
the same relationship to every ground it crosses.

### Controls

The one black button: `ink` fill, `ground` text, **17.04**. Hover steps the fill
up to `ink-2` (**7.55**) and active to `ink-3` (**5.61**) — the press reads as
the button lightening under the finger, and both stay past 4.5. `.btn-ghost` is
an `ink` outline on transparent. The focus ring is 2px `ink` on `ground`,
**17.04** against a 3:1 requirement; inside an inverted object `.on-ink` flips
it to `ground`.

`.card-surface` is the ordinary card: the third ground step, no border, no
shadow. `.card-invert` is the single inverted object a paper page is allowed —
`ground` on `ink`, **17.04** — the same role the light tile played on the dark
canvas. `.card-dark` and `.card-lite` are deprecated aliases for the two.

## Chromatic tiles

The six accents, unchanged hexes. On paper they are **fills**. The foreground is
per-tile and is paired with the fill in `@theme` (`--color-accent-*-fg`) so it
cannot drift: five take warm `ink`, `deep iris` takes `ground`.

| Tile | Fill | Foreground | Ratio | As TEXT on ground | on ground-2 | on surface |
|---|---|---|---|---|---|---|
| iris gleam | `#847dff` | `ink` | 5.62 | 3.03 | 2.75 | 2.51 |
| cyan signal | `#00b3dd` | `ink` | 7.51 | 2.27 | 2.06 | 1.88 |
| pale iris | `#d1c9ff` | `ink` | 11.95 | 1.43 | 1.29 | 1.18 |
| deep iris | `#4b49aa` | `ground` | 6.80 | **6.80** | **6.18** | **5.64** |
| orchid bloom | `#dd90d8` | `ink` | 8.01 | 2.13 | 1.93 | 1.76 |
| periwinkle | `#90b8f0` | `ink` | 9.11 | 1.87 | 1.70 | 1.55 |

**An accent is never text on paper unless it is `deep iris`.** `deep iris` is
the only one of the six that clears 4.5:1 as type on any of the three grounds.
`pale iris` measures **1.43** on ground and `periwinkle` **1.87** — they will
not pass as text and no amount of weight or size fixes them; at ≥24px the bar is
still 3:1 and both fail that too. `iris gleam` (3.03) clears 3:1 for large text
only and is not a body colour. Set them as fills, or as a 1px stroke on a data
object where nothing is being read, and take the foreground from the paired
`-fg` token.

`BUILD100K.md` asks the palette to lean warm: favour `orchid`, `pale iris` and
`periwinkle`, use `cyan signal` sparingly, `deep iris` for depth. That ranking is
unchanged by the move to paper, but note that the three warm favourites are also
the three palest, so on paper they are quiet fills rather than the glowing
objects they were on obsidian. `deep iris` carries proportionally more weight
here because it is the one accent that reads as ink.

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
  `src/components/sections/Feature.tsx`. The stated depth mechanism was the
  obsidian-to-graphite surface step, and at the dark build's values that step
  was 1.13:1 — close to invisible — which is what the shadows were standing in
  for. **The light canvas fixes the step**: ground→ground-2 and
  ground-2→surface are 1.10 each and ground→surface is 1.21, all measured. The
  precondition is met, so the shadows come out when sec-strategies and
  sec-framework migrate those two files. Do not add more.
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
- **The page is MIXED (foundation r3).** `globals.css` and `layout.tsx` are on
  the light canvas; the ten sections are not yet. Every file still carrying
  `bg-obsidian`, `text-pure`, `text-cloud`, `text-ash`, `text-fog`, a
  `rgba(255,255,255,…)` rule or a `white/N` utility paints a dark object on a
  light page. That is expected at this point and it is the migration
  checklist, not a bug to patch at the call site. Migrate to the semantic
  tokens; do not add a token to `globals.css` to preserve a dark object.
- **The print bridge.** `@media print` in `globals.css` carries one temporary
  rule that remaps `.text-pure` / `.text-cloud` / `.text-silver` /
  `.text-ash` / `.text-fog`, a `summary` and `footer a` to ink, because those
  are white on paper today. It is commented with the files it holds up and
  comes out with the last of them. `scripts/qa/print.ts` is what will tell you
  when: it fails at 1.00:1 the moment the rule is removed early.
