import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(145deg, #1b1d33 0%, #12132a 50%, #0e0f20 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(183,75,42,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "150px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0,74,173,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Template preview cards floating in background */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            display: "flex",
            gap: "12px",
            transform: "rotate(-6deg)",
            opacity: 0.3,
          }}
        >
          <div
            style={{
              width: "140px",
              height: "180px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #1A3A5C, #2a5a8c)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              width: "140px",
              height: "180px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0A0A0A, #2D2D2D)",
              border: "1px solid rgba(255,255,255,0.1)",
              marginTop: "30px",
            }}
          />
          <div
            style={{
              width: "140px",
              height: "180px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #1B4332, #2d6b4f)",
              border: "1px solid rgba(255,255,255,0.1)",
              marginTop: "-20px",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px",
              padding: "8px 20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#b74b2a",
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
              AgencyBrain Pages
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              margin: "0 0 20px 0",
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            Insurance Websites
          </h1>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              margin: "0 0 32px 0",
              background: "linear-gradient(90deg, #b74b2a, #c95d3c, #b74b2a)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-2px",
            }}
          >
            That Actually Sell
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            9 premium templates. 48-hour launch. Built for P&C insurance agencies.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "40px",
            }}
          >
            {[
              { value: "9", label: "Templates" },
              { value: "48hr", label: "Launch" },
              { value: "100%", label: "Mobile Ready" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#b74b2a",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
