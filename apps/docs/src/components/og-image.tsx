import type { ReactNode } from "react";

const LOGO_PATH =
  "m147 118.4-89.3-103.9c-0.4-0.4-1-0.8-1.7-0.7-0.3 0.1-0.5 0.2-0.8 0.4l-41.4 22.1c-2.1 1.2-4 2.7-5.7 4.4l-1.4 1.8c-2.7 3.4-4.7 8.3-5.2 13.5l-0.1 64.3c0 1.4 0.9 2.5 1.9 2.5l59.9 8.8c7.8 2.5 19.3 4.5 36.1 4.5 7 0 14.4-0.3 21.3-1.1 10.2-1.1 27.8-4.7 27.9-13-0.1-1-0.5-2.5-1.5-3.6zm-89.6-101.1 83.5 97c-9.3-3.8-22.3-6.9-40.9-7-3.7 0-7.1 0.2-10.9 0.4l-31.5-14.7-0.2-75.7zm-51.8 103.8 50.9-26.5 28.1 13.4c-2.3 0.4-5.4 0.6-7.5 1-8.2 1.4-25 5.2-25 13 0 2.6 2 4.7 4.5 6.5l-9.6-1.6-41.4-5.8zm114.9 11.8c-6.5 0.7-13.8 1.2-21.2 1.2-12.2 0-22.2-1-31-3.2-6-1.4-13.9-4.7-13.9-8.8 0-4.2 9.9-7.8 15.7-8.9 7.6-1.8 18.3-3.6 29.9-3.6 16.3 0 29 2.1 37.4 5.5 2.5 0.9 3.7 1.6 5.1 2.3l1.9 1.4c0.9 0.7 1.8 1.9 1.8 3.1 0 5-13.3 9.4-25.7 11z";

function CueLogo({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={LOGO_PATH} fill="#0F1936" />
    </svg>
  );
}

export type CueOgImageProps = {
  request: Request;
  title: string;
  description?: string;
  eyebrow?: string;
};

export function CueOgImage({ title, description, eyebrow = "cue" }: CueOgImageProps): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at top right, rgba(15,25,54,0.08), transparent 42%), linear-gradient(180deg, #ffffff 0%, #f4f5f7 100%)",
        color: "#0F1936",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <CueLogo size={64} />
        <p
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#0F1936",
          }}
        >
          {eyebrow}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: 980 }}>
        <p
          style={{
            margin: 0,
            fontSize: title.length > 42 ? 64 : 76,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#0F1936",
          }}
        >
          {title}
        </p>
        {description ? (
          <p
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.35,
              color: "rgba(15,25,54,0.68)",
            }}
          >
            {description}
          </p>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(15,25,54,0.12)",
          paddingTop: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <img src="npm" alt="npm" style={{ width: 62, height: 20, marginTop: 8 }} />
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 500,
              color: "rgba(15,25,54,0.55)",
            }}
          >
            @vlkoss/cue
          </p>
        </div>
        <p style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "rgba(15,25,54,0.55)" }}>
          cue.vlkstudio.com
        </p>
      </div>
    </div>
  );
}
