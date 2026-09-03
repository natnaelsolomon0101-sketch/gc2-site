import Link from "next/link";
import { site } from "@/config/site";
import { nav, allocatorNav, legalNav } from "@/config/nav";

const FOOTER_GROUPS = [
  { label: "Site", items: nav },
  { label: "For allocators", items: allocatorNav },
  { label: "Legal", items: legalNav },
] as const;

/* =============================================================================
   Footer — designed, not dumped (EVERY-SCREEN.md §5.1 / sec-chrome.md).

   1. THE LINK GRID IS A TABLE, NOT THREE STACKED LISTS. A shared top hairline,
      a vertical hairline between columns at >=1024, and a hairline under every
      row so it reads as one ruled object even though the three groups (4, 8,
      2 items) are different heights — that asymmetry is real data, not a bug
      to hide.
   2. THE DISCLOSURE IS `.t-caption`. `.measure-legal` (60em, globals.css) is
      tuned for the sans-serif legal pages; `.t-caption` is mono, uppercase,
      and letter-spaced .182em, so 60em of IT renders past 80ch (measured
      87ch, Conductor) -- three things that all widen a monospace line past
      what the same em-count gives a proportional one. `.gc2-ftr-disclosure`
      sets `max-width:80ch` directly instead, which is what the rule (§7.5 /
      matrix "Text measure") actually asks for.
   3. THE MARK IS THE ONE PLACE ON THE SITE A DELIBERATELY OVERSIZED WORDMARK
      IS WELCOME. It starts at the same left gutter as everything else and is
      allowed to run past the .wrap container and the true viewport edge —
      `.gc2-ftr-shell`'s `overflow-x:hidden` is what turns "the browser ran
      out of room" into "cropped by design" instead of a horizontal scrollbar.

   Class names are prefixed `gc2-ftr-` on purpose, not just `ft-`: this file
   injects a global, unscoped <style> tag (the pattern every chrome/section
   component on this branch uses), and `Feature.tsx` (sec-framework) already
   owns a bare `.ft-link` — the collision silently painted every footer link
   `color-void` black-on-black. Namespace every class this file defines.
   ========================================================================= */
const CSS = `
.gc2-ftr-shell{ position:relative; overflow-x:hidden; }

.gc2-ftr-table{ display:grid; grid-template-columns:1fr; row-gap:40px; padding-top:32px; }
@media (min-width:1024px){
  .gc2-ftr-table{ grid-template-columns:repeat(3, 1fr); column-gap:48px; row-gap:0; }
  .gc2-ftr-col + .gc2-ftr-col{ border-left:1px solid var(--color-steel); padding-left:48px; }
}
.gc2-ftr-col-head{ padding-block:14px; }
.gc2-ftr-row{ border-top:1px solid var(--color-steel); }
.gc2-ftr-link{ transition:color var(--dur-fast) var(--ease); }
.gc2-ftr-link:hover{ color:var(--color-cloud); }

.gc2-ftr-disclosure{ margin-top:64px; max-width:80ch; }
.gc2-ftr-meta{ margin-top:24px; padding-top:24px; border-top:1px solid var(--color-steel); }

/* The mark. Sized to genuinely outrun the viewport at laptop/desktop widths
   (it is meant to be cropped there, per brief) while staying comfortably
   inside a phone's viewport at the clamp floor ("full on mobile"). Tuned
   against real screenshots, not guessed. */
.gc2-ftr-mark{
  display:block;
  margin-top:56px;
  padding-inline: max(24px, env(safe-area-inset-left));
  font-family:var(--font-display); font-weight:400;
  font-size:clamp(104px, 34vw, 460px);
  line-height:0.8;
  letter-spacing:-0.02em;
  color:var(--color-pure);
  white-space:nowrap;
  text-decoration-line:none;
}
.gc2-ftr-mark:hover{ color:var(--color-pure); }
.gc2-ftr-mark:focus-visible{
  outline:2px solid var(--color-cloud); outline-offset:6px; border-radius:var(--radius-control);
}

@media (prefers-reduced-motion: reduce){
  .gc2-ftr-link, .gc2-ftr-mark{ transition-duration:1ms !important; }
}
`;

export default function Footer() {
  return (
    <footer className="gc2-ftr-shell bg-abyss">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="wrap band">
        <div className="gc2-ftr-table rule-t">
          {FOOTER_GROUPS.map((g) => (
            <nav key={g.label} aria-label={g.label} className="gc2-ftr-col">
              <h2 className="t-mono-xs text-fog gc2-ftr-col-head">{g.label}</h2>
              <ul>
                {g.items.map((n) => (
                  <li key={n.href} className="gc2-ftr-row">
                    <Link
                      href={n.href}
                      className="gc2-ftr-link t-small flex min-h-11 w-full items-center text-ash"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="t-caption gc2-ftr-disclosure">
          {site.name} is a private investment partnership. This website is for
          informational purposes only and does not constitute an offer to sell or a
          solicitation of an offer to buy any security. Past performance is not
          indicative of future results. Access to the fund is limited to qualified
          investors.
        </p>

        <div className="t-small gc2-ftr-meta flex flex-wrap justify-between gap-3 text-fog">
          <span>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>{site.city}</span>
        </div>
      </div>

      <Link href="/" aria-label={`${site.mark} — home`} className="gc2-ftr-mark">
        {site.mark}
      </Link>
    </footer>
  );
}
