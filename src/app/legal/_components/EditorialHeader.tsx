import Container from "@/components/Container";
import RevealLines from "@/components/ui/RevealLines";

/**
 * EditorialHeader — the legal section's own inner-route header: an eyebrow
 * caption top-left, a headline with one italic word in deep iris via
 * RevealLines (TRANSFORM.md rule 2), a soft iris wash behind the copy
 * (rule 3), and an optional effective-date caption at the foot.
 *
 * Deliberately not <PageHeader/>: that file is sec-firm's this round and is
 * transforming independently. Forking it here would leave two headers named
 * one thing drifting apart. This one is scoped to the five routes sec-legal
 * owns (/legal, /legal/terms, /legal/privacy, /disclosures, /tearsheet) and
 * reuses PageHeader's own type scale and measures (t-h1/measure-head,
 * t-lead/measure-lead) so the two read as one system regardless of which
 * lands first.
 *
 * `caption` is the foot line — a document's effective date. It is passed
 * pre-gated by the caller (`fund.updatedAt ? \`Effective ${date}\` : undefined`),
 * the same null-renders-nothing rule every fact on this site already follows.
 * Nothing here invents a date.
 *
 * Only tokens already on the page: `--color-accent-deep-iris` (the italic
 * word, same role as HeroV2's `.hv2-h1 em`) and `--color-accent-pale-iris`
 * (the wash, same colour HeroV2's `.hv2-wash` uses, at a lower ceiling
 * because this sits behind two lines of copy, not a whole first screen).
 * No new colour.
 */
export default function EditorialHeader({
  eyebrow,
  lines,
  standfirst,
  caption,
}: {
  eyebrow?: string;
  lines: React.ReactNode[];
  standfirst?: string;
  caption?: string | null;
}) {
  return (
    <section className="leg-hdr relative isolate overflow-hidden">
      <style>{CSS}</style>
      <div className="leg-hdr-bg" aria-hidden="true" />
      <Container className="relative">
        <div className="leg-hdr-in">
          {eyebrow && (
            <p className="t-mono leg-eyebrow fade-in fade-1 text-ink-3">{eyebrow}</p>
          )}
          <RevealLines
            as="h1"
            className={`t-h1 measure-head leg-h1 ${eyebrow ? "leg-h1-eb" : ""}`}
            lines={lines}
          />
          {standfirst && (
            <p className="t-lead measure-lead leg-lead fade-in fade-3">{standfirst}</p>
          )}
          {caption && (
            <p className="t-caption leg-caption fade-in fade-4 text-ink-3">{caption}</p>
          )}
        </div>
      </Container>
    </section>
  );
}

const CSS = `
.leg-hdr-bg{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(58% 68% at 14% -8%,
    rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 46%, rgba(247,245,240,0) 74%);}
.leg-hdr-in{position:relative;display:flex;flex-direction:column;
  padding:40px 0 32px;}
.leg-h1-eb{margin-top:14px;}
.leg-h1 em{font-style:italic;color:var(--color-accent-deep-iris);}
.leg-lead{margin-top:20px;}
.leg-caption{margin-top:24px;padding-top:14px;border-top:1px solid var(--color-hairline);}
@media (min-width:768px){
  .leg-hdr-in{padding:64px 0 44px;}
  .leg-h1-eb{margin-top:18px;}
  .leg-lead{margin-top:24px;}
  .leg-caption{margin-top:32px;padding-top:16px;}
}
@media print{
  .leg-hdr-bg{display:none !important;}
  .leg-h1 em{color:var(--color-ink) !important;}
  .leg-caption{border-top-color:#cccccc !important;}
}
`;
