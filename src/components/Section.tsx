type Surface = "paper" | "stone" | "black";

/* Foundation r3, the light canvas. The three surface names were already the
   paper vocabulary; they now resolve to the semantic tokens that match them.
   `black` is the one inverted band a paper page is allowed and carries
   `.on-ink`, which flips the focus ring to ground (the old `on-black` class it
   carried was never defined in globals.css and did nothing). */
const bg: Record<Surface, string> = {
  paper: "bg-ground text-ink-2",
  stone: "bg-ground-2 text-ink-2",
  black: "bg-ink text-ground on-ink",
};

export default function Section({
  children, surface = "paper", className = "", id, as: Tag = "section",
}: {
  children: React.ReactNode; surface?: Surface; className?: string; id?: string;
  as?: "section" | "div" | "footer";
}) {
  return (
    // §7 rule 4: container-type: inline-size, so a Section decides its own
    // layout from its own width via @container rather than the viewport —
    // the same composition at 1920 inside a narrow column as at 768.
    <Tag id={id} className={`${bg[surface]} [container-type:inline-size] ${className}`}>
      {children}
    </Tag>
  );
}
