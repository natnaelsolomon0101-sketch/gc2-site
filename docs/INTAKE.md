# Intake — what only you can supply

Every field below is something no agent may invent. The site is built and
deployed with all of them null: a null field renders **nothing** — no
placeholder, no "TBD", no greyed row — and a section with no facts does not
render at all, nor does its nav entry.

Fill this in one sitting. Ordered by what unlocks the most.

---

## BLOCKING — answered

- [x] **Regulation D regime: 506(b).** Confirmed. The public site therefore
      cannot mention the raise, terms, minimums, or anything reading as an
      invitation to invest. `scripts/qa/regime.ts` enforces this on every build.
      **Still needs securities counsel sign-off before production.**

## TIER 1 — unlocks `/diligence`, the highest-value new page

For an emerging manager, naming third-party providers is the single densest
trust signal available. This tier matters more than everything below it.

- [ ] Fund administrator
- [ ] Auditor
- [ ] Prime broker(s) — plural if more than one; ODD notices
- [ ] Custodian
- [ ] Legal counsel
- [ ] Adviser status: RIA / exempt reporting adviser / state / none, + CRD if any
- [ ] CFTC/NFA status — **you trade futures, so ODD will ask.** Even "relying on
      the 4.13(a)(3) exemption" is a complete answer
- [ ] Form D CIK, if filed

## TIER 2 — unlocks `/partnership`

Terms are **gated** under 506(b): they render behind the access flow, not publicly.

- [ ] Manager entity name, fund entity name, jurisdiction, fund inception date
- [ ] Minimum, management fee, performance fee, hurdle, high-water mark
- [ ] Lock-up, redemption frequency, notice period, gate
- [ ] Do you offer SMAs? Co-investment? (if no to both, `/partnership` is one door, not three)
- [ ] Will you disclose GP commitment? In what words?
- [ ] Capacity: stated or not?

## TIER 3 — unlocks the reporting table, which almost no manager publishes

- [ ] NAV frequency, and who strikes it
- [ ] Estimate timing / final timing
- [ ] Letter cadence, investor call cadence
- [ ] **K-1 target date** — a durable family-office grievance; committing to a
      date in public is a claim almost nobody makes
- [ ] Audited financials delivery commitment

## TIER 4 — `/firm` and `/governance`

- [ ] People: names, roles, prior firms — **or** confirm "structure only, no names"
- [ ] Who can override the PM on risk?
- [ ] Real street address, or confirm city-only
- [ ] Real phone, or confirm none

## TIER 5 — content only you can write

- [ ] The six "what would make us stop" sentences, one per strategy. No manager
      writes these down. An allocator reading six of them learns more about the
      risk culture than from an entire governance page.
- [ ] Any existing letters to index (dates and titles; contents stay gated)
