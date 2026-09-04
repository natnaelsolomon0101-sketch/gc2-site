/* Episodes embedded on /markets under "Worth watching". Official uploads
   only (Bloomberg / David Rubenstein's channel), embedded via YouTube's
   player, which is the licence YouTube grants; nothing is copied. Add or
   remove entries here; the page renders whatever is listed. */
export type Episode = { id: string; title: string; channel: string };

export const watching: Episode[] = [
  { id: "u8ANHNU0Fng", title: "The David Rubenstein Show: Warren Buffett on his early career in finance", channel: "Bloomberg Originals" },
  { id: "UKkykksZHOU", title: "Bloomberg Wealth with David Rubenstein: Blackstone's Jon Gray", channel: "David Rubenstein" },
  { id: "y3UOPlIHADw", title: "Brookfield CEO Bruce Flatt on Bloomberg Wealth with David Rubenstein", channel: "David Rubenstein" },
  { id: "48In79LWrio", title: "Bloomberg Wealth: Greenlight Capital's David Einhorn", channel: "David Rubenstein" },
  { id: "Tvi7NKp5bhY", title: "Bloomberg Wealth: Katie Koch", channel: "David Rubenstein" },
  { id: "yekb0pvfr-4", title: "Bloomberg Wealth: Schwab CEO Rick Wurster", channel: "David Rubenstein" },
];
