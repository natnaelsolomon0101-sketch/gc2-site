import { FIRM } from "@/content/site";
import Reveal from "./Reveal";

export default function Firm() {
  return (
    <section className="section" id="firm">
      <div className="wrap">
        <Reveal><p className="label">{FIRM.label}</p></Reveal>
        <div className="firm-grid">
          <Reveal><h2 className="h-sec">{FIRM.heading}</h2></Reveal>
          <Reveal delay={90}>
            <div className="firm-body">
              {FIRM.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <dl className="facts">
            {FIRM.facts.map((f) => (
              <div className="fact" key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
