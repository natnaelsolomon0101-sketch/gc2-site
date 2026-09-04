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
  { name: "Howard Marks", role: "Oaktree Capital", id: "u36afZDX8Jo", title: "On ownership versus debt", channel: "Barron's" },
  { name: "Cathie Wood", role: "ARK Invest", id: "AXMzFedWyhY", title: "On Nvidia, Tesla, Coinbase and Elon Musk", channel: "Barron's" },
  { name: "Bill Ackman", role: "Pershing Square", id: "Dr0-83M-z50", title: "A blueprint for the next decade of wealth", channel: "Forbes" },
  { name: "Stanley Druckenmiller", role: "Duquesne Family Office", id: "-5Weeox0Xus", title: "In Good Company, with Nicolai Tangen", channel: "Norges Bank Investment Management" },
  { name: "Ray Dalio", role: "Bridgewater founder", id: "Al0SLSS4vmw", title: "On US debt, the AI bubble and bond markets", channel: "Bloomberg Television" },
  { name: "Karen Karniol-Tambour", role: "Bridgewater co-CIO", id: "hDbd9KYLtXM", title: "Investing in a more fragmented world", channel: "Bridgewater Associates" },
  { name: "Ken Griffin", role: "Citadel", id: "Oq-8Umqsq7A", title: "In conversation, Bloomberg Live", channel: "Bloomberg Live" },
  { name: "Liz Ann Sonders", role: "Charles Schwab, chief investment strategist", id: "G8Fn6W2B-sQ", title: "Red flags and a possible inflationary boom", channel: "Bloomberg Television" },
  { name: "Jamie Dimon", role: "JPMorgan Chase", id: "DLVOHqleS88", title: "Market leverage is high", channel: "CNBC Television" },
  { name: "Andrew Ross Sorkin", role: "CNBC and DealBook", id: "hBiy8toTyQo", title: "With Jerome Powell on the Fed's role", channel: "New York Times Events" },
  { name: "David Rubenstein", role: "Carlyle co-founder, Bloomberg Wealth", id: "u8ANHNU0Fng", title: "With Warren Buffett on his early career", channel: "Bloomberg Originals", poster: "sd" },
];
