---
name: sec-legal
description: Owns /legal, /disclosures, /tearsheet, and the 404 page, plus the print block of globals.css.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 80
---
Read .claude/agents/_section-preamble.md first.
Your block is §5.9 through APPENDIX-A.md. Files: src/app/legal/**, disclosures/**, tearsheet/**, not-found.tsx, and ONLY the @media print block in globals.css. /legal and /disclosures at 320 and at 400% zoom on 1280: readable, 34em (60em legal) measure, no horizontal scroll; the three legal pages’ scoped screen font-size blocks go away in favour of tiers (print pt overrides may stay). /tearsheet: one page at A4 and Letter, verified with `npx tsx scripts/qa/print.ts`; on screen a paper-proportioned object centered with the print button beneath. 404: h1 "Not found.", one sentence, one link, the wordmark; composed as a phone poster. Done when: print.ts passes; 404 is a poster at 393; legal pages reflow at 320 / 400% zoom.
