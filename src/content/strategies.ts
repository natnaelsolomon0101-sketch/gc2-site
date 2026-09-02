export type Strategy = {
  slug: string; name: string; oneLiner: string;
  markets: string; instruments: string; body: string[];
};

export const strategies: Strategy[] = [
  {
    slug: "systematic-macro",
    name: "Systematic Macro",
    oneLiner: "Directional cross-asset risk driven by rates, growth, and liquidity regimes.",
    markets: "Rates, FX, equity index",
    instruments: "Futures, swaps",
    body: [
      "A regime classifier maps the global cycle into discrete states. Positions express the state rather than a point forecast, and unwind when the state changes, not when the P&L hurts.",
      "The classifier is rebuilt on data we assemble ourselves. A state has to persist out of sample before it is allowed to carry risk.",
    ],
  },
  {
    slug: "volatility-arbitrage",
    name: "Volatility Arbitrage",
    oneLiner: "Relative value between implied and realized volatility across the surface.",
    markets: "Equity index, rates",
    instruments: "Options, variance",
    body: [
      "We hold convexity where the market overpays for certainty and shed it where the term structure inverts. Gamma is a budget, not an accident.",
      "Every position carries an explicit assumption about what the surface should look like and what would prove it wrong.",
    ],
  },
  {
    slug: "statistical-relative-value",
    name: "Statistical Relative Value",
    oneLiner: "Mean reversion inside tightly defined economic cohorts.",
    markets: "Equities, futures",
    instruments: "Cash equities, futures",
    body: [
      "Pairs and baskets come from cointegration that holds out of sample. Every leg carries a borrow, funding, and capacity assumption before it is allowed to size.",
      "Cohorts are drawn from economics rather than sector labels. Two firms in the same index are not related unless the same thing moves both.",
    ],
  },
  {
    slug: "commodity-carry",
    name: "Commodity Carry",
    oneLiner: "Term structure and inventory dislocation in physical markets.",
    markets: "Energy, metals, agriculture",
    instruments: "Futures, spreads",
    body: [
      "Storage economics anchor the curve. When the market prices a shortage the warehouses do not show, we take the other side and wait for the data.",
      "The position is sized against delivery capacity, not against the notional the screen will let us trade.",
    ],
  },
  {
    slug: "event-dislocation",
    name: "Event Dislocation",
    oneLiner: "Liquidity provision around scheduled and unscheduled catalysts.",
    markets: "Equity index, single names",
    instruments: "Cash equities, futures",
    body: [
      "Reconstitutions, auctions, and forced flows move prices for reasons unrelated to value. We are paid to absorb that, and we size to the impact estimate rather than the headline.",
      "That estimate is built before the event, not fitted afterward. An event we cannot model in advance is one we sit out.",
    ],
  },
  {
    slug: "tail-overlay",
    name: "Tail Overlay",
    oneLiner: "A permanent long-convexity hedge that runs across the whole book.",
    markets: "Cross-asset",
    instruments: "Options",
    body: [
      "The overlay is a cost of doing business, not a trade. It runs continuously so the rest of the book can hold conviction through a drawdown it did not cause.",
      "It is never switched off to improve a quarter. Risk sets its size and the desk cannot override it.",
    ],
  },
];
