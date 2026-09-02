# Round 0 — Critic pass

Judged from `docs/qa/round-0/screens/**`, `axe.json`, `checklist.md`, `summary.json` and the spec
(`gc2-claude-code-orchestration.md`, Appendix A / A.7 / A.8, Appendix C). No source was read.

Machine gates that already pass: `killist.txt` empty, axe 0 violations on all 7 pages, checklist 53/53,
0 console errors, Lighthouse 96/100/96/100 (home mobile), 98/100/96/100 (strategies mobile).
Everything below is what the pixels say.

---

## 1. Scores

Criteria are Appendix C 1–10. `—` = not assessable at that width.

### `/` — Home

| # | Criterion | 390 | 768 | 1280 | 1600 |
|---|---|---|---|---|---|
| 1 | Institutional register | 3 | 2 | 3 | 3 |
| 2 | Display type carries the page | 5 | 4 | 5 | 5 |
| 3 | Whitespace and rhythm | 4 | 3 | 4 | 4 |
| 4 | Restraint | 5 | 5 | 5 | 5 |
| 5 | Copy | 4 | 4 | 4 | 4 |
| 6 | Mobile is designed | 4 | 2 | — | — |
| 7 | Consistency | 4 | 4 | 4 | 4 |
| 8 | Accessibility | 4 | 4 | 4 | 4 |
| 9 | Spec fidelity | 2 | 2 | 2 | 2 |
| 10 | Kill list | 5 | 5 | 5 | 5 |

### `/firm`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 3 | 3 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 3 | 3 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 3 | 3 |
| 6 | Mobile is designed | 4 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 4 | 4 |
| 9 | Spec fidelity | 2 | 2 |
| 10 | Kill list | 5 | 5 |

### `/strategies`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 4 | 4 |
| 2 | Display type carries the page | 4 | 4 |
| 3 | Whitespace and rhythm | 3 | 3 |
| 4 | Restraint | 4 | 4 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 4 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 4 | 4 |
| 9 | Spec fidelity | 4 | 4 |
| 10 | Kill list | 5 | 5 |

### `/insights`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 4 | 4 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 4 | 4 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 5 | 5 |
| 8 | Accessibility | 4 | 4 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |

### `/insights/capacity-is-a-research-problem`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 4 | 4 |
| 2 | Display type carries the page | 2 | 2 |
| 3 | Whitespace and rhythm | 3 | 3 |
| 4 | Restraint | 4 | 4 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 4 | — |
| 7 | Consistency | 2 | 2 |
| 8 | Accessibility | 4 | 4 |
| 9 | Spec fidelity | 3 | 3 |
| 10 | Kill list | 5 | 5 |

### `/contact`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 4 | 4 |
| 2 | Display type carries the page | 5 | 5 |
| 3 | Whitespace and rhythm | 4 | 4 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 4 | 4 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |

### `/disclosures`

| # | Criterion | 390 | 1280 |
|---|---|---|---|
| 1 | Institutional register | 4 | 4 |
| 2 | Display type carries the page | 4 | 4 |
| 3 | Whitespace and rhythm | 4 | 3 |
| 4 | Restraint | 5 | 5 |
| 5 | Copy | 5 | 5 |
| 6 | Mobile is designed | 5 | — |
| 7 | Consistency | 4 | 4 |
| 8 | Accessibility | 4 | 4 |
| 9 | Spec fidelity | 5 | 5 |
| 10 | Kill list | 5 | 5 |

---

## 2. Overall

| Page | Overall |
|---|---|
| `/` | 3.83 |
| `/firm` | 3.80 |
| `/strategies` | 4.10 |
| `/insights` | 4.70 |
| `/insights/[slug]` | 3.60 |
| `/contact` | 4.60 |
| `/disclosures` | 4.40 |
| **Round 0 overall** | **4.15** |

Exit condition (§5.2) not met: overall is below 4.5, eleven criterion cells score below 4, and the
high/medium finding count is not zero.

---

## 3. Findings

### High

`[all pages] [all widths] [high] The fund name renders as the run-together token "Girlscantrade2" — hero lead, /firm Origins first sentence, /disclosures "Nature of this website", and the legal caption plus © line in every footer. It reads as a mangled slug, not a fund. [§A.1 name: "Girls Can Trade 2"; "Set it in plain type."]`

`[home] [768] [high] In the black Inquiries band the investors and press addresses collide: "investors@gc2.fundpress@gc2.fund" with the two underlines touching. The three-column block does not reflow between 390 and 1280. [§A.8 home §7 three columns; §A.9 text reflow / AA legibility]`

`[home] [390, 768, 1280, 1600] [high] Section 3's h2 reads "The firm" — a generic label — instead of the mandated statement headline. It is the one h2 on the page that says nothing, and it sits alone in a 450px-tall empty left column. [§A.8 home §3: h2 cols 1–5 "A research house that trades."]`

`[insights/capacity-is-a-research-problem] [390, 1280] [high] The three in-article h2s ("Why the usual order fails", "Capacity is not a constant", "What this rules out") render at roughly 14px in slate — smaller and lighter than the 18px body they head. The hierarchy is inverted and the article reads as one undifferentiated column. [§A.8 /insights/[slug]: in-article h2 Newsreader 400 30px]`

`[firm] [390, 1280] [high] The "Where we are" section's entire body is the fragment "Austin, Texas." under a 48px h2, after which the page falls straight into the black footer band. It is the weakest moment on the site. [§A.8 /firm: "2–3 paragraphs each in the §A.10 voice"]`

### Medium

`[home] [768] [medium] 768 is the 1280 grid squashed, not a designed breakpoint: the facts row stays 4-up with "Private partnership" and "Liquid markets, global" wrapping to two lines, the firm prose column narrows to ~344px (~44 characters) beside an empty left column, and the strategy and insight rows keep their three-column desktop split. [§5.4 "mobile layouts that are the desktop layout squashed rather than designed"; §A.8 home §2 "2×2 on mobile"]`

`[home, firm] [390] [medium] The surface SVG does not render at 390 — the home hero and the /firm header are blank paper. The site's only visual disappears on mobile. [§4.3 "reads as calm terrain at 1440 and 390"; §A.6]`

`[home] [390, 768, 1280, 1600] [medium] The firm section's two paragraphs are rewritten, not the mandated copy ("…hold an idea to a single standard: it earns capital only when the evidence survives adversarial review", "Every position has a named owner…We carry no external mandate…"). [§A.8 home §3 P1/P2 verbatim]`

`[insights/capacity-is-a-research-problem] [1280] [medium] Body measure is ~86 characters per line (≈688px at ~18px ≈ 38em). [§A.4 "Body measure ≤ 34em"; §5.4 "body measure over 75 characters"]`

`[disclosures] [1280] [medium] Body measure is ~88 characters per line (≈679px at 17px ≈ 40em). [§A.4 "Body measure ≤ 34em"; §5.4 "body measure over 75 characters"]`

`[strategies] [390, 1280] [medium] The six strategy blocks are identical modules — same h2, same two-row definition list, same two paragraphs, same spacing — repeated down a 3,149px page with no variation in density or emphasis. [Appendix C-3 "no two sections feel the same density"; §5.4 "sections that all look like the same card"]`

`[strategies] [390, 1280] [medium] The Markets and Instruments values are right-aligned against their left-aligned labels, producing a leader-line price-list effect; at 390 "Equity index, single names" nearly meets its label. It is the only right-aligned content on the site. [§A.5 "Everything left-aligned. Nothing centered except the mobile nav overlay."]`

`[insights/capacity-is-a-research-problem, disclosures] [1280] [medium] The same element renders two ways: the article's section h2 is ~14px slate, /disclosures' section h2 is ~28px black Newsreader. One of the two does not trace to the type scale. [Appendix C-7 "every value traces to a token; nothing ad hoc"]`

`[all pages] [all widths] [medium] No screenshot in the round captures a focused element, so focus-ring visibility — including the stone ring on the black band — cannot be judged from the pixels. axe and Lighthouse do not test it. The round needs a focus-state capture per page before criterion 8 can score above 4. [Appendix C-8; §A.9 focus-visible 2px ledger ring, 3px offset, stone on black]`

### Low

`[all pages] [all widths] [low] The footer prints an extra "Austin, Texas" bottom-right, duplicating the Office column directly above it and adding an element the footer spec does not list. [§A.8 home §8]`

`[home] [1280, 1600] [low] The statement band sentence runs to ~89% of the container (≈cols 1–11) instead of cols 1–9, so it reads as a wide paragraph rather than a held statement. [§A.8 home §5 "One h2 sentence cols 1–9"]`

`[home] [390] [low] In the 2×2 facts grid "Liquid markets, global" wraps to three lines while its neighbours take one or two, leaving the four cells visibly ragged. [§A.8 home §2]`

`[home] [390] [low] The open mobile nav closes with an "×" glyph — a second glyph beyond the sanctioned hamburger. [§A.6 "Iconography: none. The only glyph is a two-line hamburger on mobile."]`

`[insights/capacity-is-a-research-problem] [1280] [low] The prev/next link ("The honest cost of convexity") is right-aligned under a left-aligned article. [§A.5 "Everything left-aligned."]`

`[contact] [1280] [low] The contact emails render at ~22px here but ~17px in the identical three-column block in the home black band. [Appendix C-7]`

`[firm, insights, contact, disclosures] [390] [low] The footer nav wraps with "Disclosures" orphaned on its own row below the other four links. [Appendix C-6]`

`[home] [1280] [low] The surface's leftmost isolines reach into the lead's text column (cols 1–7) around "Texas. We run concentrated…"; the mask should have dissolved before it. [§A.6 "behind cols 6–12 … masked to dissolve into paper leftward and downward"]`

### Not found — checked and clean

Nothing from §A.7 is visible in any screenshot: paper canvas with exactly one inverted band per page, no
ticker, no `$0M`/`0.0%` placeholders (the facts row carries four real values), no italic or coloured word
accents, no `01`–`06` markers, no `→`, no uppercase tracked eyebrows, no middle-dot meta (the article meta
is "Feb 20, 2026  Process"), no quotation glyphs on the statement band, no fake phone or street address, no
anchor-scroll nav, no monospace, no gradients, glass, shadows, pills, icon library or stock imagery. Radii
read as 2px on buttons. "Tail Overlay" is correctly described as long convexity. `home-1280-reduced.png`
shows the hero in its final state, so reduced motion is honoured. The hero is not a SaaS hero — 96px
Newsreader 300 over deterministic isolines could not be mistaken for a product page.

### QA note (not a site finding)

`home-390.png`, `home-768.png` and `home-1280.png` are stored on disk at reduced resolution
(119×1800, 299×1800, 522×1800) while their siblings are full size. Re-capture them before round 1 so the
next critic can read mobile home at native scale; my 390 home judgements were made from an upscale of the
119px file plus `home-390-nav-open.png` and `home-768.png`.

---

## 4. The single change that would most improve this round

Fix the name. On every page, in the hero lead, in the first sentence of /firm, in the first clause of
/disclosures, and in the legal caption and copyright line of every footer, the fund calls itself
"Girlscantrade2" — one lowercase run-on token, the shape of a URL slug, set in the same 17px body as the
sentence around it. Appendix A opens by saying the name is unusual and must be set in plain type and never
explained; instead it is set in a way that reads like a build artifact, and it is the first thing a
stranger's eye lands on after the headline. Every other institutional signal on this site is intact — the
type, the hairlines, the single black band, the empty kill list, the copy that never once reaches for an
adjective — and all of it is undone by four words of body text that no nine-figure fund would ship. Render
it as "Girls Can Trade 2" everywhere it appears, and while the string is being touched, give the home
firm section back its real headline ("A research house that trades.") and give /firm's "Where we are" its
two paragraphs, because those three edits are the same edit: the site is currently saying less about
itself than the design is prepared to carry.
