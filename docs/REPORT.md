# GC2 — Institutional rebuild

## 1. Preview

`https://gc2-site-kncki0w73-natnaelsolomon0101-sketchs-projects.vercel.app`

The deployment returns 302: Vercel deployment protection is on for previews on
this account. The branch preview is reachable from the Vercel dashboard for
`redesign/institutional` while signed in. Branch pushed, 25 commits, `main`
untouched.

## 2. Name

`site.name` is **"Girlscantrade2"** — one word, no spaces, no apostrophe.

Appendix A.1 carries `"Girls Can Trade 2"` with a `// CONFIRM` marker, and §0.2
lists the name as one of only two blocking questions. It did not need to be
asked: the owner had already confirmed this spelling directly. The round-0
critic made "fix the name" its single highest-priority finding, reading A.1
literally. That finding was **rejected**, not deferred: a confirmed owner value
outranks a spec placeholder, and the critic is barred from reading `src/` so it
could not have known.

## 3. Before / after

Baseline is the live site at `https://gc2-site.vercel.app/` (the dark build),
captured at 390/768/1280/1600 in `docs/baseline/`. The rebuild is
`docs/qa/round-3/screens/`.

| | Live (baseline) | Rebuild |
|---|---|---|
| Overall rubric | **1.9 / 5** | **4.15 → 4.81 → 4.88** |
| Canvas | Dark by default (A.7.1) | Paper, one black band |
| Whitespace | ~950px of dead black mid-page | Sections on a 120px rhythm |
| Kill list | 6 A.7 entries present | Empty, four rounds running |
| Lighthouse mobile | 98 / 96 / 96 / 100 | 98 / 100 / 96 / 100 |
| axe violations | not measured | 0 |
| Tap targets under 44px | 5 | 0 |

The baseline's worst defect only appears in a full-page capture: the pinned
scroll section leaves roughly 950px of empty black between the strategies
heading and the statement band, and paints exactly one of six strategy tiles.
A viewport-only review never sees it.

## 4. Rounds

| Round | Kill list | axe | Console | Checklist | LH home mobile | Critic |
|---|---|---|---|---|---|---|
| 0 | empty | 0 | 0 | 53/53 | 96/100/96/100 | 4.15 (5 high, 9 med, 8 low) |
| 1 | empty | 0 | 0 | 53/53 | 98/100/96/100 | 4.81 (0 high, 4 med, 9 low) |
| 2 | empty | 0 | 0 | 53/53 | 96/100/96/100 | 4.88 (0 high, 3 med, 10 low) |
| 3 | empty | 0 | 0 | 53/53 | 98/100/96/100 | not critiqued (interim capture) |
| 4 | empty | 0 | 0 | 53/53 | 98/100/96/100 | confirming round |

Fix logs: `docs/qa/round-0/FIXES.md`, `docs/qa/round-1/FIXES.md`.

## 5. Deviations from Appendix A

Full reasoning in `docs/DECISIONS.md`.

- **`slate` is `#696F76`, not A.3's `#6B7178`.** The spec value measures 4.47:1
  on `stone` and fails AA for normal text.
- **Article and /disclosures measure is 34em, not A.8's literal 680px.** At 18px
  that is 38em and ~86 characters, which A.4's "<=34em" and §5.4's "over 75
  characters" both forbid. The narrower spec line wins.
- **The statement band is a `<p>` carrying `t-h2`, not an `<h2>`.** A pull-quote
  heads no section; a real `h2` would put an entry in the outline that leads
  nowhere.
- **The 12-column grid starts at 1024, not 768.** A.5 puts the desktop gutter at
  >=1024. At 768 the desktop splits left the firm prose at ~41 characters beside
  an empty column.
- **The mobile close control is a two-line X, not the hamburger.** A.6 sanctions
  a two-line 1.5px glyph; this is the same element and stroke in its open state.
- **OG cards render entirely in Newsreader.** Loading the display face makes it
  the card's fallback. An all-serif card beats mixing families at card scale.
- **LCP is 2.3-2.9s against A.9's "<1.5s".** Open, see §7.

## 6. Skill conflicts

The ui-ux-pro-max generator recommended, and Appendix A overrode:

- **Palette:** blue `#2563EB` primary, orange `#EA580C` accent, `#F8FAFC` ground.
  A.3 is 95% achromatic on paper with one `ledger` green.
- **Typefaces:** Outfit + Work Sans, both geometric sans. A.4 makes a serif
  display the identity.
- **Shadows:** four elevation levels. A.5 is explicit: zero shadows.
- **Spacing:** a scale stopping at 64px. A.5 runs to 160 with 120px sections.

The skill's UX guidance was kept and used: its contrast, focus, reduced-motion
and alt-text rules drove the checks in `scripts/qa/`. Its `MASTER.md` was
rewritten to carry Appendix A so later retrieval reinforces the spec instead of
fighting it.

## 7. Open for Nate

- **Address and phone.** `site.address` and `site.phone` are `null` and render
  nothing. Nothing was invented.
- **LCP.** 2.3-2.9s under Lighthouse's mobile throttle against A.9's 1.5s. The
  LCP element was measured, not guessed: it is the surface SVG, whose ~40
  isolines A.6 mandates. A first fix aimed at the hero fade was wrong and was
  reverted; priority hints and a preload did not move it. Fixing it properly
  means thinning the signature visual, which is a design decision, not a build
  one. CLS is 0 and Lighthouse performance is 96-100, so the §5.2 gate passes.
- **Legal review of `/disclosures`.** Generic register only; no regulator,
  registration number, or jurisdiction was invented.
- **Real photography.** None used. The only visual is the generated surface.
- **The preview URL is behind deployment protection.** Turn it off for the
  branch if you want to share the link outside the account.
