import Container from "./Container";

export default function Statement({ children, attribution }: { children: React.ReactNode; attribution: string }) {
  return (
    <section className="bg-stone">
      <Container>
        <div className="section-y">
          <p className="t-h2 col-span-9 measure-statement text-black">{children}</p>
          <p className="t-small mt-8 text-slate">{attribution}</p>
        </div>
      </Container>
    </section>
  );
}
