# GC2 v4 — Every Screen. Report

Run: 3–4 September 2026. Conductor: Claude (main session). Branch: `v4/every-screen` (cut from `redesign/origin-100k`, NOT main). Budget used: ~10 h of the 8–12 h envelope.

## 1. URLs
- Preview (light, final integration): https://gc2-site-orn07oc06-natnaelsolomon0101-sketchs-projects.vercel.app
- Production: https://girlscantrade2.com — promoted 4 Sep 2026 from 7d6e0ec (Vercel https://gc2-site-91h1t2h63-natnaelsolomon0101-sketchs-projects.vercel.app). Verified live: theme-color #f7f5f0, canonical https://girlscantrade2.com, /opengraph-image 200.

## 2. The two decisions that changed the brief
1. **The doc was written for a paper design the client had rejected** (`docs/BUILD100K.md`), and it cited four foundation docs that do not exist in the repo. Nate chose: run the doc's process on the dark build. `docs/v4/APPENDIX-A.md` translated every paper token to the dark system; `docs/v4/OWNERSHIP.md` mapped the Ten to the files that exist.
2. **Mid-run Nate asked for a light background.** Decision: LIGHT CANVAS EVERYWHERE, one theme, no toggle, no prefers-color-scheme switching. Foundation r3 built a semantic token layer with measured contrast (`DESIGN.md`); all ten sections then did a light pass; `grep` for deprecated dark tokens across `src/` is empty. The dark round-1 state was NOT promoted (branch `v4/release-r1` kept as a fallback).

## 3. The board (rounds per section, hardest failure)
| Section | Rounds | Hardest failure |
|---|---|---|
| foundation | 4 | invalid fluid line-height `calc(unitless − vw)` silently dropped — every heading on the site was at body leading 1.5 |
| chrome | 4 + light | anchors 20px tall inside 44px rows (the target must be the anchor); footer disclosure in 13px uppercase tracked mono |
| hero | 1 + light | headline wrapping to 4 lines on Android metrics; YieldCurve draw-in truncating above 1920 (dash vs pathLength); re-lighting the bloom for paper |
| framework | 1 + light | duplicate statement band; one emphasis object for the whole site (Statement) |
| strategies | 1 + light | six full-height tiles = 4 viewports on a phone → hairline rows; strip links 18px |
| approach | 0 + light | 393 section is 3.75 viewports — copy-bound, needs Nate's call |
| insights | 2 + light | footnote refs 17px; pull quote as a second emphasis object |
| allocators | 2 + light | open `<summary>` painted white on paper (1.09:1); audited-financials row with no auditor |
| firm | 2 + light | "Introductions are welcome." (counsel BLOCKING) |
| legal | 2 + light | `ch` is not 80 characters in Inter — measure in real characters |
| motion | 3 + light | share kit rendered in fallback Times; curve card read as fund performance (counsel BLOCKING) |

## 4. Matrix (viewport-runner, `scripts/qa/matrix.ts`, 37→38 devices × 19 routes × 3 browsers)
| Run | Build | Pass |
|---|---|---|
| baseline-full | base (dark, pre-v4) | 0 / 703 (every shot failed at least one check) |
| r1-b | round 1 merged (dark) | 539 / 703 |
| r1-c | + hero r1 + counsel fixes | 577 / 703 |
| light-final | all ten light passes | 700 / 722 |
| **final** | + critics' fixes (strip gutters, tearsheet mock deleted, short-phone hero, .btn floor, landscape h1 cap, disclosures on page/OG/ECB) | **722 / 722** |
WARNs accepted and listed: 14px `.t-small` and 13px eyebrows counted as "phone body under 15px" (they are captions, not body); single-word last lines on a few h2/h3 after `text-wrap: balance`.
Contact sheets: `docs/v4/shots/<round>/sheets/<route>.png`. Before/after for home: `baseline-full/sheets/home.png` vs `light-final/sheets/home.png`.

## 5. Data components (sec-motion)
| Component | Source | Terms | Refresh |
|---|---|---|---|
| YieldCurve (hero + OG + cards) | home.treasury.gov daily par yield curve XML | Fiscal Service: free, no restriction; attribution printed anyway | ISR 6 h |
| SessionClock (masthead, menu) | published cash-session hours (TSE/LSE/NYSE), client-side | none needed; holidays not modelled and the caption says so | live |
| ECBGrid (under strategies) | ecb.europa.eu eurofxref-hist-90d.xml | ECB: reproduce accurately, cite source — rates printed as the feed string | ISR |
`scripts/qa/sources.ts` whitelists `data-source` values and fails on anything else; `npm run sources`.

## 6. MotionSites
MCP not connected (needs Nate's OAuth). No prompts spent. Public gallery consulted once for footer structure; nothing borrowed. `docs/v4/MOTIONSITES.md`.

## 7. Skills
ui-ux-pro-max (queries logged per section), frontend-design (available), 21st MCP (registered; no components pulled — the structures were simple enough to write). No GitHub skills installed. `docs/v4/SKILLS.md`.

## 8. §0.2 regressions
| # | Item | Status | Commit |
|---|---|---|---|
| 1 | canonical / og:url on gc2.fund | fixed: metadataBase + `alternates.canonical './'`; `vercel.json` 308 from gc2.fund (cannot be proven until that domain has DNS) | e07a163, d4d6b42 |
| 2 | no OG image | fixed: 18 routes via `next/og`, vendored fonts, light canvas | 56f3543, 1b57291 |
| 3 | duplicate statement band | fixed: Feature instance kept, inline card deleted | b856e54 |
| 4 | numerals on non-sequences | fixed on hero facts, strategies, insights row, /questions, /contact, /legal, /governance topics; stage numerals kept | several |
| 5 | lowercase h2 | fixed in source | 4b1c47d |
| 6 | `--:--:--` clock | fixed: SessionClock renders nothing until hydrated | 26ce285 |
| 7 | theme-color | now the paper ground `#f7f5f0` | 834dc47 |
| 8 | dates | single source `site.foundedLabel`; no literals | verified |

## 9. Gates at light-final
build ✓ · killist (incl. motion-timing gate, 0 pins) ✓ · regime 506(b) ✓ (13 routes) · sources ✓ · print.ts ✓ (18 routes) · share kit 5/5, word-list clean, contrast-gated ✓ · matrix **722/722** ✓ · dark-scheme pixel-identical ✓ · securities-counsel second read: kit SHIPPABLE; site promotable once three disclosure items landed (they did, motion r4) ✓ · thumb-critic: interior 4/5, home faults all routed and fixed (`docs/v4/CRITICS.md`) ✓ · family-principal: 4 / 4 / 3, layout findings fixed, content findings for Nate ✓.

## 10. Deviations from Appendix A (as translated)
- Two primitive systems kept (home and inner); both fluid.
- Mono/caption tiers raised 11–12px → 13px (font floor).
- `.t-prose` phone variant 17/1.65 added.
- The hero's bloom/tile field kept (BUILD100K brief) and re-lit for paper at low alpha; deep-iris is the only accent used as text.
- Approach: the veto is stage 04, the tail overlay is the single band beneath (not two bands).
- Section-height criteria not met where copy-bound: approach at 393 = 3.75 viewports; strategies at 320 = 2.9; tearsheet prints 6–7 pages, not one. Each needs a copy decision, not a layout one.

## 11. Open items for Nate
1. ~~Copy (counsel, medium)~~ — APPLIED 4 Sep 2026 on Nate's instruction and promoted to production: "if the return arrives"; partnership "structures the firm runs" / "which one we would rather run" / "Why there is nothing to download"; questions "would you expect to do badly in?" / capacity opener; diligence "Direct to eligible investors"; founding caption on /firm and /diligence. Still unchanged (not on counsel's list): "has stayed small" on /firm and /questions.
2. **gc2.fund DNS** — attach the domain to the Vercel project (or point it) so the 308 in `vercel.json` takes effect; emails stay @gc2.fund (facts).
3. **MotionSites** — complete the OAuth if you want the three prompts spent on hero/footer/strategies choreography.
4. **FRED key** — not supplied; VIX / 2s10s skipped.
5. **Photography** — none; the site is typographic + data-art by design.
6. **Counsel** — a human securities lawyer must read the copy and the share kit before you treat any of this as compliance (the repo's own rule).
7. **Copy-bound heights** — shorten the four stage bodies if "≤3 viewports" matters; tearsheet cannot be one page with its current content.
8. **The firm's facts** (family-principal): `src/config/fund.ts` is null everywhere — no person, provider, registration, entity, reporting cadence or GP commitment. The site's own copy tells allocators to demand each of these. Fill `docs/INTAKE.md`; the components render them the moment they exist.
9. **IA**: the eight allocator pages are footer-only (nav.ts). Consider a "For allocators" item in the top bar.
10. **Memory note**: the Conductor's project memory could not be written this session (macOS blocked the Obsidian-vault path); everything is in `docs/v4/`.
