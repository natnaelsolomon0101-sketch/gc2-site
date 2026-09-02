import Link from "next/link";
import { site } from "@/config/site";
import { nav, allocatorNav, legalNav } from "@/config/nav";

const FOOTER_GROUPS = [
  { label: "Firm", items: nav },
  { label: "For allocators", items: allocatorNav },
  { label: "Legal", items: legalNav },
] as const;

export default function Footer() {
  return (
    <footer className="bg-abyss">
      <div className="wrap band">
        <div className="grid items-start gap-12 md:grid-cols-[auto_1fr_1fr_1fr]">
          <span className="t-wordmark text-pure inline-flex min-h-11 min-w-11 items-center">{site.mark}</span>
          {FOOTER_GROUPS.map((g) => (
            <nav key={g.label} aria-label={g.label}>
              <h2 className="t-mono-xs text-fog">{g.label}</h2>
              <ul className="mt-3">
                {g.items.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="t-small flex min-h-11 items-center text-ash">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="t-small mt-12 max-w-3xl text-fog">
          {site.name} is a private investment partnership. This website is for
          informational purposes only and does not constitute an offer to sell or a
          solicitation of an offer to buy any security. Past performance is not
          indicative of future results. Access to the fund is limited to qualified
          investors.
        </p>
        <div className="t-small mt-6 flex flex-wrap justify-between gap-3 text-fog">
          <span>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>{site.city}</span>
        </div>
      </div>
    </footer>
  );
}
