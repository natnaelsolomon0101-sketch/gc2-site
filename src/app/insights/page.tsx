import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { notes, formatDate } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes from the desk",
  description: "Commentary from the desk on regime, risk, convexity, and capacity.",
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
