"use client";

import Image from "next/image";
import Link from "next/link";
import ProductGrid from "./ProductGrid";

const CATEGORY_TILES = [
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    href: "/shop?category=Women",
  },
  {
    name: "Men",
    image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80",
    href: "/shop?category=Men",
  },
  {
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80",
    href: "/shop?category=Shoes",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    href: "/shop?category=Accessories",
  },
  {
    name: "Dresses",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    href: "/shop?category=Dresses",
  },
  {
    name: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    href: "/shop?category=Bags",
  },
];

export default function SavedEdit({ products, allProducts, savedIds, onToggleSave, onOpenPanel }) {
  if (!products.length) {
    return (
      <div>
        {/* Empty state message */}
        <p style={{ margin: "0 0 28px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          Nothing saved yet.{" "}
          <Link href="/quiz" style={{ textDecoration: "underline" }}>
            Take the Style DNA quiz
          </Link>{" "}
          to personalise your feed, or browse below.
        </p>

        {/* Category tiles */}
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Shop by category
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 10,
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
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "3/2",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "10px 12px",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                  }}
                >
                  {tile.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Trending now */}
        {allProducts && allProducts.length > 0 && (
          <>
            <h2
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Trending now
            </h2>
            <ProductGrid
              products={allProducts.slice(0, 8)}
              savedIds={savedIds || []}
              onToggleSave={onToggleSave}
              onOpenPanel={onOpenPanel}
              hasMore={false}
              totalCount={8}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "24px 16px",
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
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{product.brand}</span>
              <strong style={{ fontSize: 12 }}>{product.price}</strong>
            </div>
            <div style={{ fontSize: 13 }}>{product.title}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
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
                }}
              >
                Shop
              </a>
              <button
                onClick={() => onToggleSave(product.id)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 2,
                  padding: "9px 12px",
                  background: "#fff",
                  fontSize: 13,
                  cursor: "pointer",
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
  );
}
