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
    <Section surface="stone">
      <Container>
        <div className={`rule-t rule-b ${compact ? "py-7 md:py-10" : "py-14 md:py-20"}`}>
          {/* .t-display-sm ships hyphens: manual + text-wrap: balance itself
              (foundation, v4/every-screen) — no local override needed. */}
          <p className="t-display-sm">{children}</p>
          {attribution ? <p className="t-small mt-6 text-fog">{attribution}</p> : null}
        </div>
      </Container>
    </Section>
  );
}
