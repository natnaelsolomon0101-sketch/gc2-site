# Environment

| Tool | Version |
|---|---|
| node | v24.13.1 |
| npm | 11.8.0 |
| git | 2.50.1 |
| python3 | 3.9.6 |
| gh | 2.90.0 |

`SKILL_SEARCH=/Users/natnaelsolomon/.claude/skills/ui-ux-pro-max/scripts/search.py`

Skill verified working. Note: the literal multi-word queries in Appendix B return
`Found: 0 results` against this build of the database. Short keyword queries hit.
Queries were shortened accordingly and the substitutions logged in DECISIONS.md.

Branch: `redesign/institutional`. Never `main`.

## 21ST_TOOLS

Enumerated from the live MCP endpoint via `tools/list` on 2026-09-02, not guessed.
The server was renamed from Magic MCP and the tool names changed; §1.2 forbids
guessing them. 36 tools; the ones this build uses:

| Tool | What it does |
|---|---|
| `search` | Catalog search across components, themes, templates. Metadata only. Unlimited. |
| `search_picker` | Same as `search` but renders an inline picker on hosts that support it. |
| `get_inspiration` | Metadata-only search reranked against a project's design context. Unlimited. |
| `record_inspiration_feedback` | Records accept/reject on a `get_inspiration` result. |
| `get_component` | **Full source + demo for one result. RATIONED — see quota below.** |
| `get_theme` | A theme's full CSS (`:root` / `.dark` tokens). |
| `search_logo` | Brand/UI SVG logos from svgl.app. Free, no login. |
| `generate` | Generate UI from a prompt with 21st AI. Spends credits. |
| `get_generation` / `iterate_generation` / `get_take` | List, refine, and pull the code of a sketch's takes. |
| `get_usage` | Account tier and remaining free retrieval quota. |

Publishing and profile tools (`edit_component`, `submit_component`,
`delete_theme`, `edit_profile`, …) exist but are out of scope for this build.

### Quota — this is a real constraint on component-smith

`get_usage` reports: **Tier free. 2 of 2 free component-code retrievals remaining
today.**

So `search` and `get_inspiration` are effectively free and should be used
liberally to survey the catalog, but `get_component` may be called **at most
twice**. ORCHESTRATION §A.9 already forbids installing anything from 21st as a
package, and everything sourced must be rewritten to Appendix A tokens, so full
code retrieval buys less here than it would on a greenfield build. Spend the two
retrievals only on components whose *behavior* is worth reading (focus trap,
scroll listener), never on skins.

SWARM §1.2.4 anticipated this: search working while code retrieval is gated is a
supported state — `get_inspiration` plus a hand build is fine.

### Smoke test

`search "navigation header sticky minimal"` returned 2 results (e.g. component
23562 "Sticky Header" by ddoemonn). Endpoint reachable, auth accepted.

The key is read from the user-scoped MCP config at call time and is never written
to a file in this repo. `git grep -n "21st_sk_"` returns nothing.
