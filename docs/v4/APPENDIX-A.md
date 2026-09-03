# Appendix A for v4 — the token authority, translated

`docs/EVERY-SCREEN.md` was written against `docs/ORCHESTRATION.md` Appendix A, a
paper-canvas system (paper, hairlines, Newsreader 300, one green accent). That
document does not exist in this repository.

**Decision (owner, 3 Sep 2026, round 3): the site moves to a LIGHT canvas
everywhere.** Paper ground, ink type, hairlines, the six chromatic accents
rationed on paper, one theme, no toggle, and no change under
`prefers-color-scheme`. `docs/BUILD100K.md` chose the DARK build in the first
pass; that choice is superseded on the canvas question only — its audience brief
(warmth, credibility, never gender it cheaply), its six accent hexes, its type
stack, its radii and every one of its hard rules stand unchanged.

**`src/app/globals.css` and `DESIGN.md` remain Appendix A.** Every rule in
EVERY-SCREEN.md that names a paper token is read through the table below.
Nothing in DESIGN.md is repealed; its "Known drift" section is the list of
things v4 is allowed to fix.

## Token translation

EVERY-SCREEN.md was written for a paper canvas, so most of this table is now an
identity mapping rather than a translation. What it names is the SEMANTIC layer
in `@theme` — the only layer new code uses.

| EVERY-SCREEN.md says | Read as | Token / class |
|---|---|---|
| paper (page ground) | ground | `--color-ground` `#f7f5f0` |
| `stone` (full-bleed band) | ground-2; surface when the band is a card or table | `--color-ground-2` `#eeeae1` · `--color-surface` `#e5e0d6` |
| ink (display type, primary stroke) | ink | `--color-ink` `#141311` |
| `slate` (secondary text, axes) | ink-2; ink-3 for de-emphasized | `--color-ink-2` `#544e45` (7.55 on ground) · `--color-ink-3` `#67615a` (5.61) |
| `hairline` | hairline | `--color-hairline` `rgba(20,19,17,.13)`; `--color-hairline-strong` for control borders and link underlines; `.rule-t` / `.rule-b` read the token |
| `caption` | the mono eyebrow | `.t-caption` (inner routes) / `.t-mono` (home) |
| Newsreader 300 / 400 (display) | DM Serif Display 400, tracking tightened in CSS | `--font-display` |
| `body` 17px | Inter 16px on home, 18px prose on inner routes | `.t-body` / `.t-prose` |
| `small` | `.t-small` 14px | |
| the one green accent | the six chromatic tiles, rationed as DESIGN.md principle 2 | `--color-accent-*` with its paired `--color-accent-*-fg` |
| "one black button" | the one black button | `.btn` (ink fill, ground text, 17.04:1) |
| `h2` scale statement band | `.t-display-sm` on home, `.t-h2` inner | |
| container 1240 | `--page-max` 1200 (may grow to 1440 above 1920 per §7.6) | |
| theme-color = paper | theme-color is `#f7f5f0`, the ground colour — §0.2 item 7 is RESOLVED the paper way | |

### The accents are fills, not text

Measured as type on ground: iris 3.03, cyan 2.27, pale-iris 1.43, deep-iris
6.80, orchid 2.13, periwinkle 1.87. **`deep iris` `#4b49aa` is the only one that
may be set as text on paper.** Everything else is a fill or a 1px stroke, and
its foreground comes from the paired `--color-accent-*-fg` token (five take
`ink`, deep-iris takes `ground`). Full table in DESIGN.md.

### The dark names are deprecated

`obsidian`, `abyss`, `graphite`, `steel`, `silver`, `fog`, `ash`, `cloud`,
`pure`, `void` are still defined in `@theme` and still hold their dark hexes,
so the ten sections compile while they migrate. Each one paints a dark object
on a light page. Do not add a new use; the block is deleted when the last
reference goes.

## Rules that carry over unchanged

Left-aligned. Tokens only. `clamp()` type from `globals.css`. `dvh` not `vh`.
Hover gated by `(hover: hover) and (pointer: fine)`. Tap targets ≥ 44px with
8px gaps. No numerals on things that are not sequences. No charts of fund
data. No text under the nav. Tables stack; no horizontal scroll except the
one `/strategies` strip. Data-art strokes are 1px, no fills, source line
mandatory, `data-source` attribute for `scripts/qa/sources.ts`.

## Rules that are translated, not dropped

- **"No shadows."** DESIGN.md principle 4 says the same. Shadows ship in
  `Strategies.tsx` and `Feature.tsx` as a stand-in for a surface step that was
  too small to see. The light canvas fixes the step (1.10 / 1.10 / 1.21,
  measured), so the precondition is met: remove them when those files migrate.
  Do not add more.
- **"No gradients."** Applies to every NEW surface and to every data
  component. The hero's bloom/atmosphere surface is the brief
  (`BUILD100K.md`: "the bloom and atmosphere work is the point") and stays,
  subject to the hero's own done-criteria. The yield curve does not get a
  gradient.
- **"No icons."** The kill list permits `lucide-react`. Rule for v4: no
  new decorative icons; functional glyphs (menu, close, external) may stay.
- **"Bold lives in three places — hero, section transitions, share kit."**
  Unchanged. Chromatic colour is what "bold" means here.
- **Fluid type (§7.1).** Applied to the tiers that exist (`.t-display`,
  `.t-display-sm`, `.t-heading-lg`, `.t-heading-sm`, `.t-h1/2/3`,
  `.t-article-title`, `.t-nav-mobile`) with a 320 floor and a ceiling that
  rises above 1920. The doc's exact px values are the reference, not the
  law; the existing 52/96, 40/80, 44/80 pairs are the anchors.
- **Two primitive systems** (`.wrap/.band` on home, `.container-gc2/.section-y`
  inner) both stay; both go fluid.
- **Kill list.** `scripts/qa/killist.sh` is the gate, not the
  light-branch A.7 list — it bans invented facts, placeholder copy and token
  drift, not uppercase or mono, which this system uses on purpose. `punctuation.sh` does not exist and is not a gate.

## Motion (§8)

`src/lib/motion.ts` is the single source: durations 150 / 500 / 900ms,
stagger 70ms, one easing, `reduced()`. The existing `originFadeIn` /
`originRise` split (620ms opacity, 1600ms rise) is the hero's load
choreography today; sec-motion decides whether it becomes the 900ms token or
stays as the hero's one exception, and logs it. Everything else on §8.2's list
is the complete list of what moves.
