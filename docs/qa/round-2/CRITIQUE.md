# Round 2 — Critic pass

Judged from `docs/qa/round-2/screens/**`, `axe.json`, `checklist.md`, `summary.json` and the spec
(Appendix A, A.7, A.8, Appendix C). No source was read. Every colour and size claim below is a pixel
measurement taken off the PNGs, not an inference.

Three settled items are not findings and are not re-raised: the fund name renders as **Girlscantrade2**
(owner-confirmed); article and `/disclosures` measure is **34em** (logged departure from A.8's literal
680px); and mobile LCP is 2.3–2.9s against A.9's `<1.5s` (the LCP element is the surface SVG whose ~40
isolines A.6 mandates; CLS is 0 and the 5.2 Lighthouse gate passes).

Machine gates all pass: `killist.txt` empty, axe 0 violations across 7 pages, checklist 53/53, 0 console
errors, Lighthouse 96/100/96/100 home-mobile, 97/100/96/100 strategies-mobile, 100/100/96/100 home-desktop.

*Capture note.* `home-1280.png` and `home-390.png` were resampled on disk by this critic's own image
reader after the first pass; they were full-resolution when the round was produced. Every home
measurement below is taken from `home-1280-reduced.png` (1280×4381, pixel-identical to
`home-1280-fold.png` in the hero), `home-1600.png`, `home-768.png` and the `-fold`/`-part2` captures.
This is not a finding against the site.

---

## 1. Round 1 confirmations

| # | Round-1 finding | Verdict |
|---|---|---|
| 1 | Every link rendered `ink`; the site was 100% achromatic | **CONFIRMED FIXED** |
| 2 | Strategy row focus ring sampled as `ink`, not `ledger` | **UNVERIFIED — the capture that showed it is gone** |
| 3 | `/firm` header had zero contour pixels at 390 | **CONFIRMED FIXED** |

**1. CONFIRMED FIXED.** `ledger #0F4C3A` is now present at rest, everywhere it should be, and absent
everywhere it should not be. Sampled exact `rgb(15,76,58)`:

- hero **Investor inquiries**, text and its 1px underline — `home-1280-fold.png` y683–703 (201px), and at
  every width: 390 y658–678, 768 y630–650, 1600 y683–703.
- **About the firm** and **All notes** on home (`home-1280-reduced.png`, 478 ledger px total across the
  page), **the article prev/next** (`…capacity…-1280.png` y1955–1972), the **contact** emails
  (`contact-1280.png`, 621 px) and the **disclosures** email (169 px).
- the **active nav underline** on every inner page: `contact-focus-nav.png` x964–1022 y44–56 returns
  `(15,76,58)` and nothing else; same on `/firm` (32 px) and `/strategies` (71 px).
- the **nav wordmark focus ring** in `home-focus-nav.png` and `contact-focus-nav.png`.

Correctly *withheld* on black: the same three email links inside the black band render `stone`, not
`ledger` — which is right, since `#0F4C3A` on `#000000` is about 1.6:1. The site is now 95% achromatic
with one accent spent on links and focus, which is exactly what §A.2 and §A.3 ask for. This was the
round's headline fix and it landed cleanly.

**2. UNVERIFIED.** Both `*-focus-black.png` captures in this round show the **footer "Disclosures" link
inside the black band**, not a strategy row. The ring there measures `(243,244,241)` — exactly `stone`
— in a box x1127–1216 y655–705, roughly a 3px offset, ~19:1 against `#000000`. That is correct and it
confirms A.9's "stone ring on black". But in round 1 `home-focus-black.png` held the focused
"Statistical Relative Value" row, and that is the element the round-1 medium was written against. No
capture in round 2 contains a focused strategy row at any width. The fix may well have landed — the
`transition: none` diagnosis is plausible and the nav ring is unambiguously `ledger` — but it cannot be
confirmed from these pixels, and §5.2 requires the medium count to reach zero on evidence. Logged as a
medium below against the capture set, not against the site.

**3. CONFIRMED FIXED.** `firm-390-fold.png` now renders the surface: isolines are visible through the
upper right of the header, running behind and to the right of "A research house that trades." and the
standfirst, dissolving leftward and downward as §A.6 specifies. Round 1's autocontrast pass over the
same region returned text and nothing else. The 1280 instance (`firm-1280-fold.png`) is unchanged and
correct — top-right, 40%, clear of the h1. §A.6's "reused at 40% opacity top-right of the `/firm`
header" and §4.3's "reads as calm terrain at 1440 and 390" both hold now.

### The two round-1 3-cells

- **`/` at 768, criterion 6 (mobile is designed) — DOES NOT CLEAR 4. Still 3.** Nothing about the
  section that drove the 3 changed. In `home-768.png` the firm section's prose sits at x397..741 — a
  345px column, about 46 characters at 17px — in cols 7–12 of the desktop grid, beside a left column
  that holds a two-line h2 over roughly 373px of dead space beneath it. Measured again: h2 lines at
  y1265–1288 and y1297–1338; prose lines all begin at x=397 and none exceeds x=741. Identical to round
  1's measurement. The rest of the page's 768 treatments *are* designed and were credited last round —
  facts go 2×2, the black band takes a real 5/7 split (`home-768-part2.png`) distinct from both the 390
  stack and the 1280 three-column — but one of eight sections is still the desktop layout narrowed,
  which is the §5.4 hunt item verbatim.
- **`/firm` at 390, criterion 9 (spec fidelity) — CLEARS. Now 5.** The surface was the only §A.8/§A.6
  element missing at that width and it now renders. All four mandated sections are present at 390 in
  order — Origins, How we work, Governance, Where we are — each 2–3 paragraphs in the §A.10 voice, with
  Governance carrying the mandate/limits, independent-risk and permanent-overlay points the spec names.
  No bios, no people, no invented address.

---

## 2. Scores

Criteria are Appendix C 1–10. `—` = not assessable at that width. Where a width is not listed it was
examined and tracks the nearest scored width with no separate defect.

### `/` — Home

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 4 | 5 | 5 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | **3** | — | — |
| 7 | Consistency | 4 | 4 | 4 | 4 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 4 | 4 | 4 | 4 |
| 10 | Kill list | 4 | 5 | 5 | 5 |
| | **Mean** | **4.70** | **4.50** | **4.78** | **4.78** |

### `/firm`

| # | Criterion | 390 | 768 | 1280 |
|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 4 | 5 |
| 4 | Restraint | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | **3** | — |
| 7 | Consistency | 5 | 5 | 5 |
| 8 | Accessibility | 5 | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 | 5 |
| 10 | Kill list | 5 | 5 | 5 |
| | **Mean** | **5.00** | **4.70** | **5.00** |

### `/strategies`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 4 | 4 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 5 | 5 |
| 8 | Accessibility | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |
| | **Mean** | **4.90** | **4.89** |

### `/insights`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 5 | 4 |
| 8 | Accessibility | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |
| | **Mean** | **5.00** | **4.89** |

### `/insights/capacity-is-a-research-problem`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 4 | 4 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |
| | **Mean** | **4.80** | **4.78** |

### `/contact`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |
| | **Mean** | **4.90** | **4.89** |

### `/disclosures`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 5 | 5 |
| 8 | Accessibility | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |
| | **Mean** | **5.00** | **5.00** |

**`/disclosures` is finished.** Every §A.8 section is present in the specified order — Nature of this
website, No offer, Qualified investors, Forward-looking statements, No performance information,
Third-party content, Contact — set at a 568px / 33em measure (x68..635 at 1280), sectioned by hairlines
that stop at the measure rather than the container, in generic legal register, inventing no regulator,
number or jurisdiction, and deferring to the offering documents. Nothing on it is a finding.

---

## 3. Overall

| Page | Round 0 | Round 1 | Round 2 | Δ (R1→R2) |
|---|---|---|---|---|
| `/` | 3.83 | 4.67 | **4.69** | +0.02 |
| `/firm` | 3.80 | 4.74 | **4.90** | +0.16 |
| `/strategies` | 4.10 | 4.79 | **4.90** | +0.11 |
| `/insights` | 4.70 | 4.90 | **4.95** | +0.05 |
| `/insights/[slug]` | 3.60 | 4.79 | **4.79** | 0.00 |
| `/contact` | 4.60 | 4.90 | **4.90** | 0.00 |
| `/disclosures` | 4.40 | 4.90 | **5.00** | +0.10 |
| **Round overall** | **4.15** | **4.81** | **4.88** | **+0.07** |

Exit condition (§5.2):

- Overall ≥ 4.5 — **met** (4.88).
- `killist.txt` empty — **met**. axe zero — **met**. Lighthouse ≥95 ×4 on `/` and `/strategies` mobile —
  **met** (96/100/96/100 and 97/100/96/100).
- Every criterion ≥ 4 on every page — **not met**: two cells score 3, both criterion 6 at 768
  (`/` and `/firm`), and both for the same cause.
- High/medium finding count zero — **not met**: 0 high, 3 medium.

The delta is small and honestly earned. Round 2 fixed exactly two things — the accent and the `/firm`
surface at 390 — and both are confirmed. Everything else in round 1's low column survived untouched,
which is why `/`, the article and `/contact` barely move.

**Accessibility passes on the hard cases again.** `contact-focus-black.png` and `home-focus-black.png`
both show the footer "Disclosures" link ringed in `#F3F4F1` at ~19:1 against black. `home-focus-nav.png`
and `contact-focus-nav.png` show the wordmark ringed in `#0F4C3A` on paper. `home-1280-reduced.png` is
pixel-identical to `home-1280-fold.png` across all hero text (difference bbox begins at x574, the
surface region only; max channel delta 30, mean 0.55) — the hero renders in its final state and the
only thing that moves is the surface, which is exactly A.6's reduced-motion contract. The sticky nav is
borderless at scroll-top (rows y66–71 are pure `#FFFFFF` in `home-1280-fold.png`) and gains a 1px
`#E3E5E1` line once scrolled (`contact-focus-black.png` y71) — one depth cue, no shadow. The black
button has a hard edge: y710 is `(0,0,0)` and y711 is `(255,255,255)` with nothing between.

---

## 4. Findings

### High

None.

### Medium

`[home, firm] [768] [medium] The firm/prose sections at 768 are still the desktop 5/7 grid narrowed, not a designed breakpoint. On home's firm section and on every /firm section the prose column measures x397..741 — 345px, about 46 characters at 17px — beside a left column holding a two-line h2 above roughly 373px of dead space. Identical to the round-1 measurement; nothing changed. Every other section on home was given a real 768 treatment (facts 2×2, black band 5/7), which makes this one read as the unfinished cell rather than a house style. [§5.4 "Mobile layouts that are the desktop layout squashed rather than designed"; Appendix C-6]`

`[all pages] [768, 1280, 1600] [medium] The footer legal caption sets to about 131 characters per line: 13px type running x68..845 (778px) at 1280 and x27..744 (717px) at 768. It is the longest measure on the site by a wide margin and the only block that breaks the measure discipline every other page holds to. Unchanged from round 1. [§A.4 "Body measure ≤ 34em"; §5.4 "body measure over 75 characters"]`

`[home] [1280] [medium] The strategy row focus ring cannot be verified this round: both *-focus-black.png captures now target the footer "Disclosures" link inside the black band, and no capture at any width contains a focused strategy row. Round 1's medium was written against that element. The nav ring is unambiguously ledger and the black-band ring is unambiguously stone, so the fix is likely — but §5.2 needs the medium count to reach zero on evidence, and this round removed the evidence. Restore a capture with a strategy row focused at 1280. [§A.9 "focus-visible 2px ledger ring, 3px offset"; §5.2 "the critic's high and medium finding count is zero"]`

### Low

`[home] [390] [low] The mobile nav overlay's investors email renders slate rgb(105,111,118), not ledger. It is the only text link on paper that this round's accent fix missed, and it sits on the first screen a mobile visitor sees. The overlay's four nav links are correctly black Newsreader. NEW this round — it was invisible while every link was ink. [§A.3 ledger role "Links, focus ring, active nav underline"; §A.2 "One accent for links and focus only"]`

`[home] [1280, 1600] [low] The statement band sentence occupies about cols 1–11: its first line runs x70..1116, a 1046px span, where cols 1–9 of the 1144px content box is 852px. Marginally wider than round 1's 1011px. It reads as a wide paragraph rather than a held statement. [§A.8 home §5 "One h2 sentence cols 1–9"]`

`[home, strategies, insights] [1280, 1600] [low] Hairline-row content is inset about 8px from the container spine. At 1280 every row hairline spans x68..1211 and the h2s "Six strategies. One risk framework." and "Notes from the desk." begin at x70, while "Systematic Macro" begins at x77, "Volatility Arbitrage" at x76, and every note date and title at x77–78. The larger type sits further left than the smaller type, so this is a real inset and not glyph sidebearing. Unchanged since round 0. [§A.5 "Borders 1px hairline, spanning the container"; Appendix C-7]`

`[all pages] [all widths] [low] The footer prints a second "Austin, Texas" bottom-right, duplicating the Office column above it on home and adding an element §A.8 home §8 does not list. Unchanged since round 0. [§A.8 home §8]`

`[home] [390] [low] The open mobile nav closes with an "×" glyph — a second glyph beyond the sanctioned hamburger. Unchanged since round 0. [§A.6 "Iconography: none. The only glyph is a two-line hamburger on mobile."]`

`[home] [390] [low] In the 2×2 facts grid "Liquid markets, global" wraps to three lines against "Private partnership"'s two and "2019"'s one, leaving the four cells ragged and the second row's baselines unaligned. Unchanged since round 0. [§A.8 home §2]`

`[insights/capacity-is-a-research-problem] [390, 1280] [low] The prev/next link is right-aligned and unlabeled. At 1280 "The honest cost of convexity" runs x449..645, flush to the measure's right edge, under an article that is left-aligned throughout. It is the only right-aligned element on the site. With no "Previous"/"Next" label a bare right-aligned title functions as a forward-arrow affordance with the arrow removed. Unchanged since round 0. [§A.5 "Everything left-aligned."; §A.8 "plain-text prev/next"]`

`[insights/capacity-is-a-research-problem] [1280] [low] The two rules at the foot of the article are different lengths — the closing-caption rule spans x68..509 (442px) at y1813, the prev/next rule x68..645 (578px) at y1925 — stacked 112px apart under the same column, so they read as ad hoc rather than as a system. Unchanged from round 1. [Appendix C-7 "every value traces to a token; nothing ad hoc"]`

`[contact] [1280] [low] The contact emails render at about 22px (glyph bbox x68..266 y649..671, h=23) while the identical three-column block in the home black band renders them at about 17px (h=16). §A.8 asks for "the same three columns on paper". Unchanged since round 0. [§A.8 /contact; Appendix C-7]`

`[all pages] [390] [low] The footer nav wraps with "Disclosures" orphaned on its own row below the other four links. Unchanged since round 0. [Appendix C-6]`

### Not found — checked and clean

Nothing from §A.7 is present beyond the "×" noted above. Paper canvas throughout with exactly one
inverted black band per page. No ticker. No `$0M` / `0.0%` / `0` placeholder — the facts row carries four
real values and no number anywhere on the site is invented; `address` and `phone` are null and those
elements simply do not render. No italic, coloured or bold single-word accent in any headline — the
restored `ledger` appears only on links, the focus ring and the active nav underline, never inside a
headline and never as a fill. No `01`–`06` markers. No `→`. No uppercase tracked eyebrow; the facts
labels and article meta are sentence-case slate captions, and the article meta separates "Feb 20, 2026"
from "Process" with space, not a middle dot. No decorative quotation glyph on the statement band. No
anchor-scroll nav; home's strategy rows link to `/strategies#slug` and the checklist confirms every
anchor exists. No monospace. No gradient, glass, shadow, pill, icon library or stock image — the pixel
row directly beneath the primary button steps from `(0,0,0)` to `(255,255,255)` with no falloff. Radii
read as 2px. "Tail Overlay" is described as long convexity, per §A.7 item 13. Copy carries no marketing
adjective, no exclamation mark and no first-person hype on any page. No headline wraps past two lines at
1280 — the hero is two lines at every width, `/strategies` and `/insights` set their h1 in one line at
1280, and the article title takes two. No two sections share a density: the hero is air, the facts row
is a tight 126px band, the firm section is a 5/7 split, the strategies list is six hairline rows of
91–116px, the statement band is a 397px stone field with 120px of padding, the notes list is three
153px rows, and the black band closes. The hero could not be mistaken for a SaaS hero: 96px Newsreader
300 over deterministic isolines, a black button, one green text link, and nothing else.

---

## 5. The single change that would most improve this round

Design the 768 breakpoint for the prose sections. It is the only criterion still scoring 3, it is the
only thing standing between this round and §5.2's "every criterion ≥ 4 on every page," and it is now
conspicuous precisely because everything around it was fixed. At 768 the firm section on home and all
four sections on `/firm` still run the desktop 5/7 grid: a 345px prose column — 46 characters, the
narrowest measure on the site — pinned to the right half, with a two-line h2 in the left column and
about 373px of nothing beneath it. That is not restraint, it is a grid that was never asked what it
should do at this width, and §5.4 names it by name. The evidence that the builder knows how to answer
the question is on the same page: at 768 the facts row goes 2×2, and the black band takes a genuine 5/7
split with three stacked label/value pairs that is neither the 390 stack nor the 1280 three-column. Two
sections got a designed 768; the prose sections got a narrowed 1280. The fix is one media query — let
the h2 sit above the prose and let the prose take the full 720px container, which is 34em at 17px and
lands exactly on A.4's measure — and it closes both 3-cells at once, on two pages, and takes the round
to a clean sweep of 4s. Everything else left is a hairline: an 8px inset, a duplicated city, a caption
that runs long, a close glyph, one slate link in the mobile overlay. Fix 768 and restore the strategy-row
focus capture, and round 3 is a confirmation round.
