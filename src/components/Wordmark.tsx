import Link from "next/link";
import { site } from "@/config/site";

/* LIGHT PASS (round 4): the wordmark is ink on the page ground; `onBlack`
   is the one legitimate inverted case (§ `.card-invert`, DESIGN.md
   "Controls") — ground text on an ink surface, not a separate colour. */
export default function Wordmark({ onBlack = false }: { onBlack?: boolean }) {
  return (
    <Link href="/" aria-label={`${site.mark} home`}
      className={`t-wordmark ${onBlack ? "text-ground" : "text-ink"}`}>
      {site.mark}
    </Link>
  );
}
