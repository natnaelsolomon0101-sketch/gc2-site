# MotionSites log

**MCP status: NOT CONNECTED.** The MotionSites MCP requires a browser OAuth
that only Nate can complete. Decision on 3 Sep 2026: proceed without it.
Per EVERY-SCREEN.md §3.3, agents may read public gallery previews on
motionsites.ai for structural ideas only: no login, no prompt text.

| Prompt slot | Intended for | Status | What was kept | What was stripped |
|---|---|---|---|---|
| 1 — hero | sec-hero | not spent (MCP absent) | | |
| 2 — footer | sec-chrome | not spent (MCP absent) | | |
| 3 — features/list | sec-strategies | not spent (MCP absent) | | |

Agents append rows below when they consult the public gallery.

## sec-chrome, round 0 — footer (slot 2)

Browsed the public gallery at motionsites.ai (no login, no prompt text) via
`/browse`. Filtered to the Fintech category and opened the free preview cards
for **Wealthcore** and **Crypto Vault** — the closest tonal match to a private
investment partnership. Both preview panels stop at the hero crop; the free
tier does not scroll a card to its footer, so no footer structure was
actually visible to compare against (a real limit of the free/no-login tier,
not a skipped step). What *was* visible: both heros are a two-column
dashboard layout (headline + CTA left, a muted line-chart "card" right,
labeled "Real-time drift detection" / a portfolio split) — same idea sec-hero
is already doing with the yield curve, not new information for the footer.

**Kept:** nothing borrowed — no footer reference was reachable at this tier.
**Stripped:** n/a.
**Decision:** the footer built this round (hairline-ruled link table,
`.t-caption` disclosure, oversized bottom-left "GC2" wordmark) comes straight
from EVERY-SCREEN.md §5.1 / sec-chrome.md, not from a MotionSites structural
idea. If the MCP is ever connected, footer prompt 2 is still unspent and
should be read before the next footer pass.

## sec-chrome, round 6 — nav (owner-pasted prompts, not the MCP)

Prompts pasted directly by the owner (not fetched via the MCP, which is
still not connected): **"Velorah"** and **"Vibrant Wellness"**. Both use a
floating `.liquid-glass` nav -- a rounded-full pill (white at ~35% opacity,
`backdrop-filter: blur`, an inset highlight, a gradient hairline ring) that
sits with no bar background over a fullscreen hero/media background until
the page scrolls, at which point the bar gains a solid ground and a
hairline.

**Kept:** the glass-pill nav structure (wordmark left / links in a
centered rounded-full pill / CTA as a second glass pill), the glass
treatment carried onto the mobile burger as a 44px glass circle, the
transparent-until-8px-scroll bar behavior, and the general choreography of
"chrome floats over the hero, then commits to a surface." Kept the
fade-rise stagger idea in spirit (nothing new added here -- the hero's own
load choreography is sec-hero's file) and the "fullscreen media background
as structure" idea in the sense that the glass pills are designed to sit
over whatever the hero renders, not to assume a particular hero visual.

**Stripped:** Velorah's navy theme and Vibrant Wellness's stock video
background and avatar imagery -- neither is a token this site has; the
glass fill is white-at-low-opacity translated onto the paper canvas
(DESIGN.md's ground/ink tokens), not a new colour. Stripped all wellness
/ lifestyle copy -- words on this site come from `src/config` and existing
content only. Stripped any chromatic accent on the pills or the burger:
LIGHT-PASS.md bans accent colour in the chrome entirely, so the gradient
ring uses the site's own hairline ink-alpha (`rgba(20,19,17,.28→0→.28)`),
not a colour from either prompt.

**Where it shipped:** `src/components/sections/SiteNav.tsx`, gated on
`pathname === "/"` -- inner routes keep the plain bar from earlier rounds,
unchanged. Screenshots: `docs/v4/shots/r6-chrome/home--{393,768,1280,1920}
--scroll{0,200}.png`.
