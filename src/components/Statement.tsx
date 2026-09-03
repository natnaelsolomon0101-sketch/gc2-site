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
   than inventing one.
   ========================================================================= */

export default function Statement({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <Section surface="stone">
      <Container>
        <div className="rule-t rule-b py-14 md:py-20">
          {/* Display face, no hyphenation — a mid-word break in a pull
              quote reads as a bug, same rule as Feature.tsx's headline. */}
          <p className="t-display-sm" style={{ hyphens: "none" }}>{children}</p>
          {attribution ? <p className="t-small mt-6 text-fog">{attribution}</p> : null}
        </div>
      </Container>
    </Section>
  );
}
