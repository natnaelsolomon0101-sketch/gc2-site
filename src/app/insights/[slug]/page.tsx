import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";
import Container from "@/components/Container";
import Prose from "@/components/Prose";
import RevealLines from "@/components/ui/RevealLines";
import { css } from "@/lib/css";
import { site, siteUrl } from "@/config/site";
import { notes, formatDate } from "@/content/notes";

/* RevealLines' mask assumes one authored, non-wrapping line per entry (its
   own doc comment: "each line sits in an overflow-hidden mask"). A note
   title is prose from src/content/notes.ts, not hand-split into lines, and
   it wraps across two or three lines inside the article's own narrow
   measure at every width this route ships — the mask's one-line box would
   clip everything past the first. The clip is turned off for the title
   specifically; it still fades and rises in, it just no longer crops
   while doing it. */
const TITLE_CSS = css`
.note-title span[class*="mask"]{overflow:visible;padding-bottom:0;margin-bottom:0;}
`;

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

/* Reading time for the caption line. Derived, not authored: it reads the
   note's own .mdx source (the same file the body import below compiles),
   strips markup and counts words at 200wpm. No number here is invented — it
   is arithmetic on the words already on the page — and a note that changes
   length changes its own reading time on the next build with no one having
   to remember to update a byline. */
async function readingMinutes(slug: string): Promise<number> {
  const file = path.join(process.cwd(), "src", "content", "notes", `${slug}.mdx`);
  const raw = await fs.readFile(file, "utf8");
  const text = raw.replace(/<[^>]*>/g, " ").replace(/[#>*`_[\]()-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* Round 3 verified: title and description are the note's own title and dek,
   nothing else — no site-name suffix duplicating the root layout's `%s —
   ${site.name}` title template, no invented summary. */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.dek,
    // Round 5 (Google presence audit): setting `alternates` here replaces
    // rather than merges with the root layout's `alternates.canonical: "./"`
    // (Next shallow-merges metadata one level deep, and `alternates` is
    // itself an object) — every note page was emitting no <link
    // rel="canonical"> at all. "./" is relative-to-pathname (same trick the
    // root layout uses), so it resolves to this exact article's own URL.
    alternates: { canonical: "./", types: { "application/rss+xml": "/feed.xml" } },
  };
}


/* Reading progress: a hairline of deep iris across the very top of the
   viewport that fills as the article scrolls. Scroll-driven and CSS only,
   the same mechanism as the hero's scroll-away; where animation-timeline is
   unsupported the line simply is not there. */
const PROGRESS_CSS = `
.note-progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:60;
  background:var(--color-accent-deep-iris);transform:scaleX(0);transform-origin:0 50%;
  pointer-events:none;display:none;}
@supports (animation-timeline: scroll()){
  .note-progress{display:block;animation:noteProgress linear both;
    animation-timeline:scroll(root block);}
}
@keyframes noteProgress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media print{.note-progress{display:none !important;}}
`;

export default async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = notes.findIndex((n) => n.slug === slug);
  if (idx === -1) notFound();
  const note = notes[idx];
  const prev = notes[idx + 1];
  const next = notes[idx - 1];

  const { default: Body } = await import(`@/content/notes/${slug}.mdx`);
  const minutes = await readingMinutes(slug);

  /* Article measure per §5.6: clamp(20em, 90vw, 36em), not the site-wide
     680px .measure-prose (shared with the legal/disclosures pages this
     section does not own) — kept local to this route rather than touching
     the shared token. */
  const measure = "max-w-[clamp(20em,90vw,36em)]";

  /* Round 3: Article JSON-LD. author is the Organization, not a person —
     no author is named anywhere on the site (README/AGENTS.md: never invent
     a person), so a Person author here would be the one invented fact this
     whole codebase is built to refuse. publisher.logo points at /logo.png,
     which sec-motion is adding in this same round; the URL is correct
     whether or not the file has landed yet in this exact build. */
  const articleUrl = `${siteUrl}/insights/${note.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.dek,
    datePublished: note.date,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  return (
    <article>
      <style>{PROGRESS_CSS}</style>
      <div className="note-progress" aria-hidden="true" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{TITLE_CSS}</style>
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
            <RevealLines as="h1" className="t-article-title mt-6 note-title" lines={[note.title]} />
            <p className="t-caption mt-6 text-ink-3">
              <time dateTime={note.date}>{formatDate(note.date)}</time>
              <span aria-hidden="true"> · </span>
              {minutes} min read
            </p>
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
