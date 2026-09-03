# GC2 — Girls Can Trade 2

Marketing and allocator-facing site for Girls Can Trade 2 (GC2), a private
investment partnership in Miami, Florida running concentrated, systematic
strategies across liquid global markets. Founded September 2026.

Next.js 16 (App Router), Tailwind v4, MDX for notes. 18 routes, all statically
prerendered. No CMS.

## Where the content lives

There is no single `site.ts` any more. Facts are split by how dangerous they are
to invent:

| File | Holds |
| --- | --- |
| `src/config/site.ts` | Name, mark, domain, city, founding month, structure, mandate, emails |
| `src/config/fund.ts` | Service providers, registrations, terms, people. **Every field is nullable and most are null.** |
| `src/config/nav.ts` | Primary, allocator and footer navigation |
| `src/content/strategies.ts` | The six strategies, their markets and instruments |
| `src/content/notes.ts` + `src/content/notes/*.mdx` | Insights |

`src/config/fund.ts` carries a rule worth reading before editing anything in it:
a null provider, registration or person renders **nothing**, not a placeholder.
An invented administrator or a stubbed track record is not embarrassing on a
fund site, it is a misrepresentation to an allocator running diligence. Fill a
field and the corresponding block appears; leave it null and the block is absent
from the DOM rather than hidden or stubbed.

The same rule is why `/team` names nobody and `/tearsheet` and `/letters`
refuse to publish rather than show sample figures.

## Design system

`DESIGN.md` is the reference: tokens, both type scales, and the measured
contrast ratio behind every colour pairing. Its hex values match
`src/app/globals.css`. Where the shipped code has moved away from a stated
principle, the gap is recorded in that file's "Known drift" section rather than
edited out — read it before changing anything in `globals.css`.

## The rest of the docs

| File | What it is |
| --- | --- |
| `DESIGN.md` | Tokens, type scales, contrast, motion, known drift |
| `docs/INTAKE.md` | The facts only the owner can supply, ordered by what they unlock |
| `docs/BUILD100K.md` | The brief this redesign was built to: audience, tokens, hard rules |
| `docs/design-plan.md` | The plan behind the current home page |
| `docs/21st/` | What was studied on 21st.dev and what was deliberately rejected |
| `docs/references/` | Dated research captures from Sept 2026. Historical, not current state |
| `CHANGELOG.md` | What shipped, by version |

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # the release gate — must exit 0 and prerender every route
```

There is no test suite and no lint script. `npm run build` is the only automated
gate: it proves the site compiles and prerenders, not that anything behaves.

`scripts/qa/` holds browser-driven checks (links, nulls, print, regime, kill
list, secret scan). Nothing runs them automatically — invoke them with
`npx tsx scripts/qa/<name>.ts` by hand.
