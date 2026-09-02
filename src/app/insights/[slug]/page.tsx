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
    <article>
      <Container>
        <div className="section-y">
          <div className="measure-prose mx-auto">
            <p className="t-mono text-fog">
              {note.category}
            </p>
            <h1 className="t-article-title mt-6">
              {note.title}
            </h1>
            <p className="t-small mt-6 text-fog">{formatDate(note.date)}</p>
          </div>

          <div className="mt-12">
            <Prose><Body /></Prose>
          </div>

          <p className="t-small measure-prose mx-auto rule-t mt-16 pt-6 text-fog">
            This note is commentary from the desk. It is not investment advice and does
            not describe any position the fund holds.
          </p>

          <nav aria-label="More notes" className="measure-prose mx-auto rule-t mt-12 flex justify-between gap-6 pt-6">
            {prev
              ? <Link href={`/insights/${prev.slug}`} className="t-small link inline-flex min-h-11 items-center">{prev.title}</Link>
              : <span />}
            {next
              ? <Link href={`/insights/${next.slug}`} className="t-small link inline-flex min-h-11 items-center">{next.title}</Link>
              : <span />}
          </nav>
        </div>
      </Container>
    </article>
  );
}
