# Appendix A for v4 — the token authority, translated

`docs/EVERY-SCREEN.md` was written against `docs/ORCHESTRATION.md` Appendix A, a
paper-canvas system (paper, hairlines, Newsreader 300, one green accent). That
document does not exist in this repository, and the client rejected that
direction: `docs/BUILD100K.md` records that the DARK build was chosen and the
light institutional build was thrown out. The live site, the checked-out
branch, and `src/app/globals.css` are all the dark Origin system.

**Decision (Conductor, with Nate, 3 Sep 2026): run the v4 process on the dark
build. `src/app/globals.css` and `DESIGN.md` are Appendix A.** Every rule in
EVERY-SCREEN.md that names a paper token is read through this table. Nothing
in DESIGN.md is repealed; its "Known drift" section is the list of things v4
is allowed to fix.

## Token translation

| EVERY-SCREEN.md says | Read as (dark Origin) | Token / class |
|---|---|---|
| paper (page ground) | obsidian | `--color-obsidian` `#0f1011` |
| `stone` (full-bleed band) | abyss, or graphite when the band is a surface | `--color-abyss` `#090a0b` · `--color-graphite` `#1c1d21` |
| ink (display type, primary stroke) | pure | `--color-pure` `#ffffff` |
| `slate` (secondary text, axes) | ash; fog for de-emphasized | `--color-ash` `#9f9fa0` · `--color-fog` `#7c7d7d` |
| `hairline` | the 12% white rule | `.rule-t` / `.rule-b` / `rgba(255,255,255,.12)`; `--color-steel` for control borders |
| `caption` | the mono eyebrow | `.t-caption` (inner routes) / `.t-mono` (home) |
| Newsreader 300 / 400 (display) | DM Serif Display 400, tracking tightened in CSS | `--font-display` |
| `body` 17px | Inter 16px on home, 18px prose on inner routes | `.t-body` / `.t-prose` |
| `small` | `.t-small` 14px | |
| the one green accent | the six chromatic tiles, rationed as DESIGN.md principle 2 | `iris-gleam` `cyan-signal` `pale-iris` `deep-iris` `orchid-bloom` `periwinkle` |
| "one black button" | the one white button | `.btn` (pure on void) |
| `h2` scale statement band | `.t-display-sm` on home, `.t-h2` inner | |
| container 1240 | `--page-max` 1200 (may grow to 1440 above 1920 per §7.6) | |
| theme-color = paper | theme-color stays `#0f1011` — §0.2 item 7 is RESOLVED: dark canvas is deliberate | |

## Rules that carry over unchanged

Left-aligned. Tokens only. `clamp()` type from `globals.css`. `dvh` not `vh`.
Hover gated by `(hover: hover) and (pointer: fine)`. Tap targets ≥ 44px with
8px gaps. No numerals on things that are not sequences. No charts of fund
data. No text under the nav. Tables stack; no horizontal scroll except the
one `/strategies` strip. Data-art strokes are 1px, no fills, source line
mandatory, `data-source` attribute for `scripts/qa/sources.ts`.

## Rules that are translated, not dropped

- **"No shadows."** DESIGN.md principle 4 says the same. Shadows ship in
  `Strategies.tsx` and `Feature.tsx` as a stand-in for a surface step that is
  too small to see (drift). Fix the step, then remove them. Do not add more.
- **"No gradients."** Applies to every NEW surface and to every data
  component. The hero's bloom/atmosphere surface is the brief
  (`BUILD100K.md`: "the bloom and atmosphere work is the point") and stays,
  subject to the hero's own done-criteria. The yield curve does not get a
  gradient.
- **"No icons."** The dark kill list permits `lucide-react`. Rule for v4: no
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
- **Kill list.** `scripts/qa/killist.sh` (the dark list) is the gate, not the
  light-branch A.7 list. `punctuation.sh` does not exist and is not a gate.

## Motion (§8) on the dark system

`src/lib/motion.ts` is the single source: durations 150 / 500 / 900ms,
stagger 70ms, one easing, `reduced()`. The existing `originFadeIn` /
`originRise` split (620ms opacity, 1600ms rise) is the hero's load
choreography today; sec-motion decides whether it becomes the 900ms token or
stays as the hero's one exception, and logs it. Everything else on §8.2's list
is the complete list of what moves.
