export default function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`container-gc2 ${className}`}>{children}</div>;
}
