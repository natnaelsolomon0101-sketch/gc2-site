import Container from "./Container";

/* Inner-page hero. Retargeted from the paper build to Origin: the ground is the
   body obsidian (no `bg-paper`), the h1 takes its colour from `.t-h1` (pure,
   19.05:1) and the standfirst from `.t-lead` (ash, 7.20:1). The optional mono
   eyebrow mirrors the `t-mono` label the home page puts above every section, so
   an inner page reads as the same site rather than a different template. */
export default function PageHeader({
  eyebrow, title, standfirst,
}: { eyebrow?: string; title: string; standfirst?: string }) {
  return (
    <section className="relative overflow-hidden">
      <Container className="relative">
        <div className="section-y">
          {eyebrow && <p className="t-mono text-fog">{eyebrow}</p>}
          <h1 className={`t-h1 measure-head ${eyebrow ? "mt-6" : ""}`}>{title}</h1>
          {standfirst && <p className="t-lead measure-lead mt-8">{standfirst}</p>}
        </div>
      </Container>
    </section>
  );
}
