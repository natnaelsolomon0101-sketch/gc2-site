<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Everything above this line is written and rewritten by `next dev`. Everything
below is ours.

# gc2-site

Read `README.md` before your first edit. It carries the three things that are
easy to get wrong here: where each fact lives (`src/config/`, `src/content/`),
the rule that a null field renders **nothing** rather than a placeholder, and
the fact that `npm run build` is the only automated gate.

Then, by task:

- Anything visual: `DESIGN.md`, including its "Known drift" section.
- Anything that states a fact about the firm: `src/config/site.ts` and
  `src/config/fund.ts`. Never invent a number, a person, a provider, an address
  or a registration. A null renders nothing on purpose.
- Anything about what the redesign was for: `docs/BUILD100K.md`.
- `docs/references/` is dated research from September 2026. It describes other
  sites and an earlier state of this one. Do not read it as current.
