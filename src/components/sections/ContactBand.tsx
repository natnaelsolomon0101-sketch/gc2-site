import Link from "next/link";
import { site } from "@/config/site";
import { footerNav } from "@/config/nav";

/**
 * ContactBand — the closing band. Inquiries + footer composed as one surface.
 *
 * Ground is ground-2 under the page's ground, so the page LANDS rather than
 * stops. The step measures 1.10 — DESIGN.md: "bands read as bands only with
 * a hairline or a real tonal step" — so the drop is declared with a hairline
 * at the top edge (`rule-t`) as well as a large step up in vertical padding.
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
 * Contrast on ground-2: ink 15.47:1 · ink-2 6.85:1 · ink-3 5.09:1. The focus
 * ring is ink (2px), matching the rest of the site — DESIGN.md: "the focus
 * ring is 2px ink on ground, 17.04:1 against a 3:1 requirement."
 */

const channels = [
  { label: "Investors", email: site.emails.investors },
  { label: "Press", email: site.emails.press },
] as const;

/* Ink focus ring, shared by every control in the band. */
const focusRing = "focus-visible:outline-2 focus-visible:outline-ink";

function Arrow() {
  return (
    <svg
      aria-hidden="true" viewBox="0 0 20 20" width="20" height="20" fill="none"
      className="shrink-0 text-ink-3 transition-transform duration-[var(--dur-fast)] ease-[var(--ease)] group-hover:translate-x-1 group-hover:text-ink"
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
    <div className="rule-t bg-ground-2">
      {/* pb is generous on purpose: the ledger's closing hairline and the
          footer's opening hairline sit on the same axis, and at 56px apart
          they read as an empty sixth row. 80/112px separates them. */}
      <section
        id="inquiries"
        aria-labelledby="inquiries-heading"
        className="wrap pt-[72px] pb-20 md:pt-28 md:pb-28"
      >
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* The ask. `order-2` on mobile puts this BELOW the ledger: the
              investors address is the thing a thumb needs first when this
              band scrolls into view, not the two lines of scene-setting
              above it. md+ reverts to the left/right column order. */}
          <div className="order-2 md:order-1 md:col-span-6 lg:col-span-4">
            <p className="t-mono">Contact</p>
            <h2 id="inquiries-heading" className="t-display-sm mt-5">
              Inquiries
            </h2>
            <p className="t-sub mt-7 max-w-[32ch] text-ink-2">
              The firm is built for a small number of long-horizon
              relationships. Correspondence reaches us at the addresses
              below.
            </p>
          </div>

          {/* The ledger. Two addresses, one office. */}
          <div className="order-1 md:order-2 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <div className="rule-t">
              {channels.map((c) => (
                <div key={c.email} className="rule-b">
                  <a
                    href={`mailto:${c.email}`}
                    className={`group flex min-h-[92px] items-center justify-between gap-6 py-7 transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] hover:bg-hairline ${focusRing}`}
                  >
                    {/* Label sits above the address until lg. Side by side at
                        768 the address column is ~230px and the serif broke
                        "investors@gc2.fun / d" across two lines. `break-all`
                        (not `break-words`) per §7 rule 9: email addresses use
                        word-break: break-all inside their link. */}
                    <span className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-8">
                      <span className="t-mono-xs shrink-0 lg:w-[104px]">{c.label}</span>
                      <span className="t-heading-sm break-all text-ink">{c.email}</span>
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
                        <span className="t-heading-sm text-ink">{site.address}</span>
                      ) : null}
                      <span className="t-heading-sm text-ink">{site.city}</span>
                      {site.phone ? (
                        <a
                          href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                          className={`t-body inline-flex min-h-11 items-center text-ink-2 ${focusRing}`}
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
      
    </div>
  );
}
