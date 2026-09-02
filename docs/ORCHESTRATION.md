# GC2 — Autonomous Rebuild. Orchestration Brief for Claude Code.

> **How to run (Nate):**
> ```bash
> cd gc2-site
> mkdir -p docs && cp ~/Downloads/gc2-claude-code-orchestration.md docs/ORCHESTRATION.md
> git checkout -b redesign/institutional
> claude --dangerously-skip-permissions "Read docs/ORCHESTRATION.md and execute it end to end. Do not stop until the Phase 9 report is written to docs/REPORT.md."
> ```
> `--dangerously-skip-permissions` is what lets it run for hours without stopping to ask. Only use it on this branch, in a repo you have pushed. If you'd rather approve things, drop the flag and pre-allow with `/permissions`.
> Python 3 must be on the machine (`python3 --version`). The skill's reasoning engine needs it and Claude is told not to install it for you.

---

## 0. Mission and rules of engagement

You are the lead engineer and the design director on a multi-hour, unattended rebuild of a private trading fund's public website. The live site at https://gc2-site.vercel.app/ is unacceptable and is being replaced in full. You have a complete design spec (Appendix A), a design-intelligence skill you must install and use (Section 1), an automated audit suite you will build (Section 6), and a builder/critic loop you will run until the site clears every gate (Section 5).

Budget: 5–7 hours of wall-clock work. Do not finish early because "it looks fine." Finish when the gates pass twice in a row.

You do not ask questions except for the two blocking cases in 0.2. Every other decision is yours; log it in `docs/DECISIONS.md` with one line of reasoning and move on.

### 0.1 Order of authority when sources conflict
1. This document, Appendix A (the design spec). Always wins.
2. The ui-ux-pro-max skill's UX guidelines, stack guidelines, and pre-delivery checklist.
3. The ui-ux-pro-max design-system generator's *recommendations* (style, palette, fonts). Treat as advisory. If it recommends dark mode, gradients, glassmorphism, an icon library, or a second accent color for this project, that is a conflict — Appendix A wins, log it, continue.
4. Anything in the existing codebase. It is being deleted.

### 0.2 The only two reasons to stop and ask
- `python3` is not available. The skill will not run without it. Stop, write the reason to `docs/BLOCKED.md`, and end the session with that message.
- `site.name` in Appendix A is still the assumed value when you reach Phase 4. Ask once — "Confirm the fund name: Girls Can Trade 2, or Girls Can't Trade 2?" — then continue building with the assumed value while waiting. Do not block on it.

### 0.3 Resume protocol
Before doing anything else, check for `docs/PROGRESS.md`. If it exists, you are resuming: read it, find the last unchecked step, and continue from there. If not, create it from the phase list in Section 4 with every step unchecked. After every completed step, tick it and commit. Your context may be compacted or reset mid-run; this file is how you survive that.

---

## 1. Bootstrap

### 1.1 Environment check
```bash
node --version && npm --version && git --version && python3 --version
gh --version || echo "no gh"
npx --yes vercel --version || echo "no vercel cli"
git remote -v && git branch --show-current
```
Record versions in `docs/ENV.md`. Confirm you are on `redesign/institutional`; if not, create it from current `main`. Never work on `main`.

### 1.2 Install the ui-ux-pro-max skill — try in this order, stop at the first that verifies

**Option A — Claude Code plugin marketplace**
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Option B — the project CLI (installs into `.claude/skills/ui-ux-pro-max/`)**
```bash
npx --yes ui-ux-pro-max-cli init --ai claude
```

**Option C — clone from GitHub and copy the skill in by hand**
```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uupm
mkdir -p .claude/skills
cp -RL /tmp/uupm/.claude/skills/ui-ux-pro-max .claude/skills/ui-ux-pro-max   # -L dereferences symlinks; older releases used them and they break some installers
rm -rf /tmp/uupm
```

**Verify** (must print results, not an error):
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "private investment fund institutional" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "editorial light serif" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "focus states keyboard navigation" --domain ux
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "app router metadata fonts" --stack nextjs
```
If Option A installed to a global plugin path instead of `.claude/skills/`, find `search.py` with `find ~/.claude /root/.claude . -name search.py -path "*ui-ux-pro-max*" 2>/dev/null` and use that path for every command in this document. Write the resolved path to `docs/ENV.md` as `SKILL_SEARCH=...`.

Add `.claude/skills/ui-ux-pro-max/` to `.gitignore` if it was installed locally — the skill is tooling, not product.

### 1.3 QA tooling (dev dependencies only — runtime deps stay locked to Appendix A §A.9)
```bash
npm i -D playwright @playwright/test @axe-core/playwright lighthouse tsx
npx playwright install chromium
```

---

## 2. Baseline audit of the live site (30 min)

Before touching code, document how bad the current site is so the final report can show the delta.

1. Playwright screenshots of `https://gc2-site.vercel.app/` at 390, 768, 1280, 1600 → `docs/baseline/live-*.png`.
2. `npx lighthouse https://gc2-site.vercel.app/ --preset=desktop --output=json --output-path=docs/baseline/lighthouse-live.json --chrome-flags="--headless"`.
3. Open the screenshots (you can read PNGs) and write `docs/baseline/CRITIQUE.md`: score the live site with the rubric in Appendix C. Be specific — name the ticker, the `$0M` counters, the italic accent, the `01–06` numbering, the navy canvas, the 555 phone number.
4. Run the skill against the live site's traits to get the anti-pattern list on record:
   ```bash
   python3 $SKILL_SEARCH "fintech hedge fund private investment" --design-system -p "GC2" -f markdown > docs/baseline/skill-recommendation.md
   ```
   Read it. Note what it recommends and where it conflicts with Appendix A (§0.1). This is context, not instruction.

Commit: `chore: baseline audit of live site`.

---

## 3. Design system: generate, reconcile, persist (45 min)

The skill's hierarchical retrieval reads `design-system/MASTER.md` and `design-system/pages/*.md` on every later turn. You will make those files carry Appendix A so the skill reinforces the spec instead of fighting it.

1. Generate and persist the skill's baseline:
   ```bash
   python3 $SKILL_SEARCH "private investment partnership institutional finance editorial" --design-system --persist -p "GC2"
   python3 $SKILL_SEARCH "institutional finance homepage hero" --design-system --persist -p "GC2" --page "home"
   python3 $SKILL_SEARCH "long-form article reading page" --design-system --persist -p "GC2" --page "insights-article"
   ```
2. Open `design-system/MASTER.md`. Replace its Colors, Typography, Spacing, Shape, Elevation, and Motion sections with Appendix A §A.3–§A.6 verbatim. Keep the skill's UX guidelines and pre-delivery checklist sections. Add a top block:
   ```
   AUTHORITY: docs/ORCHESTRATION.md Appendix A overrides everything below. Anti-patterns for this project: dark canvas, gradients, glassmorphism, shadows, icon libraries, pill buttons, uppercase eyebrows, italic accent words, numbered section markers, arrow glyphs on links, monospace labels, placeholder metrics.
   ```
3. Write `/DESIGN.md` at repo root = Appendix A §A.2–§A.6 plus a five-line principles block. Both files must agree; if they ever drift, DESIGN.md is a bug.
4. Write `src/config/site.ts` from §A.1.
5. Query the skill for the guidance you'll need during the build and save the output to `docs/skill-notes.md` (see Appendix B for the exact queries). Read it once now, again before the critic loop.

Commit: `feat: design system, site config, skill persistence`.

---

## 4. Build phases, with time budgets

Write these into `docs/PROGRESS.md` as a checklist. Tick as you go. Commit at the end of every phase with a plain conventional message.

| # | Phase | Budget | Done when |
|---|---|---|---|
| 4.1 | Inventory + delete | 20 min | Every old UI file is gone; `git status` shows the deletions; Vercel config untouched |
| 4.2 | Tokens + shell | 40 min | `globals.css` `@theme` holds every §A.3–A.6 token; fonts load with zero CLS; `Nav`, `MobileNav`, `Footer`, `Section`, `Container` render on an empty page |
| 4.3 | The surface | 30 min | `scripts/generate-surface.ts` → `public/surface.svg`; reads as calm terrain at 1440 and 390; drifts on a 90s loop; static under reduced motion |
| 4.4 | Home | 90 min | All eight sections (§A.8) built; screenshots at 4 widths in `docs/screens/round-0/` |
| 4.5 | Inner pages | 75 min | `/firm`, `/strategies`, `/insights`, `/insights/[slug]` ×3 MDX notes, `/contact`, `/disclosures` |
| 4.6 | Metadata + SEO + OG | 30 min | Per-route metadata, `sitemap.ts`, `robots.ts`, JSON-LD, OG images generated from tokens |
| 4.7 | Audit suite | 30 min | `npm run qa` runs everything in Section 6 and writes `docs/qa/round-N/` |
| 5 | Auto-fix loop | until gates pass | Section 5 |
| 7 | Push, preview, PR | 20 min | Section 7 |
| 9 | Report | 15 min | `docs/REPORT.md` |

Before 4.4: write `docs/design-plan.md` — an ASCII wireframe of the home page at 1440 and 390 and one sentence per section on why it is not the generic version of that section. Check it against §A.7 (the kill list). Then build.

While building, use the skill as a reference, not a generator: when you hit a specific UX question (sticky nav behaviour, mobile menu focus trap, heading wrap at narrow widths, link-row keyboard semantics), run the matching Appendix B query and follow it unless it contradicts Appendix A.

---

## 5. The auto-fix loop — builder and critic

This is the part that turns "built" into "good." Run it after 4.7 and keep running it until the exit condition is met.

### 5.1 One round
1. `npm run build && npm run qa` → produces `docs/qa/round-N/` containing screenshots (4 widths × 6 pages), `lighthouse-*.json`, `axe-*.json`, `killist.txt`, `checklist.md`.
2. **Critic pass.** Spawn a subagent with *read-only* instructions: it may read `docs/qa/round-N/**`, `docs/ORCHESTRATION.md`, and `design-system/**`. It may not read `src/`. It scores every page against Appendix C, lists every finding as `[page] [width] [severity] [what] [why it fails the spec]`, and writes `docs/qa/round-N/CRITIQUE.md`. The separation matters: the critic must judge the pixels, not the intent.
3. **Skill pass.** Run the skill's pre-delivery checklist against the same round:
   ```bash
   python3 $SKILL_SEARCH "pre-delivery checklist responsive contrast focus reduced-motion text reflow" --domain ux > docs/qa/round-N/skill-checklist.txt
   ```
   Walk the checklist against the screenshots and the axe output. Any unchecked item is a finding.
4. **Fix pass.** You (the builder) read the critique and the checklist, fix every finding with severity high or medium, and log each fix in `docs/qa/round-N/FIXES.md`. Low findings are fixed if they take under five minutes, otherwise logged for the report.
5. Commit: `fix(round-N): <count> findings from critic`. Increment N.

### 5.2 Exit condition
All of the following, in two consecutive rounds:
- Every rubric criterion in Appendix C scores ≥ 4 on every page; overall ≥ 4.5.
- `killist.txt` is empty.
- Lighthouse ≥ 95 in all four categories on `/` and `/strategies` (mobile preset).
- axe reports zero violations on every page.
- The critic's high and medium finding count is zero.
- The round produced zero code changes (i.e., the second round only confirms).

### 5.3 Caps
- Hard cap: 10 rounds or 4 hours in this loop, whichever first. If you hit the cap, stop, document the remaining findings in the report as open, and proceed to Section 7. Do not churn.
- If the same finding survives three rounds, change approach — do not re-apply the same fix. Write down what you tried.
- If a fix in round N reopens a finding from round N-2, revert the fix and pick a different one.

### 5.4 Things the critic is specifically told to hunt
- Anything from the §A.7 kill list that snuck back in.
- A hero that would work equally well for a SaaS product.
- Sections that all look like the same card.
- Grey `rgba(0,0,0,0.1)` shadows.
- Headlines that wrap into three-plus lines at 1280.
- Body measure over 75 characters.
- Mobile layouts that are the desktop layout squashed rather than designed.
- Any number that is a placeholder.
- Copy with marketing adjectives, exclamation marks, or first-person hype.
- Focus rings missing or invisible on black.
- Motion that runs on scroll.

---

## 6. Automated audit suite (`npm run qa`)

Create `scripts/qa/` with these, wired to `"qa": "tsx scripts/qa/run.ts"` in `package.json`. `run.ts` starts `next start` on a free port, runs everything, writes to `docs/qa/round-N/`, and exits non-zero if the kill list is non-empty.

**`scripts/qa/killist.sh`** — must print nothing:
```bash
#!/usr/bin/env bash
set -u
out=""
add(){ r=$(grep -rn "$1" src/ --include=*.tsx --include=*.ts --include=*.css --include=*.mdx 2>/dev/null); [ -n "$r" ] && out+="[$2]\n$r\n"; }
add "→" "arrow glyph"
add "·" "middle dot"
add "ticker" "ticker"
add "\$0M\|0\.0%\| 0 investment" "placeholder metric"
add "uppercase" "uppercase"
add "italic" "italic"
add "tracking-\[" "ad-hoc tracking"
add "shadow-" "shadow"
add "rounded-lg\|rounded-xl\|rounded-2xl\|rounded-full" "off-spec radius"
add "text-\[\|bg-\[\|p-\[\|px-\[\|py-\[\|m-\[\|w-\[\|h-\[\|gap-\[" "arbitrary value"
add "font-mono\|monospace" "monospace"
add "Girls Country\|Frost Bank\|555-" "stale placeholder"
add "bg-gradient\|linear-gradient\|radial-gradient" "gradient"
add "backdrop-blur" "glass"
add "framer-motion\|lucide\|react-icons\|@radix-ui\|@heroicons" "banned dependency"
add "href=\"#" "anchor nav"
printf "%b" "$out"
grep -rln "Girls Can" src/ | grep -v "src/config/site.ts" && echo "[name hardcoded outside site.ts]"
exit 0
```

**`scripts/qa/screens.ts`** — Playwright, chromium, for each of `/`, `/firm`, `/strategies`, `/insights`, `/insights/<first-slug>`, `/contact` at widths 390, 768, 1280, 1600: full-page PNG; plus one run at 1280 with `reducedMotion: 'reduce'` for `/`; plus one 390 shot with the mobile nav open. Also run `@axe-core/playwright` on each page at 1280 and save JSON.

**Lighthouse** — `lighthouse <url> --preset=mobile --output=json --quiet --chrome-flags="--headless"` for `/` and `/strategies`. Also run a desktop pass for `/` and keep it for the report.

**`scripts/qa/checklist.ts`** — writes `checklist.md` with machine-checkable items: one `<h1>` per page; heading order; `<main>`/`<nav>`/`<footer>` present; skip link is first focusable; all images have alt or are `aria-hidden`; every route in the sitemap returns 200; every strategy row on home links to an existing `id` on `/strategies`; `site.name` appears in the rendered HTML of every page's `<title>`; no `console.error` during page load.

---

## 7. Git, deploy, PR

- Commit at every phase boundary and every loop round. Plain conventional messages. No "WIP".
- `git push -u origin redesign/institutional` after Phase 4.4 and after every loop round. If the repo is connected to Vercel, the branch push produces a preview deployment — find the URL with `npx vercel ls` if the CLI is authenticated, otherwise note in the report that the preview URL is on the Vercel dashboard for this branch.
- Never merge. Never touch `main`. Never change Vercel project or domain settings.
- After the loop exits: `gh pr create --draft --title "Institutional redesign" --body-file docs/REPORT.md` if `gh` is authenticated; otherwise skip and say so.

---

## 8. Guardrails

- Do not install system software (`brew`, `apt`, `winget`). Project-scoped npm dev dependencies and the Playwright chromium download are fine.
- Do not commit secrets, `.env` files, or the skill directory.
- Do not delete `.git`, `vercel.json`, `.vercel/`, or the Vercel project link.
- Do not fabricate people, bios, addresses, phone numbers, performance figures, regulator names, or registration numbers. Where data is missing, the element does not render.
- Do not use stock photography, illustrations, or generated images. The only visual is the surface SVG.
- Do not exceed the runtime dependency list in §A.9.
- Do not stop to summarise progress to the user mid-run. `docs/PROGRESS.md` and commits are the progress.

---

## 9. Final report — `docs/REPORT.md`

Exactly these sections, nothing else:

1. **Preview** — Vercel preview URL, or where to find it.
2. **Name** — whether `site.name` was confirmed or is still assumed.
3. **Before / after** — the live site's 1280 screenshot next to the new site's 1280 screenshot; baseline vs final rubric scores in a table; baseline vs final Lighthouse.
4. **Rounds** — how many loop rounds ran, findings fixed per round, and what the critic still flagged as low in the last round.
5. **Deviations** — anything from Appendix A you deliberately did not follow, one line of reasoning each.
6. **Skill conflicts** — every place the ui-ux-pro-max generator recommended something Appendix A overrode.
7. **Open for Nate** — address, phone, real photography, legal review, the name.

---
---

# Appendix A — Design spec (authoritative)

## A.1 Site config — `src/config/site.ts`
```ts
export const site = {
  name: "Girls Can Trade 2",   // CONFIRM. Old build used "Girls Country 2" (garbled dictation). If it's "Girls Can't Trade 2", change this line only.
  mark: "GC2",
  domain: "gc2.fund",
  city: "Austin, Texas",
  founded: 2019,
  structure: "Private partnership",
  mandate: "Liquid markets, global",
  emails: { investors: "investors@gc2.fund", press: "press@gc2.fund" },
  address: null as string | null,   // old site's Frost Bank Tower was a placeholder; null renders city only
  phone: null as string | null,     // old site's 555 number was fake; null renders nothing
};
```
The name is unusual for an institutional fund. Set it in plain type. Never explain it, never wink at it.

## A.2 What "Blackstone / high fund" means in pixels
Synthesis of institutional finance systems (Blackstone, KKR, Apollo; Public, Compound, Increase, Origin Financial, Mercury as catalogued on refero):
- Canvas is paper, not midnight. One deliberate inverted black band per page, never the default.
- 95% achromatic. One accent for links and focus only. Never a button fill, never a surface.
- Display type is the identity: 72–96px, weight 300–400, leading 0.95–1.05. Authority through restraint.
- Depth from surface steps and hairlines. Zero drop shadows.
- 1240px content width, 120px between sections. Whitespace is the hierarchy.
- The only filled button is black. Everything else is a text link.
- Numbers are tabular, same family as text, and real.
- Imagery is rare. Default here: none. One generated signature visual.
- Copy is short and declarative.
Spend boldness in exactly one place: the hero (display type + the surface). Everything else stays quiet.

## A.3 Color
| Token | Hex | Role |
|---|---|---|
| `paper` | `#FFFFFF` | Page canvas |
| `stone` | `#F3F4F1` | Alternate band, row hover, text on black |
| `hairline` | `#E3E5E1` | All rules and borders on paper |
| `mist` | `#C9CCC7` | Disabled, placeholders |
| `slate` | `#6B7178` | Secondary text, captions, labels |
| `ink` | `#1F2326` | Body text |
| `black` | `#000000` | Display headlines, wordmark, primary button, inverted band |
| `ledger` | `#0F4C3A` | Links, focus ring, active nav underline. Never a fill. |
| `ledger-tint` | `#E8F0EC` | Selected row background only |
| `muted-on-black` | `#9AA0A6` | Secondary text inside the black band |
| `hairline-on-black` | `rgba(255,255,255,0.14)` | Rules inside the black band |
No gradients. No tinted near-blacks. No second accent.

## A.4 Typography
Two families via `next/font/google`, variable, latin, `display: "swap"`, `adjustFontFallback: true`.
- **Newsreader** (display; `font-optical-sizing: auto`). Weight 300 for display/h1/h2, 400 for h3, wordmark, statements. Never above 400, never italic.
- **Instrument Sans** (text). 400 body, 500 nav/buttons/labels. Never 600+.
- No monospace. `font-variant-numeric: tabular-nums` globally.

| Token | Family/weight | Desktop | ≤768 | Leading | Tracking |
|---|---|---|---|---|---|
| `display` | Newsreader 300 | 96 | 52 | 1.00 | −0.01em |
| `h1` | Newsreader 300 | 72 | 44 | 1.02 | −0.01em |
| `h2` | Newsreader 300 | 48 | 34 | 1.08 | −0.005em |
| `h3` | Newsreader 400 | 28 | 24 | 1.20 | 0 |
| `lead` | Instrument Sans 400 | 22 | 19 | 1.45 | 0 |
| `body` | Instrument Sans 400 | 17 | 17 | 1.60 | 0 |
| `small` | Instrument Sans 400/500 | 15 | 15 | 1.50 | 0 |
| `caption` | Instrument Sans 400 | 13 | 13 | 1.50 | 0 |
Body measure ≤ 34em. Lead ≤ 30em. Headlines ≤ 3 lines at desktop, ≤ 2 in the hero.

## A.5 Layout, shape, elevation
- Container 1240px; gutters 24 (mobile) / 48 (≥1024). 12 columns, 24px gap. Section padding 120 desktop / 72 mobile, never < 64. Nav 72px, sticky. Spacing scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 120, 160.
- Everything left-aligned. Nothing centered except the mobile nav overlay.
- Radius: buttons/inputs 2px; cards/images 4px. No pills.
- Borders 1px `hairline`, spanning the container, not the viewport.
- Elevation: none. No `shadow-*` in `src/`. Sticky nav gains a 1px hairline bottom border after 8px scroll — the only depth cue on the site.

## A.6 Motion and the signature visual
- 150ms hover/focus; 500ms reveals; `cubic-bezier(0.2, 0.8, 0.2, 1)`. CSS only.
- One orchestrated moment: on home load, hero headline lines → subhead → actions fade+rise 12px, stagger 70ms, once. No scroll-triggered animation anywhere.
- Link hover: 1px underline `ink` → `ledger`, 150ms.
- `prefers-reduced-motion`: hero renders in final state; surface is static.
- **The surface:** ~40 isolines from deterministic 2D simplex noise (fixed, committed seed), marching squares over a 240×160 grid, paths simplified, 1px `hairline` strokes, no fills. Generated by `scripts/generate-surface.ts` → `public/surface.svg`, never at runtime. Sits behind the right half of the hero, masked to dissolve into paper leftward and downward. Animation: `scale(1)→scale(1.04) translate(-1.5%,-1%)`, 90s, alternate, infinite. Reused at 40% opacity top-right of the `/firm` header. Nowhere else.
- Iconography: none. The only glyph is a two-line hamburger on mobile (inline SVG, 1.5px stroke).

## A.7 Kill list — never, anywhere
1. Dark canvas as default. 2. Futures ticker. 3. Placeholder metrics (`$0M`, `0`, `0.0%`). 4. Italic, colored, or bold single-word accents in headlines. 5. `01`–`06` numbered markers. 6. `→` on links or buttons. 7. Uppercase tracked eyebrows; middle-dot meta strings. 8. Decorative quotation-mark glyphs. 9. Fake contact data. 10. Anchor-scroll nav. 11. Monospace labels. 12. Gradients, glass, shadows, pills, icon libraries, stock imagery. 13. "Short-convexity" describing the tail overlay — it is long convexity.

## A.8 Site map and page specs
Routes: `/`, `/firm`, `/strategies` (anchored sections per strategy), `/insights`, `/insights/[slug]` (MDX), `/contact`, `/disclosures`.

**Nav (desktop):** wordmark `site.mark` in Newsreader 400 22px left; Firm, Strategies, Insights, Contact in `small` 500; one black button **Investor inquiries** → `/contact`. Active route: 1px `ledger` underline, 6px offset.
**Nav (mobile):** wordmark + hamburger → full-viewport paper overlay, links in Newsreader 300 40px stacked, then the investors email in `small`. Focus trapped, closes on Escape, body scroll locked.

**Home, in order — nothing else:**
1. *Hero.* Height `min(calc(100vh - 72px), 900px)`, content vertically centered. Text cols 1–7; surface behind cols 6–12. `display` headline, black, 2 lines: **Evidence first. Then capital.** `lead` in `slate`, ≤30em: *{site.name} is a private investment partnership in {site.city}. We run concentrated, systematic strategies across liquid global markets, underwritten by our own research and a single risk framework.* Actions: black button **Our approach** → `/firm`; text link **Investor inquiries** → `/contact`.
2. *Facts.* 4-cell row, hairline above and below, 32px vertical padding, 2×2 on mobile. `caption` label in `slate` over value in Newsreader 400 28px black: Founded — 2019; Headquarters — Austin, Texas; Structure — Private partnership; Mandate — Liquid markets, global. The only "stats" on the site.
3. *The firm.* `h2` cols 1–5 **A research house that trades.** Two `body` paragraphs cols 7–12, then `ledger` link **About the firm**. P1: *Durable returns in liquid markets come from process, not prediction. We build our own data, write our own models, and put every idea through adversarial review before it earns capital.* P2: *The firm is deliberately small. Each position has a named owner who defends it in front of the desk, and we size to survive the tail rather than to flatter the mean.*
4. *Strategies.* `h2` **Six strategies. One risk framework.** Hairline list, not cards. Row → `/strategies#slug`: cols 1–4 name in `h3`; cols 5–9 one-liner `body`; cols 10–12 markets `small` `slate`. 28px row padding, hairlines between and around, hover `stone`, whole row focusable.
5. *Statement band.* Full-bleed `stone`, 120px padding. One `h2` sentence cols 1–9: *Risk is not the price of return. It is what we manage so that we are still here when the return arrives.* Attribution `small` `slate`: Investment Committee. No quote marks, no glyph.
6. *Insights.* `h2` **Notes from the desk.** with `ledger` link **All notes** right-aligned on the baseline. Hairline list of three latest: cols 1–2 date `small` `slate`; cols 3–10 title `h3` + dek `body` `slate`; cols 11–12 category `small` `slate`.
7. *Contact.* Full-bleed black band begins; text `stone`, secondary `muted-on-black`. `h2` **Inquiries**; `body`: *We speak with a small number of aligned partners each year. Introductions are welcome.* Columns: Investors {emails.investors}; Press {emails.press}; Office {address ?? city}. Phone only if set.
8. *Footer* inside the same band after a `hairline-on-black` rule: wordmark; links Firm, Strategies, Insights, Contact, Disclosures; `caption` legal: *{site.name} is a private investment partnership. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security. Past performance is not indicative of future results. Access to the fund is limited to qualified investors.*; © {year} {site.name}. All rights reserved.

**`/firm`** — `h1` **A research house that trades.**, surface at 40% top-right, `lead` standfirst. Sections (`h2` left, prose right, 5/7 split): Origins; How we work; Governance (Investment Committee sets mandate and limits; risk runs independently of the desk and can cut any position; the tail overlay is permanent, not discretionary); Where we are. 2–3 paragraphs each in the §A.10 voice. No bios, no people.
**`/strategies`** — `h1` **Six strategies. One risk framework.**, lead on why one framework governs six books; six full-width blocks with `id={slug}`: `h2` name; definition list (Markets, Instruments); two paragraphs; hairline between.
**`/insights`** — `h1` **Notes from the desk.**, full hairline list, newest first.
**`/insights/[slug]`** — measure 680px; date + category `small` `slate`; title Newsreader 300 56px/1.05; body Instrument Sans 18/1.7; in-article `h2` Newsreader 400 30px; closing `caption`: *This note is commentary from the desk. It is not investment advice and does not describe any position the fund holds.*; plain-text prev/next.
**`/contact`** — `h1` **Inquiries.**, one paragraph, the same three columns on paper. No form (no backend). Mailto only.
**`/disclosures`** — `h1` **Disclosures.**, measure 680px, sections: Nature of this website; No offer; Qualified investors; Forward-looking statements; No performance information; Third-party content; Contact. Generic legal register; offering documents govern; invent no regulator, number, or jurisdiction.

## A.9 Technical
Next.js 15+ App Router, TypeScript strict, Tailwind v4 (`@import "tailwindcss"; @theme {…}` in `globals.css` holding every token; zero arbitrary values in `src/`). MDX via `@next/mdx`. `metadata` on every route, title template `%s — {site.name}`, home title `{site.name} — Private investment partnership, Austin`, descriptions ≤155 chars. OG images via `next/og` from tokens (site-wide + per note). `sitemap.ts`, `robots.ts`, `Organization` JSON-LD on home. Every route prerendered. Client components: only `MobileNav` and the nav scroll listener. Skip link; landmarks; one `h1`; heading order; `focus-visible` 2px `ledger` ring, 3px offset (stone ring on black); AA contrast everywhere; reduced motion respected. Lighthouse ≥95 ×4 on `/` and `/strategies` mobile; LCP <1.5s; CLS 0. **Runtime deps:** next, react, react-dom, tailwindcss, @next/mdx (+ its peers), simplex-noise (build script only). Nothing else at runtime. Components allowed: Wordmark, Nav, MobileNav, Button (one variant), TextLink, Section, Container, Grid, FactsRow, HairlineList/HairlineRow, Statement, Surface, PageHeader, Prose, Footer. Anything pulled from 21st.dev or shadcn is stripped to these tokens; nothing ships with a default kit look.

## A.10 Copy — voice and final content
Voice: short declarative sentences; American spelling; no exclamation marks; no marketing adjectives (world-class, cutting-edge, seamless, unlock, leverage, empower, innovative, bespoke); no performance claims or return figures; sentence case everywhere.

**Strategies** (name — one-liner — markets — instruments — long form):
- **Systematic Macro** — Directional cross-asset risk driven by rates, growth, and liquidity regimes. — Rates, FX, equity index — Futures, swaps — *A regime classifier maps the global cycle into discrete states. Positions express the state rather than a point forecast, and unwind when the state changes, not when the P&L hurts.*
- **Volatility Arbitrage** — Relative value between implied and realized volatility across the surface. — Equity index, rates — Options, variance — *We hold convexity where the market overpays for certainty and shed it where the term structure inverts. Gamma is a budget, not an accident.*
- **Statistical Relative Value** — Mean reversion inside tightly defined economic cohorts. — Equities, futures — Cash equities, futures — *Pairs and baskets come from cointegration that holds out of sample. Every leg carries a borrow, funding, and capacity assumption before it is allowed to size.*
- **Commodity Carry** — Term structure and inventory dislocation in physical markets. — Energy, metals, agriculture — Futures, spreads — *Storage economics anchor the curve. When the market prices a shortage the warehouses do not show, we take the other side and wait for the data.*
- **Event Dislocation** — Liquidity provision around scheduled and unscheduled catalysts. — Equity index, single names — Cash equities, futures — *Reconstitutions, auctions, and forced flows move prices for reasons unrelated to value. We are paid to absorb that, and we size to the impact estimate rather than the headline.*
- **Tail Overlay** — A permanent long-convexity hedge that runs across the whole book. — Cross-asset — Options — *The overlay is a cost of doing business, not a trade. It runs continuously so the rest of the book can hold conviction through a drawdown it did not cause.*

**Notes** (350–500 words each of MDX, firm's voice, no performance-implying numbers):
- 2026-07-14 · Research · **Trade the regime, not the forecast** — Point estimates decay in days. Regime classification survives quarters. Why we stopped asking where the market is going.
- 2026-05-02 · Risk · **The honest cost of convexity** — A permanent hedge looks expensive in every month it isn't needed. The arithmetic that makes it cheap across a full cycle.
- 2026-02-20 · Process · **Capacity is a research problem** — A strategy that cannot be sized is a hobby. Why we underwrite market impact before we underwrite edge.

---

# Appendix B — Skill query cookbook

Run these with `$SKILL_SEARCH` from `docs/ENV.md`. Save outputs to `docs/skill-notes.md`. Follow the guidance unless it contradicts Appendix A.

**Phase 3 (design system):**
```bash
$S "institutional finance editorial serif" --domain typography
$S "minimalism editorial whitespace hierarchy" --domain style
$S "fintech banking anti-patterns" --domain style --json
```
**Phase 4.2 (shell):**
```bash
$S "sticky header scroll border" --stack nextjs
$S "mobile menu focus trap escape" --domain ux
$S "font loading layout shift" --stack nextjs
$S "skip link landmarks heading order" --domain ux
```
**Phase 4.4 (home):**
```bash
$S "hero headline wrap balance orphan" --domain ux
$S "clickable row link semantics keyboard" --domain ux
$S "text reflow narrow width zoom" --domain ux
$S "prefers-reduced-motion animation" --domain ux
```
**Phase 4.5 (articles, metadata):**
```bash
$S "long-form article reading measure line-height" --domain ux
$S "app router metadata open graph sitemap" --stack nextjs
```
**Section 5 (every round):**
```bash
$S "pre-delivery checklist responsive contrast focus reduced-motion text reflow" --domain ux
$S "focus visible dark background contrast" --domain ux
$S "responsive 375 768 1024 1440 breakpoints" --domain ux
```
Ignore any skill output that recommends: dark mode, gradients, glassmorphism, neumorphism, bento grids, icon libraries (Heroicons/Lucide/Phosphor), `cursor-pointer` on non-interactive elements, or a palette other than §A.3. Log the conflict in `docs/DECISIONS.md`.

---

# Appendix C — Critic rubric

Score each page at each width. 1 = fails, 3 = acceptable, 5 = would sit next to blackstone.com without apology. Anything below 4 is a finding.

| # | Criterion | What 5 looks like |
|---|---|---|
| 1 | Institutional register | A stranger would assume a nine-figure fund, not a startup |
| 2 | Display type carries the page | The headline is the design; nothing competes with it |
| 3 | Whitespace and rhythm | Sections breathe; no two sections feel the same density |
| 4 | Restraint | One accent, zero shadows, zero decoration that isn't information |
| 5 | Copy | Declarative, specific, no filler, no adjectives, no hype |
| 6 | Mobile is designed | 390 layout is a composition, not a collapse |
| 7 | Consistency | Every value traces to a token; nothing ad hoc |
| 8 | Accessibility | Focus visible everywhere incl. on black; AA contrast; reduced motion honored |
| 9 | Spec fidelity | Every §A.8 element present, in order, as specified |
| 10 | Kill list | Nothing from §A.7 present |

Finding format: `[page] [width] [high|medium|low] [what] [which spec line it fails]`.

The critic writes the scores as a table per page, then the findings, then one paragraph: "The single change that would most improve this round." The builder addresses that paragraph first.
