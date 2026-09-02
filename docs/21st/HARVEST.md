# 21st.dev harvest — `src/components/ui/**`

What the survey in `SURVEY.md` and the two retrieved components in
`markets-table.md` / `financial-hero.md` contributed to the primitive library,
and what was deliberately left on the floor.

**Nothing was installed.** No `npx shadcn add`, no new entry in `package.json`.
Every catalog entry ships some combination of `framer-motion`, `next-themes`,
`lucide-react` and shadcn's `cn`/`cva` conventions; all four are banned here.
Structure and real behaviour were rewritten by hand against the BUILD100K
tokens; motion was rewritten as CSS keyframes and scroll-driven timelines.

Standing rejections that apply to every entry below, so they are not repeated
each time: **glassmorphism, gradients-as-decoration, box-shadow, pills, icon
libraries, `next-themes` light/dark switching, `framer-motion`.**

---

## Button.tsx

Studied:

- **Minimal Button** `13568` (radiumcoders)
- **Great UI Minimal Buttons** `23286` (saurabh-2607)
- **Great UI Minimal Buttons** `23298` (saurabh-2607, larsen66 fork — same
  component under a second slug; counted once)
- **Financial Hero Section** (`financial-hero.md`, uilayout.contact) — two CTA
  buttons, retrieved in full

Took:

- From 13568, the two-variant discipline: one filled action and one understated
  action, nothing else. That is the whole variant list here — `filled` and
  `text`. Its name is the only honest thing in the catalog's button shelf.
- From 13568, the idea that the quiet variant is quiet *at rest* and only
  acquires a surface on hover. Ours is `bg-transparent` -> `bg-pure/10`.
- From the hero (`financial-hero.md`), the confirmation that a financial CTA
  pair wants the same metrics for both buttons so they sit on one baseline. Both
  our variants are `min-h-11` (44px) with the same radius and type size.

Rejected:

- 13568's "faint diagonal hatch overlay and a soft drop shadow that adapts to
  light and dark themes" — three bans in one sentence: decorative texture,
  `box-shadow`, and `next-themes`. Taken: nothing but the variant count.
- 23286/23298 entirely: "beveled top-border highlights, inner gradients, and
  inset shadow detailing" is a skeuomorphic 2010 button. Inner gradient and
  inset shadow are both on the ban list, and the bevel needs a light source this
  page does not have.
- The hero's `bg-linear-to-br from-blue-500 via-blue-400 to-blue-200` primary
  and `from-neutral-50 via-neutral-100 to-neutral-300` secondary — gradient
  fills, plus `rounded-xl` with `shadow-[inset_2px_2px_5px...]` on its nav CTA.
- The hero's `ChevronRight` from `lucide-react`. There is no icon slot on our
  Button at all, so the dependency cannot creep back in through a prop.
- Every entry's shadcn `Button` base with `cva` variants. Our variant map is a
  plain `Record<ButtonVariant, string>`; `cva` is a dependency for a lookup
  table.

Focus ring: none of the three entries specifies one for a near-black ground.
Ours is `outline-cloud` (`#f5f5f7`), measured 17.49:1 on obsidian. A ring in any
of the chromatic tokens, or in a dark green/blue as several catalog demos use,
lands under 2:1 on `#0f1011` and is not a focus indicator.

---

## Card.tsx

Studied:

- **Liquid Glass Card** `3206` (designali-in)
- **Glass Card** `5588` (molecule-lab-rushil)
- **Glass Checkout Card** `10599` (moumensoliman)
- **Financial Markets Table** (`markets-table.md`, isaiahbjork) — the container
  shell, retrieved in full

Took:

- From 5588, the sub-component split (header / title / content / footer) as a
  *shape* to consider, then deliberately declined it: see below.
- From `markets-table.md`, the container recipe
  `bg-background border border-border/50 rounded-2xl overflow-hidden` — a flat
  surface, a hairline, a radius, no shadow. That is exactly our Card, retokened
  to `bg-graphite border-steel rounded-card` (16px). It is the one card shell in
  the whole harvest that does not reach for elevation.

Rejected — **this is the entry the brief flagged, and it is worth being precise
about why it is tempting**:

- **Liquid Glass Card `3206`** and **Glass Card `5588`** are built on
  `backdrop-blur` over a translucent white fill. On a near-black page this
  produces a beautiful smoked-glass panel, and it would look expensive in a
  screenshot. It is wrong here for three reasons that are not matters of taste:
  1. **Glassmorphism is on the project ban list.** DESIGN.md principle 4 states
     depth is a surface step plus radius. A blurred translucent panel is a
     fourth material the system does not have.
  2. **The contrast is not knowable.** A translucent surface takes its
     luminance from whatever scrolls behind it, so `ash` on that card measures
     one ratio over the obsidian band and another over a chromatic tile. Every
     pair on this site has to clear 4.5:1 at a stated number. A glass card
     cannot state one.
  3. **`backdrop-filter` is a per-frame compositor cost** on a page that already
     paints a full-bleed noise SVG.
  Taken from both: nothing. Not the blur, not the translucent fill, not the
  border-highlight trick, not the sub-component API.
- **Glass Checkout Card `10599`** — glass again, plus a payment-method selector
  and input fields. Nothing here is relevant to a fund site, and a card that
  ships form controls is not a primitive.
- 5588's `CardHeader`/`CardTitle`/`CardContent`/`CardFooter` split. Seven files
  of ceremony for `<h3>` and `<p>`. Card takes `padding` and `children`; the
  type tiers in `globals.css` do the rest.
- `markets-table.md`'s `bg-background` / `border-border/50` / `bg-muted/15`
  semantic-token names, which only resolve through `next-themes` + a shadcn
  `globals.css`. Retokened to the fixed dark palette; there is no light theme to
  switch to.

`interactive` is our replacement for the hover-lift every card entry ships. With
`box-shadow` banned there is nothing to lift, so the affordance is the hairline
moving steel -> ash. Borrowed in spirit from the row hover in
`markets-table.md` (`hover:bg-muted/30`), executed on the border instead of the
fill so the graphite surface stays exactly one value.

---

## Tile.tsx

Studied:

- **Bento Grid** `4517` (designali-in)
- **bento grid 01** `9594` (avanishverma4)
- **Bento Grid** `622` (kokonutd) — "A nice Bento Grid with hover items and
  shadow."
- **Dark Grid** `8712` (lyanchouss)
- **Financial Markets Table** (`markets-table.md`) — its `getPerformanceColor`
  helper

Took:

- From `markets-table.md`, the *anti-pattern* that shaped the whole API.
  `getPerformanceColor(value)` returns a four-field object — `color`, `bgColor`,
  `borderColor`, `textColor` — and every call site destructures whichever
  subset it feels like:
  ```
  const { bgColor, borderColor, textColor } = getPerformanceColor(index.ytdReturn);
  ...
  <span className={`font-semibold ${getPerformanceColor(index.dailyChange).textColor}`}>
  ```
  The second call takes `textColor` and no background. Nothing in the type
  system pairs the two. That is precisely the failure mode the brief warns about
  for tiles, where white on `pale-iris` is 1.55:1. So `Tile` takes exactly one
  prop — `tone` — and the foreground is not expressible separately: there is no
  `foreground`, `color` or `bg` prop, and the tone's class string is applied
  *last* so a stray colour utility passed through `className` cannot win.
- From 4517 / 9594 / 8712, the confirmation that a chromatic panel wants a large
  radius and generous internal padding to read as an object rather than a swatch
  — `rounded-tile` (30px), `p-8`.

Rejected:

- 622 by name: "hover items and **shadow**".
- 4517 and 9594's coloured *gradient* tile fills. Our tiles are flat token
  colours; a gradient makes the effective background luminance a range, and a
  contrast ratio against a range is not a number.
- 9594's per-tile entry animation. Reveal handles that at the container, once.
- 8712's dark-on-dark capability grid skin. It is well made and completely
  generic; nothing about it is this fund.
- `markets-table.md`'s green/red performance palette (`#22c55e` / `#f87171` and
  the `bg-green-500/10 border-green-500/30` badge chrome). Two bans at once: it
  is outside the token set, and it exists to colour a return figure this site
  will not print.

Guard: `assertPairings()` re-derives all six ratios from the hex values at
module load and throws if any pair drops below 4.5:1, so a future edit to the
tone table fails the build rather than shipping unreadable text.

---

## Badge.tsx

Studied:

- **Pill** `1600` (haydenbleasel)
- **Interfaces Badge** `11843` (jshguo)
- **Filter Badge** `519` (serafimcloud, "inspired by Tremor")

Took:

- From 519, the notion that a badge is a *label with an edge*, not a filled
  chip — the outline treatment is the default here for the same reason: on a
  dark page a filled badge becomes a second surface competing with Card.
- From 11843, the variant-per-role idea, cut down to three: `outline`, `plain`,
  and `inherit`.

Rejected:

- The pill geometry in all three, which is the entire premise of `1600` (it is
  literally named Pill) and `11843` ("Rounded pill badge component"). Pills are
  banned; ours is `rounded-control` (8px), matching Button, so a badge and a
  button in the same row share one corner radius.
- 11843's `destructive` variant and the whole semantic-status colour set. There
  is no error state on a marketing site, and red is not in the palette.
- 519's Tremor colour ramp for the same reason.

Added, with no catalog precedent: the `inherit` variant, which draws its edge
and label from `currentColor` so a Badge dropped inside a `Tile` picks up that
tile's guaranteed foreground instead of a fixed grey that would fail on five of
the six tones. Edge measured 4.21:1 on pale-iris, 3.45:1 on deep-iris.

---

## Rule.tsx

Studied:

- **Financial Markets Table** (`markets-table.md`) — `border-b border-border/20`
  between rows, `border-b border-border/30` on the selected row
- **Dark Grid** `8712`

Took:

- From `markets-table.md`, the observation that its dividers are set at two
  different strengths for two different jobs — a faint one between rows and a
  stronger one under the selected row. Our `tone` prop is that idea made
  explicit and named: `steel` for decorative structure (1.83:1 on obsidian,
  exempt from 1.4.11 as pure decoration), `ash` for a divider that a reader
  actually has to perceive (7.20:1), `inherit` for use on a Tile.

Rejected:

- The `border-border/20` opacity-on-a-semantic-token idiom, which needs
  `next-themes`. Retokened to real values.
- Nothing else; there is no "hr" component in the survey worth copying. This one
  is mostly ours.

---

## Stat.tsx

Studied:

- **Number Ticker Real-Time Metrics Counter** `21515` (shadcnspace)
- **Stats** `5450` (meschacirung)
- **Stats 2** `8977` (designali-in) — "Stats with numbers"
- **Financial Markets Table** (`markets-table.md`) — `formatPercentage`,
  `formatCurrency`, and the demo's `setInterval` price simulator

Took:

- From `5450`, the two-line label-over-value stack, which is the correct shape
  for a structural fact. Nothing else.

Rejected — **`21515` is the pattern this component exists to make
unbuildable**:

> "An animated statistics counter that displays large numbers clearly with a
> live 'active' pulse indicator, ideal for user counts, page views, or total
> downloads."

On a SaaS page that is a growth flourish. On a fund site it is three separate
misrepresentations:

1. **A number that animates upward reads as a return**, whatever the caption
   above it says. Motion supplies a direction the caption cannot take back.
2. **The "live pulse" implies a data feed.** There is no feed. A pulsing dot
   beside a figure on a fund site asserts that the figure is current and
   sourced. Ours is neither, because ours does not exist.
3. **It normalises a `value: number` prop**, and a `value` prop is the exact
   hole through which `+18.4%` reaches production.

So `Stat` has no `value` prop and no `label` prop. It takes `fact`, a key into
`STRUCTURAL_FACTS`, and every entry in that registry is read from
`src/config/site.ts` or derived from `src/content/strategies.ts` — founded 2019,
Austin Texas, private partnership, liquid markets global, six strategies
(`strategies.length`, spelled), and the markets and instruments flattened off
the strategy records. No figure in this component was typed by a designer.
`assertNoFigures()` runs at module load and throws on `%`, a currency symbol, a
signed number, or any of AUM / Sharpe / return / drawdown / CAGR / IRR / bps /
alpha / yield / performance / million / billion / trillion, so the build fails
rather than shipping an invented number.

Also rejected:

- `markets-table.md`'s `formatPercentage` / `formatCurrency` helpers, and its
  demo's `setInterval` that mutates prices every 3s to fake a live tape. Both
  are competent code. Both exist to render figures this site is not allowed to
  have.
- `8977` ("Stats with numbers") and its four-across marketing metrics band.
- Every entry's `text-4xl`/`text-5xl` hero-number treatment. A structural fact
  is a fact, not a headline; ours sets at the 26px `t-heading-sm` tier at most.

---

## Reveal.tsx

Studied:

- **Scroll Reveal** `18675` (cnippet.dev) — "Supports any Motion variant,
  configurable thresholds, and a once-only mode."
- **Scroll Reveal** `18654` (cnippet.dev)
- **Reveal** `19240` (asanshay) — "fades and un-blurs its content into view …
  with optional staggered delay"
- **Financial Hero Section** (`financial-hero.md`) — its `TimelineAnimation`
  wrapper and `animationNum` prop
- **Sticky Header** `23562` (ddoemonn) — for its scroll listener

Took:

- From 18675/18654, the wrapper-component API: a component whose only job is to
  wrap arbitrary children and reveal them, with a stagger index. Ours is
  `<Reveal delay={0|1|2|3}>`.
- From `financial-hero.md`'s `TimelineAnimation`, the `animationNum` stagger
  index and the `as` prop for rendering the wrapper as the element it is
  animating (`as="h1"`, `as="p"`) rather than adding a wrapper div per item.
  Both are in our API.
- From **Sticky Header `23562`**, the scroll listener — and then dropped it.
  Its real behaviour is reading `scrollTop` off a container on every scroll
  event and mapping it to a progress value. Correct, and unnecessary: CSS
  `animation-timeline: view()` is that same progress value computed by the
  compositor, off the main thread, with no listener, no `useState`, and no
  `"use client"`. What was actually taken from 23562 is the *mapping*: a reveal
  bound to a range of scroll positions rather than a one-shot threshold trigger.
- From 19240, the staggered-delay ergonomics, reimplemented: `animation-delay`
  does nothing on a scroll timeline, so the stagger is applied by shifting
  `animation-range` per step instead.

Rejected:

- The `framer-motion` dependency in all three reveal entries, and the
  `IntersectionObserver` + `useState` + `"use client"` boundary each needs.
  `Reveal` is a server component with zero client bytes.
- 19240's blur-in. `filter: blur()` on text is a per-frame raster cost and it
  degrades text rendering mid-animation. Opacity plus a 12px rise only.
- 18675's `once` prop and threshold config. A scroll timeline is symmetric by
  construction; `once` is state, and state is a client component.
- 23562's headline behaviour — the shrink-on-scroll title that condenses into a
  compact bar — and its entire skin. It animates layout-affecting properties
  (font size, height), which DESIGN.md forbids, and it is a header pattern, not
  a reveal.
- The whole of `financial-hero.md` beyond the two ideas above: the Unsplash
  background image, the two blurred rotated gradient rects, the
  `bg-linear-to-b from-blue-50 via-blue-100` wash, the
  `bg-white/80 backdrop-blur-xl` nav, the `useMediaQuery` JS breakpoint (a media
  query in CSS is not a hook), and `MotionDrawer`.

Reduced motion: `@media (prefers-reduced-motion: reduce)` sets `animation: none;
opacity: 1; transform: none` — the animation is removed, not shortened, so
content is opaque and untransformed on first paint. A `@media print` block does
the same, because a scroll timeline has no notion of "in view" on paper and
without it every below-the-fold reveal would print blank.

---

## Surveyed and taken from entirely — no component built

- **Floating Header** `8137` (efferd) — "rounded glass-like design". Glass, and
  a nav is not mine to build.
- **Header** `841` (tommyjepsen) — shadcn navigation menu, i.e. Radix.
- **Theme Dropdown** `4105` (designali-in) — returned by the "footer dark
  minimal" query. It is a `next-themes` switcher. There is one theme on this
  site and it is not switchable, so this is dead weight by definition.
- **Dark Grid** `8712` — read for its dark-surface handling, contributed the
  padding intuition noted under Tile, nothing else.

## Notes for whoever builds on these

- Import directly: `import Button from "@/components/ui/Button"`. There is no
  barrel file, on purpose — a barrel that re-exports all seven would defeat
  merging these commits selectively.
- `Tile` and `Stat` both throw at module load on a bad edit. That is deliberate.
  If the build fails with a contrast or a figure message, the fix is the data,
  not the assertion.
- `t-mono-xs`, `t-heading-sm`, `t-body` and friends come from `globals.css` and
  are the project's type API. Primitives use those tiers rather than local
  `letter-spacing` / `font-size`, which also keeps arbitrary values out.
