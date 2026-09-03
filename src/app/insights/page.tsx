import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import RevealLines from "@/components/ui/RevealLines";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import YieldSurface from "@/components/viz/YieldSurface";
import { css } from "@/lib/css";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes from the desk",
  // Round 5 (Google presence audit, docs/v4/GOOGLE-PRESENCE.md): was 66
  // chars, under Google's ~110-char sweet spot. Extended with the page's own
  // lead sentence — the same "argues a position" line the home Insights
  // section already uses (src/components/sections/Insights.tsx), restated
  // in the third person rather than re-describing the section from scratch.
  description:
    "Commentary from the desk on regime, risk, convexity, and capacity. Each note argues a position the firm actually holds, not a general market view.",
  // Round 3: /feed.xml (src/app/feed.xml/route.ts) is the same title and
  // description, syndicated. `alternates.types` is what actually emits
  // <link rel="alternate" type="application/rss+xml">.
  //
  // Round 5: setting `alternates` at all here REPLACES the root layout's
  // `alternates.canonical: "./"` (src/app/layout.tsx) rather than merging
  // with it — Next only shallow-merges metadata objects one level deep, and
  // `alternates` is itself an object, so this page's `alternates.types` was
  // silently dropping the root's `alternates.canonical`. Verified in the
  // built HTML: /insights had no <link rel="canonical"> at all while every
  // route that leaves `alternates` unset does. `canonical: "./"` restores
  // it here explicitly.
  alternates: { canonical: "./", types: { "application/rss+xml": "/feed.xml" } },
};

/* ===========================================================================
   /insights — the index, rebuilt in the 21st "Editorial Image Hero" (19077)
   structure named in docs/v4/refs/21st/editorial-image-hero.md: a top-aligned
   tagline paired with a right-set serif headline, then a full-width plate
   below. Translated, not transplanted (TRANSFORM.md): the "landscape image"
   slot is not a photo — this site owns no photography — it is the static wire
   <YieldSurface/>, the same term-structure landscape the hero and the
   framework section already use as their ground, drawn once as a flat plate
   with no rAF (`static`) since this is an inner page, not the first screen.

   PageHeader (sec-firm's file, OWNERSHIP.md) is not used here: this page gets
   its own header in the Editorial Image Hero's two-column shape rather than
   PageHeader's single centred column, so it no longer imports it.

   The headline keeps its exact words ("Notes from the desk.") and picks one
   operative word to set in italic deep-iris, per TRANSFORM rule 2, through
   RevealLines rather than a plain <h1> — the mask-reveal is this page's own
   load motion, the same primitive the hero uses for its own line.

   The note rows below are Glass panes wrapped in Tilt (rule 4: "objects
   float") in place of the old plain hairline rows; the row content, dates and
   categories are unchanged. ========================================================================= */

const CSS = css`
/* the plate: full-bleed regardless of the page's own max-width, the caption
   pulled back to the page's own gutter so it reads with the rest of the
   column instead of running to the browser edge. */
.ins-idx-plate{position:relative;width:100%;margin-block:48px;}
.ins-idx-plate .ys-source{
  max-width:var(--page-max,1200px);margin-inline:auto;padding-inline:24px;}
@media (min-width:768px){ .ins-idx-plate{margin-block:64px;} }

/* the headline's one italic word, per TRANSFORM rule 2. */
.ins-idx-head em{font-style:italic;color:var(--color-accent-deep-iris);}
/* RevealLines' mask assumes one authored, non-wrapping line per entry
   (its own doc comment: "each line sits in an overflow-hidden mask").
   .t-h1's fluid clamp still lets a two-word line wrap at the narrowest
   phones, and a wrapped second line would sit past the mask's one-line
   box and clip — so the clip is turned off for this headline specifically;
   the lines still fade and rise, they just no longer crop while doing it. */
.ins-idx-head span[class*="mask"]{overflow:visible;padding-bottom:0;margin-bottom:0;}
`;

export default function Insights() {
  return (
    <>
      <section className="pt-8 md:pt-16 lg:pt-24">
        <Container>
          <div className="grid-gc2 items-start gap-y-6">
            <p className="t-caption col-span-4 md:col-span-4">Insights</p>
            <div className="col-span-4 md:col-span-7 md:col-start-6">
              <RevealLines
                as="h1"
                className="t-h1 ins-idx-head"
                lines={["Notes from", <>the <em>desk</em>.</>]}
              />
            </div>
          </div>
        </Container>

        <style>{CSS}</style>
        <div className="ins-idx-plate">
          <YieldSurface mode="wire" static fit="natural" opacity={0.35} height={420} />
        </div>
      </section>

      <section>
        <Container>
          <div className="rule-t pb-16 md:pb-24">
            {notes.map((n) => (
              <Tilt key={n.slug} as="div" max={3} className="block">
                <Glass as="div" radius={16} className="my-4 overflow-hidden">
                  <Link
                    href={`/insights/${n.slug}`}
                    /* The row inherits ink-2, and the base `:focus-visible`
                       ring resolves against currentColor here, so the ring
                       came out ink-2 (7.55:1 — visible, but a different ring
                       from every other control on the site). Pinning it to
                       ink keeps it 17.04:1 and identical to the nav and the
                       prose links. */
                    className="group block px-6 py-7 transition-colors duration-[var(--dur-fast)] hover:bg-ground-2 focus-visible:outline-ink md:px-8"
                  >
                    <div className="grid-gc2 items-baseline">
                      <span className="t-small col-span-4 text-ink-3 md:col-span-2">
                        {formatDate(n.date)}
                      </span>
                      <span className="col-span-4 md:col-span-8">
                        <span className="t-h3 block">
                          {n.title}
                        </span>
                        <span className="t-body measure-body mt-2 block">{n.dek}</span>
                      </span>
                      <span className="t-mono-xs col-span-4 md:col-span-2">{n.category}</span>
                    </div>
                  </Link>
                </Glass>
              </Tilt>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
