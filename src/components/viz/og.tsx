/**
 * The one Open Graph card. Every `opengraph-image.tsx` in `src/app/**` is four
 * lines that hand this module a title and a description; nothing else about the
 * card is decided at the call site, which is the only way eighteen routes stay
 * one design.
 *
 * The composition is APPENDIX-A read literally: paper ground, the route title
 * in the display face at 96px in `ink`, the route's own one-line description in
 * `ink-2`, the wordmark bottom-left. Nothing else. No rule, no gradient, no
 * icon, no accent — a share card is the smallest surface the site has and it is
 * the one place where "left-aligned, tokens only" has nowhere to hide. The one
 * accent LIGHT-PASS.md permits here, deep-iris, is deliberately not spent: on
 * eighteen cards that share one layout, a colour used on all of them is not an
 * accent, it is a second ground.
 *
 * FONTS: the two faces are VENDORED as TTFs under `src/app/fonts/`, not fetched
 * from fonts.googleapis.com at build. Both are SIL OFL 1.1 (licences beside
 * them), which permits redistribution inside a project. The reason is the build:
 * `opengraph-image.tsx` is statically optimized, so a network fetch here is a
 * build-time network dependency on eighteen routes at once — one slow response
 * and the build fails with no share cards, which is the exact regression this
 * commit exists to close (STATE.md §0.2 item 2). Satori needs the raw buffer
 * either way, so `next/font/google` cannot serve this: it emits CSS and a
 * self-hosted URL, not a `Uint8Array`.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

/** Facebook's and X's shared card geometry. Both crop to ~1.91:1. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/* Read once per module instance rather than once per request: eighteen route
   segments each render their own card at build, and the two files are 400KB
   together. */
const FONT_DIR = join(process.cwd(), "src", "app", "fonts");
const displayFont = readFile(join(FONT_DIR, "DMSerifDisplay-Regular.ttf"));
const uiFont = readFile(join(FONT_DIR, "Inter-Regular.ttf"));

/* Tokens, copied as literals because satori resolves no custom properties and
   no stylesheet. Keep in step with `src/app/globals.css`:
   --color-ground / --color-ink / --color-ink-2 / --color-ink-3. */
const GROUND = "#f7f5f0";
const INK = "#141311";
const INK_2 = "#544e45";
const INK_3 = "#67615a";

/**
 * The route's own `metadata.description`, reduced to its opening statement.
 *
 * This does NOT write copy — the words are the page's, and the section that
 * owns the page owns them. It cuts at the first sentence end or the first em
 * dash, whichever comes first, and only when the description would otherwise
 * run past two rendered lines at 28px. `/contact` and `/strategies` are the two
 * that actually get cut; the other sixteen pass through whole.
 */
export function opening(description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= 118) return trimmed;
  const stop = trimmed.search(/\.\s|\s—\s/);
  if (stop > 0 && stop <= 118) {
    return trimmed[stop] === "." ? trimmed.slice(0, stop + 1) : trimmed.slice(0, stop);
  }
  return trimmed;
}

export type OgCard = {
  /** The display line. Short: this is set at 96px and wraps at ~21 characters. */
  title: string;
  /** The route's metadata description. Passed through `opening()`. */
  description: string;
  /**
   * The home card only (§5.10): the day's Treasury curve, drawn from the same
   * fetch the page uses, so a share of the home page is dated. `null` — an
   * unreachable feed — falls back to the plain card rather than to a fake line.
   */
  curve?: { d: string; width: number; height: number; source: string } | null;
};

/** Alt text for the card, so the `og:image:alt` a screen reader hears is the
 *  card's actual content and not "Open Graph image". */
export function ogAlt({ title, description }: OgCard): string {
  return `${title} — ${opening(description)}`;
}

export function ogImage({ title, description, curve = null }: OgCard) {
  return Promise.all([displayFont, uiFont]).then(
    ([display, ui]) =>
      new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              background: GROUND,
              padding: "76px 84px",
              fontFamily: "Inter",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 1010 }}>
              <div
                style={{
                  fontFamily: "DM Serif Display",
                  fontSize: 96,
                  lineHeight: 1.06,
                  /* DM Serif ships weight 400 only; the site tightens tracking
                     in CSS instead of reaching for a 300 that does not exist,
                     and the card does the same. */
                  letterSpacing: "-0.021em",
                  color: INK,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  marginTop: 40,
                  fontSize: 28,
                  lineHeight: 1.44,
                  color: INK_2,
                  maxWidth: 880,
                }}
              >
                {opening(description)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "DM Serif Display",
                  fontSize: 34,
                  letterSpacing: "-0.01em",
                  color: INK,
                }}
              >
                {site.mark}
              </div>
              {curve ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <svg
                    width={curve.width}
                    height={curve.height}
                    viewBox={`0 0 ${curve.width} ${curve.height}`}
                  >
                    <path
                      d={curve.d}
                      fill="none"
                      stroke={INK}
                      strokeWidth={1}
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div style={{ marginTop: 14, fontSize: 17, color: INK_3, letterSpacing: "0.09em" }}>
                    {curve.source}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ),
        {
          ...OG_SIZE,
          fonts: [
            { name: "DM Serif Display", data: display, style: "normal", weight: 400 },
            { name: "Inter", data: ui, style: "normal", weight: 400 },
          ],
        }
      )
  );
}
