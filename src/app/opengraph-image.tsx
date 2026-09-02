import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — private investment partnership`;

// Built from the A.3 tokens. No imagery, no gradient: paper, hairline, black.
export default function OG() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", background: "#FFFFFF", padding: 72,
      }}>
        <div style={{ display: "flex", fontSize: 30, color: "#1F2326", letterSpacing: -0.3 }}>
          {site.mark}
        </div>
        <div style={{
          display: "flex", fontSize: 82, lineHeight: 1.02, color: "#000000",
          letterSpacing: -1, maxWidth: 940,
        }}>
          Evidence first. Then capital.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", height: 1, background: "#E3E5E1" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6B7178" }}>
            <div style={{ display: "flex" }}>{site.name}</div>
            <div style={{ display: "flex" }}>{site.city}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
