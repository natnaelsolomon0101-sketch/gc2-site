import Link from "next/link";
import Container from "./Container";
import Wordmark from "./Wordmark";
import { site } from "@/config/site";
import { footerNav } from "@/config/nav";

export default function Footer() {
  return (
    <footer className="on-black bg-black text-stone">
      <Container>
        <div className="rule-t-black py-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Wordmark onBlack />
            <nav aria-label="Footer" className="flex flex-wrap gap-6">
              {footerNav.map((n) => (
                <Link key={n.href} href={n.href}
                  className="t-small flex min-h-11 items-center text-stone">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <p className="t-caption mt-12 measure-legal text-muted-on-black">
            {site.name} is a private investment partnership. This website is for
            informational purposes only and does not constitute an offer to sell or a
            solicitation of an offer to buy any security. Past performance is not
            indicative of future results. Access to the fund is limited to qualified
            investors.
          </p>

          <div className="t-caption mt-6 flex flex-wrap justify-between gap-3 text-muted-on-black">
            <span>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</span>
            <span>{site.city}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
