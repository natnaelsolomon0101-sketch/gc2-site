# Progress — swarm pass

`docs/SWARM.md` runs on top of `docs/ORCHESTRATION.md`. Per §0.3 this file is the
source of truth. The brief assumes a cold start; this repo is not one. The site
already passed the ORCHESTRATION §5.2 exit gate at 4.95 (0 high, 0 medium) over
eight QA rounds, with PR #1 open. Waves 2 and 3 are therefore already built, and
the swarm's value is Wave 1 recon plus Wave 4 measured against the §4 bar, which
the existing build was never held to.

## Wave 0 — Setup
- [x] Blocking conditions checked: ORCHESTRATION.md present, python3 3.9.6, 21st MCP connected
- [x] Secret scan `git grep 21st_sk_` clean
- [x] `docs/SWARM.md` written
- [x] Roster written to `.claude/agents/` (16 agents; the brief's prose says fifteen, its table lists sixteen)
- [x] 21st tool names discovered -> `docs/ENV.md` under 21ST_TOOLS
- [x] ui-ux-pro-max installed and verified; design-system persisted; DESIGN.md and site.ts written
- [x] Baseline of the live site captured (`docs/baseline/`)

## Wave 1 — Recon
- [x] reference-scout -> `docs/references/PATTERNS.md`
- [x] ideas-lab round 0 -> five ideas
- [x] design-director -> `docs/design-plan.md`
- [x] compliance-officer round 0 -> copy review
- [x] `docs/PLAN.md` merged, <= 2 ideas accepted, rejections logged

## Waves 2-3 — Foundation and build
- [x] Tokens, site.ts, fonts, Nav, MobileNav, Footer, Section, Container, Grid
- [x] All seven routes + not-found, metadata scaffolding
- [x] Surface generated and placed (hero + /firm)
- [x] All content: strategies, three MDX notes, /firm, /contact, /disclosures
- [x] OG images from tokens (site + per note), sitemap, robots, JSON-LD
- [ ] Re-audited against the §4 bar (this is what Wave 4 does)

## Wave 4 — Polish rounds
- [x] builders dispatched: typographer, copy-chief, perf-engineer (worktree, disjoint ownership)
- [x] copy-chief merged: 11 findings; director ruling corrected on one string
- [ ] typographer + perf-engineer merged
- [ ] round 1: qa-runner, six read-only agents, TRIAGE, dispatch, merge
- [ ] exit: three critics >= 4.5 and every criterion >= 4, two consecutive rounds

## Wave 5 — Ship
- [ ] release-manager: secret scan, push, preview URL, PR, REPORT.md
