/* Open Graph card for `/`. The title is HeroV2's own headline — "Evidence
   first. Then capital." — with its two operative words italic in deep-iris,
   the exact treatment `.hv2-h1 em` gives them on the page (r9). The plain
   `title` string below is the same words, used for the alt text; the words
   are not typed twice by hand, they are HeroV2's, carried here as the one
   place this card is allowed to differ from a route's `metadata.title`.
   The description is the root layout's.

   The home card is the one card that carries more than type (§5.10): the day's
   Treasury par yield curve, drawn from `fetchYieldCurve()`, the same fetch and
   the same `geometry()` the page's <YieldCurve/> uses, so the two can never
   disagree. It revalidates on the curve's own six-hour cadence, which makes a
   share of the home page dated and specific rather than evergreen and generic.

   If the feed is unreachable the card renders without it. There is no fallback
   line: a drawn curve with a date printed beside it is a claim — so the card
   falls back to the shared static chart glyph instead (see og.tsx), never to
   an invented number. */
import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE, type TitleSegment } from "@/components/viz/og";
import {
  fetchYieldCurve, geometry, asOf, TREASURY_ATTRIBUTION,
} from "@/components/viz/treasury";
import { site } from "@/config/site";

/* Six hours, the same cadence as YIELD_CURVE_REVALIDATE. Written as a literal
   because Next only accepts a statically analyzable value for a route segment
   config export — an imported constant fails the build with "Invalid segment
   configuration export detected". Keep the two in step by hand. */
export const revalidate = 21600;

/* HeroV2.tsx: <span className="hv2-l">Evidence <em>first</em>.</span> and
   <span className="hv2-l">Then <em>capital</em>.</span>. Copied here as
   segments, not retyped as prose, so the two words that go italic are the
   same two words the page italicises. */
const TITLE_LINES: TitleSegment[][] = [
  [{ text: "Evidence " }, { text: "first", accent: true }, { text: "." }],
  [{ text: "Then " }, { text: "capital", accent: true }, { text: "." }],
];

const card = {
  title: "Evidence first. Then capital.",
  titleLines: TITLE_LINES,
  description:
    "A private investment partnership running concentrated, systematic strategies across liquid global markets.",
};

/* Drawn at its final pixel size rather than scaled: satori rasterizes once, so
   a 1px stroke in a viewBox of these exact dimensions is a 1px stroke in the
   PNG. Wide and short, to sit beside the wordmark without competing with it. */
const PLOT = { width: 430, height: 104 };

export const alt = ogAlt(card);
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const data = await fetchYieldCurve();
  /* The same three strings the share cards carry (counsel's second read): the
     plot named in type above the line, what it is not underneath, and the frame
     line. This is the card most likely to be seen by someone who has never seen
     the site, so it is the last place to leave a rising hairline unlabelled. */
  const curve = data
    ? {
        ...PLOT,
        d: geometry(data.points, PLOT.width, PLOT.height).d,
        title: "U.S. Treasury par yield curve",
        source: `${TREASURY_ATTRIBUTION} · as of ${asOf(data.date)}`,
        note: "Public market data. Not fund performance.",
      }
    : null;
  return ogImage({
    ...card,
    curve,
    frame: `Informational only. Not an offer. ${site.domain}`,
  });
}
