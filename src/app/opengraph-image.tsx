/* Open Graph card for `/`. The title is `site.mark`'s long form out of
   `src/config/site.ts` — the fund name is never a literal outside that file —
   and the description is the root layout's. The home card is the one card that
   is allowed more than the title: §5.10 puts the day's yield curve on it, drawn
   from the same fetch the page uses, so a share of the home page is dated. That
   arrives with `src/components/viz/YieldCurve.tsx`; until then it is the same
   card as every other route. */
import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE } from "@/components/viz/og";
import { site } from "@/config/site";

const card = {
  title: site.name,
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
};

export const alt = ogAlt(card);
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage(card);
}
