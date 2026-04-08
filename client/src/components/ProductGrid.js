import React from "react";
import ProductCard from "./ProductCard";

function SkeletonCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        width: "100%",
        paddingBottom: "133%",
        background: "#f0f0f0",
        borderRadius: "var(--radius)",
        animation: "skeleton-pulse 1.4s ease-in-out infinite",
      }} />
      <div style={{ height: 12, width: "70%", background: "#f0f0f0", borderRadius: 1, animation: "skeleton-pulse 1.4s ease-in-out infinite" }} />
      <div style={{ height: 12, width: "40%", background: "#f0f0f0", borderRadius: 1, animation: "skeleton-pulse 1.4s ease-in-out infinite" }} />
      <div style={{ height: 12, width: "30%", background: "#f0f0f0", borderRadius: 1, animation: "skeleton-pulse 1.4s ease-in-out infinite" }} />
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default function ProductGrid({
  products,
  loading,
  error,
  savedIds,
  onToggleSave,
  onProductClick,
  hasMore,
  onLoadMore,
  totalCount,
}) {
  if (error) {
    return (
      <div style={{
        padding: "80px 0",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>
          Unable to load products
        </p>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {error}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "32px 20px",
        paddingTop: 32,
      }}>
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          No products match your filters
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "32px 20px",
        paddingTop: 32,
      }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSaved={savedIds.includes(product.id)}
            onToggleSave={onToggleSave}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", paddingTop: 48 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
            Showing {products.length} of {totalCount}
          </p>
          <button
            onClick={onLoadMore}
            style={{
              background: "#fff",
              border: "1px solid #111",
              borderRadius: "var(--radius)",
              padding: "12px 40px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#111",
              transition: "background var(--transition), color var(--transition)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
