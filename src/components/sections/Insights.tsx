import Link from "next/link";
import { notes, formatDate } from "@/content/notes";

/**
 * INSIGHTS — an editorial index, not a card grid.
 *
 * Shape: one lead note given the full width (serif title at display scale, with
 * its pull-quote lifted onto the section's single chromatic tile), then the two
 * remaining notes as type-led hairline rows carrying their own quotes. The
 * reader can read three real sentences of the firm's thinking before deciding
 * which piece to open — which is the job this section actually has.
 *
 * Quotes below are verbatim from the note bodies. Source file and line noted on
 * each. Nothing here is invented: no read times, no authors, no metrics.
 */
const QUOTES: Record<string, string> = {
  // src/content/notes/capacity-is-a-research-problem.mdx, lines 14–15
  "capacity-is-a-research-problem":
    "Nobody lies; the number simply drifts toward the one that lets the work continue.",
};

/* Every note needs its quote. Throws at module load rather than rendering a
   pair of empty quotation marks on the home page. */
for (const n of notes) {
  if (!QUOTES[n.slug]) {
    throw new Error(`Insights: no pull-quote for note "${n.slug}".`);
  }
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export default function Insights() {
  const [lead, ...rest] = notes;

  return (
    <section id="insights" className="wrap band">
      {/* masthead */}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <p className="t-mono">Insights</p>
          <h2 className="t-display-sm mt-6">Notes from the desk.</h2>
        </div>
        <p className="t-mono-xs max-w-xs text-fog">
          {notes.length === 1
            ? "One note. It argues a position we actually hold."
            : `${notes.length} notes. Each one argues a position we actually hold.`}
        </p>
      </div>

      {/* ---- lead note: full width, quote promoted to a chromatic tile ---- */}
      <Link
        href={`/insights/${lead.slug}`}
        className="group mt-14 block border-t border-steel pt-10 md:mt-20 md:pt-14"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col lg:col-span-7">
            <p className="t-mono-xs text-fog transition-colors duration-200 group-hover:text-iris-gleam motion-reduce:transition-none">
              <span className="text-ash transition-colors duration-200 group-hover:text-iris-gleam motion-reduce:transition-none">
                01
              </span>
              <span aria-hidden="true" className="px-3 text-fog">
                /
              </span>
              {lead.category}
              <span aria-hidden="true" className="px-3 text-fog">
                /
              </span>
              <time dateTime={lead.date}>{formatDate(lead.date)}</time>
            </p>

            <h3 className="mt-6 max-w-2xl font-display text-4xl leading-none tracking-tight text-cloud transition-colors duration-200 group-hover:text-pure md:text-6xl motion-reduce:transition-none">
              {lead.title}
            </h3>

            <p className="t-sub mt-7 max-w-md text-ash">{lead.dek}</p>

            <span className="t-mono-xs mt-8 inline-flex min-h-11 items-center gap-3 text-pure lg:mt-auto lg:pt-10">
              Read the note
              <Arrow />
            </span>
          </div>

          <figure className="tile flex flex-col justify-between bg-iris-gleam lg:col-span-5">
            <blockquote className="font-display text-2xl leading-tight tracking-tight text-void md:text-3xl lg:text-4xl">
              &ldquo;{QUOTES[lead.slug]}&rdquo;
            </blockquote>
            <figcaption className="t-mono-xs mt-10 text-obsidian">
              From the note
            </figcaption>
          </figure>
        </div>
      </Link>

      {/* ---- the rest: type-led hairline rows. Absent, not empty, when the
           index is a single note — an empty bordered box reads as a note that
           failed to load. ---- */}
      {rest.length ? (
      <div className="mt-12 md:mt-16">
        {rest.map((n, i) => (
          <Link
            key={n.slug}
            href={`/insights/${n.slug}`}
            className="group grid gap-x-12 gap-y-5 border-t border-steel py-9 lg:grid-cols-12 lg:py-11"
          >
            <p className="t-mono-xs text-fog transition-colors duration-200 group-hover:text-iris-gleam lg:col-span-3 motion-reduce:transition-none">
              <span className="text-ash transition-colors duration-200 group-hover:text-iris-gleam motion-reduce:transition-none">
                {`0${i + 2}`}
              </span>
              <span aria-hidden="true" className="px-3 text-fog">
                /
              </span>
              {n.category}
              <span className="block pt-1">
                <time dateTime={n.date}>{formatDate(n.date)}</time>
              </span>
            </p>

            <div className="lg:col-span-5">
              <h3 className="font-display text-2xl leading-tight tracking-tight text-cloud transition-colors duration-200 group-hover:text-pure md:text-3xl motion-reduce:transition-none">
                {n.title}
              </h3>
              <p className="t-small mt-3 max-w-md">{n.dek}</p>
            </div>

            <blockquote className="border-l border-iris-gleam pl-5 font-display text-lg leading-snug text-ash lg:col-span-4">
              &ldquo;{QUOTES[n.slug]}&rdquo;
            </blockquote>
          </Link>
        ))}
      </div>
      ) : null}

      {/* closing rule + index link */}
      <div className={`flex justify-end border-t border-steel ${rest.length ? "pt-6" : "mt-12 pt-6 md:mt-16"}`}>
        <Link
          href="/insights"
          className="t-mono-xs group inline-flex min-h-11 items-center gap-3 text-pure"
        >
          All notes
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
