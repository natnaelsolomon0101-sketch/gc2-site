/* Public market data for the Markets page and the home ticker.
 *
 * SOURCE. Yahoo Finance's chart endpoint, one request per instrument, three
 * months of daily closes. Delayed public data. Fetched on the server with a
 * one-hour ISR window; the browser never calls Yahoo.
 *
 * THE RULE. This is a reference, not a view. The firm publishes no positions,
 * no forecasts and no performance, and nothing here may be read as any of
 * those. An instrument whose fetch fails is omitted; if all fail the section
 * renders nothing. No placeholder, no last-known value with a fresh date. */

export type Instrument = {
  symbol: string;
  label: string;
  /** Printed unit hint: "%" for a yield, "" for a level, "$" where it reads. */
  unit: "" | "%" | "$";
  decimals: number;
};

export type Quote = Instrument & {
  last: number;
  prev: number;
  changePct: number;
  series: number[];
  asOf: string; // ISO
};

export const INSTRUMENTS: Instrument[] = [
  { symbol: "^GSPC", label: "S&P 500", unit: "", decimals: 0 },
  { symbol: "^IXIC", label: "Nasdaq", unit: "", decimals: 0 },
  { symbol: "^VIX", label: "VIX", unit: "", decimals: 2 },
  { symbol: "^TNX", label: "US 10Y yield", unit: "%", decimals: 2 },
  { symbol: "DX-Y.NYB", label: "Dollar index", unit: "", decimals: 2 },
  { symbol: "EURUSD=X", label: "EUR/USD", unit: "", decimals: 4 },
  { symbol: "GC=F", label: "Gold", unit: "$", decimals: 0 },
  { symbol: "CL=F", label: "WTI crude", unit: "$", decimals: 2 },
];

export const MARKETS_SOURCE = "Yahoo Finance";
export const MARKETS_REVALIDATE = 3600;

async function fetchOne(i: Instrument): Promise<Quote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(i.symbol)}?range=3mo&interval=1d`;
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; gc2-site)" },
      next: { revalidate: MARKETS_REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json?.chart?.result?.[0];
    if (!r) return null;
    const closes: (number | null)[] = r.indicators?.quote?.[0]?.close ?? [];
    const series = closes.filter((x): x is number => typeof x === "number" && Number.isFinite(x));
    if (series.length < 5) return null;
    const meta = r.meta ?? {};
    const last = typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : series[series.length - 1];
    const prev = typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose : series[series.length - 2];
    if (!Number.isFinite(last) || !Number.isFinite(prev) || prev === 0) return null;
    const t = typeof meta.regularMarketTime === "number" ? meta.regularMarketTime * 1000 : Date.now();
    return { ...i, last, prev, changePct: ((last - prev) / prev) * 100, series, asOf: new Date(t).toISOString() };
  } catch {
    return null;
  }
}

/** Every instrument that answered, in the declared order. */
export async function fetchQuotes(): Promise<Quote[]> {
  const all = await Promise.all(INSTRUMENTS.map(fetchOne));
  return all.filter((q): q is Quote => q !== null);
}

export function fmtLevel(q: Quote): string {
  const n = q.last.toLocaleString("en-US", { minimumFractionDigits: q.decimals, maximumFractionDigits: q.decimals });
  return q.unit === "$" ? `$${n}` : q.unit === "%" ? `${n}%` : n;
}

export function fmtChange(q: Quote): string {
  const s = q.changePct >= 0 ? "+" : "-";
  return `${s}${Math.abs(q.changePct).toFixed(2)}%`;
}

export function fmtAsOf(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
  }) + " ET";
}
