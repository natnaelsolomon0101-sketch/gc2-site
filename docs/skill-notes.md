# Skill notes

Queries shortened from Appendix B; the literal phrases return zero rows
against this database build. Guidance followed unless it contradicts
Appendix A (Orchestration 0.1).

## minimalism / style


### Result 1
- **Style ID:** minimalism-and-swiss-style
- **Style Category:** Minimalism & Swiss Style
- **Aliases:** Minimal|Minimalism|Minimalism (Frame)
- **Status:** active
- **Parent Style ID:** 
- **Preferred Mode:** auto
- **Type:** General
- **Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential
- **Primary Colors:** Monochromatic, Black #000000, White #FFFFFF
- **Effects & Animation:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading
- **Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools
- **Light Mode ✓:** supported
- **Dark Mode ✓:** supported
- **Performance:** cost:low|drivers:none
- **Accessibility:** risk:low|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion
- **Framework Compatibility:** tailwind|bootstrap|mui
- **Complexity:** Low
- **AI Prompt Keywords:** Design a minimalist landing page. Use: white space, geometric layouts, sans-serif fonts, high contrast, grid-based structure, essential elements only. Avoid shadows and gradients. Focus on clarity and functionality.
- **CSS/Technical Keywords:** display: grid, gap: 2rem, font-family: sans-serif, color: #000 or #FFF, max-width: 1200px, clean borders, no box-shadow unless necessary
- **Implementation Checklist:** ☐ Grid-based layout 12-16 columns, ☐ Typography hierarchy clear, ☐ No unnecessary decorations, ☐ text contrast measured against the chosen project target, ☐ Mobile responsive grid
- **Design System Variables:** --spacing: 2rem, --border-radius: 0px, --font-weight: 400-700, --shadow: none, --accent-color: single primary only


## serif / typography


### Result 1
- **Font Pairing Name:** Luxury Serif
- **Category:** Serif + Sans
- **Heading Font:** Cormorant
- **Body Font:** Montserrat
- **Mood/Style Keywords:** luxury, high-end, fashion, elegant, refined, premium
- **Best For:** Fashion brands, luxury e-commerce, jewelry, high-end services
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
- **Tailwind Config:** fontFamily: { serif: ['Cormorant', 'serif'], sans: ['Montserrat', 'sans-serif'] }
- **Notes:** Cormorant's elegance with Montserrat's geometric precision.

### Result 2
- **Font Pairing Name:** Academic/Archival
- **Category:** Serif + Serif
- **Heading Font:** EB Garamond
- **Body Font:** Crimson Text
- **Mood/Style Keywords:** academic, old-school, university, research, serious, traditional
- **Best For:** University sites, archives, research papers, history
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=EB+Garamond:wght@400;500;600;700;800&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=EB+Garamond:wght@400;500;600;700;800&display=swap');
- **Tailwind Config:** fontFamily: { classic: ['EB Garamond', 'serif'], text: ['Crimson Text', 'serif'] }

## accessibility / ux


### Result 1
- **Category:** Accessibility
- **Issue:** Alt Text
- **Platform:** All
- **Description:** Images need text alternatives
- **Do:** Descriptive alt text for meaningful images
- **Don't:** Empty or missing alt attributes
- **Code Example Good:** alt='Dog playing in park'
- **Code Example Bad:** alt='' for content images
- **Severity:** High

### Result 2
- **Category:** Accessibility
- **Issue:** Error Messages
- **Platform:** All
- **Description:** Error messages must be announced
- **Do:** Use aria-live or role=alert for errors
- **Don't:** Visual-only error indication
- **Code Example Good:** role='alert'
- **Code Example Bad:** Red border only
- **Severity:** High

### Result 3
- **Category:** Accessibility
- **Issue:** Color Contrast
- **Platform:** All

## focus / ux


### Result 1
- **Category:** Accessibility
- **Issue:** Focus Appearance
- **Platform:** Web
- **Description:** WCAG 2.2 AAA defines minimum area and contrast for focus indicators
- **Do:** Use an indicator at least as large as a 2 CSS px perimeter with 3:1 state contrast
- **Don't:** Present this enhanced AAA criterion as an AA requirement or use a thin low-contrast outline
- **Code Example Good:** outline: 2px solid currentColor; outline-offset: 2px
- **Code Example Bad:** box-shadow: 0 0 1px low-contrast
- **Severity:** Medium

### Result 2
- **Category:** Interaction
- **Issue:** Focus States
- **Platform:** All
- **Description:** Keyboard focus, including controls inside a modal, needs a visible indicator
- **Do:** Use a visible focus ring on every interactive control, including modal controls
- **Don't:** Remove focus outline without replacement
- **Code Example Good:** focus:ring-2 focus:ring-blue-500
- **Code Example Bad:** outline-none without alternative
- **Severity:** High


## responsive / ux


### Result 1
- **Category:** Responsive
- **Issue:** Horizontal Scroll
- **Platform:** Web
- **Description:** Avoid horizontal scrolling
- **Do:** Ensure content fits viewport width
- **Don't:** Content wider than viewport
- **Code Example Good:** max-w-full overflow-x-hidden
- **Code Example Bad:** Horizontal scrollbar on mobile
- **Severity:** High

### Result 2
- **Category:** Responsive
- **Issue:** Viewport Meta
- **Platform:** Web
- **Description:** Set viewport for mobile devices
- **Do:** Use width=device-width initial-scale=1
- **Don't:** Missing or incorrect viewport
- **Code Example Good:** <meta name='viewport'...>
- **Code Example Bad:** No viewport meta tag
- **Severity:** High


## performance / nextjs


No matches. This is not a match with an empty value -- the query did not hit the database. Retry with broader/different keywords before falling back to general defaults, and say explicitly that no database match was found if you do fall back.
