import Section from "./Section";
import Container from "./Container";

/* ===========================================================================
   STATEMENT — the site's one way to emphasize a sentence.

   Built for the risk-framework quote in Feature.tsx; sec-insights imports it
   unchanged for pull quotes rather than forking it (docs/v4/OWNERSHIP.md,
   "Cross-section objects"). Display face, .t-display-sm scale, full measure
   (no narrow column — a pull quote is not a card), a hairline above and
   below, no quote marks, no italics, no card, no colour. `attribution` is
   optional: a note without a named source renders without a byline rather
   than inventing one. `compact` halves the vertical padding for use inside
   article prose (sec-insights, MDX notes) where a full section-band's worth
   of air would fight the surrounding measure; default is unchanged, full
   padding, for the section-band use (Feature.tsx).

   Light pass: `ink` on plain `ground` (surface="paper"), not the ground-2
   step — Statement is a generic pull-quote object other sections (and MDX
   prose) drop into their own ground, so it does not carry a section-band's
   stone tint. The hairlines above and below are still var(--color-hairline)
   via .rule-t/.rule-b regardless of the ground under it.

   Accessibility pass: a pull quote with a named source is exactly what
   <figure>/<blockquote>/<figcaption> exist for — a screen reader announces
   the quote as a quotation and the attribution as its caption, rather than
   two unrelated paragraphs. `m-0` zeroes the UA default margins both
   elements carry (figure: 1em 40px; blockquote: 1em 40px) so the "full
   measure" rule (no narrow, indented column) holds exactly as before.
   ========================================================================= */

export default function Statement({
  children,
  attribution,
  compact = false,
}: {
  children: React.ReactNode;
  attribution?: string;
  compact?: boolean;
}) {
  return (
    <Section surface="paper">
      <Container>
        <figure className={`m-0 rule-t rule-b ${compact ? "py-7 md:py-10" : "py-14 md:py-20"}`}>
          {/* .t-display-sm ships hyphens: manual + text-wrap: balance itself
              (foundation, v4/every-screen) — no local override needed. */}
          <blockquote className="m-0 t-display-sm">{children}</blockquote>
          {attribution ? <figcaption className="t-small mt-6 text-ink-3">{attribution}</figcaption> : null}
        </figure>
      </Container>
    </Section>
  );
}
