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
 * eye lands first, and the wordmark is pinned to the foot as a signature —
 * `justify-between` on purpose, not `items-center` on the whole block, which
 * would park everything in the dead middle of the screen with no reason to
 * be there.
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
            <div className="mt-12">
              <Button href="/">Return home</Button>
            </div>
          </div>
          {/* self-start: without an align-items on the flex-col parent above,
              a direct flex-column child stretches to the container's full
              cross-axis width by default — that is what made the wordmark's
              own <a> measure 1132px wide. This wrapper is the flex item
              instead, so it takes its content's width and the anchor inside
              goes back to being an ordinary inline element sized to "GC2".

              The anchor's height (24px, under the 44px tap-target floor)
              is NOT fixed here: Wordmark.tsx sets no className prop through
              which a parent can pad it, and it is sec-chrome's file, not
              this row's — routed to the Conductor rather than edited here. */}
          <div className="self-start">
            <Wordmark />
          </div>
        </div>
      </Container>
    </section>
  );
}
