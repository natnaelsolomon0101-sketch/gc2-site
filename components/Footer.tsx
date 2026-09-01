import { FUND, NAV, DISCLOSURE } from "@/content/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="mark"><b>{FUND.mark}</b></div>
            <p className="foot-tag">{FUND.name} · {FUND.kind} · {FUND.city}, {FUND.state}</p>
          </div>
          <nav className="foot-nav" aria-label="Footer">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
        </div>
        <div className="foot-rule" />
        <p className="disclosure">{DISCLOSURE}</p>
        <div className="foot-btm">
          <span>&copy; {new Date().getFullYear()} {FUND.name}. All rights reserved.</span>
          <span>{FUND.city}, {FUND.state}</span>
        </div>
      </div>
    </footer>
  );
}
