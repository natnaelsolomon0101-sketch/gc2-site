# GC2 v4 — Every Screen. The Conductor and the Ten.

**Make girlscantrade2.com look finished on every phone, tablet, laptop, monitor, and ultrawide that exists — and make the first screen on a phone something people screenshot.**

Runs on top of `docs/ORCHESTRATION.md` (design tokens), `docs/SWARM.md` (agent mechanics), and `docs/ALLOCATOR.md` (content and the 506(b) word list). Nothing in those documents is repealed. This one adds a structure the previous ones didn't have: **one Conductor who does no building and never stops prompting, ten specialists who each own exactly one part of the site, and a viewport matrix that sees everything automatically so no human has to.**

> **How to run (Nate) — three things only you can do first:**
> ```bash
> cd gc2-site && git checkout main && git pull
> git checkout -b v4/every-screen
> cp ~/Downloads/gc2-v4-every-screen.md docs/EVERY-SCREEN.md
>
> # 1. 21st MCP (rotate the key first if you haven't)
> export API_KEY_21ST="..."
> claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: $API_KEY_21ST"
>
> # 2. MotionSites MCP — this one opens a browser and needs YOU to sign in. Do it now, not mid-run.
> claude mcp add motionsites --scope user --transport http https://xgdzyqfalbibzelpdpvr.supabase.co/functions/v1/mcp
> claude mcp list     # both must say connected
>
> # 3. Decide the primary domain (see §0.2) and tell the Conductor in the launch line
> claude --dangerously-skip-permissions "Read docs/EVERY-SCREEN.md, then docs/ORCHESTRATION.md Appendix A, docs/SWARM.md, docs/ALLOCATOR.md §10.2. Primary domain is girlscantrade2.com. Execute docs/EVERY-SCREEN.md end to end. You are the Conductor. Do not write page code yourself."
> ```
> MotionSites free accounts can open **three** prompts. The Conductor is told exactly which three to spend them on (§3.3). If you want the full library, buy the plan before launch; the Conductor will detect the difference and log it.
>
> Budget: 8–12 hours. Per-section loops are capped so it cannot run forever.

---

## 0. Where the site actually stands — what the Conductor verifies first

Read from the live HTML on 3 September 2026. The Conductor confirms each with a screenshot in the first fifteen minutes and writes `docs/v4/STATE.md`.

### 0.1 What is right
The redesign is live. The name is **Girls Can Trade 2**, mark **GC2**. Real routes, real metadata, the allocator layer is built (`/team`, `/partnership`, `/diligence`, `/governance`, `/letters`, `/tearsheet`, `/questions`, `/access`), the copy is in the firm's voice, the four-stage "how an idea earns capital" section is strong, the tail overlay is correctly described as long convexity, and the placeholder metrics, ticker, fake phone, and fake address are gone. **This is the base. Nothing here gets thrown out.**

### 0.2 Regressions and bugs — fixed in the first hour before any section work
1. **Canonical mismatch.** Every page declares `canonical: https://gc2.fund` while the site is served from `girlscantrade2.com`. Search engines will index the wrong domain and social previews will resolve inconsistently. Fix: one primary domain (Nate's launch line says which), `metadataBase` set to it, the other domain permanently redirected at the Vercel project level (308), every `canonical` and `og:url` derived from `metadataBase`.
2. **No OG image.** The old build had one; the redesign has `twitter:card: summary_large_image` and no `og:image`. Every share of every page currently renders as a blank card. This is the opposite of instagrammable. §8.4 rebuilds it properly.
3. **Duplicate statement band.** "Risk is not the price of return…" renders twice on the home page — once after the facts row and once after the strategies. Keep one, in the position the Conductor judges strongest from the screenshots.
4. **Numbering crept back.** `01 / 06`, `01`–`06` on strategies, and `01/Process/…` on the insights row. Appendix A §A.7 line 5 still stands for anything that is not a sequence. Decision: numerals on the four **process stages** are legitimate (they are ordered); numerals on **strategies** and on the **insights row** are not and come off.
5. **`eight pages, eight questions.`** — an `h2` beginning lowercase. Fix to sentence case.
6. **`--:--:-- ET` clock placeholder** is in the server HTML. If JavaScript fails or is slow, users see dashes. Render the time server-side at request time or render nothing until hydrated — never dashes.
7. **`theme-color: #0f1011`.** A tinted near-black. If the canvas is paper, `theme-color` must be paper; if the site has gone to a dark canvas, the Conductor screenshots it and checks it against Appendix A before anything else — the tokens say paper.
8. **Dates.** The home page says "Formed September 2026." Confirm every page agrees (the old copy said 2019 in places). One founding fact, everywhere.

---

## 1. The two goals, and the one rule that keeps them honest

**Goal one — every screen.** Not "responsive." *Finished* at every size a human might use: a 320px iPhone SE, a 430px Pro Max in landscape, a 768px iPad in portrait, a 1366px corporate Windows laptop, a 2560px monitor, a 3440px ultrawide, at 200% browser zoom, with reduced motion, in Safari. The site is judged at each of these by an agent that looks at the screenshot, not at the CSS.

**Goal two — instagrammable.** The first viewport on a phone is a poster: wordmark, one headline, one visual, nothing amputated at the fold. The hero on a large screen is a frame someone would put in a mood board. Scroll is choreographed enough that a screen recording is watchable. The share cards are the site's own components, not a marketing afterthought.

**The rule:** instagrammable is achieved by *composition, type, and honest visuals* — never by decoration. Everything that made the site institutional stays: paper, hairlines, Newsreader 300, one green accent, no shadows, no gradients, no icons, no stock imagery. Bold lives in exactly three places — the hero, the section transitions, and the share kit. Everywhere else stays quiet. And every visual that looks like data **is** data, with a source and an as-of date, or it has no axes and claims nothing. Nothing on any public page states, plots, or implies fund performance. The 506(b) word list in `docs/ALLOCATOR.md` §10.2 runs on every build, including on the share kit.

If the Conductor ever has to choose between "more striking" and "still honest," honest wins and the choice is logged.

---

## 2. What "meaningful for trading and finance" means as a visual — the data-art layer

The current hero is typographic with a decorative surface. It reads as institutional and it reads as generic. The fix is not more decoration; it is **real market structure, rendered in the site's own hairline vocabulary, updated automatically, with its source printed underneath.** Public data, not fund data.

Candidates, in order of preference. The `sec-hero` and `sec-motion` agents build the first that works; the rest are options for other sections.

1. **The U.S. Treasury par yield curve, today.** The Treasury publishes daily par yield curve rates as XML/CSV, no key required — locate the current endpoint on home.treasury.gov. One hairline drawn from 1-month to 30-year, labeled at the tenors in `caption`, with "U.S. Treasury · as of {date}" beneath. Fetched at build with ISR (revalidate every 6 hours; markets close, the shape changes). The curve's shape is the single most-discussed object in macro; drawing it plainly is a statement of who the site is for. It is different every day, which makes every screenshot dated and specific.
2. **Global session clock.** The existing clock becomes a three-city session strip — Tokyo, London, New York — each showing local time and whether the cash session is open, computed client-side from time zones and published session hours, no data feed. Honest, live, and unmistakably a trading firm's object. On mobile it collapses to the currently open session only.
3. **ECB euro reference rates** as a quiet grid of majors with daily change — the ECB publishes a daily XML, no key. Used in a section, not the hero.
4. **FRED series** (VIX close, 2s10s spread) if Nate supplies a free FRED key; otherwise skip.

**Forbidden:** anything requiring a licensed feed scraped without terms (CME settlements, Cboe term structure pages), anything that could be mistaken for the fund's P&L, sparklines next to the strategy names, a candlestick chart, a ticker.

**Rendering rules:** 1px `hairline` or `ink` strokes only; axes in `caption` `slate`; no fills; no gradient; the source line is mandatory and is part of the design; SVG rendered server-side, animated only by drawing-in once on load (`stroke-dashoffset`, 900ms) and static under reduced motion; a `data-source` attribute on the SVG that `scripts/qa/sources.ts` reads and verifies against a whitelist.

---

## 3. Tooling — skills, MCPs, and how each is allowed to be used

### 3.1 Install skills from GitHub — procedure, not a list to trust blindly
The Conductor may install any Claude Code skill that helps, from GitHub, using this procedure for each:
```bash
gh search repos "<term>" --limit 10          # or WebSearch "site:github.com <term> SKILL.md"
gh repo view <owner>/<repo>                   # must exist, must have a SKILL.md, must have been updated in the last 12 months
git clone --depth 1 https://github.com/<owner>/<repo>.git /tmp/skill-<name>
find /tmp/skill-<name> -name SKILL.md         # read every one before deciding
cp -RL <the skill folder> .claude/skills/<name>
```
Verify by using it once. Log every install in `docs/v4/SKILLS.md`: repo, commit, what it's for, what it turned out to be good at. Never install a skill that asks for credentials, runs a post-install script, or can't be read in full first.

Candidates to check first (verify each exists before cloning — do not assume):
- `nextlevelbuilder/ui-ux-pro-max-skill` — already installed per ORCHESTRATION §1.2; the reasoning engine for style, typography, UX, and stack guidance. Required.
- `anthropics/skills` — Anthropic's public skills repo; the `frontend-design` skill in particular for aesthetic direction and anti-slop guidance.
- `21st-dev/claude-code-plugin` — bundles the 21st CLI skill with the MCP.
- Anything returned by searching `claude skill responsive`, `claude skill playwright visual regression`, `claude skill motion animation web`, `claude skill accessibility audit` — read, judge, install only if it adds something the above don't.

### 3.2 The ui-ux-pro-max skill — mandatory queries per section
Every section agent runs these before touching its section and pastes the relevant lines into its report. `$S` is the `search.py` path from `docs/ENV.md`.
```bash
$S "responsive breakpoints mobile first fluid" --domain ux
$S "mobile hero composition above the fold" --domain ux
$S "touch target size thumb zone" --domain ux
$S "safe area notch viewport height mobile safari" --stack nextjs
$S "text reflow 320px zoom 400%" --domain ux
$S "container queries component responsive" --stack nextjs
$S "scroll animation performance reduced motion" --domain ux
$S "large screen ultrawide layout max width" --domain ux
$S "pre-delivery checklist responsive contrast focus" --domain ux
```
Standing override from previous briefs applies: if the skill recommends dark mode, gradients, glass, icons, a chart library, or a lead-capture form, log and ignore.

### 3.3 MotionSites — three prompts, spent deliberately
The MCP pulls real MotionSites prompts. A free account opens **three**. Spend them here, in this order, and nowhere else unless the account is paid:
1. **A hero.** Ask the MCP for a finance / editorial / minimal hero prompt — not a 3D or glow one. Read it for **structure and choreography**: how the headline enters, how the visual is positioned relative to type, what the scroll cue is, how it collapses on mobile.
2. **A footer.** The current footer is functional; a MotionSites footer prompt is usually the most interesting part of their library because footers are where they put the type play.
3. **A section transition or "features" block** for the strategies list.

**Translation rules — nothing ships from MotionSites as written:**
- Colors, fonts, shadows, gradients, glows, 3D, particles, blur, glass: all replaced with Appendix A tokens or deleted. If the prompt's idea *is* the glow, the idea is rejected.
- Copy is never taken; only layout and motion timing.
- Every borrowed motion is re-timed to Appendix A §A.6 (150 / 500ms, one easing) and gated by `prefers-reduced-motion`.
- The agent records in `docs/v4/MOTIONSITES.md`: which prompt, what idea was kept, what was stripped, and a before/after screenshot. If the account is paid, the Conductor may spend more, with the same log entry each time.
- If the OAuth wasn't completed and the MCP is not connected, the Conductor logs it and reads the public gallery previews on motionsites.ai for structural ideas instead — no login, no prompt text, and that's fine.

### 3.4 21st MCP — structural components only
Per `docs/SWARM.md` §2 and §3.4: source structure (drawers, disclosure rows, sticky rails), strip the skin, log the source. `tools/list` first; tool names live in `docs/ENV.md`.

---

## 4. The Conductor

The Conductor is the main session. It reads screenshots, writes prompts, merges branches, and decides. **It never writes page code.** If it catches itself editing a component, that is a process failure — it stops and re-delegates.

### 4.1 The loop, per section
```
for each section S (in parallel, worktree-isolated):
  round = 0
  launch S's agent with: its scope (§5), the device matrix for its section (§6), the failing screenshots from the last matrix run, the exact fix list, and the "do not touch" list
  agent returns: branch, before/after screenshots at the viewports it was told about, one sentence per change
  Conductor merges the branch into v4/every-screen (no conflicts by construction — ownership is disjoint)
  viewport-runner runs S's slice of the matrix
  Conductor LOOKS at every screenshot for S and scores it against §5 done-criteria
  if all pass twice in a row → S is DONE, lock it (no further edits without Conductor re-opening)
  else round += 1; write the re-prompt (§4.2); if round == 6 → escalate (§4.3)
```
All ten loops run concurrently. The Conductor is the only serialization point. It keeps `docs/v4/BOARD.md` — a table of ten rows: section, round, status, last failing viewports, next action — updated after every merge.

### 4.2 The re-prompt template — this is the "keeps prompting" part
Every re-prompt is specific. Vague re-prompts ("make it better on mobile") are forbidden; the Conductor writes what it *sees*:
```
SECTION: hero · ROUND: 3 · STATUS: failing at iPhone SE 320, iPad portrait 768, ultrawide 3440

WHAT I SEE
- 320: headline wraps to 4 lines and "capital." sits alone; the curve is clipped on the right by 18px (screenshot: docs/v4/shots/r3/hero-320.png)
- 768: hero is 1240px tall — two empty scrolls before the facts row
- 3440: type is 96px in a 1240 container on a 3440 canvas; the curve is a thread; the page looks like a business card on a wall

WHAT THE SPEC SAYS
- §5.2 done-criteria 2, 4, 7; §7.1 fluid type upper bound; §7.6 ultrawide

FIX EXACTLY
1. Reduce the 320 headline to 44px via the clamp() floor; balance so no single-word last line
2. Cap hero height at min(100dvh, 820px) on ≤1024
3. Raise the clamp() ceiling to 128px above 1920 and let the curve extend full-bleed to the right edge

DO NOT TOUCH: nav, facts row, anything outside src/components/sections/hero/**
RETURN: branch, before/after at exactly 320 / 768 / 3440, one sentence per fix
```

### 4.3 Escalation
At round 6 with the same failure: change the agent's `model` to `opus` if it wasn't, restate the problem from scratch with the *original* screenshots and the *latest* side by side, and give it one more round. At round 8: the Conductor opens the section to a different section agent whose scope is adjacent (hero → motion, strategies → allocators) with a fresh framing. At round 10: log as OPEN in the report with every attempt listed. No section loops past 10.

### 4.4 Integration rounds
After any five sections lock, and again when all ten lock: the full matrix (§6) on every route, then the critic panel from `docs/SWARM.md` and `docs/ALLOCATOR.md` in parallel (`critic-brand`, `critic-craft`, `critic-lp`, `family-principal`, `securities-counsel`, `a11y-auditor`, `ideas-lab`) plus the new `thumb-critic` (§5.11). Integration findings are routed back to the owning section, which re-opens for that fix only.

### 4.5 Budget and caps
8–12 hours total. Any section's loop stops at 10 rounds. Integration rounds stop at 4. The Conductor writes `docs/v4/PROGRESS.md` on every state change; on restart it resumes from the board.

---

## 5. The Ten

Each owns one scope. Ownership is absolute (`docs/SWARM.md` §2.3). Each reads Appendix A, this document's §1, §2, §6, §7, and its own block below, before touching anything. Each has a **mobile poster requirement** — what its section must look like as the first or a standalone phone screen — and **done-criteria** the Conductor scores from screenshots.

| # | Agent | Owns | Done when (summary) |
|---|---|---|---|
| 1 | `sec-chrome` | Nav, mobile menu, footer, skip link, session clock | Nav never overlaps content; menu is a full poster; footer is designed |
| 2 | `sec-hero` | Hero + the Treasury curve visual | Poster at 393; frame at 1920; fits 320; breathes at 3440 |
| 3 | `sec-framework` | Risk-framework statement, facts row, the single statement band | One band, not two; facts readable at 320 without wrap |
| 4 | `sec-strategies` | Six strategies (home + `/strategies` + left rail) | Rows scan on phone; rail on desktop; no numbering |
| 5 | `sec-approach` | The four stages, the veto, tail overlay (home + `/governance`) | Stages are a vertical narrative on phone, a horizontal one on desktop |
| 6 | `sec-insights` | Notes list, article template, marginalia | Article is a joy to read at 393 and 1920 |
| 7 | `sec-allocators` | Eight-pages grid + `/partnership` `/diligence` `/questions` `/access` `/letters` | Grid is a composition at every width; disclosure rows are thumb-friendly |
| 8 | `sec-firm` | `/firm`, `/team`, `/contact` | Prose measure holds everywhere; contact is one thumb away |
| 9 | `sec-legal` | `/legal`, `/disclosures`, `/tearsheet`, 404 | Tearsheet prints to one page; legal reads at 320 |
| 10 | `sec-motion` | Scroll choreography, section transitions, OG + share kit, data-viz components used by others | One coherent motion language; share kit renders |

### 5.1 `sec-chrome`
- Nav: 72px desktop, 56px on ≤768. On phones the nav never covers the first line of any headline (check every page at 320 and 393 with the nav sticky). Bottom hairline appears after 8px scroll, not before.
- Mobile menu: a full-viewport paper poster. Wordmark top-left, five links in Newsreader 300 at `clamp(32px, 9vw, 44px)`, the investors email in `small`, the session clock at the bottom. Opens in 200ms fade, traps focus, closes on Escape and on route change, respects `100dvh` and safe-area insets so nothing hides behind the home indicator. This menu is a screenshot on its own — compose it as one.
- Footer: rebuilt from a MotionSites footer prompt (§3.3, prompt 2), translated: the three link columns become a single hairline-ruled table on ≥1024 and stacked groups on phones; the disclosure block sets in `caption` with a 60em measure; the wordmark can be large here — this is the one place a 200px+ "GC2" in Newsreader 300 is welcome, hugging the bottom-left, cropped by the viewport edge on desktop, full on mobile. Designed, not dumped.
- Session clock: §2 candidate 2. Never renders dashes.
- Done: nav OK on every route at all §6 phone widths in both orientations; menu poster passes `thumb-critic`; footer is scored ≥4 by `critic-craft`; zero horizontal overflow at every width.

### 5.2 `sec-hero`
- The poster (393×852, WebKit): wordmark in the nav, headline "Evidence first. Then capital." in `clamp(44px, 12vw, 64px)` on two lines, the lead in 17px at 30em, the curve below the lead as a full-bleed hairline with its source line, one black button. Everything above the fold; nothing cut. The 320 version drops the lead to 15px and keeps the curve.
- The frame (1920×1080): headline at `clamp(72px, 6.5vw, 128px)`, columns 1–6; the curve spans columns 6–12 and bleeds to the right viewport edge; tenor labels along the bottom; the source line in `caption` bottom-right. This is the mood-board frame — the Conductor screenshots it at 1920 and 2560 and asks `critic-brand` "would you post this."
- Ultrawide (3440): container stays 1240 for text but the curve bleeds; type ceiling rises per §7.6; the hero never exceeds 900px tall regardless of viewport.
- Hero height: `min(100dvh, 900px)` desktop; `min(100dvh - 56px, 820px)` mobile; never `100vh` (Safari address bar).
- Load choreography: headline lines rise 12px and fade in staggered 70ms, then the lead, then the button, then the curve draws in over 900ms. Once. Reduced motion: everything final, curve static.
- MotionSites prompt 1 is read before building; structure ideas only.
- Done: poster and frame both approved by `critic-brand` ≥4.5; passes at every §6 phone in portrait and landscape; LCP < 1.5s mobile on throttled 4G; the curve has a verified source; no text under the nav at any width.

### 5.3 `sec-framework`
- Fix the duplicate band first (§0.2 item 3). The statement band lives in one place.
- Facts row: at 320 and 375 the four cells become a 2×2 with a hairline cross; labels never wrap; values in Newsreader 400 at `clamp(22px, 6vw, 28px)`.
- The risk-framework statement ("Correlated risk does not respect a mandate boundary") becomes the section's poster: full-bleed `stone`, the sentence at `h2` scale, left-aligned, columns 1–9. On phone: 34px, three lines maximum, no orphan.
- Done: one band; facts row passes at 320; the statement is a standalone screenshot `family-principal` would forward.

### 5.4 `sec-strategies`
- Numerals off (§0.2 item 4). The six rows are the design.
- Phone: each row stacks name / one-liner / markets with 12px gaps and a 24px hairline-to-hairline padding; the whole row is the tap target (≥ 44px); hover states are replaced by `:active` and `:focus-visible` on touch (`@media (hover: hover)` gates hover).
- `/strategies`: the sticky left rail on ≥1280; on ≤1279 it becomes a horizontal scroll-snap strip of six plain links under the page header — the one horizontal scroll permitted on the site, with visible edge affordance (last item peeking) and no scrollbar chrome.
- MotionSites prompt 3 read for the row entrance choreography; translated to a 500ms stagger on first reveal only, never on scroll.
- Done: rows readable at 320 without truncation; rail works at 1280 and 3440; strip works at 393 with a thumb; no numerals anywhere in the section.

### 5.5 `sec-approach`
- The four stages are the site's best content and its hardest layout. Desktop (≥1280): a horizontal narrative — four columns, each stage a column, the veto and the tail overlay as full-width bands beneath; hairlines connect. Tablet (768–1279): two columns. Phone: a vertical narrative with the stage numeral at the left margin (numerals are legitimate here — the stages are ordered), a hairline spine running down the left, "Advances when" set as a `caption` block with a top hairline.
- Typography: stage titles in Newsreader 400 at `clamp(22px, 5.5vw, 28px)`; body at 17px; nothing over 34em.
- Done: reads as one story at 393 in one thumb-scroll per stage; the horizontal version at 1920 is a screenshot `critic-craft` scores ≥4.5; no section exceeds 3 viewport heights on phone.

### 5.6 `sec-insights`
- Article template: measure `clamp(20em, 90vw, 36em)`; body 18/1.7 on desktop, 17/1.65 on phone; title `clamp(32px, 8vw, 56px)`; marginalia (ALLOCATOR §7.1) in the left margin at ≥1280, inline `<details>` below; footnotes with the one permitted `↩`.
- Pull quotes inside articles: the current build has one ("Nobody lies; the number simply drifts…"). Set it in Newsreader 300 at `h2` scale, full measure, hairline above and below, no quote marks, no italics — the same object as the statement band, so the site has one way of emphasizing a sentence.
- The notes list on home: one note is honest and it looks thin. Keep it honest: one row, full width, with the pull quote beneath it as designed — a single note presented with confidence beats three padded ones.
- Done: article reads at 320 with no horizontal overflow, at 200% zoom on 1280, and at 1920 with marginalia; a screenshot of the article at 393 passes `thumb-critic`.

### 5.7 `sec-allocators`
- The eight-pages grid: on ≥1280 a 2×4 hairline grid, question in Newsreader 400 at 24px, dek in `body` `slate`; on 768 a 2-column; on phones a single stacked list where each row is a tap target with the question first. The grid is the section most likely to look like a card kit — no borders on all sides, hairlines between only, no hover lift.
- `/questions` disclosure rows: the summary is the whole tap target (≥ 56px tall on phone); the open marker is the hairline shifting `hairline`→`ink`; body at 34em; every `<details>` expands on print.
- `/partnership` three doors: full-width blocks, never side-by-side cards, at every width.
- `/diligence` and terms tables: real `<table>` on ≥768, term-over-value stack on phones with a hairline between pairs; never a horizontally scrolling table.
- Done: every page passes at 320 / 393 / 768 / 1280 / 1920; disclosure rows operable by thumb and keyboard; tables stack correctly; the grid at 1920 is scored ≥4 by `critic-brand` for not looking like a card kit.

### 5.8 `sec-firm`
- `/firm` and `/team`: prose at 34em everywhere; section `h2`s left, prose right on ≥1024 (5/7 split); stacked on phones with the `h2` above its prose, never orphaned at the bottom of a screen.
- `/contact`: on phone, the investors address is visible without scrolling and is a tap-to-mail target ≥ 44px; four audiences stack; nothing centered.
- Done: measure holds at every width; contact passes `thumb-critic`'s "one thumb from the address" test.

### 5.9 `sec-legal`
- `/legal` and `/disclosures` at 320 with 200% zoom: still readable, still a 34em measure, no horizontal scroll.
- `/tearsheet`: one page at A4 and Letter, verified by `scripts/qa/print.ts`; on screen, the preview is a paper-proportioned object centered in the viewport with the print button beneath.
- 404: `h1` "Not found.", one sentence, one link, the wordmark. Also composed as a poster on phone — people screenshot 404s.
- Done: print verified; 404 passes `thumb-critic`; legal pages pass reflow at 320/400% zoom.

### 5.10 `sec-motion`
The cross-cutting visual agent. Owns `src/components/viz/**` (the curve, the session clock, the ECB grid), `src/lib/motion.ts` (the single timing/easing source every section imports), `src/app/**/opengraph-image.tsx`, and `scripts/share-kit.ts`.
- **One motion language.** Every section's reveal, stagger, and hover reads from `motion.ts`. If two sections move differently, that's a bug the Conductor routes here.
- **Section transitions.** Between sections on home: nothing fancy — the hairline that ends one section is the hairline that begins the next, and on scroll the `stone` bands enter without animation. The "choreography" is consistency, not effects. Parallax is forbidden; it breaks on every phone.
- **Data components** (§2): build the curve first, the session clock second, the ECB grid third. Each has a `source` prop rendered as its caption and a `data-source` attribute for QA.
- **OG images** (§0.2 item 2): per route, from tokens, `next/og`: paper, black Newsreader 300 headline at 96px, the wordmark bottom-left, the route's one-line description, nothing else. For the home page: the curve itself, drawn from the same data, with its source line — an OG image that is different every day.
- **Share kit** (`npm run share-kit`): Playwright renders five compositions from the site's own components at 1080×1350 (portrait post), 1080×1920 (story), 1200×630 (OG), 1600×900 (X), and 1080×1080 — the hero headline, the risk-framework statement, the four stages as a single tall poster, the strategies list, and the curve with its date. Written to `public/share/` and listed in the report. **Every share card passes the 506(b) word list and a `securities-counsel` read before the kit is considered shipped** — these are firm brand cards, not fund marketing, and they must read that way.
- Done: `motion.ts` is the only timing source in `src/`; all three data components render with sources; OG images verified for every route in `docs/v4/og/`; share kit renders and passes counsel.

### 5.11 `thumb-critic` (new critic, read-only)
Not one of the Ten — a critic that only looks at phone screenshots.
```markdown
<!-- .claude/agents/thumb-critic.md -->
---
name: thumb-critic
description: Judges the site exclusively on phone screenshots, portrait and landscape, as a person holding a phone with one hand. Use in every section round and every integration round. Read-only.
model: opus
tools: Read, Glob, Grep
disallowedTools: Write, Edit, Bash
---
You only ever see phone screenshots: 320, 360, 375, 390, 393, 412, 430 wide in portrait, and 852×393 / 932×430 landscape, from WebKit and Chromium. You never see desktop and you do not care about it.
For every screenshot, answer: Is the first screen a finished poster — would someone screenshot it? Is anything cut by the fold in a way that looks amputated? Is the primary action reachable by a right thumb without shifting grip (bottom 60% of the screen, right two-thirds)? Are tap targets at least 44px with 8px between them? Does any text run under the sticky nav? Is there horizontal overflow (look for a cut-off right edge)? Are headlines three lines or fewer with no single-word last line? Is the landscape version designed or just squashed?
Score 1–5 per screenshot. Findings as [route] [device] [orientation] [severity] [what] [why]. End with the three screenshots that would make the best Instagram posts as they stand, and the three worst.
```

---

## 6. The viewport matrix — "auto see everything," specified

Owned by `viewport-runner` (tooling agent, haiku, Bash). Script: `scripts/qa/matrix.ts`. Output: `docs/v4/shots/<round>/<route>--<device>--<mode>.png` plus `matrix.json` with per-shot checks. Runs in **three browsers** — Playwright's Chromium, WebKit, and Firefox — because iPhone Safari is WebKit and it is where hero heights, sticky positioning, and font rendering actually break.

### 6.1 Devices
Use `playwright.devices[...]` descriptors where they exist (DPR, user agent, touch, viewport); fall back to explicit viewport + DPR + `isMobile: true` where a name is missing.

| Class | Widths / descriptors | Orientation | Browser |
|---|---|---|---|
| Phone — floor | 320×568 (iPhone SE 1st, DPR 2) | portrait | WebKit |
| Phone | iPhone SE (375), iPhone 14 (390), iPhone 15 / 15 Pro (393), iPhone 15 Pro Max (430), Pixel 7 (412), Galaxy S9+ (360) | portrait **and** landscape | WebKit for iPhones, Chromium for Android |
| Tablet | iPad Mini (768×1024), iPad Air (820×1180), iPad Pro 11 (834×1194), iPad Pro 12.9 (1024×1366) | portrait and landscape | WebKit |
| Laptop | 1280×720, 1366×768 (DPR 1), 1440×900 (DPR 2), 1536×864 (DPR 1.25 — the most common Windows laptop), 1680×1050 | — | Chromium + Firefox |
| Desktop | 1920×1080 (DPR 1), 2560×1440 (DPR 1 and 2), 3440×1440 (DPR 1), 3840×2160 (DPR 1 and 2) | — | Chromium |

### 6.2 Modes — every device above, each of these
- `prefers-reduced-motion: reduce`
- `prefers-color-scheme: dark` (the site must **not** change — this catches accidental dark-mode CSS)
- `forced-colors: active` (Windows High Contrast — hairlines must survive as borders)
- Browser zoom 125%, 150%, 200% at 1280 and 1536; **400% at 1280** (equivalent to 320px reflow — WCAG 1.4.10)
- Font size preference 20px (user default font size raised) at 393 and 1280
- Mobile nav open, at every phone
- Throttled "Slow 4G" for LCP measurement at 393 WebKit and 412 Chromium

### 6.3 Automated checks per shot (in `matrix.json`, failures fail the run)
- Horizontal overflow: `document.documentElement.scrollWidth > window.innerWidth` → FAIL
- Any text node's bounding box intersects the sticky nav's box while the page is scrolled to top → FAIL
- Any element with `overflow: hidden` clipping text (compare `scrollHeight` vs `clientHeight` on text containers) → FAIL
- Tap targets: any `a, button, summary, [role=button]` smaller than 44×44 CSS px on touch devices, or with < 8px to another target → FAIL
- Headline line count: any `h1, h2` over 3 lines (compute from `getClientRects`) → WARN; hero `h1` over 2 lines at ≥768 → FAIL
- Single-word last line on any `h1, h2, h3` → WARN
- Text measure: any `p` wider than 80ch → FAIL
- Font size floor: any rendered text under 13px → FAIL; under 15px on phones for body → WARN
- Images/SVG: any `svg, img` wider than its container → FAIL
- Safe area: at iPhone descriptors, any fixed/sticky element inside `env(safe-area-inset-bottom)` → FAIL
- Focus: tab through the page; any focusable element whose focus ring is not visible in the screenshot region → FAIL
- Console: any `console.error` → FAIL
- LCP/CLS at throttled mobile: LCP > 1.5s → WARN, > 2.5s → FAIL; CLS > 0 → FAIL
- Dark-scheme diff: the dark-scheme screenshot must be pixel-identical to the light one → FAIL if not

### 6.4 Coverage
Every route × every device × baseline mode = the full run (about 40 devices/orientations × 20 routes). The section slice = the routes a section owns × all devices. Integration rounds run the full matrix; section rounds run the slice. The runner parallelizes across Playwright workers and finishes the full run in under 20 minutes on a laptop; it writes a contact-sheet PNG per route (all devices tiled with labels) so the Conductor can look at one image per route instead of forty.

### 6.5 The Conductor looks
Scripts catch geometry. They do not catch "this looks like a business card taped to a wall at 3440" or "the footer is fine but nobody designed it." After every run the Conductor opens the contact sheets — every route — and writes what it sees in the re-prompts. That is the point of the whole document: an agent that **looks**, at everything, every round.

---

## 7. Cross-cutting responsive rules — every section obeys these

1. **Fluid type.** Every type token in `globals.css` becomes a `clamp()` with a floor at 320, a preferred `vw`-based value, and a ceiling. Display: `clamp(44px, 6.5vw, 128px)`. h1: `clamp(36px, 5vw, 96px)`. h2: `clamp(28px, 3.6vw, 56px)`. h3: `clamp(20px, 2vw, 28px)`. Body stays 17px (15px floor at 320 for `lead` only). Line-height tightens as size grows (`calc()` on the same clamp). No section sets its own font sizes — tokens only.
2. **`dvh`, never `vh`.** Hero and full-height overlays use `100dvh` with a `100vh` fallback in a `@supports`. Safari's address bar is the reason.
3. **Safe areas.** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; every fixed/sticky element pads by `env(safe-area-inset-*)`.
4. **Container queries** for section-level layout (`@container` on `Section`), media queries only for global chrome. A section decides its layout from its own width, so it behaves the same inside a narrow column at 1920 as on a 768 tablet.
5. **Hover is optional.** `@media (hover: hover) and (pointer: fine)` gates every hover effect; touch gets `:active` and `:focus-visible`. Nothing is discoverable only by hover.
6. **Ultrawide.** Text container holds at 1240; above 1920 the container may grow to 1440 and type ceilings rise (rule 1); hero visuals and `stone` bands bleed full-width; nothing is centered to "fill" — the left-aligned grid simply has more paper to its right, which is correct. At 3840 DPR 1, the site must not look tiny: verify the 4K contact sheet by eye.
7. **Tablets are not big phones.** 768–1024 gets its own compositions (two-column where phone is one and desktop is three). Landscape tablet at 1024–1366 uses the desktop grid with 32px gutters.
8. **Landscape phones.** 852×393 and 932×430: the nav shrinks to 48px, the hero headline caps at 44px, and the hero height is `100dvh` with no minimum — a landscape phone is a letterbox and the hero must fit inside it.
9. **Long words break.** `overflow-wrap: anywhere` on prose containers; `hyphens: auto` with `lang="en"` on `body`; email addresses use `word-break: break-all` inside their link.
10. **Tables stack.** No `overflow-x: auto` on a `<table>` ever. Under 768, rows become term-over-value pairs via `display: grid` on `tr` with the header cell repeated as a `caption`-styled label.
11. **Touch targets** ≥ 44×44 with ≥ 8px gaps; list rows are the target, not the text inside them.
12. **Zoom survives.** At 400% zoom on 1280 (= 320 CSS px), every page reflows with no horizontal scroll and no content loss. This is WCAG 1.4.10 and it is the same test as the iPhone SE floor — pass one, pass both.
13. **Images and SVG** always `max-width: 100%; height: auto` and scale with their container; the curve and the surface use `preserveAspectRatio` deliberately and are tested at 320 and 3440.
14. **No layout by JavaScript.** Nothing measures the window to pick a layout. CSS decides; JS only hydrates the clock and the menu.

---

## 8. Motion and visual system — additions to Appendix A §A.6

### 8.1 The single source
`src/lib/motion.ts` exports durations (150, 500, 900), the easing, stagger (70), and a `reduced()` helper. Every component imports from it. `scripts/qa/killist.sh` gains: `grep -rn "transition:.*ms\|animation:.*ms\|duration-" src/ --include=*.tsx` must return only lines that reference `motion.ts` tokens.

### 8.2 What moves
- Hero load sequence (once).
- Data components draw in (once, on first visibility).
- First-reveal stagger on hairline lists (once per page load, 500ms, not on scroll-back).
- Hover/focus transitions (150ms).
- Menu open/close (200ms fade).
That is the complete list. No parallax, no sticky-scroll storytelling, no cursor effects, no marquee, no counters, no scroll-jacking. Scroll is the user's.

### 8.3 What "choreographed enough to screen-record" means
Consistency. The same stagger, the same easing, the same hairline behavior, page after page. A screen recording of this site is watchable because nothing surprises the eye, not because things fly in.

### 8.4 OG and share — see §5.10
The OG regression is fixed as part of `sec-motion`'s first commit; nothing else in that section proceeds until every route has a verified OG image, because a site with no share preview is not instagrammable regardless of what the hero looks like.

---

## 9. QA gates — the run is not done until all pass, twice

- Full matrix (§6) clean: zero FAIL in `matrix.json` across every route × device × mode; WARNs listed in the report with a reason each.
- Contact sheets reviewed by the Conductor for every route with a one-line verdict each in `docs/v4/REVIEW.md`.
- `thumb-critic` ≥ 4 on every phone screenshot of every route; `critic-brand` ≥ 4.5 on the hero at 393 and 1920; `critic-craft` ≥ 4.5 on the footer, the four stages at 1920, and the article at 393.
- All previous gates: `killist.sh`, `punctuation.sh`, `regime.ts` (506(b) list on every route **and on every share card**), `links.ts`, `nulls.ts`, `print.ts`, `asof.ts`, `sources.ts` (every `data-source` is in the whitelist), `git grep 21st_sk_` empty.
- Lighthouse mobile ≥ 95 ×4 on every route; LCP < 1.5s at 393 WebKit throttled; CLS 0 everywhere.
- Canonical, `og:url`, and sitemap all on the primary domain; the secondary domain 308s; `curl -I` proves it.
- Every OG image renders; the share kit renders and `securities-counsel` has read it.
- `BOARD.md` shows ten sections DONE, or DONE plus documented OPEN items with all attempts listed.

---

## 10. Report — `docs/v4/REPORT.md`

1. Preview URL (and production, if Nate merges).
2. The board: ten sections, rounds each took, what the hardest failure in each was.
3. Before/after contact sheets for home at all devices — the single most persuasive artifact this run produces.
4. The three best phone screenshots per `thumb-critic`, and the five share-kit images, inline.
5. Data components: which shipped, their sources, their refresh cadence.
6. MotionSites: which three prompts were opened, what was kept from each, what was stripped.
7. Skills installed, with what each was actually good for.
8. Regressions from §0.2: each one, fixed or not, with the commit.
9. Deviations from Appendix A, with reasons.
10. Open items for Nate: domain decision if not made, FRED key if wanted, real photography if ever, the paid MotionSites plan if the free three weren't enough, counsel review of the share kit.

---

## Appendix — the Conductor and the Ten as agent files

Write each to `.claude/agents/<name>.md`. The Conductor is the main session and needs no file; its instructions are §4. Section agents share a common preamble; write it once as `.claude/agents/_section-preamble.md` and have each agent file begin with "Read `_section-preamble.md` first."

```markdown
<!-- .claude/agents/_section-preamble.md — not an agent; included by reference -->
You own exactly one section of girlscantrade2.com. Your ownership is listed in docs/EVERY-SCREEN.md §5 under your name; you edit nothing outside it and you ask the Conductor for anything you need from elsewhere.
Before touching anything: read docs/ORCHESTRATION.md Appendix A (tokens — absolute), docs/EVERY-SCREEN.md §1, §2, §6, §7, and your own §5 block. Run the §3.2 skill queries and note the lines that apply.
You will be re-prompted by the Conductor with specific failing screenshots and an exact fix list. Fix exactly what is listed. If you disagree with a fix, say so in one sentence and do it anyway unless it would violate Appendix A, in which case do not do it and say why.
Every commit on your worktree branch: build passes, scripts/qa/killist.sh is empty, and you have looked at your own section at 320, 393 (WebKit), 768, 1280, 1920 before returning. Return: branch name, before/after screenshots at the viewports you were told about, one sentence per change.
Composition rules you never break: left-aligned; tokens only; clamp() type from globals.css; dvh not vh; hover gated by (hover: hover); tap targets ≥ 44px; no numerals on things that are not sequences; no icons; no shadows; no gradients; no charts of fund data; no text under the nav.
```

```markdown
<!-- .claude/agents/sec-chrome.md -->
---
name: sec-chrome
description: Owns nav, mobile menu, footer, skip link, and the session clock across every route. Use for any header/footer/menu work.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
mcpServers: 21st, motionsites
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first. Your block is docs/EVERY-SCREEN.md §5.1. You own src/components/chrome/**, src/components/viz/SessionClock.tsx placement (sec-motion builds it; you place it), and src/app/layout.tsx only for the nav/footer slots.
You may spend MotionSites prompt 2 (footer). Translate per §3.3; log in docs/v4/MOTIONSITES.md.
```

```markdown
<!-- .claude/agents/sec-hero.md -->
---
name: sec-hero
description: Owns the home hero and its Treasury-curve visual placement. Use for hero composition at every viewport.
model: opus
tools: Read, Edit, Write, Bash, Glob, Grep
mcpServers: motionsites
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first. Your block is §5.2. You own src/components/sections/hero/**. The curve component itself is sec-motion's (src/components/viz/YieldCurve.tsx); you consume it and request changes through the Conductor.
You may spend MotionSites prompt 1 (hero). Structure and choreography only; every color, glow, gradient, and 3D idea is discarded. Log in docs/v4/MOTIONSITES.md with before/after.
Your two deliverables are named: THE POSTER (393×852 WebKit) and THE FRAME (1920×1080). Screenshot both every round and attach them.
```

```markdown
<!-- .claude/agents/sec-framework.md -->
---
name: sec-framework
description: Owns the risk-framework statement, the facts row, and the single statement band on home. Use for that band of the home page.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 80
---
Read .claude/agents/_section-preamble.md first. Your block is §5.3. You own src/components/sections/framework/** and src/components/sections/statement/**. First commit removes the duplicate statement band; the Conductor tells you which instance to keep.
```

```markdown
<!-- .claude/agents/sec-strategies.md -->
---
name: sec-strategies
description: Owns the six-strategies list on home, the /strategies page, and its left rail. Use for strategy rows and the rail.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
mcpServers: 21st, motionsites
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 100
---
Read .claude/agents/_section-preamble.md first. Your block is §5.4. You own src/components/sections/strategies/** and src/app/strategies/**. Numerals come off in your first commit. You may spend MotionSites prompt 3 (a features/list section) for entrance choreography only. You may source a scroll-snap strip and a sticky rail from 21st; strip them to tokens.
```

```markdown
<!-- .claude/agents/sec-approach.md -->
---
name: sec-approach
description: Owns the four-stage "how an idea earns capital" narrative, the veto, the tail-overlay band on home, and /governance. Use for the process section.
model: opus
tools: Read, Edit, Write, Bash, Glob, Grep
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first. Your block is §5.5. You own src/components/sections/approach/** and src/app/governance/**. Stage numerals are legitimate here and stay. Your deliverables are named: THE STORY (393, vertical, one thumb-scroll per stage) and THE STRIP (1920, four columns). Attach both every round.
```

```markdown
<!-- .claude/agents/sec-insights.md -->
---
name: sec-insights
description: Owns the notes list on home, /insights, and the article template with marginalia and footnotes. Use for anything an article renders.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 100
---
Read .claude/agents/_section-preamble.md first. Your block is §5.6. You own src/components/sections/insights/**, src/app/insights/**, src/components/Prose.tsx, and the <Note> and <Footnote> MDX components. The pull-quote object you build is the same object as the statement band — coordinate its tokens with sec-framework through the Conductor so the site has one way to emphasize a sentence.
```

```markdown
<!-- .claude/agents/sec-allocators.md -->
---
name: sec-allocators
description: Owns the eight-pages grid on home and /partnership, /diligence, /questions, /access, /letters. Use for allocator-facing pages.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
mcpServers: 21st
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first. Your block is §5.7. You own src/components/sections/allocators/**, src/app/partnership/**, src/app/diligence/**, src/app/questions/**, src/app/access/**, src/app/letters/**, and the terms/definition-list and disclosure-row components. docs/ALLOCATOR.md §5 and §7 govern content and objects; you change layout and responsiveness, never the words. The 506(b) list runs on every page you touch.
```

```markdown
<!-- .claude/agents/sec-firm.md -->
---
name: sec-firm
description: Owns /firm, /team, and /contact. Use for those pages' layout at every width.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 80
---
Read .claude/agents/_section-preamble.md first. Your block is §5.8. You own src/app/firm/**, src/app/team/**, src/app/contact/**, and src/components/sections/contact/**. Words are not yours; layout is. On /contact, the investors address is one thumb away on every phone.
```

```markdown
<!-- .claude/agents/sec-legal.md -->
---
name: sec-legal
description: Owns /legal, /disclosures, /tearsheet, and the 404 page. Use for legal pages, the print object, and not-found.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
isolation: worktree
maxTurns: 80
---
Read .claude/agents/_section-preamble.md first. Your block is §5.9. You own src/app/legal/**, src/app/disclosures/**, src/app/tearsheet/**, src/styles/print.css, and src/app/not-found.tsx. scripts/qa/print.ts must pass before you return. Compose the 404 as a phone poster.
```

```markdown
<!-- .claude/agents/sec-motion.md -->
---
name: sec-motion
description: Owns the motion language, the data-art components (yield curve, session clock, ECB grid), OG images, and the share kit. Use for anything that moves, anything that draws data, and anything that gets shared.
model: opus
tools: Read, Edit, Write, Bash, Glob, Grep, WebFetch, WebSearch
isolation: worktree
skills: ui-ux-pro-max
maxTurns: 160
---
Read .claude/agents/_section-preamble.md first. Your block is §5.10, and §2 and §8 are yours to implement. You own src/lib/motion.ts, src/components/viz/**, src/app/**/opengraph-image.tsx, scripts/share-kit.ts, scripts/qa/sources.ts, and public/share/**.
Order of work: (1) OG images for every route — nothing else until docs/v4/og/ shows all of them; (2) motion.ts and the killist rule that enforces it; (3) the Treasury yield curve with ISR and its verified source; (4) the session clock; (5) the ECB grid; (6) the share kit, then hand it to securities-counsel through the Conductor.
Every data component prints its source and as-of date as part of its design. If a source cannot be verified or its terms don't permit display, the component does not ship — say so.
```

```markdown
<!-- .claude/agents/viewport-runner.md -->
---
name: viewport-runner
description: Builds and runs the viewport matrix (scripts/qa/matrix.ts) across Chromium, WebKit, and Firefox, and produces contact sheets. Use at the end of every section round (slice) and every integration round (full). No opinions.
model: haiku
tools: Bash, Read, Write, Glob, Grep
maxTurns: 60
---
You own scripts/qa/matrix.ts, scripts/qa/contact-sheet.ts, and docs/v4/shots/**. Implement docs/EVERY-SCREEN.md §6 exactly: the device table, the modes, the per-shot checks, matrix.json, and one labeled contact-sheet PNG per route. Install Playwright's chromium, webkit, and firefox on first run. Parallelize with workers. When asked for a slice, run only the routes given. Return: the matrix.json summary (FAIL/WARN counts per route), paths to contact sheets, and nothing else.
```
