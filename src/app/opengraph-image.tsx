import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
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
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "#2B1800",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,98,30,0.25) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            veyselolam.com
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Veysel Olam
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              marginTop: 4,
            }}
          >
            Yazılım, teknoloji ve düşünceler.
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #C4621E 0%, transparent 60%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
