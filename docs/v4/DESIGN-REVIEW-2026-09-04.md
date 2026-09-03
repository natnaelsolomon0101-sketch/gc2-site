# Design audit — girlscantrade2.com — 2026-09-04 (gstack /design-review, quick scope)

**Design Score: A-** · **AI Slop Score: A** ("none of the ten patterns: no gradient-purple, no icon circles, no 3-column feature grid, no centered everything, real typefaces, one accent")

## First impression (1440, first paint)
The site communicates **restraint with a point of view**: paper ground, a serif display headline in ink with the second line in deep iris, a real Treasury curve drawing itself in. I notice the load choreography: the headline rises before the curve, then the tenors arrive. The first three things my eye goes to: "Evidence first. Then capital." → the curve → the black "Our approach" button. One word: **editorial.**

Page-area test: masthead (facts + session), hero, risk-framework band, statement, strategies deck + heading, ECB rates, approach strip, notes, eight pages, contact, footer. Every area names itself in under two seconds.

## Inferred design system (rendered)
- Fonts: DM Serif Display (display), Inter (UI/body), Roboto Mono (captions). `-apple-system` appears only on html/head defaults. 3 families — pass.
- Headings: H1 96 · H2 80 (home display sections) · H3 28 · captions 13. Two anomalies found and fixed below.
- Touch targets: none under 44px except the sr-only skip link.
- Perf: load 837ms, TTFB 51ms.

## Trunk test: PASS on /, /strategies, /questions (site ID, page name, sections, options, location all clear; no search by design).

## Findings
| # | Impact | Category | Finding | Status |
|---|---|---|---|---|
| 001 | High | Hierarchy/Typography | "Eight pages, eight questions." was 38px between 80px display H2s; the allocator section read as a footnote | **verified** — ccde85d, `t-display-sm`; now 80px like its siblings |
| 002 | Medium | Typography/semantics | Footer column labels "Site / For allocators / Legal" were h2 elements at 13px mono (three fake sections in every page's outline) | **verified** — 99a4b21, captions with role=heading level 2 |
| 003 | Polish | Spacing | ECB rates rows at 1440: pair label far left, rate/change far right, the row reads as two lists | deferred (a wide table by design; a leader or a 60% max-width would tighten it) |
| 004 | Polish | Motion | Full-page screenshots taken at t=0 catch the headline mid-reveal (opacity ramp 500ms) | deferred (reduced-motion renders static; crawlers see full text in HTML) |

## Cross-page consistency: nav, footer, hairlines, caption tier, statement object and button consistent across /, /strategies, /questions.

## Quick wins remaining
1. ECB row leader/measure (polish).
2. Insights index shows one note then the footer at 57% of the phone screen (content-bound: more notes fix it, not layout).

PR summary: "Design review found 4 issues, fixed 2. Design score A- (baseline) → A- (post-fix; two hierarchy fixes, no grade change at the letter level)."
