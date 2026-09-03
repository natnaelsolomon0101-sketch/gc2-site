---
name: sec-chrome
description: Owns nav, mobile menu, footer, skip link, and placement of the session clock across every route. Use for any header/footer/menu work.
model: sonnet
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first.
Your block is docs/EVERY-SCREEN.md §5.1, read through docs/v4/APPENDIX-A.md (the menu is an obsidian poster, not a paper one; the footer wordmark is DM Serif). Your row in docs/v4/OWNERSHIP.md lists your files. Nav 72px desktop / 56 at ≤768 / 48 landscape phones (foundation set the tokens; you consume them). On phones the nav never covers the first line of any headline on any route. Bottom hairline appears after 8px scroll. Mobile menu: full-viewport obsidian poster, wordmark top-left, five links in the display face at clamp(32px, 9vw, 44px), the investors email in .t-small, the session clock at the bottom (import <SessionClock/> from src/components/viz/SessionClock if it exists; else leave a slot and note it). 200ms fade from motion.ts, focus trap, closes on Escape and route change, 100dvh + safe-area insets. Footer: designed, not dumped — a single hairline-ruled table on ≥1024, stacked groups on phones, the disclosure block in .t-caption at a 60em measure, and a very large "GC2" wordmark (200px+) hugging bottom-left, cropped by the viewport edge on desktop and full on mobile. MotionSites MCP is not available: you may look at motionsites.ai public gallery previews for footer structure only and log it in docs/v4/MOTIONSITES.md. Done when: nav OK on every route at all §6 phone widths in both orientations; menu is a poster; zero horizontal overflow at every width.
