/* ============================================================================
   GC2 — SINGLE SOURCE OF TRUTH
   Every string on the site comes from this file.

   ⚠️  UNVERIFIED-FACT POLICY
   Nothing in this file may be invented. Fields we do not have real values for
   are set to `null` and the UI omits them entirely rather than rendering a
   placeholder. See NEEDS_CONFIRMATION at the bottom for the open list.
   ========================================================================== */

export const FUND = {
  name: "Girls Country 2",
  mark: "GC2",
  kind: "Private Trading Fund",
  city: "Austin",
  state: "TX",
  domain: "gc2.fund",
  /** Removed: prior value (2019) was fabricated. Awaiting a real founding year. */
  founded: null as number | null,
  description:
    "Girls Country 2 is a private trading fund in Austin, Texas, running concentrated systematic strategies across liquid markets.",
} as const;

/* Nav ---------------------------------------------------------------------- */
export const NAV = [
  { label: "Firm", href: "#firm" },
  { label: "Strategies", href: "#strategies" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];
export const NAV_CTA = { label: "Investor login", href: "#contact" };

/* Hero --------------------------------------------------------------------- */
export const HERO = {
  /** One sentence. `emphasis` is the single bolded word, Blackstone-style. */
  headline: "Capital deployed with conviction.",
  emphasis: "conviction",
  supporting:
    "We run concentrated systematic strategies across liquid markets, underwritten by proprietary research and a disciplined risk framework.",
  footnote: "1",
  footnoteText:
    "Strategies are proprietary and may change without notice. Nothing here is an offer to sell or a solicitation to buy any security.",
};

/* Scale — ONE headline figure. Rendered server-side, never animated. -------- */
export const SCALE = {
  label: "Scale",
  statement:
    "A deliberately small firm. Every position is owned by a named researcher who defends it in front of the desk.",
  /** null until confirmed — the section omits the figure rather than invent one. */
  value: null as string | null,
  unit: null as string | null,
  caption: "Assets under management",
  /** ISO date the figure is current as of. Rendered as "All figures as of …". */
  asOf: null as string | null,
};

/* Firm --------------------------------------------------------------------- */
export const FIRM = {
  label: "The firm",
  heading: "A research house that happens to trade.",
  emphasis: "research house",
  body: [
    "Durable returns in liquid markets come from process, not prediction. We build our own data, write our own models, and hold ourselves to a single standard: an idea earns capital only when the evidence survives adversarial review.",
    "We carry no external mandate that would force us into a trade we do not believe, and we size to survive the tail rather than to flatter the mean.",
  ],
};

/* Strategies — clean list, no numbering, no pills --------------------------- */
export const STRATEGIES = [
  { name: "Systematic Macro", summary: "Cross-asset directional risk driven by rates, growth and liquidity regimes.",
    detail: "A regime classifier maps the global cycle into discrete states. Positions express the state, not the forecast, and unwind when the state changes rather than when the P&L hurts." },
  { name: "Volatility Arbitrage", summary: "Relative value between implied and realised across the surface.",
    detail: "We warehouse convexity where the market overpays for certainty and shed it where the term structure inverts. Gamma is a budget, not an accident." },
  { name: "Statistical Relative Value", summary: "Mean reversion inside tightly defined economic cohorts.",
    detail: "Pairs and baskets are drawn from cointegration that holds out of sample. Every leg carries a borrow, funding and capacity assumption before it is allowed to size." },
  { name: "Commodity Carry", summary: "Term structure and inventory dislocation in physical markets.",
    detail: "Storage economics anchor the curve. When the market prices a shortage the warehouses do not show, we take the other side and wait for the data to catch up." },
  { name: "Event Dislocation", summary: "Liquidity provision around scheduled and unscheduled catalysts.",
    detail: "Index reconstitutions, auctions and forced flows create price impact unrelated to value. We are paid to absorb it, and we size to the impact estimate rather than the headline." },
  { name: "Tail Overlay", summary: "A permanent short-convexity hedge across the whole book.",
    detail: "The overlay is a cost of doing business, not a trade. It runs continuously so the rest of the book can hold conviction through a drawdown it did not cause." },
];

/* Insights — muted gradient covers, no stock photography -------------------- */
export const INSIGHTS = [
  { slug: "regime-not-forecast", date: "2026-07-14", category: "Research",
    title: "Trade the regime, not the forecast",
    cover: "from-[#1d3b34] via-[#2c554a] to-[#7f9c92]" },
  { slug: "cost-of-convexity", date: "2026-05-02", category: "Risk",
    title: "The honest cost of convexity",
    cover: "from-[#23303a] via-[#3a4b58] to-[#8e9aa4]" },
  { slug: "capacity-first", date: "2026-02-20", category: "Process",
    title: "Capacity is a research problem",
    cover: "from-[#2e2a24] via-[#4a4237] to-[#9c9184]" },
];

/* Newsletter --------------------------------------------------------------- */
export const NEWSLETTER = {
  heading: "Notes from the desk, occasionally.",
  emphasis: "occasionally",
  placeholder: "Email address",
  cta: "Subscribe",
  note: "We write when we have something to say. No cadence, no marketing.",
};

/* Ticker — thin monochrome strip above the footer --------------------------- */
export const TICKER = [
  { symbol: "ES", label: "S&P 500 Futures" },
  { symbol: "NQ", label: "Nasdaq 100 Futures" },
  { symbol: "ZN", label: "10Y Treasury Note" },
  { symbol: "CL", label: "WTI Crude" },
  { symbol: "GC", label: "Gold" },
  { symbol: "6E", label: "Euro FX" },
  { symbol: "ZC", label: "Corn" },
  { symbol: "VX", label: "Volatility Index" },
  { symbol: "HG", label: "Copper" },
  { symbol: "6J", label: "Japanese Yen" },
];

/* Contact ------------------------------------------------------------------ */
export const CONTACT = {
  label: "Contact",
  heading: "Enquiries",
  standfirst: "We speak with a small number of aligned partners each year.",
  email: `investors@${FUND.domain}`,
  press: `press@${FUND.domain}`,
  /** Removed: prior values were fabricated. Omitted until confirmed. */
  phone: null as string | null,
  address: null as string[] | null,
};

/* Footer ------------------------------------------------------------------- */
export const FOOTER_COLUMNS = [
  { title: "Firm", links: [{ label: "About", href: "#firm" }, { label: "Strategies", href: "#strategies" }, { label: "Insights", href: "#insights" }] },
  { title: "Contact", links: [{ label: "Investors", href: "#contact" }, { label: "Press", href: "#contact" }] },
  { title: "Legal", links: [{ label: "Disclosures", href: "#legal" }, { label: "Privacy", href: "#legal" }, { label: "Terms", href: "#legal" }] },
];

export const DISCLOSURE =
  `${FUND.name} is a private investment partnership. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security. Past performance is not indicative of future results. Access to the fund is limited to qualified investors.`;

export const SITE_URL = `https://${FUND.domain}`;

/* ---------------------------------------------------------------------------
   NEEDS_CONFIRMATION — supply real values or these stay omitted:
     FUND.founded     founding year          (was fabricated: 2019)
     SCALE.value/unit headline AUM figure    (was fabricated: $480M)
     SCALE.asOf       date the figure is as of
     CONTACT.phone    telephone              (was fabricated: +1 512 555-0147)
     CONTACT.address  office address         (was fabricated: Frost Bank Tower)
--------------------------------------------------------------------------- */
