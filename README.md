# GC2 — Girls Country 2

Marketing site for Girls Country 2 (GC2), a private trading fund in Austin, TX.
Next.js App Router, plain CSS, zero UI dependencies.

## Editing

Everything readable on the site lives in **`content/site.ts`**. There is no CMS and no
second place to look.

| Change | Where |
| --- | --- |
| Fund name, mark, city, tagline | `FUND` |
| Hero headline / standfirst / buttons | `HERO` |
| Scrolling ticker | `TICKER` |
| Stat counters | `STATS` |
| Firm narrative + fact table | `FIRM` |
| Strategy rows | `STRATEGIES` |
| Pull quote | `QUOTE` |
| Insight posts | `INSIGHTS` |
| Email, phone, address | `CONTACT` |
| Legal disclosure | `DISCLOSURE` |

`FUND.name` drives the page title, OG tags, JSON-LD, sitemap and footer. Change it once.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # must pass with zero warnings
```

## Notes

Figures in `STATS` are illustrative placeholders. Replace them before this site is public.
