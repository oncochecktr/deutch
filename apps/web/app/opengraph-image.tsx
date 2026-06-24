import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "German Coach — Sıfırdan Goethe A1";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 80px",
          background: "linear-gradient(135deg, #f9f5ed 0%, #e4ebe4 50%, #f0e8da 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "#1a3a5c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c9a227",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            GC
          </div>
          <span style={{ fontSize: "48px", fontWeight: 700, color: "#1a3a5c" }}>
            German Coach
          </span>
        </div>
        <p style={{ fontSize: "42px", fontWeight: 600, color: "#2c3e35", lineHeight: 1.3, margin: 0 }}>
          Sıfırdan Goethe A1
        </p>
        <p style={{ fontSize: "28px", color: "#5a785a", marginTop: "20px", lineHeight: 1.4 }}>
          Kelime · Gramer · Sınav · Konuşma pratiği
        </p>
        <p style={{ fontSize: "22px", color: "#6b7c72", marginTop: "auto" }}>germancoach.app</p>
      </div>
    ),
    { ...size }
  );
}
