/**
 * /api/og — Dynamic Open Graph image generation
 *
 * Uses Next.js built-in ImageResponse (next/og) — no extra package needed.
 *
 * Query params:
 *   title    — main headline text (required)
 *   subtitle — second line e.g. location, category (optional)
 *   price    — formatted price string (optional)
 *   type     — "land" | "house" | "blog" | "default" (optional)
 *   image    — property photo URL (optional, shown as full-bleed background)
 *   site     — site name override (optional)
 *
 * For Cloudinary property images the caller should apply
 * c_fill,w_1200,h_630,g_auto directly to the Cloudinary URL instead of
 * going through this route. This route handles the no-image fallback and
 * non-Cloudinary image cases.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Brand colours — Magenta Royale theme
const PRIMARY = "#a43795";
const SECONDARY = "#1a0a2e";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.55)";

const TYPE_CONFIG = {
  land: { label: "Land Listing", accent: "#a43795" },
  house: { label: "House Listing", accent: "#c55ab5" },
  blog: { label: "Blog & Insights", accent: "#e040fb" },
  default: { label: "Premium Properties", accent: "#a43795" },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const title =
    searchParams.get("title") || "Premium Properties Across Nigeria";
  const subtitle = searchParams.get("subtitle") || "";
  const price = searchParams.get("price") || "";
  const type = searchParams.get("type") || "default";
  const imageUrl = searchParams.get("image") || "";
  const siteName = searchParams.get("site") || "E&J Property";

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;

  const displayTitle = title.length > 65 ? title.slice(0, 63) + "…" : title;
  const hasImage = Boolean(imageUrl);

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: SECONDARY,
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* ── Full-bleed property image (when provided) ── */}
      {hasImage && (
        <img
          src={imageUrl}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* ── Gradient overlay ──
           With image:    left panel dark (text readable) → image visible on right
           Without image: subtle dark gradient + dot pattern background          */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hasImage
            ? `linear-gradient(to right, rgba(26,10,46,1) 0%, rgba(26,10,46,0.97) 38%, rgba(26,10,46,0.6) 58%, rgba(26,10,46,0.05) 100%)`
            : `linear-gradient(135deg, ${SECONDARY}FF 0%, #2e1352EE 60%, #4a1f7c99 100%)`,
          display: "flex",
        }}
      />

      {/* ── Dot grid (visible on no-image variant) ── */}
      {!hasImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(rgba(164,55,149,0.12) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />
      )}

      {/* ── Left accent bar ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "5px",
          background: config.accent,
          display: "flex",
        }}
      />

      {/* ── Content — constrained to left 58% when image present, full width otherwise ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: hasImage ? "58%" : "100%",
          padding: "52px 60px 52px 72px",
        }}
      >
        {/* Top: site name + type badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Logo mark */}
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: config.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
                color: WHITE,
              }}
            >
              E
            </div>
            <span
              style={{
                color: WHITE,
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.3px",
              }}
            >
              {siteName}
            </span>
          </div>

          {/* Type badge */}
          <div
            style={{
              background: `${config.accent}25`,
              border: `1px solid ${config.accent}60`,
              borderRadius: "999px",
              padding: "7px 16px",
              color: config.accent,
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {config.label}
          </div>
        </div>

        {/* Middle: title + location */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            flex: 1,
            justifyContent: "center",
            paddingTop: "16px",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              color: WHITE,
              fontSize: displayTitle.length > 50 ? "40px" : "50px",
              fontWeight: "800",
              lineHeight: 1.18,
              letterSpacing: "-1.2px",
            }}
          >
            {displayTitle}
          </div>

          {subtitle && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: MUTED,
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "2px",
                  background: config.accent,
                  borderRadius: "2px",
                  display: "flex",
                  flexShrink: 0,
                }}
              />
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom: price + site URL */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {price ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                style={{
                  color: MUTED,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Asking Price
              </span>
              <span
                style={{
                  color: config.accent,
                  fontSize: "32px",
                  fontWeight: "900",
                  letterSpacing: "-0.8px",
                }}
              >
                {price}
              </span>
            </div>
          ) : (
            <div />
          )}

          <span
            style={{
              color: "rgba(255,255,255,0.28)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {SITE_URL.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>

      {/* ── Right-side image label pill (when image present) ── */}
      {hasImage && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "28px",
            background: "rgba(26,10,46,0.75)",
            border: `1px solid ${config.accent}50`,
            borderRadius: "999px",
            padding: "6px 14px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          {SITE_URL.replace(/^https?:\/\//, "")}
        </div>
      )}
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
