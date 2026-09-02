export const nav = [
  { label: "Firm", href: "/firm" },
  { label: "Strategies", href: "/strategies" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [...nav, { label: "Disclosures", href: "/disclosures" }] as const;
