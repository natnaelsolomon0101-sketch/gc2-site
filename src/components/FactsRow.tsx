import { site } from "@/config/site";

/* ===========================================================================
   FACTS ROW — the firm's own registration data, four cells, sourced from
   src/config/site.ts only. A 2x2 grid with a hairline cross below 1024px
   (verified at the 320 floor and 375), one row of four above it. Labels are
   short by design so they never wrap; values set in the display face.

   Light pass: hairlines read var(--color-hairline) (ink at 13% — the same
   composited relationship on ground, ground-2 or surface, so this grid
   looks the same whichever ground it lands on). Values are ink, labels
   ink-3 — the de-emphasized tier, legal on every ground per DESIGN.md.
   ========================================================================= */

export type Fact = { label: string; value: string };

const defaultFacts: Fact[] = [
  { label: "Formed", value: site.foundedLabel },
  { label: "Domicile", value: site.city },
  { label: "Structure", value: site.structure },
  { label: "Mandate", value: site.mandate },
];

const css = `
.facts-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  border-top: 1px solid var(--color-hairline);
}
.facts-cell {
  padding: 20px 20px 20px 0;
  border-bottom: 1px solid var(--color-hairline);
}
.facts-cell:nth-child(2n) {
  border-left: 1px solid var(--color-hairline);
  padding-left: 20px;
  padding-right: 0;
}
.facts-cell:nth-last-child(-n+2) { border-bottom: none; }
.facts-label { white-space: nowrap; }
.facts-value {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(22px, 6vw, 28px); line-height: 1.15; letter-spacing: -.01em;
  margin-top: 6px; color: var(--color-ink);
  /* Values wrap between words, never mid-word: a display face doesn't
     hyphenate (see Feature.tsx .ft-head for the same rule on the headline). */
  hyphens: none;
}
@media (min-width: 1024px) {
  .facts-row { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .facts-cell { border-bottom: none; padding: 20px; }
  .facts-cell:nth-child(2n) { border-left: none; padding-left: 20px; padding-right: 20px; }
  .facts-cell:first-child { padding-left: 0; }
  .facts-cell:not(:first-child) { border-left: 1px solid var(--color-hairline); }
}
`;

export default function FactsRow({ items = defaultFacts }: { items?: Fact[] }) {
  return (
    <>
      {/* <dl>'s content model permits dt/dd groups (optionally wrapped in a
          div) intermixed only with script-supporting elements (script,
          template) — not style. It rendered fine nested (browsers are
          lenient), but it wasn't a valid <dl>; moved out as a sibling. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <dl className="facts-row">
        {items.map((f) => (
          <div key={f.label} className="facts-cell">
            <dt className="t-mono-xs facts-label text-ink-3">{f.label}</dt>
            <dd className="facts-value">{f.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
