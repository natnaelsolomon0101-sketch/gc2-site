"use client";

/* =============================================================================
   SiteNav — the desktop bar and the mobile drawer as one composed system.

   Design notes that are load-bearing (do not "simplify" these away):

   1. STICKY BORDER, CONSTANT WIDTH. The header always carries a 1px bottom
      border. Only its COLOUR animates (transparent -> steel) past 8px of
      scroll. A border that appears from nothing adds 1px to the header box and
      shifts the whole page down mid-scroll.
   2. THE DRAWER IS LEFT-ALIGNED ON THE PAGE GUTTER. It reuses the same `.wrap`
      container as the header, so a drawer link's left edge is pixel-identical
      to the wordmark's left edge. A centred overlay throws away the hard-left
      discipline the rest of the design is built on.
   3. FOCUS RETURNS TO THE HAMBURGER when the drawer closes. Escape, the
      toggle, and programmatic closes all route through `close()`.
   4. TWO GLYPHS ON THE WHOLE SITE: the hamburger and its open state. Both are
      two lines at 1.5px. No icon library, no chevrons, no arrows.
   5. FOCUS RING IS LIGHT (`cloud` #f5f5f7, ~17:1 on obsidian). A dark accent
      ring on near-black lands around 1.6:1 and fails 1.4.11.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { nav } from "@/config/nav";

const CTA = { label: "Investor inquiries", href: "/contact" } as const;

/* Scoped stylesheet. Everything here is expressed against the BUILD100K theme
   tokens already declared in globals.css — no new colours, no arbitrary Tailwind
   values, and nothing that requires editing a file this component does not own. */
const CSS = `
/* A hash-link or "scroll into view" jump lands the target flush against the
   viewport top, which is exactly where the sticky nav sits -- the section
   heading ends up under it (Conductor, 1920, Approach). scroll-padding-top
   on the scrolling box fixes every such jump at once, source-order or JS
   scrollIntoView alike, and tracks --nav-h through its own 72/56/48
   breakpoints automatically since it reads the same custom property. This
   is the nav's rule, so it ships from the nav's stylesheet rather than
   editing the frozen html{} block in globals.css. */
html{ scroll-padding-top: var(--nav-h); }

.sn-header{
  position:sticky; top:0; z-index:50;
  background:color-mix(in srgb, var(--color-obsidian) 82%, transparent);
  backdrop-filter:blur(20px) saturate(140%);
  -webkit-backdrop-filter:blur(20px) saturate(140%);
  /* constant 1px. only the colour moves. */
  border-bottom:1px solid transparent;
  transition:border-bottom-color var(--dur-menu) var(--ease);
}
.sn-header[data-scrolled="true"]{ border-bottom-color:var(--color-steel); }

.sn-header :focus-visible,
.sn-drawer :focus-visible{
  outline:2px solid var(--color-cloud);
  outline-offset:3px;
  border-radius:var(--radius-control);
}

.sn-mark{ letter-spacing:-0.01em; }

/* ---- desktop links: quiet by default, chromatic hairline when current ----
   padding-inline (not a wider hit-slop trick) is what gets a 4-letter label
   like "Firm" to a real >=44px tap target -- the matrix measured it at 32px
   wide before this. Pad the box, never the text. */
.sn-link{
  display:inline-flex; align-items:center; justify-content:center;
  min-height:44px; padding-inline:10px;
  font-size:15px; line-height:1.2; letter-spacing:0.01em;
  color:var(--color-ash);
  text-decoration-line:none;
  transition:color var(--dur-fast) var(--ease);
}
.sn-link:hover{ color:var(--color-pure); }
.sn-link[aria-current="page"]{
  color:var(--color-pure);
  text-decoration-line:underline;
  text-decoration-color:var(--color-iris-gleam);
  text-decoration-thickness:1px;
  text-underline-offset:6px;
  text-decoration-skip-ink:none;
}

.sn-rule{
  display:block; width:1px; height:20px;
  background:var(--color-steel);
}

.sn-cta{
  display:inline-flex; align-items:center; justify-content:center;
  min-height:44px; padding-inline:18px;
  border-radius:var(--radius-control);
  background:var(--color-pure); color:var(--color-void);
  font-size:15px; line-height:1.2; letter-spacing:0.01em;
  transition:background-color var(--dur-fast) var(--ease);
}
.sn-cta:hover{ background:var(--color-cloud); }

.sn-burger{
  display:inline-flex; align-items:center; justify-content:center;
  height:44px; width:44px;
  color:var(--color-cloud);
  transition:color var(--dur-fast) var(--ease);
}
.sn-burger:hover{ color:var(--color-pure); }

/* Desktop bar vs. the drawer trigger: width alone is not the signal.
   852x393 / 932x430 / 812x375 (landscape phones, EVERY-SCREEN.md §7 rule 8)
   are all >=768px WIDE, so a min-width:768px breakpoint alone put the full
   five-item bar + CTA into a 48px-tall row on every one of them instead of
   the drawer. Foundation already treats "short + landscape" as the phone
   signal for --nav-h; this reuses the same signal so the trigger and the
   height token never disagree. */
.sn-desktop-nav{ display:none; }
@media (min-width:768px){ .sn-desktop-nav{ display:flex; } }
@media (max-height:500px) and (orientation:landscape){
  .sn-desktop-nav{ display:none !important; }
  .sn-burger{ display:inline-flex !important; }
}
@media (min-width:768px){ .sn-burger{ display:none; } }

/* ---- drawer: fades, never slides; opaque; gutter-aligned ---- */
.sn-drawer{
  position:fixed; inset:0; z-index:40;
  background:var(--color-obsidian);
  overflow-y:auto; overscroll-behavior:contain;
  opacity:0; visibility:hidden;
  transition:opacity var(--dur-menu) var(--ease), visibility 0s linear var(--dur-menu);
}
.sn-drawer[data-open="true"]{
  opacity:1; visibility:visible;
  transition:opacity var(--dur-menu) var(--ease), visibility 0s linear 0s;
}
@media (min-width:768px){ .sn-drawer{ display:none; } }
@media (max-height:500px) and (orientation:landscape){ .sn-drawer{ display:block; } }

/* Fills the viewport so the investor block sits on the bottom edge instead of
   leaving a pool of dead black under the last link. */
.sn-drawer-inner{
  display:flex; flex-direction:column;
  min-height:100dvh;
  padding-top:calc(var(--nav-h) + 32px); padding-bottom:40px;
}
.sn-drawer-foot{ margin-top:auto; padding-top:48px; }

.sn-eyebrow{ color:var(--color-fog); }

.sn-list{ border-bottom:1px solid var(--color-steel); }

/* .t-nav-mobile (globals.css) carries the font-family/weight/size/line-height
   -- clamp(34px, ..., 40px), foundation's fluid anchor for this tier. Only
   the chrome-specific bits (row height, rule, colour, decoration) live here. */
.sn-drawer-link{
  display:flex; align-items:center;
  min-height:64px;
  border-top:1px solid var(--color-steel);
  letter-spacing:-0.018em;
  color:var(--color-cloud);
  text-decoration-line:none;
  transition:color var(--dur-fast) var(--ease);
}
.sn-drawer-link:hover{ color:var(--color-pure); }
.sn-drawer-link[aria-current="page"]{
  color:var(--color-pure);
  text-decoration-line:underline;
  text-decoration-color:var(--color-iris-gleam);
  text-decoration-thickness:1px;
  text-underline-offset:6px;
  text-decoration-skip-ink:none;
}
/* The fifth link -- Investor inquiries, folded into the same list rather than
   a separate pill so the poster reads as one composed list, not a list plus
   a button bolted on. Colour is the only thing that marks it as the action. */
.sn-drawer-link[data-cta="true"]{ color:var(--color-iris-gleam); }
.sn-drawer-link[data-cta="true"]:hover{ color:var(--color-pale-iris); }

.sn-meta-link{
  display:inline-flex; align-items:center; min-height:44px;
  color:var(--color-ash); transition:color var(--dur-fast) var(--ease);
  word-break:break-all;
}
.sn-meta-link:hover{ color:var(--color-cloud); }

@media (prefers-reduced-motion: reduce){
  .sn-header,.sn-link,.sn-cta,.sn-burger,.sn-drawer-link,.sn-meta-link{
    transition-duration:1ms !important;
  }
  .sn-drawer,.sn-drawer[data-open="true"]{ transition:none; }
}
`;

const FOCUSABLE = "a[href], button:not([disabled])";

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  /* Close and hand focus back to the control that opened it. Missed almost
     every time; asserted in the Playwright pass. */
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* Route change closes the drawer, but must NOT steal focus back to the
     hamburger — the router is moving focus to the new document. */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setOpen(false);
  }, [pathname]);

  /* Hairline appears at 8px. Colour only — see note 1. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll lock + focus trap + Escape, all torn down together. */
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    const items = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    const frame = requestAnimationFrame(() => items()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const f = items();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && !!drawerRef.current?.contains(active);
      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open, close]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="sn-header" data-scrolled={scrolled ? "true" : "false"}>
        <div className="wrap nav-frame flex items-center justify-between">
          <Link
            href="/"
            aria-label={`${site.mark} — home`}
            className="sn-mark t-wordmark text-pure inline-flex min-h-11 min-w-11 items-center"
          >
            {site.mark}
          </Link>

          <nav aria-label="Primary" className="sn-desktop-nav items-center gap-7">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="sn-link"
                aria-current={isCurrent(n.href) ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
            <span aria-hidden="true" className="sn-rule" />
            <Link href={CTA.href} className="sn-cta">
              {CTA.label}
            </Link>
          </nav>

          <button
            ref={triggerRef}
            type="button"
            className="sn-burger -mr-2"
            aria-expanded={open}
            aria-controls="site-nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {/* Glyph 1 of 2 on this site: two lines, 1.5px. Glyph 2 is the same
                two lines rotated into the open state. Nothing else is drawn. */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <>
                  <path d="M3.5 3.5 L18.5 18.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M18.5 3.5 L3.5 18.5" stroke="currentColor" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <path d="M0 8.25 H22" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M0 13.75 H22" stroke="currentColor" strokeWidth="1.5" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      <div
        id="site-nav-drawer"
        ref={drawerRef}
        className="sn-drawer"
        data-open={open ? "true" : "false"}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        {/* Same `.wrap` as the header — this is what puts the drawer links on the
            page gutter instead of floating in the middle of the viewport. */}
        <div className="wrap sn-drawer-inner">
          <p className="t-mono-xs sn-eyebrow">Menu</p>

          {/* Five links, one list: the four primary routes plus the CTA,
              same display face throughout (§5.1). The CTA is distinguished by
              colour only — see .sn-drawer-link[data-cta] — not by a separate
              button dropped onto the poster. */}
          <nav aria-label="Menu" className="sn-list mt-6">
            {[...nav, CTA].map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="sn-drawer-link t-nav-mobile"
                data-cta={n === CTA ? "true" : undefined}
                aria-current={isCurrent(n.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="sn-drawer-foot">
            <p className="t-mono-xs sn-eyebrow">Investors</p>
            <a href={`mailto:${site.emails.investors}`} className="sn-meta-link t-small">
              {site.emails.investors}
            </a>
            <p className="t-small mt-2 text-fog">{site.city}</p>
            {/* SessionClock slot (cross-section object, OWNERSHIP.md). sec-motion
                builds src/components/viz/SessionClock.tsx; it does not exist on
                this branch yet, so the slot renders nothing rather than a dash
                placeholder (STATE.md §0.2 item 6 — never render "--:--:--").
                Wire `<SessionClock />` in here once that file lands. */}
          </div>
        </div>
      </div>
    </>
  );
}
