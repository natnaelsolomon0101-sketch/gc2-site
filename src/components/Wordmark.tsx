import Link from "next/link";
import { site } from "@/config/site";

/* LIGHT PASS (round 4): the wordmark is ink on the page ground; `onBlack`
   is the one legitimate inverted case (§ `.card-invert`, DESIGN.md
   "Controls") — ground text on an ink surface, not a separate colour.

   ROUND 4 (Conductor): a flex-column parent stretches a direct block child
   to its own cross-axis width by default, and with no width/height rule of
   its own the anchor then sizes purely to its glyph -- 1132px wide inside
   /not-found's column, 43x33px once sec-legal wrapped it in a `self-start`
   div to fix the width. Fixing the tap target has to live here rather than
   at every call site: inline-flex with a real min-height/min-width floor,
   the glyph centred inside it rather than sized by it, so "GC2" stays
   whatever size `.t-wordmark` says while the CLICKABLE box is >=44x44
   regardless of how a parent lays it out. `className` is additive (layout
   only -- position, margin -- never a second color/size source) so a
   parent can still place the mark without fighting this file for it. */
export default function Wordmark({
  onBlack = false,
  className = "",
}: {
  onBlack?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.mark} home`}
      className={`t-wordmark inline-flex min-h-11 min-w-11 items-center justify-center ${onBlack ? "text-ground" : "text-ink"} ${className}`}
    >
      {site.mark}
    </Link>
  );
}
