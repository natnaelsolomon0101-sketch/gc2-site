import Link from "next/link";
import { site } from "@/config/site";
import { footerNav } from "@/config/nav";

/**
 * ContactBand — the closing band. Inquiries + footer composed as one surface.
 *
 * Ground is abyss (#090a0b) under the obsidian page, so the page LANDS rather
 * than stops. Abyss and obsidian differ by six points per channel, which is
 * near-invisible on its own, so the drop is declared with a hairline at the
 * top edge and a large step up in vertical padding.
 *
 * There is no backend, so there is no form. The two mailto rows ARE the action:
 * a ledger of full-width rows, serif addresses at display weight, hairline
 * dividers, one arrow each. Ninety-two pixels tall — a long way past the 44px
 * floor — because the last thing a reader touches should not feel incidental.
 *
 * NOTHING HERE IS INVENTED. Every string is site.ts, footerNav, or the legal
 * line. `site.address` and `site.phone` are null: the ternaries below render
 * literally nothing for them — not a placeholder, not an em dash, not a label.
 * Do not add a street address, a phone number, an entity name, a registration
 * number, a regulator, or a person. That rule does not bend.
 *
 * Contrast on abyss: pure 20.35:1 · cloud 18.72:1 · ash 7.20:1 · fog 4.61:1.
 * The focus ring is cloud (#f5f5f7), not a brand green — a ledger-green ring
 * on near-black measures 1.6:1 and is invisible. Cloud measures 18.72:1.
 */

const channels = [
  { label: "Investors", email: site.emails.investors },
  { label: "Press", email: site.emails.press },
] as const;

/* Cloud focus ring, shared by every control in the band. */
const focusRing = "focus-visible:outline-2 focus-visible:outline-cloud";

function Arrow() {
  return (
    <svg
      aria-hidden="true" viewBox="0 0 20 20" width="20" height="20" fill="none"
      className="shrink-0 text-fog transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cloud"
    >
      <path
        d="M3.5 10h13M11.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactBand() {
  const year = new Date().getFullYear();

  return (
    <div className="border-t border-white/10 bg-abyss">
      {/* pb is generous on purpose: the ledger's closing hairline and the
          footer's opening hairline sit on the same axis, and at 56px apart
          they read as an empty sixth row. 80/112px separates them. */}
      <section
        id="inquiries"
        aria-labelledby="inquiries-heading"
        className="wrap pt-[72px] pb-20 md:pt-28 md:pb-28"
      >
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* The ask */}
          <div className="md:col-span-6 lg:col-span-4">
            <p className="t-mono">Contact</p>
            <h2 id="inquiries-heading" className="t-display-sm mt-5">
              Inquiries
            </h2>
            <p className="t-sub mt-7 max-w-[32ch] text-ash">
              We speak with a small number of aligned partners each year.
              Introductions are welcome.
            </p>
          </div>

          {/* The ledger. Two addresses, one office. */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <div className="border-t border-white/12">
              {channels.map((c) => (
                <div key={c.email} className="border-b border-white/12">
                  <a
                    href={`mailto:${c.email}`}
                    className={`group flex min-h-[92px] items-center justify-between gap-6 py-7 transition-colors duration-200 hover:bg-white/5 ${focusRing}`}
                  >
                    {/* Label sits above the address until lg. Side by side at
                        768 the address column is ~230px and the serif broke
                        "investors@gc2.fun / d" across two lines. */}
                    <span className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-8">
                      <span className="t-mono-xs shrink-0 lg:w-[104px]">{c.label}</span>
                      <span className="t-heading-sm break-words text-pure">{c.email}</span>
                    </span>
                    <Arrow />
                  </a>
                </div>
              ))}

              {/* Office. site.address is null, so it renders nothing at all and
                  the city stands alone. site.phone is null: no row, no label.
                  No closing rule here — the footer's rule closes the ledger.
                  With one, the gap between the two hairlines read as an empty
                  fourth row on a 390px screen. */}
              <div>
                <div className="flex min-h-[92px] items-center py-7">
                  <span className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-8">
                    <span className="t-mono-xs shrink-0 lg:w-[104px]">Office</span>
                    <span className="flex flex-col gap-1">
                      {site.address ? (
                        <span className="t-heading-sm text-cloud">{site.address}</span>
                      ) : null}
                      <span className="t-heading-sm text-cloud">{site.city}</span>
                      {site.phone ? (
                        <a
                          href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                          className={`t-body inline-flex min-h-11 items-center text-ash ${focusRing}`}
                        >
                          {site.phone}
                        </a>
                      ) : null}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer, on the same ground. Not a second band — the close of this one. */}
      <footer className="wrap pb-12 md:pb-16">
        <div className="border-t border-white/12 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-2">
            <Link
              href="/"
              aria-label={`${site.mark} home`}
              className={`t-wordmark inline-flex min-h-11 items-center text-pure ${focusRing}`}
            >
              {site.mark}
            </Link>
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8">
              {footerNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`t-small inline-flex min-h-11 items-center text-ash transition-colors duration-200 hover:text-cloud ${focusRing}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Copyright sits under the heading column, legal under the ledger,
              so the footer inherits the same two-column spine as the band. */}
          <div className="mt-12 grid gap-6 md:grid-cols-12 md:gap-10">
            <p className="t-small order-2 text-fog md:order-1 md:col-span-6 lg:col-span-4">
              &copy; {year} {site.name}. All rights reserved.
            </p>
            {/* Legal. Measured, not guessed: at 58ch the longest rendered line
                was 80 characters. 52ch caps the widest line at 72. */}
            <p className="t-small order-1 max-w-[52ch] text-ash md:order-2 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
              {site.name} is a private investment partnership. This website is
              for informational purposes only and does not constitute an offer
              to sell or a solicitation of an offer to buy any security. Past
              performance is not indicative of future results. Access to the
              fund is limited to qualified investors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
