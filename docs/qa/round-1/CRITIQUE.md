# Round 1 — Critic pass

Judged from `docs/qa/round-1/screens/**`, `axe.json`, `checklist.md`, `summary.json` and the spec
(Appendix A / A.7 / A.8, Appendix C). No source was read. Colour and size claims below are pixel
measurements taken off the PNGs, not inferences.

Two settled items are not findings and are not re-raised: the fund name renders as **Girlscantrade2**
(owner-confirmed, correct), and article/`/disclosures` body measure is **34em** (a logged, intentional
departure from A.8's literal 680px, taken because 680px at 18px is 38em / ~86 characters and breaks
A.4 and §5.4).

Machine gates all pass: `killist.txt` empty, axe 0 violations across 7 pages, checklist 53/53,
0 console errors, Lighthouse 98/100/96/100 home-mobile, 96/100/96/100 strategies-mobile,
100/100/96/100 home-desktop.

Captures are native resolution this round. The round-0 QA note about downscaled `home-*.png` files
is resolved.

---

## 1. Round 0 regressions and confirmations

| # | Round-0 finding | Verdict |
|---|---|---|
| 1 | home h2 was "The firm" | **CONFIRMED FIXED** |
| 2 | home firm paragraphs were rewritten | **CONFIRMED FIXED** |
| 3 | investors/press emails collided at 768 | **CONFIRMED FIXED** |
| 4 | article in-article h2s were body-size slate | **CONFIRMED FIXED** |
| 5 | /firm "Where we are" was a fragment | **CONFIRMED FIXED** |
| 6 | strategy Markets/Instruments right-aligned | **CONFIRMED FIXED** |
| 7 | facts row went 4-up at 768 | **CONFIRMED FIXED** |
| 8 | surface SVG hidden below 768 | **PARTIALLY FIXED — still absent on /firm at 390** |

**1. CONFIRMED FIXED.** Section 3's h2 reads **"A research house that trades."** at 390, 768, 1280 and
1600, set in Newsreader 300, measured 48px at 1280 (cap-to-descender span 47px), 34px at 390. It sits
cols 1–5 with the prose in 7–12 exactly as §A.8 home §3 specifies. The one h2 on the page that said
nothing now carries the page's argument.

**2. CONFIRMED FIXED.** Both paragraphs are the mandated copy, verbatim, at all four widths:
"Durable returns in liquid markets come from process, not prediction. We build our own data, write our
own models, and put every idea through adversarial review before it earns capital." / "The firm is
deliberately small. Each position has a named owner who defends it in front of the desk, and we size to
survive the tail rather than to flatter the mean." Followed by the **About the firm** link.

**3. CONFIRMED FIXED.** At 768 (`home-768-part2.png`) the black band's three columns stack vertically —
Investors / `investors@gc2.fund`, Press / `press@gc2.fund`, Office / Austin, Texas — each on its own row
with its own caption label. No collision, no touching underlines. The block now has three distinct
treatments across 390 (stacked), 768 (stacked) and 1280/1600 (three columns), which is a designed
response rather than one grid squeezed.

**4. CONFIRMED FIXED.** "Why the usual order fails" measures a 29px ascender-to-descender span (≈30px
Newsreader 400) and samples as pure `rgb(0,0,0)`. It is unambiguously larger and heavier than the 18px
body beneath it. The hierarchy is right side up; the article now reads as a structured note rather than
one undifferentiated column. This was the biggest single improvement in the round.

**5. CONFIRMED FIXED.** "Where we are" now runs three paragraphs — the one-room desk/research/risk
argument, the outside-a-financial-center trade-off, and "We hold no branch offices and run no external
sales desk." It is in the §A.10 voice, invents no address, and no longer drops the reader straight into
the footer.

**6. CONFIRMED FIXED.** Markets and Instruments values are left-aligned on a shared left edge (x=230 at
1280, x=145 at 390) with labels at the container edge. The leader-line price-list effect is gone and
nothing on the site is right-aligned except the prev/next link (see findings).

**7. CONFIRMED FIXED.** The facts row is 2×2 at 390 and at 768, 4-up at 1280 and 1600, with the hairline
above and below spanning the container at every width.

**8. PARTIALLY FIXED.** The home hero surface renders at 390 — `home-390-fold.png` shows isolines through
the upper right and lower right of the hero, and the darkest pixel in the header region is 228 (visible
grey), so the terrain is genuinely drawn, not a near-white ghost. But `/firm` at 390 has **zero** contour
pixels: an autocontrast pass over the header region of `firm-390-fold.png` returns text and nothing else.
§A.6 requires the surface "reused at 40% opacity top-right of the `/firm` header". Half the fix landed.

Carried-over round-0 **low** findings that were not on the fix list and are **still present**: the
duplicated footer "Austin, Texas"; the statement band running to ~cols 1–11; the ragged 2×2 facts cell
at 390; the "×" close glyph on the mobile nav; the right-aligned article prev/next; the contact email
size mismatch against the home black band; and the orphaned "Disclosures" footer link at 390.

---

## 2. Scores

Criteria are Appendix C 1–10. `—` = not assessable at that width.

### `/` — Home

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 4 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 4 | 5 | 5 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | 3 | — | — |
| 7 | Consistency | 4 | 4 | 4 | 4 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 4 | 4 | 4 | 4 |
| 10 | Kill list | 4 | 5 | 5 | 5 |

### `/firm`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 4 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 5 | 5 |
| 9 | Spec fidelity | 3 | 5 |
| 10 | Kill list | 5 | 5 |

### `/strategies`

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

### `/insights`

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

### `/disclosures`

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

---

## 3. Overall

| Page | Round 0 | Round 1 | Δ |
|---|---|---|---|
| `/` | 3.83 | **4.67** | +0.84 |
| `/firm` | 3.80 | **4.74** | +0.94 |
| `/strategies` | 4.10 | **4.79** | +0.69 |
| `/insights` | 4.70 | **4.90** | +0.20 |
| `/insights/[slug]` | 3.60 | **4.79** | +1.19 |
| `/contact` | 4.60 | **4.90** | +0.30 |
| `/disclosures` | 4.40 | **4.90** | +0.50 |
| **Round overall** | **4.15** | **4.81** | **+0.66** |

Exit condition (§5.2) **not met**, on two counts only:

- Overall ≥ 4.5 — **met** (4.81).
- `killist.txt` empty — **met**. axe zero — **met**. Lighthouse ≥95 ×4 on `/` and `/strategies` mobile —
  **met**.
- Every criterion ≥ 4 on every page — **not met**: two cells score 3 (`/` at 768, criterion 6;
  `/firm` at 390, criterion 9).
- High/medium finding count zero — **not met**: 0 high, 4 medium.

Round 2 is within reach. Every remaining medium is a single-token or single-breakpoint change.

**Criterion 8 is scored properly for the first time.** Round 0 could not judge focus because no capture
held a focused element. This round can, and it passes on the hard case: in `contact-focus-black.png` the
footer wordmark inside the black band carries a 2px ring measured at `#F3F4F1` — exactly `stone` — in a
box spanning y825–856, x63–116, i.e. roughly a 3px offset around the glyph. Contrast against `#000000`
is about 19:1. On paper, `home-focus-nav.png` and `contact-focus-nav.png` show the wordmark ringed in
`#0F4C3A` — exactly `ledger`. The active-route nav underline samples `#0F4C3A` too. `home-1280-reduced.png`
is pixel-identical to `home-1280-fold.png` in the hero: final state, static surface, reduced motion honored.
The one defect is the ring *colour* on the strategy row, below.

---

## 4. Findings

### High

None. The round has no high-severity findings.

### Medium

`[all pages] [all widths] [medium] Text links render in ink #1F2326, not the ledger accent. Sampled at the hero's "Investor inquiries" text link, home's "About the firm", the contact and disclosures email links — every one returns rgb(31,35,38). Ledger #0F4C3A survives only on the active nav underline and the nav focus ring, so the site's single accent is effectively absent from the body of every page. [§A.3 ledger role: "Links, focus ring, active nav underline"; §A.8 home §3 "then ledger link About the firm"; §A.2 "One accent for links and focus only"]`

`[home] [1280] [medium] The strategy row focus ring is ink, not ledger. In home-focus-black.png the focused "Statistical Relative Value" row is outlined in rgb(30,37,39) ≈ ink #1F2326, while the nav wordmark in home-focus-nav.png is outlined in #0F4C3A. Two focus treatments coexist on one page. Visibility is fine; the token is not. [§A.9 "focus-visible 2px ledger ring, 3px offset"; Appendix C-7]`

`[all pages] [768, 1280, 1600] [medium] The footer legal caption sets to ~125 characters per line — 13px type running the full 780px from the container edge to x=847 at 1280, and the full 715px at 768. It is the longest measure on the site by a wide margin and the hardest block to read. [§A.4 "Body measure ≤ 34em"; §5.4 "body measure over 75 characters"]`

`[home, firm] [768] [medium] 768 is still the desktop 5/7 grid narrowed rather than a designed breakpoint. On home's firm section and on every /firm section, the prose column measures ~345px — about 46 characters — beside a left column holding a two-line h2 over ~380px of dead space. The facts row and the black band were both given real 768 treatments this round; these two were not. [§5.4 "mobile layouts that are the desktop layout squashed rather than designed"; Appendix C-6]`

### Low

`[firm] [390] [low] The surface does not render in the /firm header at 390 — an autocontrast pass over the header region returns text and no contour pixels at all. The home hero was fixed; this instance was not. [§A.6 "Reused at 40% opacity top-right of the /firm header"; §4.3 "reads as calm terrain at 1440 and 390"]`

`[all pages] [all widths] [low] The footer still prints a second "Austin, Texas" bottom-right, duplicating the Office column above it on home and adding an element §A.8 home §8 does not list. Unchanged from round 0. [§A.8 home §8]`

`[home] [1280, 1600] [low] The statement band sentence occupies ~cols 1–11: its first line runs x=78 to x=1089, a 1011px span, where cols 1–9 of the 1240 container is 852px. It reads as a wide paragraph rather than a held statement. Unchanged from round 0. [§A.8 home §5 "One h2 sentence cols 1–9"]`

`[home] [390] [low] In the 2×2 facts grid "Liquid markets, global" wraps to three lines against its neighbour's two and "2019"'s one, leaving the four cells visibly ragged and the second row's baselines unaligned. Unchanged from round 0. [§A.8 home §2]`

`[home] [390] [low] The open mobile nav closes with an "×" glyph — a second glyph beyond the sanctioned hamburger. Unchanged from round 0. [§A.6 "Iconography: none. The only glyph is a two-line hamburger on mobile."]`

`[insights/capacity-is-a-research-problem] [390, 1280] [low] The prev/next link "The honest cost of convexity" is right-aligned under a wholly left-aligned article. It is now the only right-aligned element on the site, the strategy definition lists having been fixed. Unchanged from round 0. [§A.5 "Everything left-aligned."]`

`[insights/capacity-is-a-research-problem] [1280] [low] The two rules at the foot of the article are different lengths — the closing-caption rule stops at x=510, the prev/next rule at x=646 — stacked 130px apart under the same column, so they read as ad hoc rather than as a system. [Appendix C-7 "every value traces to a token; nothing ad hoc"]`

`[contact] [1280] [low] The contact emails render at ~22px while the identical three-column block in the home black band renders them at ~17px. Unchanged from round 0. [Appendix C-7]`

`[firm, insights, contact, disclosures, insights/[slug]] [390] [low] The footer nav wraps with "Disclosures" orphaned on its own row below the other four links. Unchanged from round 0. [Appendix C-6]`

`[home, strategies] [1280, 1600] [low] Hairline-row content is inset ~8px from the container's left edge: at 1280 the h2 "Six strategies. One risk framework." and the row hairlines begin at x=68 while "Systematic Macro", the insight dates and the statement band all begin at x≈77. The vertical spine that every other element on the page shares is broken by a hair. [§A.5 "Borders 1px hairline, spanning the container"; Appendix C-7]`

### Not found — checked and clean

Nothing from §A.7 is present beyond the "×" noted above. Paper canvas throughout with exactly one
inverted black band per page. No ticker. No `$0M`/`0.0%`/`0` placeholder — the facts row carries four real
values and no number anywhere on the site is invented. No italic, coloured or bold single-word accent in
any headline. No `01`–`06` markers. No `→`. No uppercase tracked eyebrow; the facts labels and article meta
are sentence-case slate captions and the article meta separates "Feb 20, 2026" from "Process" with space,
not a middle dot. No decorative quotation glyph on the statement band. No fake phone or street address —
`address` and `phone` are null and the elements simply do not render. No anchor-scroll nav; home's strategy
rows link to `/strategies#slug` and the checklist confirms every anchor exists. No monospace. No gradient,
glass, shadow, pill, icon library or stock image. Radii read as 2px on the black button. "Tail Overlay" is
described as long convexity, per §A.7 item 13. The sticky nav is borderless at scroll-top and gains its 1px
hairline once scrolled, which is the only depth cue on the site and is exactly what §A.5 asks for. Copy
carries no marketing adjective, no exclamation mark and no first-person hype on any page. The hero could not
be mistaken for a SaaS hero: 96px Newsreader 300 over deterministic isolines, with a black button and a
text link and nothing else.

---

## 5. The single change that would most improve this round

Give the site its accent back. Every link on every page — the hero's "Investor inquiries", home's "About
the firm", "All notes", the contact and disclosures email addresses, the article's prev/next — samples as
`ink #1F2326`, and the strategy row's focus ring samples as ink too. `ledger #0F4C3A` survives in exactly
two places: the active nav underline and the nav wordmark's focus ring. Appendix A spends its entire colour
budget on one accent and then says what it is for — "Links, focus ring, active nav underline" — and §A.2
frames the whole palette as "95% achromatic. One accent for links and focus only." A site that is 100%
achromatic has not out-restrained the spec; it has quietly deleted the one signal the spec reserved for
telling a reader what is clickable, and it now leans on a 1px underline alone to do that work. The fix is
one token in one place and it lands everywhere at once, including the row focus ring, which is the same
bug wearing a different hat. Everything else left in this round is a hairline of polish — an 8px inset, a
duplicated city, a caption measure, a surface that forgot to render on one page at one width — but the
accent is the difference between a monochrome document and a designed system that chose monochrome and
then spent its one exception deliberately.
