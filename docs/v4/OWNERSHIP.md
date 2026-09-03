# v4 ownership — the Ten, mapped to the files that exist

EVERY-SCREEN.md §5 names folders (`sections/hero/**`) this repo does not have.
This is the binding map. Ownership is absolute: an agent edits nothing outside
its rows and asks the Conductor for anything else. Two agents never own one
file. A file not listed is owned by the Conductor and frozen.

| Agent | Owns (paths relative to repo root) | Routes for the matrix slice |
|---|---|---|
| foundation (phase 0, runs first, then dissolves) | `src/app/layout.tsx` (metadata, viewport), `src/config/site.ts` (domain), `src/app/globals.css` (fluid tokens, container-query base, hover gating, `dvh`), `src/lib/motion.ts` (skeleton), `src/components/Section.tsx`, `src/components/Container.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `vercel.json` | all |
| sec-chrome | `src/components/sections/SiteNav.tsx`, `src/components/Nav.tsx`, `src/components/MobileNav.tsx`, `src/components/Footer.tsx`, `src/components/Wordmark.tsx`, `src/config/nav.ts`; in `src/app/layout.tsx` ONLY the skip link and the `<Nav/>`/`<Footer/>` slots | every route (nav + footer) |
| sec-hero | `src/components/sections/HeroV2.tsx`, `src/components/sections/HeroTicker.tsx` (unshipped: delete), `src/components/sections/Atmosphere.tsx`, `src/components/sections/BloomField.tsx` (unshipped: delete or ship), `src/components/sections/MarketsBand.tsx` (unshipped: delete) | `/` |
| sec-framework | `src/components/sections/Feature.tsx`, `src/components/Statement.tsx`, `src/components/FactsRow.tsx`; in `src/app/page.tsx` ONLY the inline "Risk is not the price of return" band (remove it; the band lives in Feature) | `/` |
| sec-strategies | `src/components/sections/Strategies.tsx`, `src/components/PinnedStrategies.tsx` (unshipped: delete), `src/components/ui/Tile.tsx`, `src/components/ui/Tile.module.css`, `src/app/strategies/**`, `src/content/strategies.ts` (shape only, never the words) | `/`, `/strategies` |
| sec-approach | `src/components/sections/Approach.tsx`, `src/app/governance/**` | `/`, `/governance` |
| sec-insights | `src/components/sections/Insights.tsx`, `src/app/insights/**`, `src/components/Prose.tsx`, `src/content/notes.ts`, `src/content/notes/**`, `mdx-components.tsx` | `/`, `/insights`, `/insights/capacity-is-a-research-problem` |
| sec-allocators | `src/components/sections/ForAllocators.tsx`, `src/components/HairlineList.tsx`, `src/app/partnership/**`, `src/app/diligence/**`, `src/app/questions/**`, `src/app/access/**`, `src/app/letters/**` | `/`, `/partnership`, `/diligence`, `/questions`, `/access`, `/letters` |
| sec-firm | `src/app/firm/**`, `src/app/team/**`, `src/app/contact/**`, `src/components/sections/ContactBand.tsx`, `src/components/PageHeader.tsx` | `/firm`, `/team`, `/contact` |
| sec-legal | `src/app/legal/**`, `src/app/disclosures/**`, `src/app/tearsheet/**`, `src/app/not-found.tsx`; in `src/app/globals.css` ONLY the `@media print` block | `/legal`, `/legal/terms`, `/legal/privacy`, `/disclosures`, `/tearsheet`, `/does-not-exist` (404) |
| sec-motion | `src/lib/motion.ts` (after foundation), `src/components/viz/**`, `src/app/opengraph-image.tsx` and every `src/app/**/opengraph-image.tsx`, `src/app/**/twitter-image.tsx`, `scripts/share-kit.ts`, `scripts/qa/sources.ts`, `public/share/**`, `src/components/ui/Reveal.tsx`, `src/components/ui/Reveal.module.css`, `docs/v4/og/**` | every route (OG), `/` (curve) |
| viewport-runner | `scripts/qa/matrix.ts`, `scripts/qa/contact-sheet.ts`, `docs/v4/shots/**` | — |
| Conductor | everything else: `docs/v4/*.md`, `.claude/agents/**`, `package.json` scripts, `scripts/qa/*` not listed above | — |

## Cross-section objects, and who builds them

- **SessionClock** (`src/components/viz/SessionClock.tsx`): sec-motion builds;
  sec-chrome places it in the nav/menu/footer; sec-hero removes the old
  `--:--:--` clock from HeroV2 once the new one exists.
- **YieldCurve** (`src/components/viz/YieldCurve.tsx`): sec-motion builds with
  ISR; sec-hero consumes. Until it lands, sec-hero composes the hero with a
  `<YieldCurve/>` slot and a static placeholder SVG of the same aspect.
- **The statement object** (one way to emphasize a sentence): sec-framework
  defines it in `Statement.tsx`; sec-insights imports it for pull quotes.
  sec-insights does not fork it.
- **globals.css** is frozen after foundation. A section that needs a token
  asks the Conductor, who routes it to foundation (re-opened for that one
  change) or adds it.
- **page.tsx** section order is the Conductor's. sec-framework's single
  permitted edit is deleting the inline band.

## Dev servers

Each worktree runs its own `next dev` on its own port so screenshots never
cross: foundation 3100, chrome 3101, hero 3102, framework 3103, strategies
3104, approach 3105, insights 3106, allocators 3107, firm 3108, legal 3109,
motion 3110. The integration build serves on 3000.
