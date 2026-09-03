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
   it — it only closes the gap between them.

   Landscape phones (round 3, thumb-critic): under 480px of viewport height
   the vertical padding tightens further still, and `measure-head`'s 16em cap
   — sized for a portrait column — is relaxed to ~22em, because at a width
   like 734–750px it was wrapping a short title onto a second line with half
   the line box empty ("Questions / we expect."). The same media condition
   foundation uses for the landscape nav height (`orientation: landscape`
   paired with a max-height, not a min-width guess at "phone") is reused here
   so both thresholds agree on what a landscape phone is.

   `quickLink` is an optional slot (e.g. /contact's investors mailto) that
   renders after the standfirst in the normal flow, but reorders to sit
   between the h1 and the standfirst on a landscape phone — the standfirst
   paragraph is what was pushing it past the first screen there. It has to
   live inside this flex column (not as a sibling section in the page that
   uses it) because CSS `order` only reorders items sharing one flex parent;
   putting it here is what makes "before the standfirst on landscape" actually
   reorder rather than just being visually adjacent in one specific layout. */
export default function PageHeader({
  eyebrow, title, standfirst, quickLink,
}: { eyebrow?: string; title: string; standfirst?: string; quickLink?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <Container className="relative">
        <div
          className="flex flex-col pt-6 pb-8 md:pt-12 md:pb-14 lg:pt-20 lg:pb-20
                     [@media(max-height:480px)_and_(orientation:landscape)]:pt-3
                     [@media(max-height:480px)_and_(orientation:landscape)]:pb-4"
        >
          {eyebrow && <p className="order-1 t-mono text-ink-3">{eyebrow}</p>}
          <h1
            className={`order-2 t-h1 measure-head [@media(max-height:480px)_and_(orientation:landscape)]:max-w-[22em] ${eyebrow ? "mt-4 md:mt-6" : ""}`}
          >
            {title}
          </h1>
          {standfirst && (
            <p
              className="order-3 [@media(max-height:480px)_and_(orientation:landscape)]:order-4
                         t-lead measure-lead mt-6 md:mt-8"
            >
              {standfirst}
            </p>
          )}
          {quickLink && (
            <div className="order-4 mt-6 md:mt-8 [@media(max-height:480px)_and_(orientation:landscape)]:order-3">
              {quickLink}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
