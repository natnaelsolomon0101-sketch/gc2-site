# securities-counsel read — 3 Sep 2026, v4/every-screen (r1 merge)

Verdict: **share kit NOT SHIPPABLE** as of cc82237; site copy has one BLOCKING and four high findings. Word list (regime.ts) passes everywhere; these are the findings a word list cannot catch.

## Applied by the Conductor through the owning agents (counsel's rewrites, verbatim). Nate may revert any line.

| # | Where | Severity | Before | After | Owner |
|---|---|---|---|---|---|
| 1 | share kit: yield-curve, hero-headline cards | BLOCKING | unlabeled rising hairline + date | plot titled "U.S. Treasury par yield curve" in type; "Public market data. Not fund performance." beneath the source line; vertical exaggeration removed on the cards | sec-motion |
| 2 | share kit: every card | high | GC2 mark only | frame line in caption tier: "Informational only. Not an offer. girlscantrade2.com" | sec-motion |
| 3 | share kit: risk-framework card | high | attribution dropped | "— Investment Committee" restored | sec-motion |
| 4 | share kit: four-stages card | fidelity | tail-overlay block missing | lifted with the section | sec-motion |
| 5 | ContactBand.tsx (home "Inquiries") | BLOCKING | "We speak with a small number of aligned partners each year. Introductions are welcome." | "The firm is built for a small number of long-horizon relationships. Correspondence reaches us at the addresses below." | sec-firm |
| 6 | Footer.tsx (every route) | high | "Access to the fund is limited to qualified investors." | "Interests in the fund are offered only to investors who meet the eligibility requirements set out in the offering documents." | sec-chrome |
| 7 | diligence/page.tsx | high | "Audited financial statements … On request" row renders with no auditor | row gated on fund.providers.auditor !== null | sec-allocators |
| 8 | questions/page.tsx (largest drawdown) | high | "Ask in a conversation and you get the worst one, month by month…" | opens with the founding fact; see counsel text | sec-allocators |
| 9 | HeroV2 placeholder curve | high | invented ascending bézier | real <YieldCurve/> (sec-hero r1, in flight) | sec-hero |

## Left for Nate (medium; copy judgment)

- Feature.tsx statement: "…when the return arrives" → "if the return arrives" (counsel: forward-looking). Not changed: it is the firm's sentence.
- diligence: "Behind the gate" → "Direct to eligible investors" (contradicts /questions "there is no gate").
- questions: "What environment do you underperform in?" → "…would you expect to do badly in?"; "Fewer than the market would let us." → delete the sentence.
- partnership: "All three doors stay open" → "All three are structures the firm runs"; "what we would rather sell" → "which one we would rather run"; button "How to ask for an introduction" → "Why there is nothing to download".
- Site-wide habitual past tense: add one caption line to /firm and /diligence: "The firm was formed in September 2026. What is described here is the policy the firm operates under, not a record of periods it has run."

Counsel's full text is in the Conductor transcript; this file is the actionable digest. NOT LEGAL ADVICE — counsel reviews before production per the repo's own rule.
