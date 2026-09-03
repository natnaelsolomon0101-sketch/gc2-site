---
name: sec-allocators
description: Owns the eight-pages grid on home and /partnership, /diligence, /questions, /access, /letters.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first.
Your block is §5.7 through APPENDIX-A.md. Files: ForAllocators.tsx, HairlineList.tsx, src/app/partnership/**, diligence/**, questions/**, access/**, letters/**. Words are not yours; layout is. First commit: the h2 string "eight pages, eight questions." becomes sentence case in source (drop the first-letter:uppercase mask). The eight-pages grid: ≥1280 a 2×4 hairline grid, question in the display face at the .t-h3 tier, dek in .t-body ash; 768 two columns; phones a single stacked list where each row is a tap target with the question first; hairlines between only, no borders on all sides, no hover lift, no card kit. /questions disclosure rows: the <summary> is the whole tap target (≥56px on phone), the open marker is the hairline shifting from 12% white to pure, body at 34em, every <details> opens on print. /partnership three doors: full-width blocks, never side-by-side cards, at every width. /diligence and terms tables: real <table> on ≥768, term-over-value stack on phones with a hairline between pairs (display:grid on tr, header repeated as a .t-caption label); never a horizontally scrolling table. Run `npx tsx scripts/qa/regime.ts` against your dev server before returning; it must pass. Done when: every page you own passes at 320/393/768/1280/1920; rows operable by thumb and keyboard; tables stack; the grid at 1920 does not look like a card kit.
