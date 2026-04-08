import React, { useState, useEffect, useRef } from "react";

export default function ProductPanel({ product, isSaved, onToggleSave, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const panelRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleShop = () => {
    window.open(product.productUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 300,
          animation: "fadeIn 200ms ease",
        }}
      />

      {/* Panel — desktop: right slide, mobile: bottom sheet */}
      <div
        ref={panelRef}
        className="product-panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 480,
          background: "#fff",
          zIndex: 301,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          animation: "slideInRight 250ms ease",
        }}
      >
        {/* Close */}
        <div style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            {product.category}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div style={{ position: "relative", background: "#f8f8f8" }}>
          {!imgLoaded && (
            <div style={{
              aspectRatio: "4/5",
              background: "#f0f0f0",
              animation: "skeleton-pulse 1.4s ease-in-out infinite",
            }} />
          )}
          <img
            src={product.image}
            alt={product.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%",
              aspectRatio: "4/5",
              objectFit: "cover",
              display: imgLoaded ? "block" : "none",
            }}
          />
        </div>

        {/* Details */}
        <div style={{ padding: "24px 20px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.03em" }}>
              {product.brand}
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>
              {product.price}
            </span>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4, marginBottom: 16, color: "#111" }}>
            {product.title}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 72 }}>Retailer</span>
              <span style={{ color: "#111", fontWeight: 500 }}>{product.retailer}</span>
            </div>
            <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 72 }}>Colour</span>
              <span style={{ color: "#111", fontWeight: 500 }}>{product.color}</span>
            </div>
            <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 72 }}>Category</span>
              <span style={{ color: "#111", fontWeight: 500 }}>{product.category}</span>
            </div>
          </div>

          {/* Desktop CTA row */}
          <div className="panel-cta-desktop" style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleShop}
              style={{
                flex: 1,
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                padding: "14px 20px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "background var(--transition)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#111"}
            >
              Shop {product.retailer}
            </button>

            <button
              onClick={() => onToggleSave(product.id)}
              aria-label={isSaved ? "Remove from Your Edit" : "Save to Your Edit"}
              style={{
                width: 48,
                height: 48,
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isSaved ? "#111" : "none"}
                stroke="#111"
                strokeWidth="1.8"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile sticky bottom CTA */}
        <div
          className="panel-cta-mobile"
          style={{
            display: "none",
            position: "sticky",
            bottom: 0,
            background: "#fff",
            borderTop: "1px solid var(--border)",
            padding: "12px 20px",
            gap: 10,
          }}
        >
          <button
            onClick={handleShop}
            style={{
              flex: 1,
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              padding: "14px 20px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Shop {product.retailer}
          </button>
          <button
            onClick={() => onToggleSave(product.id)}
            style={{
              width: 48,
              height: 48,
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "#111" : "none"} stroke="#111" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (max-width: 640px) {
          .product-panel {
            top: auto !important;
            right: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            max-height: 92vh !important;
            border-radius: 4px 4px 0 0 !important;
            animation: slideInUp 280ms ease !important;
          }
          .panel-cta-desktop { display: none !important; }
          .panel-cta-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
