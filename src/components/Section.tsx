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
    <Tag id={id} className={`${bg[surface]} ${className}`}>
      {children}
    </Tag>
  );
}
