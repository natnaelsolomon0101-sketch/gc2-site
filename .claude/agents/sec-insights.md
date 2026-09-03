---
name: sec-insights
description: Owns the notes list on home, /insights, and the article template with marginalia and footnotes.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 100
---
Read .claude/agents/_section-preamble.md first.
Your block is §5.6 through APPENDIX-A.md. Files: Insights.tsx, src/app/insights/**, Prose.tsx, src/content/notes.ts, src/content/notes/**, mdx-components.tsx. First commit: the "01" numeral on the insights row comes off. Article: measure clamp(20em, 90vw, 36em); body 18/1.7 desktop, 17/1.65 phone; title fluid (.t-article-title is now clamp()); marginalia in the left margin at ≥1280, inline <details> below that; footnotes with the one permitted ↩. Pull quotes ("Nobody lies; the number simply drifts…") use the shared Statement object from src/components/Statement.tsx (sec-framework owns it; import, do not fork; if it is not there yet, leave a TODO and use the same classes). The notes list on home: one note, one row, full width, presented with confidence. Done when: article reads at 320 with no horizontal overflow, at 200% zoom on 1280, and at 1920 with marginalia; the 393 article is a poster.
