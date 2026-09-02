import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { notes } from "@/content/notes";
import { readFile } from "node:fs/promises";
import path from "node:path";

// A.4: the display face is the identity. next/og has no Newsreader, so the
// face is loaded explicitly or the card silently renders in fallback sans.
async function newsreader() {
  return readFile(path.join(process.cwd(), "src/app/_og/Newsreader-Light.ttf"));
}


export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Note from the desk";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const display = await newsreader();
  const note = notes.find((n) => n.slug === slug);
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", background: "#FFFFFF", padding: 72,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6B7178" }}>
          <div style={{ display: "flex" }}>{site.mark}</div>
          <div style={{ display: "flex" }}>{note?.category ?? "Note"}</div>
        </div>
        <div style={{
          display: "flex", fontSize: 68, lineHeight: 1.05, color: "#000000",
          letterSpacing: -0.8, maxWidth: 960, fontFamily: "Newsreader",
        }}>
          {note?.title ?? "Notes from the desk"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", height: 1, background: "#E3E5E1" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#6B7178" }}>{site.name}</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Newsreader", data: display, weight: 300, style: "normal" }] },
  );
}
