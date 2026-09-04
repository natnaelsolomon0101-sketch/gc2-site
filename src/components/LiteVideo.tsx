"use client";

import * as React from "react";

/** A YouTube embed that costs nothing until it is played: the poster is the
 *  video's own thumbnail behind a play control; the iframe (youtube-nocookie)
 *  is created on click. */
export default function LiteVideo({ id, title }: { id: string; title: string }) {
  const [on, setOn] = React.useState(false);
  if (on) {
    return (
      <iframe
        className="lv-frame"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  return (
    <button type="button" className="lv-poster" onClick={() => setOn(true)} aria-label={`Play: ${title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" />
      <span className="lv-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </button>
  );
}
