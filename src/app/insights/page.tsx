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
   component's hover state is `hover:bg-stone` — a paper-build token that no
   longer exists in the theme, so it compiled to nothing and the list had no
   hover at all. On the Origin ground the row lifts onto abyss (#090a0b, the
   deeper band) and the title goes to pure, which reads as a deliberate state
   change on black instead of the near-invisible tint a graphite hover gives.

   Colour on obsidian: title cloud 17.49:1 (pure 19.05:1 on hover, over abyss
   19.81:1), dek ash 7.20:1 (7.49:1 over abyss), date fog 4.61:1, category ash.
   Row is py-7 on a block link — 56px of padding alone, well past the 44px
   target. */
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
                /* The row inherits ash, and the base `:focus-visible` ring
                   resolves against currentColor here, so the ring came out ash
                   (7.20:1 — visible, but a different ring from every other
                   control on the site). Pinning it to pure keeps it 19.05:1 and
                   identical to the nav and the prose links. */
                className="rule-b group block px-2 py-7 transition-colors duration-150 hover:bg-abyss focus-visible:outline-pure"
              >
                <div className="grid-gc2 items-baseline">
                  <span className="t-small col-span-4 text-fog md:col-span-2">
                    {formatDate(n.date)}
                  </span>
                  <span className="col-span-4 md:col-span-8">
                    <span className="t-h3 block transition-colors duration-150 group-hover:text-pure">
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
