type Surface = "paper" | "stone" | "black";

const bg: Record<Surface, string> = {
  paper: "bg-obsidian text-ash",
  stone: "bg-graphite text-ash",
  black: "bg-black text-cloud on-black",
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
