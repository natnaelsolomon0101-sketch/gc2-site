import { FUND, FOOTER_COLUMNS, CONTACT, DISCLOSURE } from "@/content/site";

export default function Footer() {
  return (
    <footer id="contact" className="on-night bg-night text-night-fg">
      <div className="mx-auto max-w-[1280px] px-6 py-band-sm md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] md:gap-10">
          <div>
            <div className="text-[20px] font-semibold tracking-tight">{FUND.mark}</div>
            <p className="mt-3 max-w-[28ch] text-[14px] text-night-fg/55">
              {FUND.name} · {FUND.kind}<br />{FUND.city}, {FUND.state}
            </p>
            <a href={`mailto:${CONTACT.email}`}
               className="mt-6 inline-flex min-h-11 items-center border-b border-night-fg/25 text-[15px] transition-colors hover:border-night-fg">
              {CONTACT.email}
            </a>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-night-fg/45">{col.title}</h2>
              <ul className="mt-5 space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}
                       className="inline-flex min-h-11 items-center text-[14px] text-night-fg/70 transition-colors hover:text-night-fg">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div id="legal" className="mt-16 border-t border-night-fg/12 pt-8">
          <p className="max-w-[95ch] text-[12px] leading-[1.75] text-night-fg/45">{DISCLOSURE}</p>
          <p className="mt-6 text-[12px] text-night-fg/45">
            &copy; {new Date().getFullYear()} {FUND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
