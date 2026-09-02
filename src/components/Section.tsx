type Surface = "paper" | "stone" | "black";

const bg: Record<Surface, string> = {
  paper: "bg-paper text-ink",
  stone: "bg-stone text-ink",
  black: "bg-black text-stone on-black",
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
