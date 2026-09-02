# Decisions

One line of reasoning each, per Orchestration §0.

- **Resume, not restart.** `redesign/institutional` already carries a complete
  Phase 4 build: every component in the A.9 allowed list, all seven routes, the
  three A.10 notes at the specified slugs. §0.3 resume protocol applies. Restarting
  would discard correct work.
- **site.name = "Girlscantrade2".** A.1 assumes "Girls Can Trade 2" and flags it
  for confirmation. The user corrected this explicitly earlier: one word, no
  apostrophe. Treated as confirmed; A.1's blocking question in §0.2 does not fire.
- **Appendix B queries shortened.** The literal phrases return zero rows against
  this database build. Short keyword forms return real rows. Intent preserved.
- **OG cards render entirely in Newsreader.** Loading the display face makes it
  the card's fallback, so the wordmark and footer line render serif too rather
  than Instrument Sans. A.4 already assigns Newsreader to the wordmark; an
  all-serif card is more coherent than mixing two families at card scale.
  Accepted rather than fixed.

## Skill conflicts (Orchestration 9.6)

The ui-ux-pro-max design-system generator recommended, and Appendix A overrode:
- **Palette.** Generator: blue `#2563EB` primary, orange `#EA580C` accent,
  `#F8FAFC` ground. A.3 is 95% achromatic on paper with one `ledger` green used
  for links and focus only. A wins.
- **Typefaces.** Generator: Outfit + Work Sans, both geometric sans. A.4 makes a
  serif display the identity: Newsreader 300 + Instrument Sans. A wins.
- **Shadows.** Generator defines four elevation levels. A.5 is explicit: zero
  shadows, hairlines and surface steps only. A wins.
- **Spacing.** Generator's scale stops at 64px. A.5 runs to 160 with 120px
  section padding, because whitespace is the hierarchy here. A wins.
