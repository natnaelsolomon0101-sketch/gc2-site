"use client";

/* =============================================================================
   SiteNav — the desktop bar and the mobile drawer as one composed system.

   Design notes that are load-bearing (do not "simplify" these away):

   1. STICKY BORDER, CONSTANT WIDTH. The header always carries a 1px bottom
      border. Only its COLOUR animates (transparent -> hairline-strong) past
      8px of scroll. A border that appears from nothing adds 1px to the
      header box and shifts the whole page down mid-scroll.
   2. THE DRAWER IS LEFT-ALIGNED ON THE PAGE GUTTER. It reuses the same `.wrap`
      container as the header, so a drawer link's left edge is pixel-identical
      to the wordmark's left edge. A centred overlay throws away the hard-left
      discipline the rest of the design is built on.
   3. FOCUS RETURNS TO THE HAMBURGER when the drawer closes. Escape, the
      toggle, and programmatic closes all route through `close()`.
   4. TWO GLYPHS ON THE WHOLE SITE: the hamburger and its open state. Both are
      two lines at 1.5px. No icon library, no chevrons, no arrows.
   5. FOCUS RING IS INK (`ink` #141311, 17.04:1 on ground). LIGHT-PASS.md: no
      accent colour anywhere in the chrome, so the ring is the same token the
      wordmark and every link use, not a separate colour.
   6. LIGHT PASS (round 4, Conductor): ground/ground-2/hairline tokens
      throughout, zero chromatic accent. The current-page underline and the
      drawer's fifth-link (CTA) distinction used to be `iris-gleam`; both are
      ink now -- the underline still marks "current," it just no longer
      borrows colour to do it.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { nav } from "@/config/nav";
import SessionClock from "@/components/viz/SessionClock";

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
  background:color-mix(in srgb, var(--color-ground) 82%, transparent);
  backdrop-filter:blur(20px) saturate(140%);
  -webkit-backdrop-filter:blur(20px) saturate(140%);
  /* constant 1px. only the colour moves. */
  border-bottom:1px solid transparent;
  transition:border-bottom-color var(--dur-menu) var(--ease);
}
.sn-header[data-scrolled="true"]{ border-bottom-color:var(--color-hairline-strong); }

.sn-header :focus-visible,
.sn-drawer :focus-visible{
  outline:2px solid var(--color-ink);
  outline-offset:3px;
  border-radius:var(--radius-control);
}

.sn-mark{ letter-spacing:-0.01em; color:var(--color-ink); }

/* ---- desktop links: quiet by default, ink when current -- no accent ----
   padding-inline (not a wider hit-slop trick) is what gets a 4-letter label
   like "Firm" to a real >=44px tap target -- the matrix measured it at 32px
   wide before this. Pad the box, never the text. */
.sn-link{
  display:inline-flex; align-items:center; justify-content:center;
  min-height:44px; padding-inline:10px;
  font-size:15px; line-height:1.2; letter-spacing:0.01em;
  color:var(--color-ink-2);
  text-decoration-line:none;
  transition:color var(--dur-fast) var(--ease);
}
.sn-link:hover{ color:var(--color-ink); }
.sn-link[aria-current="page"]{
  color:var(--color-ink);
  text-decoration-line:underline;
  text-decoration-color:var(--color-ink);
  text-decoration-thickness:1px;
  text-underline-offset:6px;
  text-decoration-skip-ink:none;
}

.sn-rule{
  display:block; width:1px; height:20px;
  background:var(--color-hairline-strong);
}

.sn-burger{
  display:inline-flex; align-items:center; justify-content:center;
  height:44px; width:44px;
  color:var(--color-ink);
  transition:color var(--dur-fast) var(--ease);
}
.sn-burger:hover{ color:var(--color-ink-2); }

/* Desktop bar vs. the drawer trigger, two rules that must never disagree:
   1. THE THRESHOLD IS 769px, matching --nav-h's own max-width:768px tier
      (globals.css) and the sitewide inner-route scale break (DESIGN.md:
      "Second numbers are at min-width: 769px"). Tailwind's md: is
      min-width:768px -- one pixel off from everything else on this site --
      which used to show the FULL desktop bar squeezed into the compact
      56px nav at exactly 768px, no hamburger in sight. 768 and down is
      drawer territory everywhere on this site now, including here.
   2. WIDTH ALONE IS STILL NOT ENOUGH. 852x393 / 932x430 / 812x375
      (landscape phones, EVERY-SCREEN.md §7 rule 8) are all >=769px wide,
      so the width rule alone put the full five-item bar + CTA into a 48px
      row on every one of them instead of the drawer. Foundation already
      treats "short + landscape" as the phone signal for --nav-h; this
      reuses the same signal so the trigger and the height token agree
      there too. */
.sn-desktop-nav{ display:none; }
@media (min-width:769px){ .sn-desktop-nav{ display:flex; } }
@media (max-height:500px) and (orientation:landscape){
  .sn-desktop-nav{ display:none !important; }
  .sn-burger{ display:inline-flex !important; }
}
@media (min-width:769px){ .sn-burger{ display:none; } }

/* ---- drawer: fades, never slides; opaque; gutter-aligned ----
   ground-2, one step off the page ground, so the poster reads as its own
   surface rather than the page just growing taller (LIGHT-PASS.md: "ground
   or ground-2" -- ground-2 matches the footer's own choice below, so the
   two full-viewport chrome surfaces read as the same kind of object). */
.sn-drawer{
  position:fixed; inset:0; z-index:40;
  background:var(--color-ground-2);
  overflow-y:auto; overscroll-behavior:contain;
  opacity:0; visibility:hidden;
  transition:opacity var(--dur-menu) var(--ease), visibility 0s linear var(--dur-menu);
}
.sn-drawer[data-open="true"]{
  opacity:1; visibility:visible;
  transition:opacity var(--dur-menu) var(--ease), visibility 0s linear 0s;
}
@media (min-width:769px){ .sn-drawer{ display:none; } }
@media (max-height:500px) and (orientation:landscape){ .sn-drawer{ display:block; } }

/* Fills the viewport so the investor block sits on the bottom edge instead of
   leaving a pool of dead black under the last link. */
.sn-drawer-inner{
  display:flex; flex-direction:column;
  min-height:100dvh;
  padding-top:calc(var(--nav-h) + 32px); padding-bottom:40px;
}
.sn-drawer-foot{ margin-top:auto; padding-top:48px; }

.sn-eyebrow{ color:var(--color-ink-3); }
.sn-sessions-label{ margin-top:32px; }
.sn-sessions{ margin-top:8px; }

.sn-list{ border-bottom:1px solid var(--color-hairline); }

/* .t-nav-mobile (globals.css) carries the font-family/weight/size/line-height
   -- clamp(34px, ..., 40px), foundation's fluid anchor for this tier. Only
   the chrome-specific bits (row height, rule, colour, decoration) live here.
   Ink at rest, not ink-2: this is the poster's own big serif type, already
   meant to read as the loudest thing on the surface, not a quiet nav label
   that earns emphasis on hover. Hover steps down to ink-2 instead, the same
   "the interactive object visibly changes" signal without any accent. */
.sn-drawer-link{
  display:flex; align-items:center;
  min-height:64px;
  border-top:1px solid var(--color-hairline);
  letter-spacing:-0.018em;
  color:var(--color-ink);
  text-decoration-line:none;
  transition:color var(--dur-fast) var(--ease);
}
.sn-drawer-link:hover{ color:var(--color-ink-2); }
.sn-drawer-link[aria-current="page"]{
  color:var(--color-ink);
  text-decoration-line:underline;
  text-decoration-color:var(--color-ink);
  text-decoration-thickness:1px;
  text-underline-offset:6px;
  text-decoration-skip-ink:none;
}

.sn-meta-link{
  display:inline-flex; align-items:center; min-height:44px; padding-block:4px;
  color:var(--color-ink-2); transition:color var(--dur-fast) var(--ease);
  word-break:break-all;
}
.sn-meta-link:hover{ color:var(--color-ink); }

@media (prefers-reduced-motion: reduce){
  .sn-header,.sn-link,.sn-burger,.sn-drawer-link,.sn-meta-link{
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
            className="sn-mark t-wordmark inline-flex min-h-11 min-w-11 items-center"
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
            <Link href={CTA.href} className="btn">
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
              same display face throughout (§5.1). Round 0 marked the CTA
              with an accent colour; LIGHT-PASS.md bans accent in the chrome
              entirely, so it is now just the fifth link in the same ink
              list -- its own label and its position do the work a colour
              used to. */}
          <nav aria-label="Menu" className="sn-list mt-6">
            {[...nav, CTA].map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="sn-drawer-link t-nav-mobile"
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
            <p className="t-small mt-2 text-ink-3">{site.city}</p>

            {/* SessionClock (cross-section object, OWNERSHIP.md): sec-motion
                builds it, sec-chrome places it. It renders nothing until
                hydrated (own component, STATE.md §0.2 item 6) and decides
                tablet-vs-phone display itself via a container query, not a
                width check here — the drawer's own width is its container. */}
            <p className="t-mono-xs sn-eyebrow sn-sessions-label">Sessions</p>
            <SessionClock className="sn-sessions" />
          </div>
        </div>
      </div>
    </>
  );
}
