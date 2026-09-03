/**
 * The ECB euro foreign-exchange reference rates.
 *
 * SOURCE (verified 3 September 2026, HTTP 200, data through 2026-09-03):
 *   https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml
 * The ninety-day history rather than eurofxref-daily.xml, because a rate
 * without yesterday's rate beside it is a number and not a change, and one
 * 69KB fetch is cheaper and less fragile than two that can disagree about which
 * day it is. No key, no registration.
 *
 * TERMS. The ECB permits reuse of website information: "When such information
 * is distributed or reproduced, it must appear accurately and the ECB must be
 * cited as the source." (https://www.ecb.europa.eu/services/disclaimer/) The
 * component satisfies both halves: the rates are printed as published, to the
 * published precision, and the source line names the ECB and the date. The
 * written-authorisation carve-out covers signed Working and Occasional Papers,
 * not the statistical series. The ECB also disclaims liability for decisions
 * taken in reliance on the rates, which is why nothing on this site acts on
 * them — they are printed, not traded.
 *
 * These are reference rates published once each working day at around 16:00
 * CET. They are not tradable quotes and the component never implies they are.
 */

/** Six hours. The ECB publishes once a working day; six hours is the same
 *  cadence as the curve, so both data components refresh together. */
export const ECB_REVALIDATE = 21600;

/** The stable `data-source` value. Whitelisted in scripts/qa/sources.ts. */
export const ECB_SOURCE = "ecb.europa.eu";

export const ECB_ATTRIBUTION = "European Central Bank";

const FEED = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml";

/* The majors, in the order a euro book reads them. Not every currency in the
   file: thirty rows is a data dump, six is a statement about what the desk
   watches. */
export const MAJORS = ["USD", "GBP", "JPY", "CHF", "AUD", "CAD"] as const;

export type Pair = {
  /** e.g. "EUR/USD" — the ECB quotes everything as units of currency per euro. */
  pair: string;
  /** Today's reference rate, as published — the STRING from the feed, never a
   *  reformatted number. The ninety-day file gives CHF as 0.939 where the daily
   *  file gives 0.9390, so the column is ragged; padding it would be a small
   *  edit to a published rate, and "must appear accurately" is not a place to
   *  make small edits. Ragged and exact beats tidy and adjusted. */
  rate: string;
  /** Change on the previous published day, in per cent. Null on the first day
   *  of the file, or if the currency was not quoted the day before. */
  change: number | null;
};

export type EcbRates = { date: string; pairs: Pair[] };

const DAY = /<Cube\s+time=["']([\d-]+)["']\s*>([\s\S]*?)<\/Cube>/g;
const RATE = /<Cube\s+currency=["']([A-Z]{3})["']\s+rate=["']([\d.]+)["']\s*\/>/g;

function days(xml: string): { date: string; rates: Map<string, string> }[] {
  const out: { date: string; rates: Map<string, string> }[] = [];
  for (const [, date, body] of xml.matchAll(DAY)) {
    const rates = new Map<string, string>();
    for (const [, ccy, rate] of body.matchAll(RATE)) rates.set(ccy, rate);
    if (rates.size) out.push({ date, rates });
  }
  /* The file is newest-first, but sort rather than trust it: the ordering is
     not part of any published contract. */
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * The latest published rates for the majors, with the change on the previous
 * published day, or null if the feed is unreachable or unparseable. No cached
 * last-known-good and no partial row: a rate printed under a date has to be
 * the rate published on that date.
 */
export async function fetchEcbRates(): Promise<EcbRates | null> {
  let xml: string;
  try {
    const res = await fetch(FEED, { next: { revalidate: ECB_REVALIDATE } });
    if (!res.ok) return null;
    xml = await res.text();
  } catch {
    return null;
  }

  const [today, yesterday] = days(xml);
  if (!today) return null;

  const pairs: Pair[] = [];
  for (const ccy of MAJORS) {
    const raw = today.rates.get(ccy);
    if (!raw) continue;
    const now = Number(raw);
    const then = Number(yesterday?.rates.get(ccy));
    if (!Number.isFinite(now)) continue;
    pairs.push({
      pair: `EUR/${ccy}`,
      rate: raw,
      change:
        Number.isFinite(then) && then !== 0 ? ((now - then) / then) * 100 : null,
    });
  }

  return pairs.length ? { date: today.date, pairs } : null;
}

/** `+0.12%` / `-0.04%` / `0.00%`. A true minus sign, not a hyphen: at
 *  .t-caption's tracking a hyphen-minus reads as a dash between two words. */
export function signed(change: number): string {
  const v = change.toFixed(2);
  if (Number(v) === 0) return "0.00%";
  return change > 0 ? `+${v}%` : `−${v.replace("-", "")}%`;
}
