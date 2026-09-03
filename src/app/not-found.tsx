import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Wordmark from "@/components/Wordmark";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * 404 — composed as a phone poster (§5.9): the h1, one sentence, one link,
 * and the wordmark, nothing else. People screenshot 404s, so this is not a
 * cut-down version of an inner page — it is its own composition.
 *
 * The frame is exactly the viewport height minus the nav (`--nav-h`, set by
 * sec-chrome), so the whole thing sits inside the first screen on a phone
 * with no sliver of the footer bleeding into view. Top and bottom are
 * deliberately unequal: the message block sits high, near where a thumb's
 * eye lands first, and the action sits low, in the bottom third, right
 * above the wordmark — `justify-between` on the outer pair, on purpose, not
 * `items-center` on the whole block, which would park everything in the
 * dead middle of the screen with no reason to be there.
 *
 * thumb-critic, this round: the button used to sit right under the lead
 * paragraph, ~36% down the screen at 412 with the other 60% empty below it
 * before the wordmark. A right thumb reads the bottom third as the action
 * zone; a control stranded above a wall of empty ground reads as
 * unfinished, not deliberate. Moved into the same bottom group as the
 * wordmark instead of leaving it in the top block.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100dvh-var(--nav-h))] flex-col">
      <Container className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-between pb-12 pt-16 md:pb-16 md:pt-24">
          <div>
            <h1 className="t-h1 measure-head-sm">Not found.</h1>
            <p className="t-lead measure-lead mt-8">
              The address you followed does not lead to a page on this site.
            </p>
          </div>
          {/* items-start: without an align-items on the flex-col parent
              above, a direct flex-column child stretches to the container's
              full cross-axis width by default — that is what made the
              wordmark's own <a> measure 1132px wide two rounds ago. Setting
              it here, on the wrapper around both the button and the
              wordmark, keeps each shrink-wrapped to its own content and
              left-aligned rather than stretched, regardless of what the
              outer flex row does with this wrapper's own width. */}
          <div className="flex flex-col items-start gap-8">
            <Button href="/">Return home</Button>
            <Wordmark />
          </div>
        </div>
      </Container>
    </section>
  );
}
