/**
 * The U.S. Treasury daily par yield curve.
 *
 * SOURCE (verified 3 September 2026, HTTP 200, live data through 2026-09-02):
 *   https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml
 *     ?data=daily_treasury_yield_curve
 *     &field_tdr_date_value_month=YYYYMM
 * An Atom feed, one <entry> per business day, no key and no registration. The
 * month form is used rather than the year form (`field_tdr_date_value=YYYY`,
 * which also works) because the year feed is ~260KB and the month feed is ~4KB
 * for the same last row.
 *
 * TERMS. Treasury publishes this as open government data. Bureau of the Fiscal
 * Service, on the same department's data portal: "The data is offered free,
 * without restriction, and available to copy, adapt, redistribute, or otherwise
 * use for non-commercial or commercial purposes."
 * (https://fiscaldata.treasury.gov/api-documentation/). Works of the United
 * States Government are additionally outside copyright under 17 U.S.C. §105.
 * Nothing here requires a licence, an attribution format, or a display
 * restriction — but the component prints the attribution and the as-of date
 * anyway, because EVERY-SCREEN.md §2 makes the source line part of the design.
 *
 * WHAT IS NOT DONE HERE: no interpolation, no smoothing, no fill-forward, no
 * cached last-known-good. If the feed is unreachable or unparseable this
 * returns null and the component renders nothing. A yield curve that is not
 * today's is a lie with a date printed under it.
 */

/** Six hours. Markets close, the curve is republished once a business day. */
export const YIELD_CURVE_REVALIDATE = 21600;

/** The stable `data-source` value. Whitelisted in scripts/qa/sources.ts. */
export const TREASURY_SOURCE = "home.treasury.gov";

/** Printed under the curve. */
export const TREASURY_ATTRIBUTION = "U.S. Treasury";

const FEED =
  "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml";

/** Tenor, in years, paired with the feed's field name and its printed label.
 *  BC_1_5MONTH (a 6-week bill, added 2024) and BC_30YEARDISPLAY (a duplicate of
 *  BC_30YEAR) are deliberately absent: the first is not a standard curve point
 *  and the second would draw the long end twice. */
export const TENORS = [
  { field: "BC_1MONTH", years: 1 / 12, label: "1M" },
  { field: "BC_2MONTH", years: 2 / 12, label: "2M" },
  { field: "BC_3MONTH", years: 3 / 12, label: "3M" },
  { field: "BC_4MONTH", years: 4 / 12, label: "4M" },
  { field: "BC_6MONTH", years: 6 / 12, label: "6M" },
  { field: "BC_1YEAR", years: 1, label: "1Y" },
  { field: "BC_2YEAR", years: 2, label: "2Y" },
  { field: "BC_3YEAR", years: 3, label: "3Y" },
  { field: "BC_5YEAR", years: 5, label: "5Y" },
  { field: "BC_7YEAR", years: 7, label: "7Y" },
  { field: "BC_10YEAR", years: 10, label: "10Y" },
  { field: "BC_20YEAR", years: 20, label: "20Y" },
  { field: "BC_30YEAR", years: 30, label: "30Y" },
] as const;

export type CurvePoint = { years: number; label: string; rate: number };
export type YieldCurve = {
  /** Trade date of the row, ISO `YYYY-MM-DD`, as published. */
  date: string;
  points: CurvePoint[];
};

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function month(key: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${FEED}?data=daily_treasury_yield_curve&field_tdr_date_value_month=${key}`,
      { next: { revalidate: YIELD_CURVE_REVALIDATE } }
    );
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/* The feed is Atom with ADO.NET data-services properties inside each entry.
   Parsed with two regexes rather than an XML library: the shape is fixed, the
   payload is 4KB, and adding a parser to the bundle for thirteen numbers is not
   a trade worth making. Anything unexpected falls through to null. */
const ENTRY = /<m:properties>([\s\S]*?)<\/m:properties>/g;
const FIELD = (name: string) =>
  new RegExp(`<d:${name}[^>]*>([^<]*)</d:${name}>`);

/** Every well-formed row in one month's feed, oldest first. */
function parseAll(xml: string): YieldCurve[] {
  const rows: YieldCurve[] = [];
  for (const [, body] of xml.matchAll(ENTRY)) {
    const date = body.match(FIELD("NEW_DATE"))?.[1]?.slice(0, 10);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

    const points: CurvePoint[] = [];
    for (const t of TENORS) {
      const raw = body.match(FIELD(t.field))?.[1];
      if (raw === undefined || raw === "") continue;
      const rate = Number(raw);
      if (!Number.isFinite(rate)) continue;
      points.push({ years: t.years, label: t.label, rate });
    }
    /* A row with a hole at one tenor is normal and fine; a row with almost
       nothing in it is a bad row, not a curve. */
    if (points.length < 8) continue;
    rows.push({ date, points });
  }
  return rows.sort((a, b) => (a.date < b.date ? -1 : 1));
}

function parse(xml: string): YieldCurve | null {
  const rows = parseAll(xml);
  return rows.length ? rows[rows.length - 1] : null;
}

/**
 * The most recent published curve, or null.
 *
 * Reads the current UTC month and falls back to the previous one: on the first
 * business day of a month the new month's feed exists but is empty until
 * Treasury publishes, and on 1 January the previous month is also the previous
 * year, which the month form handles and the year form does not.
 */
export async function fetchYieldCurve(): Promise<YieldCurve | null> {
  const now = new Date();
  const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));

  for (const key of [monthKey(now), monthKey(prev)]) {
    const xml = await month(key);
    if (!xml) continue;
    const curve = parse(xml);
    if (curve) return curve;
  }
  return null;
}

/**
 * The last `days` published curves, oldest first, or null.
 *
 * Reads seven consecutive month feeds and keeps the tail. A month of business
 * days is 19-23, so four feeds reach 90 only if the current month is nearly
 * over; measured on the second of September, five feeds returned 86. Seven has
 * slack for a short quarter and for the rows dropped below. Each feed is ~4KB
 * and they share the six-hour revalidate with everything else here, so the
 * extra months cost a handful of cached requests a quarter-day.
 *
 * A month that fails to fetch is skipped rather than fatal: the surface is
 * still true with 71 days on it, and the caption prints the count actually
 * drawn rather than the count asked for. Null only when nothing at all came
 * back — the same rule as the single curve, for the same reason.
 */
export async function fetchYieldHistory(days = 90): Promise<YieldCurve[] | null> {
  const now = new Date();
  const keys: string[] = [];
  for (let back = 6; back >= 0; back--) {
    keys.push(monthKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 1))));
  }

  const rows: YieldCurve[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    const xml = await month(key);
    if (!xml) continue;
    for (const row of parseAll(xml)) {
      /* A date can only appear once. The month feeds do not overlap today, but
         a duplicate would put two ribs in the same plane and read as a crease
         in the surface rather than as a bad row. */
      if (seen.has(row.date)) continue;
      seen.add(row.date);
      rows.push(row);
    }
  }
  if (!rows.length) return null;
  rows.sort((a, b) => (a.date < b.date ? -1 : 1));
  return rows.slice(-days);
}

/** `2026-09-02` -> `Sep 2, 2026`. Matches `formatDate` in src/content/notes.ts:
 *  one date format on the site, and UTC so the printed day never drifts with
 *  the reader's clock. */
export function asOf(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}

/**
 * Curve geometry, shared by the component and the home Open Graph card so the
 * two cannot draw different lines from the same data.
 *
 * x is log-spaced in years. A par curve on a linear tenor axis puts eight of
 * its thirteen points inside the first sixth of the width and then draws a long
 * flat tail — the front end, which is the part that moves, becomes unreadable.
 * Log spacing is the market's own convention for exactly that reason.
 *
 * y is normalized to the day's own min and max with a 12% margin. There is no
 * printed y scale and none is implied: the component states the shape and the
 * source, and claims no level.
 */
export function geometry(points: CurvePoint[], width: number, height: number) {
  const lo = Math.log(points[0].years);
  const hi = Math.log(points[points.length - 1].years);
  const rates = points.map((p) => p.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const pad = (max - min || 1) * 0.12;

  const x = (years: number) => ((Math.log(years) - lo) / (hi - lo)) * width;
  const y = (rate: number) =>
    height - ((rate - min + pad) / (max - min + pad * 2)) * height;

  return {
    x,
    y,
    d: points.map((p, i) => `${i ? "L" : "M"}${x(p.years).toFixed(2)} ${y(p.rate).toFixed(2)}`).join(" "),
  };
}
