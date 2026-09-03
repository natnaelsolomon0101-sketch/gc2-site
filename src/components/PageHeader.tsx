import Container from "./Container";

/* Inner-page hero. Ground is the body's `--color-ground` (no override here),
   the h1 takes its colour from `.t-h1` (ink, 17.04:1) and the standfirst from
   `.t-lead` (ink-2, 7.55:1). The eyebrow is dimmer than `.t-mono`'s own ink-2
   default — `text-ink-3` (5.61:1) — the same relative de-emphasis it always
   carried, one tier down from the class default. The optional mono eyebrow
   mirrors the `t-mono` label the home page puts above every section, so an
   inner page reads as the same site rather than a different template.

   Vertical rhythm is set here rather than with `.section-y` (flat 80px top
   and bottom on every viewport). That flat value is right at ≥1024 — it is
   reproduced below at `lg:` — but on a phone it puts ~136px of dead ground
   (56px sticky nav + 80px padding) between the nav and the eyebrow before a
   single word of the page has appeared, which pushed the eyebrow, h1 and
   lead off the first screen (`docs/v4/shots/baseline/contact--393--fold.png`).
   The nav is `position: sticky` and occupies its own height in flow (it does
   not overlay `<main>`), so tightening this padding cannot put the h1 under
   it — it only closes the gap between them. */
export default function PageHeader({
  eyebrow, title, standfirst,
}: { eyebrow?: string; title: string; standfirst?: string }) {
  return (
    <section className="relative overflow-hidden">
      <Container className="relative">
        <div className="pt-6 pb-8 md:pt-12 md:pb-14 lg:pt-20 lg:pb-20">
          {eyebrow && <p className="t-mono text-ink-3">{eyebrow}</p>}
          <h1 className={`t-h1 measure-head ${eyebrow ? "mt-4 md:mt-6" : ""}`}>{title}</h1>
          {standfirst && <p className="t-lead measure-lead mt-6 md:mt-8">{standfirst}</p>}
        </div>
      </Container>
    </section>
  );
}
