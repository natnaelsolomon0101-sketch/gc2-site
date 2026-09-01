import { HERO, TICKER } from "@/content/site";

export default function Hero() {
  const last = HERO.headline.length - 1;

  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-in">
        <p className="hero-eyebrow">{HERO.eyebrow}</p>
        <h1 className="h-display">
          {HERO.headline.map((line, i) => (
            <span key={line}><i>{i === last ? <em>{line}</em> : line}</i></span>
          ))}
        </h1>
        <p className="lede hero-lede">{HERO.standfirst}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href={HERO.primaryCta.href}>
            {HERO.primaryCta.label}<span className="arw" aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href={HERO.secondaryCta.href}>{HERO.secondaryCta.label}</a>
        </div>
        <div className="hero-pad" />
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((set) => (
            <div className="ticker-set" key={set}>
              {TICKER.map((t) => (
                <div className="tick" key={`${set}-${t.symbol}`}>
                  <b>{t.symbol}</b><span>{t.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
