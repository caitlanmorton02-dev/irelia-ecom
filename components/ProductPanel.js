"use client";

import Image from "next/image";
import StyleDNAChips from "./StyleDNAChips";
import { addRecentlyViewed } from "../lib/storage";
import { useEffect, useState } from "react";

export default function ProductPanel({ product, saved, onClose, onToggleSave, dna }) {
  const [removedChips, setRemovedChips] = useState(new Set());

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setRemovedChips(new Set());
    }
  }, [product?.id]);

  if (!product) return null;

  const hasActiveDNA = dna && (
    (dna.vibes || []).length ||
    (dna.brands || []).length ||
    (dna.colors || []).length ||
    (dna.stores || []).length
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 70,
          backdropFilter: "blur(2px)",
        }}
      />

      <aside className="panel-shell">
        {/* Header */}
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
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                border: "1px solid var(--border)",
                padding: "3px 7px",
                borderRadius: 2,
                color: "var(--muted)",
              }}
            >
              {product.category}
            </span>
            {product.color && (
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{product.color}</span>
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
              fontSize: 16,
              color: "var(--muted)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
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
        </div>

        {/* Details */}
        <div style={{ padding: "16px 16px 100px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <strong style={{ fontSize: 20, letterSpacing: "0.01em" }}>{product.price}</strong>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {product.retailer}
            </div>
          </div>

          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
            {product.title}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>
            {product.brand}
          </div>

          {/* Style DNA quick-filter chips */}
          {hasActiveDNA && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 4 }}>
              <StyleDNAChips
                dna={dna}
                removedChips={removedChips}
                onRemove={(key) => setRemovedChips((prev) => new Set([...prev, key]))}
              />
            </div>
          )}
        </div>

        {/* CTA */}
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
              fontWeight: 600,
            }}
          >
            Shop {product.retailer}
          </a>
          <button
            onClick={() => onToggleSave(product.id)}
            aria-label={saved ? "Remove from Your Edit" : "Save to Your Edit"}
            style={{
              width: 48,
              border: "1px solid var(--border)",
              borderRadius: 2,
              background: saved ? "#111" : "#fff",
              color: saved ? "#fff" : "#111",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
            }}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>
      </aside>
    </>
  );
}
