import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes from the desk",
  // Round 5 (Google presence audit, docs/v4/GOOGLE-PRESENCE.md): was 66
  // chars, under Google's ~110-char sweet spot. Extended with the page's own
  // lead sentence — the same "argues a position" line the home Insights
  // section already uses (src/components/sections/Insights.tsx), restated
  // in the third person rather than re-describing the section from scratch.
  description:
    "Commentary from the desk on regime, risk, convexity, and capacity. Each note argues a position the firm actually holds, not a general market view.",
  // Round 3: /feed.xml (src/app/feed.xml/route.ts) is the same title and
  // description, syndicated. `alternates.types` is what actually emits
  // <link rel="alternate" type="application/rss+xml">.
  //
  // Round 5: setting `alternates` at all here REPLACES the root layout's
  // `alternates.canonical: "./"` (src/app/layout.tsx) rather than merging
  // with it — Next only shallow-merges metadata objects one level deep, and
  // `alternates` is itself an object, so this page's `alternates.types` was
  // silently dropping the root's `alternates.canonical`. Verified in the
  // built HTML: /insights had no <link rel="canonical"> at all while every
  // route that leaves `alternates` unset does. `canonical: "./"` restores
  // it here explicitly.
  alternates: { canonical: "./", types: { "application/rss+xml": "/feed.xml" } },
};

/* The rows are written out here rather than through HairlineList because that
   component's hover state is `hover:bg-stone` — a token from an even earlier
   build that no longer exists in the theme, so it compiled to nothing and the
   list had no hover at all. The row steps to ground-2 (#eeeae1, DESIGN.md's
   "full-bleed band, one step darker" role — "Measured — the ground steps":
   1.10:1, a real but quiet step, no shadow needed), which reads as a
   deliberate state change rather than the near-invisible tint a plain
   hover:bg-surface would give at this size.

   Colour on ground: title ink 17.04:1 already at rest (`.t-h3`'s own base
   colour — there is no higher tier to hover into, so the title's hover-colour
   transition is gone; the row's background step and the focus-visible ring
   are the state changes now), dek ink-2 7.55:1, date ink-3 5.61:1, category
   ink-2 (inherited from `.t-mono-xs`'s own base). Row is py-7 on a block
   link — 56px of padding alone, well past the 44px target. */
export default function Insights() {
  return (
    <>
      <PageHeader eyebrow="Insights" title="Notes from the desk." />
      <section>
        <Container>
          <div className="rule-t pb-16 md:pb-24">
            {notes.map((n) => (
              <Link
                key={n.slug}
                href={`/insights/${n.slug}`}
                /* The row inherits ink-2, and the base `:focus-visible` ring
                   resolves against currentColor here, so the ring came out
                   ink-2 (7.55:1 — visible, but a different ring from every
                   other control on the site). Pinning it to ink keeps it
                   17.04:1 and identical to the nav and the prose links. */
                className="rule-b group block px-2 py-7 transition-colors duration-[var(--dur-fast)] hover:bg-ground-2 focus-visible:outline-ink"
              >
                <div className="grid-gc2 items-baseline">
                  <span className="t-small col-span-4 text-ink-3 md:col-span-2">
                    {formatDate(n.date)}
                  </span>
                  <span className="col-span-4 md:col-span-8">
                    <span className="t-h3 block">
                      {n.title}
                    </span>
                    <span className="t-body measure-body mt-2 block">{n.dek}</span>
                  </span>
                  <span className="t-mono-xs col-span-4 md:col-span-2">{n.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
