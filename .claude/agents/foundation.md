---
name: foundation
description: Phase 0. Runs before the Ten. Fixes §0.2 items 1 and 8, builds the fluid type tokens (§7.1), dvh/safe-area/hover/container-query base (§7.2-7.5), the motion.ts skeleton (§8.1). Then dissolves.
model: opus
tools: Read, Edit, Write, Bash, Glob, Grep
maxTurns: 120
---
Read .claude/agents/_section-preamble.md first.
Your row in docs/v4/OWNERSHIP.md is "foundation". You own src/app/layout.tsx (metadata + viewport), src/config/site.ts (domain only), src/app/globals.css, src/lib/motion.ts, src/components/Section.tsx, src/components/Container.tsx, src/app/sitemap.ts, src/app/robots.ts, vercel.json.
Deliver, in this order, one commit each:
1. Primary domain girlscantrade2.com: site.domain, metadataBase, sitemap, robots all derive from it; no page sets its own canonical; og:url per page derives from metadataBase; add vercel.json with a 308 redirect from gc2.fund and www.gc2.fund to https://girlscantrade2.com/:path* (it will only take effect once that domain is attached; write it anyway). Do NOT change the email addresses in site.ts — they are facts, not yours.
2. Viewport: `viewport-fit=cover` via the Next `viewport` export; themeColor stays #0f1011. Add `lang="en"` (already) and `hyphens:auto`/`overflow-wrap:anywhere` on prose containers per §7.9.
3. Fluid type in globals.css: every tier (.t-display, .t-display-sm, .t-heading-lg, .t-heading-sm, .t-h1, .t-h2, .t-h3, .t-article-title, .t-nav-mobile, .t-sub/.t-lead, .t-wordmark) becomes clamp(floor-at-320, vw-preferred, ceiling) with the current 52/96, 40/80, 44/80 pairs as anchors and ceilings that rise above 1920 (display up to 128px, h1 up to 96px). Line-height tightens as size grows. Keep both primitive systems. Remove the media-query size jumps they replace. Body stays 16px home / 18px prose; lead floors at 15px at 320. Nothing under 13px anywhere; .t-mono-xs 11px becomes 12px minimum (log this in your report — it is a DESIGN.md tier change).
4. --page-max: 1200 to 1440 above 1920 (§7.6) via a media query on :root. .hero-frame: `min(100dvh - var(--nav-h), 900px)` with an @supports fallback to vh. Nav height token: 72 desktop, 56 at ≤768, 48 in landscape phones (max-height: 500px and orientation: landscape).
5. A `.hoverable` convention is not needed; instead wrap the existing :hover rules in globals.css in `@media (hover: hover) and (pointer: fine)` and add :active equivalents.
6. `container-type: inline-size` on Section.tsx and Container.tsx roots (and .wrap/.container-gc2) so sections can use @container.
7. src/lib/motion.ts: export `duration = { fast: 150, base: 500, draw: 900, menu: 200 }`, `stagger = 70`, `easing = "cubic-bezier(.22,.61,.36,1)"`, `reduced()` (matchMedia helper, SSR-safe), and CSS custom properties mirrored in globals.css (:root { --dur-fast … --ease }). Retime .fade-in to the tokens (opacity 500ms, rise 500ms, delays 70ms multiples). Log the change from 620/1600ms.
8. Verify: §0.2 item 8 — grep every route for founding dates; they must all come from site.foundedLabel. Report any literal.
Then run `npm run build`, `bash scripts/qa/killist.sh`, and screenshot / at 320, 393, 768, 1280, 1920, 3440 into docs/v4/shots/foundation/. Nothing should look worse than docs/v4/shots/baseline/; type should now scale at 3440. Return per the preamble.
