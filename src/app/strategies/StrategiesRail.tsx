"use client";

import { useEffect, useState } from "react";
import type { Strategy } from "@/content/strategies";

/**
 * StrategiesRail — the sticky-column / horizontal-strip nav from
 * page.tsx's own comment, pulled into its own client component for one
 * reason only: `aria-current` on whichever strategy section is actually in
 * view needs a scroll listener, and the rest of this page has no other use
 * for client-side JS. An IntersectionObserver watches a thin band near the
 * top of the viewport (roughly where a reader's eye already is after
 * following a link down) rather than the whole section — a section taller
 * than the viewport should not keep claiming "current" for its entire
 * height, and a plain "is this section on screen at all" test would do
 * exactly that.
 *
 * Layout (the CSS-only sticky-column-vs-horizontal-strip split) is
 * unchanged from before this file existed — that part never needed JS and
 * still does not; only the `aria-current` value is new.
 */
export default function StrategiesRail({ items }: { items: Strategy[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((s) => document.getElementById(s.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // The LAST section (in document order) that is at least partly
        // inside the band, not the first: a scroll target's own top can
        // land exactly on the band, so its predecessor's still-overlapping
        // bottom edge and its own top can both read as "intersecting" in
        // the same callback. Picking last resolves ties toward the section
        // a reader who just scrolled there is actually looking at, rather
        // than the one they scrolled away from.
        for (let idx = items.length - 1; idx >= 0; idx--) {
          if (visible.has(items[idx].slug)) {
            setActiveSlug(items[idx].slug);
            break;
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="stx-rail" aria-label="Jump to a strategy">
      <ul>
        {items.map((s, k) => (
          <li key={s.slug} style={{ ["--stx-i" as string]: k }}>
            <a
              href={`#${s.slug}`}
              className="t-small"
              aria-current={activeSlug === s.slug ? "true" : undefined}
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
