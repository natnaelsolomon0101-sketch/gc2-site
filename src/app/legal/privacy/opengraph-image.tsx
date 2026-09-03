/* Open Graph card for `/legal/privacy`. The copy is this route's own `metadata.title` and
   `metadata.description`, repeated here because Next resolves page metadata and
   image routes independently — an image route cannot read the segment's
   `metadata` export. If the page's description changes, change it here too.
   Everything about how the card LOOKS lives in `src/components/viz/og.tsx`. */
import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE } from "@/components/viz/og";

const card = {
  title: "Privacy",
  description:
    "This site runs no analytics, sets no cookies of its own and has no form. What that leaves, and what happens to an email you send.",
};

export const alt = ogAlt(card);
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage(card);
}
