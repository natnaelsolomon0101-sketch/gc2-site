# Agent reports

Per SWARM §0.3, each agent's findings are preserved here so nothing an agent
learned is lost when its context is discarded.

## Wave 1 — recon
- **reference-scout** → `docs/references/PATTERNS.md` (524 lines). Parsed the
  shipped CSS bundles of KKR, Apollo, Brookfield and TPG for real declared
  values. Blackstone returned 403 to every attempt and Increase is absent from
  Refero's index; both reported as missing rather than invented. Its two type
  recommendations were rejected — see DECISIONS.md.
- **design-director** → a 20-item punch list, every item citing file:line.
  Independently caught that the QA screenshots did not exist on disk.
- **ideas-lab** → five ideas; two accepted, three rejected. See DECISIONS.md.
- **compliance-officer** → one high, six medium, three low. Surfaced the
  Appendix A §A.10 vs SWARM §4.4 conflict over "book" and "drawdown".

## Wave 4 — builders
- **copy-chief** → merged. All 11 assigned findings fixed. Escalated, rather
  than silently overrode, an error in the Director's own ruling: only two of the
  three "protected" strings were actually A.10 verbatim. Named four places it
  was tempted to invent a fact and did not.
