import Link from "next/link";
import { strategies } from "@/content/strategies";
import FactsRow from "@/components/FactsRow";
import Statement from "@/components/Statement";

/* ===========================================================================
   FEATURE — the risk-framework poster.

   The section that carries ONE idea: six strategies, one risk framework,
   because correlated risk does not respect a mandate boundary. Round-0
   rebuild (Conductor decision, docs/v4/APPENDIX-A.md, EVERY-SCREEN.md
   §5.3): the section is a full-bleed abyss band. The sentence sets at
   .t-display-sm — the same scale the site uses everywhere it wants a
   sentence to carry a section — left-aligned, capped to roughly nine of
   twelve columns from 1024px so it reads as a headline, not a paragraph.
   Below it, the firm's own registration data (FactsRow) and the reason the
   framework exists.

   "Risk is not the price of return..." is no longer a second colour card:
   it is a Statement (src/components/Statement.tsx), the one object the
   site uses to emphasize a sentence, importable by any other section that
   needs a pull quote.

   COLOUR is rationed to one chromatic accent — the "Risk framework" eyebrow
   label — per DESIGN.md principle 2. No gradient card, no box-shadow: the
   previous version carried both (a three-stop orchid/pale-iris/periwinkle
   gradient slab and a pulsing box-shadow on the strand-drawing's junction
   dot) as DESIGN.md's "Known drift" records; both are gone rather than
   fixed in place, because the two-slab mosaic and six-hue strand drawing
   they lived on are gone too — a poster does not carry a decorative field
   AND a chromatic drawing AND a headline and still read as "one idea, slow."

   TABLET (768-1024) gets its own two-column composition: the headline runs
   full-width (it's already near .t-display-sm's 80px ceiling by 768px), and
   the reason-and-link sits beside the facts row underneath it — a real
   two-column row the phone stack never has.

   SOURCES — nothing on this section is invented
     "risk framework" / strategy count   strategies.length, content/strategies.ts
     "correlated risk … mandate boundary" Approach.tsx, tail-overlay block
     "limits set once, firm-wide"         MarketsBand ledger, "One, firm-wide"
     Formed / Domicile / Structure / Mandate  src/config/site.ts, via FactsRow
     The quote                            firm copy, Investment Committee

   Server component. No client JS, no dependencies, no imagery.
   ========================================================================= */

const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

const css = `
.ft { position: relative; background: var(--color-abyss); }

.ft-inner { padding-block: 84px; }
@media (min-width: 768px) { .ft-inner { padding-block: 120px; } }

/* .t-display-sm now ships hyphens: manual + text-wrap: balance itself
   (foundation, v4/every-screen) — no local override needed here any more. */
.ft-head { margin-top: 20px; }
@media (min-width: 1024px) { .ft-head { max-width: 75%; } }
/* Phone floor: the fluid .t-display-sm ramp reads as ~40px+ from 320px up,
   which wraps this sentence to four lines with hyphenation forced off. The
   section's own done-criteria caps the poster at three lines on phone
   (.claude/agents/sec-framework.md), so the headline steps down one anchor
   at the phone breakpoint rather than growing past what three lines hold. */
@media (max-width: 767px) { .ft-head { font-size: 29px; line-height: 1.08; } }

.ft-lede { max-width: 30em; margin-top: 20px; }

.ft-link { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; margin-top: 24px; }
.ft-link svg { transition: transform var(--dur-fast) var(--ease); }
@media (hover: hover) and (pointer: fine) {
  .ft-link:hover svg { transform: translateX(3px); }
}

.ft-facts { margin-top: 48px; }
@media (min-width: 768px) { .ft-facts { margin-top: 56px; } }

/* §7 rule 7: tablets are not big phones. The headline stays full-width (the
   fluid .t-display-sm ramp is already near its 80px ceiling by 768px, and
   squeezing it into a fractional column wrapped it to five-plus lines); the
   reason-and-link and the facts row split into a genuine two-column row
   underneath, which the phone stack never does. */
@media (min-width: 768px) and (max-width: 1023px) {
  .ft-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;
  }
  .ft-head-block { grid-column: 1 / -1; }
  .ft-head { max-width: 62%; }
  .ft-lede-block { grid-column: 1; }
  .ft-facts { grid-column: 2; margin-top: 0; align-self: start; }
}
`;

export default function Feature() {
  const count = COUNT[strategies.length] ?? String(strategies.length);

  return (
    <section id="framework" className="ft rule-t" aria-labelledby="feature-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="wrap ft-inner">
        <div className="ft-head-block">
          <p className="t-mono-xs text-pale-iris">Risk framework</p>

          <h2 id="feature-title" className="t-display-sm ft-head">
            Correlated risk does not respect a mandate boundary.
          </h2>
        </div>

        <div className="ft-lede-block">
          <p className="ft-lede t-body">
            So the limits are set once, firm-wide, and all {count.toLowerCase()} strategies
            run inside them. One framework, not six.
          </p>

          <Link href="/firm" className="link ft-link">
            How risk is governed
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="square"
            >
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        <div className="ft-facts">
          <FactsRow />
        </div>
      </div>

      <Statement attribution="Investment Committee">
        Risk is not the price of return. It is what we manage so that we are still
        here when the return arrives.
      </Statement>
    </section>
  );
}
