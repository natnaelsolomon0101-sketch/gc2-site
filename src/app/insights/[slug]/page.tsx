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

  /* Article measure per §5.6: clamp(20em, 90vw, 36em), not the site-wide
     680px .measure-prose (shared with the legal/disclosures pages this
     section does not own) — kept local to this route rather than touching
     the shared token. */
  const measure = "max-w-[clamp(20em,90vw,36em)]";

  return (
    <article>
      <Container>
        {/* The baseline shot (docs/v4/shots/baseline/insights_capacity-is-a-
            research-problem--393--fold.png) showed ~180px of dead air between
            the nav and the eyebrow on phones before the title itself ever
            appeared — the opposite of a poster. `section-y`'s fixed 80px top
            is shared by every inner route; this route tightens only its own
            top offset (pt-8 vs. section-y's pt-20) so the headline lands in
            the first screen at 393, and keeps the same 80px bottom rhythm
            (pb-20) and desktop top (md:pt-20) as every other route. */}
        <div className="pb-20 pt-8 md:pt-20">
          <div className={`${measure} mx-auto`}>
            <p className="t-mono text-ink-3">
              {note.category}
            </p>
            <h1 className="t-article-title mt-6">
              {note.title}
            </h1>
            <p className="t-small mt-6 text-ink-3">{formatDate(note.date)}</p>
          </div>

          <div className="mt-12">
            <Prose><Body /></Prose>
          </div>

          <p className={`t-small ${measure} mx-auto rule-t mt-16 pt-6 text-ink-3`}>
            This note is commentary from the desk. It is not investment advice and does
            not describe any position the fund holds.
          </p>

          <nav aria-label="More notes" className={`${measure} mx-auto rule-t mt-12 flex justify-between gap-6 pt-6`}>
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
