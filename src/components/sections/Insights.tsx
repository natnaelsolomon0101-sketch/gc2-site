import Link from "next/link";
import Statement from "@/components/Statement";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import RevealLines from "@/components/ui/RevealLines";
import { css } from "@/lib/css";
import { notes, formatDate } from "@/content/notes";

/**
 * INSIGHTS — the home section as a frame (TRANSFORM rule 1): min-height 80vh
 * on desktop, its two objects — the latest note and the pull quote — held at
 * the optical centre by a flex column on `justify-content:center` rather than
 * stacked from the top. Phones keep natural height (no min-height below
 * 1024px), so the frame never forces empty scroll on a short viewport.
 *
 * The lead note used to be a plain full-width text block; it is now a
 * <Glass> pane in a <Tilt> wrapper (rule 4: "objects float"), the same
 * object language HeroV2's other floating pieces use. The pull-quote keeps
 * setting through the shared <Statement> object (Cross-section objects,
 * OWNERSHIP.md) — sec-insights imports it, does not fork it — full-bleed
 * below the card, both centred together inside the one frame.
 *
 * The ground is the pale-iris wash, the same radial the hero draws
 * (TRANSFORM rule 3), at a lower peak alpha since this frame's copy sits on
 * a much smaller canvas than the hero's.
 *
 * Quotes below are verbatim from the note bodies. Source file and line noted
 * on each. Nothing here is invented: no read times, no authors, no metrics.
 */
const QUOTES: Record<string, string> = {
  // src/content/notes/capacity-is-a-research-problem.mdx, lines 16–17
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
      className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

const CSS = css`
.ins-frame{position:relative;isolation:isolate;overflow:hidden;
  display:flex;flex-direction:column;justify-content:center;
  background:var(--color-ground);}
@media (min-width:1024px){ .ins-frame{min-height:80vh;} }
/* .wrap carries container-type:inline-size (globals.css); as a flex item of
   this column flex frame that collapses to its padding alone under
   align-items:stretch (content-driven sizing under containment fighting the
   stretch pass) rather than filling the frame's width. width:100% forces
   the fill explicitly rather than relying on stretch through containment. */
.ins-frame > .wrap{width:100%;}
.ins-bg{position:absolute;inset:0;pointer-events:none;}
.ins-wash{position:absolute;inset:0;
  background:radial-gradient(65% 55% at 82% 22%,
    rgba(209,201,255,.26) 0%, rgba(209,201,255,.09) 45%, rgba(247,245,240,0) 72%);}
.ins-head em{font-style:italic;color:var(--color-accent-deep-iris);}
/* RevealLines' mask assumes one authored, non-wrapping line per entry; a
   wrapped second line at a narrow width would sit past the mask's one-line
   box and clip, so the clip is turned off for this headline specifically —
   it still fades and rises, it just no longer crops while doing it. */
.ins-head span[class*="mask"]{overflow:visible;padding-bottom:0;margin-bottom:0;}
`;

export default function Insights() {
  const [lead] = notes;

  return (
    <section id="insights" className="ins-frame">
      <style>{CSS}</style>

      <div className="ins-bg" aria-hidden="true">
        <div className="ins-wash" />
      </div>

      <div className="wrap band relative">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="t-mono">Insights</p>
            <RevealLines
              as="h2"
              className="t-display-sm ins-head mt-6"
              lines={["Notes from", <>the <em>desk</em>.</>]}
            />
          </div>
          <Link
            href="/insights"
            className="t-mono-xs group inline-flex min-h-11 items-center gap-3 text-ink"
          >
            All notes
            <Arrow />
          </Link>
        </div>

        <Tilt max={4} as="div" className="mt-14 block max-w-3xl md:mt-16">
          <Glass as="article" radius={20} className="p-8 md:p-12">
            <Link href={`/insights/${lead.slug}`} className="group block">
              <p className="t-mono-xs text-ink-3 transition-colors duration-[var(--dur-fast)] group-hover:text-ink motion-reduce:transition-none">
                {lead.category}
                <span aria-hidden="true" className="px-3 text-ink-3">
                  /
                </span>
                <time dateTime={lead.date}>{formatDate(lead.date)}</time>
              </p>

              <h3 className="mt-6 font-display text-3xl leading-none tracking-tight text-ink md:text-5xl">
                {lead.title}
              </h3>

              <p className="t-sub mt-6 max-w-md text-ink-2">{lead.dek}</p>

              <span className="t-mono-xs mt-8 inline-flex min-h-11 items-center gap-3 text-ink">
                Read the note
                <Arrow />
              </span>
            </Link>
          </Glass>
        </Tilt>
      </div>

      <Statement attribution="From the note">{QUOTES[lead.slug]}</Statement>
    </section>
  );
}
