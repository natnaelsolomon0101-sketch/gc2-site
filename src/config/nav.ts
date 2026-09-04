export const nav = [
  { label: "Firm", href: "/firm" },
  { label: "Strategies", href: "/strategies" },
  { label: "Insights", href: "/insights" },
  { label: "Markets", href: "/markets" },
  { label: "Contact", href: "/contact" },
] as const;

// Allocator-facing pages. Kept out of the top bar on purpose: they are the
// second question an allocator asks, not the first thing a visitor needs.
export const allocatorNav = [
  { label: "Team", href: "/team" },
  { label: "Partnership", href: "/partnership" },
  { label: "Diligence", href: "/diligence" },
  { label: "Governance", href: "/governance" },
  { label: "Letters", href: "/letters" },
  { label: "Tearsheet", href: "/tearsheet" },
  { label: "Questions", href: "/questions" },
  { label: "Access", href: "/access" },
] as const;

export const legalNav = [
  { label: "Legal", href: "/legal" },
  { label: "Disclosures", href: "/disclosures" },
] as const;

export const footerNav = [...nav, ...allocatorNav, ...legalNav] as const;
