export const site = {
  name: "Girls Can Trade 2",
  mark: "GC2",
  domain: "gc2.fund",
  city: "Miami, Florida",
  founded: 2019,
  structure: "Private partnership",
  mandate: "Liquid markets, global",
  emails: { investors: "investors@gc2.fund", press: "press@gc2.fund" },
  /** Real address not supplied. null renders city only. Never invent one. */
  address: null as string | null,
  /** Never ship a placeholder number. null renders nothing. */
  phone: null as string | null,
} as const;

export const siteUrl = `https://${site.domain}`;
