import { site } from "@/config/site";

/* ===========================================================================
   FACTS ROW — the firm's own registration data, sourced from src/config/
   site.ts only, set as one foot caption line: TRANSFORM.md rule 6, "a
   section's standing facts / source / date go in one .t-caption line at its
   foot, the way a plate carries its caption" — the same pattern HeroV2's
   `.hv2-foot` already uses for city / structure / mandate. Round-1 shipped
   this as a 2x2/4x1 bordered grid; the thesis-frame rebuild moves it to the
   caption line so the frame's foot reads like the hero's, not like a table.

   One row, wraps on narrow rather than reflowing into a grid: label then
   value, ink-3 label / ink value, the same contrast pairing DESIGN.md sets
   for "de-emphasized: dates, legal, inactive rows" against every ground.
   ========================================================================= */

export type Fact = { label: string; value: string };

const defaultFacts: Fact[] = [
  { label: "Formed", value: site.foundedLabel },
  { label: "Domicile", value: site.city },
  { label: "Structure", value: site.structure },
  { label: "Mandate", value: site.mandate },
];

const css = `
.facts-line{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 28px;margin:0;}
.facts-item{display:inline-flex;align-items:baseline;gap:6px;margin:0;}
.facts-item dt,.facts-item dd{display:inline;margin:0;}
.facts-item dt{color:var(--color-ink-3);}
.facts-item dd{color:var(--color-ink);}
`;

export default function FactsRow({
  items = defaultFacts,
  className = "",
}: {
  items?: Fact[];
  className?: string;
}) {
  return (
    <>
      {/* <dl>'s content model permits dt/dd groups (optionally wrapped in a
          div) intermixed only with script-supporting elements (script,
          template) — not style. Kept as a sibling for the same reason the
          previous grid version was. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <dl className={`facts-line t-caption ${className}`}>
        {items.map((f) => (
          <div key={f.label} className="facts-item">
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
