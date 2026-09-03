export const site = {
  name: "Girls Can Trade 2",
  mark: "GC2",
  domain: "girlscantrade2.com",
  city: "Miami, Florida",
  // The month matters: the firm is weeks old, and "2026" alone would let a
  // reader assume January. Anything that prints a founding fact reads these
  // two, never a literal.
  founded: 2026,
  foundedLabel: "September 2026",
  foundedISO: "2026-09",
  structure: "Private partnership",
  mandate: "Liquid markets, global",
  emails: { investors: "investors@gc2.fund", press: "press@gc2.fund" },
  /** Real address not supplied. null renders city only. Never invent one. */
  address: null as string | null,
  /** Never ship a placeholder number. null renders nothing. */
  phone: null as string | null,
} as const;

export const siteUrl = `https://${site.domain}`;
