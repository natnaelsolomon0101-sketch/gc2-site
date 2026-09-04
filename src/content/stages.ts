/* The four stages of "How an idea earns capital": the single source for the
   home Approach section, /governance's StageStrip, and the thesis frame's
   count row. Lives in content (server-safe) rather than inside the client
   component so a server component can read stages.length. */
export type Stage = {
  n: string;
  label: string;
  heading: string;
  body: string;
  holder: string;
  gateLabel: string;
  gate: string;
  /** 04 is the standing power, not a step. It is set in the brighter ink. */
  standing?: boolean;
};

/** The single source for the four stages. /governance imports StageStrip, so
 *  the two pages cannot drift apart. */
export const stages: Stage[] = [
  {
    n: "01",
    label: "Research",
    heading: "We build the data before we build the view.",
    body:
      "Datasets are assembled in-house and the models are written in-house, so the evidence behind a position is ours rather than rented. An idea arrives as a written claim: what should be true, and what would prove it wrong.",
    holder: "The author of the idea",
    gateLabel: "Advances when",
    gate: "The claim is written down together with the evidence that would kill it.",
  },
  {
    n: "02",
    label: "Adversarial review",
    heading: "Every idea is argued against before it is funded.",
    body:
      "The desk argues the other side in good faith and the author defends the idea in front of the room. Nothing earns capital because the house believes it; there is no house view that overrides the person carrying the risk.",
    holder: "The desk, in the room",
    gateLabel: "Advances when",
    gate: "It survives the case made against it, argued by people who wanted it to fail.",
  },
  {
    n: "03",
    label: "Sizing",
    heading: "Sized to survive the tail, not to flatter the mean.",
    body:
      "Size follows what a position must withstand rather than what it is expected to earn. A book that cannot hold through a drawdown it did not cause is mis-sized, whatever the case for it.",
    holder: "The named owner, inside Committee limits",
    gateLabel: "Advances when",
    gate: "It fits the mandate and the limits the Investment Committee has set.",
  },
  {
    n: "04",
    label: "The veto",
    heading: "Risk runs independently of the desk and can cut any position.",
    body:
      "That authority is not advisory and does not require the desk to agree. It applies after capital is committed, to any position, including one the room liked. The firm is deliberately small and every position has a named owner, so a cut lands on a person rather than on nobody.",
    holder: "Risk, independent of the desk",
    gateLabel: "Standing authority",
    gate: "Not a stage an idea passes. A power that stays live for as long as the position does.",
    standing: true,
  },
];
