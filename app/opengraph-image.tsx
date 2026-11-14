import { ImageResponse } from "next/og";

export const alt = "Inkwell: notes on building for the web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#2f6bff",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>Inkwell</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
          Notes on building for the web
        </div>
      </div>
    ),
    size,
  );
}
