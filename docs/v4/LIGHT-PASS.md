# The light pass — every section, one round

Decision (Nate, 3 Sep 2026): the site moves to a LIGHT canvas everywhere. One theme. No toggle. The site must not change under `prefers-color-scheme: dark` (the matrix diffs the two and fails on any pixel difference).

Foundation r3 (merged) defines the semantic layer in `src/app/globals.css` and documents it with measured contrast in `DESIGN.md`. Read both before touching anything. `docs/v4/APPENDIX-A.md` now maps the EVERY-SCREEN.md vocabulary to these tokens.

## The tokens (use nothing else for colour)

| Role | Token / utility | Hex |
|---|---|---|
| page ground | `bg-ground` / `var(--color-ground)` | #f7f5f0 |
| full-bleed band | `bg-ground-2` | #eeeae1 |
| card / table surface | `bg-surface` | #e5e0d6 |
| primary text, display type, wordmark | `text-ink` | #141311 |
| secondary text (body on home, deks) | `text-ink-2` | #544e45 (7.55:1 on ground) |
| de-emphasized (dates, legal, captions) | `text-ink-3` | #67615a (5.61:1; passes at 14px) |
| hairline | `border-hairline` / `.rule-t` / `.rule-b` | rgba(20,19,17,.13) |
| strong hairline (control borders) | `border-hairline-strong` | rgba(20,19,17,.28) |
| the one black button | `.btn` (ink fill, ground text) · `.btn-ghost` (ink outline) | |
| accents (fills only) | `bg-iris-gleam` … with the paired `-fg` for text on the fill | see DESIGN.md |

**Accent as text on paper: only `deep-iris` passes (6.8:1). Pale-iris, periwinkle, orchid, cyan and iris-gleam do NOT pass as text on ground — use them as fills, swatches, rules and the one accent per section, never for words.**

Deprecated (defined for now, to be removed when counts reach zero): obsidian, abyss, graphite, steel, silver, fog, ash, cloud, pure, void, `.card-dark`, `.card-lite`, `.on-light`, any `rgba(255,255,255,…)` or `white/N` utility, any `text-white` / `bg-black`.

## What each section does

1. `cd ~/gc2-wt/<you> && git merge --no-edit v4/every-screen` (light tokens are in).
2. Migrate EVERY colour reference in your OWNERSHIP.md files to the semantic tokens. The Conductor's count per file is in PROGRESS.md (foundation r3 report). `grep -n "obsidian\|abyss\|graphite\|steel\|silver\|text-fog\|text-ash\|text-cloud\|text-pure\|bg-pure\|text-void\|bg-void\|rgba(255,255,255\|white/\|text-white\|bg-black\|#0f1011\|#090a0b\|#1c1d21\|#26272b\|#f5f5f7\|#cacaca\|#9f9fa0\|#7c7d7d" <your files>` must return nothing when you are done.
3. Re-light your section, do not just recolour it: a dark composition with inverted colours is not a light composition. Ground steps are 1.10, so bands read as bands only with a hairline or a real tonal step; shadows stay banned; the depth mechanism is ground → ground-2 → surface plus hairlines. Chromatic tiles that glowed on obsidian are quiet fills on paper; ration them per DESIGN.md principle 2 (one accent per section) and let deep-iris carry the weight.
4. Print: the `@media print` block no longer remaps dark to light. Your components must print correctly on their own (ink on paper). sec-legal owns the print block's bridge rules and will delete them as counts reach zero.
5. Gates before you return: `npm run build`, `bash scripts/qa/killist.sh` empty, zero horizontal overflow, and screenshots of everything you own at 320, 393 (WebKit), 768, 1280, 1920, 3440 into `docs/v4/shots/light-<you>/` — LOOK at every one. Also screenshot once with `colorScheme: "dark"` in the Playwright context and confirm it is pixel-identical to the light shot.
6. Return per the preamble, plus the grep result (must be empty) and any deprecated token you could not remove and why.

Never kill processes by name pattern. Kill only your own port via lsof.
