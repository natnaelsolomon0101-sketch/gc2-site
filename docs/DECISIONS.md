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

## Critic finding rejected — round 0

- **The fund name stays "Girlscantrade2".** The round-0 critic made this its
  single highest-priority finding and asked for "Girls Can Trade 2", reading
  A.1 literally. A.1 marks that value `// CONFIRM` and §0.2 names it an
  assumption. The user confirmed a different spelling explicitly earlier in this
  engagement: one word, no spaces, no apostrophe. A confirmed user value
  outranks the spec's placeholder, so the finding is rejected, not deferred.
  The critic could not have known this: it is barred from reading `src/` and the
  correction lives in conversation, not in the brief.
- **`slate` ships as `#696F76`, not A.3's `#6B7178`.** The spec value measures
  4.47:1 on `stone` and fails AA for normal text; slate is the caption and
  secondary-text color and does sit on stone. Darkened to the nearest value that
  clears 4.5 (measured 4.60 on stone, 5.08 on paper).
- **`mist` `#C9CCC7` is 1.62:1 on paper and stays.** A.3 scopes it to disabled
  and placeholder states, which the contrast minimum exempts. It carries no text
  in the build.
- **"leverage" kept in the convexity note.** A.10 bans it as a marketing verb
  ("leverage our platform"). The note uses the financial noun, "leverage you can
  actually defend", which is correct domain language.
