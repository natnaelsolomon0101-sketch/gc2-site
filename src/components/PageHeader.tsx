import Container from "./Container";
import Surface from "./Surface";

export default function PageHeader({
  title, standfirst, withSurface = false,
}: { title: string; standfirst?: string; withSurface?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      {withSurface && (
        <Surface opacity={0.4} className="absolute right-0 top-0 hidden h-full w-1/2 md:block" />
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
