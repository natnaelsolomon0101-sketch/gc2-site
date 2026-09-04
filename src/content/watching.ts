/* Episodes embedded on /markets under "Worth watching", grouped by host.
   Official uploads only (Bloomberg, David Rubenstein's channel, CNBC
   Television, New York Times Events), embedded via YouTube's player, which
   is the licence YouTube grants; nothing is copied. Add, remove or reorder
   entries here; the page renders whatever is listed. */
/* `poster: "sd"` marks an upload YouTube never rendered a 1280px frame for,
   so the page asks for the 640px one directly instead of taking a 404. */
export type Episode = { id: string; title: string; channel: string; poster?: "sd" };
export type Host = { name: string; note: string; newsQuery: string; episodes: Episode[] };

export const hosts: Host[] = [
  {
    name: "Andrew Ross Sorkin",
    note: "CNBC Squawk Box and the New York Times DealBook Summit",
    newsQuery: "\"Andrew Ross Sorkin\"",
    episodes: [
      { id: "X-M1pD_2AdQ", title: "Jeff Bezos on whether there is an AI bubble", channel: "CNBC Television" },
      { id: "FG5JsLHPW_I", title: "Anthropic's Dario Amodei and JPMorgan's Jamie Dimon on the AI boom and regulation", channel: "CNBC Television" },
      { id: "hBiy8toTyQo", title: "Jerome Powell on the Fed's role in America's financial future", channel: "New York Times Events" },
      { id: "Pkj-BLHs6dE", title: "Jensen Huang of Nvidia on the future of AI", channel: "New York Times Events" },
      { id: "_15DReQKbt8", title: "Bill Gates on philanthropy, Microsoft and taxes", channel: "New York Times Events" },
      { id: "nwQcpl6Nsbw", title: "Global economic outlook panel at Davos, moderated by Andrew Ross Sorkin", channel: "CNBC Television" },
    ],
  },
  {
    name: "David Rubenstein",
    note: "The David Rubenstein Show and Bloomberg Wealth",
    newsQuery: "\"David Rubenstein\"",
    episodes: [
      { id: "u8ANHNU0Fng", title: "Warren Buffett on his early career in finance", channel: "Bloomberg Originals", poster: "sd" },
      { id: "UKkykksZHOU", title: "Blackstone's Jon Gray", channel: "David Rubenstein" },
      { id: "y3UOPlIHADw", title: "Brookfield CEO Bruce Flatt", channel: "David Rubenstein" },
      { id: "48In79LWrio", title: "Greenlight Capital's David Einhorn", channel: "David Rubenstein", poster: "sd" },
      { id: "Tvi7NKp5bhY", title: "Katie Koch", channel: "David Rubenstein" },
      { id: "yekb0pvfr-4", title: "Schwab CEO Rick Wurster", channel: "David Rubenstein" },
    ],
  },
];
