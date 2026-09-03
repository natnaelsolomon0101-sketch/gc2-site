/* Open Graph card for `/legal`. The copy is this route's own `metadata.title` and
   `metadata.description`, repeated here because Next resolves page metadata and
   image routes independently — an image route cannot read the segment's
   `metadata` export. If the page's description changes, change it here too.
   Everything about how the card LOOKS lives in `src/components/viz/og.tsx`. */
import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE } from "@/components/viz/og";

const card = {
  title: "Legal",
  description:
    "Disclosures, terms of use and privacy. Three short documents covering this website, and a note on what governs everything else.",
};

export const alt = ogAlt(card);
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage(card);
}
