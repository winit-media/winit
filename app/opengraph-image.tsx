import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #912dbf 0%, #7a24a8 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "white", letterSpacing: 4, display: "flex" }}>WinIt</div>
        <div style={{ width: 120, height: 4, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 2, marginTop: 16, marginBottom: 24 }} />
        <div style={{ fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: 6, display: "flex" }}>SHAPING SUCCESS STORIES</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginTop: 16, display: "flex" }}>
          INFLUENCER MARKETING · BRAND STORYTELLING · CREATIVE STRATEGY
        </div>
      </div>
    ),
    { ...size }
  );
}
