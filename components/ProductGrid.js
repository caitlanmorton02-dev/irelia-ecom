"use client";

import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  savedIds,
  onToggleSave,
  onOpenPanel,
  onLoadMore,
  hasMore,
  totalCount,
}) {
  return (
    <section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "28px 18px",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSaved={savedIds.includes(product.id)}
            onToggleSave={onToggleSave}
            onOpenPanel={onOpenPanel}
          />
        ))}
      </div>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
            Showing {products.length} of {totalCount}
          </div>
          <button onClick={onLoadMore} style={{ border: "1px solid #111", padding: "11px 28px", borderRadius: 2, background: "#fff" }}>
            Load more
          </button>
        </div>
      )}
    </section>
  );
}
