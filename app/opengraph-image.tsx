import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = "Yashmit Katekar, AI & ML portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link-preview image shown when the site is shared (LinkedIn, WhatsApp, etc.)
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#1a1614",
          color: "#f3ece4",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#f59e0b", letterSpacing: 4 }}>
          {"AI & ML PORTFOLIO"}
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, marginTop: 24 }}>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#a39a90", marginTop: 24 }}>
          {site.intro}
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 8,
            borderRadius: 4,
            background: "#f59e0b",
            marginTop: 48,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
