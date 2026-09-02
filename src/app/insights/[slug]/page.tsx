import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Prose from "@/components/Prose";
import { notes, formatDate } from "@/content/notes";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return {};
  return { title: note.title, description: note.dek };
}

export default async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = notes.findIndex((n) => n.slug === slug);
  if (idx === -1) notFound();
  const note = notes[idx];
  const prev = notes[idx + 1];
  const next = notes[idx - 1];

  const { default: Body } = await import(`@/content/notes/${slug}.mdx`);

  return (
    <article className="bg-paper">
      <Container>
        <div className="section-y">
          <div className="measure-prose">
            <p className="t-small text-slate">
              {formatDate(note.date)} &nbsp; {note.category}
            </p>
            <h1
              className="t-article-title mt-6 text-black"
            >
              {note.title}
            </h1>
          </div>

          <div className="mt-12">
            <Prose><Body /></Prose>
          </div>

          <p className="t-caption measure-prose rule-t mt-16 pt-6 text-slate">
            This note is commentary from the desk. It is not investment advice and does
            not describe any position the fund holds.
          </p>

          <nav aria-label="More notes" className="measure-prose rule-t mt-12 flex flex-col items-start gap-3 pt-6">
            {prev ? <Link href={`/insights/${prev.slug}`} className="t-small link">{prev.title}</Link> : <span />}
            {next ? <Link href={`/insights/${next.slug}`} className="t-small link">{next.title}</Link> : <span />}
          </nav>
        </div>
      </Container>
    </article>
  );
}
