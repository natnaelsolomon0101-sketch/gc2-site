# GC2 — Build prompt

Plug-in brief for the dark home page. Every number here was measured from a live
production site's own CSS custom properties; the source is named in brackets after each
value. Evidence and per-site detail: `docs/references/REFERO_TRENDING.md`.

Reference set (refero trending, 2026-09-02, six sites with retrievable CSS):
**Attio**, **Scale AI**, **Resend**, **Stripe**, **Revolut**, **Webflow**.

---

## The visual target

A near-black institutional page that reads as *quiet and expensive* rather than dark and
loud. The ground is a five-step near-black ramp with only 5–8 points of lightness between
adjacent steps, so surfaces separate by the thinnest possible margin and the page never
looks like two flat slabs stacked on each other [Resend, Revolut, Scale]. Depth is made
entirely of **1px inset hairlines of white at 10–20% opacity** — the light-on-dark
inversion of a drop shadow — because a shadow is invisible on black [Resend, Attio, Scale].
Authority comes from scale and space, never weight: display type runs to 56–70px at
line-height 1.0–1.04 with −0.02em tracking, body sits at 16px/22px, and the gap between the
two is where the money shows [Attio, Stripe, Revolut, Webflow]. Colour is rationed to one
tile at a time — six chromatic accents rotating over a dead-neutral base, exactly the
Revolut pattern of eight accents over `#111112`. There are no page-wide gradients: the
three most-copied sites in the set ship **19 gradients across 2.2MB of CSS between them**,
and Attio's entire seven-layer shadow ramp peaks at 7% opacity. Motion is 150ms for hover,
300ms for state, 800ms for a content reveal, on a front-loaded curve that settles slowly —
`cubic-bezier(.16,1,.3,1)` [Scale] or `cubic-bezier(0,0,0,1)` [Attio] — and never bounces.

---

## Tokens

### 1. The dark ramp — extend the existing one

The current GC2 ramp jumps from `#0f1011` to `#2e2e2e`: **~19 points of lightness in one
step.** No reference site jumps more than 8. Revolut's dark ramp is the closest match to
the GC2 tokens already in the file and shows exactly which rungs are missing.

```css
--gc-ground:   #0f1011;   /* obsidian — keep. page ground                        */
--gc-abyss:    #090a0b;   /* keep. inverted band only                            */
--gc-surface:  #17181a;   /* NEW. base surface under cards   [Revolut #19191a]   */
--gc-card:     #212325;   /* NEW. replaces graphite as the default card
                             [Resend #212629, Scale #212121, Revolut #272729]    */
--gc-raised:   #2e2e2e;   /* graphite — demote to hover/raised card              */
--gc-line:     #3f4041;   /* steel — keep. hairline                     [Revolut #3b3b3d] */
--gc-line-hi:  #525254;   /* NEW. emphasised hairline        [Revolut #525254]   */
--gc-muted:    #7c7d7d;   /* fog — keep                                          */
--gc-body:     #9f9fa0;   /* ash — keep    [Revolut #a1a1a3, Resend #a1a4a5]     */
--gc-heading:  #f5f5f7;   /* cloud — keep  [Revolut #f4f4f4, Resend #f0f0f0]     */
```

**Rule:** no text on the page is `#ffffff`. Not one of the four dark reference systems uses
pure white for type. `pure` stays for the wordmark and primary button fill only.

### 2. Hairlines — the depth system

Replace every dark-card shadow with an inset ring. This is the ladder, taken verbatim
from Scale AI's alpha-border values:

```css
--edge-rest:   inset 0 0 0 1px rgb(255 255 255 / 0.10);  /* #ffffff1a — resting card  */
--edge-hover:  inset 0 0 0 1px rgb(255 255 255 / 0.15);  /* #ffffff26 — hover         */
--edge-active: inset 0 0 0 1px rgb(255 255 255 / 0.20);  /* #fff3    — active/current */
--edge-focus:  inset 0 0 0 1px rgb(255 255 255 / 0.50);  /* #ffffff80 — focus         */
```
[Resend ships this as `box-shadow: inset 0 0 0 .0625rem #ffffff1a`; Attio as
`inset 0 0 0 1px rgba(255,255,255,.2)`.]

For the one or two surfaces that need to feel physically raised, Resend's inset bevel —
highlight top-left, shade bottom-right, both inside the box:
```css
--edge-bevel: inset -1px -1px 4px 3px rgb(0 0 0 / .35),
              inset  1px  1px 4px     rgb(255 255 255 / .35);
```
Use it on at most one element on the page.

### 3. Type scale

Keep DM Serif Display + Inter. Add a mono for data — every dark reference ships one
(Attio: JetBrains Mono, Resend: Commit Mono, Scale: aeonik-mono, Stripe: SourceCodePro).

The scale below follows the two laws all six sites obey: **line-height tightens as size
grows, and tracking goes more negative as size grows** [Attio's ramp runs 1.50/0em at 12px
to 1.00/−0.02em at 64px; Revolut's runs 1.5/0 at 12px to 1.18/−0.01em at 56px].

| Role | Mobile | Desktop (≥768px) | Line-height | Tracking | Weight | Face |
|---|---|---|---|---|---|---|
| `t-display` | 40px | **64px** | **1.00** | **−0.02em** | 400 | DM Serif |
| `t-display-sm` | 32px | **48px** | 1.04 | −0.015em | 400 | DM Serif |
| `t-heading-lg` | 28px | **36px** | 1.10 | −0.01em | 400 | DM Serif |
| `t-heading-sm` | 22px | **26px** | 1.20 | −0.01em | 500 | Inter |
| `t-sub` | 18px | 20px | 1.40 | −0.01em | 400 | Inter |
| `t-body` | 16px | 16px | **1.375 (22px)** | −0.01em | **450–500** | Inter |
| `t-small` | 14px | 14px | 1.428 (20px) | −0.005em | 450 | Inter |
| `t-mono` | 12px | 12px | 1.50 (18px) | **+0.08em, uppercase** | 500 | Mono |
| `t-mono-xs` | 11px | 11px | 1.27 | **+0.0145em** | 500 | Mono |

Notes with their sources:
- **Display caps at 64px.** Attio 64, Stripe 56, Revolut 56, Scale 70. Webflow's 112px is a
  hero-only outlier. Do not exceed 70px on this page.
- **The mobile display is 40px, not a scaled-down 64.** Stripe ships two literal values per
  token — `heading-xxl` is 34px mobile / 56px desktop. Display type grows across the
  breakpoint; body type does not move at all.
- **Body weight goes up, not down.** Attio sets *every* text role at weight 500. On a dark
  ground, 400 Inter at 16px reads thin and grey. If the variable axis is available, 450.
- **Positive tracking only below 12px.** Revolut's `emphasis4` (11px) is the single role in
  its whole system with positive tracking (+0.0145em); Scale puts `+1px` on uppercase
  eyebrows. Everything larger is negative.
- **`font-variant-numeric: tabular-nums` on every figure.** Attio, Resend, Scale and Stripe
  all ship `tnum`. A fund page showing numbers that jitter on hover is the tell.
- `text-wrap: balance` on the hero h1 [Webflow ships this on `h1`].

### 4. Spacing

4px base — unanimous across all six sites (`--spacing: .25rem` in Attio, Scale and Resend;
`--hds-space-core-50: 4px` in Stripe; `--rui-space-s4: 4px` in Revolut).

```
2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72 · 80 · 96 · 120 · 160
```
[Stripe ships this exact ladder as `--hds-space-core-25` through `-2000`; Revolut as
`s2`…`s72`.]

**Section rhythm is a named token, not an improvisation** — this is Webflow's single best
idea (`--_layout---section-spacing--small/medium/large/extra-large`). Four densities:

```css
--band-tight:  clamp(48px, 6vw,  64px);   /* dense rows, facts, footer  */
--band-base:   clamp(64px, 8vw,  96px);   /* default   [Scale gap:72 ×33, padding:80 ×31] */
--band-large:  clamp(80px, 10vw, 120px);  /* between major movements   [Attio padding-block:96, padding-bottom:120] */
--band-hero:   clamp(96px, 14vw, 200px);  /* hero and closing silence  [Attio padding-top:159/198] */
```
The current site uses `padding-block: 80px` on every band. That is why it reads flat: the
page has one density. **Every adjacent section must differ by at least one rung.**

### 5. Container

```css
--page-max:  1280px;   /* up from 1200  [Scale --plsmc-wide-width:1280, Revolut 1432, Webflow 1440] */
--page-wide: 1440px;   /* full-bleed wrappers                                   */
--measure:   640px;    /* body text column — five of six sites land 576–672px.
                          Scale uses max-width:640px in 195 places.             */
--gutter:    24px;     /* mobile inline padding — keep                          */
```
The 640px measure is the most consistent single number in the entire reference set. Body
copy never runs the full 1280.

### 6. Radius

Consensus ramp across the set: `2 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · pill`.

```css
--radius-control: 8px;   /* buttons, inputs — keep  [Webflow button 4, Attio lg .5rem] */
--radius-card:    16px;  /* keep — most-used card radius in the set
                            [Scale 16px ×22, Revolut --radius-widget:16px]      */
--radius-tile:    24px;  /* DOWN from 30px. 30 is off-ramp; 24 is on it.
                            [Scale --radius-3xl 1.5rem, Revolut r24]            */
--radius-inner:   15px;  /* nested element inside a 16px card, minus the 1px border.
                            [Stripe: --card-radius 6px / --card-radius-inner 5px] */
```

### 7. Motion

```css
--dur-hover:  150ms;   /* identical --default-transition-duration in Attio, Scale, Resend */
--dur-state:  300ms;   /* [Revolut --rui-duration-md:300ms, Stripe --graphic-reveal:300ms] */
--dur-panel:  450ms;   /* [Revolut --rui-duration-lg:450ms]                       */
--dur-reveal: 800ms;   /* [Stripe --card-duration:800ms]                          */

--ease-ui:      cubic-bezier(.4, 0, .2, 1);      /* default everywhere; Resend uses it 59× */
--ease-out-exp: cubic-bezier(.16, 1, .3, 1);     /* [Scale] the premium curve       */
--ease-settle:  cubic-bezier(.165, .84, .44, 1); /* [Stripe --card-ease, paired w/ 800ms] */
--ease-emph:    cubic-bezier(.2, 0, 0, 1);       /* [Attio --ease-emphasized-in-out] */
```
No bounce, no overshoot. Nothing in the reference set uses one on a marketing surface. Keep
the existing split of opacity from transform, and keep everything behind
`prefers-reduced-motion`.

---

## Section-by-section spec

The organising principle is **density alternation**. Read down the "band" and "surface"
columns: no two adjacent sections share both. This is what a page with six figures behind
it does that a template does not.

| # | Section | Band | Surface | Container | Colour |
|---|---|---|---|---|---|
| 0 | Nav | — | glass over ground | `--page-max` | none |
| 1 | Hero | `--band-hero` | `--gc-ground` | `--measure` for text | none |
| 2 | Proof strip | `--band-tight` | `--gc-ground`, hairline top+bottom | `--page-max` | none |
| 3 | Positioning statement | `--band-large` | `--gc-abyss` | `--measure` | none |
| 4 | Pinned strategies | tall (pinned) | `--gc-ground` | `--page-max` | **all six tiles** |
| 5 | Track-record figures | `--band-base` | `--gc-surface` | `--page-max` | none |
| 6 | Insight cards | `--band-base` | `--gc-ground` | `--page-max` | one accent hairline each |
| 7 | Contact band | `--band-large` | `--gc-abyss` | `--measure` | none |
| 8 | Footer | `--band-tight` | `--gc-abyss` | `--page-max` | none |

### 0. Nav
Sticky, 72px. Ground at 88% opacity with `backdrop-filter: saturate(180%) blur(30px)`.
That exact recipe is Scale AI's: `--nav-dropdown-background: #212121e0` + the saturate/blur
pair. **Saturate is not optional** — without it a blurred dark nav goes grey and dead.
Bottom hairline `--edge-rest` only after scroll > 8px, cross-fading over `--dur-hover`.

### 1. Hero — `--band-hero`, the loosest thing on the page
`t-display` at 64px/1.00/−0.02em, `text-wrap: balance`, constrained to `--measure` (640px)
even though the container is 1280 — the whitespace to the right of the headline is the
statement. `t-mono` eyebrow 12px uppercase +0.08em above it, in `--gc-muted`, separated by
`--band-tight`/2 = 24px. Subhead `t-sub` at 20px in `--gc-body`, max 480px.

The whole block enters once: opacity 620ms `--ease-ui`, 14px rise 800ms `--ease-settle`
[Stripe pairs 800ms with exactly this curve for content reveals]. Never gate the LCP
element behind a long transform.

*From:* Attio (`padding-top: 159–198px` on hero blocks), Stripe (`--card-duration: 800ms`
`--card-ease: cubic-bezier(.165,.84,.44,1)`), Webflow (`text-wrap: balance` on h1).

### 2. Proof strip — `--band-tight`, the densest thing on the page
Immediately after the hero's 200px of air, a 48px band. Four to five figures on one row,
divided by 1px `--gc-line` verticals. Figures in **mono, `tabular-nums`, 26px**; labels in
`t-mono-xs` 11px uppercase `--gc-muted`.

The point is the collision: **200px of silence, then a hard 48px rule of data.** That
contrast is the entire reason this section exists. Do not give it a heading.

*From:* Attio (`row-gap: 52/60/72px` grids after tall hero padding), Stripe/Attio/Resend/
Scale (all ship `tabular-nums` / `"tnum"`).

### 3. Positioning statement — `--band-large`, wide silence
Single paragraph, `t-heading-lg` 36px DM Serif at line-height 1.10, capped at 22em.
Surface drops to `--gc-abyss` `#090a0b`. **No card, no border, no eyebrow.** One
paragraph on a darker ground with 120px above and below.

Set on `--gc-heading`, but with the last sentence in `--gc-body`. Reference sites signal
hierarchy inside a block with colour, not weight or size.

*From:* Stripe (every heading weight 300 — authority via scale and space, never weight),
Webflow (`section-spacing--large` = 48→240px fluid).

### 4. Pinned strategies — keep, but fix the tiles
Structure is right. Three changes, all measured:

- **Tile radius 30px → 24px.** No reference ships a 30px radius; 24 and 32 are the ramp
  steps [Scale `--radius-3xl: 1.5rem`, Revolut `--rui-radius-r24`].
- **Inactive tiles get `--edge-rest`; the active tile gets `--edge-active` (20% white) and
  full chroma.** Right now the transition is chroma-only, which is why the panel reads as a
  colour swap rather than a focus change. Scale's ladder does the work: 10% resting,
  15% emphasised, 20% active.
- **Chroma is the *only* thing that moves.** No scale, no shadow, no lift. Transition
  `background-color` + `box-shadow` over `--dur-state` (300ms) on `--ease-out-exp`.

The GC2 six-tile system is structurally identical to Revolut's eight
`--rui-color-action-photo-header-text` accents (`#0666eb #1326fd #4f55f1 #9539f2 #f12587
#bd0049 #00b88b #c06800`) deployed one at a time over a neutral `#111112` base. Keep the
per-tile foreground values from DESIGN.md — white on `pale-iris` is 1.55:1 and fails.

*From:* Revolut (accent rotation over dead-neutral ground), Scale (the alpha-border ladder),
Attio (`--ease-emphasized-in-out`, dialogs at 200ms).

### 5. Track-record figures — `--band-base`, `--gc-surface`
A new section, and the one that makes it read as a *fund* rather than a studio.
Two- or three-column figure grid on `--gc-surface` `#17181a` — the first use of that rung,
so the section separates from the ground by 8 points of lightness and nothing else.
No card fills; the grid is defined by `--gc-line` hairlines alone.

Figures in mono `tabular-nums` at 40px, labels `t-mono-xs` 11px uppercase.
Column gap 72px, row gap 48px [Scale: `gap: 72px` appears 33×, its single most-used gap].
Every figure carries the "Illustrative" marker per DESIGN.md content rules.

*From:* Scale AI (`gap: 72px`, `padding: 80px`, 640px text measure, hairline-only grids),
Resend (the 5–8 point surface step).

### 6. Insight cards — `--band-base`, back to `--gc-ground`
Three cards on `--gc-card` `#212325` at `--radius-card` 16px, padding 32px,
`--edge-rest` — **no shadow, no gradient**. Inner elements use `--radius-inner` 15px
[Stripe's `--card-radius-inner` = outer minus border width].

Each card carries a **2px top rule in one of the six accents** — the only place chroma
appears outside the pinned panel. This is where the tile system pays off twice.

Hover: `--edge-rest` → `--edge-hover` (10% → 15%) and background `--gc-card` →
`--gc-raised` `#2e2e2e`, both over `--dur-hover` 150ms on `--ease-ui`. **No lift, no scale.**
Title `t-heading-sm` 26px; date `t-mono-xs` in `--gc-muted`; body clamped to 3 lines.

*From:* Attio (7-layer shadow ramp peaking at 7% → i.e. effectively none; card ring at
`inset 0 0 0 1px rgba(255,255,255,.2)`), Resend (12px–16px card radius, inset hairline
depth), Stripe (nested radius arithmetic).

### 7. Contact band — `--band-large`, `--gc-abyss`
Mirrors §3: same surface, same width, same silence. The page's density curve is
**loose → tight → loose → dense → medium → medium → loose**, and this is the resolution.
`t-display-sm` 48px, one line of `t-body`, one primary button (`pure` fill, `void` text,
`--radius-control` 8px, 150ms).

Do not add a form. Do not add a second CTA.

### 8. Footer — `--band-tight`
48px band, `--gc-abyss`, top hairline `--gc-line`. Wordmark 24px, nav columns
`t-small` 14px in `--gc-body`, legal `t-small` in `--gc-muted` capped at 60em.
`site.address` / `site.phone` are null and render nothing.

---

## Never do this

Each item is something the trending set conspicuously avoids, with the count or value that
proves it.

1. **No page-wide gradient wash.** Attio ships **4** `linear-gradient` declarations in
   472KB of CSS; Resend **3** in 969KB; Scale **12** in 745KB. Nineteen gradients across
   2.2MB. A hero gradient is the fastest way to look like a 2022 template.
2. **No glow, no neon, no coloured drop shadow.** Attio's entire seven-layer shadow ramp
   tops out at **7% opacity** and is pure black. Where blur appears on dark it is
   `blur(100px)` used as a soft bloom *behind* content [Scale], never as a rim light.
3. **No drop shadows on dark cards at all.** They are invisible on `#0f1011`. The edge is
   an inset white hairline. Every dark reference does it this way.
4. **No pure white text.** `#f0f0f0` / `#f2f2f2` / `#f4f4f4` / `#e3ecf7` across the four
   dark systems. Zero uses of `#ffffff` for type.
5. **No bold headings.** Stripe sets *every* heading role — xxl through sm — at
   `font-weight: 300`. Webflow uses 600; Attio 600. Nothing in the set reaches 700 except
   Revolut, a consumer brand. If a heading isn't landing, make it bigger or give it more
   room; do not make it heavier.
6. **No uniform section padding.** The current `padding-block: 80px` on every band is the
   flatness. Webflow ships four named section rhythms (48→80, 48→144, 48→240, 160→448px).
   Density must alternate.
7. **No body copy at full container width.** Five of six sites set text between 576 and
   672px. Scale uses `max-width: 640px` in **195 places**.
8. **No positive tracking above 12px, no zero tracking on display type.** Every site runs
   negative tracking that deepens with size, to −0.015/−0.02em at display. Revolut's only
   positive-tracked role is 11px.
9. **No bounce, spring, or overshoot easing.** Not one marketing-surface animation in the
   set uses one. The premium curves are all front-loaded and slow-settling:
   `.16,1,.3,1` · `0,0,0,1` · `.165,.84,.44,1` · `.25,1,.5,1`.
10. **No frosted glass over content.** `backdrop-filter` counts: Attio 1, Resend 2,
    Scale 4. The only legitimate use is the nav, and it needs `saturate(180%)` with the
    blur or it goes grey.
11. **No tinted neutrals *and* rotating accents.** Two valid strategies, mutually
    exclusive: tint the neutral ramp and keep one accent [Stripe: dark ramp is blue
    `#0d1738`→`#a3b5d6`, accent `#533afd`], **or** keep neutrals dead-neutral and rotate a
    set [Revolut: `#111112` base, eight accents]. GC2 is the second. Do not warm the greys.
12. **No proportional figures.** `tabular-nums` on every number. Attio, Resend, Scale and
    Stripe all ship it; a fund site whose figures reflow on hover has lost the argument.
13. **No lift-on-hover.** Colour and edge-opacity change; geometry does not. 150ms.
