"use client";

import Link from "next/link";

export default function QuizStep({
  step,
  total,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  canProceed,
  isLast,
}) {
  const pct = Math.round(((step + 1) / total) * 100);

  return (
    <div>
      {/* Progress bar */}
      <div
        style={{
          height: 2,
          background: "var(--border)",
          borderRadius: 2,
          marginBottom: 36,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "#111",
            borderRadius: 2,
            transition: "width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
      </div>

      {/* Step eyebrow */}
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--muted)",
          marginBottom: 8,
        }}
      >
        Step {step + 1} of {total}
      </div>

      {/* Title */}
      <h2
        style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
        {subtitle}
      </p>

      {/* Step content */}
      {children}

      {/* Nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 36,
          paddingTop: 22,
          borderTop: "1px solid var(--border)",
        }}
      >
        {step === 0 ? (
          <Link
            href="/shop"
            style={{
              fontSize: 12,
              color: "var(--muted)",
              textDecoration: "underline",
              letterSpacing: "0.04em",
            }}
          >
            Skip
          </Link>
        ) : (
          <button
            onClick={onBack}
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              padding: "11px 20px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            ← Back
          </button>
        )}

        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            background: canProceed ? "#111" : "#ccc",
            color: "#fff",
            border: 0,
            padding: "12px 28px",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 700,
            cursor: canProceed ? "pointer" : "default",
            borderRadius: 2,
            transition: "background 0.2s",
          }}
        >
          {isLast ? "See my picks →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
