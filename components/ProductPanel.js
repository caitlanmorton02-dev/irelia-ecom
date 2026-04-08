"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StyleDNAChips from "./StyleDNAChips";
import { addRecentlyViewed } from "../lib/storage";
import { getProductMatchReason } from "../lib/styleDNA";

export default function ProductPanel({ product, saved, onClose, onToggleSave, dna }) {
  const [removedChips, setRemovedChips] = useState(new Set());

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setRemovedChips(new Set());
    }
  }, [product?.id]);

  if (!product) return null;

  const matchReason = getProductMatchReason(product, dna);
  const hasDNA = dna && (
    (dna.vibes || []).length ||
    (dna.brands || []).length ||
    (dna.colors || []).length ||
    (dna.stores || []).length ||
    dna.primaryStyle
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 70,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      <aside className="panel-shell">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 5,
          }}
        >
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                border: "1px solid var(--border)",
                padding: "3px 8px",
                borderRadius: 2,
                color: "var(--muted)",
              }}
            >
              {product.category}
            </span>
            {product.color && (
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{product.color}</span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              width: 30,
              height: 30,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              fontSize: 14,
              color: "var(--muted)",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Product image ────────────────────────────────────────── */}
        <Image
          src={product.image}
          alt={product.title}
          width={800}
          height={1000}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "4/5",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* ── Details ──────────────────────────────────────────────── */}
        <div style={{ padding: "16px 16px 110px" }}>

          {/* Price + retailer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <strong style={{ fontSize: 22, letterSpacing: "-0.01em" }}>{product.price}</strong>
            <span
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                paddingTop: 4,
              }}
            >
              {product.retailer}
            </span>
          </div>

          {/* Title + brand */}
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, lineHeight: 1.3 }}>
            {product.title}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>
            {product.brand}
          </div>

          {/* ── Matches your style ─────────────────────────────────── */}
          {matchReason && (
            <div
              style={{
                background: "#f5f5f0",
                borderRadius: 2,
                padding: "10px 14px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>✦</span>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    marginBottom: 2,
                  }}
                >
                  Matches your style
                </div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{matchReason}</div>
              </div>
            </div>
          )}

          {/* ── Why we recommend this (DNA-based) ─────────────────── */}
          {dna?.primaryStyle && !matchReason && (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 2,
                padding: "10px 14px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: "var(--muted)" }}>◈</span>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    marginBottom: 2,
                  }}
                >
                  Why we picked this
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  Curated for your {dna.primaryStyle} aesthetic
                  {dna.secondaryStyle ? ` and ${dna.secondaryStyle} side` : ""}.
                </div>
              </div>
            </div>
          )}

          {/* ── Quick DNA filter chips ─────────────────────────────── */}
          {hasDNA && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              <StyleDNAChips
                dna={dna}
                removedChips={removedChips}
                onRemove={(key) => setRemovedChips((prev) => new Set([...prev, key]))}
              />
            </div>
          )}
        </div>

        {/* ── CTA bar ──────────────────────────────────────────────── */}
        <div className="panel-cta">
          <a
            href={product.productUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              background: "#111",
              color: "#fff",
              borderRadius: 2,
              padding: "13px",
              textAlign: "center",
              textTransform: "uppercase",
              fontSize: 11,
              letterSpacing: "0.1em",
              fontWeight: 700,
              display: "block",
            }}
          >
            Shop {product.retailer}
          </a>
          <button
            onClick={() => onToggleSave(product.id)}
            aria-label={saved ? "Remove from Your Edit" : "Save to Your Edit"}
            style={{
              width: 50,
              border: "1px solid var(--border)",
              borderRadius: 2,
              background: saved ? "#111" : "#fff",
              color: saved ? "#fff" : "#111",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
              flexShrink: 0,
            }}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>

      </aside>
    </>
  );
}
