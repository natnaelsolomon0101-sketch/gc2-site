# Design System Master File

> **AUTHORITY:** `docs/ORCHESTRATION.md` Appendix A overrides everything below.
> Anti-patterns for this project: dark canvas, gradients, glassmorphism, shadows,
> icon libraries, pill buttons, uppercase eyebrows, italic accent words, numbered
> section markers, arrow glyphs on links, monospace labels, placeholder metrics.


> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** GC2
**Generated:** 2026-09-02 09:21:21
**Category:** General

---

## Global Rules

*Colors, typography, spacing, shape, elevation, and motion below are Appendix A
verbatim. The generator's own recommendations for these were overridden; see
docs/DECISIONS.md.*

### Color Palette

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FFFFFF` | Page canvas |
| `stone` | `#F3F4F1` | Alternate band, row hover, text on black |
| `hairline` | `#E3E5E1` | All rules and borders on paper |
| `mist` | `#C9CCC7` | Disabled, placeholders |
| `slate` | `#6B7178` | Secondary text, captions, labels |
| `ink` | `#1F2326` | Body text |
| `black` | `#000000` | Display headlines, wordmark, primary button, inverted band |
| `ledger` | `#0F4C3A` | Links, focus ring, active nav underline. Never a fill. |
| `ledger-tint` | `#E8F0EC` | Selected row background only |
| `muted-on-black` | `#9AA0A6` | Secondary text inside the black band |
| `hairline-on-black` | `rgba(255,255,255,0.14)` | Rules inside the black band |

No gradients. No tinted near-blacks. No second accent.

### Typography

**Newsreader** (display, variable, `font-optical-sizing: auto`). Weight 300 for
display/h1/h2, 400 for h3, wordmark, statements. Never above 400, never italic.
**Instrument Sans** (text). 400 body, 500 nav/buttons/labels. Never 600+.
No monospace. `font-variant-numeric: tabular-nums` globally.

| Token | Family/weight | Desktop | <=768 | Leading | Tracking |
|---|---|---|---|---|---|
| `display` | Newsreader 300 | 96 | 52 | 1.00 | -0.01em |
| `h1` | Newsreader 300 | 72 | 44 | 1.02 | -0.01em |
| `h2` | Newsreader 300 | 48 | 34 | 1.08 | -0.005em |
| `h3` | Newsreader 400 | 28 | 24 | 1.20 | 0 |
| `lead` | Instrument Sans 400 | 22 | 19 | 1.45 | 0 |
| `body` | Instrument Sans 400 | 17 | 17 | 1.60 | 0 |
| `small` | Instrument Sans 400/500 | 15 | 15 | 1.50 | 0 |
| `caption` | Instrument Sans 400 | 13 | 13 | 1.50 | 0 |

Body measure <= 34em. Lead <= 30em. Headlines <= 3 lines desktop, <= 2 in the hero.

### Spacing, layout, shape

Container 1240px; gutters 24 mobile / 48 at >=1024. 12 columns, 24px gap.
Section padding 120 desktop / 72 mobile, never below 64. Nav 72px, sticky.
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 120, 160.
Everything left-aligned except the mobile nav overlay.
Radius: buttons/inputs 2px; cards/images 4px. No pills.
Borders 1px `hairline`, spanning the container, not the viewport.

### Elevation

None. There are no shadows in this project. The sticky nav gains a 1px hairline
bottom border after 8px of scroll; that is the only depth cue on the site.

### Motion

150ms hover/focus; 500ms reveals; `cubic-bezier(0.2, 0.8, 0.2, 1)`. CSS only.
One orchestrated moment: on home load the hero lines, subhead, then actions
fade and rise 12px, stagger 70ms, once. No scroll-triggered animation anywhere.
`prefers-reduced-motion`: hero renders final, surface static.

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #EA580C;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #2563EB;
  border: 2px solid #2563EB;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #2563EB;
  outline: none;
  box-shadow: 0 0 0 3px #2563EB20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Hero + Features + CTA

- **Conversion Strategy:** Deep CTA placement. For CTA label text, verify at least 4.5:1 against the button fill; use 7:1 only when the product explicitly targets AAA normal-text contrast. Keep focus and component boundaries independently visible. Disable hero parallax under reduced motion and render its static final state.
- **CTA Placement:** Hero (sticky) + Bottom
- **Section Order:** Hero with headline/image > Value prop > Key features (3-5) > CTA section > Footer

---

## Anti-Patterns (Do NOT Use)


### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
