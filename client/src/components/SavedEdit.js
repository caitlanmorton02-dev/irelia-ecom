import React, { useEffect } from "react";

export default function SavedEdit({ products, onRemove, onClose, onProductClick }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
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

      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        background: "#fff",
        zIndex: 301,
        display: "flex",
        flexDirection: "column",
        animation: "slideInRight 250ms ease",
      }}
        className="edit-panel"
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.04em" }}>Your Edit</h2>
            {products.length > 0 && (
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {products.length} {products.length === 1 ? "item" : "items"} saved
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {products.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 6 }}>
                Nothing saved yet
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Save items from the grid to build your edit
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                onClick={() => onProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: 72,
                    height: 96,
                    objectFit: "cover",
                    flexShrink: 0,
                    borderRadius: "var(--radius)",
                    background: "#f5f5f5",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                    {product.brand}
                  </span>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {product.title}
                  </p>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{product.price}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{product.retailer}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(product.id);
                  }}
                  aria-label="Remove"
                  style={{
                    alignSelf: "flex-start",
                    padding: 4,
                    color: "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>
            ))
          )}
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
        @media (max-width: 640px) {
          .edit-panel {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
