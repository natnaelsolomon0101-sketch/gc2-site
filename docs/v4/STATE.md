# v4 STATE — where the site stands, verified 3 Sep 2026

Verified by the Conductor from a fresh `next build` + `next start` of
`redesign/origin-100k` (HEAD e442a01), screenshots in `docs/v4/shots/baseline/`
at 320 / 393 / 768 / 1280 / 1920 / 3440, and `curl` against the live domain.

## Corrections to EVERY-SCREEN.md §0 (read these first)

1. **The site is the DARK Origin system, not paper.** `docs/BUILD100K.md`
   records the client's decision. `docs/ORCHESTRATION.md`, `docs/SWARM.md`,
   `docs/ALLOCATOR.md`, `docs/ENV.md` do not exist in this repo on any branch.
   Their roles are filled by `docs/v4/APPENDIX-A.md` (tokens), `DESIGN.md`,
   `docs/v4/OWNERSHIP.md` (agent mechanics), `scripts/qa/regime.ts` (the
   506(b) word list), and the three critics in `.claude/agents/`.
2. **Base branch is `redesign/origin-100k`, not `main`.** `main` is 99 commits
   behind and is the pre-redesign site. `v4/every-screen` is cut from
   `redesign/origin-100k`.
3. **§0.2 item 7 is resolved:** `theme-color: #0f1011` is correct for a dark
   canvas. No change.
4. **gc2.fund has no DNS.** `dig gc2.fund` returns nothing. The 308 from the
   secondary domain cannot be proven with `curl -I` until the domain resolves
   somewhere; it is logged as an open item for Nate, not a gate failure.
5. **MotionSites MCP is not connected** (needs Nate's browser OAuth; skipped by
   decision). §3.3 fallback applies: public gallery only, logged in
   `docs/v4/MOTIONSITES.md`. **21st MCP is registered** for this project.
6. **A stale `next-server` (pid 99755) was holding port 3000** from an earlier
   session and serving a build whose CSS 500'd. Killed. Any earlier
   screenshot of "unstyled nav / white page" was that server, not the site.

## §0.1 confirmed right

Name "Girls Can Trade 2", mark "GC2". 18 routes prerender. Allocator layer
exists (`/team /partnership /diligence /governance /letters /tearsheet
/questions /access`). Four-stage "How an idea earns capital" is there. No
placeholder metrics, ticker, phone or address. Nothing here gets thrown out.

## §0.2 regressions, each verified

| # | Item | Verified | Owner |
|---|---|---|---|
| 1 | canonical `https://gc2.fund` on every page, `og:url` too | YES — `src/config/site.ts` `domain: "gc2.fund"`; `metadataBase` derives from it | foundation |
| 2 | no `og:image` | YES — no `opengraph-image.tsx` anywhere; `twitter:card` is `summary_large_image` | sec-motion (first commit) |
| 3 | "Risk is not the price of return…" twice on home | YES — once as the purple card inside `Feature.tsx`, once as the inline `card-lite` block in `page.tsx` after Strategies. **Decision: keep the Feature instance** (it sits beside "Correlated risk…" where it belongs); delete the inline block. | sec-framework |
| 4 | numerals on non-sequences | YES — `01/02/03` on the hero facts list (HeroV2, 393 only), `pad()` numerals on strategies (`Strategies.tsx:63`), `01` on the insights row (`Insights.tsx:75`). Stage numerals in Approach stay. | sec-hero, sec-strategies, sec-insights |
| 5 | `eight pages, eight questions.` lowercase h2 | YES — source string is lowercase, masked by `first-letter:uppercase` in `ForAllocators.tsx:113`. Fix the string. | sec-allocators |
| 6 | `--:--:-- ET` in server HTML | YES — `HeroV2.tsx:574` renders `time ?? "--:--:--"`. Render nothing until hydrated; SessionClock replaces it. | sec-hero (remove) / sec-motion (SessionClock) |
| 7 | theme-color | RESOLVED, no change | — |
| 8 | dates | Checked: `site.foundedLabel = "September 2026"` is the single source; `grep 2019` in src is empty. Agents re-verify on the pages they own. | all |

## What the Conductor sees in the baseline

- **393 (poster):** wordmark, facts strip with live clock, two-line headline,
  a row of five chromatic tiles that runs off the right edge (reads as
  cut, not bled), a numbered 3-row facts list, lead, two buttons. Everything
  above the 852 fold. Closer to a poster than the doc assumed; the tile row
  and the numerals are what break it.
- **320:** different composition (no tile row, no facts list), fits the 568
  fold with both buttons. Facts strip stacks to four mono lines — heavy.
- **768 portrait:** a stretched phone. Desktop nav, phone hero. "Tablets are
  not big phones" fails.
- **1920 (frame):** 1200 container centered; left third of the viewport is
  empty obsidian; the five vertical striped tiles fill the right and bleed.
  Hero ~950px tall. Facts strip is a full-width band under the nav.
- **3440:** the whole composition is a card in the middle of a wall; type
  is desktop size; only the tiles bleed. "Business card on a wall" confirmed.
- **Full home at 393 is 8,443px tall (~10 viewports).** Strategies is six
  full-height chromatic tiles stacked. Feature is a pink gradient card + a
  purple card. Then the duplicate lite card, Approach, Insights, Allocators
  grid, Contact, Footer.
- **Zero horizontal overflow** at all six widths on all five sampled routes.
