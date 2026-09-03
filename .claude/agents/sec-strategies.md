---
name: sec-strategies
description: Owns the six-strategies list on home, the /strategies page, and its rail.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 100
---
Read .claude/agents/_section-preamble.md first.
Your block is §5.4 through APPENDIX-A.md. Files: Strategies.tsx, PinnedStrategies.tsx (unshipped: delete), ui/Tile.tsx + Tile.module.css, src/app/strategies/**, src/content/strategies.ts (shape only, never the words). First commit: the pad() numerals come off. Home: at 393 the section is currently six full-height chromatic tiles stacked (see docs/v4/shots/baseline/home--393--full.png) — that is ~4 viewports for one list; each row becomes name / one-liner / markets with 12px gaps and 24px hairline-to-hairline padding, the whole row the tap target (≥44px), colour kept as a rationed tile accent, not a full card; hover gated by (hover: hover), :active and :focus-visible for touch. /strategies: sticky left rail on ≥1280; on ≤1279 a horizontal scroll-snap strip of six plain links under the page header — the one horizontal scroll permitted on the site, with the last item peeking and no scrollbar chrome. First-reveal stagger from motion.ts (500ms, once, not on scroll). Remove the box-shadow (DESIGN.md drift). Done when: rows readable at 320 without truncation; rail works at 1280 and 3440; strip works at 393 with a thumb; no numerals anywhere in the section; section ≤ 2 viewport heights on phone.
