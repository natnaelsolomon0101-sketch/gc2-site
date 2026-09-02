# Home — design plan

## 1440

```
┌──────────────────────────────────────────────────────────────────────────┐
│ GC2          Firm  Strategies  Insights  Contact      [Investor inquiries]│ 72px, sticky
├──────────────────────────────────────────────────────────────────────────┤
│                                        ╭ ── ── ── ── ── ── ── ── ── ─╮   │
│  Evidence first.                       │   ~40 isolines, 1px hairline │   │
│  Then capital.                         │   masked: dissolves left     │   │
│                          96px/300      │   and down into paper        │   │
│                                        │   drifts on a 90s loop       │   │
│  Girlscantrade2 is a private           │                              │   │ min(100vh-72, 900)
│  investment partnership in Austin…     ╰ ── ── ── ── ── ── ── ── ── ─╯   │
│                                                                          │
│  [Our approach]   Investor inquiries                                     │
├──────────────────────────────────────────────────────────────────────────┤ hairline
│ Founded        Headquarters      Structure          Mandate              │ 32px pad
│ 2019           Austin, Texas     Private partner…   Liquid markets…      │ Newsreader 400/28
├──────────────────────────────────────────────────────────────────────────┤ hairline
│                                                                          │
│  The firm            │  Durable returns in liquid markets come from      │ 5 / 7 split
│  (h2, cols 1-5)      │  process, not prediction. …                       │
│                      │  About the firm                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  Six strategies. One risk framework.                                     │
│ ──────────────────────────────────────────────────────────────────────── │
│  Systematic Macro    Directional cross-asset risk…      Rates, FX, index │ 28px pad
│ ──────────────────────────────────────────────────────────────────────── │ hover: stone
│  Volatility Arbitr…  Relative value between implied…    Equity index, r… │
│ ──────────────────────────────────────────────────────────────────────── │
│  …four more                                                              │
├══════════════════════════════════════════════════════════════════════════┤ stone, full-bleed
│  Risk is not the price of return. It is what we manage                   │ h2, cols 1-9
│  so that we are still here when the return arrives.                      │
│  Investment Committee                                                    │ small/slate
├══════════════════════════════════════════════════════════════════════════┤
│  Notes from the desk.                                        All notes   │ same baseline
│ ──────────────────────────────────────────────────────────────────────── │
│  Jul 14 2026 │ Trade the regime, not the forecast          │  Research   │
│              │ Point estimates decay in days…              │             │
│ ──────────────────────────────────────────────────────────────────────── │
├██████████████████████████████████████████████████████████████████████████┤ BLACK, full-bleed
│  Inquiries                                                               │
│  We speak with a small number of aligned partners each year.             │
│  Investors              Press                 Office                     │
│  investors@gc2.fund     press@gc2.fund        Austin, Texas              │
│ ──────────────────────────────────────────────────────────────────────── │ hairline-on-black
│  GC2      Firm  Strategies  Insights  Contact  Disclosures               │
│  Girlscantrade2 is a private investment partnership. …                   │ caption/muted
│  © 2026 Girlscantrade2. All rights reserved.        Austin, Texas        │
└──────────────────────────────────────────────────────────────────────────┘
```

## 390

```
┌────────────────────────────┐
│ GC2                     ☰  │ 72px
├────────────────────────────┤
│                            │
│  Evidence first.           │ 52px/300
│  Then capital.             │
│                            │  surface sits behind, clipped
│  Girlscantrade2 is a       │  right, further dissolved
│  private investment…       │
│                            │
│  [Our approach]            │  stacked, 16px gap
│  Investor inquiries        │
├────────────────────────────┤
│ Founded      Headquarters  │ 2×2
│ 2019         Austin, Texas │
│ Structure    Mandate       │
├────────────────────────────┤
│ The firm                   │ stacks: h2 then prose
│ Durable returns…           │
├────────────────────────────┤
│ Six strategies. One risk…  │
│ ────────────────────────── │
│ Systematic Macro           │ name, then one-liner,
│ Directional cross-asset…   │ then markets — stacked
│ Rates, FX, equity index    │
│ ────────────────────────── │
└────────────────────────────┘
```

## Why each section is not the generic version

**Hero** — the generic version centers a headline over a gradient and adds two pill
buttons. This is left-rail, 96px at weight 300, with the only visual on the page
behind it. One filled button, one text link. Nothing is centered.

**Facts** — the generic version is an animated stat counter row (AUM, returns, years).
These are four verifiable facts, not metrics, set in the display face between two
hairlines. Nothing counts up. Nothing is a number that could be wrong.

**The firm** — the generic version is a centered paragraph under a centered heading.
This is a 5/7 asymmetric split: heading holds the left rail, prose sits right, and the
whitespace between them is the composition.

**Strategies** — the generic version is a 3×2 card grid with an icon in a circle. This
is a hairline list where the row itself is the link, no cards, no numbering, no chips.
The rows read as a table of contents, which is what they are.

**Statement** — the generic version is a testimonial card with a giant quote glyph and
a headshot. This is one sentence at 48px on a stone band with an attribution line and
no punctuation ornament at all.

**Insights** — the generic version is three cards with cover images. This is a hairline
list with date, title, dek, category, matching the strategies rhythm so the page has
one list idiom rather than two.

**Contact + footer** — the generic version is a contact form nobody wired up. This is
the page's single inverted band, mailto only, because a broken form is worse than no
form and there is no backend.
