# Reference patterns — institutional finance sites

Evidence brief for the GC2 rebuild. Target spec is `docs/ORCHESTRATION.md` Appendix A
(white canvas, Newsreader 300 display, Instrument Sans text, one `#0F4C3A` accent, zero
shadows, 1240px container, hairline rules).

**Method.** Production HTML and the shipped CSS bundles were downloaded directly and parsed
for declared values (`font-size`, `line-height`, `letter-spacing`, `max-width`, `padding`,
`border-radius`, `box-shadow`, hex colors). Headings, nav labels and footer text were
extracted from the served markup in document order. Numbers below are **declared CSS
values**, not screenshots or eyeballed guesses. Where a value is inferred (e.g. summing two
header rows to get nav height) it is marked *inferred*. Where a site could not be fetched it
says so and nothing is invented.

Fetched 2026-09-02.

| Site | Home | About/firm | Article | Legal | Method |
|---|---|---|---|---|---|
| Blackstone | ✗ 403 | ✗ | ✗ | ✗ | **blocked — no data** |
| KKR | ✓ | ✓ `/about` | ✓ | ✓ `/terms-of-use` | HTML + 3.9MB CSS |
| Apollo | ✓ | ✓ `/aboutus` | — | ✓ `/governance/disclosures` | HTML + 2.1MB CSS |
| Brookfield | ✓ | ✓ `/about-us/who-we-are` | ✓ | ✓ `/terms-use` | HTML + 830KB CSS |
| Carlyle | ✓ (WebFetch) | ✓ `/about-us` | ✓ | ✓ `/notices-and-disclaimers` | rendered-text only, no CSS |
| TPG | ✓ | ✓ `/about-us/who-we-are` | ✓ | ✓ `/uk-eu-disclosures` | HTML + 307KB CSS |

---

## 1. Blackstone — could not be fetched

`https://www.blackstone.com/` and `/our-firm/` returned **HTTP 403** to every attempt: WebFetch,
and curl with a full Chrome header set (UA, `sec-ch-ua`, `Sec-Fetch-*`, `Accept-Language`,
`Upgrade-Insecure-Requests`). Response body was 3.5KB of bot-challenge, not page content.

**No measurements are recorded for Blackstone.** Appendix A §A.2 already names Blackstone as a
reference; nothing in this document confirms or contradicts that, and nothing here should be
attributed to it. If Blackstone evidence is required, it needs a real headless browser session
with a JS-capable engine (the `/browse` skill), not an HTTP fetch.

---

## 2. KKR — `kkr.com`

**Stack.** Adobe AEM. Single 3.9MB CSS bundle (`clientlib-all`). Type family `"Ghost"` with
`"Ghost Bold" / "Ghost light" / "Ghost Medium"` as separate families — a sans, no serif anywhere.
`'Times New Roman', serif` appears only as a fallback string.

**Nav.** Interstitial "Select Your Experience" region gate (`h4`) fires before the site — Global
vs. Wealth Professionals. Header is a mega-menu: 5 groups (About, Approach, Invest, Insights,
Careers) plus Investor Relations / Media Center / Careers / Locations / Contact. `Invest` alone
carries 9 children (Private Equity, Infrastructure, Real Estate, Credit, Solutions, Capital
Markets, Insurance, Strategic Partnerships, Portfolio). Nav item padding `1rem` (16px); toggle
`height:48px` → **nav row ≈ 80px** *(inferred: 48 + 2×16)*.

**Wordmark.** SVG monogram, left. No lockup tagline.

**Type (declared).**
- `html, body`: `font-size:16px; line-height:1.5em; letter-spacing:.05em`
- `h1` (fullwidth teaser / hero): `4rem` (64px) / `line-height:4.5rem` (72px, ratio **1.125**), `font-weight:300`, `letter-spacing:.05em`
- `h1.hero` alt: `3.8125rem` (61px) / `1.18`
- Step down: `3rem` (48px) / `3.5rem`; `2.5rem` (40px) / `3rem`; mobile `1.9375rem` (31px)
- Weight distribution across the bundle: `400` ×142, `700` ×135, `300` ×92, `500` ×25
- `letter-spacing` only ever positive: `.05em` ×152, `.1em` ×52. **KKR tracks display type OUT, not in.**

**Layout.** `max-width:1145px` is the dominant container (×66), with `1380/1400` for full-bleed
media. Section rhythm: `padding-bottom:64px` → `128px` at desktop; other repeated section
values 80, 100, 125px.

**Businesses.** `/invest/*` = 9 flat routes; presented on the home page as an image-card grid
under `Investing in People, Companies, & Communities`, not a table.

**Home section order.** Rotating hero (`50 years of excellence / partnership / performance /
innovation` — four `h1`s swapped in one slot) → mission `h2` → `Investing in People, Companies,
& Communities` → `Explore Our Shared Success Stories`.

**Footer.** `background-color:#000`, container `padding:2rem 3rem` (32/48px). Five uppercase link
groups (ABOUT / APPROACH / INVEST / INSIGHTS / CAREERS) + CLIENT PORTAL, INVESTOR RELATIONS,
MEDIA CENTER + utility row: Contact Us, Subscribe, Locations, Manage Cookies, Privacy and Cookies,
Terms of Use, Security and Fraud, Compliance, Disclosures, Accessibility. Copyright at
`font-size:11px`: `© 2026 Kohlberg Kravis Roberts & Co. L.P. All Rights Reserved.`
**No prose disclaimer in the footer** — it is a link to `/disclosures` instead.

**Article.** `/insights/total-portfolio-approach-faq` — single `h1`, then chart `h4`s
(`Expected Return Range of Outcomes, %`). Measure: no `.prose` token; article grids run
`max-width:1145px` with an inner column, plus `44rem` (704px) and `56.875rem` (910px) blocks.
Related-insights teasers `max-width:236px`.

**Legal.** `/terms-of-use` is one `h1` and unstructured prose — no sub-headings in the markup.

**Conspicuously does NOT.** No serif. No ticker. No monospace. Radius is near-zero
(`0` ×22, `2px` ×4) except `50%` avatars and one `90rem` pill. But: **47 non-`none` `box-shadow`
declarations**, and a region interstitial before content.

---

## 3. Apollo — `apollo.com`

**Stack.** AEM. `Graphik` (sans) paired with **`Adobe Garamond Pro` (serif)** — a true two-family
system, the closest analogue to Appendix A's Newsreader/Instrument Sans split.

**Nav.** Two-tier. Top strip is an audience switcher: General Public | Institutional Investors |
Public Shareholders | Wealth Professionals | Investors | Former Employees | Portfolio Companies |
Media. Below it the product nav. `.apollo-header-top{padding:1pc 0}` and
`.apollo-navigation-desktop{padding:1pc 0}` (`1pc` = 16px), nav items `height:20px`, logo
`height:17px` → **header ≈ 100px over two rows** *(inferred: 2 × (17–20 + 32))*.

**Wordmark.** SVG at **17px cap height** — deliberately small.

**Type (declared).**
- `.header-title h1`: `6pc` = **96px** / `line-height:75pt` = **100px** (ratio **1.042**), `font-weight:400`, `letter-spacing:-.015em`
- Tablet: `60px / 62px` (1.033). Mobile: `3pc` = `48px / 52px` (1.083)
- Body scale by frequency: `18px` ×215, `14px` ×204, `20px` ×82, `36px` ×73, `24px` ×68, `28px` ×51
- Weights: `400` ×610, `500` ×303, `700` only ×41, `600` ×13 — **effectively a 400/500 site**
- Tracking: `-.015em` ×44 and `-.0125em` ×19 on display; `.065/.06/.05em` on small caps labels

**Layout.** Header and search containers `max-width:84pc` = **1344px**. Breakpoints 767/768/991/992.
Section padding clusters at 20, 24, 28, 40, 56, 60px.

**Businesses.** `/strategies/*` is a **3-level taxonomy**: `asset-management/{credit,equity,
real-assets,financial-services}` each with 2–4 children (16 leaf strategies), plus
`/strategies/retirement` and `/strategies/financing-companies`. Rendered as image cards in a
mega-menu, not a hairline list.

**Home section order.** THINK tabs (Capital / Retirement / Credit / Portfolios / Equity) →
`Asset Manager, Capital Provider, Wealth & Retirement Solutions` → `What if the world doesn't
work the way you think it does?` → Insights → News & Updates → The Apollo Culture → audience
router (`Looking for a site tailored to you?`).

**Footer.** `background:#44413e` (warm dark grey, not black), container `padding:2pc 0` (32px),
side padding `2pc`/`3pc`. Legal lives under `/governance/*` as **eight separate documents**:
disclaimer, disclosures, form-crs, forward-looking-statements, privacy-policy, terms-of-use,
cookies, web-fraud---phishing. `/governance/disclosures` renders a single `h1 Governance` and
prose.

**Conspicuously does NOT.** No weight above 500 in normal use. But it **does** use pills:
`border-radius:50px` ×38, `44px` ×22, `20px` ×26 — and **120 non-`none` `box-shadow`
declarations**, the most of any site measured.

---

## 4. Brookfield — `brookfield.com`

**Stack.** Drupal + Tailwind. `html{font-size:10px}` — **the whole site is a 10px rem base**, so
`1.6rem` = 16px. Families: `Season Sans` (sans) + `Season Mix` (serif).

**Nav.** `header.main-header .header-inner{height:54px}`; the backdrop `.header-bg-outline` is
`54px` collapsed and `86px` expanded. Container `max-width:1920px`, gutters `12px`/`20px`.
Nav buttons `padding:17px 16px`, `height:2rem` (20px). **Nav height = 54px — the shortest measured.**
Groups: About Us (5), Asset Management / Wealth Solutions, Capabilities (6), Invest (3),
Shareholders (ticker list), Careers.

**Type (declared, ×10 to get px).** `1.2rem`=12 · `1.3`=13 · `1.4`=14 · `1.6`=16 · `1.8`=18 ·
`2.0`=20 · `2.4`=24 · `2.8`=28 · `3.6`=36 · `4.2`=42 · `5.6`=56 · **`6.4rem` = 64px display**.
Frequency: `1.6rem` ×61, `1.4rem` ×34, `1.8rem` ×33.
Weights are **custom variable-font stops**: `400` ×78, **`550` ×56**, **`420` ×29**, **`650` ×19`**.
Tracking `.02em` ×27, `-.01em` ×11.

**Layout.** `.container` max `1440px` with `padding-left/right:3.2rem` = **32px gutters**;
`.fluid-container-narrow` `1608px`; full `1920px`. Tailwind breakpoints 640/768/1024/1280/1440.
Section rhythm is machine-generated and irregular: `padding-top` 93, 124, 149, 150, 155, 165px.

**Businesses.** Split into **Businesses** (2: Asset Management, Wealth Solutions) and
**Capabilities** (6: Infrastructure, Energy, Private Equity, Real Estate, Credit, Retirement
Services). Rendered as image cards.

**Home section order.** `h1 Own What's Next` → one-sentence `h2` → **4-cell stat row** (Assets
under management / Professionals / Countries / Operating employees, each an `h3` label over a
value) → video → Oaktree band → 4 thematic blocks → `Explore other ways we partner` (3 audience
cards) → Ecosystem → Recent highlights → **10-item PEI awards grid** → Featured insights (3).

**Footer.** `footer.main-footer{background-color:rgb(0 37 64)}` = **`#002540` navy**, not black.
`.footer-inner{padding-top:60px; padding-bottom:24px}`, `.footer-top{padding-bottom:40px→200px}`.
Six link groups, then a legal row: Privacy, Terms of Use, Accessibility Notice, Cookie Policy,
Cookie Settings, Your Privacy Choices, Privacy Notice, Fraud Warning, Complaints Policy –
Australia, Canal Confidencial. `© 2026 Brookfield`. Language switcher (EN/FR/PT/中国/대한민국).
**No prose disclaimer in the footer.**

**Legal.** `/terms-use` is the one properly structured legal page in the set: `h1 Terms of Use`,
`h2 Directory`, then 12 `h3` sections — Introduction, Use of the Website and Content, Suitability,
Restricted Access, Website Disclaimers and Limitations of Liability, Indemnification, Linked
Websites, Password Protected Links, User Content, Material Interests, Notice to California
Residents, Governing Law. **This is the model Appendix A's `/disclosures` should follow.**

**Article.** `/views-news/insights/private-credit-beyond-direct-lending`: `h1`, then
`h2 Key Takeaways` before the body, then `h2` sections interleaved with `h2 Figure 1/2/3:` chart
captions. Article image carousel `max-width:1092px`. No `.prose` measure token.

**Palette (by frequency).** `#fff` ×481, `#001625` ×353 (near-black navy ink), `#f2f1ef` ×236
(warm stone), `#e5e3dd` ×204 (hairline/stone), `#14486e` ×43 (accent blue), `#d9d7d1` ×30.
**A four-value achromatic-warm ramp plus one blue — structurally the same idea as Appendix A §A.3.**

**Conspicuously does NOT.** Radius stays tiny — `2px` ×31, `2.4px` ×14, `1px` ×10, `4px` ×11;
only 3 `9999px` pills in 830KB. Only **18** non-`none` `box-shadow` declarations. No pure black
anywhere in quantity (`#000` ×11).

---

## 5. Carlyle — `carlyle.com`

**Fetch note.** curl was blocked (403); WebFetch rendered the pages. **No CSS bundle was
retrievable, so there are no declared numeric values for Carlyle.** Structure only.

**Nav.** Four items, all question-shaped: `Who We Are` · `Who We Serve` · `What We Do` ·
`Insights & Education`. **The shortest top-level nav of the five reachable sites.**

**Wordmark.** SVG, top-left, links home.

**Home section order.** Hero `A world of connections shaping private markets` → four-point
"Power of Connection" narrative → **3-item capability grid** (Global Private Equity, Global
Credit, Carlyle AlpInvest) → `Carlyle by the Numbers` ($485B AUM · 28 offices · 38+ years) →
3 featured articles → one case study (Clair Global) → 3 audience cards → 6 leadership profiles.

**About.** `/about-us`: hero `A global investment management firm built on connection`, then
`Who We Are` → `Where insight, access, and partnership come together` → `Who We Serve` →
`Shaping private markets with our partners` → `Carlyle by the Numbers` → `Our Global Reach` →
`An integrated global investment platform`. Stats: **$485B AUM · 678 investment vehicles ·
275 portfolio companies · 28 offices · 2.5K+ professionals**.

**Businesses.** 3 platforms, image cards with CTA links.

**Article.** `/carlyle-compass/...`: hero banner image, **named byline with title**
(Jason Thomas, Partner, Head of Global Research & Investment Strategy), date (August 25, 2026),
series label (The Carlyle Compass), single column, **3 embedded figures**, ~600–700 words,
then a **closing legal disclaimer** — *"Economic and market views and forecasts reflect our
judgment as of the date of this presentation and are subject to change without notice."* —
then a newsletter box. **No prev/next, no related items.**

**Legal.** `/notices-and-disclaimers` is a **single page holding nine stacked sections**
(~127 paragraphs): Notices and Disclaimers, Fake News and Fraudulent Activity, Transparency &
Reporting, Cookies Policy, Privacy Notice, Notice to California Residents, Notice to Users in
Europe, Recruitment Privacy Notice, Terms of Use Policy.

**Footer.** Four groups (Our Platform / Our Perspectives / Connect with Us / Login) + a legal
row of six links.

**Conspicuously does NOT.** No performance figures, only scale figures. No prev/next chrome on
articles.

---

## 6. TPG — `tpg.com`

**Stack.** Next.js + WordPress + Tailwind. Single **307KB** CSS bundle — **an order of magnitude
smaller than KKR (3.9MB) or Apollo (2.1MB)**. One family: `MaisonNeue` sans. No serif.

**Nav.** **Seven items total**: wordmark `TPG` | Approach | Global Wealth Solutions |
News & Insights | About | LP Login | Shareholders. `.site-header svg.logo{height:60px}`
(`32px` on the Rise theme), active state is an `::after` bar at `height:2px`.
**Nav ≈ 90–100px** *(inferred from a 60px logo plus padding)*.

**Type (declared).**
- `body`: `.9375rem` (15px) / `1.375rem` (22px) mobile → `1rem` (16px) / `1.5rem` (24px), **`letter-spacing:-.02em` on body text**
- `h1` desktop: **`5.25rem` = 84px / `6.5rem` = 104px (ratio 1.238), `letter-spacing:-.02em`**
- `h1` mobile: `2.75rem` = 44px / `3.5rem` = 56px
- `h1..h6` are reset to `font-size:inherit; font-weight:inherit` and re-typed by class
- Also declared: `120px`, `64px`, `40px`, `32px`, `24px`; rem scale `1 / 1.125 / 1.25 / 1.5 /
  1.625 / 2 / 2.375 / 2.75 / 3.75 / 4 / 5.25 / 10rem`
- Weights: `400` ×20, `500` ×7, `300` ×6 — **~33 weight declarations in the entire bundle**
- Tracking: **`-.02em` ×83** — one tracking value, applied everywhere

**Layout.** `.container` / `.wrapper` responsive ladder **640 → 768 → 1024 → `1296px`**.
Section blocks `padding-top: 72px` (×6), then 94, 104, 106, 108, 109, 118, 132, 156px.

**Businesses.** Two axes: **Platforms** (6: Capital, Growth, Impact, Credit, Real Estate,
Market Solutions) and **Approach**/sectors (5: Healthcare, SET, IDMC, Consumer, Business
Services). Home renders `Our Platforms` as six `h3`s.

**Home section order.** `h1 Meet TPG` → `Focused on Innovation` → `Overview` (`Built for a
distinctive approach`, `TPG at a Glance`) → `News & Insights` (3 featured) → Global Wealth
Solutions → `What We Do` / `Our Platforms` (6) → `TPG News` (12 `h3` items, reverse-chron
hairline list) → LinkedIn newsletter signup.

**About.** `/about-us/who-we-are` is `h1 About` + `h1 Who We Are` (**two `h1`s — an a11y defect**)
then a filterable people directory of ~200 `h3` names.

**Footer.** `.site-footer{background-color:rgb(30 30 30)}` = **`#1e1e1e`**, `padding-top:3rem`
→ `5rem`; `.site-footer--last-line{padding-top:108px; padding-bottom:2.25rem→4rem;
font-size:.75rem}` (**12px legal line**), gutters `24px`, copy container `2rem`.
Groups: Our Approach (6) / About Us (4) / Platforms (7) / News & Insights (3) / LP Login /
Shareholders / Legal Notices & Terms of Use / Privacy & Cybersecurity / Vendor Code of Conduct.
Legal line: `© 2026 Tarrant Capital IP, LLC, All Rights Reserved. TPG, the Half Star logo, and
related marks and logos are service marks or registered marks owned by Tarrant Capital IP, LLC.`

**Article.** `/news-and-insights/...`: single `h1`, then `h4` sub-sections. `/uk-eu-disclosures`
is a bare `h1` + prose.

**Palette.** `#0055ff` ×27 is the single loudest hex — an electric blue link/accent.
`#1e1e1e` footer, `#f4f4f4`/`#e7e7e7` surfaces, `#6b7280`/`#9ca3af`/`#a0a0a0` greys.
The rest (`#288dc1`, `#bc9e60`, `#00548b`, `#00837e`, `#00ad68`) appear ~4× each — platform tags,
not system colors.

**Conspicuously does NOT.** **Only 8 non-`none` `box-shadow` declarations** and **7 radius
declarations** in the whole bundle (`8px` ×11, `0` ×7). No serif. No stat band on the home hero.
No mega-menu.

---

## 7. Refero style pages (numeric tokens)

`styles.refero.design` blocks curl (403); WebFetch rendered the style pages.
**Increase is not listed in the Refero fintech index and could not be located — no data.**
Mercury was in the index but was not in scope for this brief.

### Public — `/style/9d16aa65-cef7-4bf7-83c8-91837a248cd9`
- **Type sizes:** 10/1.5 · 11 · 12 · 14/1.54 · 16/1.15 · 20/1.2 · 24/1.2 · 32/1.15 · 48/1.12 · 52/1.11 · **80/1.05**
- **Weights:** 300, 400, 500, 600
- **Spacing:** 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 56, 64, 76, 80, 112
- **Radii:** 1, 4, 8, 12, 16, 100, 310, 375, 379, 999
- **Layout:** max-width **1200**, section gap **64**, card padding 16, element gap 8
- **Colors:** `#ffffff` `#f3f6f9` `#e9edf3` `#dce2ea` `#a8b4bf` `#516880` `#1b2128` `#262626` `#000000` — plus exactly **two** chromatic values, `#0027b3` and `#95d0ff`
- Type system: **Denton 300 serif display + Inter sans utility** — the same serif-display/sans-text split Appendix A specifies.

### Compound — `/style/cd31ecdb-297a-4fc5-a727-05f835ff917f`
- **Type sizes:** 12 · 14 · 16 · 18 · 36 · 48 · 58 · 60 · **72**
- **Line heights:** 1.00, 1.10, 1.11, 1.25, 1.33, 1.38, 1.43, 1.50, 1.56, 1.71
- **Weights:** **400 only**
- **Spacing:** 8, 16, 24, 32, 40, 48, 56, 64, 80, 112, 128, 160, 176
- **Radii:** 8, 20, 24, 28, 9999
- **Layout:** max-width **1200**, section gap **80**, card padding 24, element gap 8
- **Colors:** `#171717` `#ffffff` `#e5e7eb` `#f3f3f3` `#6f6f6f` `#5e5e5e` `#a0a0a0` `#222222` `#c7c7c7` `#dbdbdb` `#000000` `#8f8f8f` — **eleven greys and one warm `#ffe9bf`**
- Shadow opacities 0.01–0.10 — shadows exist but are near-invisible.

### Origin Financial — `/style/c60f05ff-2420-4a24-92db-80c4b6a74683`
- **Type sizes:** 11 · 12 · 14 · 16 · 18 · 38 · 80 · **96**
- **Line heights:** **0.9**, 1.0, 1.5, 1.67, 2.0, 2.18
- **Weights:** 300, 400, 500
- **Tracking:** 0 · 0.016em · 0.021em · **0.182em** and 2px on 11px uppercase labels
- **Spacing:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 60, 68, 100, 120, 140
- **Radii:** 8 (inputs/buttons/nav), 16 (cards), 30 (feature cards), 9999 (pills)
- **Layout:** max-width **1200**, section gap **80**, card padding 32, element gap 12
- **Colors:** `#000000` `#090a0b` `#0f1011` `#2e2e2e` `#3f4041` `#6a6b6b` `#9f9fa0` `#cacaca` `#f5f5f7` `#ffffff` + six accents (`#847dff` `#00b3dd` `#d1c9ff` `#4b49aa` `#dd90d8` `#90b8f0`)
- **Lyon Display 300 at 0.9 line-height**; surfaces differentiated by color step, **not shadow**.
- **Caveat: Origin is a dark canvas (`#0f1011`) with six accents and Roboto Mono labels.** It is a
  counter-example to Appendix A on color and canvas, and a confirmation on weight-300 display type.

---

## Shared patterns — numbers

Every figure is a declared CSS value from a shipped bundle unless marked *(inferred)* or
*(structure only — no CSS)*.

**Container width.** 1145 (KKR) · 1200 (Public, Compound, Origin) · 1296 (TPG) · 1344 (Apollo) ·
1440 (Brookfield `.container`). **Median 1272. Appendix A's 1240px sits inside the cluster.**

**Nav height.** 54 (Brookfield, declared) · ~80 (KKR, *inferred*) · ~90–100 (TPG, *inferred* from a
60px logo) · ~100 (Apollo, *inferred*, two rows). **Appendix A's 72px is in range; nobody exceeds
~100px on a single tier.**

**Top-level nav items.** 4 (Carlyle) · 6 (Brookfield) · 7 (TPG) · 8+ (Apollo audience strip) ·
9 (KKR groups). **Appendix A's 4 links + 1 button matches the tight end (Carlyle, TPG).**

**Display headline size, desktop.** 64 (KKR, Brookfield) · 72 (Compound) · 80 (Public) ·
84 (TPG) · **96 (Apollo, Origin)**. **Appendix A's 96px display / 72px h1 is at the top of the
observed range, matched exactly by Apollo (96/100) and Origin (96).**

**Display headline size, mobile.** 31 (KKR) · 44 (TPG) · 48 (Apollo). **Appendix A's 52px is
above every measured mobile value.**

**Display line-height.** 0.90 (Origin) · 1.00 (Compound) · 1.042 (Apollo 96/100) · 1.05 (Public
80/84) · 1.11–1.12 (Public 48/52) · 1.125 (KKR 64/72) · 1.238 (TPG 84/104).
**Appendix A's 1.00 display / 1.02 h1 is inside the tight institutional band of 0.90–1.05.**

**Display weight.** 300 (KKR h1, Public, Origin, Appendix A) · 400 (Apollo, Compound, TPG).
**Nobody sets a display headline above 400.** Apollo's whole 2.1MB bundle uses `700` only 41
times against `400` ×610 and `500` ×303; TPG declares **33 weights total** across 307KB.

**Display tracking.** −0.02em (TPG, on body too) · −0.015em (Apollo) · −0.01em (Brookfield) ·
0 (Compound) · **+0.05em (KKR — the outlier; KKR tracks display OUT)**.
**Appendix A's −0.01em matches Brookfield exactly and sits inside Apollo/TPG.**

**Body size.** 15→16 (TPG) · 16 (KKR, Brookfield `1.6rem`, Public, Compound, Origin) ·
18 (Apollo, `18px` ×215 — its most-declared size). **Appendix A's 17px sits between the two
clusters; nobody ships 17.**

**Body line-height.** 1.5 (KKR `1.5em`, Public 14/1.54, Origin) · 1.5–1.56 (Compound).
**Appendix A's 1.60 is one notch looser than every measured site.**

**Section vertical rhythm.** Public **64** · KKR **64 → 128** · TPG **72** (×6, its most common)
· Compound & Origin **80** · Brookfield **93/124/149/150/155/165** (generated, no scale).
**Appendix A's 120 desktop / 72 mobile brackets the measured range; 72 is exactly TPG's value
and 120 is inside Origin's spacing scale.**

**Spacing scale.** Public `4·8·12·16·20·24·28·32·36·40·44·56·64·76·80·112` ·
Origin `4·8·12·16·20·24·32·40·48·60·68·100·120·140` ·
Compound `8·16·24·32·40·48·56·64·80·112·128·160·176`.
**Appendix A's `4·8·12·16·24·32·48·64·96·120·160` is a strict subset pattern of all three.**

**Gutters.** 12/20 (Brookfield header) · 24 (TPG footer) · 32 (Brookfield `.container`
`3.2rem`) · 48 (KKR footer `3rem`). **Appendix A's 24/48 matches TPG and KKR.**

**Border radius.** Brookfield `2px` ×31 / `2.4px` ×14 / `1px` ×10 · KKR `0` ×22, `2px` ×4 ·
TPG `8px` ×11, `0` ×7 · Public `1·4·8·12·16` · Compound `8·20·24·28` · Origin `8·16·30`.
**The three real institutional sites cluster at 0–4px. Radius ≥8px and pills appear on Apollo
(`50px` ×38, `44px` ×22) and on the product-fintech references, not on the allocator-facing
firms.** Appendix A's 2px/4px matches Brookfield and KKR.

**Shadows (non-`none` declarations per bundle).** TPG **8** in 307KB · Brookfield **18** in 830KB ·
KKR **47** in 3.9MB · Apollo **120** in 2.1MB. Compound's are 0.01–0.10 alpha.
**Nobody ships zero — but TPG at 8 and Brookfield at 18 are effectively zero at page scale.**

**Palette shape.** Every measured system is a white/near-white canvas, a 4–6 step achromatic or
warm-neutral ramp, one near-black ink, and **1–2 chromatic values**:
Brookfield `#fff → #f2f1ef → #e5e3dd → #d9d7d1 → #001625` + `#14486e`;
TPG `#fff → #f4f4f4 → #e7e7e7 → #a0a0a0 → #1e1e1e` + `#0055ff`;
Public 6 greys + `#0027b3`/`#95d0ff`; Compound 11 greys + one warm `#ffe9bf`.
**Appendix A's paper/stone/hairline/mist/slate/ink/black + one `#0F4C3A` is structurally
identical, and has one MORE neutral step than any measured site.**

**Footer band.** Always a dark full-bleed band: `#000` (KKR) · `#1e1e1e` (TPG) · `#002540`
(Brookfield) · `#44413e` (Apollo). Legal copy always the smallest type on the page:
**11px (KKR) · 12px (TPG)**. **Appendix A's black band + 13px caption matches the pattern and is
the largest legal type of the set.**

**Legal architecture.** Two models. (a) **Split** — Apollo: 8 separate `/governance/*` documents;
KKR: 6 separate footer legal links. (b) **Consolidated** — Carlyle: one `/notices-and-disclaimers`
with 9 stacked sections / ~127 paragraphs; Brookfield: `/terms-use` with an `h2 Directory` and
**12 `h3` sections**. **No site puts a prose disclaimer in the footer itself — the footer carries a
link, and the disclosure lives on its own route.**

**Article layout.** All measured articles are one column with a serif-or-sans `h1`, a date and a
category, sub-headings, and figures. Carlyle carries a named byline with title; KKR, Brookfield
and TPG do not surface one prominently. **Carlyle is the only one with a closing per-article
disclaimer paragraph.** Nobody ships prev/next. **No site declares a `.prose` measure token** —
KKR's nearest are `44rem` (704px) and `56.875rem` (910px); Brookfield's article carousel is
1092px. **Appendix A's 680px measure is narrower than anything shipped.**

**Stat rows.** Brookfield **4 cells** (AUM / Professionals / Countries / Operating employees);
Carlyle **5** ($485B · 678 · 275 · 28 · 2.5K+) *(structure only)*; TPG `TPG at a Glance`.
**Four cells is the modal count and matches Appendix A's Facts row exactly.**

**Business/strategy listing form.** Image-card grid: KKR (9), Apollo (16 leaf), Brookfield (6),
Carlyle (3). Text list: TPG (6 `h3` platforms). **Nobody ships a hairline row list with a
markets column. Appendix A's HairlineList is not a copied pattern — it is a departure.**

---

## What Appendix A should adopt / ignore

### Adopt — already correct, now backed by numbers

- **Keep the 1240px container.** Measured range 1145–1440, median 1272, with three of six
  references landing on exactly 1200. 1240 is dead center; no reason to move it.
- **Keep 96px display / 72px h1 at weight 300.** Apollo ships 96px at weight 400 and Origin
  ships 96px at 300; nobody in the set exceeds 96, and nobody sets a display headline above
  weight 400. The spec is at the ceiling of observed practice, which is where it wants to be.
- **Keep display line-height at 1.00–1.02.** The institutional band is 0.90–1.125 and the
  tightest values belong to the biggest type (Origin 0.9 at 96px, Apollo 1.042 at 96px). A
  96px headline at 1.00 is normal here, not aggressive.
- **Keep −0.01em display tracking.** It equals Brookfield's exactly and sits between Apollo
  (−0.015) and TPG (−0.02). KKR's +0.05em is the only positive value in the set and reads as a
  house eccentricity, not a convention — do not follow it.
- **Keep the spacing scale.** `4·8·12·16·24·32·48·64·96·120·160` is a clean subset of Public's,
  Origin's and Compound's published scales; Brookfield, which has no scale, produces
  93/124/149/155/165px section paddings and looks arbitrary in the CSS. Having a scale is the
  differentiator.
- **Keep 2px/4px radii and zero shadows.** Brookfield ships `2px` ×31 and only 18 shadows;
  TPG ships 8 shadows and 7 radius declarations total. The allocator-facing firms are already
  at the floor — going to exactly zero is a one-step extension of what they do, not a stunt.
  The pills and 9999px radii live on Apollo and on the product-fintech references, which sell
  to consumers.
- **Keep the black footer band with the smallest type on the page.** Universal: four of four
  measurable sites use a dark full-bleed footer, and legal copy is 11–12px. 13px is fine.
- **Keep the 4-cell Facts row.** Brookfield ships exactly four; four is the modal count.
- **Keep one accent used for links only.** Every measured palette is a neutral ramp plus 1–2
  chromatic values (`#14486e`, `#0055ff`, `#0027b3`). `#0F4C3A` used for links and focus only
  is the same discipline.
- **Adopt Brookfield's `/terms-use` structure for `/disclosures`.** It is the only legal page in
  the set with real heading structure (`h2 Directory` + 12 `h3` sections). Appendix A already
  specifies seven named sections — that is the right model, and it beats KKR's and TPG's
  undifferentiated prose walls.
- **Adopt Carlyle's per-article closing disclaimer.** Carlyle is the only site that closes each
  note with a scope disclaimer. Appendix A §A.8 already specifies one for `/insights/[slug]`;
  this confirms it is house practice, not over-caution.
- **Keep the tight nav.** Carlyle ships four top-level items, TPG seven. Appendix A's four
  links plus one button is at the disciplined end of live practice.

### Adopt with a change

- **Reconsider 17px body → 16px.** Six of six references ship 15/16px or 18px. Nobody ships 17.
  17px is a value with no support in the set and it will fight the 4px spacing scale. 16px
  matches KKR, Brookfield, TPG, Public, Compound and Origin.
- **Reconsider 1.60 body leading → 1.50–1.55.** KKR ships `1.5em`, Public 14/1.54, Compound
  tops out at 1.56. 1.60 is looser than every measured site; on a 34em measure it will read
  airy rather than institutional.
- **Reconsider the 52px mobile display → 44–48px.** TPG ships 44px and Apollo 48px at mobile;
  KKR drops to 31px. 52px is above the whole range and is the value most likely to force a
  three-line hero on a 375px screen, which Appendix A's own "≤2 lines in the hero" rule forbids.
- **Reconsider the 680px article measure → 700–740px.** Nobody publishes a measure token, but
  KKR's article blocks resolve to 704px and 910px and Brookfield's to 1092px. At 18px body,
  680px is ~38 characters narrower than KKR's 704px column. 680 is defensible but it is the
  narrowest thing in the set — make it a deliberate choice, not an accident.

### Ignore — observed but wrong for this project

- **Ignore the audience interstitial / region gate.** KKR blocks the site behind
  "Select Your Experience" and Apollo runs an 8-item audience strip above the nav. Both exist
  because those firms serve retail wealth channels, retirement products and public shareholders
  under different regulatory regimes. GC2 has one audience. A gate would be theater.
- **Ignore the mega-menu.** Apollo's `/strategies/*` is three levels deep with 16 leaf routes;
  KKR's Invest group has nine. Appendix A has six strategies on one page. A mega-menu for six
  anchors would be scaffolding without a building.
- **Ignore image-card grids for the strategy list.** Four of five reachable sites render
  businesses as image cards. Every one of those cards needs photography, and Appendix A §A.2
  commits to no imagery. A hairline row list carrying name / one-liner / markets is a departure
  from the reference set — make it deliberately, because the alternative is stock photos.
- **Ignore Origin Financial's canvas, palette and label type.** Origin is `#0f1011` dark with
  six accents, Roboto Mono uppercase labels at 10–12px with 0.182em tracking, and 30px feature-card
  radii. It confirms weight-300 display and surface-step depth; it contradicts §A.3 (canvas,
  one accent), §A.4 (no monospace) and §A.7 (uppercase tracked labels, dark canvas). Take the
  type weight, leave everything else.
- **Ignore Apollo's shadows and pills.** 120 non-`none` box-shadows and `border-radius:50px` ×38.
  Apollo is the least restrained system measured and the one furthest from Appendix A §A.5.
- **Ignore KKR's positive display tracking.** `+0.05em` on 64px weight-300 headlines, applied
  152 times. It is the single loudest divergence in the set and would fight Newsreader's
  optical sizing.
- **Ignore Brookfield's section rhythm.** 93 / 124 / 149 / 150 / 155 / 165px `padding-top`
  values generated by CMS component stacking. It is what happens without a scale.
- **Ignore TPG's two-`h1` about page.** `/about-us/who-we-are` ships `h1 About` and
  `h1 Who We Are` on the same document. Appendix A §A.9 already requires one `h1` per route;
  this is the live counter-example.
- **Ignore the leadership/people pattern.** TPG's about page is a ~200-person filterable
  directory; Carlyle's home ends on six executive profiles. Appendix A §A.8 says no bios, no
  people. A three-person firm publishing a directory would look thin — the omission is the
  stronger position.
