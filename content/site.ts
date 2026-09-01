/* ============================================================================
   GC2: SINGLE SOURCE OF TRUTH
   Everything on the site reads from this file. Change it here, it changes
   everywhere, including <title>, OG tags, sitemap and the footer.
   ========================================================================== */

export const FUND = {
  name: "Girls Country 2",
  mark: "GC2",
  kind: "Private Trading Fund",
  city: "Austin",
  state: "TX",
  founded: 2019,
  domain: "gc2.fund",
  tagline: "Systematic conviction in liquid markets.",
  description:
    "Girls Country 2 is a private trading fund in Austin, Texas. We run concentrated, systematic strategies across liquid markets, underwritten by proprietary research and a disciplined risk framework.",
} as const;

/* Hero -------------------------------------------------------------------- */
export const HERO = {
  eyebrow: `${FUND.city}, ${FUND.state} · Est. ${FUND.founded}`,
  headline: ["Capital", "with a", "thesis."],
  standfirst:
    "We deploy proprietary capital across liquid markets. No consensus trades, no closet indexing, no committee. Research decides, risk constrains, positions concentrate.",
  primaryCta: { label: "The firm", href: "#firm" },
  secondaryCta: { label: "Speak with us", href: "#contact" },
};

/* Ticker: loops seamlessly under the hero -------------------------------- */
export const TICKER: { symbol: string; label: string }[] = [
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

/* Stats: counters animate once on first view ------------------------------
   PLACEHOLDER FIGURES. Replace before this site goes public.               */
export const STATS: {
  value: number; prefix?: string; suffix?: string; decimals?: number; label: string; note: string;
}[] = [
  { value: 480, prefix: "$", suffix: "M", label: "Assets under management", note: "As of Q2" },
  { value: 6,   suffix: "",  label: "Core strategies", note: "Liquid markets only" },
  { value: 24,  suffix: "",  label: "Investment professionals", note: "Research and trading" },
  { value: 99.4, suffix: "%", decimals: 1, label: "Execution uptime", note: "Trailing twelve months" },
];

/* Firm -------------------------------------------------------------------- */
export const FIRM = {
  label: "The firm",
  heading: "We are a research house that happens to trade.",
  body: [
    `${FUND.name} was founded in ${FUND.founded} on a narrow premise: that durable returns in liquid markets come from process, not prediction. We build our own data, write our own models, and hold ourselves to a single standard: an idea earns capital only when the evidence survives adversarial review.`,
    "The firm is deliberately small. Every position is owned by a named researcher who defends it in front of the desk. We carry no external capital mandate that would force us into a trade we do not believe, and we size to survive the tail rather than to flatter the mean.",
  ],
  facts: [
    { k: "Headquarters", v: `${FUND.city}, ${FUND.state}` },
    { k: "Founded", v: String(FUND.founded) },
    { k: "Structure", v: "Private partnership" },
    { k: "Mandate", v: "Liquid markets, global" },
  ],
};

/* Strategies: hover reveals the detail row ------------------------------- */
export const STRATEGIES = [
  { id: "01", name: "Systematic Macro",
    blurb: "Cross-asset directional risk driven by rates, growth and liquidity regimes.",
    detail: "A regime classifier maps the global cycle into discrete states. Positions express the state, not the forecast, and unwind when the state changes rather than when the P&L hurts.",
    tags: ["Rates", "FX", "Index"] },
  { id: "02", name: "Volatility Arbitrage",
    blurb: "Relative value between implied and realised across the surface.",
    detail: "We warehouse convexity where the market overpays for certainty and shed it where the term structure inverts. Gamma is a budget, not an accident.",
    tags: ["Options", "Variance"] },
  { id: "03", name: "Statistical Relative Value",
    blurb: "Mean reversion inside tightly defined economic cohorts.",
    detail: "Pairs and baskets are drawn from cointegration that holds out of sample. Every leg carries a borrow, funding and capacity assumption before it is allowed to size.",
    tags: ["Equity", "Futures"] },
  { id: "04", name: "Commodity Carry",
    blurb: "Term structure and inventory dislocation in physical markets.",
    detail: "Storage economics anchor the curve. When the market prices a shortage the warehouses do not show, we take the other side and wait for the data to catch up.",
    tags: ["Energy", "Metals", "Ags"] },
  { id: "05", name: "Event Dislocation",
    blurb: "Liquidity provision around scheduled and unscheduled catalysts.",
    detail: "Index reconstitutions, auctions and forced flows create price impact unrelated to value. We are paid to absorb it, and we size to the impact estimate rather than the headline.",
    tags: ["Flow", "Index"] },
  { id: "06", name: "Tail Overlay",
    blurb: "A permanent short-convexity hedge across the whole book.",
    detail: "The overlay is a cost of doing business, not a trade. It runs continuously so that the rest of the book can hold conviction through a drawdown it did not cause.",
    tags: ["Hedging"] },
];

/* Quote ------------------------------------------------------------------- */
export const QUOTE = {
  text: "Risk is not the price of return. It is the thing you manage so that you are still here when the return arrives.",
  attribution: "Investment Committee",
  role: `${FUND.name}`,
};

/* Insights: add a post by adding an object to the top of this array ------- */
export const INSIGHTS = [
  { slug: "regime-not-forecast", date: "2026-07-14", category: "Research",
    title: "Trade the regime, not the forecast",
    excerpt: "Point estimates decay within days. Regime classification survives quarters. A note on why we stopped asking where the market is going." },
  { slug: "cost-of-convexity", date: "2026-05-02", category: "Risk",
    title: "The honest cost of convexity",
    excerpt: "A permanent hedge looks expensive in every month it is not needed. We show the arithmetic that makes it cheap across a full cycle." },
  { slug: "capacity-first", date: "2026-02-20", category: "Process",
    title: "Capacity is a research problem",
    excerpt: "A strategy that cannot be sized is a hobby. Why we underwrite market impact before we underwrite edge." },
];

/* Contact ----------------------------------------------------------------- */
export const CONTACT = {
  label: "Contact",
  heading: "Enquiries",
  standfirst: "We speak with a small number of aligned partners each year. Introductions are welcome.",
  email: `investors@${FUND.domain}`,
  press: `press@${FUND.domain}`,
  phone: "+1 (512) 555-0147",
  address: ["Frost Bank Tower", "401 Congress Avenue", `${FUND.city}, ${FUND.state} 78701`],
};

/* Nav / footer ------------------------------------------------------------ */
export const NAV = [
  { label: "Firm", href: "#firm" },
  { label: "Strategies", href: "#strategies" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export const DISCLOSURE =
  `${FUND.name} is a private investment partnership. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security. Past performance is not indicative of future results. Figures shown are illustrative. Access to the fund is limited to qualified investors.`;

export const SITE_URL = `https://${FUND.domain}`;
