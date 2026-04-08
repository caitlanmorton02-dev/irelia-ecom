"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import ProductPanel from "../components/ProductPanel";
import { SkeletonGrid } from "../components/SkeletonCard";
import { applyPreferences, fetchProducts } from "../lib/fetchProducts";
import { loadStyleDNA, loadSavedIds, saveSavedIds } from "../lib/storage";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dna, setDNA] = useState({ stores: [], brands: [], vibes: [], colors: [], sizes: [] });

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    setSavedIds(loadSavedIds());
    setDNA(loadStyleDNA());
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

  const personalisedProducts = useMemo(
    () => applyPreferences(products, dna),
    [products, dna]
  );
  const trendingProducts = useMemo(() => products.slice(0, 8), [products]);

  const hasDNA = (dna.vibes || []).length || (dna.brands || []).length || (dna.colors || []).length;

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />

      {/* Hero */}
      <section className="container fade-in" style={{ paddingTop: 20 }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 2 }}>
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80"
            alt="IRELIA hero"
            width={1600}
            height={700}
            unoptimized
            priority
            style={{ width: "100%", height: "auto", aspectRatio: "16/7", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "28px 28px",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 38, letterSpacing: "0.04em", color: "#fff", fontWeight: 700 }}>
              Your Edit
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.85)", maxWidth: 360 }}>
              Curated fashion discovery powered by real affiliate feeds and your Style DNA.
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <Link
                href="/shop"
                style={{
                  display: "inline-block",
                  background: "#fff",
                  color: "#111",
                  padding: "11px 20px",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                Shop now
              </Link>
              <Link
                href="/quiz"
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(255,255,255,0.7)",
                  color: "#fff",
                  padding: "11px 20px",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Style DNA quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category quick-links */}
      <section className="container" style={{ paddingTop: 22 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Women", "Men", "Shoes", "Accessories", "Dresses", "Bags"].map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              style={{
                border: "1px solid var(--border)",
                padding: "9px 14px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderRadius: 2,
                transition: "border-color 0.15s",
              }}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending now */}
      <section className="container" style={{ paddingTop: 34 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Trending now
        </h2>
        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <ProductGrid
            products={trendingProducts}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onOpenPanel={setSelectedProduct}
            hasMore={false}
            totalCount={trendingProducts.length}
          />
        )}
      </section>

      {/* Shop by category editorial */}
      <section className="container" style={{ paddingTop: 40 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Shop by category
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
          {[
            { name: "Dresses", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80" },
            { name: "Shoes", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80" },
          ].map((entry) => (
            <Link
              key={entry.name}
              href={`/shop?category=${encodeURIComponent(entry.name)}`}
              style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: 2 }}
            >
              <Image
                src={entry.image}
                alt={entry.name}
                width={900}
                height={600}
                unoptimized
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.35s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "14px 14px",
                }}
              >
                <span style={{ color: "#fff", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {entry.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalised for you */}
      <section className="container" style={{ paddingTop: 40, paddingBottom: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {hasDNA ? "Picked for you" : "New in"}
          </h2>
          {!hasDNA && (
            <Link
              href="/quiz"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                textDecoration: "underline",
              }}
            >
              Personalise →
            </Link>
          )}
        </div>
        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <ProductGrid
            products={personalisedProducts.slice(0, 8)}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onOpenPanel={setSelectedProduct}
            hasMore={false}
            totalCount={personalisedProducts.length}
          />
        )}
      </section>

      <ProductPanel
        product={selectedProduct}
        saved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelectedProduct(null)}
        dna={dna}
      />
    </main>
  );
}
