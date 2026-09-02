# Round 4 fixes

Round 4 scored 4.95 (round 2: 4.88), 0 high / 0 medium / 5 low, and the critic
ruled §5.2 met on every clause except "zero code changes", since the round
itself carried nine fixes.

Nine defects closed in this round, none of which regressed anything else:

| Finding | Action |
|---|---|
| 768 was the desktop grid narrowed: prose at x397..741, 345px, ~46 chars, beside ~373px of dead space, on home and all four /firm sections | A.5 puts the desktop gutter at >=1024, so the 12-column grid now starts there and a 4-column stack holds below it. Prose at 768 runs x24..600, 577px, 34em at 17px. Criterion 6 went 3 -> 5 on both pages. |
| Hairline rows inset 8px off the page's vertical spine | `px-2` removed. h1, strategy name, insight date and statement all sit at x=68. |
| Footer printed a second "Austin, Texas" | Removed; A.8 home 8 does not list a city and it duplicated the Office column above it. |
| The article's two foot rules drew 510px and 646px | `measure-prose` is an em measure, so it resolved against each element's own font-size: 13px caption vs 18px prose. The article column is one fixed 612px. |
| Contact emails rendered 15px on home and 22px on /contact | Both `t-body` at 17px; labels stay `t-caption`. |
| Article prev/next right-aligned, the only such element on the site | `justify-between` -> a left-aligned stack. A.5. |
| Footer nav orphaned "Disclosures" at 390 | Five links total 291px in a 342px column, so a single row orphaned it and a 2-column grid left 2+2+1. Single column at mobile, row at sm and up. |
| The mobile overlay email was bare slate text | Now carries the link treatment: ledger, underline, 44px target. It was the only link on the site without it. |
| No capture contained a focused strategy row | Retargeting `focus-black` to the footer had removed the only one. An in-page focus capture was added; the ring verified as `rgb(15,76,58)`, 2px, 3px offset. |

## Found by the builder, not the critic

The critic cannot measure what a screenshot does not show. Two defects came from
direct measurement instead:

- **Tap targets.** This branch never had the pass the other branch got: the
  wordmark was 44x22, desktop nav links 43px, the hero and section text links
  21-28px, and the contact emails short on both pages. Everything interactive
  now clears 44px in height. Inline links inside a sentence deliberately do not,
  since WCAG 2.5.8 exempts them and a 44px box breaks the line.
- **A.8 section order.** Verified programmatically against the spec's list. All
  eight home sections present, in order, nothing else.
