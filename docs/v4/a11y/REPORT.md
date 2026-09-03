# Accessibility audit — round 5 (sec-chrome, a11y-auditor role)

Ran `axe-core` (`@axe-core/playwright`, installed as a one-off dev dependency —
`npm install --no-save @axe-core/playwright`, not added to `package.json`) against
every route on the built site (`next build && next start`, port 3101), at:

- **1280×900 Chromium** (`1280`)
- **393×852 WebKit, iPhone 15 Pro descriptor** (`393`)
- **393×852 WebKit, mobile drawer open** (`393-menu`, phone routes only — every
  route carries the same nav/footer, so the drawer-open scenario is identical
  chrome content regardless of the page under it)

Raw results: one file per route, `docs/v4/a11y/axe-<route>.json`, keyed by
scenario (`1280` / `393` / `393-menu`), each holding the full axe violation
list (id, impact, description, every affected node's selector + failure
summary) plus pass/incomplete counts. 19 routes x up to 3 scenarios = 54 scans.

## Result: 1 unique violation, site-wide

| Rule | Impact | Route(s) | Scenario(s) | Owner |
|---|---|---|---|---|
| `color-contrast` | serious | `/` (home) | `1280`, `393`, `393-menu` (same issue, same nodes, in every scenario -- the page under the drawer doesn't change it) | **sec-strategies** |

**Selectors** (from `docs/v4/a11y/axe-home.json`):
```
#_R_kqnnb_-p0 > .stx-meta > div:nth-child(1) > .stx-muted
#_R_kqnnb_-p0 > .stx-meta > div:nth-child(2) > .stx-muted
```
**Detail:** foreground `#28263c` on background `#847dff` (`iris-gleam`, the
chromatic tile fill), 13px/normal-weight, measures 4.43:1 against a 4.5:1
requirement. `.stx-muted` / `.stx-meta` are defined in
`src/components/PinnedStrategies.tsx` (OWNERSHIP.md: sec-strategies -- the file
is marked "unshipped: delete" in OWNERSHIP.md but is in fact imported and
rendered by `Strategies.tsx` as of this merge, so it is live on `/`). Routed to
the Conductor for sec-strategies; not a file this row owns.

No other route -- including every sec-firm, sec-allocators, sec-approach,
sec-insights, sec-legal, sec-motion, and the 404 (sec-legal) route -- produced
any axe violation in any scenario. `docs/v4/a11y/axe-*.json` for the other 18
routes each show an empty `violations` array in every scenario.

## What axe's static rules do not test, checked manually (chrome only)

The brief named landmarks, `aria-expanded`/`aria-controls`, focus order and
trap, and link names specifically -- axe's `button-name`/`link-name`/
`aria-*`/`landmark-*` rules cover the static half of that (all passed, 0
violations), but a keyboard focus trap is a runtime behavior axe does not
drive a keyboard through. Verified directly at 393 (webkit, drawer open):

- **Landmarks:** one `<header>`, `<main>`, `<footer>`; five `<nav>` all with
  distinct `aria-label`s (`Primary`, `Menu`, `Site`, `For allocators`,
  `Legal`) -- no duplicate unlabeled landmarks.
- **Burger `aria-expanded`/`aria-controls`:** `false` -> `true` on open,
  `aria-controls="site-nav-drawer"` resolves to the actual drawer element
  (`role="dialog"`, `aria-modal="true"`) in both states; `aria-label` flips
  `"Open menu"` <-> `"Close menu"`.
- **Focus trap:** 12 consecutive `Tab` presses from the drawer's first link
  cycle exactly through the 6 focusable items (Firm, Strategies, Insights,
  Contact, Investor inquiries, investors@gc2.fund) twice, in DOM/visual
  order, never landing outside `#site-nav-drawer` while it is open.
- **Escape:** closes the drawer and returns focus to the hamburger
  (`aria-label="Open menu"`) -- not just "somewhere reasonable," the exact
  control that opened it.
- **Link/button names:** zero elements inside `.sn-header`, `#site-nav-drawer`,
  or `footer` with no text, no `aria-label`, and no `<title>` on an inner
  `<svg>`.

## Fixes made in files this row owns

**None needed.** `SiteNav.tsx`, `Footer.tsx`, and `Wordmark.tsx` produced zero
axe violations across all 19 routes x up to 3 scenarios each, and the manual
checks above (landmarks, `aria-expanded`/`aria-controls`, focus trap, Escape,
link names) all passed as built. The nav/menu/footer accessibility work from
rounds 0-4 (the `aria-current` underline, the drawer's focus trap and
Escape-returns-focus behavior, `aria-modal`/`role="dialog"` on the drawer,
`aria-label`s on every `<nav>`, the 44x44 tap-target fixes) is what this
audit is confirming, not introducing.

## Everything else, per owner, for the Conductor to route

| Owner | Violations found |
|---|---|
| sec-strategies | 1 (`color-contrast`, `/`, detailed above) |
| sec-hero | 0 |
| sec-framework | 0 |
| sec-approach | 0 |
| sec-insights | 0 |
| sec-allocators | 0 |
| sec-firm | 0 |
| sec-legal | 0 |
| sec-motion | 0 |
| foundation | 0 |
| **sec-chrome (this row)** | **0** |

## Gates

`npm run build`: green. `bash scripts/qa/killist.sh`: empty (no source changes
this round -- the audit found nothing in this row's files to fix).
