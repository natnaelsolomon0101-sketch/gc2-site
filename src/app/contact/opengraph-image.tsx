/* Open Graph card for `/contact`. The copy is this route's own `metadata.title` and
   `metadata.description`, repeated here because Next resolves page metadata and
   image routes independently — an image route cannot read the segment's
   `metadata` export. If the page's description changes, change it here too.
   Everything about how the card LOOKS lives in `src/components/viz/og.tsx`. */
import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE } from "@/components/viz/og";

const card = {
  title: "Contact",
  description:
    "Two published addresses and no form. Which one to use if you are an allocator, an existing investor, a journalist, or a counterparty, and what each can and cannot do.",
};

export const alt = ogAlt(card);
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage(card);
}
