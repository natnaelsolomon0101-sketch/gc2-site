import Link from "next/link";
import { site } from "@/config/site";
import { footerNav } from "@/config/nav";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import SessionClock from "@/components/viz/SessionClock";
import { css } from "@/lib/css";

/**
 * ContactBand — the closing band, rebuilt per TRANSFORM.md's assignment to
 * sec-firm: "ContactBand as a floating glass plate on an iris ground with
 * pill actions." The band is now one surface — an iris-haze ground (the
 * same recipe HeroV2's `.hv2-wash` uses, rule 3) with a single `<Glass>`
 * plate that tilts (`<Tilt>`, rule 4) floating on it. The ask sits at the
 * top of the plate with two pill actions (`.btn`/`.btn-ghost`, forced to
 * `border-radius:999px` — rule 4's "pills are border-radius:999px"); the
 * two-row mailto ledger sits under it; the plate's own foot carries the
 * SessionClock and the city as one `.t-caption` line (rule 6).
 *
 * There is no backend, so there is no form. The mailto rows and the two pill
 * actions above them ARE the action.
 *
 * NOTHING HERE IS INVENTED. Every string is site.ts, footerNav, or the legal
 * line. `site.address` and `site.phone` are null: the ternaries below render
 * literally nothing for them — not a placeholder, not an em dash, not a
 * label. Do not add a street address, a phone number, an entity name, a
 * registration number, a regulator, or a person. That rule does not bend.
 *
 * Contrast: ink 17.04:1 on ground, ink-2 7.55:1, ink-3 5.61:1 — the plate is
 * `<Glass>` (paper at 62% over the wash, still effectively paper), not
 * ground-2, so the ground-2 figures this file previously cited no longer
 * apply. The focus ring is ink (2px), matching the rest of the site —
 * DESIGN.md: "the focus ring is 2px ink on ground, 17.04:1 against a 3:1
 * requirement."
 */

const CSS = css`
.cb-ground{position:relative;isolation:isolate;overflow:hidden;background:var(--color-ground);}
.cb-wash{position:absolute;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(65% 60% at 78% 12%, rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 45%, rgba(247,245,240,0) 75%),
    radial-gradient(50% 45% at 12% 92%, rgba(209,201,255,.16) 0%, rgba(247,245,240,0) 70%);}
.cb-frame{position:relative;z-index:1;}
.cb-plate{padding:40px 28px;}
@media (min-width:768px){ .cb-plate{padding:56px 48px;} }
.cb-cta{display:flex;flex-wrap:wrap;gap:12px;}
.cb-cta .btn,.cb-cta .btn-ghost{border-radius:999px;}
.cb-foot{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:12px 24px;}
`;

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
  return (
    <div className="cb-ground">
      <style>{CSS}</style>
      <div className="cb-wash" aria-hidden="true" />
      {/* pb is generous on purpose: the plate's own foot and the footer's
          opening hairline sit on the same axis, and at 56px apart they read
          as an empty sixth row. 80/112px separates them. */}
      <section
        id="inquiries"
        aria-labelledby="inquiries-heading"
        className="cb-frame wrap pt-[72px] pb-20 md:pt-28 md:pb-28"
      >
        <Tilt max={3} as="div">
          <Glass as="div" radius={28} className="cb-plate">
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
                {/* Pill actions — TRANSFORM.md rule 4: "pills are
                    border-radius:999px." The same two addresses the ledger
                    carries, as the ask's own call to action. */}
                <div className="cb-cta mt-8">
                  {channels.map((c, i) => (
                    <a
                      key={c.email}
                      href={`mailto:${c.email}`}
                      className={`btn ${i > 0 ? "btn-ghost" : ""}`}
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
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
                        {/* Label sits above the address until lg. Side by side
                            at 768 the address column is ~230px and the serif
                            broke "investors@gc2.fun / d" across two lines.
                            `break-all` (not `break-words`) per §7 rule 9:
                            email addresses use word-break: break-all inside
                            their link. */}
                        <span className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-8">
                          <span className="t-mono-xs shrink-0 lg:w-[104px]">{c.label}</span>
                          <span className="t-heading-sm break-all text-ink">{c.email}</span>
                        </span>
                        <Arrow />
                      </a>
                    </div>
                  ))}

                  {/* Office. site.address is null, so it renders nothing at all
                      and the city stands alone. site.phone is null: no row, no
                      label. No closing rule here — the plate's own foot closes
                      the ledger. */}
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

            {/* The plate's foot — TRANSFORM.md rule 6: standing facts as one
                `.t-caption` line. SessionClock left, city right; both already
                render nothing until they have something true to say
                (SessionClock hydrates client-side, city is site.city). */}
            <div className="cb-foot rule-t mt-10 pt-6">
              <SessionClock caption={false} rows="open" dense />
              <span className="t-caption text-ink-3">{site.city}</span>
            </div>
          </Glass>
        </Tilt>
      </section>
    </div>
  );
}
