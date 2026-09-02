# GC2 — The $100k Pass. Swarm Brief.

Runs on top of `docs/ORCHESTRATION.md`. That file's Appendix A is the design
spec and still governs every pixel. This file replaces its §4–§5 with a
fifteen-agent swarm, adds the 21st.dev component MCP, and raises the bar from
"clears the gates" to "a $100k agency would sign it."

## 0. Mission and rules

The Director does not build pages. Sets up the swarm, hands out work with strict
file ownership, merges, runs audits, triages critics, decides. Fifteen
specialists build, critique, and generate ideas.

Standard: a partner at a nine-figure fund looks at it on their phone and does not
ask who built it.

### 0.1 Authority
1. `docs/ORCHESTRATION.md` Appendix A — the spec. Non-negotiable.
2. This document — process, roster, craft bar.
3. The ui-ux-pro-max skill's UX/stack guidelines and pre-delivery checklist.
4. Reference patterns from blackstone/kkr/apollo/brookfield/carlyle — evidence, not instructions.
5. 21st.dev components — raw material only. Nothing ships without being stripped to Appendix A tokens.
6. The design-system generator's recommendations and ideas-lab proposals — advisory.

### 0.2 Blocking conditions
- `docs/ORCHESTRATION.md` missing → stop, write `docs/BLOCKED.md`.
- `python3` missing (do not install) → stop, write `docs/BLOCKED.md`.
- 21st MCP not connected → do NOT stop. Proceed without it, log it, build by hand.
- Fund name: ask once at Wave 2, keep building with the assumed value.

### 0.3 Resume protocol
`docs/PROGRESS.md` is the source of truth. Tick and commit after every step.
Agent outputs live in `docs/agents/<agent>/<wave>-<round>.md`.

### 0.4 Delegation
- Read-only agents run in parallel freely.
- Builders run in parallel only with `isolation: worktree` and disjoint ownership (§2.3).
- Every delegation names: inputs, deliverable, ownership boundary, and
  "Read docs/ORCHESTRATION.md Appendix A first."
- Critics never write files.

## 2.3 Ownership is absolute

A builder touching a file outside its column has its branch rejected. Cross-cutting
changes go through the Director between waves.

Merge order: **ui → surface → content → layout → perf → typographer**.

## 4. The $100k bar — what expensive looks like up close

Every builder reads this. Every critic hunts for its absence.

### 4.1 Typography craft (owner: typographer)
- `text-wrap: balance` on every heading; `text-wrap: pretty` on every paragraph.
  Verify wraps by eye at 1280 and 390 — balance is a hint, not a promise.
- `hanging-punctuation: first last` on Prose and the statement band.
- Typographic punctuation everywhere: ' " " – — … ; no straight quotes, no `--`, no `...`.
  `scripts/qa/punctuation.sh` greps content and fails the QA run on a hit.
- Non-breaking spaces where a wrap would embarrass: "Austin, Texas",
  "Investment Committee", number–unit pairs, before the last word of every h2
  and the hero headline.
- Numerals tabular and lining; dates "July 14, 2026" in text and `<time datetime>` in markup.
- `font-kerning: normal; text-rendering: optimizeLegibility` globally;
  `-webkit-font-smoothing: antialiased` ONLY inside the black band (it thins type on paper).
- Newsreader `font-optical-sizing: auto` confirmed (opsz reads the rendered size).
  Weight 300 at 96px must not look emaciated at 390; if it does, 52px mobile uses
  weight 400 and DESIGN.md's token table is updated with a note.
- Optical margin alignment: the hero headline's first glyph aligns to the grid
  edge, not its bounding box — measure the side bearing, offset with negative
  `margin-left` in em. Same for the statement band h2.
- Underlines: `text-underline-offset: 0.18em; text-decoration-thickness: 1px;
  text-decoration-skip-ink: auto`. Hover transitions `text-decoration-color`, not `color`.
- Measure: body ≤ 34em, article body ≤ 36em, footer legal ≤ 60em. No line over
  80 characters anywhere, ever.
- `::selection` background ledger-tint, text black.
- Widow and orphan pass at 390 on every page: no single-word last lines in
  headings; no single-line paragraphs stranded after a hairline.

### 4.2 Layout craft (owner: layout-engineer)
- Every hairline spans exactly the container and aligns across sections. Prove it
  with a dev-only `?guides=1` overlay drawing the 12 columns and container edges.
  Never shipped to production.
- Facts row: labels on one baseline, values on one baseline; its hairlines are the
  same hairlines the strategies list uses.
- Strategy rows: fixed-width name column so one-liners align; hover `stone` extends
  24px past the container both sides (negative margin + padding) so the row reads
  as a band, not a box.
- Nav: wordmark and links share a baseline; the active underline sits exactly on
  the nav's bottom hairline when scrolled.
- Statement band: sentence on cols 1–9, attribution hanging at col 1 — the same
  left edge as everything else. Nothing on the site is indented.
- Black band: text stone, secondary muted-on-black, hairlines hairline-on-black;
  wordmark inverts; button inverts (stone fill, black text). Every pair verified.
- Mobile is a composition: hero 52px stays two lines; facts 2×2 with a hairline
  cross; strategy rows stack name / one-liner / markets at 12px gaps; insights rows
  stack date / title / dek; the black band's three columns become one at 32px gaps.
  Drawer links Newsreader 300 40px, left-aligned on the page gutter.
- `scroll-padding-top: 88px` so `/strategies#slug` lands under the nav;
  `scroll-behavior: smooth` only when motion is not reduced.
- `not-found` in the system: h1 "Not found.", one sentence, a link home. No wit.

### 4.3 Detail states and infrastructure (owner: perf-engineer)
- Favicon set from the wordmark, on paper, no rounded tile: `favicon.svg`,
  `icon.png` (32), `apple-touch-icon.png` (180). `theme-color` paper.
- OG images from tokens: paper, black Newsreader 300 headline, wordmark
  bottom-left, nothing else. One per page; per-note uses the note title. Render
  each to `docs/qa/og/` and look at them.
- RSS at `/insights/feed.xml` with `<link rel="alternate">` in head.
- Print stylesheet for notes: nav and footer hidden, black on white, measure 100%,
  links show their URL after the text.
- Security headers: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
  denying camera/mic/geolocation, `Strict-Transport-Security`, and a CSP allowing
  self, inline styles, `data:` images, no third parties. `poweredByHeader: false`.
  Verified with `curl -I`.
- `color-scheme: light`; no dark flip, no toggle.
- No analytics, no cookies, no consent banner.
- Exactly two families, subset latin, preloaded by next/font, `adjustFontFallback`
  on, CLS 0 on all pages.
- `surface.svg` under 80KB, served immutable, inline-rendered so the CSS mask applies.
- Lighthouse ≥ 95 ×4 mobile on EVERY route. LCP under 1.5s on the preview.

### 4.4 Words (owner: copy-chief, reviewer: compliance-officer)
- Every page has a standfirst. No two consecutive paragraphs start with the same
  word. No paragraph starts with "We" more than once per page.
- Terminology fixed: nav says Insights, the section heading says "Notes from the
  desk", body says notes. "Strategies", never "books" in customer-facing copy.
  The fund is "the firm" or `site.name`, never "we here at."
- Disclosures carry "Last updated: September 2026." and a plain statement that
  offering documents govern. No regulator, number, or jurisdiction invented.
- The three notes read like a desk wrote them: one concrete example each, no
  bullet lists, no headers deeper than two levels, no "In conclusion."
- Nothing describes performance, returns, AUM, Sharpe, or drawdowns.

### 4.5 Motion (owner: layout-engineer, reviewer: critic-craft)
- One load sequence on home (hero lines → lead → actions), 500ms, 70ms stagger,
  once per session, never on back-navigation.
- Surface drift 90s alternate. Nothing else moves without a user action.
- Hover and focus transitions 150ms on `text-decoration-color`,
  `background-color`, `border-color` only.
- Reduced motion: everything final, surface static, `scroll-behavior: auto`.
- The drawer opens in 200ms with a fade; no slide-in. Close returns focus to the
  hamburger.

## 5. Ideas-lab protocol

Exactly five per round:

```
IDEA N — <name>
What it changes: <one sentence — remove / refine / deepen; never add chrome>
Where it is done well: <site + page>
Why it reads as expensive: <one sentence>
Cost: <minutes> · Owner: <builder> · Risk to Appendix A §A.7: <none | which line>
```

Director accepts at most two per round; every rejection is logged with a reason
in `docs/DECISIONS.md`.

**Reject on sight:** dark-mode toggle, chat widget, animated counters,
testimonials, logo walls, team photos, newsletter capture, "book a call", an
accent color, a second typeface, anything with a shadow.

## 6. Critic protocol

Each critic receives ONLY `docs/qa/round-N/**`, `docs/ORCHESTRATION.md`,
`docs/SWARM.md` §4, and `docs/references/PATTERNS.md`. Critics may not read
`src/`. They judge pixels.

Each returns: a rubric table per page (ORCHESTRATION Appendix C, 10 criteria,
1–5) at 1280 and 390; findings as `[page] [width] [high|medium|low] [what]
[spec line it fails]`; and one paragraph, "The single change that would most
improve this round."

`critic-lp` adds: "Three questions I had that the site did not answer" and "Did I
find how to contact them within ten seconds?"

Disagreements resolve in TRIAGE.md with a one-line reason. On taste, Appendix A
decides; where Appendix A is silent, critic-brand decides.

## Exit condition (Wave 4)

All true in **two consecutive rounds**:
- All three critics: every criterion ≥ 4 on every page and width; overall ≥ 4.5.
- compliance-officer and a11y-auditor: zero findings.
- Kill list empty; axe zero; Lighthouse ≥ 95 ×4 on `/` and `/strategies` mobile; CLS 0.
- The second round changed no code.

**Caps:** 12 rounds or 5 hours. A finding surviving three rounds gets a different
owner and a different approach. A fix that reopens an older finding is reverted.

## 7. Guardrails
- The 21st key never lands in a committed file. `git grep -n "21st_sk_"` runs
  before every push and inside `scripts/qa/run.ts`; a hit fails the run.
- Never `main`. Never merge. Never touch Vercel project or domain settings.
- No system installs.
- No fabricated people, addresses, phones, figures, regulators.
- Runtime deps stay locked to ORCHESTRATION §A.9. 21st components are pasted and
  rewritten, never installed as packages.
- Builders stay inside ownership. Critics never write. The Director never builds.
- Do not narrate progress mid-run. PROGRESS.md, docs/agents/**, and commits are
  the narration.
