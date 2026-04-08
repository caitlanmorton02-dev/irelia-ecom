"use client";

import Link from "next/link";

const STYLE_ACCENT = {
  Minimal: { bg: "#f5f5f0", text: "#111", tag: "#111" },
  Streetwear: { bg: "#111", text: "#fff", tag: "#fff" },
  Luxe: { bg: "#1a1208", text: "#e8d5a3", tag: "#c9a84c" },
  Classic: { bg: "#f0ede8", text: "#2a1f14", tag: "#2a1f14" },
  "Trend-led": { bg: "#1a0a1a", text: "#e8b4f8", tag: "#c070d8" },
  Sporty: { bg: "#0a1a2a", text: "#7dd3fc", tag: "#38bdf8" },
  Vintage: { bg: "#2a1a0a", text: "#e8d5b4", tag: "#c9a84c" },
};

/**
 * Reusable card that renders the user's Style DNA.
 * Variants: "hero" (full-width, dark) | "compact" (inline, light) | "inline" (single-line strip)
 */
export default function StyleDNACard({ dna, variant = "hero", onEdit }) {
  const { primaryStyle, secondaryStyle, dnaLabel, dnaDescription } = dna || {};

  if (!primaryStyle) {
    return (
      <div
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 2,
          padding: variant === "compact" ? "16px 18px" : "24px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              marginBottom: 4,
            }}
          >
            Your Style DNA
          </div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            Not set yet — take the quiz to discover your style.
          </div>
        </div>
        <Link
          href="/quiz"
          style={{
            background: "#111",
            color: "#fff",
            padding: "10px 18px",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderRadius: 2,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Take quiz
        </Link>
      </div>
    );
  }

  const accent = STYLE_ACCENT[primaryStyle] || STYLE_ACCENT.Minimal;

  // ── Inline strip ──────────────────────────────────────────────────────────
  if (variant === "inline") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#f5f5f0",
          borderRadius: 20,
          padding: "6px 14px",
        }}
      >
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
          Your DNA
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
          {dnaLabel || primaryStyle}
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--muted)", padding: 0 }}
          >
            Edit
          </button>
        )}
      </div>
    );
  }

  // ── Compact card ──────────────────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div
        style={{
          background: accent.bg,
          borderRadius: 2,
          padding: "18px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accent.text,
              opacity: 0.6,
              marginBottom: 4,
            }}
          >
            Your Style DNA
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: accent.text, letterSpacing: "0.02em", marginBottom: 6 }}>
            {dnaLabel || primaryStyle}
          </div>
          {dnaDescription && (
            <div style={{ fontSize: 12, color: accent.text, opacity: 0.7, lineHeight: 1.5, maxWidth: 320 }}>
              {dnaDescription}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          {secondaryStyle && (
            <span
              style={{
                fontSize: 10,
                border: `1px solid ${accent.tag}`,
                color: accent.tag,
                borderRadius: 20,
                padding: "3px 10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {secondaryStyle}
            </span>
          )}
          <Link
            href="/quiz"
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: accent.text,
              opacity: 0.5,
              textDecoration: "underline",
            }}
          >
            Retake
          </Link>
        </div>
      </div>
    );
  }

  // ── Hero card (default) ───────────────────────────────────────────────────
  return (
    <div
      style={{
        background: accent.bg,
        borderRadius: 2,
        padding: "32px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -20,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 140,
          fontWeight: 900,
          color: accent.text,
          opacity: 0.04,
          letterSpacing: "-0.05em",
          userSelect: "none",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {primaryStyle?.toUpperCase()}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: accent.text,
            opacity: 0.5,
            marginBottom: 12,
          }}
        >
          Your Style DNA
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
              color: accent.text,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {dnaLabel || primaryStyle}
          </h2>
          {secondaryStyle && (
            <span
              style={{
                fontSize: 11,
                border: `1px solid ${accent.tag}`,
                color: accent.tag,
                borderRadius: 20,
                padding: "4px 12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                alignSelf: "center",
                marginTop: 4,
              }}
            >
              {secondaryStyle}
            </span>
          )}
        </div>

        {dnaDescription && (
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 14,
              color: accent.text,
              opacity: 0.7,
              lineHeight: 1.6,
              maxWidth: 420,
            }}
          >
            {dnaDescription}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href="/quiz"
            style={{
              display: "inline-block",
              border: `1px solid ${accent.text}`,
              color: accent.text,
              padding: "9px 16px",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: 2,
              opacity: 0.8,
            }}
          >
            Retake quiz
          </Link>
          {onEdit && (
            <button
              onClick={onEdit}
              style={{
                display: "inline-block",
                background: accent.text,
                color: accent.bg,
                border: 0,
                padding: "9px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              Edit preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
