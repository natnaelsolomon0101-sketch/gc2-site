import Container from "./Container";
import Surface from "./Surface";

export default function PageHeader({
  title, standfirst, withSurface = false,
}: { title: string; standfirst?: string; withSurface?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      {withSurface && (
        <Surface
          opacity={0.4}
          /* A.6 places this "top-right of the /firm header", and at 390 there is
             no size that satisfies both halves of that. The header is 348px tall
             and only its first 72px clear the h1, so anything tall enough to read
             as terrain runs through the headline and the standfirst, and anything
             short enough to clear them is a sliver.

             An earlier round flagged this surface as invisible at 390 (low) and
             the fix made it full-height, which critic-lp then filed as the one
             screen where decoration fights the words (high). Trading the low back
             for the high: hidden below md, where the hero — which has the vertical
             room the header does not — still carries the visual on mobile. */
          className="surface-mask pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 md:block"
        />
      )}
      <Container className="relative">
        <div className="section-y">
          <h1 className="t-h1 measure-head text-black">{title}</h1>
          {standfirst && <p className="t-lead measure-lead mt-8 text-slate">{standfirst}</p>}
        </div>
      </Container>
    </section>
  );
}
