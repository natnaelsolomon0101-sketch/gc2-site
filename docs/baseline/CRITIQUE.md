# Baseline critique — the live site

`https://gc2-site.vercel.app/` captured 2026-09-02 at 390/768/1280/1600.
Scored against Appendix C. 1 = fails, 5 = would sit next to blackstone.com.

## Scores

| # | Criterion | 390 | 1280 | Note |
|---|---|---|---|---|
| 1 | Institutional register | 2 | 2 | Reads as a crypto or dev-tool landing page, not a fund |
| 2 | Display type carries the page | 3 | 3 | Serif display is good; centering drains its authority |
| 3 | Whitespace and rhythm | 1 | 1 | ~950px of dead black mid-page |
| 4 | Restraint | 2 | 2 | Saturated violet fill, uppercase eyebrows, card grid |
| 5 | Copy | 4 | 4 | Copy itself is clean and declarative |
| 6 | Mobile is designed | 2 | — | Same stack, squashed |
| 7 | Consistency | 3 | 3 | Wordmark rendered at two sizes; inline font-size overrides |
| 8 | Accessibility | 2 | 2 | `fog` body text at 3.56:1; 20px tap targets |
| 9 | Spec fidelity | 1 | 1 | Wrong canvas, wrong order, cards instead of hairline lists |
| 10 | Kill list | 1 | 1 | Six A.7 entries present |

**Overall: 1.9 / 5.**

## Findings

- `[home] [1280] [high] ~950px of empty black between the strategies heading and the statement band. The pinned track is six viewports tall and only one tile is ever painted in a static view. [A.5 whitespace is the hierarchy; A.2 sections breathe]`
- `[home] [all] [high] Dark canvas is the default, not one deliberate inversion. [A.7.1]`
- `[home] [all] [high] Saturated violet `#847dff` used as a surface fill behind a strategy tile. [A.3 one accent, never a fill, never a surface]`
- `[home] [all] [high] Hero is centered. [A.5 everything left-aligned except the mobile nav overlay]`
- `[home] [all] [medium] Uppercase tracked eyebrows: STRATEGIES, INSIGHTS, CONTACT. [A.7.7]`
- `[home] [all] [medium] Monospace labels throughout. [A.7.11]`
- `[home] [1280] [medium] Notes render as three filled cards. [A.8.6 hairline list of three latest]`
- `[home] [all] [medium] Section order deviates: no facts row, no firm section. [A.8 home, in order, nothing else]`
- `[home] [390] [low] Mobile is the desktop stack narrowed. [C.6]`

## The single change that would most improve this baseline

Delete the pinned scroll section. It costs ~950px of empty canvas, hides five of
six strategies behind a scroll interaction, and is the direct cause of the two
worst scores on the page (whitespace 1, spec fidelity 1). Replacing it with the
A.8.4 hairline list puts all six strategies on screen at once, restores the
vertical rhythm, and removes the only place the violet fill appears.

## Lighthouse (live, mobile)

performance 98 · accessibility 96 · best-practices 96 · seo 100
