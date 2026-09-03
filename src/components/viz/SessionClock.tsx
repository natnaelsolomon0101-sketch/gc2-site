"use client";

import { useEffect, useState } from "react";

import { css } from "@/lib/css";

/**
 * Tokyo / London / New York: local time, and whether the cash session is
 * scheduled to be running. EVERY-SCREEN.md §2 candidate 2.
 *
 * No feed and no key. Everything here is arithmetic over `Intl.DateTimeFormat`
 * in the IANA zone plus the published session hours below, which is the whole
 * point: a firm's clock should not depend on a vendor being up.
 *
 * RENDERS NOTHING UNTIL HYDRATED. STATE.md §0.2 item 6: the old hero shipped
 * `--:--:-- ET` in the server HTML, so a slow or failed script left dashes on
 * the page. A time that is not yet known is not displayed as a shape where a
 * time will go. The first server pass and the first client pass both return
 * null — they must agree or React logs a hydration mismatch — and the row
 * appears on the effect that follows.
 *
 * SESSION HOURS, regular cash equities, local exchange time, verified
 * 3 September 2026:
 *
 *   Tokyo — Tokyo Stock Exchange (Japan Exchange Group). Morning session
 *     09:00-11:30, afternoon session 12:30-15:30 JST. The 15:30 close is the
 *     extension that took effect 5 November 2024; a 15:00 close is stale.
 *     https://www.jpx.co.jp/english/equities/trading/domestic/01.html
 *
 *   London — London Stock Exchange, SETS order book. Continuous trading
 *     08:00-16:30 London time, the closing auction beginning at 16:30.
 *     https://www.londonstockexchange.com/equities-trading/business-days
 *
 *   New York — NYSE. "Core Trading Session: 9:30 a.m. to 4:00 p.m. ET."
 *     https://www.nyse.com/markets/hours-calendars
 *
 * WHAT THIS DOES NOT KNOW: exchange holidays, and the half-days NYSE closes at
 * 13:00. Modelling them would mean hard-coding three holiday calendars that go
 * silently wrong the year after they are written, which is worse than not
 * claiming them. So the component does not claim them: it says "in session" and
 * "closed", and the caption says these are the scheduled sessions and that
 * holidays are not shown. That is the honest statement of what arithmetic over
 * published hours can support.
 */

/** The stable `data-source` value. Whitelisted in scripts/qa/sources.ts. Not a
 *  hostname like the other two components, because nothing is fetched: this is
 *  arithmetic over the three exchange pages cited above. */
export const SESSION_SOURCE = "published-exchange-hours";

type Window = { open: number; close: number };
type Market = {
  city: string;
  zone: string;
  /** Minutes from local midnight. Multiple windows = a lunch break. */
  windows: Window[];
};

const hm = (h: number, m: number) => h * 60 + m;

const MARKETS: Market[] = [
  { city: "Tokyo",    zone: "Asia/Tokyo",
    windows: [{ open: hm(9, 0), close: hm(11, 30) },
              { open: hm(12, 30), close: hm(15, 30) }] },
  { city: "London",   zone: "Europe/London",
    windows: [{ open: hm(8, 0), close: hm(16, 30) }] },
  { city: "New York", zone: "America/New_York",
    windows: [{ open: hm(9, 30), close: hm(16, 0) }] },
];

/* One formatter per zone, built once. Constructing Intl.DateTimeFormat is the
   expensive part; formatting is cheap. `hourCycle: "h23"` so Tokyo at midnight
   reads 00:14 and not 24:14, which is what h24 would give. */
const CLOCK = MARKETS.map((m) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: m.zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  })
);
const PARTS = MARKETS.map((m) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: m.zone, weekday: "short", hour: "2-digit", minute: "2-digit",
    hourCycle: "h23",
  })
);

const WEEKEND = new Set(["Sat", "Sun"]);

type Reading = { city: string; time: string; open: boolean };

function read(now: Date): Reading[] {
  return MARKETS.map((m, i) => {
    /* formatToParts rather than parsing a formatted string: the separator and
       the order are locale data, and reading them back out of "Mon, 09:31" is
       how this breaks on someone else's machine. */
    const parts = Object.fromEntries(
      PARTS[i].formatToParts(now).map((p) => [p.type, p.value])
    );
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    const weekday = !WEEKEND.has(parts.weekday ?? "");
    return {
      city: m.city,
      time: CLOCK[i].format(now),
      open: weekday && m.windows.some((w) => minutes >= w.open && minutes < w.close),
    };
  });
}

export type SessionClockProps = {
  className?: string;
  /**
   * `false` moves the "Scheduled cash sessions · exchange holidays not shown"
   * note to `sr-only` instead of removing it. It is NOT dropped: it is the
   * component's source line, `scripts/qa/sources.ts` reads it off the
   * `[data-source]` element to prove the caveat shipped, and a screen-reader
   * user has the same right to the caveat as a sighted one. Set it false where
   * a surrounding section already says what the strip is — the hero masthead,
   * where two 13px lines above the headline are noise.
   */
  caption?: boolean;
  /**
   * `"open"` shows only the session that is running, at every width, rather
   * than only on phones. The masthead wants one line; the menu and the footer
   * want all three. Every row stays in the DOM either way and CSS chooses
   * (§7 rule 14), so this changes no layout by JavaScript.
   */
  rows?: "all" | "open";
  /** 32px rows instead of 44. The nav is chrome, not a tap-target list; the
   *  rows are not interactive, so the 44px floor is a rhythm choice there and
   *  not an accessibility one. */
  dense?: boolean;
};

export default function SessionClock({
  className = "",
  caption = true,
  rows: show = "all",
  dense = false,
}: SessionClockProps) {
  const [readings, setRows] = useState<Reading[] | null>(null);

  useEffect(() => {
    const tick = () => setRows(read(new Date()));
    tick();
    /* Aligned to the next minute boundary, then once a minute. A one-second
       interval would repaint sixty times for one changed digit; the display
       resolves to minutes, so the clock should too. */
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      tick();
      id = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => { clearTimeout(start); clearInterval(id); };
  }, []);

  if (!readings) return null;

  /* The phone shows the session that is running, or — outside every session —
     Tokyo, the next one to open on the clock's own order. CSS does the hiding,
     not JavaScript (§7 rule 14): every row is in the DOM at every width, and a
     container query decides which are painted. */
  const lead = readings.find((r) => r.open) ?? readings[0];

  return (
    <div
      className={`sc ${className}`}
      data-rows={show}
      data-dense={dense ? "true" : undefined}
      data-source={SESSION_SOURCE}
    >
      <style>{CSS}</style>
      <ul className="sc-rows">
        {readings.map((r) => (
          <li
            key={r.city}
            className="sc-row"
            data-open={r.open ? "true" : "false"}
            data-lead={r.city === lead.city ? "true" : "false"}
          >
            <span className="t-caption sc-city">{r.city}</span>
            <span className="t-caption sc-time">
              <time>{r.time}</time>
            </span>
            <span className="t-caption sc-state">
              {r.open ? "In session" : "Closed"}
            </span>
          </li>
        ))}
      </ul>
      {/* Always rendered. `caption={false}` hides it visually and leaves it to
          assistive technology and to scripts/qa/sources.ts, which checks that
          the [data-source] element's TEXT still carries the caveat. A caveat
          that can be switched off is not a caveat. */}
      <p className={caption ? "t-caption sc-note" : "sr-only"}>
        Scheduled cash sessions · exchange holidays not shown
      </p>
    </div>
  );
}

/* Timing reads --dur-fast / --ease, the globals.css mirror of src/lib/motion.ts.
   The only thing that moves is the state word's colour when a session opens or
   closes, which is a state change and therefore a --dur-fast transition.

   Colour is the semantic layer only (LIGHT-PASS.md): ink for the running
   session's time, ink-2 for its state word, ink-3 for the closed rows and the
   caveat. Open and closed are told apart by TONE, not by hue — there is no
   green dot and there never was, which is the version of this that also works
   for a colour-blind reader and on paper. */
const CSS = css`
.sc { container-type: inline-size; }
/* The three rows share one set of column tracks, so the times line up under
   each other. Without that, "CLOSED" and "IN SESSION" size their own row and
   01:23 sits further right than 12:23 — on a clock, of all things. subgrid
   where it exists (Safari 16, Chrome 117, Firefox 71); the fallback below is
   the independent-track version, which still reads, just less exactly. */
.sc-rows { list-style: none; margin: 0; padding: 0; }
.sc-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: baseline;
  column-gap: 20px;
  min-height: 44px;
  border-bottom: 1px solid var(--color-hairline);
}
.sc[data-dense="true"] .sc-row { min-height: 32px; }
@supports (grid-template-columns: subgrid) {
  .sc-rows { display: grid; grid-template-columns: 1fr auto auto; }
  .sc-row { grid-column: 1 / -1; grid-template-columns: subgrid; }
}
.sc-row:last-of-type { border-bottom: 0; }
.sc-time { font-variant-numeric: tabular-nums; letter-spacing: .12em; text-align: right; }
.sc-state { text-align: left; }
.sc-row[data-open="true"] .sc-time { color: var(--color-ink); }
.sc-state { color: var(--color-ink-3); transition: color var(--dur-fast) var(--ease); }
.sc-row[data-open="true"] .sc-state { color: var(--color-ink-2); }
/* hyphens: none, not inherited. §7 rule 9 turns on hyphens: auto for prose,
   which at 393 broke this line as "EX-CHANGE" — a hyphen inside an uppercase
   mono caption reads as a typo, not as typesetting. */
.sc-note { display: block; margin: 10px 0 0; color: var(--color-ink-3);
           hyphens: none; overflow-wrap: normal; }

/* Phones: the running session only. Container width, not viewport, so the strip
   behaves the same inside a narrow column at 1920 (§7 rule 4). */
@container (max-width: 420px) {
  .sc-row[data-lead="false"] { display: none; }
  .sc-row { border-bottom: 0; }
}
/* rows="open": the same collapse, at every width. Every row is still in the
   DOM; CSS decides which is painted. */
.sc[data-rows="open"] .sc-row[data-lead="false"] { display: none; }
.sc[data-rows="open"] .sc-row { border-bottom: 0; }
`;
