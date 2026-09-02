import Link from "next/link";
import { site } from "@/config/site";

export default function Wordmark({ onBlack = false }: { onBlack?: boolean }) {
  return (
    <Link href="/" aria-label={`${site.mark} home`}
      className={`t-wordmark inline-flex min-h-11 min-w-11 items-center ${onBlack ? "text-stone" : "text-black"}`}>
      {site.mark}
    </Link>
  );
}
