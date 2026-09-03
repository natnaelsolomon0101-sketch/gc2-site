# Security posture — girlscantrade2.com (gstack /cso, daily mode, 4 Sep 2026)

**Result: 0 findings at the 8/10 confidence gate.** Static Next.js 16 site: no auth, no database, no inbound webhooks, no user input reaching a server. Attack surface is the dependency chain, the deploy pipeline, git history, and two outbound data fetches.

## Attack surface
- 19 public routes, 1 generated feed (`/feed.xml`), 0 authenticated/admin/API/upload endpoints.
- Outbound integrations: home.treasury.gov (par yield curve XML, ISR 6h) and ecb.europa.eu (reference rates XML). Fixed URLs, no user-controlled input, TLS default. Renders nothing on failure.
- Deploy: Vercel, no GitHub Actions workflows, no Dockerfile/IaC. `vercel.json` holds only host redirects.
- Secrets: none tracked. `.env*`, `.vercel/`, `.gstack/` are gitignored. The 21st.dev MCP key lives only in the untracked `~/.claude.json`; git history carries the commit messages "key read from API_KEY_21ST, never inlined" and **no key value** (verified with `git log -p -G` over all refs).
- Supply chain: `npm audit --omit=dev` = 0/0/0/0; no production dependency has install scripts; lockfile present and tracked.
- Repo-local agents (`.claude/agents/*.md`): no network/exfiltration or prompt-injection patterns.
- `dangerouslySetInnerHTML`: 15 sites, all `<style>` blocks with static CSS strings or JSON-LD from config/content (no external data). Not a finding.

## Filtered candidates (below gate or hard-excluded)
1. Missing `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` on production (only HSTS present). Hardening, not a vulnerability (hard exclusion #6). **Recommendation:** add a `headers()` block in `next.config.ts` with `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (or `frame-ancestors 'none'` in CSP), `Permissions-Policy` minimal, and a CSP that allows self + fonts.gstatic.com (fonts are self-hosted via next/font, so `default-src 'self'` may suffice; test the inline `<style>` blocks and JSON-LD scripts).
2. JSON-LD via `JSON.stringify` without `<` escaping: content is authored config, no external input. Being fixed anyway in motion r7 (`.replace(/</g,"\\u003c")`).
3. Eight runtime dependencies reachable only through dead UI code (learning `gc2-ui-primitive-library-is-dead-code`): not a vulnerability; trimming them shrinks the audit surface. Recommendation for a later cleanup.

## Protection files
No `.gitleaks.toml`/`.secretlintrc`; the repo has its own `scripts/qa/secretscan.sh` and the gstack redact pre-push hook fires on every push (it flagged 22 MEDIUM PII/internal notes in docs — review before the repo is made public; it is private today).

**This tool is not a substitute for a professional security audit.** /cso is an AI-assisted scan that catches common vulnerability patterns; it is not comprehensive, not guaranteed, and not a replacement for a qualified security firm. For production systems handling sensitive data, engage a professional penetration testing firm.
