# Round 1 fixes

Round 1 scored 4.81 (round 0: 4.15), 0 high / 4 medium / 9 low.

| Finding | Severity | Action |
|---|---|---|
| Every link renders `ink`; the site is 100% achromatic | the round's headline finding | Fixed. `.link` was `ink` at rest and only became `ledger` on hover, so A.3's single accent never appeared at rest, and never at all on touch. Now `ledger #0F4C3A` at rest, `black` on hover. Verified: every `.link` samples `rgb(15,76,58)`. |
| Strategy row focus ring samples as ink | medium | Fixed, after a wrong first diagnosis. The compiled CSS was correct and the element did match `:focus-visible`. The cause: Tailwind v4 includes `outline-color` in `transition-colors`, so on rows carrying that utility the ring faded in from `currentColor` over 150ms. Both the critic's screenshot and my first probe sampled it mid-fade. The ring now has `transition: none` and is ledger on the first frame; the harness also waits 260ms before focus captures. |
| /firm header surface has zero contour pixels at 390 | medium | Fixed. `PageHeader` still carried `hidden md:block`, the same defect fixed on the home hero in round 0. Renders at 390 (234px wide, 0.4 opacity). |
| LCP 2.3s vs A.9's 1.5s | found by the builder, not the critic | Open, logged. See below. |

## LCP: a wrong fix, reverted

I assumed the hero fade was gating LCP, because an element at `opacity: 0` is
not counted as painted, and I had fixed exactly that bug earlier in this
engagement. I changed the headline to rise without fading. **LCP went up, to
2.8s.** The hypothesis was wrong and the change was reverted, since it deviated
from A.6's "fade+rise" for no benefit.

Measuring the element instead of guessing showed the real LCP candidate is the
surface SVG: 240k px2 of painted area. `fetchPriority="high"` plus a preload did
not move it either. The cost is decoding ~40 contour paths under Lighthouse's 4x
CPU throttle, and A.6 mandates the ~40 isolines. Thinning the visual to win a
metric would break the spec to satisfy a number, so it stays open: CLS is 0 and
the Lighthouse performance score is 96-100, which clears the §5.2 gate.

## Two measurement errors worth recording

Both times I nearly filed a defect that did not exist:
- The nav active underline reads as `text-decoration: none` because it is a
  `border-bottom`. It was correct.
- The sticky header appears to have a 1px border at scroll 0, because the width
  stays 1px and only the colour changes transparent -> hairline. That is the
  right way to avoid layout shift. It was correct.

Measuring the wrong property looks exactly like a bug. Both were verified
against the source before being dismissed.
