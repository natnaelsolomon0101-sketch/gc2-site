import Link from "next/link";
import { site } from "@/config/site";

export default function Wordmark({ onBlack = false }: { onBlack?: boolean }) {
  return (
    <Link href="/" aria-label={`${site.mark} home`}
      className={`t-wordmark ${onBlack ? "text-cloud" : "text-pure"}`}>
      {site.mark}
    </Link>
  );
}
