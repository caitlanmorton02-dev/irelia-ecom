"use client";

import Image from "next/image";
import Link from "next/link";
import ProductGrid from "./ProductGrid";
import StyleDNACard from "./StyleDNACard";

const CATEGORY_TILES = [
  { name: "Women", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80", href: "/shop?category=Women" },
  { name: "Men", image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80", href: "/shop?category=Men" },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80", href: "/shop?category=Shoes" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", href: "/shop?category=Accessories" },
  { name: "Dresses", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", href: "/shop?category=Dresses" },
  { name: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", href: "/shop?category=Bags" },
];

export default function SavedEdit({ products, allProducts, savedIds, dna, onToggleSave, onOpenPanel }) {

  // ── EMPTY STATE ───────────────────────────────────────────────────────────
  if (!products.length) {
    const hasDNA = dna?.primaryStyle;
    const styleLabel = dna?.dnaLabel || dna?.primaryStyle;
    const trendingForStyle = allProducts?.slice(0, 8) || [];

    return (
      <div>
        {/* 1. Style DNA summary card */}
        <div style={{ marginBottom: 32 }}>
          <StyleDNACard dna={dna || {}} variant="compact" />
        </div>

        {/* 2. Category tiles */}
        <h2 style={{ margin: "0 0 14px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Shop by category
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: 8,
            marginBottom: 40,
          }}
        >
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: 2 }}
            >
              <Image
                src={tile.image}
                alt={tile.name}
                width={600}
                height={400}
                unoptimized
                style={{ width: "100%", height: "auto", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "10px 12px",
                }}
              >
                <span style={{ color: "#fff", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                  {tile.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 3. Trending for your style */}
        {trendingForStyle.length > 0 && (
          <>
            <h2 style={{ margin: "0 0 16px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {hasDNA ? `Trending for ${styleLabel}` : "Trending now"}
            </h2>
            <ProductGrid
              products={trendingForStyle}
              savedIds={savedIds || []}
              onToggleSave={onToggleSave}
              onOpenPanel={onOpenPanel}
              hasMore={false}
              totalCount={trendingForStyle.length}
            />
          </>
        )}
      </div>
    );
  }

  // ── FILLED STATE ──────────────────────────────────────────────────────────

  // "More like your style" — products not already saved, scored by DNA
  const moreLikeStyle = allProducts
    ? allProducts.filter((p) => !savedIds.includes(p.id)).slice(0, 4)
    : [];

  return (
    <div>
      {/* Saved items grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px 16px",
          marginBottom: 48,
        }}
      >
        {products.map((product) => (
          <article key={product.id} className="fade-in">
            <div
              onClick={() => onOpenPanel(product)}
              style={{ cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: 2 }}
            >
              <Image
                src={product.image}
                alt={product.title}
                width={500}
                height={700}
                unoptimized
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.32s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "32px 10px 10px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                  opacity: 0,
                  transition: "opacity 0.22s",
                }}
                className="card-overlay"
              />
            </div>
            <div style={{ marginTop: 10, display: "grid", gap: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{product.brand}</span>
                <strong style={{ fontSize: 12 }}>{product.price}</strong>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{product.title}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    border: "1px solid #111",
                    padding: "9px 10px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Shop {product.retailer}
                </a>
                <button
                  onClick={() => onToggleSave(product.id)}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    padding: "9px 12px",
                    background: "#fff",
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  aria-label="Remove from Your Edit"
                >
                  ♥
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* More like your style */}
      {moreLikeStyle.length > 0 && (
        <>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, marginBottom: 18 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {dna?.primaryStyle ? `More like your ${dna.primaryStyle} style` : "More like your style"}
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--muted)" }}>
              Based on what you've saved so far.
            </p>
          </div>
          <ProductGrid
            products={moreLikeStyle}
            savedIds={savedIds || []}
            onToggleSave={onToggleSave}
            onOpenPanel={onOpenPanel}
            hasMore={false}
            totalCount={moreLikeStyle.length}
          />
        </>
      )}
    </div>
  );
}
