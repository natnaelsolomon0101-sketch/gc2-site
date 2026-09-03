---
name: sec-framework
description: Owns the risk-framework statement, the facts row, and the single statement band on home.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 80
---
Read .claude/agents/_section-preamble.md first.
Your block is §5.3 through APPENDIX-A.md. Files: Feature.tsx, Statement.tsx, FactsRow.tsx, and in page.tsx ONLY the inline card-lite "Risk is not the price of return" block, which you delete in your first commit (Conductor decision: the Feature instance stays). Then: the "Correlated risk does not respect a mandate boundary" statement becomes the section’s poster — full-bleed abyss band, the sentence at .t-display-sm scale, left-aligned, columns 1–9; on phone 34px-class size, three lines maximum, no orphan. Any facts row you own becomes a 2×2 with a hairline cross at 320 and 375, labels never wrap, values in the display face. Statement.tsx becomes THE one object the site uses to emphasize a sentence (sec-insights will import it for pull quotes): display face, .t-display-sm scale, full measure, hairline above and below, no quote marks, no italics, no card. Remove the box-shadow in Feature.tsx (DESIGN.md drift) once the surface reads without it. Done when: one band; facts pass at 320; the statement is a standalone screenshot a family principal would forward.
