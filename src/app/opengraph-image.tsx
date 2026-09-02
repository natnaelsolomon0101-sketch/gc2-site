import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { palette } from "@/config/tokens";
import { readFile } from "node:fs/promises";
import path from "node:path";

// A.4: the display face is the identity. next/og has no Newsreader, so the
// face is loaded explicitly or the card silently renders in fallback sans.
async function newsreader() {
  return readFile(path.join(process.cwd(), "src/app/_og/Newsreader-Light.ttf"));
}


export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — private investment partnership`;

// Built from the A.3 tokens. No imagery, no gradient: paper, hairline, black.
export default async function OG() {
  const display = await newsreader();
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", background: palette.paper, padding: 72,
      }}>
        <div style={{ display: "flex", fontSize: 30, color: palette.ink, letterSpacing: -0.3 }}>
          {site.mark}
        </div>
        <div style={{
          display: "flex", fontSize: 82, lineHeight: 1.02, color: palette.black,
          letterSpacing: -1, maxWidth: 940, fontFamily: "Newsreader",
        }}>
          Evidence first. Then capital.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", height: 1, background: palette.hairline }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: palette.slate }}>
            <div style={{ display: "flex" }}>{site.name}</div>
            <div style={{ display: "flex" }}>{site.city}</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Newsreader", data: display, weight: 300, style: "normal" }] },
  );
}
