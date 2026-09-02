# UPGRADE_SPEC — concrete changes to our build

**Derived from:** `REFERO_DEEP.md` (36 sites measured from live CSS, dark-weighted).
**Written for builders.** Every item has an exact value and the site it came from.
Ranked by how much it raises perceived spend, highest first.

## Our current state, for reference

| Role | Current value | Rel. luminance |
|---|---|---|
| ground (obsidian) | `#0f1011` | 15.9 |
| deeper band | `#090a0b` | 9.9 |
| cards | `#2e2e2e` | 46.0 |
| hairlines | `#3f4041` | 63.9 |
| body text | `#9f9fa0` | 7.2:1 on ground |
| headings | `#f5f5f7` | 17.5:1 on ground |
| accents ×6 | `#847dff` `#00b3dd` `#d1c9ff` `#4b49aa` `#dd90d8` `#90b8f0` | — |
| type | DM Serif Display + Inter, 96px display | — |

Two of these are already right and should not be touched: **`#0f1011` is Linear's
`--color-bg-panel` exactly**, and **`#090a0b` sits one unit off Linear's
`--color-bg-primary` (`#08090a`)**. The ground is not the problem.

---

## 1. Replace the card fill. `#2e2e2e` is two full steps too bright. — *highest leverage*

`#2e2e2e` sits at **1.40:1 against our ground**. Every measured premium dark site keeps its
first surface at **1.04–1.13:1**:

| Site | Ground → first surface | Contrast |
|---|---|---|
| linear | `#08090a → #0f1011` | 1.09 |
| raycast | `#07080a → #0c0d0f` | 1.08 |
| polar | `#090909 → #111111` | 1.10 |
| suno | `#101012 → #1c1c1f` | 1.19 |

At L 46, `#2e2e2e` is where Linear puts `--color-bg-quaternary` (`#28282c`) and Raycast puts
`--grey-500` (`#2f3031`) — **a chip/button fill, not a card.** Used as a card it reads as a
grey box floating on black, which is the most common cheap-dark tell in the whole scrape.

**Do this — replace one card token with a four-step ramp, cool-tinted as Linear and Raycast are:**

```css
--surface-0: #090a0b;   /* deeper band — keep as is                 L  9.9 */
--ground:    #0f1011;   /* page ground — keep as is                 L 15.9 */
--surface-1: #16171a;   /* cards, panels          1.06:1 on ground  L 23.0 */
--surface-2: #1c1d21;   /* nested / hovered cards 1.13:1            L 29.1 */
--surface-3: #232429;   /* chips, inputs, buttons 1.23:1            L 36.1 */
--surface-4: #2e2e33;   /* pressed / active only  1.42:1            L 47.4 */
```

Blue exceeds red by 3–4 at every step — matching `raycast #07080a`, `linear #08090a`,
`suno #101012 / #1c1c1f / #252529`. **`--surface-4` is where the old `#2e2e2e` belongs:**
suno ships `#2e2e33` as `--color-dumbo-200`, four steps above its ground.

Ban a flat fill anywhere large. Every premium dark panel measured is a gradient:
```css
/* resend.com */  background: linear-gradient(138deg, #101010 10%, #0c0c0c 88%);
/* resend.com */  background: radial-gradient(100% 100% at 50% 0, #ffffff14 0%, #fff0 100%),
                              linear-gradient(210deg, #080808 0%, #000 100%);
/* raycast.com */ background: radial-gradient(100% 100% at 50% 0%, var(--grey-800) 0%, var(--grey-700) 150%);
```
**Our card recipe:** `radial-gradient(100% 100% at 50% 0, #ffffff0d 0%, #fff0 60%),
linear-gradient(160deg, #17181c 0%, #131417 100%)`.

---

## 2. Cut six accents to one. — *second-highest leverage*

Measured accent counts on the premium dark marketing sites:
**raycast 1** (`#ff6363`), **polar 1** (`#00d294`), **runway 1** (`#b8e62e`),
**parallel 1** (`#ff590a`), **suno 1** (`#c4a670`), **anthropic 1** (`#c6613f`),
**column 1** (`#167e6c`), **linear 2** — and Linear's second is `#f34e52`, used only for
destructive states, never on the marketing page.

Against that: **stocktwits 4** and **dub 10**. Neither reads institutional. For a private
trading fund, four-plus live hues is the wrong signal outright.

**Do this:**
- **Primary accent: iris `#847dff`. It is the only chromatic colour on the page.**
- **Hover/bright: `#9891ff`.** Linear's step is accent `#7170ff` (L 122.5) → hover
  `#828fff` (L 148.3) = **+25.8 luminance units**. `#847dff` (L 135.9) → `#9891ff` (L 154.4)
  is +18.5; `#a49eff` (L 166.3) is +30.4 and runs hotter than Linear's step.
- **Tint / wash: `#1d1d2e`** — iris at 12% over the ground. Linear ships exactly this
  construct as `--color-accent-tint: #18182f`.
- **Pale-iris `#d1c9ff` survives only as a text colour**, for a single eyebrow or a
  pull-quote — the way suno uses `#f5e6c8` against `#c4a670`.
- **Delete `#00b3dd`, `#4b49aa`, `#dd90d8`, `#90b8f0` from the marketing surface.** If they
  are needed for data-viz series inside a chart, scope them to the chart and nowhere else.

Everything else that currently carries colour becomes a **white at 4–15% alpha** —
which is what all twelve dark sites actually do.

---

## 3. Hairlines: replace opaque `#3f4041` with translucent white at 8%.

`#3f4041` is **1.83:1 against our ground** — roughly 50% brighter than any measured hairline.
Not one of the twelve dark sites uses an opaque grey border.

```css
--hairline:        #ffffff14;   /* 8%  → 1.21:1  — linear --color-border-primary   */
--hairline-soft:   #ffffff0d;   /* 5%  → 1.14:1  — linear --color-border-translucent */
--hairline-strong: #ffffff1f;   /* 12% → 1.29:1  — linear --color-border-secondary */
--hairline-hover:  #ffffff26;   /* 15% → 1.36:1  — linear --color-border-tertiary  */
```

Suno ships the same set as `--color-opacity-white-4 / -10 / -20 / -30`
(`#ffffff0a / #ffffff1a / #fff3 / #ffffff4d`).

**And add Raycast's two-part edge to every raised card** — this is the detail that makes a
surface look machined rather than drawn:
```css
box-shadow: inset 0 .5px #ffffff4d,   /* top light, 30% white, half a pixel */
            0 0 0 .5px #000c;          /* outer dark, 80% black, half a pixel */
```

---

## 4. Glows: go large and diffuse at 4–12% alpha. Kill anything tight and hot.

This was the clearest cheap-vs-expensive discriminator in the entire scrape.

**Expensive (blur 70–250px, or gradients ≥400px; alpha 3–12%):**
```css
/* linear.app — panel top glow, achromatic */
background: radial-gradient(50% 50%, #ffffff0a 0%, #fff0 90%);
width: 800px; height: 320px; position: absolute; top: 0; left: 50%;
transform: translate(-50%, -50%);

/* scale.com — coloured wash, fades to the GROUND not to transparent */
background: radial-gradient(50% 36.46%, #7b8fdd14 0%, #05050b00 100%),
            radial-gradient(50% 38.81%, #7b8fdd1f 0%, #05050b00 100%);

/* raycast.com — ambient card glow */
box-shadow: 0 0 70px 20px #ffffff08, 0 0 30px 10px #ffffff0a,
            inset 0 .5px #ffffff4d, 0 0 0 .5px #000c, 0 4px 40px 8px #0006;

/* raycast.com — the one hero accent bloom, and only one per page */
box-shadow: 0 0 172px #ff636366;
```

**Cheap (blur under 60px, alpha over 40%):**
```css
/* spyglass.so */ box-shadow: 0 0 30px #d0fe1dcc, 0 0 60px #d0fe1d66;   /* 80% / 40% */
/* krea.ai     */ box-shadow: 0 0 24px #715eed99;                        /* 60%      */
/* stocktwits  */ radial-gradient(… rgba(0,115,255,.55) …);              /* 55%      */
```

**Do this:**
1. **One iris hero bloom, once per page:** `0 0 180px #847dff59` (35%) behind the display
   headline, nothing else.
2. **Ambient section wash — achromatic:** `radial-gradient(60% 45% at 50% 0, #ffffff0a 0%, #0f101100 100%)`
   at 900×360px, absolutely positioned at the top of a section.
   **Terminate at `#0f101100` (our ground with zero alpha), not at `transparent`** — this is
   scale.com's trick and it removes the grey halo at the fade edge.
3. **Iris tint wash for one feature section:** `radial-gradient(50% 38% at 50% 0, #847dff14 0%, #0f101100 100%)` — 8%.
4. **Nothing else glows.** Delete every `box-shadow` with a blur under 60px and an alpha over 30%.

---

## 5. Add grain — but do it Linear's way, not with plain 3% opacity.

Four working implementations were measured. The two strongest do not use plain opacity.

```css
/* linear.app — Grain.css, verbatim */
.grain {
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background-image: url(/grain.png);
  background-size: 256px 256px;
  opacity: .9;
  mix-blend-mode: overlay;        /* ← this is why .9 is safe on a near-black ground */
}
.grain::after { content: ""; position: absolute; inset: 0; background: #ffffff0f; }
.grain--subtle { opacity: .6; }
```

If a raster asset is unwanted, use parallel.ai's inline SVG — **2.5% effective**
(layer `.05` × rect `.5`):
```css
.grain-svg {
  position:absolute; inset:0; pointer-events:none; opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
}
```

**Recommended for us:** the SVG version at **`opacity: .05`, 160px tile**, applied to the
hero and to the closing CTA band only — plus `mix-blend-mode: overlay` if it reads too
milky. Do not blanket the whole page.

**Caveat, honestly:** grain is not required for the expensive read. vercel, raycast, runway,
polar and endel ship **no grain at all** and are among the strongest pages measured. Item 1
(the surface ramp) matters more. If only one of the two gets built, build item 1.

---

## 6. Lock the type scale: tracking and line-height by size.

Our 96px display is well inside the measured band (linear 72, anthropic 110, resend 120–160,
raycast 168, polar 176) and the 96 : 16 ratio of **6.0×** sits inside the measured
**4.8–7.5×**. **Do not change the display size.** Change what is around it.

```css
/* display — DM Serif Display */
--display:     96px; line-height: .95;  letter-spacing: -0.03em;  font-weight: 400;
--display-sm:  72px; line-height: 1.0;  letter-spacing: -0.03em;
/* headings — Inter */
--h1: 56px;  line-height: 1.05; letter-spacing: -0.025em; font-weight: 500;
--h2: 40px;  line-height: 1.1;  letter-spacing: -0.022em; font-weight: 500;
--h3: 32px;  line-height: 1.125;letter-spacing: -0.02em;  font-weight: 500;
--h4: 24px;  line-height: 1.33; letter-spacing: -0.012em; font-weight: 500;
/* body */
--body-lg: 17px; line-height: 1.6; letter-spacing: -0.011em; font-weight: 450;
--body:    16px; line-height: 1.6; letter-spacing: -0.011em; font-weight: 450;
--small:   14px; line-height: 1.5; letter-spacing: -0.013em; font-weight: 450;
/* eyebrow / label — POSITIVE tracking */
--label:   12px; line-height: 1.4; letter-spacing: +0.08em; font-weight: 500; text-transform: uppercase;
```

Sources: line-height 0.84–1.15 at display is universal (**resend `.84`/`.85`, krea `.95`,
linear/mercury/anthropic/suno/runway `1.0`, scale `1.05`, column `1.1 ×57`**).
Tracking `−0.022em` (linear `--title-6..9`), `−0.025em` (krea at 96px, resend), `−0.03em`
(column, lumalabs), **`−0.04em` at ≥72px (vercel)**. Body `−0.011em` (linear
`--text-regular`). Positive label tracking: raycast `.2px ×98`, cursor `.03em ×10`,
suno `.02em ×9`, stocktwits `.4em`.

**Weight is the sleeper item.** Nobody measured uses 700 for a marketing headline.
Inter is variable — **use 450 for body and 500–550 for headings**, matching
vercel (`550 ×95 / 450 ×40`), linear (`medium 510 / semibold 590`), column (`500 ×84`),
raycast (`500 ×203`). And keep **DM Serif Display at its single 400** — that matches
mercury's Tiempos at `300/320/360` and anthropic's serif at `300/400`.

---

## 7. Section rhythm: one dominant value, plus reserved bookends.

Every measured site has one padding value used 2–4× more than any other, and a small set of
outsized values reserved for the hero and the closing section.

```css
--section-y:        96px;   /* THE value. Use on ~70% of sections.        */
--section-y-tight:  64px;   /* dense / paired sections                     */
--section-y-loose: 128px;   /* a feature section that needs air            */
--section-hero:    200px;   /* hero only                                   */
--section-close:   240px;   /* closing CTA only                            */
/* mobile: 96 → 64, 128 → 80, 200 → 120, 240 → 140 */
```

Evidence: scale.com **80px ×36** dominant; column **72 ×19 / 96 ×12 / 144 ×6** plus
256/410/450 for heroes; runway **48 ×14 / 64 ×12 / 128 ×12 / 96 ×10** plus 160/176/240;
raycast 48–128 as the band plus **158/240/260/320/370** reserved; dub **56 ×30** plus 192/224;
linear's whole set is exactly seven values: **48/56/64/80/96/112/128**.

**Do not ship a continuous 4px ramp.** endel.io does (48/52/56/…/116 each ×12) and has no
rhythm at all; it survives only because the page is nearly empty.

---

## 8. Three container tiers, not one.

```css
--container-outer:   1376px;  /* full-bleed wrappers, nav        — linear (1344 + 2×16) */
--container-content: 1024px;  /* the standard content column     — linear, raycast, runway, scale */
--container-prose:    640px;  /* any paragraph, any pull-quote   — linear ×95, scale ×195 */
```
`640px` for prose is the single most repeated width in the entire scrape (scale.com declares
it **195 times**, linear.app **95 times**). Anything that is a paragraph of running text
gets 640px and no more. Page gutter `24px` (linear `--page-padding-inline`).

---

## 9. Pick one radius and repeat it.

There is no cross-site consensus on the value — column ships `8px ×82`, raycast `12px ×22`,
scale `16px ×22`, cursor `2–3px`, vercel `6/12` — but **every site picks one and repeats it.**

```css
--r-xs:  4px;   /* tags, chips        */
--r-sm:  6px;   /* buttons, inputs    */
--r-md: 12px;   /* THE card radius    — raycast --card-radius, linear --card-radius */
--r-lg: 16px;   /* large panels       — linear --edge-highlight-radius */
--r-xl: 24px;   /* full-bleed feature */
--r-full: 9999px;
```
Ramp source: linear ships `4 / 6 / 8 / 12 / 16 / 24 / 32 / 9999px` and nothing else.
**Audit for any radius not on this list and delete it.**

---

## 10. Motion: one duration, one ease, and slow ambient loops.

```css
--dur:      180ms;                        /* linear --duration: .18s   */
--dur-slow: 400ms;                        /* parallel.ai .4s ×55       */
--ease:     cubic-bezier(.32,.72,0,1);    /* linear + vercel signature */
--ease-out: cubic-bezier(.16,1,.3,1);     /* present on ~every site    */
```

- **UI transitions: 180ms `var(--ease)`.** Measured base durations: linear `.16s ×31`,
  vercel `.15s ×27 / .2s ×29`, resend `.15s ×57`, suno `.2s ×16`, raycast `.3s ×92 / .2s ×50`.
- **Scroll-reveal: 400ms `var(--ease-out)`, 24px translate, opacity 0 → 1, staggered 60ms.**
  parallel.ai ships `transition: opacity .5s ease, transform .6s var(--home-ease-out)` with
  `transform: translateY(14px)` as the armed state — that is the exact pattern.
- **Ambient loops: 2800ms minimum.** linear runs three at `1600ms / 2800ms / 3200ms`;
  column at `2000ms ×43`; mercury at `10s`; suno drifts a background image over **100s**.
  Nothing ambient should be under 1.6s.
- **Ban `ease`, `ease-in-out` and `linear` for anything the user sees.** Every signature
  easing measured is a decelerating cubic-bezier with a near-zero final control point:
  `(.32,.72,0,1)`, `(.16,1,.3,1)`, `(.22,1,.36,1)`, `(.23,1,.32,1)`, `(.5,0,.01,1)`, `(.6,0,.2,1)`.

---

## 11. Mask every edge instead of cutting it.

`mask-image` counts on the strong pages: **dub 534, raycast 173, vercel 132, linear 111,
resend 82, krea 70.** Paired with `filter: blur` (raycast **142**, column **91**).
This is the second most reliable expensive-signal after glow size, and we almost certainly
ship none of it.

```css
/* horizontal rail / logo strip — linear.app, verbatim geometry */
mask-image: linear-gradient(to right, transparent 0px, black 80px,
                            black calc(100% - 80px), transparent 100%);

/* four-sided soft vignette — mercury.com */
mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent),
            linear-gradient(180deg, transparent, black 10%, black 90%, transparent);
mask-composite: intersect;

/* fade a screenshot into the ground — krea.ai, five stops */
mask-image: radial-gradient(120% 95% at 50% 8%, #000 0%, #000000a6 35%,
                            #0000005e 55%, #0000001f 72%, #0000 100%);
```
Apply to: the logo strip, any horizontally scrolling row, the bottom of every product
screenshot, and the top of the footer.

---

## 12. Layered shadows: six stops, 7% ceiling.

Our current build has no shadow spec. Three sites ship near-identical ramps; use anthropic's
(the softest) for cards and parallel's for anything that must float.

```css
/* anthropic.com — verbatim, six stops, 2%→7% */
--shadow-soft:
  0 4px 3px #00000005, 0 10px 8px #00000008, 0 19px 15px #0000000a,
  0 34px 27px #0000000a, 0 63px 50px #0000000d, 0 150px 120px #00000012;

/* parallel.ai — verbatim, sub-pixel first stop */
--shadow-float:
  0 0 0 .66px #0000000f, 0 3px 1px #00000005, 0 7px 3px #00000008,
  0 13px 5px #0000000a, 0 22px 9px #0000000a, 0 42px 17px #0000000d,
  0 100px 40px #00000012;

/* column.com — the inset bottom vignette that makes a card feel machined */
--shadow-inset: inset 0 0 0 1px #ffffff14, inset 0 -80px 64px -32px #00000040;
```
Linear's own ramp maxes at **7% opacity across all seven layers**. Nothing in our build
should carry a shadow above `#00000014` (8%).

---

## 13. Body text: leave `#9f9fa0` alone. — *a candidate factor, killed*

`#9f9fa0` on `#0f1011` is **7.2:1**. The measured premium band is **6–8.5:1**:
raycast `#9c9c9d` **7.3:1**, suno `#a3a3a3` **7.5:1**, resend `#a1a4a5` **8.4:1**,
linear tertiary `#8a8f98` **6.1:1**. We are dead centre. This is not a problem and does not
need changing.

Two adjustments only:
- Add a **secondary body tone at `#c4c7ce` (11.3:1)** for lead paragraphs and the first
  paragraph after a display headline — linear runs `--color-text-secondary #d0d6e0` at
  **13.6:1** for exactly this and drops to `#8a8f98` for supporting copy. We currently have
  one grey doing two jobs.
- **Set body weight to 450, not 400.** Every site measured runs medium on a dark ground
  (vercel 450/550, linear 510, column 500, raycast 500). At 400 on `#0f1011`, Inter looks thin.

---

## 14. Consider warming or tinting the ground. — *optional, identity-level*

Not a defect, but worth a decision. Cool near-blacks: raycast `07 08 0a`, linear `08 09 0a`,
suno `10 10 12`, resend `14 15 17` — **blue ≥ red + 2 at every step.** Warm: cursor
`14 12 0b` → `20 1e 18` → `2b 29 23` — **red ≥ blue + 8 at every step.** Hue-tinted:
column `#0B1B34` (navy). All read expensive. A perfectly neutral `#111111` is what the
mediocre dark sites use.

Our `#0f1011` is already faintly cool (B = R + 2). **The ramp in item 1 continues that
consistently** (`#16171a`, `#1c1d21`, `#232429` — B = R + 4 to + 6). Keep it cool and let
the iris accent sit with it, or commit to warm and rebuild the ramp toward
`#141215 / #1b181c / #221f24`. **Do not mix.**

---

## 15. On the perplexity.ai/hub reference — what the data does and does not support

`perplexity.ai/hub` returned **HTTP 403** to every fetch. **No CSS was obtained. There is no
measured type scale, ground colour, spacing or motion for the client's stated reference,
and none is invented here.**

Refero does carry an extraction for it (site id 421). Its published dominant palette is
`#293635 #59aeb1 #378990 #8fa6a4 #4ea3ac #a1afa5` — **a dark desaturated blue-green ground
plus a single teal-cyan accent family and a sage mid-grey.** Refero's detected fonts are
`FK Grotesk`, `FK Grotesk Neue`, `Berkeley`, `Google Sans` — **all grotesques; no serif was
detected.**

Two things follow, and both point the same way as items 2 and 6:
- The "night meadow" energy in that palette is **one hue plus greys**, not six chromatic
  accents. Item 2 is the change that gets us closest to the reference, not further from it.
- The reference's ground (`#293635`, L ≈ 51) is far lighter than any ground measured in this
  scrape. If the client wants "brighter", the honest lever is **a larger, more diffuse
  ambient glow and a lifted first surface (items 1 and 4)** — not a lighter ground, which
  would put us outside every premium dark site measured.

---

## Build order

1 → 2 → 3 → 4 (colour and depth; these four alone carry most of the lift)
6 → 7 → 8 → 9 (type and layout discipline)
10 → 11 → 12 (motion and edges)
5, 13, 14 last (grain, text tuning, ground hue — all optional or already correct)
