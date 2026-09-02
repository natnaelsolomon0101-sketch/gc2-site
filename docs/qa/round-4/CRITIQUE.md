# Round 4 — Critic pass (confirming round)

Judged from `docs/qa/round-4/screens/**`, `axe.json`, `checklist.md`, `console-errors.json`,
`lighthouse*.json` and the spec (Appendix A, §5.4, Appendix C). No source was read. Every colour,
size and position claim below is a pixel measurement taken off the PNGs.

Five settled items are not findings and are not re-raised: the name renders **Girlscantrade2**
(owner-confirmed); article and `/disclosures` measure is **34em** at their respective body sizes
(612px at 18px, 578px at 17px — both confirmed this round, both a logged departure from A.8's literal
680px); **LCP 2.3–2.9s** against A.9's `<1.5s` (logged open; CLS 0, Lighthouse performance 96–100);
the **mobile close control** is the sanctioned two-line hamburger element at 1.5px stroke in its open
state (logged deviation); and the **statement band** is a `<p>` carrying the h2 type token.

Machine gates all pass: `killist.txt` empty, axe 0 violations across 7 pages, checklist 53/53, 0
console errors, Lighthouse 98/100/96/100 home-mobile, 96/100/96/100 strategies-mobile,
100/100/96/100 home-desktop.

*Capture note.* `disclosures-1280.png` was resampled on disk by this critic's own image reader
(1073×1800, mtime 10:11 against the round's 10:04); it was 1280×2146 when the round was produced.
The `/disclosures` measurement below is taken from `disclosures-1280-fold.png` and
`disclosures-1600.png`, both native. Every other capture in the set is native at its stated width and
was verified as such. This is not a finding against the site.

---

## 1. Round 2 confirmations

| # | Round-2 finding | Verdict |
|---|---|---|
| 1 | 768 breakpoint: prose pinned to the right half on home and `/firm` | **CONFIRMED FIXED** |
| 2 | Strategy-row focus ring unverifiable | **CONFIRMED FIXED** |
| 3 | 8px hairline-row inset | **CONFIRMED FIXED** |
| 4 | Duplicated "Austin, Texas" in the footer | **CONFIRMED FIXED** |
| 5 | Article's two foot rules at different lengths | **CONFIRMED FIXED** |
| 6 | Contact emails at two sizes | **CONFIRMED FIXED** |
| 7 | Article prev/next right-aligned | **CONFIRMED FIXED** |
| 8 | Footer nav orphaning "Disclosures" at 390 | **CONFIRMED FIXED** |
| 9 | Mobile overlay email as bare slate text | **CONFIRMED FIXED** |
| — | *(not in the actioned list)* Statement band ran cols 1–11 | **CONFIRMED FIXED** |
| — | *(not in the actioned list)* Footer legal caption measure | **STILL PRESENT** — re-graded low, see §4 |
| — | *(not in the actioned list)* 390 facts grid ragged | **STILL PRESENT** — low |

### 1. The 768 breakpoint — CONFIRMED FIXED. Criterion 6 at 768 now clears 4; it scores **5**.

The h2 now sits **above** the prose and the prose takes the measure, on both pages. Re-measured
against round 2's numbers:

- **home, `home-768.png`.** The firm section's h2 "A research house that trades." is a single line at
  y1264–1289, x24..409. Both prose paragraphs begin at x=24/25 and the widest line reaches x=600 —
  a **577px column**, which is 34em at 17px and lands exactly on A.4's measure. Round 2 measured the
  same block at x397..741 (345px, ~46 characters) with ~373px of dead space under a two-line h2.
  That column and that dead space are gone. The "About the firm" ledger link follows at x25, y1556.
- **`/firm`, `firm-768.png`.** Same treatment on all four sections. "Origins" h2 at y956–981 x25..212
  over prose x24..600; "How we work" and "Governance" identical; the widest prose line on the page is
  577px. Section hairlines span the full 720px container between sections, so the page reads as
  stacked bands, not as a narrowed 5/7.

The rest of the 768 page still holds the treatments round 2 credited — facts 2×2, strategy rows
stacked name / one-liner / markets, the black band's three columns stacked vertically, the footer nav
in one row of five. Eight of eight sections now have a designed 768. Nothing at this width is the
1280 layout narrowed. **Criterion 6 at 768 clears 4 on both home and `/firm`.**

### 2. Strategy-row focus capture — CONFIRMED FIXED, exactly to A.9.

`home-focus-row.png` (1280×900, native) contains a focused strategy row. The ring is
**exact `rgb(15,76,58)` — `ledger #0F4C3A`** — 5040 pixels of it and no other green on the capture.
Geometry: horizontal strokes at y=387–388 and y=510–511, verticals at x=63–64 and x=1215–1216 —
a **2px** stroke on a box of x63..1216 / y387..511. The row's own hairlines sit at y=391 and y=506
spanning x68..1211. Ring outer to element edge is 5px on all four sides: 2px stroke + **3px offset**.
That is A.9's "focus-visible 2px `ledger` ring, 3px offset" measured to the pixel. The round-1 medium
and the round-2 evidence gap are both closed.

### 3. The 8px hairline-row inset — CONFIRMED FIXED.

At 1280 every hairline still spans x68..1211 (1144px, the container content box: 1240 max minus 48px
gutters, confirmed identical at 1600 where it sits x228..1371). Content now begins on the same spine:

- home strategies — "Systematic Macro" x69, "Volatility Arbitrage" x68, "Tail Overlay" x69; h2 x70.
- home notes — every date x68/x69; "Notes from the desk." x70.
- `/insights` — dates x68, x69, x69 against hairlines at x68 (y385, 538, 691, 844).
- `/strategies` — block hairlines x68..1211 with h2s on the spine.

The 1–2px residue is Newsreader sidebearing, not an inset. Round 2's x77/x78 measurements do not
reproduce anywhere.

### 4. Duplicated "Austin, Texas" — CONFIRMED FIXED.

The home black band's footer now contains, in order: `hairline-on-black` rule, wordmark **GC2**,
the five links, the legal caption, the © line. Nothing else. The second "Austin, Texas" bottom-right
is gone at 390, 768, 1280 and 1600, and on every inner page.

### 5. Article foot rules — CONFIRMED FIXED.

Both rules are now the same length and both stop at the measure:
1280 — y1813 **x68..679 (612px)** and y1925 **x68..679 (612px)**.
1600 — x228..839 (612px) and x228..839 (612px).
768 — x24..635 (612px) ×2. 390 — x24..365 (342px) ×2.
Round 2's 442px/578px mismatch is gone.

### 6. Contact emails at two sizes — CONFIRMED FIXED.

`/contact` at 1280: "investors@gc2.fund" glyph box y656..672, x69..220 — **152px wide, 17 rows**.
Home black band at 1280: the same string y3952..3967, x653..805 — **153px wide, 16 rows** (the extra
row on `/contact` is the comma-free descender set, not a size change). Ascender-to-baseline is 12px in
both, which is 17px Instrument Sans in both. Round 2's 22px-vs-17px split is gone; the labels above
them were already identical 13px captions and remain so.

### 7. Article prev/next — CONFIRMED FIXED.

"The honest cost of convexity" now begins at **x=68** at 1280 (glyph box x68..263), on the measure's
left edge, under the rule, in ledger with a 1px underline. At 390 it is x24. Round 2's x449..645
flush-right run is gone, and with it the arrow-affordance read. A.5's "Everything left-aligned" now
holds with no exception on the site.

### 8. Footer nav at 390 — CONFIRMED FIXED.

Not a rewrap — a designed vertical stack. Firm, Strategies, Insights, Contact, Disclosures each on its
own line at x24, evenly spaced, under the wordmark. No orphan, because there is no row to orphan from.

### 9. Mobile overlay email — CONFIRMED FIXED.

`home-390-nav-open.png`: "investors@gc2.fund" renders in **`ledger`** with a 1px underline — 217
pixels inside the ledger tolerance, bounding box x127..262 / y555..583, against 101 slate pixels
elsewhere on the capture (the wordmark's antialiasing). The four nav links above it remain black
Newsreader 300. The last paper link that was still `ink`-era slate is now on the accent.

---

## 2. Scores

Criteria are Appendix C 1–10. `—` = not assessable at that width (criterion 6 above 768). Means are
taken over assessed criteria.

### `/` — Home

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 | 5 | 5 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | **5** | — | — |
| 7 | Consistency | 5 | 4 | 4 | 4 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 | 5 | 5 |
| 10 | Kill list | 5 | 5 | 5 | 5 |
| | **Mean** | **5.00** | **4.90** | **4.89** | **4.89** |

### `/firm`

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 | 5 | 5 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | **5** | — | — |
| 7 | Consistency | 5 | 5 | 5 | 5 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 | 5 | 5 |
| 10 | Kill list | 5 | 5 | 5 | 5 |
| | **Mean** | **5.00** | **5.00** | **5.00** | **5.00** |

### `/strategies`

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 4 | 4 | 4 | 4 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | 5 | — | — |
| 7 | Consistency | 5 | 5 | 5 | 5 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 | 5 | 5 |
| 10 | Kill list | 5 | 5 | 5 | 5 |
| | **Mean** | **4.90** | **4.90** | **4.89** | **4.89** |

### `/insights`

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1–10 | all criteria | 5 | 5 | 5 | 5 |
| | **Mean** | **5.00** | **5.00** | **5.00** | **5.00** |

### `/insights/capacity-is-a-research-problem`

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 | 4 | 4 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | 5 | — | — |
| 7 | Consistency | 5 | 5 | 5 | 5 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 | 5 | 5 |
| 10 | Kill list | 5 | 5 | 5 | 5 |
| | **Mean** | **5.00** | **5.00** | **4.89** | **4.89** |

### `/contact`

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 5 | 5 | 5 | 5 |
| 2 | Display type carries the page | 5 | 5 | 5 | 5 |
| 3 | Whitespace and rhythm | 5 | 5 | 5 | 5 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 5 | 5 | 5 | 5 |
| 6 | Mobile is designed | 5 | 5 | — | — |
| 7 | Consistency | 5 | 4 | 4 | 4 |
| 8 | Accessibility | 5 | 5 | 5 | 5 |
| 9 | Spec fidelity | 5 | 5 | 5 | 5 |
| 10 | Kill list | 5 | 5 | 5 | 5 |
| | **Mean** | **5.00** | **4.90** | **4.89** | **4.89** |

### `/disclosures`

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1–10 | all criteria | 5 | 5 | 5 | 5 |
| | **Mean** | **5.00** | **5.00** | **5.00** | **5.00** |

**`/disclosures` and `/insights` are finished.** All seven `/disclosures` sections are present in the
specified order at a 578px / 34em measure (x68..645 at 1280, x228..805 at 1600), sectioned by
hairlines that stop at the measure, in generic legal register, inventing no regulator, number or
jurisdiction. `/insights` is a single hairline list, newest first, on the container spine, with an h1
that sets in one line at 1280. Nothing on either is a finding.

---

## 3. Overall

| Page | Round 1 | Round 2 | Round 4 | Δ (R2→R4) |
|---|---|---|---|---|
| `/` | 4.67 | 4.69 | **4.92** | +0.23 |
| `/firm` | 4.74 | 4.90 | **5.00** | +0.10 |
| `/strategies` | 4.79 | 4.90 | **4.89** | −0.01 |
| `/insights` | 4.90 | 4.95 | **5.00** | +0.05 |
| `/insights/[slug]` | 4.79 | 4.79 | **4.95** | +0.16 |
| `/contact` | 4.90 | 4.90 | **4.92** | +0.02 |
| `/disclosures` | 4.90 | 5.00 | **5.00** | 0.00 |
| **Round overall** | **4.81** | **4.88** | **4.95** | **+0.07** |

Every criterion scores ≥ 4 on every page at every width. The lowest cell on the site is a 4.

`/strategies` moves −0.01 only because it is now assessed at four widths rather than two; its cell
values are unchanged and its single 4 (criterion 3) is unchanged.

**Accessibility passes on all four hard cases, on evidence.** The strategy-row ring is 2px exact
`#0F4C3A` at 3px offset (§1.2 above). The nav wordmark ring is `#0F4C3A` on paper
(`home-focus-nav.png`, `contact-focus-nav.png`). The black-band ring on the footer "Disclosures" link
is 2px exact `#F3F4F1` on a box x1127..1216 / y653..706 — ~19:1 against `#000000`, and zero ledger
pixels appear inside that band, correctly withholding an accent that would sample 1.6:1 there.
Reduced motion is honoured: `home-1280-reduced.png` differs from `home-1280-fold.png` only from x=699
rightward (max channel delta 30, mean 0.59); the hero text region x<720 differs by 135 pixels, all at
the surface's own left edge. The hero renders in its final state and only the surface changes, which
is A.6's contract. The footer's `muted-on-black` caption samples `rgb(154,160,166)` at **7.95:1**.
No shadows: the pixel row under the primary button steps `(0,0,0)` → `(255,255,255)` with nothing
between, and the sticky nav is pure `#FFFFFF` through y66–74 at scroll-top.

---

## 4. Findings

### High

None.

### Medium

None.

**Re-grade of round 2's footer-caption medium, stated explicitly rather than quietly.** Round 2 graded
the footer legal caption's measure a *medium*; it is unchanged this round and I am grading it *low*.
The reason, not a softening: A.4 sets a measure for the **`body`** and **`lead`** tokens
("Body measure ≤ 34em. Lead ≤ 30em") and sets none for **`caption`**, which is what this block is.
The width traces to a token — it is a single deliberate max-width, identical on all seven pages, at
68% of the container at 1280, not an ad-hoc or unbounded value — so it does not pull Appendix C-7
below 5 anywhere. What it does fail is §5.4's readability hunt item, which is why it stays a finding
rather than being absorbed. It is still the largest thing left on the site and it is the subject of §6.

### Low

`[all pages] [768, 1280, 1600] [low] The footer legal caption sets to about 131 characters per line: 13px type running x68..845 (778px) at 1280 and at 1600, and x24..742 (718px) at 768 — where the 768 container is 720px wide, so at that width it is effectively edge to edge. It is the longest measure on the site by a wide margin and the only block that breaks the discipline every other block now holds. Unchanged since round 1. At 390 it sets to ~340px / ~57 characters and is correct. [§5.4 "body measure over 75 characters"; §A.4 measure discipline]`

`[home, contact] [768, 1280, 1600] [low] In the three-column Investors / Press / Office block the Office value does not share a baseline with the two email values beside it. At 1280 on /contact the three labels align exactly (all y614..623) but "Austin, Texas" occupies y648..662 while "investors@gc2.fund" and "press@gc2.fund" occupy y656..672 — an ~8px baseline break across one row. The same offset appears in the home black band (Office y3944..3957 against the emails at y3952..3967, labels aligned at y3914..3923). The three values are now the same size, which is what makes the offset visible; the linked values appear to carry a line-box the plain value does not. NEW this round — it was masked while the sizes differed. [Appendix C-7 "every value traces to a token; nothing ad hoc"; §A.8 /contact "the same three columns on paper"]`

`[strategies] [390, 768, 1280, 1600] [low] The six strategy blocks share one density. Each is h2 + two-row definition list + two paragraphs, hairline-separated at y513, 895, 1278, 1712, 2094, 2476 — five of the six gaps within 8px of 382px. The page reads as one repeated unit from top to bottom. This is A.8's literal instruction ("six full-width blocks"), so it is not a fidelity failure and A.8 wins under §0.1; it is the reason criterion 3 sits at 4 rather than 5, and it is the only cell on the page below 5. [Appendix C-3 "no two sections feel the same density"]`

`[home] [390] [low] In the 2×2 facts grid the second row's cells run to different depths: labels align at y1057..1066 and values both begin at y1084, but "Private partnership" takes two lines to y1135 while "Liquid markets, global" takes three to y1163. Tops align, bottoms do not. Unchanged since round 0. [§A.8 home §2]`

`[insights/capacity-is-a-research-problem] [390, 768, 1280, 1600] [low] The prev/next link is still unlabeled: a bare "The honest cost of convexity" with no "Previous" or "Next", and only one of the two directions renders. Now that it is left-aligned it no longer reads as an arrow affordance, so the round-2 finding is materially closed, but a reader cannot tell which direction the link goes. A.8 asks for "plain-text prev/next" and this is plain text, so this is a residue rather than a fidelity failure. [§A.8 /insights/[slug] "plain-text prev/next"]`

### Not found — checked and clean

Nothing from §A.7 is present. Paper canvas throughout with exactly one inverted black band per page.
No ticker. No `$0M` / `0.0%` / `0` placeholder — the facts row carries four real values, and `address`
and `phone` are null so those elements simply do not render. No italic, coloured or bold single-word
accent in any headline; `ledger` appears only on links, the focus ring and the active nav underline,
never inside a headline and never as a fill. No `01`–`06` markers. No `→` anywhere. No uppercase
tracked eyebrow; the facts labels and article meta are sentence-case slate captions, and the article
meta separates "Feb 20, 2026" from "Process" with space, not a middle dot. No decorative quotation
glyph on the statement band. No anchor-scroll nav; home's rows link to `/strategies#slug` and the
checklist confirms every anchor exists. No monospace. No gradient, glass, shadow, pill, icon library
or stock image. The surface samples fully achromatic on both home and `/firm` (top colours
`(255,255,255)`, `(254,254,254)`, `(253,253,253)`, `(252,252,252)` — no tint). Radii read as 2px.
"Tail Overlay" is long convexity, per §A.7 item 13. Copy carries no marketing adjective, no
exclamation mark and no first-person hype on any page. No headline wraps past two lines at 1280.
The container is exactly 1144px of content inside a 1240px box at both 1280 (x68..1211) and 1600
(x228..1371). The statement band now holds cols 1–9: its longest line runs x70..898 (829px) against a
cols-1–9 width of 852px, down from round 2's 1046px. No two sections on home share a density: hero,
a 126px facts band, a stacked prose block, six hairline rows, a stone field with 120px padding, three
notes rows, the black band.

---

## 5. §5.2 exit condition

**§5.2 exit condition: MET.**

- Every Appendix C criterion ≥ 4 on every page at every width — **met**. The lowest cell is a 4
  (criterion 7 on home and `/contact` at ≥768; criterion 3 on `/strategies` and on the article at
  ≥1280). The two 3-cells that blocked round 2 — criterion 6 at 768 on home and `/firm` — are both
  now 5, measured.
- Overall ≥ 4.5 — **met** (4.95; lowest page 4.89).
- `killist.txt` empty — **met**. axe zero violations on all seven pages — **met**. Console errors zero
  — **met**. Checklist 53/53 — **met**.
- Lighthouse ≥ 95 in all four categories on `/` and `/strategies` mobile — **met**
  (98/100/96/100 and 96/100/96/100).
- The critic's high and medium finding count is zero — **met**. 0 high, 0 medium, 5 low.

This is the confirming round under §5.2 for every gate that this critic can judge. The one clause I
cannot certify from the pixels is "the round produced zero code changes" — round 4 plainly contains
code changes, since nine round-2 findings landed in it. On the rubric, the machine gates and the
finding count, round 4 passes; on the zero-change clause it is the *first* of the two consecutive
rounds, and a round 5 that changes nothing would close it. LCP 2.3–2.9s against A.9's `<1.5s` remains
logged open, as settled.

---

## 6. The single change that would most improve this round

Give the footer legal caption a measure. It is now, unambiguously, the last thing on the site that
does not obey the discipline the rest of it holds: 13px type running 778px at 1280 and 1600, and 718px
inside a 720px container at 768, which is about 131 characters a line against the ≤34em every body
block and both long-form pages now hit exactly. Round 2 called it a medium and I have called it a low,
because it is a `caption` token and A.4 constrains `body` and `lead` — but the honest reason it is
still here after four rounds is that nobody has looked at it, not that anybody decided it was right,
and §5.4 names 75 characters by name. It is a one-line change, it costs nothing, and it removes the
only block a reader has to hunt for the start of the next line in. Everything else left is genuinely a
hairline: an 8px baseline break between three columns that only became visible *because* the round
fixed their sizes; a facts cell that runs three lines where its neighbour runs two; an unlabeled
prev/next that is now at least left-aligned; and six strategy blocks that are identical because
Appendix A told them to be. Round 4 is the round the site stopped having a shape problem — the 768
grid, the focus ring, the row inset, the duplicated city, the mismatched rules, the two email sizes,
the right-aligned link, the orphaned nav item and the slate overlay email all closed at once, and none
of them regressed anything else. Fix the caption, change nothing else, and round 5 confirms.
