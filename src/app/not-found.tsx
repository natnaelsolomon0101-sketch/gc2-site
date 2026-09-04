import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Wordmark from "@/components/Wordmark";
import RevealLines from "@/components/ui/RevealLines";
import YieldSurface from "@/components/viz/YieldSurface";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * 404 — the frame: an editorial "not found" line with pill actions, and
 * under it the same object the home page floats in its own frame — a
 * static wire <YieldSurface/> plate, `mode="wire"`, `static` (one frame, no
 * rAF, no observer) so a page that exists specifically to be a dead end
 * costs nothing to render. TRANSFORM.md rule 3 ("a ground behind the copy")
 * read literally: the plate sits under the copy rather than behind it,
 * because behind-and-readable at low opacity is what HeroV2 already does at
 * 100vh, and this is a much shorter frame.
 *
 * PRIOR COMPOSITION (kept in spirit, not in code): earlier rounds tuned this
 * page as a phone poster — h1/lead pinned high, the action pinned low,
 * `justify-between` spreading the gap between them, `min-h-[100dvh-navh]`
 * so nothing scrolled. That gap is exactly where the plate now lives: the
 * ~250px of empty ground a gstack QA pass flagged on a wide short desktop
 * viewport (ISSUE-003, see git history) is no longer empty, it is the
 * figure. The one-screen constraint comes out with it — a 420px plate does
 * not fit a poster built to avoid a scrollbar, and a 404 that scrolls a
 * little is a smaller cost than a 404 with no picture in it.
 *
 * Two actions, both pills (`border-radius:999px`, DESIGN's rationed shape
 * for a CTA): home, and contact — the two places a reader who hit a dead
 * end actually wants to go, matching HeroV2's own pair of pill actions
 * rather than inventing a new pattern for this one page.
 */
const CSS = `
.nf-h1 em{font-style:italic;color:var(--color-accent-deep-iris);}
.nf-actions{display:flex;flex-wrap:wrap;gap:12px;}
.nf-actions .btn,.nf-actions .btn-ghost{border-radius:999px;}
.nf-plate{position:relative;}
@media print{
  .nf-h1 em{color:var(--color-ink) !important;}
  .nf-plate{display:none !important;}
}
`;

export default function NotFound() {
  return (
    <section>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Container>
        <div className="pb-16 pt-16 md:pb-24 md:pt-24">
          <div>
            <RevealLines
              as="h1"
              className="t-h1 measure-head-sm nf-h1"
              lines={[<>Not <em>found</em>.</>]}
            />
            <p className="t-lead measure-lead mt-8 fade-in fade-2">
              The address you followed does not lead to a page on this site.
            </p>
            <div className="nf-actions mt-8 fade-in fade-3">
              <Link href="/" className="btn">
                Return home
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Contact us
              </Link>
            </div>
          </div>

          <div className="nf-plate mt-16 md:mt-20 fade-in fade-4">
            <YieldSurface mode="wire" static fit="natural" opacity={0.35} height={420} />
          </div>

          <div className="mt-16 md:mt-20">
            <Wordmark />
          </div>
        </div>
      </Container>
    </section>
  );
}
