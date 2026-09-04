/* "Worth watching" on /markets: one conversation per person, official
   uploads only (Barron's, Bloomberg, CNBC, New York Times Events, Norges
   Bank Investment Management, Bridgewater, Forbes), embedded through
   YouTube's player, which is the licence YouTube grants; nothing is copied.
   `poster: "sd"` marks an upload YouTube never rendered a 1280px frame for,
   so the page asks for the 640px one directly instead of taking a 404.
   Add, remove or reorder people here; the page renders whatever is listed. */
export type Person = {
  name: string;
  role: string;
  id: string;
  title: string;
  channel: string;
  poster?: "sd";
};

export const people: Person[] = [
  { name: "Cathie Wood", role: "ARK Invest", id: "AXMzFedWyhY", title: "On Nvidia, Tesla, Coinbase and Elon Musk", channel: "Barron's" },
  { name: "Sallie Krawcheck", role: "Ellevest", id: "_A1_8B6cELc", title: "On banking, Ellevest and investing in women", channel: "Barron's", poster: "sd" },
  { name: "Dawn Fitzpatrick", role: "Soros Fund Management", id: "wIcQCHSZAmY", title: "Navigating market volatility", channel: "Bloomberg Live" },
  { name: "Mellody Hobson", role: "Ariel Investments", id: "vLuvwaDc4rE", title: "The full CNBC interview", channel: "CNBC Television", poster: "sd" },
  { name: "Karen Karniol-Tambour", role: "Bridgewater co-CIO", id: "hDbd9KYLtXM", title: "Investing in a more fragmented world", channel: "Bridgewater Associates" },
  { name: "Mary Callahan Erdoes", role: "J.P. Morgan Asset & Wealth Management", id: "TwTWZddVvdg", title: "On AI's global impact", channel: "Bloomberg Television" },
  { name: "Howard Marks", role: "Oaktree Capital", id: "u36afZDX8Jo", title: "On ownership versus debt", channel: "Barron's" },
  { name: "Jane Fraser", role: "Citi", id: "Yo3Vwx_Ln8M", title: "Lead with empathy", channel: "Stanford Graduate School of Business" },
  { name: "Liz Ann Sonders", role: "Charles Schwab, chief investment strategist", id: "G8Fn6W2B-sQ", title: "Red flags and a possible inflationary boom", channel: "Bloomberg Television" },
  { name: "Savita Subramanian", role: "BofA, head of US equity strategy", id: "mT9D_gYWIEk", title: "A muddle ahead for stocks", channel: "Bloomberg Television" },
  { name: "Bill Ackman", role: "Pershing Square", id: "Dr0-83M-z50", title: "A blueprint for the next decade of wealth", channel: "Forbes" },
  { name: "Katie Koch", role: "TCW", id: "Tvi7NKp5bhY", title: "Bloomberg Wealth, with David Rubenstein", channel: "David Rubenstein" },
  { name: "Lisa Shalett", role: "Morgan Stanley Wealth Management CIO", id: "56ONZlVJ_Jk", title: "On Fed cuts", channel: "Bloomberg Podcasts" },
  { name: "Stanley Druckenmiller", role: "Duquesne Family Office", id: "-5Weeox0Xus", title: "In Good Company, with Nicolai Tangen", channel: "Norges Bank Investment Management" },
  { name: "Saira Malik", role: "Nuveen CIO", id: "r-daSirHec8", title: "The risks she is watching", channel: "CNBC Television" },
  { name: "Abby Joseph Cohen", role: "Columbia Business School, formerly Goldman Sachs", id: "Q2esy2po-XE", title: "On AI stocks and a weaker dollar", channel: "Bloomberg Television" },
  { name: "Ray Dalio", role: "Bridgewater founder", id: "Al0SLSS4vmw", title: "On US debt, the AI bubble and bond markets", channel: "Bloomberg Television" },
  { name: "Jamie Dimon", role: "JPMorgan Chase", id: "DLVOHqleS88", title: "Market leverage is high", channel: "CNBC Television" },
  { name: "Andrew Ross Sorkin", role: "CNBC and DealBook", id: "hBiy8toTyQo", title: "With Jerome Powell on the Fed's role", channel: "New York Times Events" },
  { name: "David Rubenstein", role: "Carlyle co-founder, Bloomberg Wealth", id: "u8ANHNU0Fng", title: "With Warren Buffett on his early career", channel: "Bloomberg Originals", poster: "sd" },
];
