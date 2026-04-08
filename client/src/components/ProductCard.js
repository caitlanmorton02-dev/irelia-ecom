import React, { useState, useRef } from "react";

export default function ProductCard({ product, isSaved, onToggleSave, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef(null);

  const handleSave = (e) => {
    e.stopPropagation();
    onToggleSave(product.id);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Image container */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius)" }}>
        {/* Skeleton while loading */}
        {!imgLoaded && !imgError && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "#f0f0f0",
            animation: "skeleton-pulse 1.4s ease-in-out infinite",
          }} />
        )}

        <img
          ref={imgRef}
          src={product.image}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          style={{
            width: "100%",
            aspectRatio: "3/4",
            objectFit: "cover",
            display: "block",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 300ms ease, transform 400ms ease",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
        />

        {imgError && (
          <div style={{
            aspectRatio: "3/4",
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>No image</span>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          aria-label={isSaved ? "Remove from Your Edit" : "Save to Your Edit"}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered || isSaved ? 1 : 0,
            transition: "opacity var(--transition)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isSaved ? "#111" : "none"}
            stroke="#111"
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Product info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.02em" }}>
            {product.brand}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#111", whiteSpace: "nowrap" }}>
            {product.price}
          </span>
        </div>
        <p style={{
          fontSize: 13,
          color: "#111",
          lineHeight: 1.3,
          fontWeight: 400,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {product.title}
        </p>
        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.02em" }}>
          {product.retailer}
        </span>
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
