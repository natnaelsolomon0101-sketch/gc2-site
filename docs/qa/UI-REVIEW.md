# 21st-ui-review — GC2 site

Run against `redesign/institutional`. Constraint held: no dependency added, and
everything traced to the existing A.3 tokens.

## Deterministic pass

`21st review src` returned **24 findings, all `info`, all one rule**
(`design-hardcoded-color`). Categorised rather than bulk-fixed:

| Count | Location | Verdict |
|---|---|---|
| 11 | `globals.css:9-19` | **False positive.** These are the `@theme` token definitions. A token must contain a literal; the rule is flagging its own source of truth. |
| 2 | `globals.css:188-189` | **False positive.** `#000` inside `mask-image`, an alpha stop that paints no colour. A.6 requires the mask. |
| 1 | `layout.tsx:33` | **False positive.** Next's `themeColor` viewport metadata is a literal string and cannot read a custom property. |
| 10 | the two OG cards | **Genuine.** Fixed. |

After the fix: 14 findings, all in the false-positive set above. The rule cannot
distinguish a token definition from token drift, so this number will not reach
zero without suppressing legitimate code.

## Fixed

**OG card palette had drifted from the tokens.** `next/og` renders through
satori, which resolves no CSS variables, so the cards must inline hex. Those
literals were copies, and one had already gone stale: the cards carried
`#6B7178` for `slate` long after the token moved to `#696F76` (the spec value
measures 4.47:1 on `stone` and fails AA). Both values pass on the cards' white
ground (4.93 vs 5.08), so this was **drift, not a contrast defect** — stated
plainly because the distinction matters. Both cards now import
`src/config/tokens.ts`, so the pair cannot diverge again silently.

**`color-scheme` was never declared.** The site is light-only by design: there
is no dark palette, no `dark:` variant, and no `prefers-color-scheme` block
anywhere. But without declaring it, a visitor whose OS is in dark mode gets dark
UA scrollbars and a dark first paint against a paper canvas. `html {
color-scheme: light; }` is the difference between "light on purpose" and
"nobody considered dark". This came out of the light/dark check, and it is the
only defect that check produced.

## Runtime audit — 390 / 768 / 1280 / 1600, all seven routes

24 page/width combinations:

- horizontal overflow: **0**
- interactive elements under 44px in height: **0**, except the `/disclosures`
  email, which sits inside a sentence where WCAG 2.5.8 exempts inline links and
  a 44px box would break the line
- `h1` per page: **exactly 1**
- images missing `alt` or `aria-hidden`: **0**
- axe violations: **0**
- console errors: **0**

## Judgement calls — left for you, not acted on

- **Six identical strategy blocks.** Appendix C-3 wants density variation; A.8
  mandates the structure (h2, definition list, two paragraphs, hairline). §0.1
  puts Appendix A first, so the uniformity is the spec, not laziness.
- **An 8px baseline break between three footer columns.** It only became visible
  *because* round 4 fixed the size mismatch that was masking it. Fixing it costs
  a line and restarts the two-round confirmation clock on a page otherwise at
  4.92.
- **LCP 2.3-2.9s against A.9's 1.5s.** The LCP element is the surface SVG, whose
  ~40 isolines A.6 mandates. Closing it means thinning the signature visual,
  which is a design decision.
- **The 14 remaining `design-hardcoded-color` findings.** Suppressing them would
  mean silencing the rule on the token file, which removes the only place it
  could ever catch real drift.
