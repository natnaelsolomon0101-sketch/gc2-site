import { STRATEGIES } from "@/content/site";
import Reveal from "./Reveal";

export default function Strategies() {
  return (
    <section className="section" id="strategies">
      <div className="wrap">
        <Reveal><p className="label">Strategies</p></Reveal>
        <Reveal delay={70}>
          <h2 className="h-sec" style={{ marginTop: 22, maxWidth: "16ch" }}>
            Six mandates, one risk framework.
          </h2>
        </Reveal>
        <div className="strats">
          {STRATEGIES.map((s, i) => (
            <Reveal key={s.id} delay={i * 55}>
              <article className="strat" tabIndex={0} aria-label={s.name}>
                <div className="strat-head">
                  <span className="strat-id">{s.id}</span>
                  <h3 className="strat-name">{s.name}</h3>
                  <p className="strat-blurb">{s.blurb}</p>
                  <div className="strat-tags">
                    {s.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="strat-detail"><p>{s.detail}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
