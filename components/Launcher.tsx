import { CONTACT } from "@/content/site";

/**
 * Floating launcher: a 48px ink circle 24px from the bottom-right corner.
 * Wired to a real mailto rather than a chat widget we do not run. The footer
 * reserves bottom padding on small screens so this never sits on the legal type.
 */
export default function Launcher() {
  return (
    <a
      href={`mailto:${CONTACT.email}`}
      aria-label={`Email ${CONTACT.email}`}
      className="on-ink fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-[0_6px_20px_rgba(23,23,33,0.22)] transition-colors hover:bg-ink-3"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m4 8 8 5 8-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
