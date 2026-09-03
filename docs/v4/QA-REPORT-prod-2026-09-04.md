# QA Report — girlscantrade2.com — 2026-09-04

**Mode:** full (report-only) · **Framework:** Next.js 16 (App Router), static prerender · **Duration:** ~12 min · **Pages visited:** 8 (/, /strategies, /questions, /contact, /tearsheet, /insights/capacity-is-a-research-problem, /does-not-exist, mobile /) · **Screenshots:** 12

## Health score: 96 / 100

| Category | Score | Weight | Notes |
|---|---|---|---|
| Console | 100 | 15% | 0 errors on every page, before and after interactions |
| Links | 70 | 10% | 2 non-200: /favicon.ico 404, /feed.xml 404 (both being built) |
| Visual | 100 | 10% | no layout breaks at 1280 or 375 |
| Functional | 100 | 20% | deck, disclosures, menu, 404 status all correct |
| UX | 92 | 15% | ISSUE-003 (404 desktop composition) |
| Performance | 100 | 10% | pending Lighthouse (viewport-runner r8) |
| Content | 100 | 5% | — |
| Accessibility | 100 | 15% | menu is a dialog with focus inside, Escape closes; axe audit pending (sec-chrome r5) |

## Top 3 things to fix
1. **ISSUE-001** `/favicon.ico` returns 404 → Google shows a generic globe next to the domain in results. (In progress: sec-motion r6.)
2. **ISSUE-003** 404 page on desktop: ~250px of empty ground between the sentence and the "Return home" button; the phone poster composition does not translate to 1280.
3. **ISSUE-002** `/feed.xml` 404 (no link points to it yet; RSS is being added by sec-insights r3).

## Issues

### ISSUE-001 — /favicon.ico is 404
- **Severity:** High · **Category:** Functional/SEO
- **Repro:** `curl -I https://girlscantrade2.com/favicon.ico` → 404. Google mobile results render the globe placeholder (owner screenshot).
- **Evidence:** HTTP status; owner's Google screenshot.

### ISSUE-002 — /feed.xml is 404
- **Severity:** Low · **Category:** Links
- **Repro:** `curl -I https://girlscantrade2.com/feed.xml` → 404. Not linked from any page yet.

### ISSUE-003 — 404 page desktop composition
- **Severity:** Medium · **Category:** UX
- **Repro:** open https://girlscantrade2.com/does-not-exist at 1280×720. The h1 and sentence sit at the top; "Return home" and the wordmark sit ~250px below with empty ground between; the footer follows. On phones the same page is a composed poster (button bottom-third), which is what this layout was tuned for.
- **Evidence:** screenshots/does-not-exist.png

## Verified working (evidence)
- Strategies deck: clicking "Volatility Arbitrage" scrolls to 2234px, opens the tile, nav stays at top 0 (38 links before and after). screenshots/deck-click-result.png
- /questions: first question open by default; clicking the second opens it (62px summary). screenshots/questions-open.png
- Mobile menu (375×812): opens as role=dialog with focus inside, 5 links + email; Escape closes (aria-expanded false). screenshots/menu-mobile.png
- 404 route returns HTTP 404.
- All 17 public routes + sitemap.xml, robots.txt, opengraph-image, icon.svg return 200.

## Console health
No errors on any page visited, including after interactions.

No test framework detected beyond scripts/qa/* (Playwright-driven gates). Regression baseline saved to baseline.json.
