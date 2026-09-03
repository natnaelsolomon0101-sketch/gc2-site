"use client";

/**
 * The one control on the preview: triggers the browser's own print dialog.
 * `window.print()` needs a click handler, which needs a client component —
 * everything else on this route stays a server component. `.btn` already
 * meets the 44px target (16px type, 1.5 line-height, 12px vertical padding =
 * 48px) and is the same button every other page on the site uses, so this is
 * not a new control, just a new place to fire it from.
 */
export default function PrintButton() {
  return (
    <button type="button" className="btn" onClick={() => window.print()}>
      Print this page
    </button>
  );
}
