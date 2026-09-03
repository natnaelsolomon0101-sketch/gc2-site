/* Open Graph card for a note. Unlike the sixteen static routes this one has no
   copy of its own: the title and the dek come out of `src/content/notes.ts`,
   the same index `generateMetadata` reads, so a note can never share with a
   title that disagrees with its page. `generateStaticParams` mirrors the page's
   so every note's card is built, not rendered on demand. */
import { notFound } from "next/navigation";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/viz/og";
import { notes } from "@/content/notes";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateImageMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  return [{ id: "note", size: OG_SIZE, contentType: OG_CONTENT_TYPE,
            alt: note ? `${note.title} — ${note.dek}` : "" }];
}

export default async function Image(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();
  return ogImage({ title: note.title, description: note.dek });
}
