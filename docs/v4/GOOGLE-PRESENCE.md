# Google Presence Audit — girlscantrade2.com

Audited live via curl against production. 18 routes from `/sitemap.xml`, all HTTP 200.

## Findings table

| Route | Title (len) | Desc (len) | Canonical | og:image 1200×630 | twitter:card | JSON-LD @type |
|---|---|---|---|---|---|---|
| `/` | 57 | 106 | OK | PASS | summary_large_image | Organization |
| `/firm` | 28 | 80 | OK | PASS | summary_large_image | AboutPage |
| `/strategies` | 30 | **167 (>155)** | OK | PASS | summary_large_image | — |
| `/insights` | 39 | **66 (<70)** | **MISSING** | PASS | summary_large_image | — |
| `/contact` | 27 | 133 | OK | PASS | summary_large_image | Organization |
| `/team` | 24 | 102 | OK | PASS | summary_large_image | AboutPage |
| `/partnership` | 45 | 98 | OK | PASS | summary_large_image | — |
| `/diligence` | 29 | 92 | OK | PASS | summary_large_image | — |
| `/governance` | 52 | 140 | OK | PASS | summary_large_image | — |
| `/letters` | 36 | 134 | OK | PASS | summary_large_image | — |
| `/tearsheet` | 29 | 116 | OK | PASS | summary_large_image | — |
| `/questions` | 39 | 90 | OK | PASS | summary_large_image | FAQPage (25 Q, all valid) |
| `/access` | 39 | 90 | OK | PASS | summary_large_image | — |
| `/legal` | 25 | 127 | OK | PASS | summary_large_image | — |
| `/disclosures` | 31 | 70 | OK | PASS | summary_large_image | — |
| `/legal/terms` | 32 | 122 | OK | PASS | summary_large_image | — |
| `/legal/privacy` | 27 | 129 | OK | PASS | summary_large_image | — |
| `/insights/capacity-is-a-research-problem` | 50 | 102 | **MISSING** | PASS | summary_large_image | Article (headline/datePublished/author present) |

No titles exceed 60 chars. No duplicate titles (18 unique across 18 routes). No JSON-LD parse errors; every FAQPage question has non-empty `name` + `acceptedAnswer.text`; the one Article has `headline`, `datePublished`, `author`. All 18 og:images are live PNGs at exactly 1200×630.

### Flags (3 total)
1. `/strategies` meta description is 167 chars — over the 155 cutoff, will truncate in SERP snippets.
2. `/insights` meta description is 66 chars — under the 70 floor, thin snippet.
3. `/insights` and `/insights/capacity-is-a-research-problem` have **no `<link rel="canonical">`** — every other route sets one.

## Favicon readiness (Google's documented rules)

| Rule | Result |
|---|---|
| `/favicon.ico` returns 200 | PASS (image/vnd.microsoft.icon, 1652 bytes) |
| Square | PASS — ICO contains 16×16, 32×32, 48×48, all square |
| ≥48px, multiple of 48 | PASS — 48×48 frame present inside the ICO |
| `<link rel="icon">` present | PASS — `/favicon.ico` (48×48), `/icon.png` (512×512), `/icon.svg` |
| Same icon on every page | PASS — identical 4-link icon set found on all 18 routes |

## robots.txt

```
User-Agent: *
Allow: /
Host: https://girlscantrade2.com
Sitemap: https://girlscantrade2.com/sitemap.xml
```
Sitemap line present and correct. PASS.

## Owner's checklist (clicks only — nothing here needs a code change except the two canonical flags above, which are a dev fix)

**1. Google Search Console**
- Go to https://search.google.com/search-console → Add property.
- Preferred: **Domain property** → enter `girlscantrade2.com` → GSC gives you a DNS TXT record → add it at your domain registrar's DNS panel → wait for propagation → click Verify in GSC.
- Alternative: **URL-prefix property** (`https://girlscantrade2.com`) → choose **HTML tag** method → GSC gives you a tag like:
  ```html
  <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
  ```
  This is a dev change, not a click: it goes into `src/app/layout.tsx` in the `metadata` export as `verification: { google: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }` (Next.js renders it as the meta tag automatically). Ship it, then click Verify in GSC.
- After verification: Sitemaps → submit `https://girlscantrade2.com/sitemap.xml`.

**2. Request indexing** (GSC → URL Inspection, top search bar)
- Inspect `https://girlscantrade2.com/` → Request indexing.
- Inspect `https://girlscantrade2.com/questions` → Request indexing.
- Inspect `https://girlscantrade2.com/insights/capacity-is-a-research-problem` → Request indexing.

**3. Rich Results Test**
- https://search.google.com/test/rich-results?url=https://girlscantrade2.com/questions
- Confirms the FAQPage JSON-LD is eligible for the FAQ rich result.

**4. Purge cached social cards**
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/inspect/https%3A%2F%2Fgirlscantrade2.com
- X Card Validator: https://cards-dev.twitter.com/validator (paste `https://girlscantrade2.com`)
- Re-run both for `/questions` and `/insights/capacity-is-a-research-problem` once those pages get shared, so the crawlers cache the current og:image rather than a stale one.
