export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="measure-prose t-prose
        [&>p]:t-body [&>p]:mt-6 [&>p]:text-ink
        [&>h2]:font-display [&>h2]:mt-12 [&>h2]:text-black
        [&>ul]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>li]:mt-2"
    >
      {children}
    </div>
  );
}
