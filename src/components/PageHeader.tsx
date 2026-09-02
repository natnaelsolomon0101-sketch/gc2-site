import Container from "./Container";

export default function PageHeader({
  title, standfirst,
}: { title: string; standfirst?: string }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <Container className="relative">
        <div className="section-y">
          <h1 className="t-h1 measure-head text-black">{title}</h1>
          {standfirst && <p className="t-lead measure-lead mt-8 text-slate">{standfirst}</p>}
        </div>
      </Container>
    </section>
  );
}
