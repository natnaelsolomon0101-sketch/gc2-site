# GC2 — dark build, $100k pass

The client picked the DARK direction. The light institutional build is rejected.
Base branch: `redesign/origin-100k`, cut from `redesign/origin`.

## What was wrong with the dark build

- The pinned strategies section is 6 viewports tall and paints ONE tile at a
  time, leaving ~950px of dead black mid-page. Kill it.
- Only one of six strategies is ever visible.
- The page is sparse: hero, a scroll gimmick, three cards, a footer.


## WHO THIS IS FOR — read before designing anything

Girls Can Trade 2 (`site.name`; "Girlscantrade2" is not the shipped form) is a
hedge fund, and its audience is **women**. The name is the whole premise. That is not a footnote to the design, it is the
brief.

What this changes:

- **Warmth is a requirement, not a decoration.** The default institutional
  register — cold black, hard chrome, austere restraint — is what every other
  fund site does, and it is precisely the wrong signal for a fund whose entire
  point is that it is not those firms. The site should feel like it was made by
  people, for people.
- **Credibility is still non-negotiable.** Warm must not become soft. This is a
  fund managing real capital; it cannot read as a lifestyle brand or a
  newsletter. The bar is: a woman allocating capital takes it seriously AND
  feels it was built with her in mind. Both, or it fails.
- **Lean the palette warm.** Of the six chromatic tokens, favour orchid
  `#dd90d8`, pale-iris `#d1c9ff` and periwinkle `#90b8f0`. Use cyan `#00b3dd`
  sparingly — it is the coldest and most generically "fintech" of the set.
  Deep-iris `#4b49aa` for depth.
- **The bloom and atmosphere work is the point, not garnish.** Organic, living,
  luminous. That is what separates this from a Bloomberg terminal.
- **Never gender it cheaply.** No pink-because-women, no florals as wallpaper,
  no soft-focus stock, no "empowerment" copy, no exclamation marks. The warmth
  comes from light, colour temperature, generous type and human sentences — not
  from decoration that would embarrass a serious reader.
- Copy stays declarative and specific. Confidence, not cheer.

The test: a woman who runs money looks at it and thinks "these people are
serious, and they were thinking about me." Not one or the other.

## Target

Dark, dense, expensive. Every section must be a DIFFERENT treatment — no two
sections may read as the same card grid. A partner at a nine-figure fund opens
it on a phone and does not ask who built it.

## Tokens — use these, invent no new colours

| Token | Hex | Role |
|---|---|---|
| obsidian | `#0f1011` | page ground |
| abyss | `#090a0b` | deeper band |
| graphite | `#1c1d21` | card surface |
| steel | `#26272b` | hairlines, borders |
| pure | `#ffffff` | display type |
| cloud | `#f5f5f7` | headings |
| silver | `#cacaca` | light tile ground |
| ash | `#9f9fa0` | body text (7.20:1 on obsidian) |
| fog | `#7c7d7d` | de-emphasised (4.61:1) |

Chromatic tiles, foreground is per-tile and NOT uniform:
iris `#847dff`/black · cyan `#00b3dd`/black · pale-iris `#d1c9ff`/black ·
deep-iris `#4b49aa`/**white** · orchid `#dd90d8`/black · periwinkle `#90b8f0`/black

Type: DM Serif Display (display), Inter (UI), mono for labels.
Radius: 8px controls, 16px cards, 30px tiles.

## Hard rules

- **No new runtime dependencies.** next, react, react-dom, tailwind, @next/mdx,
  simplex-noise only. Anything from 21st is pasted and rewritten, never installed.
- **No fabricated facts.** No AUM, returns, Sharpe, drawdowns, named people,
  addresses, phone numbers, regulators, registration numbers. `site.address` and
  `site.phone` are null and render nothing.
- Every text/background pair must clear 4.5:1 (3:1 for text ≥24px).
- Respect `prefers-reduced-motion`.
- Touch targets ≥44px in height.

## 21st.dev

Metadata search is unlimited; full code retrieval is capped at 2/day, so use
`search` and `get_inspiration` freely and do not ask for `get_component`.
Endpoint: POST https://21st.dev/api/mcp, header `x-api-key`. The key is supplied
out of band by the owner and lives only in the session scratchpad — it is not in
this repo and no path to it belongs here. Never print or commit it.
Body: {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"...","limit":6}}}
Use it for INSPIRATION — read the descriptions and previews, then build to the
tokens above. Nothing ships with a default kit look.
