/**
 * Fund facts. Every field is null until the owner supplies it.
 *
 * ORCHESTRATION §8 forbids fabricating people, addresses, figures and
 * regulators. v3 extends that to service providers, registrations and terms,
 * where an invented entry is not embarrassing but a misrepresentation to an
 * allocator running diligence.
 *
 * Components read this and render NOTHING when a value is null: no placeholder,
 * no "TBD", no greyed row. A section whose every field is null does not render,
 * and neither does its nav entry.
 *
 * Fill this in via docs/INTAKE.md.
 */
export const fund = {
  /** "506b" | "506c". Confirmed 506(b) by the owner. NOT LEGAL ADVICE —
   *  counsel signs off before production. Gates every investor-facing module. */
  regime: "506b" as "506b" | "506c",

  entities: {
    manager: null as string | null,       // the adviser entity
    fund: null as string | null,          // the onshore fund
    offshore: null as string | null,      // offshore feeder, if any
    jurisdiction: null as string | null,
    inception: null as string | null,     // fund inception, distinct from firm founding (2019)
  },

  regulatory: {
    advisorStatus: null as "RIA" | "ERA" | "state" | "none" | null,
    crd: null as string | null,           // → SEC IAPD
    secFileNumber: null as string | null, // 801-/802-
    formDCik: null as string | null,      // → EDGAR
    cftc: null as string | null,          // the firm trades futures; ODD will ask
    nfaId: null as string | null,         // → NFA BASIC
  },

  /** ODD's first question. Name them or render nothing. */
  providers: {
    administrator: null as string | null,
    auditor: null as string | null,
    primeBrokers: null as string[] | null, // plural matters to ODD
    custodian: null as string | null,
    counsel: null as string | null,
    taxPreparer: null as string | null,
    cyberVendor: null as string | null,
  },

  /** GATED under 506(b). Public only under 506(c). */
  terms: {
    minimum: null as string | null,
    managementFee: null as string | null,
    performanceFee: null as string | null,
    hurdle: null as string | null,
    highWaterMark: null as boolean | null,
    lockup: null as string | null,
    redemptionFrequency: null as string | null,
    redemptionNotice: null as string | null,
    gate: null as string | null,
    shareClasses: null as string | null,
    feeOffsets: null as string | null,
    sideLetterPolicy: null as string | null,
  },

  alignment: {
    gpCommitmentDisclosed: null as boolean | null,
    gpCommitmentText: null as string | null,
    capacityStated: null as boolean | null,
    capacityText: null as string | null,
  },

  reporting: {
    navFrequency: null as string | null,
    estimateTiming: null as string | null,
    finalTiming: null as string | null,
    letterCadence: null as string | null,
    investorCallCadence: null as string | null,
    k1Target: null as string | null,      // families weight this heavily
    auditDelivery: null as string | null,
  },

  /** {name, role, bio, priorFirms}[] — null renders the STRUCTURE of key-person
   *  risk without naming anyone, which is honest and still answers ODD. */
  people: null as { name: string; role: string; bio: string; priorFirms: string[] }[] | null,

  address: null as string | null,
  phone: null as string | null,
  /** Stamped on every data-bearing module. */
  updatedAt: null as string | null,
} as const;

/** True when a section has at least one non-null fact to show. */
export function hasAny(o: Record<string, unknown> | null): boolean {
  if (!o) return false;
  return Object.values(o).some((v) => v !== null && v !== undefined &&
    !(Array.isArray(v) && v.length === 0));
}
