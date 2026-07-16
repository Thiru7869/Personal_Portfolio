import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * Open Graph image — generated at build time, no binary asset
 * to maintain. Shown when the site is shared on social media.
 */
export const alt = `${site.name} — ${site.roles[0]}`;
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
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#080f1f",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(34,211,238,0.25), transparent 45%)",
          color: "#e2e9f6",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#3b82f6" }}>
          visitor@thiru:~$ whoami
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: "-2px",
          }}
        >
          {site.name.split(" ")[0]} “{site.shortName}” Poluru
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            marginTop: 20,
            color: "#22d3ee",
          }}
        >
          {site.roles.join("  ·  ")}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: 44,
            color: "#8ba0c4",
          }}
        >
          Next.js · TypeScript · Python · AI — four modes, one terminal, zero
          templates.
        </div>
      </div>
    ),
    size
  );
}
