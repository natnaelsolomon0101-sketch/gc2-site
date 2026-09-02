# Round 9 triage

Three critics plus design-director and compliance-officer. Deduplicated, ranked,
owner-tagged. Ideas capped at two (both accepted in Wave 1).

## Critic scores

| Critic | Overall | High | Medium | Low |
|---|---|---|---|---|
| critic-brand | **4.47** | 1 | 6 | 4 |
| critic-craft | **~4.51** | 1 | 6 | 5 |
| critic-lp | ~4.6 | 1 | 3 | 4 |

Gate is every criterion >= 4 on every page and overall >= 4.5 from **all three**.
critic-brand is under. Not met this round.

## Fixed this round

| Finding | Raised by | Action |
|---|---|---|
| Mobile drawer centered, not on the page gutter | critic-brand (high), critic-craft (high), design-director | Links now at x=24 with the wordmark |
| Drawer had no 200ms fade | §4.5, missing entirely | 200ms opacity transition |
| Close did not return focus to the hamburger | §4.5, missing entirely | Returns focus |
| `/firm` surface runs through the h1 at 390 | critic-lp (high) | Hidden below md; header has only 72px of 348px clear |
| Contact values 7px off one baseline | critic-brand | `.link-block` bought 44px by growing the box; now padding + negative margin |
| Link underline near-black under green glyphs | critic-craft | `currentColor` at rest, hover to black |
| Focused skip link invisible behind the sticky header | a11y-auditor (high) | Restacked skip 50 > header 40 > drawer 30 |
| `<main>` not focusable, so the skip link only worked in Chromium | a11y-auditor | `tabindex="-1"` |
| Kill list did not catch `z-[` arbitrary values | found while fixing the above | Rule extended, canary-tested |

## a11y-auditor — 26 contrast pairs, 0 failures

Lowest is `slate` on `stone` at **4.60:1** against a 4.5 floor. It explicitly
warns not to "correct" `slate` back to A.3's tabled `#6B7178`, which measures
**4.47:1** on stone and would fail. Focus rings: ledger on paper 9.93:1, stone
on black 19.02:1, and ledger on near-black would be 2.12:1 — which is why the
black band's stone override is load-bearing. Reflow clean at 640/512/320/280px.
Its second high (drawer focus return) was **stale**: it tested before that fix
landed, and a clean-build probe confirms focus returns to the hamburger.

## Open, ranked

1. **Strategy definition-list hairlines span 463px, not the container** — three
   lengths in one block, and an indented value column at x=230. Both craft and
   brand raised it. `layout-engineer`. A.5 / §4.2.
2. **Active nav underline sits ~13px below the baseline**, not A.8's 6px offset,
   and does not meet the nav hairline when scrolled. `layout-engineer`.
3. **Section rhythm is set by full-bleed accident** — 240px paper-to-paper vs
   120px paper-to-band. `layout-engineer`. Appendix C-3.
4. **nbsp still absent site-wide** — lines end on "The", "a", "we", "It".
   typographer flagged it as outside its ownership and named every location.
   `copy-chief`.
5. **Hero surface runs under the lead at 768.** `surface-artist`. A.6 mask.
6. **Hero lead measure 632px ≈ 31.6em** vs A.8's <= 30em. `layout-engineer`.
7. **Focus ring radius ~5-7px** in a 2px/4px system. `component-smith`.
8. **Article meta separates date and category with a bare double space.**
   `layout-engineer`. Low.
9. **Statement attribution ink at 229 vs h2 at 227.5** — the optical pass
   corrected headings only. `typographer`. Low.
10. **Contact columns at 68/462/857** — a 3x360 grid, not the 12-col grid. Low.

## Not actioned, with reasons

- **Six identical strategy blocks** (brand, lp, craft all noted the rhythm).
  A.8 mandates the structure. Settled twice already; §0.1 puts Appendix A first.
- **"No name, no entity, no registration"** (critic-lp, the strongest non-design
  point in the round). §8 forbids inventing an entity, a regulator, or a person.
  This is a content decision for the owner and goes to the report as an open item.
- **8 of 69 PNGs resample on disk** (critic-craft). Real, and it has now hit
  three separate agents. It is a harness limitation in the reader, not a site
  defect; every affected agent worked from the native `-fold` captures and said
  so.
