import { CONTACT } from "@/content/site";

/**
 * Spec's floating launcher: 48px charcoal circle, 24px from bottom-right.
 * Wired to a real mailto rather than a chat widget we do not run.
 */
export default function Launcher() {
  return (
    <a
      href={`mailto:${CONTACT.email}`}
      aria-label="Email investor relations"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-paper-white transition-opacity hover:opacity-88"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 6.5h18v11H3z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </a>
  );
}
