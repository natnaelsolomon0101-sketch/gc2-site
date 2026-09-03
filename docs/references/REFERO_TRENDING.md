# Refero — Trending, measured

**Source:** `https://refero.design/search?order=trending`
**Captured:** 2026-09-02

## How this was gathered (and what is *not* in it)

The refero grid is a client-rendered SPA — the HTML shell contains no entries. The list
was read from refero's own JSON API, which the SPA calls:

```
GET https://api.refero.design/v1/search?order=trending
```

**Honest limits — read these before trusting any number below:**

1. **Anonymous access returns 9 records, not the full grid.** The response advertises
   `per_page: 24, pages: 3121, count: 74883`, but every pagination parameter I tried
   (`page`, `p`, `offset`, `per_page`) returned the same first 9 records. Deeper trending
   pages are behind a login. **So the trending set below is 9 entries, not 10–15.** I did
   not pad it with sites from elsewhere on refero.
2. **Refero does not publish type scale, spacing, container width, radius, or
   line-height.** Its per-screenshot record exposes exactly five useful fields:
   `colors` (5 dominant RGB triplets sampled from the screenshot), `fonts`
   (detected family names), `design_patterns`, `page_elements`, and `page_types`.
   There is no typography or layout token data on refero at all.
3. **Therefore every px/rem number in this document was measured from the live site's own
   CSS**, not from refero. Refero was used to *select* the sites and to supply the
   extracted palette and font-family detection. Where a site blocked the fetch, it says so
   and carries no numbers.

Values marked **[refero]** come from refero's API. Values marked **[css]** were read out of
the site's own served stylesheets — these are authored custom-property values, i.e. the
actual design tokens the team ships, not values I eyeballed off a screenshot.

---

## The trending set (all 9)

| # | Site | Product | Refero site page | Refero screen page | Fetched? |
|---|------|---------|------------------|--------------------|----------|
| 1 | Stripe | Payments infrastructure | https://refero.design/9-stripe.com | https://refero.design/pages/a68d654e-eb56-4a6a-be35-b63eb5d7a90d | ✅ full token set |
| 2 | Attio | Data-driven CRM | https://refero.design/37-attio.com | https://refero.design/pages/8f9296d8-6f4b-4b0b-9d04-98feccd358f9 | ✅ full token set |
| 3 | fal | Gen-media inference cloud | https://refero.design/935-fal.ai | https://refero.design/pages/fb342c8c-12c8-4e0a-95e6-6a966b7da351 | ❌ **HTTP 429** |
| 4 | Revolut | Consumer fintech | https://refero.design/13-revolut.com | https://refero.design/pages/978fa6c7-be5c-4245-81e5-6b192797afdc | ✅ full token set |
| 5 | Webflow | No-code site builder | https://refero.design/43-webflow.com | https://refero.design/pages/1db44f44-4f06-4965-a8c8-31df3ebde5b9 | ✅ full token set |
| 6 | Resend | Developer email API | https://refero.design/844-resend.com | https://refero.design/pages/677ba73c-4b23-47c1-bdd4-f865638f98e3 | ✅ full token set |
| 7 | Scale AI | AI data platform | https://refero.design/157-scale.com | https://refero.design/pages/b86762bd-ba79-4bb0-910b-adc53240106e | ✅ full token set |
| 8 | Calendly | Scheduling SaaS | https://refero.design/97-calendly.com | https://refero.design/pages/4a789967-4864-4381-a367-c3f4a270e06b | ⚠️ not studied — app dashboard behind login, low relevance to a marketing site |
| 9 | Seed | DTC probiotics | https://refero.design/923-seed.com | https://refero.design/pages/d0c4cb9b-1043-405b-be62-f222dd49af68 | ❌ **HTTP 403** |

**Studied in depth: 6 of 9.** fal.ai and seed.com actively blocked the fetch (429 / 403) —
for those two, the only real data below is refero's extracted palette and font detection.
Calendly was deliberately skipped.

---

## 1. Attio — attio.com
*Data-driven CRM. Dark-forward marketing site with light product sections. The single most
transferable reference in the set, because it ships a complete, legible token file.*

**[refero] Extracted palette:** `#212327` `#999fa5` `#5f6466` `#3969cd` `#f9f8fa`
**[refero] Detected fonts:** Inter, Intercom, Gilroy
**[css] Actual font stack:** `--font-inter: "inter"`, `--font-inter-display: "interDisplay"`,
`--font-tiempos-text: "tiemposText"` (a serif — used for editorial pull quotes),
`--font-jetbrains-mono: "JetBrains Mono"`

### Type scale [css] — complete, with per-step weight and tracking

| Token | Size | Line-height | Ratio | Weight | Letter-spacing |
|---|---|---|---|---|---|
| `--text-heading-xl` | 4rem / **64px** | 4rem / 64px | **1.00** | 600 | **−0.02em** |
| `--text-heading-lg` | 3.5rem / **56px** | 3.75rem / 60px | 1.071 | 600 | −0.015em |
| `--text-heading-md` | 2.5rem / **40px** | 2.75rem / 44px | 1.10 | 600 | −0.01em |
| `--text-heading-sm` | 2rem / **32px** | 2.25rem / 36px | 1.125 | 600 | −0.01em |
| `--text-heading-xs` | 1.75rem / **28px** | 2.125rem / 34px | 1.214 | 600 | −0.01em |
| `--text-2xl` | 1.5rem / 24px | 1.875rem / 30px | 1.25 | 500 | −0.01em |
| `--text-xl` | 1.25rem / 20px | 1.625rem / 26px | 1.30 | 500 | −0.01em |
| `--text-lg` | 1.125rem / 18px | 1.5rem / 24px | 1.333 | 500 | −0.01em |
| `--text-base` | 1rem / **16px** | 1.375rem / **22px** | **1.375** | 500 | −0.01em |
| `--text-sm` | 0.875rem / 14px | 1.25rem / 20px | 1.428 | 500 | −0.005em |
| `--text-xs` | 0.75rem / 12px | 1.125rem / 18px | 1.50 | 500 | **0** |

Two things to steal outright: **line-height tightens monotonically as size grows** (1.50 at
12px → 1.00 at 64px), and **negative tracking scales with size** (0 at 12px → −0.02em at
64px). Also note **body copy is weight 500, not 400** — every text role below heading is
medium. On a dark ground that is the difference between "readable" and "thin and grey".

### Layout / radius / motion [css]
- **Spacing base:** `--spacing: .25rem` (4px). All spacing is a 4px multiple.
- **Container:** `max-width: 1200px` for the content column; `1536px` for full-bleed
  wrappers. `--breakpoint-lg: 992px`.
- **Prose columns:** `--container-2xl: 42rem (672px)`, `--container-4xl: 56rem (896px)`.
- **Section rhythm (desktop, measured):** `padding-block: 96px`, `padding-block: 60px`,
  and one-off heroes at `padding-top: 111px / 116px / 159px / 198px`.
  Row gaps: `52px`, `60px`, `72px`.
- **Radius ramp:** `2px → 4px → 6px → 8px → 12px → 16px → 20px`
  (`--radius-xs .125rem`, `sm .25`, `md .375`, `lg .5`, `xl .75`, `2xl 1rem`, `3xl 1.25rem`).
- **Motion:** default `.15s`. Named easings shipped:
  `--ease-out: cubic-bezier(0,0,0,1)`, `--ease-in-out: cubic-bezier(.2,0,0,1)`,
  `--ease-emphasized-in-out: cubic-bezier(.2,0,0,1)`,
  `--ease-out-cubic: cubic-bezier(.33,1,.68,1)`,
  `--ease-in-out-expo: cubic-bezier(1,0,0,1)`.
  Dialogs: `.2s var(--ease-in-out-quad)`. Nav transitions: `.2s` move + `.1s` fade.
- **Shadows:** a **seven-layer** ramp, all near-invisible:
  `layer-1: 0 1px 3px rgba(0,0,0,.01)` … `layer-7: 0 64px 128px -32px rgba(0,0,0,.07)`.
  Maximum opacity across the entire ramp is **7%**. Authored in `lab()` with a hex fallback.
- **Dark surfaces:** `--color-black-50 #101010`, `-100 #1c1d1f`, `-200 #202124`,
  `-300 #232529`, `-400 #2e3238`, `-500 #383e47`, `-600 #505967`, `-700 #6f7988`,
  `-800 #8f99a8`, `-900 #a4adba`. Accent: `--color-blue-500 #266df0`.
- **Gradients: 4 occurrences in 472KB of CSS.** Backdrop-filter: 1. They essentially
  don't use either.
- **Card edge on dark:** `inset 0 0 0 1px rgba(255,255,255,.2)` — an inset hairline, not a
  drop shadow.

---

## 2. Scale AI — scale.com
*AI data platform. The darkest page in the trending set (dominant sampled colour `#060707`)
and the closest structural analogue to a fund site: institutional, dark, restrained, with
colour spent only on one gradient family.*

**[refero] Extracted palette:** `#060707` `#b7b5d1` `#6f9ad2` `#565554` `#474e9d`
**[refero] Detected fonts:** Inter, Aeonik
**[css] Actual font stack:** `--font-aeonik: "aeonik"`, `--font-aeonik-mono: "mono"`,
plus `Inter, sans-serif` and display faces `TRJN DaVinci Display`, `New Forest`,
`Neue Montreal`, `PP Supply Mono`.

### Type [css]
Scale does **not** ship a named text scale — it uses fluid `clamp()` per component.
The actual authored clamps:

| Role | Declaration | Min → Max |
|---|---|---|
| Hero display | `clamp(2.5rem, 6vw, 70px)` | 40px → **70px** |
| Hero display (alt) | `clamp(2.5rem, 5vw, 70px)` | 40px → 70px |
| Section head | `clamp(2rem, .5rem + 5vw, 4rem)` | 32px → **64px** |
| Section head (alt) | `clamp(2rem, 4.2vw, 3.4rem)` | 32px → 54.4px |
| Sub-head | `clamp(1.75rem, 3vw, 40px)` | 28px → 40px |
| Lead / eyebrow | `clamp(1.25rem, 2.5vw, 40px)` | 20px → 40px |

Most-used static sizes: **14px** (31×), 1.5rem/24px (29×), .875rem/14px (25×),
1rem/16px (17×), 2rem/32px (13×), 3rem/48px (11×), 2.5rem/40px (10×).
Letter-spacing: `−.01em` (9×), `−.02em` (4×), `−.03em` (3×), and **`+1px` (12×)** —
the positive value is on small uppercase eyebrow labels.

### Layout / radius / motion [css]
- **Spacing base:** `--spacing: .25rem` (4px).
- **Container:** `--plsmc-wide-width: 1280px`, `--plsmc-standard-width: 800px`.
  Heaviest real max-widths: **640px (195×)**, 1024px (72×), 730px, 720px, 1010px.
  The 640px figure is the measure of their body text — they set text narrow and let
  media go wide.
- **Section rhythm (measured):** `gap: 72px` (33×), `padding: 80px` (31×),
  `gap: 105px` (24×), `gap: 64px` (15×), `padding: 40px` (14×), `gap: 96px`, `gap: 62px`.
  So: **72px and 80px are the workhorses; 96–105px is the big break.**
- **Radius:** ramp `2 / 4 / 6 / 8 / 12 / 16 / 24 / 32px` plus `9999px`.
  Most-used in practice: **16px (22×)**, 8px (12×), 5px, 4px, 24px, pill.
- **Motion:** `--default-transition-duration: .15s`. Durations in use:
  `.5s` (7×), `1s` (5×), `.1s` (5×), `.15s` (3×), `.3s`, `75ms`.
  Easings beyond the Tailwind defaults: **`cubic-bezier(.16,1,.3,1)`** (expo-out —
  the "premium" curve), `cubic-bezier(.32,.72,0,1)`, `cubic-bezier(.22,.61,.36,1)`.
- **Dark surfaces:** ground `#000000` (25× as an explicit background), panel `#212121`,
  deeper panel `#191919`, raised `#323232`, hairline-solid `#575757`,
  glass nav `#212121e0`, off-white text `#f2f2f2` / `#eaeaea`.
- **Hairlines on dark — the actual ladder:**
  `rgba(255,255,255,.10)` → `.15` → `.19` → `.20` → `.50`
  (`#ffffff1a`, `#ffffff26`, `#ffffff30`, `#fff3`, `#ffffff80`).
- **Accent:** a single four-stop violet family — `--gradient-color-1 #9068c2`,
  `-2 #5933b2`, `-3 #8a507e`, `-4 #7b8ce7`. That is the *only* chroma in the system.
- **Gradients:** 12 occurrences in 745KB. **Backdrop-filter: 4.** Blur values in use
  include `blur(100px)` — used as a soft colour bloom behind content, never as glass chrome.

---

## 3. Resend — resend.com
*Developer email API. The purest dark-neutral system in the set: refero's extracted palette
is five greys with literally zero chroma.*

**[refero] Extracted palette:** `#656565` `#434443` `#9f9f9f` `#4c4c4b` `#343434`
— **no colour at all.** That is a deliberate result, not a sampling artefact.
**[refero] Detected fonts:** Inter, ABC Favorit
**[css] Actual font stack:** `--font-sans: var(--font-inter)`,
`--font-display: var(--font-abc-favorit)`, `--font-mono: var(--font-commit-mono)`,
plus `--font-domaine` (a serif) and `--font-univers`.
Note the split: **a separate display face from the body face**, and a serif held in reserve.

### The dark grey ramp [css] — 12 steps, copy this
```
--gray-1  #141517   ground
--gray-2  #191b1e   base surface
--gray-3  #212629   card
--gray-4  #293034   raised card
--gray-5  #333b3e   hairline / border
--gray-6  #3b4345   strong hairline
--gray-7  #434a4d   disabled fill
--gray-8  #52595b   placeholder text
--gray-9  #6e7679   muted text
--gray-10 #878d8f   secondary text
--gray-11 #a1a4a5   body text
--gray-12 #f0f0f0   headings
```
Steps 1→5 are the five that matter: **ground, surface, card, raised, line.** The gaps
between them are tiny (`#141517` → `#191b1e` → `#212629`) — roughly 5–8 points of
lightness per step. That is how a dark page gets depth without any of it reading as
"a different colour".

### Type [css]
Standard Tailwind v4 ramp, unmodified: `--text-xs .75rem` → `--text-2xs .625rem` /
`sm .875` / `base 1` / `lg 1.125` / `xl 1.25` / `2xl 1.5` / `3xl 1.875` / `4xl 2.25` /
`5xl 3` / `6xl 3.75` / `7xl 4.5` / `9xl 8rem`.
Line-height is authored as a **ratio computed against the size** —
`--text-base--line-height: calc(1.5 / 1)`, `--text-3xl--line-height: calc(2.25 / 1.875)`,
and **`--text-5xl`/`6xl`/`7xl`/`9xl` are all line-height `1`.**

Hero clamps actually authored:
- `clamp(4rem, 10.26vw, 7.5rem)` → **64px → 120px**
- `clamp(4rem, 15vw + .5rem, 5.25rem)` → 64px → 84px
- `clamp(10px, 2.5vw, 18px)` (caption)

Letter-spacing in px on the display sizes: `−.896px`, `−.64px`, `−.416px`, `−.288px`,
and `−.1rem` / `−.2rem` on the biggest. Also `+.2em` and `+.3em` on micro-labels.

### Layout / radius / motion [css]
- **Container:** `96rem (1536px)`, `92rem (1472px)`, `960px`; text columns `40rem (640px)`,
  `36rem (576px)`, `460px`, `400px`, `360px`.
- **Radius:** most used **12px**, then 4px, 20px, 32px, `.25rem`, `.625rem`, pill, `4rem`.
- **Motion:** `--default-transition-duration: .15s`. In use: `.2s` (12×), `.15s` (7×),
  `.3s` (5×), `.5s`, `.36s`, `.1s`, `.4s`, `75ms`.
  Easings: `cubic-bezier(.4,0,.2,1)` (59× — the default), then
  `cubic-bezier(.36,.66,.6,1)`, `cubic-bezier(0,.24,.54,1)`,
  `cubic-bezier(.77,0,.175,1)`, `cubic-bezier(.645,.045,.355,1)`,
  `cubic-bezier(.6,.12,.34,.96)`.
  Named animations: `--animate-hero-text-slide-up-fade: 1s ease-in-out`,
  `--animate-ai-shimmer-text: 2.5s linear infinite`.
- **Depth on dark — the key move:** `box-shadow: inset 0 0 0 .0625rem #ffffff1a`.
  That's a **1px inset hairline at 10% white**. Their heavier treatment is a
  four-part inset bevel:
  `inset -1px -1px 4px 3px #00000059, inset 1px 1px 4px #ffffff59, inset 8px -8px 16px …`
  — light from top-left, shadow from bottom-right, *inside* the element.
- **Gradients: 3 occurrences in 969KB of CSS.** Backdrop-filter: 2.

---

## 4. Stripe — stripe.com
*Payments. Ships the most complete design system of the six ("HDS"). Two findings here are
worth more than everything else combined.*

**[refero] Extracted palette:** `#484951` `#db6c28` `#655de9` `#9899a9` `#86799c`
**[refero] Detected fonts:** San Francisco, Menlo
**[css] Actual font stack:** `sohne-var, "SF Pro Display", sans-serif`; code `SourceCodePro`.

### Finding 1 — headings are **weight 300**
Every single heading role in HDS is `font-weight: 300`:
```
--hds-font-heading-xxl-weight: 300     --hds-font-heading-lg-weight: 300
--hds-font-heading-xl-weight:  300     --hds-font-heading-md-weight: 300
--hds-font-heading-hero-lg-weight: 300 --hds-font-heading-sm-weight: 300
```
Only `heading-xs` and `heading-xxs` step up — to **400**, not to bold.
And body text is `--hds-font-text-*-weight: 300` throughout.
Stripe achieves authority through *size and space*, never through weight.

### Finding 2 — the dark neutral ramp is **blue-tinted, not grey**
```
--hds-color-core-neutralDark-990  #0d1738   ground
--hds-color-core-neutralDark-975  #101d4e
--hds-color-core-neutralDark-950  #122054
--hds-color-core-neutralDark-900  #182659
--hds-color-core-neutralDark-800  #23356e
--hds-color-core-neutralDark-700  #273f73
--hds-color-core-neutralDark-600  #45639d
--hds-color-core-neutralDark-500  #6480b2
--hds-color-core-neutralDark-400  #839bc8
--hds-color-core-neutralDark-300  #a3b5d6   (--hds-color-text-soft)
--hds-color-core-neutralDark-200  #c0cee6
--hds-color-core-neutralDark-100  #d4deef
--hds-color-core-neutralDark-50   #e3ecf7
--hds-color-core-neutralDark-25   #f2f7fe
```
Not one of these is neutral. Brand-dark runs alongside it:
`brandDark-975 #171055` → `-600 #533afd` → `-100 #c3d3ff`.

### Type scale [css] — note the two values per token (mobile / desktop)
| Role | Mobile | Desktop | Weight |
|---|---|---|---|
| `heading-xxl` | 2.125rem / 34px | **3.5rem / 56px** | 300 |
| `heading-xl` | 1.75rem / 28px | 3rem / 48px | 300 |
| `heading-hero-lg` | 1.75rem / 28px | 2.5rem / 40px | 300 |
| `heading-lg` | 1.375rem / 22px | 2rem / 32px | 300 |
| `heading-md` | 1.25rem / 20px | 1.625rem / 26px | 300 |
| `heading-sm` | 1.125rem / 18px | 1.375rem / 22px | 300 |
| `heading-xs` | 1rem / 16px | — | 400 |
| `text-xxl` | 1.75rem / 28px | 3rem / 48px | 300 |
| `text-xl` | 1.125rem / 18px | 1.25rem / 20px | 300 |
| `text-lg` | 1rem / 16px | 1.125rem / 18px | 300 |
| `text-md` | 1rem / 16px | — | 300 |
| `text-sm` | 0.875rem / 14px | — | 300 |
| `text-xs` | 0.75rem / 12px | 0.875rem / 14px | 300 |

The desktop step is roughly **1.6× the mobile step at the top of the scale** and 1.0× at
the bottom. Display type grows; body type doesn't.

### Spacing scale [css] — a literal, named, 4px-based ladder
```
0, 1px, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80,
88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192, 200
```
(`--hds-space-core-25` = 2px through `--hds-space-core-2500` = 200px, in 8px increments
above 32px.) **Section spacing lives in the 80–200px band.**

- **Radius:** `--hds-space-core-radius-xs 2px`, `sm 4px`, `md 6px`, `lg 16px`,
  `xl 32px`, `round 99999px`. Note the **gap between 6 and 16** — no 8/12 step.
  Cards use `md` (6px) with `--card-radius-inner: 5px` for the nested element
  (outer radius minus border = inner radius, done correctly).
- **Borders:** `sm 1px`, `md 1.25px`, `lg 2px`.
- **Motion:** `--ease: cubic-bezier(0.25,1,0.5,1)`;
  `--hds-accordion-duration: 0.36s` with `--hds-accordion-ease: cubic-bezier(0.65,0.05,0.36,1)`;
  `--card-duration: 800ms` with `--card-ease: cubic-bezier(0.165,0.84,0.44,1)`;
  `--graphic-reveal-duration: 300ms`; `--case-study-carousel-hover-duration: 800ms`.
  **Two speeds: 300–360ms for UI, 800ms for content reveals.**
- **Container:** text column `639px`, wide `939px`.

---

## 5. Revolut — revolut.com
*Consumer fintech. The nearest sector peer in the set, and it publishes the most complete
role-based type system — including a **separate marketing scale** from the product scale.*

**[refero] Extracted palette:** `#614240` `#889339` `#6975b8` `#1f1c1f` `#a19690`
**[refero] Detected fonts:** Inter, Aeonik
**[css] Actual font stack:** `--rui-font-brand: 'Inter'`,
**`--rui-font-marketing: 'Aeonik Pro'`**, plus `'Aeonik Pro Capitalised'`.
The marketing site runs a *different family* from the product.

### Type — product roles vs marketing roles [css]

| Role | Size | Line-height | Tracking (computed) | Weight |
|---|---|---|---|---|
| `display1` | 3.5rem / **56px** | 1.1818 (66px) | −0.56em/56 = **−0.01em** | 700 / 800 |
| `display2` | 2.75rem / 44px | 1.2857 | −0.56em/44 = −0.0127em | 700 / 800 |
| `heading1` | 2rem / 32px | 1.1875 (38px) | −0.35em/32 = −0.0109em | 700 / 800 |
| `heading2` | 1.5rem / 24px | 1.25 (30px) | −0.31em/24 = −0.0129em | 700 / 800 |
| `heading3` | 1.25rem / 20px | 1.4 (28px) | −0.27em/20 = −0.0135em | 700 |
| `body1` | 1rem / 16px | **1.375** (22px) | −0.18em/16 = −0.0113em | 400 / 500 |
| `body2` | 0.875rem / 14px | 1.4286 (20px) | −0.1em/14 = −0.0071em | 400 / 500 |
| `body3` | 0.75rem / 12px | 1.5 (18px) | **0** | 400 / 500 |
| `emphasis4` | 0.6875rem / **11px** | 1.2727 | **+0.16em/11 = +0.0145em** | 500 / 700 |
| **`marketing-display1`** | 3.5rem / **56px** | **1.0** | +0.005em/56 ≈ **0** | — |
| **`marketing-display2`** | 2.5rem / **40px** | **1.0** | ≈ 0 | — |
| **`marketing-display3`** | 2rem / **32px** | **1.0** | ≈ 0 | — |

Read the last three rows carefully. On the **marketing** site Revolut resets line-height to
exactly **1.0** and tracking to **zero** — the product scale's tight negative tracking is
dropped. Marketing display type is set as a solid block; product type is set for reading.
That is a real, deliberate, measurable distinction between the two contexts.

Also: `body3` (12px) and `emphasis3` are the **only** roles with non-negative tracking, and
`emphasis4` (11px) is the only one with *positive* tracking. Small text gets loosened;
large text gets tightened. Same law as Attio.

### Layout / radius / motion [css]
- **Spacing scale:** `s2 2px, s4 4, s6 6, s8 8, s12 12, s16 16, s20 20, s24 24, s32 32,
  s40 40, s48 48, s56 56, s64 64, s72 72`. Named, capped at 72px.
- **Container:** `max-width: 1432px` (full) and `1000px` (content).
- **Radius:** `r2 2px, r4 4, r6 6, r8 8, r12 12, r16 16, r24 24, r32 32, round 9999px`.
  Semantic aliases: `--rui-radius-widget: r16 (16px)`, `--rui-radius-popup: r24 (24px)`.
- **Motion — a named duration ladder, the cleanest in the set:**
  ```
  --rui-duration-xs:  100ms
  --rui-duration-sm:  200ms
  --rui-duration-md:  300ms
  --rui-duration-lg:  450ms
  --rui-duration-xl:  900ms
  --rui-duration-skeleton: 1500ms
  ```
- **Dark ramp (grey-tone, dark theme values):**
  `#111112` → `#19191a` → `#272729` → `#3b3b3d` → `#525254` → `#717173` → `#a1a1a3`
  → `#c9c9cd` → `#e2e2e7`. `--rui-color-black: #191c1f`.
  Foreground on dark: `#f4f4f4`.
- **Accent colours (`action-photo-header-text`):** `#0666eb` blue, `#1326fd` indigo,
  `#4f55f1` iris, `#9539f2` violet, `#f12587` pink, `#bd0049` crimson, `#00b88b` green,
  `#c06800` amber. **Eight chromatic accents over a neutral dark base** — structurally
  identical to the GC2 six-tile system.

---

## 6. Webflow — webflow.com
*No-code site builder. The only light site studied. Included because it ships the most
rigorous **fluid** system — every type and spacing value is a `clamp()` bound to the same
viewport range.*

**[refero] Extracted palette:** `#d6c3b5` `#5c9fae` `#5465b4` `#635b61` `#3c5d69`
**[refero] Detected fonts:** Google Sans, Graphik, Roboto Mono
**[css] Actual font stack:** `--_typography---fonts--primary-font: "WF Visual Sans Variable", Arial, sans-serif`

### The fluid contract [css]
```
--_layout---fluid--min: 20      /* 20rem = 320px  */
--_layout---fluid--max: 90      /* 90rem = 1440px */
--_layout---container--max-width: calc(var(--fluid--max) * 1rem)   /* = 1440px */
```
Every clamp in the system interpolates across that same 320px→1440px window. Nothing
scales on an ad-hoc `vw` value.

### Type scale [css] — min → max, with line-height and tracking

| Role | Min | Max | Line-height | Weight | Tracking |
|---|---|---|---|---|---|
| `h0` | 3rem / **48px** | 7rem / **112px** | **1.04** | 600 | 0em |
| `h1` | 2.75rem / 44px | 5rem / **80px** | **1.04** | 600 | **−0.01em** |
| `h2` | 2rem / 32px | 3.5rem / **56px** | **1.04** | 600 | 0em |
| `h3` | 1.75rem / 28px | 2.5rem / 40px | 1.2 | 600 | 0em |
| `h4` | 1.375rem / 22px | 2rem / 32px | 1.2 | 600 | 0em |
| `h5` | 1.25rem / 20px | 1.5rem / 24px | — | 600 | — |
| `eyebrow` | 1rem / 16px | 1.25rem / 20px | **1.4** | 500 | 0em |
| `button` | 1rem / 16px | — | — | 500 | −0.01em |
| `caption` | 0.8rem / 12.8px | — | — | **550** | 0em |

Note `h0`/`h1`/`h2` all sit at **line-height 1.04** — a single value for all display type,
not a per-step ratio. And `caption` weight **550** — a variable-font intermediate weight.

### Spacing [css] — fluid section rhythm
```
section-spacing--small:        3rem  →  5rem     (48px  →  80px)
section-spacing--medium:       3rem  →  9rem     (48px  → 144px)
section-spacing--large:        3rem  → 15rem     (48px  → 240px)
section-spacing--extra-large: 10rem  → 28rem     (160px → 448px)

spacing--margin-xs:  .375rem →  .5rem   (6px  →  8px)
spacing--margin-sm:  .625rem →  1rem    (10px → 16px)
spacing--margin-md:  1.25rem → 1.5rem   (20px → 24px)
spacing--margin-lg:  1.75rem → 2rem     (28px → 32px)
spacing--margin-xl:  2.25rem → 3rem     (36px → 48px)
grid--gap-xl:         2.5rem → 5rem     (40px → 80px)
```
Four named section rhythms — small / medium / large / extra-large. **The density of a
section is a token, not an improvisation.** That is the single most useful structural idea
in this document.

- **Radius:** `--_components---card--border-radius: .5rem (8px)`,
  `--_components---button--border-radius: .25rem (4px)`.
- Headings use `text-wrap: balance` on `h1`.

---

## 7. fal — fal.ai  ❌ BLOCKED
**HTTP 429 (rate limited) on two attempts.** No CSS retrieved. No type, spacing,
container, radius or motion values are available and none are asserted below.

Only data available, both from **[refero]**:
- Extracted palette: `#1b1b1f` (ground) `#b5e4ee` (pale cyan) `#737376` (mid grey)
  `#5b2fc3` (violet) `#64c2a3` (mint)
- Detected fonts: Focal, Public Sans Rounded, Chivo Mono

Worth noting even from that alone: a near-black ground at `#1b1b1f` carrying a violet and a
pale cyan — the same two-accent structure as GC2's iris/cyan pairing.

## 8. Seed — seed.com  ❌ BLOCKED
**HTTP 403 on two attempts** (bot protection). No CSS retrieved. No numbers asserted.

Only data available, both from **[refero]**:
- Extracted palette: `#9c5e3c` `#dfd3a5` `#232e18` `#a4915e` `#9f9e8d`
- Detected fonts: LINE Seed Sans, Neue Haas Unica Pro

## 9. Calendly — calendly.com  ⚠️ NOT STUDIED
Deliberately skipped: the trending entry is `/app/admin/dashboard`, a logged-in product
surface with no bearing on a marketing site.
**[refero]** palette `#252627` `#9db5d0` `#196eef` `#fafbfb` `#bcb2f6`;
fonts Proxima Nova (+ one undetected).

---

# Shared patterns — the numbers they agree on

Across the six sites with real CSS (Attio, Scale, Resend, Stripe, Revolut, Webflow):

### Spacing — unanimous
**Every one of the six uses a 4px base unit.**
`--spacing: .25rem` in Attio, Scale and Resend; `--hds-space-core-50: 4px` in Stripe;
`--rui-space-s4: 4px` in Revolut; Webflow's smallest margin token is 6px→8px.

Section vertical rhythm, measured across the set:

| Band | Values seen | Where |
|---|---|---|
| Tight | 40, 48px | Scale `padding:40px`, Webflow small min |
| **Standard** | **60, 64, 72, 80px** | Attio `padding-block:60px`; Scale `gap:72px` (33×), `padding:80px` (31×), `gap:64px`; Revolut caps at `s72` |
| **Large** | **96, 104, 105, 112, 120px** | Attio `padding-block:96px`, `padding-bottom:120px`; Scale `gap:105px` (24×), `gap:96px`; Stripe ladder |
| Hero / statement | 144, 160, 198, 240px | Attio `padding-top:159/198px`; Webflow medium max 144px, large max 240px |

**Consensus: 80px standard, 96–120px large, 160–240px for a hero or a deliberate silence.**

### Container width
| Site | Full | Content | Text measure |
|---|---|---|---|
| Attio | 1536px | **1200px** | 672–896px |
| Scale | — | **1280px** | **640px** (195 uses) |
| Resend | 1536px | 960px | 576–640px |
| Stripe | 939px | 939px | 639px |
| Revolut | **1432px** | 1000px | — |
| Webflow | **1440px** | 1440px | — |

**Consensus: 1200–1440px page container; 640px text measure.** The 640px figure is
remarkably consistent — five of six sites set body copy between 576 and 672px.

### Type scale
- **Body is 16px everywhere.** Six of six. Secondary 14px, micro 12px, tiny 11px
  (Revolut `emphasis4`) or 10px.
- **Display tops out at 56–70px on a normal marketing page.** Attio 64px, Stripe 56px,
  Revolut 56px, Scale 70px. Webflow's 112px `h0` is the outlier and belongs to a
  hero-only role.
- **Line-height inverts with size.** 1.5 at 12px → 1.375 at 16px → 1.25 at 24px →
  1.1 at 40px → **1.0–1.04 at display**. Attio, Revolut and Webflow all land at 1.00–1.04
  for their largest step; Resend hard-sets `line-height: 1` on `text-5xl` and above.
- **Tracking scales negatively with size.** 0 or positive at ≤12px → −0.005em at 14px →
  −0.01em through the middle → **−0.015em to −0.02em at display**.
  Only micro-labels get positive tracking (Revolut +0.0145em at 11px; Scale +1px on
  uppercase eyebrows).
- **Weight is not how these sites signal importance.** Stripe sets *every* heading at 300.
  Attio sets body at 500 and headings at 600 — a 100-point spread across the entire site.
  Webflow: headings 600, captions 550. Only Revolut goes to 700/800, and it's a consumer
  brand.

### Radius
Ramps, aligned:
- Attio: 2 / 4 / 6 / 8 / 12 / 16 / 20
- Scale: 2 / 4 / 6 / 8 / 12 / 16 / 24 / 32 / pill
- Revolut: 2 / 4 / 6 / 8 / 12 / 16 / 24 / 32 / pill
- Stripe: 2 / 4 / 6 / **16** / 32 / pill
- Resend: 4 / 12 / 20 / 32 / pill
- Webflow: button 4, card 8

**Consensus ramp: 2, 4, 6, 8, 12, 16, 24, 32, pill.**
Most-used card radius in practice: **12–16px** (Scale 16px 22×, Resend 12px 6×,
Revolut `--radius-widget: 16px`). Controls and buttons: **4–8px**.
Stripe's nested-radius rule is worth adopting verbatim: `--card-radius: 6px` with
`--card-radius-inner: 5px` — inner radius = outer minus border width.

### Motion
- **Default transition: 150ms.** Literally identical in Attio, Scale and Resend
  (`--default-transition-duration: .15s`).
- **A three- or four-rung duration ladder.** Revolut names it outright:
  `100 / 200 / 300 / 450 / 900ms`. Stripe runs `300–360ms` for UI and `800ms` for
  content reveals. Resend's most-used is 200ms.
- **Easing: `cubic-bezier(.4,0,.2,1)` is the default everywhere** (59 uses in Resend
  alone). The *premium* curves — the ones used on the expensive-feeling moments — are:
  - `cubic-bezier(.16,1,.3,1)` — expo-out. Scale AI.
  - `cubic-bezier(0,0,0,1)` — Attio's `--ease-out`. Even more extreme.
  - `cubic-bezier(.2,0,0,1)` — Attio's `--ease-emphasized-in-out`.
  - `cubic-bezier(0.165,0.84,0.44,1)` — Stripe's `--card-ease`, paired with 800ms.
  - `cubic-bezier(0.25,1,0.5,1)` — Stripe's general `--ease`.
  All of these front-load the motion and settle slowly. **Nothing in the set uses a
  bounce or overshoot on a marketing surface.**

### Shadows and gradients — the negative finding
| Site | `linear-gradient` count | `backdrop-filter` count | CSS size |
|---|---|---|---|
| Attio | **4** | 1 | 472 KB |
| Scale | 12 | 4 | 745 KB |
| Resend | **3** | 2 | 969 KB |

Three of the most-copied sites on the internet use, between them, **19 gradients across
2.2 MB of CSS.** Attio's entire shadow ramp — seven layers — peaks at **7% opacity**.
Depth in 2026 is not made of gradients or drop shadows.

---

# Dark sites specifically

**Dark or dark-dominant in the trending set:** Scale AI (`#060707`), fal (`#1b1b1f`,
blocked), Attio (dark-forward with light sections), Resend (`#141517`), Stripe (dark theme
shipped alongside light), Revolut (dark theme shipped alongside light).
**Light:** Webflow, Seed, Calendly.

Six of nine trending entries ship a dark surface. Here is what they do that the light ones
do not.

### 1. They build a ramp, not a background
A light site can get away with `#fff` and one grey. A dark site cannot — flat dark reads
as cheap immediately. All four dark systems ship a **5-plus step near-black ramp with
tiny gaps between steps**:

| Step | Resend | Revolut | Scale | Stripe | *GC2 today* |
|---|---|---|---|---|---|
| ground | `#141517` | `#111112` | `#000000` | `#0d1738` | `#0f1011` |
| base surface | `#191b1e` | `#19191a` | `#191919` | `#101d4e` | `#090a0b` |
| card | `#212629` | `#272729` | `#212121` | `#122054` | `#2e2e2e` |
| raised | `#293034` | `#3b3b3d` | `#323232` | `#182659` | — |
| hairline | `#333b3e` | `#525254` | `#575757` | `#23356e` | `#3f4041` |
| muted text | `#878d8f` | `#717173` | — | `#6480b2` | — |
| body text | `#a1a4a5` | `#a1a1a3` | `#eaeaea` | `#a3b5d6` | `#9f9fa0` |
| headings | `#f0f0f0` | `#f4f4f4` | `#f2f2f2` | `#e3ecf7` | `#f5f5f7` |

The lightness gap between ground → base → card is only **5–8 points** in every case.
GC2's current jump from `#0f1011` to `#2e2e2e` is roughly **19 points** — larger than any
of the four references, and it skips the "base surface" and "raised" rungs entirely.
Revolut is the closest match to the existing GC2 tokens and shows exactly what's missing:
`#19191a` between the ground and the card, and `#3b3b3d` above the card.

### 2. Headings never go to pure white; body never goes to pure grey
Not one of the four uses `#ffffff` for text. `#f0f0f0` / `#f2f2f2` / `#f4f4f4` / `#e3ecf7`.
And body text sits at `#a1a4a5` / `#a1a1a3` / `#a3b5d6` — around **62–65% lightness**,
never below. GC2's `#9f9fa0` ash is right on the money and `#f5f5f7` cloud is correct.

### 3. Depth comes from an inset hairline, not a shadow
This is the single biggest technical difference between the light and dark sites.
A drop shadow is invisible on black. So instead:
- **Resend:** `box-shadow: inset 0 0 0 .0625rem #ffffff1a` — a 1px inset ring at 10% white.
- **Attio:** `--tw-shadow: inset 0 0 0 1px rgba(255,255,255,.2)` on dark cards.
- **Scale:** solid alpha borders in a strict ladder —
  `#ffffff1a` (10%) for a resting card, `#ffffff26` (15%) for an emphasised card,
  `#fff3` (20%) for a hovered/active card, `#ffffff80` (50%) for a focused element.

The rule the light sites do the opposite of: **on light, the edge is a shadow below;
on dark, the edge is a line of light on top.**

Resend goes furthest, with a full inset bevel on its premium surfaces:
```
inset -1px -1px 4px 3px rgba(0,0,0,.35),
inset  1px  1px 4px      rgba(255,255,255,.35),
inset  8px -8px 16px     …
```
— highlight from the top-left, shade from the bottom-right, entirely inside the box.

### 4. Colour is spent in exactly one place, and it's not the background
- **Scale AI:** the entire chromatic budget is four violet stops
  (`#9068c2 #5933b2 #8a507e #7b8ce7`) — used as a `blur(100px)` bloom *behind* content,
  never as a fill. 12 gradients in 745KB.
- **Resend:** zero chroma in its dominant palette. Colour appears only in a semantic
  status set (`--color-emerald-400 #00d294`, `--color-red-400 #ff6568`).
- **Revolut:** eight accents over a neutral dark ramp
  (`#0666eb #1326fd #4f55f1 #9539f2 #f12587 #bd0049 #00b88b #c06800`) — deployed one at a
  time, per section, exactly as GC2's six chromatic tiles are meant to work.
- **Stripe:** hue lives *in the neutrals* instead. The dark ramp is blue
  (`#0d1738` → `#a3b5d6`) so the page has warmth built into the grey, and the accent
  (`#533afd`) sits on top of a base that already agrees with it.

Two viable strategies, and they are mutually exclusive: **either tint your neutrals and
keep one accent (Stripe), or keep your neutrals dead-neutral and rotate a set of accents
(Revolut / GC2).** Doing both makes the page muddy.

### 5. Blur is a light source, not a material
`backdrop-filter` counts are tiny (Attio 1, Resend 2, Scale 4). Where blur *does* appear on
dark, the value is enormous — **`blur(100px)`** — because it is being used as a soft glow
behind an element, not as frosted glass over content. The only true glass use is the nav:
Scale's `--nav-dropdown-background: #212121e0` (88% opaque panel) with
`backdrop-filter: saturate(180%) blur(30px)`.

### 6. Dark sites lean harder on the mono/numeric face
Three of the four dark systems ship a monospace and use `font-variant-numeric: tabular-nums`
/ `font-feature-settings: "tnum"`: Attio (`JetBrains Mono`), Resend (`Commit Mono`),
Scale (`aeonik-mono`, `PP Supply Mono`), Stripe (`SourceCodePro`). On a dark institutional
page, mono at 11–12px with `+1px` tracking is what carries data labels, tickers, and
figures — and `tnum` is what stops the numbers jittering.
