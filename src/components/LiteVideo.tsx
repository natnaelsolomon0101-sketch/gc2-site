"use client";

import * as React from "react";

/** A YouTube embed that costs nothing until it is played: the poster is the
 *  video's own thumbnail behind a play control; the iframe (youtube-nocookie)
 *  is created on click. The poster asks for the 1280px frame first and steps
 *  down to 640 and 480 if the upload never had a larger one. */
const SIZES = ["maxresdefault", "sddefault", "hqdefault"] as const;

export default function LiteVideo({ id, title, poster }: { id: string; title: string; poster?: "sd" }) {
  const [on, setOn] = React.useState(false);
  const [step, setStep] = React.useState(poster === "sd" ? 1 : 0);
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
  const src = `https://i.ytimg.com/vi/${id}/${SIZES[Math.min(step, SIZES.length - 1)]}.jpg`;
  return (
    <button type="button" className="lv-poster" onClick={() => setOn(true)} aria-label={`Play: ${title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          /* YouTube answers a missing maxres with a 120x90 placeholder, not a
             404: treat anything that small as missing and step down. */
          const im = e.currentTarget;
          if (im.naturalWidth < 300 && step < SIZES.length - 1) setStep(step + 1);
        }}
        onError={() => { if (step < SIZES.length - 1) setStep(step + 1); }}
      />
      <span className="lv-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </button>
  );
}
