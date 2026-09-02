import Link from "next/link";
import { site } from "@/config/site";
import { footerNav } from "@/config/nav";

export default function Footer() {
  return (
    <footer className="bg-abyss">
      <div className="wrap band">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <span className="t-wordmark text-pure">{site.mark}</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
            {footerNav.map((n) => (
              <Link key={n.href} href={n.href} className="t-small flex min-h-11 items-center text-ash">
                {n.label}
              </Link>
            ))}
          </nav>
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
