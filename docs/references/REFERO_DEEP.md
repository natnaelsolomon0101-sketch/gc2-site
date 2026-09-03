# Refero — Deep scrape, dark-site bias

**Captured:** 2026-09-02
**Sources:** `https://refero.design/`, `https://refero.design/search?order=trending`,
refero's own JSON API (`https://api.refero.design/v1/…`), and the live CSS of every site
refero pointed at.

Companion document: `UPGRADE_SPEC.md` (what to change in our build).
Predecessor: `REFERO_TRENDING.md` (9 trending sites, Sept 2). This document supersedes it
in scope — 36 sites, dark-weighted — and does not repeat its Stripe / Attio / Revolut /
Webflow / Calendly write-ups.

---

## 0. What refero actually publishes, and what it does not

This matters, because the brief assumed refero publishes extracted design data. It does —
but much less than the site's framing implies.

**Reachable without a login:**

| Endpoint | What it gives | Cap |
|---|---|---|
| `GET /v1/search?order=trending` | screenshot records | **9 records only.** Advertises `per_page:24, pages:3121, count:74883`; `page`, `p`, `offset`, `per_page` are all ignored anonymously — every request returns the same first 9. |
| `GET /v1/sites/available?page=N` | **site records, paginates correctly, 18 pages, 427 sites** | full |
| `GET /v1/sites/{id}` | one site: domain, description, categories, `screenshots_count`, linked app | full |
| `GET /v1/search?query=<domain>` | that site's screenshots incl. **fonts** | 24/req |
| `GET /v1/categories/available` | category taxonomy | full |

`sites/available` is the useful one and it is what this scrape is built on. It was not used
in the previous pass.

**Per screenshot, refero publishes exactly five things:** `colors` (5 dominant RGB triplets
sampled from the JPEG), `fonts` (detected family names, often wrong or partial), plus
`design_patterns`, `page_elements`, `page_types` taxonomies. Per site it adds a
`background_color` hex.

**Refero publishes NO typography scale, NO spacing, NO container width, NO radius, NO
line-height, NO letter-spacing, NO motion data.** There is no such thing as a refero
"design data" panel with numbers in it. Anyone who reports px values "from refero" is
reporting values that do not exist there.

**One trap worth recording:** `site.background_color` is a *brand* colour, not the page
ground. Filtering the 427 sites on it produced `weavy.ai #000000`, `raycast.com #b50201`,
`netflix.com #ff0000` — useless. Screenshot `colors` luminance is a much better dark-site
detector and is what was used to build the target list.

**So every px, em, hex and millisecond below was read out of the live site's own served
CSS.** Refero was used to *select* which sites to measure and to supply the
`[refero]`-tagged palette/font rows. Values tagged `[css]` are authored custom-property or
declaration values pulled from the stylesheets the site actually ships — design tokens, not
eyeballed screenshots.

### Coverage and blocks — honest tally

- **36 sites yielded live CSS.** Ranging from 106 KB (nothing.tech) to 1.05 MB (krea.ai).
- **34 sites carry refero-published palette/font data** (`refero_data.json` in the scratch dir).
- **Blocked / no data — stated per site, never guessed:**
  - `perplexity.ai/hub` — **HTTP 403.** This is the client's stated reference. No CSS was
    read. The only data below for it is refero's extracted palette.
  - `sora.com` — **HTTP 403.**
  - `kraken.com` — **connection failed (curl exit, no response).**
  - `wandb.ai/site` — HTTP 200 but **zero stylesheets and zero inline `<style>`** in the
    server HTML; entirely runtime-injected. No values.
  - `vercel.com`, `glassnode.com`, `teenage.engineering` — present on refero but their
    screenshot `colors` arrays come back **empty**. Their `[css]` rows below are still real.
  - `column.com`, `rox.com`, `twelvelabs.io` — no `<link rel=stylesheet>`; all CSS is
    inline (Framer/Webflow style). Inline `<style>` blocks were captured, so the values are
    real, but the sample is the above-the-fold subset the platform inlines.
  - `mercury.com` — the marketing homepage ships almost no `max-width`, `padding` or `gap`
    declarations in CSS (Tailwind arbitrary values resolve at build). Its type and grain
    numbers are real; **its container and section-spacing rows are absent, not zero.**

---

## 1. linear.app — the most complete dark token file on the open web

*Project management. Dark by default (`<html data-theme="dark">`), `theme-color #08090a`.
586 KB of CSS across 54 files. This is the reference that ships everything.*

**[refero]** extracted palette `#edf0f0 #5f6262 #8f9094 #040b0b #2e3133 #f3f8f8`; detected font `Inter`.
**[css]** actual families: `--font-regular: "Inter Variable"`, `--font-monospace: "Berkeley Mono"`,
**`--font-serif-display: "Tiempos Headline"`** (a serif display, shipped alongside the sans).

### Ground and surface ramp `[css]` — eight near-blacks, not one

| Token | Dark value | Rel. luminance |
|---|---|---|
| `--color-bg-marketing` | `#010102` | 0.4 |
| `--color-bg-primary` | **`#08090a`** | 8.9 |
| `--color-bg-panel` | `#0f1011` | 15.9 |
| `--color-bg-tint` | `#141516` | 20.9 |
| `--color-bg-secondary` | `#1c1c1f` | 28.2 |
| `--color-bg-tertiary` | `#232326` | 35.2 |
| `--color-bg-quaternary` | `#28282c` | 40.3 |
| `--color-bg-quinary` | `#282828` | 40.0 |

The steps from ground upward are **+7, +5, +7, +7, +5, −0.3 luminance units.** Nothing jumps.
Alongside the opaque ramp it ships a **translucent** ramp for anything that sits over
imagery: `--color-bg-translucent #ffffff0d`, `-secondary #ffffff08`, `-tertiary #ffffff12`,
`-quaternary #ffffff26`.

**Borders are never opaque grey.** `--color-border-primary #ffffff14` (8%),
`-secondary #ffffff1f` (12%), `-tertiary #ffffff26` (15%), `-translucent #ffffff0d` (5%).
Opaque fallbacks exist (`#23252a`, `#34343a`, `#3e3e44`) but the translucent values win.

**Text:** `--color-text-primary #f7f8f8` (18.7:1 on ground), `-secondary #d0d6e0` (13.6:1),
`-tertiary #8a8f98` (6.1:1), `-quaternary #86848d`.

**Accent — two, total.** `--color-accent #7170ff`, hover `#828fff`, tint `#18182f`;
`--color-brand-bg #5e6ad2` / `#7070ff`. Plus one red `#f34e52` for destructive states only.

### Type scale `[css]` — full ladder with per-step tracking

| Token | Size | Line-height | Letter-spacing |
|---|---|---|---|
| `--title-9` | 4.5rem / **72px** | **1.0** | **−0.022em** |
| `--title-8` | 4rem / 64px | 1.06 | −0.022em |
| `--title-7` | 3.5rem / 56px | 1.1 | −0.022em |
| `--title-6` | 3rem / 48px | 1.0 | −0.022em |
| `--title-5` | 2.5rem / 40px | 1.1 | −0.022em |
| `--title-4` | 2rem / 32px | 1.125 | −0.022em |
| `--title-3` | 1.5rem / 24px | 1.33 | −0.012em |
| `--title-2` | 1.25rem / 20px | 1.33 | −0.012em |
| `--title-1` | 1.0625rem / 17px | 1.4 | −0.012em |
| `--text-large` | 1.0625rem / 17px | 1.6 | 0 |
| `--text-regular` (body) | .9375rem / **15px** | **1.6** | **−0.011em** |
| `--text-small` | .875rem / 14px | 21/14 = 1.5 | −0.013em |
| `--text-mini` | .8125rem / 13px | 1.5 | −0.01em |
| `--text-micro` | .75rem / 12px | 1.4 | 0 |
| `--text-tiny` | .625rem / 10px | 1.5 | −0.015em |

**Display:body ratio = 72 / 15 = 4.8×.**
Line-height tightens monotonically with size (1.6 → 1.0). Tracking goes to −0.022em and
**stops** — it does not keep growing.

**Weights are variable-font, not round numbers:** `light 300, normal 400, medium 510,
semibold 590, bold 680`. Marketing headings use `semibold 590`, not 700.
Font feature settings shipped: `--font-settings: "cv01","ss03"`.

### Layout `[css]`
- `--homepage-max-width: calc(1344px + 16px * 2)` = **1376px** outer; `--homepage-outer-padding: 16px`
- `--page-max-width: 1024px`; `--page-padding-inline: 24px`; `--page-padding-block: 64px`; `--page-padding-y: 48px`
- **Prose column `max-width: 640px` — used 95 times**, by far the most frequent width in the file.
- Radius ramp: `4 / 6 / 8 / 12 / 16 / 24 / 32px` + `9999px`. `--card-radius: 12px`,
  `--app-radius: 12px`, `--edge-highlight-radius: 16px`. Most-used single value: **8px (×39)**.
- Section padding ≥48px, all values present: **48, 56, 64, 80, 96, 112, 128px.** Seven values, no more.

### Depth, grain, glow `[css]` — the expensive part
- **Grain is a shipped component** with its own stylesheet (`Grain.D_EBlr94.css`):
  ```
  .grain { opacity: .9; mix-blend-mode: overlay; background-size: 256px 256px;
           position:absolute; inset:0; pointer-events:none; border-radius:inherit }
  .grain::after { background: #ffffff0f }        /* 6% white lift inside the grain layer */
  .grainSubtle { opacity: .6; background-size: 256px 256px }
  ```
  Per-instance overrides go down to `opacity: .25`. Asset:
  `static/grain-default.png`. **The 90% opacity is only tolerable because of
  `mix-blend-mode: overlay` on a near-black ground** — overlay against L≈9 barely moves it.
- **Glow is large, diffuse and achromatic:**
  `radial-gradient(50% 50%, #ffffff0a 0%, #fff0 90%)` at **400×400px** or **800×320px**,
  absolutely positioned at the top edge of a panel. That is **4% white**. There is no
  coloured bloom anywhere on the marketing page.
- Panel treatment: `background:#ffffff03; border:1px solid #ffffff0d; border-radius:8px;
  box-shadow: 0 0 0 2px #0003` and elsewhere
  `box-shadow: inset 0 0 0 1px var(--color-border-primary), 0 0 32px 0 #08090acc`.
- Counts: 174 `linear-gradient`, 75 `radial-gradient`, **111 `mask-image`**, 21 `filter:blur`,
  24 `backdrop-filter`. The mask-image count is the tell — edges are faded, not cut.

### Motion `[css]`
- Base transition `--duration: .18s`; most common measured duration **.16s (×31)**, then .12s, .1s, .15s.
- Signature easing `cubic-bezier(.32,.72,0,1)` (×7) — a long, decelerating out-curve.
- Named eases shipped: `--ease-out cubic-bezier(0,0,0,1)`, `--ease-in-out cubic-bezier(.2,0,0,1)`,
  `--ease-out-cubic cubic-bezier(.33,1,.68,1)`, `--ease-in-out-expo cubic-bezier(1,0,0,1)`.
- **Ambient loops run at 1600ms / 2800ms / 3200ms** (each appearing ~100×). Nothing ambient is fast.

---

## 2. raycast.com — the best "cinematic dark marketing page" in the set

*Launcher app. 420 KB CSS. If you want to know what a six-figure dark page does that a
cheap one doesn't, this is the file to read.*

**[refero]** palette `#edebeb #b2101d #661d22 #1a2c5f #11552b #98a296`; fonts `Inter, Geist Mono, JetBrains Mono`.
**[css]** `Inter` + `Geist Mono` + `JetBrains Mono` + **`Instrument Serif`** + `VT323`.

### Ground ramp `[css]` — six near-blacks, cool-tinted
```
--grey-900  #07080a   L 7.9   ← --background
--grey-800  #0c0d0f   L 12.9
--grey-700  #111214   L 17.9
--grey-600  #1b1c1e   L 27.9
--grey-500  #2f3031   L 48.3
--grey-400  #434345   L 68.4
--grey-300  #6a6b6c   --grey-200 #9c9c9d   --grey-100 #cdcece   --grey-50 #e6e6e6
```
Every step has **blue ≥ red** (`07`/`08`/`0a`). It is a cool near-black, not a neutral one.
Border: `--color-border #242728`. Body grey `--grey-200 #9c9c9d` = **7.3:1** on ground.

**Accent — one.** `--red-dark #ff6363`, with `--color-red-transparent #ff616126` (15%).

### Type `[css]`
Display sizes present: **168, 116, 86, 80, 72, 64, 56, 52, 50, 48, 44, 40, 36, 32, 30, 28px.**
Line-heights: `160` (=1.6, unitless-percent style) ×53, `150` ×20, `1.6` ×16, `1.5` ×12, `1.4` ×8, `1` ×10.
**Letter-spacing is overwhelmingly POSITIVE**: `.2px ×98`, `.1px ×51`, `.3px ×18`, `.4px ×4` — that is
the small-caps / eyebrow / mono-label layer, tracked open. Negative tracking is rare (`-.05px ×8`).
**Weight 500 dominates (×203)**; 600 ×58, 400 ×60. Almost no 700.

### Glow `[css]` — this is the money
```
0 0 250px #fff3                                   /* 20% white, 250px blur */
0 0 172px #ff636366                               /* 40% accent, 172px blur */
0 0 140px #fff3
0 0 70px 20px #ffffff08, 0 0 30px 10px #ffffff0a, inset 0 .5px #ffffff4d,
  0 0 0 .5px #000c, 0 4px 40px 8px #0006          /* the full card recipe */
0 0 0 .5px color(display-p3 0 0 0/.8), 0 4px 40px 8px color(display-p3 0 0 0/.4)
-72px -50px 40px -60px rgba(var(--theme-color), .05)
```
Two rules fall out of this. **(a) Blur radius is 70–250px, never 10–30px.**
**(b) Alpha is 3–8% for the ambient white glow** (`#ffffff08`, `#ffffff0a`) and only the
one hero accent bloom goes to 40%. **(c) Every raised surface gets a `.5px` hairline
(`inset 0 .5px #ffffff4d` top-light + `0 0 0 .5px #000c` outer-dark) before it gets a shadow.**

Panel gradient: `radial-gradient(100% 100% at 50% 0%, var(--grey-800) 0%, var(--grey-700) 150%)` —
two adjacent near-blacks, top-lit, overshooting to 150%.

Counts: **142 `filter:blur`**, **173 `mask-image`**, 102 `radial-gradient`, 100 `backdrop-filter`,
233 `linear-gradient`. No grain asset (raycast does it with gradients + blur instead).

### Layout / motion `[css]`
- Containers: **1204 / 1064 / 1024 / 1000 / 988 / 840 / 720px.**
- Section padding ≥48px — **18 distinct values**: 48, 50, 64, 70, 72, 90, 96, 100, 120, 128,
  150, 158, 212, 240, 260, 320, 325, 370px. The bulk sits at 48–128; **158/240/320/370 are
  reserved for hero and closing sections.**
- Radius: **12px ×22**, 6 ×19, 4 ×16, 18 ×10, 16 ×9, 10 ×8, 36 ×4.
- Transitions: **.3s ×92, .2s ×50, .15s ×21**. Signature ease `cubic-bezier(.23,1,.32,1)` (×12)
  and `cubic-bezier(.4,0,.22,.96)` (×10) — both long-tailed.
- 11 `grid-template-areas` — the highest in the set. Sections are individually art-directed.

---

## 3. suno.com — grain done properly, warm gold accent

*Music generation. `<html data-theme="dark" data-polarity="dark">`. 945 KB CSS.*

**[refero]** palette `#eeece8 #6b2b15 #472515 #191817 #e25267 #96a799`;
fonts `editorial new, Neue Montreal, Roobert, Libre Caslon`.
**[css]** `Neue Montreal` (sans) + **`PP Editorial New`** (serif display) + `Input Sans`.

### Ground ramp `[css]` — the `dumbo` scale, blue-tinted
```
--color-dumbo-50   #101012   ← --color-background-primary (dark)
--color-dumbo-100  #1c1c1f   ← --color-background-secondary
--color-dumbo-150  #252529   ← --color-background-tertiary
--color-dumbo-200  #2e2e33
--color-dumbo-250  #38383e     --300 #424249   --350 #4e4d55   --400 #5b5b62
--600 #a3a3a3  (body grey, 7.5:1 on ground)   --900 #f7f4ef (warm off-white)
```
Every step carries **+2 to +5 more blue than red.** The light end (`#f7f4ef`, `#edeae4`)
is *warm*. Cool shadows, warm highlights — that is the whole trick.

Translucency scale is explicit and named:
`--color-opacity-white-4 #ffffff0a`, `-10 #ffffff1a`, `-20 #fff3`, `-30 #ffffff4d`,
feeding semantic tokens `--color-background-glass-thin/thick/dense` and
`--color-background-fog-thin/thick/dense`.

**Accent — one, gold.** `#c4a670` (×53) / `#d4a54a` (×30), with `#f5e6c8` as its pale tint.

### Grain `[css]` — exact recipe
```
.auraAnimate::before { background-image: url(https://cdn-o.suno.com/grain.webp);
                       background-repeat: repeat; background-size: cover;
                       opacity: .5; z-index: 1; pointer-events: none; inset: 0 }
.auraAnimate::after  { background-color: #0000004d; z-index: 2 }   /* 30% black scrim */
.auraAnimate         { background-image: url(.../auras/Aura-03.jpg);
                       background-size: 150%; transition: background 1s ease-in-out }
.auraAnimate:hover   { animation: 100s linear infinite … }
```
Three layers over a photographic "aura": **image → grain at 50% → 30% black scrim**, and the
image itself is blown up to 150% and drifts on a **100-second** loop. That is how you get a
photograph to read as a texture rather than as a photograph.

### Type / layout `[css]`
- Display: 8.75rem (140px), 7.5rem (120px), 5rem, 4.5rem, 4.25rem, 3.75rem, 3rem, 2.5rem;
  one fluid `clamp(1.5rem, 6vw, 6rem)` (24 → 96px).
- Line-height `1` ×25 at display; 1.3–1.45 for body.
- Tracking: `-.23rem`, `-.125rem`, `-.09rem`, `-.06rem`, `-.05rem`, `-.0375rem` — i.e.
  **−3.7px down to −0.6px, scaled to size** — plus `.02em ×9` positive for labels.
- **Weights 500 ×22, 400 ×21, 300 ×2, 600 ×4.** Nothing heavier than 600.
- Section padding: 48, 50, 56, 60, 70, 75, 80, 85, 90, 100, 112, 113, 120, 144, 180, 300px.
- Glows are large and coloured but low-alpha:
  `radial-gradient(60% 60% at 50% 44%, #e84e916b 0%, #ad379a42 32%, #68259029 55%, #28124b00 82%)`
  — 42% → 26% → 16% → 0 across four stops.
- Motion: `.2s ×16, .3s ×13, .15s ×7`; eases `cubic-bezier(0,0,.2,1) ×11`, `(.22,1,.36,1) ×5`.

---

## 4. vercel.com — flat black, and how they get away with it

*`theme-color` `#FAFAFA` light / `#000` dark. 899 KB CSS.*

**[refero]** colours array is **empty** — refero has no extraction for this site.
**[css]** `GeistSans` + `Geist Mono` + two pixel display faces.

### Ground `[css]`
`--ds-background-100: #000` and `--ds-background-200: #000` in the dark theme
(a second, older definition in the file resolves to `hsl(0,0%,4%)` = `#0a0a0a` — both ship).
Surfaces above it: `--ds-gray-100 #1a1a1a`, `-200 #1f1f1f`, `-300 #292929`,
`-900 #a0a0a0`, `-1000 #ededed`. Legacy ramp `--accents-1..8`, dark:
`#111 #333 #444 #666 #888 #999 #eaeaea #fafafa`.

**So the ground is literally `#000` — pure black is not avoided here, it is used and then
never left flat.** Four surface values sit above it.

### Type `[css]` — the cleanest tracking ladder in the set
Sizes: 28, 30, 31, 32, 34, 36, 40, 42, 46, 48, 52, 56, 64, 72, 80, 96, 110, 160, 480px.
The paired letter-spacing values reveal the rule:

| Size | Tracking | = em |
|---|---|---|
| 32px | −0.32px | −0.01em |
| 40px | −0.4px | −0.01em |
| 64px | −1.28px | −0.02em |
| 72px | −2.88px | **−0.04em** |
| 84px | −3.36px | −0.04em |
| 96px | −3.84px | **−0.04em** |
| 108px | −4.32px | −0.04em |

**Tracking is −0.01em to 40px, −0.02em at 64px, and −0.04em from 72px up.**
Line-heights ladder in px: 16 / 18 / 20 / 24 / 26 / 28 / 32 / 36 / 40 / 48 / 56 / 64 / 72 —
i.e. **1.0 at display, 1.5 at body.**
**Weights: 550 ×95 and 450 ×40 dominate.** Not 500/600. Variable-font intermediates.

### Layout / effects `[css]`
- Containers: **960px ×65**, 600px ×59 (prose), 624, 640, 768, 800, 1080, 1200px.
- Section padding: 48 ×29, 80 ×19, 64 ×13, 96 ×13, 120 ×7, 160 ×5, 128 ×5, 144 ×3, 192 ×2.
- Radius: 6 ×19, 12 ×18, 4 ×10 — small. Nothing rounded above 16px on content.
- **132 `mask-image`**, 265 `linear-gradient`, 27 `radial-gradient`, only 2 `filter:blur`.
- Only large glow in the whole file: `0 0 30px var(--ds-blue-400), 0 0 60px var(--ds-blue-200)`.
- **No grain, no noise, no texture asset anywhere.**
- Motion: `.2s ×29, .15s ×27, .1s ×12`. Eases `(.4,0,.2,1)`, `(.32,.72,0,1)`, `(.16,1,.3,1)`.

---

## 5. cursor.com — warm near-black, and a serif

*`theme-color`: `#f7f7f4` light / **`#14120b` dark**. 463 KB CSS.*

**[refero]** palette `#9c978b #333028 #8c6a58 #948a6b #f3f8f0 #2e2e28`;
fonts `San Francisco, Arial, Untitled Sans`. (Refero's font detection is wrong here.)
**[css]** `CursorGothic`, `cursorDisplay`, `berkeleyMono`, `Lato`, and **`EB Garamond` (×70)**.

### Ground `[css]` — warm-olive, and this is the whole identity
```
#14120b  L 17.9   ← dark theme-color, the ground
#1b1913  L 25.0
#1c1713  L 23.8
#1d1b15  L 27.0
#201e18  L 30.0
#26241e / #26251e  L 36.0 / 36.7
#2a2921 / #2b2923  L 40.6 / 41.0
```
**Red > green > blue at every step** (`14 12 0b`, `20 1e 18`, `2b 29 23`). It is a warm
near-black — the exact inverse of raycast/suno's cool one. Both read expensive; a *neutral*
`#111` reads as nothing.

- Radius is tiny and deliberate: **2px ×23, 3px ×17, 4px ×5.** Almost no rounding.
- Tracking is mostly **positive**: `.03em ×10, .02em ×9, .05em ×8, .04em ×4` — mono labels.
- Radial glows are top-anchored white washes:
  `radial-gradient(ellipse at 50% 0%, #ffffff1f 0%, #ffffff0a 48%, #fff0 76%)` — **12% → 4% → 0.**
- Motion: `.15s ×7, .3s ×3, 60ms ×2`; eases `(.22,1,.36,1) ×3`, `(.25,1,.5,1)`.
- Section padding: only two values in CSS (156px, 154px); the rest is Tailwind-inlined.
  **Treat cursor's spacing rhythm as unmeasured.**

---

## 6. resend.com — pure-black ground, serif display, real noise textures

*`theme-color #000000`. 970 KB CSS. Radix-based token file.*

**[refero]** palette `#d1d1d1 #585858 #2a2a29 #161616 #56b88d #cecece`; fonts `Inter, ABC Favorit`.
**[css]** `ABC Favorit` (sans) + **`Domaine` (serif display)** + `Commit Mono` + `Inter`.

### Ground ramp `[css]` — pure black plus a cool-teal grey scale
```
--background  #000        ← ground
--gray-1      #141517     L 21.6
--gray-2      #191b1e     L 26.9
--gray-3      #212629     L 37.2
--gray-4      #293034     --gray-5 #333b3e   --gray-6 #3b4345   --gray-7 #434a4d
--gray-8      #52595b     --gray-9 #6e7679   --gray-10 #878d8f
--gray-11     #a1a4a5     ← body text, 8.4:1 on #000
--gray-12     #f0f0f0     ← headings
```
Green and blue exceed red at every step (`14 15 17`, `21 26 29`, `43 4a 4d`) — a cool,
slightly teal near-black family stacked on absolute black.

### Display type `[css]`
Sizes: **160, 140, 120, 9rem (144), 90, 7.5rem (120), 6rem (96), 5rem, 4.8rem, 4rem, 3.5rem, 3.2rem, 3rem, 60, 48, 35, 32, 28px.**
Fluid: `clamp(4rem, 10.26vw, 7.5rem)` = **64 → 120px**; `clamp(4rem, 15vw + .5rem, 5.25rem)` = 64 → 84px.
Line-height at display: **`.84`, `.85`, `1`, `1.07`** — *below one*.
Tracking: `-.2rem` (−3.2px), `-.15rem` (−2.4px), `-.1rem` (−1.6px), `-.045rem`, `-.03em`, `-.02em`.
Weights: 400 / 500 / 600 / 700 — light-forward for a serif at 120px.

### Texture and depth `[css]`
- Real raster textures: `/static/product-pages/noise.png` and `/static/texture-btn.png`
  (the latter composited under a gradient: `url(texture-btn.png), linear-gradient(104deg, #fdfdfd0d 5%, #f0f0e41a 100%)`
  — **5% → 10% white**).
- The dark section backgrounds are two-layer:
  ```
  radial-gradient(100% 100% at 50% 0, #ffffff14 0%, #fff0 100%),
    linear-gradient(210deg, #080808 0%, #000 100%)
  radial-gradient(30% 36% at 0 60%, #ffffff0d 0, #ffffff05 54%, #fff0 100%),
    linear-gradient(#111, #00000080)
  radial-gradient(98% 98% at 96% 94%, #6464641a 0, #6660 100%),
    linear-gradient(138deg, #101010 10%, #0c0c0c 88%)
  ```
  **Every dark panel = a directional near-black gradient (`#101010 → #0c0c0c`, `#080808 → #000`)
  plus a 5–8% white top-light.** Never a flat fill.
- Dot grid: `radial-gradient(#2b2b2b 1px, #0000 1px)`.
- 315 `linear-gradient`, 62 `radial-gradient`, **90 `backdrop-filter`, 82 `mask-image`, 24 `mix-blend-mode`.**
- Motion: `.15s ×57` base; `cubic-bezier(.4,0,.2,1) ×59`. Ambient animations at **1s, 2s, 3s, 6s, 8s, 10s.**

---

## 7. scale.com — huge diffuse coloured washes at 8–12% alpha

*`theme-color #000000`. 746 KB CSS.*

**[refero]** palette `#060707 #b7b5d1 #6f9ad2 #565554 #474e9d #131116`;
fonts `Inter, Aeonik, IBM Plex Mono, Helvetica Neue`.
**[css]** `aeonik` + `Neue Montreal` + `PP Supply Mono` + **`New Forest`** + **`TRJN DaVinci Display`** (two serifs).

- **Prose column `max-width: 640px` — used 195 times.** Then 1024 ×72, 730, 720, 1010, 1042.
- Section padding: **80px ×36** dominates, then 64 ×12, 72 ×6, 60 ×4. One rhythm, held.
- Radius: **16px ×22**, 8 ×9, 24 ×5, 100px ×6.
- Display: 8rem (128), 7.5rem, 6rem, 4.5rem, 4rem, 120px; fluid `clamp(2.5rem, 5vw, 70px)`,
  `clamp(2rem, .5rem + 5vw, 4rem)`. Line-height `1.05 ×23` at display, `1.5 ×38` at body.
- Weights 500 ×50 / 400 ×45.
- **Glow washes — the key numbers:**
  ```
  radial-gradient(50% 36.46%, #7b8fdd14 0%, #05050b00 100%),
  radial-gradient(50% 38.81%, #7b8fdd1f 0%, #05050b00 100%)
  radial-gradient(50% 36.46%, #ffffff0a 0%, #05050b00 100%),
  radial-gradient(50% 38.81%, #ffffff14 0%, #05050b00 100%)
  ```
  **8% and 12% alpha, at 50%-of-container size, fading to `#05050b` (not to `transparent`).**
  Fading a glow to the *ground colour* rather than to `transparent` is why there is no grey halo.
- Layered shadows: `0 0 #000000b3, 0 9px 19px #000000b0, 0 35px 35px #0009, 0 79px 47px #00000059,
  0 140px 56px #0000001a, 0 218px 61px #00000003` — **six stops, opacity descending 70% → 1%.**
  And `inset 0 0 317.538px #ffffff14` — an 8% inner glow at 317px radius.
- Motion: gsap + ScrollTrigger + motion + rive.

---

## 8. column.com — a navy ground, and the closest thing to a "fund" in the set

*Banking infrastructure. `theme-color #0B1B34`. CSS is inline-only (Framer/Webflow-style);
values below are real but from the inlined subset.*

**[refero]** palette `#132049 #f0f1f8 #8d96a0 #5a5e65 #13141b #0f2341`; fonts `Suisse Int'l, Inter`.
**[css]** `SuisseIntl` + `SuisseIntlMono` + `Suisse Neue`.

- Ground is **navy `#0B1B34`**, with `#011219`, `#0f252d`, `#172c34`, `#232730` above it.
  A hue-tinted ground (not grey) is completely viable and reads institutional.
- **`line-height: 1.1` appears 57 times** — every heading, one value.
- Tracking: `-0.01em ×13, -0.02em ×6, -0.03em ×7, -0.004em ×5`.
- **`font-weight: 500` ×84**, 600 ×24, 400 ×11, 300 ×9. Medium-forward.
- **`border-radius: 8px` ×82.** One radius, everywhere. Then 12 ×24, 3 ×44.
- Section padding: **72 ×19, 96 ×12, 144 ×6**, plus 256/410/450 for full-bleed heroes.
- Containers: 1152 / 960 / 920 / 720 / 680px.
- **91 `filter:blur`, 76 `backdrop-filter`, 76 `radial-gradient`.** Enormous washes:
  `radial-gradient(1000px 1500px at top right, rgba(var(--rgb-blue-400),1), rgba(var(--rgb-cyan-400),0))`
  — a **1000×1500px** gradient. Also a mouse-tracked one:
  `radial-gradient(circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(0,0,0,.8) 0%, …, rgba(0,0,0,0) 100%)`.
- Shadow: `inset 0 0 0 1px rgba(0,0,0,0.1), inset 0 -80px 64px -32px rgba(0,0,0,0.25)` —
  an **inset bottom vignette**, which is what makes their cards feel machined.
- Motion: signature `cubic-bezier(0.5,0,0.01,1)` ×86 and `(0.76,0,0.24,1)` ×55 — very slow
  starts. Ambient `2000ms ×43`, transitions `0.6s ×13, 0.8s ×10, 3000ms ×3`.
  **This is a materially slower site than Linear.**

---

## 9. mercury.com — fluid serif display, light weights, animated grain

*Fintech. 323 KB CSS. Ground is light, but the type and grain are the most transferable
things in the whole scrape for a fund site.*

**[refero]** palette `#2e343f #6e6c6c #8c8f99 #b4a39f #8d806d #242334`;
fonts `Arcadia Text, Arcadia Display, IO`.
**[css]** `arcadia` + `arcadiaDisplay` + **`tiemposHeadline`** + `Tiempos Fine` + `IBM Plex Mono`.

### Every display size is fluid `[css]`
```
clamp(2.625rem, .979rem + 4.116vw, 6rem)      /*  42 → 96px  */
clamp(2.25rem,  .79rem  + 3.66vw,  5.25rem)   /*  36 → 84px  */
clamp(2rem,     .75rem  + 3.126vw, 4.563rem)  /*  32 → 73px  */
clamp(1.75rem,  .683rem + 2.668vw, 3.938rem)  /*  28 → 63px  */
```
Four steps, all `clamp(min, rem + vw, max)`. No fixed display sizes at all.
`line-height: 1` at display. **`font-weight: 300 / 320 / 360 / 400` — a light serif at 96px.**

### Grain `[css]` — animated, SVG, zero network cost
```css
.grainSvg {
  background-repeat: repeat;
  background-size: 125px;
  animation: noise .2s steps(1) infinite;
  background-image: url("data:image/svg+xml,<svg width='200' height='200'>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='1'/>
    <feColorMatrix type='saturate' values='0'/></filter>
    <rect width='200' height='200' filter='url(%23n)' opacity='1'/></svg>");
}
@keyframes noise { 0%{background-position:0 0} 10%{-5% -10%} 20%{-15% 5%} 30%{7% -25%} … }
```
`baseFrequency .65`, `numOctaves 1`, desaturated, tiled at **125px**, and **jittered every
200ms in 10 discrete steps.** That last part is what makes it read as film rather than as a
static dirty overlay.

Masks: `linear-gradient(90deg, transparent, black 15%, black 85%, transparent),
linear-gradient(180deg, transparent, black 10%, black 90%, transparent);
mask-composite: intersect` — a four-sided soft vignette.

Motion: `cubic-bezier(.16,0,.13,1) ×9`, `(.2,1,.4,1) ×8`, `(.65,.05,.36,1) ×5`;
`.3s ×8, .5s ×7`, ambient `10s ×2`. gsap + motion + THREE.

**Not measured:** containers, section padding, gaps (all Tailwind-inlined; absent from CSS).

---

## 10. anthropic.com — huge fluid serif, six-layer soft shadow

**[refero]** palette `#141413 #a7845e #b59584 #f3eceb #85613f #da7d5e`;
fonts `San Francisco, Intercom, Styrene B, Styrene A, Tiempos`.
**[css]** `Anthropic Sans`, **`Anthropic Serif`**, `Anthropic Mono`, `Tiempos Text`.

- Dark band colour `#141413` (warm), plus `#1f1e1d`, `#222222`.
- **Display: `clamp(4.6875rem, 7.9545vw − .2443rem, 6.875rem)` = 75 → 110px**, and a second
  at 75 → 96px. Body `clamp(.8125rem, .7226rem + .4496vw, 1.125rem)` = 13 → 18px.
  **Display:body ratio at desktop = 110 / 18 = 6.1×.**
- Tracking only `-.02em` and `-.0025em`. Line-height `1` at display.
- **Weights 400 ×11, 300 ×9.** A 110px serif at weight 300–400.
- **One accent:** `#c6613f` (terracotta).
- Shadow: `0 4px 3px #00000005, 0 10px 8px #00000008, 0 19px 15px #0000000a,
  0 34px 27px #0000000a, 0 63px 50px #0000000d, 0 150px 120px #00000012`
  — **six stops, 2% → 7% max, terminal blur 120px.**
- Motion stack: **gsap + ScrollTrigger + lenis (smooth scroll) + lottie + rive + motion.**
  The heaviest motion stack in the scrape.
- Only 5 `linear-gradient` and 1 `radial-gradient` in the whole file. The richness is all
  typography, shadow and motion — **not** gradients.

---

## 11. runwayml.com — `#0C0C0C` ground, Times Now serif, generous rhythm

**[css]** `abcNormal` (sans) + **`timesNow`** (serif display) + `Courier Prime`.
- Ground **`#0c0c0c`** (`theme-color`), with `#111827`, `#1a1a1a`, `#1f2937` above.
- Display: 128, 124, 120, 100, 96, 84, 80, 72, 70, 64, 56, 52, 50, 48, 44, 40, 36px.
  Fluid ladder, every step: `clamp(3rem, 2.2571rem + 3.0476vw, 5rem)`,
  `clamp(2.25rem, 1.7857rem + 1.9048vw, 3.5rem)`, `clamp(1.75rem, 1.4714rem + 1.1429vw, 2.5rem)`,
  `clamp(1.5rem, 1.3607rem + .5714vw, 1.875rem)`, `clamp(1.25rem, 1.1571rem + .381vw, 1.5rem)`,
  `clamp(.9375rem, 1.0232rem − .0952vw, 1rem)` (body *shrinks* as viewport grows).
- Tracking ladder: `-.14, -.16, -.18, -.32, -.36, -.48, -.54, -.6, -.72, -2px`.
- Line-height `1 ×16`, `1.15 ×9`, `1.2/1.25/1.3` for subheads.
- **Section padding: 48 ×14, 64 ×12, 128 ×12, 80 ×10, 96 ×10, 112 ×8, 100 ×8, 160 ×6,
  144 ×4, 176 ×3, 240 ×2.** Gaps: 48 ×10, 64 ×7, 80 ×7, 96 ×5.
- Containers: 1600 / 1280 / 1040 / 1024 / 900 / 896 / 730 / 672 / 640px.
- **One accent:** `#b8e62e` (acid green). Only 19 `linear-gradient`, 3 `radial-gradient`.
  31 `backdrop-filter`, 14 `filter:blur`.
- Motion: THREE + rive + motion; transitions `.15s ×8, .25s ×5`, ambient `3s ×2, 2s`.

---

## 12. polar.sh — five-step neutral ramp, extreme fluid display

**[refero]** palette `#0c0d0e #58595d #939497 #446ead #7c7c7c #0f1420`; fonts `Inter, Geist Mono`.
**[css]** `Inter` + `InterDisplay` + **`Louize`** (serif).
```
--color-polar-950 #090909   --900 #111111   --800 #181818
--700 #212121   --600 #292929   --500 #757575   --400 #858585 …
```
Five near-blacks, perfectly neutral (R=G=B), even luminance steps of ~7–9 units.
- Display is **entirely fluid, three steps only**:
  `clamp(3rem, 10vw, 11rem)` = **48 → 176px**; `clamp(2.75rem, 7vw, 7rem)` = 44 → 112px;
  `clamp(2rem, 4.5vw, 4rem)` = 32 → 64px.
- **One accent:** `#00d294`.
- Weights 350, 450, 550 present alongside 400/500/600 — variable intermediates again.
- Only **9 distinct `grid-template-columns`** in the whole file. One layout, repeated.

---

## 13. parallel.ai — SVG grain at 5%, and the shadow ramp to copy

**[refero]** palette `#98c2ec #5e99da #1c1c1c #c8e4f9 #fafafa #141414`;
fonts `Gerstner Programm, System Mono, Inter`.
**[css]** `gerstnerProgramm` + `ftSystemMono`. `--color-grey-1000 #101010`, `-900 #181818`, `-800 #434343`.

### Grain `[css]`
```css
.wcard__grain {
  opacity: .05;
  background-image: url("data:image/svg+xml,<svg width='160' height='160'>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter>
    <rect width='160' height='160' filter='url(%23n)' opacity='0.5'/></svg>");
  position:absolute; inset:0; pointer-events:none;
}
```
**Layer opacity `.05` × rect opacity `.5` = 2.5% effective.** `baseFrequency 0.9`,
`numOctaves 2`, **160px tile.** This is the most conservative grain in the set and it is on
a *light* card — on a dark ground you can afford more.

### Shadow ramps `[css]` — six stops, sub-1px first stop
```
0 3px 1px #00000005, 0 7px 3px #00000008, 0 13px 5px #0000000a,
  0 22px 9px #0000000a, 0 42px 17px #0000000d, 0 100px 40px #00000012
0 0 0 .66px #0000000f, 0 1px .5px #00000008, 0 2px .3px #00000005, 0 3.3px .3px #00000003
0 109.25px 43.7px #0000004f, 0 24.4px 9.76px #0000002e, …
```
Opacity ceiling **7%**, terminal blur **40–120px**, and a `.66px` hairline as stop zero.
- **One accent:** `#ff590a`. Halo: `radial-gradient(circle, #0000 0%, #ff590a06 30%, #ff590a0d 60%, #ff590a1a 100%)`
  — **2% → 5% → 10%, inverted** (transparent at the centre, colour at the edge).
- Motion: `--home-ease-out`, `cubic-bezier(.6,0,.2,1) ×98`. **Transitions `.4s ×55`, `.3s ×18`,
  `.6s ×9`, `.8s ×6`, `.7s ×6`** — this site moves noticeably slower than Linear.
- Top-light: `radial-gradient(120% 90% at 50% 0, #ffffff2e, #0000 60%), linear-gradient(#ffffff0d, #1818180a)`
  — 18% → 0 white from the top edge.

---

## 14. Shorter dark entries

**endel.io** — `theme-color #000`, `body{background:#000}`, one typeface (`apercuPro`), one weight (400).
Containers **940px ×51**, 1024 ×33, 724 ×26, 640 ×22. Section padding is a *continuous 4px
ramp*: 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116px each ×12
— a generated utility scale, not an authored rhythm. Radius 12 ×15, 8, 16, 20, 24.
**Zero gradients beyond 10, zero blur, zero grain.** Proof that a dark page can read
premium on typography and spacing alone — but note it is a near-monochrome art project.

**spyglass.so** — near-blacks `#0a0a0a #070b0b #171717 #1a1a1a #1f1f1f #262626 #292929`.
Fonts `Familjen Grotesk`, `Outfit`, **`Playfair Display`**, `Geist Mono`.
**Its glows are the counter-example:** `0 0 30px #d0fe1dcc, 0 0 60px #d0fe1d66` — that is
**80% and 40% alpha at only 30/60px blur.** Small and tight and hot. Compare raycast's
`0 0 172px #ff636366` / `0 0 70px 20px #ffffff08`. Side by side, spyglass reads neon;
raycast reads lit. **This single difference is the clearest cheap-vs-expensive signal found.**

**krea.ai** — near-blacks `#0a0a0a #0a0a0d #0b0b0b #101010 #101114 #141414 #171717 #181818 #1a1a1a #1c1c1c`.
`Suisse Intl`. Display to 165px; tracking `-2.4px` at 96px (=−0.025em), `-1.12px`, `-1.04px`.
Line-height `.95 / 1.0 / 1.05`. **115 `backdrop-filter`, 94 `radial-gradient`, 70 `mask-image`.**
Vignettes everywhere: `radial-gradient(120% 95% at 50% 8%, #0000 0%, #00000059 35%, #0000009e 55%, #000000e0 72%, #000 100%)`
— a **five-stop** darkening ramp over media. Glow `0 0 24px #715eed99, 0 0 40px #67a0e459` (tight — krea is the flashier end).

**stocktwits.com** — a retail-trading site, useful as a *negative* reference.
Ground `#0e0e0f` / `#1c1c1e` / `#2c2c2e` (Apple system greys). `Source Sans 3` only.
**Four accents at once** (`#1b66e7 #9369ee #dd331d #19b682`) and hero washes at
`rgba(0,115,255,.55)` and `rgba(251,104,111,.56)` — **55–56% alpha**, an order of magnitude
hotter than scale.com's 8–12%. Shadow is a single Tailwind default
`0 25px 50px -12px rgba(0,0,0,.25)`. It reads retail, not institutional. The numbers say why.

**ripple.com** — near-black `#141a1f`; `--font-ripple-bds`. Weights **500 ×63, 350 ×23**.
Section padding 48–240px across 18 values. Radius 40/50/60/65/100px — very round.
Brand washes at 60% alpha (`#008cff99`) over near-black; four hue variants of the same
gradient geometry (`44.33% 80.51% at 5.74% 26.1%`) — one shape, recoloured per section.

**dub.co** — `.dark{--background: 0 0% 3.9%}` = **`#0a0a0a`**; surfaces `#171717 ×30`, `#262626`, `#2d2d2d`.
`Satoshi` + `Inter` + `Geist Mono`. **534 `mask-image` and 582 `linear-gradient`** — the highest
mask count in the set; every card edge is feathered. Section padding **56 ×30** dominant,
then 48, 80, 96, 112, 128, 192, 224. Ten accent hues — the busiest palette measured.

**opensea.io / lumalabs.ai / limitless.ai / twelvelabs.io / rox.com** — dark grounds
confirmed (`#050609`/`#060809`, `#050607`, `#030712`, `#0f0f10`, `#0c0a09`) but each ships
too little authored CSS to characterise a full system. Listed for completeness only.

---

## 15. perplexity.ai — the client's reference. **BLOCKED.**

`https://www.perplexity.ai/hub` returned **HTTP 403** to every fetch attempt. No CSS was
read. **No type scale, no ground colour, no spacing, no motion data for this site.**

The only real data available is refero's own extraction (refero site id 421):

**[refero]** dominant colours `#293635 #59aeb1 #378990 #8fa6a4 #4ea3ac #a1afa5`
**[refero]** detected fonts `FK Grotesk`, `FK Grotesk Neue`, `Berkeley`, `Google Sans`

Read literally, that palette is a **dark desaturated blue-green ground (`#293635`,
L 51 — notably *lighter* than any ground measured above) with a single teal-cyan accent
family (`#378990 → #4ea3ac → #59aeb1`) and a desaturated sage mid-grey (`#8fa6a4`,
`#a1afa5`)**. It is a one-hue palette, not six. That is the only defensible statement about
perplexity's colour from this scrape, and the "huge serif type" in the brief is **not
confirmed by any data I could obtain** — refero detected only grotesques.

---

## 16. Shared patterns, with numbers

Counts below are over the sites where the value was actually measurable.

**Ground colour (12 dark grounds confirmed from `theme-color` or a named token):**

| Ground | Site | Tint |
|---|---|---|
| `#000000` | vercel, resend, scale, endel | neutral |
| `#07080a` | raycast | cool (B>R by 3) |
| `#08090a` | linear | cool (B>R by 2) |
| `#090909` | polar | neutral |
| `#0a0a0a` | dub | neutral |
| `#0c0c0c` | runway | neutral |
| `#0f0f10` | twelvelabs | neutral |
| `#101010` | parallel | neutral |
| `#101012` | suno | cool (B>R by 2) |
| `#14120b` | cursor | **warm** (R>B by 9) |
| `#0B1B34` | column | **navy** |
| `#05050b` | scale (glow terminus) | cool |

**The brief's premise that "pure black is rare" is wrong — 4 of 12 use `#000`.** The real
rule is different and stronger: **not one of the twelve leaves the ground flat.** Every
single site layers 3–8 further near-blacks above it.

**Surface ramp depth (named tokens only):** linear **8**, raycast **6**, suno **6**,
resend **6**, polar **5**, vercel **4**, parallel **3**. Median **6**.
**Luminance step between the ground and the first surface: +5 to +12 units.** Never more.
(linear +7, raycast +5, suno +12, polar +8, resend +21 from pure black, vercel +26 from pure black.)

**Borders/hairlines:** linear `#ffffff14` (8%) primary, `#ffffff0d` (5%), `#ffffff1f` (12%),
`#ffffff26` (15%). raycast `inset 0 .5px #ffffff4d` + `0 0 0 .5px #000c`.
suno `--color-opacity-white-4/10/20/30`. cursor `#ffffff1f`.
**Translucent white at 5–15%, not an opaque grey. Universal.**

**Accent count (distinct chromatic hues used for brand, not syntax highlighting):**
raycast **1** (`#ff6363`), polar **1** (`#00d294`), runway **1** (`#b8e62e`),
parallel **1** (`#ff590a`), spyglass **1** (`#d0fe1d`), suno **1** (`#c4a670`),
anthropic **1** (`#c6613f`), column **1 primary** (`#167e6c`) + gradient pair,
linear **2** (`#7170ff` + `#f34e52` for destructive only), cursor 8 but they are terminal
ANSI colours in a product screenshot, not brand.
**The premium marketing sites use ONE accent. Two is the ceiling and the second is functional.**
Sites with 4+ live accents in the hero: stocktwits (4), dub (10), vercel (7) — none of which
reads institutional.

**Type — display size:** 72 (linear), 96–110 (anthropic), 96 (mercury max), 120–160 (resend),
168 (raycast), 176 (polar max), 128 (runway), 165 (krea).
**Display:body ratio: 4.8× (linear), 6.1× (anthropic), 5.3× (mercury), 4–7.5× (resend).
Range 4.8–7.5×. Nobody is below 4.5×.**

**Type — line-height at display:** `.84/.85` (resend), `.95` (krea), `1.0` (linear title-9,
mercury, anthropic, suno, runway), `1.05` (scale), `1.1` (column, cosmos), `1.15` (cosmos).
**Never above 1.15 at ≥64px.**
**At body:** 1.5 (vercel, scale, parallel), 1.6 (linear, raycast, glassnode). **1.5–1.6, always.**

**Type — tracking:** `−0.011em` body (linear) / `−0.01em` (attio, column) →
`−0.022em` (linear display) / `−0.025em` (krea 96px, resend) / `−0.03em` (column, lumalabs) /
**`−0.04em` (vercel ≥72px, lumalabs, dub)**.
**Labels and eyebrows go POSITIVE:** `.2px ×98` (raycast), `.03em ×10` (cursor),
`.02em ×9` (suno), `.4em ×3` (stocktwits), `.2em/.3em` (spyglass, opensea).

**Type — weight:** linear `510/590/680`, vercel `550/450`, mercury `300/320/360`,
anthropic `300/400`, ripple `350/500`, polar `350/450/550`, column `500`, raycast `500`.
**Variable-font intermediates, and display weights of 300–400 wherever a serif is used.**

**Container tiers (three, everywhere):**
outer **1200–1400px** (linear 1376, raycast 1204, column 1152, runway 1280–1600, dub 1400);
content **1024px** (linear, raycast, runway, scale, krea, ripple, limitless);
prose **600–720px** (linear 640 ×95, scale 640 ×195, vercel 600 ×59, raycast 720, column 720).

**Section spacing:** every site has **one dominant value used 2–4× more than any other** —
scale **80px ×36**, dub **56px ×30**, elevenlabs **48px ×30**, vercel **48px ×29**,
column **72px ×19**, ripple **64px ×17** — plus a small set of **outsized values (150–450px)
reserved for hero and closing sections.** raycast: 158/240/260/320/370. column: 256/410/450.
runway: 160/176/240. dub: 192/224.

**Radius:** column **8px ×82** (one value), linear 8 ×39 (ramp 4–32), raycast 12 ×22,
vercel 6/12, scale 16 ×22, cursor **2–3px**, cosmos 40px. **No consensus — but each site
picks one and repeats it.** The ramp, where present, is `4 / 6 / 8 / 12 / 16 / 24 / 32`.

**Motion:** base transition **.15–.2s** (linear .16, vercel .15/.2, resend .15, raycast .3/.2,
suno .2). **Parallel (.4s ×55) and column (.6s/.8s/3000ms) are deliberately slower.**
Ambient loops: linear 1600/2800/3200ms, resend 1–10s, suno 100s image drift, column 2000ms ×43,
mercury 10s. Signature eases: `cubic-bezier(.32,.72,0,1)` (linear, vercel),
`(.16,1,.3,1)` (everywhere), `(.22,1,.36,1)` (cosmos, cartesia, suno, cursor, parallel),
`(.23,1,.32,1)` (raycast), `(.6,0,.2,1)` (parallel), `(0.5,0,0.01,1)` (column).
**All are long-tailed decelerations. Nobody ships `ease` or `linear` for UI.**

---

## 17. Dark sites specifically — what the good ones do that the mediocre ones do not

Each item below is stated as a measured difference, with the sites on both sides.

**1. They never leave the ground flat.** 12/12 dark sites layer 3–8 near-blacks. The
luminance step from ground to first surface is **+5 to +12 units** (linear `#08090a→#0f1011`,
raycast `#07080a→#0c0d0f`, suno `#101012→#1c1c1f`, polar `#090909→#111111`). A card that
jumps 25–30 luminance units above the ground reads as a grey box on black, which is the
single most common cheap-dark tell.

**2. They tint the near-blacks, consistently, in one direction.** raycast `07 08 0a`,
linear `08 09 0a`, suno `10 10 12`, resend `14 15 17` — all cool (B ≥ R+2 at every step).
cursor `14 12 0b`, `20 1e 18`, `2b 29 23` — all warm (R ≥ B+8 at every step). column `#0B1B34`
— navy. **A perfectly neutral `#111111` is what mediocre dark sites use.** Polar is the one
strong site that stays neutral, and it compensates with a 5-step ramp and 176px type.

**3. Hairlines are translucent white at 5–15%, never opaque grey.** linear `#ffffff0d /
14 / 1f / 26`; suno `--color-opacity-white-4/10/20/30`; raycast `inset 0 .5px #ffffff4d`
paired with `0 0 0 .5px #000c`. An opaque `#3f4041`-class hairline is 1.8:1 against a
`#0f1011` ground — roughly **50% too bright** compared to `#ffffff14` (1.21:1).

**4. Glows are large-and-diffuse, not small-and-tight. This is the clearest signal.**
- Expensive: raycast `0 0 250px #fff3`, `0 0 70px 20px #ffffff08`; linear
  `radial-gradient(50% 50%, #ffffff0a 0%, #fff0 90%)` at **400×400 / 800×320px**;
  scale `#7b8fdd14` / `#7b8fdd1f` at 50%-of-container; column `1000×1500px` washes.
  → **blur 70–250px (or gradients ≥400px), alpha 3–12%.**
- Cheap: spyglass `0 0 30px #d0fe1dcc, 0 0 60px #d0fe1d66` (**80%/40% alpha at 30/60px**);
  krea `0 0 24px #715eed99`; stocktwits `rgba(0,115,255,.55)`.
  → **blur under 60px, alpha over 40%. Reads neon.**
- And: scale fades its glows **to `#05050b`, the ground colour, not to `transparent`** —
  which is why there is no grey halo where the glow ends.

**5. Grain is real, and its opacity is specific.** Four working implementations measured:
- linear: PNG, `opacity .9` **with `mix-blend-mode: overlay`**, 256px tile, `.6` subtle
  variant, `.25` per-instance override, plus `#ffffff0f` inside the layer.
- parallel: SVG `feTurbulence fractalNoise baseFrequency 0.9 numOctaves 2`, rect `opacity .5`,
  layer `opacity .05`, 160px tile → **2.5% effective.**
- mercury: SVG `baseFrequency .65 numOctaves 1` + `feColorMatrix saturate 0`, 125px tile,
  **animated `.2s steps(1) infinite`** with a 10-step position jitter.
- suno: `grain.webp` at `opacity .5` over an image, then a `#0000004d` (30%) black scrim.
- exa: `baseFrequency 0.85 numOctaves 1 seed 7`, `background-size: 12%`, `opacity .30`,
  `filter: saturate(1.2) contrast(1.1)` — over a blue gradient, not a near-black.
**The "3% grain" figure in circulation is roughly right for a plain-opacity overlay
(parallel's 2.5%), but the two strongest implementations do not use plain opacity at all —
they use `mix-blend-mode: overlay` (linear) or animate it (mercury).**
Sites with **no grain at all** and still expensive: vercel, raycast, runway, endel, polar.
**Grain is not required. A flat ground is what's fatal.**

**6. One accent. Sometimes two, the second functional.**
raycast 1, polar 1, runway 1, parallel 1, suno 1, anthropic 1, column 1; linear 2.
Against: stocktwits 4, dub 10 — neither reads institutional. Where a second colour appears
on the premium sites it is either a destructive red (linear `#f34e52`) or a tint of the
primary (suno `#c4a670 → #f5e6c8`, linear `#7170ff → #828fff → #18182f`).

**7. Display type is huge, tight, and light.**
≥72px display everywhere; line-height **0.84–1.1**; tracking **−0.02 to −0.04em**;
display:body ratio **4.8–7.5×**. Weight at display is **300–400 with a serif**
(mercury 300/320/360 on Tiempos, anthropic 300/400 on Anthropic Serif, resend on Domaine)
or **500–590 with a sans** (linear 590, vercel 550, column 500, raycast 500).
**Nobody uses 700 for a marketing headline.**

**8. Body copy is 15–17px at line-height 1.5–1.6, at 6–8.5:1 contrast, weight 450–510.**
linear 15px/1.6/`#d0d6e0` (13.6:1) with tertiary `#8a8f98` at 6.1:1; raycast `#9c9c9d` 7.3:1;
suno `#a3a3a3` 7.5:1; resend `#a1a4a5` 8.4:1. **The premium band is 6–8.5:1 — not 12:1, and
not 4.5:1.** Weight is medium (500/510/550), never 400, on a dark ground.

**9. Section rhythm: one dominant value, plus bookends.**
scale 80px ×36; dub 56px ×30; vercel 48px ×29; column 72px ×19; ripple 64px ×17 — each with
a long tail of 2–5 outsized values (150–450px) used only for the hero and the closing CTA.
Sites that use a continuous generated 4px ramp (endel: 48/52/56/…/116 each ×12) have no
rhythm at all — they get away with it only because the page is nearly empty.

**10. Every section is *not* the same layout, but every section *is* the same rhythm.**
raycast ships **11 `grid-template-areas`** — individually art-directed sections — while
holding a single 48–128px padding band with four reserved outsized values. column ships 16
distinct grid definitions and **one radius (8px ×82)** and **one heading line-height (1.1 ×57)**.
**The variation is in composition; the constants are radius, tracking, line-height and rhythm.**

**11. Motion is slow and long-tailed.** Base 150–200ms; premium outliers go slower
(parallel `.4s ×55`, column `.6–.8s`, `3000ms`). Ambient loops 1.6–10s (suno's image drift
is 100s). Every signature ease is a decelerating cubic-bezier with a near-zero final control
point: `(.32,.72,0,1)`, `(.16,1,.3,1)`, `(.22,1,.36,1)`, `(.23,1,.32,1)`, `(.5,0,.01,1)`,
`(.6,0,.2,1)`. **A dark site that animates at 300ms `ease` reads cheap regardless of colour.**

**12. Edges are masked, not cut.** `mask-image` counts: dub **534**, raycast **173**,
vercel **132**, linear **111**, resend **82**, krea **70**, elevenlabs **66**.
Fade-outs at container edges, on scroll rails, under gradients, on shadow strips. Combined
with `filter: blur` counts (raycast **142**, column **91**, scale **29**) this is the second
most reliable cheap/expensive discriminator after glow size. Sites with near-zero of both
(endel, teenage.engineering) survive only because they are near-empty by design.
