import { INSIGHTS } from "@/content/site";
import Reveal from "./Reveal";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });

export default function Insights() {
  return (
    <section className="section" id="insights">
      <div className="wrap">
        <Reveal><p className="label">Insights</p></Reveal>
        <Reveal delay={70}>
          <h2 className="h-sec" style={{ marginTop: 22, maxWidth: "16ch" }}>
            Notes from the desk.
          </h2>
        </Reveal>
        <div className="ins-grid">
          {INSIGHTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <article className="ins">
                <div className="ins-meta">
                  <span className="ins-cat">{p.category}</span>
                  <time dateTime={p.date}>{fmt(p.date)}</time>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="ins-more">Read<span className="arw" aria-hidden="true">→</span></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
