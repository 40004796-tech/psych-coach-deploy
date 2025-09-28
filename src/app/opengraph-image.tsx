import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #ff8ba7 0%, #7dd3fc 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#fff",
            fontSize: 56,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.9)",
              color: "#ff3d6e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            心
          </div>
          心青心理教练
        </div>
        <div style={{ color: "#fff", fontSize: 28, marginTop: 16 }}>
          温馨 · 青春 · 正能量 —— 连接专业心理教练，陪你走向更好的自己
        </div>
      </div>
    ),
    { ...size }
  );
}


