import { FUND, FOOTER_COLUMNS, CONTACT, DISCLOSURE } from "@/content/site";

/**
 * Mercury footer — the one dark surface on the page. `on-ink` swaps the focus
 * ring to the light variant so keyboard focus stays visible against the ink.
 * Fields the fund has not confirmed (phone, address, founding year) are simply
 * absent; nothing is placeheld.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="on-ink bg-ink text-white">
      {/* extra bottom padding on mobile keeps the fixed launcher clear of the legal type */}
      <div className="wrap pb-[112px] pt-16 md:pb-16 md:pt-20">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 md:gap-x-8">
          {/* ---- identity ------------------------------------------------ */}
          <div className="col-span-12 md:col-span-6">
            <div className="text-[20px] font-semibold tracking-[-0.02em] text-white">
              {FUND.mark}
            </div>

            <p className="mt-3 max-w-[30ch] text-[14px] leading-[1.55] text-muted-2">
              {FUND.name} &middot; {FUND.kind}
              <br />
              {FUND.city}, {FUND.state}
            </p>

            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-5 inline-flex min-h-[44px] items-center text-[15px] text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              {CONTACT.email}
            </a>

            {CONTACT.phone ? (
              <a
                href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`}
                className="flex min-h-[44px] items-center text-[15px] text-muted-2 transition-colors hover:text-white"
              >
                {CONTACT.phone}
              </a>
            ) : null}

            {CONTACT.address ? (
              <address className="mt-4 not-italic text-[14px] leading-[1.6] text-muted-2">
                {CONTACT.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : null}
          </div>

          {/* ---- link columns -------------------------------------------- */}
          {FOOTER_COLUMNS.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="col-span-6 sm:col-span-4 md:col-span-2"
            >
              <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-2">
                {col.title}
              </h2>

              <ul className="mt-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="flex min-h-[44px] items-center text-[15px] text-muted-2 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ---- legal ------------------------------------------------------ */}
        <div id="legal" className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-[92ch] text-[12px] leading-[1.7] text-muted-2">
            {DISCLOSURE}
          </p>
          <p className="mt-6 text-[12px] text-muted-2">
            &copy; {year} {FUND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
