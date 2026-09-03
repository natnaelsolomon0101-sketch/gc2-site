/**
 * The one Open Graph card. Every `opengraph-image.tsx` in `src/app/**` is four
 * lines that hand this module a title and a description; nothing else about the
 * card is decided at the call site, which is the only way eighteen routes stay
 * one design.
 *
 * The composition matches the r9 hero (HeroV2.tsx): paper ground, the route
 * title in the display face at 96px in `ink` — the home card's title is the
 * hero's own headline, "Evidence first. Then capital.", with its two operative
 * words italic in deep-iris, the same treatment `.hv2-h1 em` gives them on the
 * page — the route's own one-line description in `ink-2`, the city caption and
 * the wordmark bottom-left. Bottom-right carries a chart: the home card draws
 * the day's real Treasury curve (unchanged, §5.10); every other card draws a
 * simplified static chart glyph — the hero's floating chart, reduced to a
 * single line and a marker, with no fetch and no claim to be data. No rule, no
 * gradient, no icon beyond that glyph — a share card is the smallest surface
 * the site has and it is the one place where "left-aligned, tokens only" has
 * nowhere to hide. Deep-iris is spent on the italic words and the glyph only;
 * on eighteen cards that share one layout, a colour used on all of them is not
 * an accent, it is a second ground.
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
/* --color-accent-deep-iris. The one accent, spent here on the home headline's
   two italic words and on the chart glyph — the same two things it is spent
   on in HeroV2 and YieldSurfaceCanvas. */
const DEEP_IRIS = "#4b49aa";

/** The glyph's box. Same footprint as the home card's real curve (`PLOT` in
 *  `src/app/opengraph-image.tsx`) so the two sit at the same size and place
 *  whichever card is showing. */
export const OG_GLYPH_SIZE = { width: 430, height: 104 } as const;

/* A simplified, static line: not a reading of any feed, so it carries no
   title, no source and no note — the three things that make the real curve a
   claim. Just the hero's motif, reduced to a line and a marker. */
const GLYPH_D =
  "M4,86 C46,80 54,56 92,52 C132,48 140,70 178,64 " +
  "C218,58 226,32 266,28 C306,24 314,44 352,40 C388,36 398,18 424,12";

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

/** One word or phrase inside a title line. `accent` gives it the hero's
 *  `em{font-style:italic;color:var(--color-accent-deep-iris)}` treatment. */
export type TitleSegment = { text: string; accent?: boolean };

export type OgCard = {
  /** The display line, plain — used for the alt text and as the fallback
   *  rendering. Short: this is set at 96px and wraps at ~21 characters. */
  title: string;
  /**
   * The rich rendering of `title`, one array per line: the home card's own
   * two-line headline with its italic words (§TRANSFORM "motion"). Optional —
   * the other seventeen cards have no operative word to pick and render
   * `title` as plain text instead, exactly as before.
   */
  titleLines?: TitleSegment[][];
  /** The route's metadata description. Passed through `opening()`. */
  description: string;
  /**
   * The home card only (§5.10): the day's Treasury curve, drawn from the same
   * fetch the page uses, so a share of the home page is dated. `null` — an
   * unreachable feed — falls back to the plain card rather than to a fake line.
   */
  curve?: {
    d: string; width: number; height: number;
    /** "U.S. Treasury par yield curve" — the plot named in type, above the line. */
    title: string;
    /** "U.S. Treasury · as of {date}". */
    source: string;
    /** "Public market data. Not fund performance." */
    note: string;
  } | null;
  /** The frame line every share card carries. Counsel's second read puts it on
   *  the home Open Graph card too: it is the card most likely to be seen by
   *  someone who has never seen the site. */
  frame?: string | null;
};

/** Alt text for the card, so the `og:image:alt` a screen reader hears is the
 *  card's actual content and not "Open Graph image". */
export function ogAlt({ title, description }: OgCard): string {
  return `${title} — ${opening(description)}`;
}

export function ogImage({
  title, titleLines, description, curve = null, frame = null,
}: OgCard) {
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
              {titleLines ? (
                titleLines.map((line, i) => (
                  /* satori requires an explicit display on any element with
                     more than one child, so this row has to stay display:flex
                     — but a flex row also collapses the trailing space on a
                     text-only flex item at its own box edge ("Evidence " ran
                     into "first" with no gap). white-space:pre on every span
                     keeps the literal space instead of letting it collapse. */
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      fontFamily: "DM Serif Display",
                      fontSize: 96,
                      lineHeight: 1.06,
                      letterSpacing: "-0.021em",
                      color: INK,
                    }}
                  >
                    {line.map((seg, j) => (
                      <span
                        key={j}
                        style={{
                          whiteSpace: "pre",
                          ...(seg.accent
                            ? { fontStyle: "italic", color: DEEP_IRIS }
                            : null),
                        }}
                      >
                        {seg.text}
                      </span>
                    ))}
                  </div>
                ))
              ) : (
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
              )}
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                {frame ? (
                  <div style={{ marginBottom: 12, fontSize: 16, color: INK_3, letterSpacing: "0.09em" }}>
                    {frame}
                  </div>
                ) : null}
                {/* The standing fact every card carries, the way HeroV2's foot
                    caption line does — site.city, never a literal. */}
                <div style={{ marginBottom: 12, fontSize: 16, color: INK_3, letterSpacing: "0.09em" }}>
                  {site.city}
                </div>
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
              </div>
              {curve ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ marginBottom: 14, fontSize: 19, color: INK }}>
                    {curve.title}
                  </div>
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
                  <div style={{ marginTop: 4, fontSize: 17, color: INK_3, letterSpacing: "0.09em" }}>
                    {curve.note}
                  </div>
                </div>
              ) : (
                /* The seventeen cards with no feed of their own still carry the
                   hero's picture, reduced to what it is without one: a line and
                   a marker, drawn once, not fetched. */
                <svg
                  width={OG_GLYPH_SIZE.width}
                  height={OG_GLYPH_SIZE.height}
                  viewBox={`0 0 ${OG_GLYPH_SIZE.width} ${OG_GLYPH_SIZE.height}`}
                >
                  <path
                    d={GLYPH_D}
                    fill="none"
                    stroke={DEEP_IRIS}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity={0.55}
                  />
                  <circle cx={424} cy={12} r={4.5} fill={DEEP_IRIS} />
                </svg>
              )}
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
