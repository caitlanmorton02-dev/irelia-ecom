"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import ProductPanel from "../components/ProductPanel";
import StyleDNACard from "../components/StyleDNACard";
import { SkeletonGrid } from "../components/SkeletonCard";
import { applyPreferences, fetchProducts } from "../lib/fetchProducts";
import { STYLE_CATEGORY_MAP } from "../lib/styleDNA";
import { loadStyleDNA } from "../lib/storage";
import { useSaved } from "../lib/useSaved";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { savedProducts, savedIds, toggle: toggleSaved } = useSaved();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dna, setDNA] = useState({
    stores: [], brands: [], vibes: [], colors: [], sizes: [],
    fit: "", primaryStyle: null, secondaryStyle: null,
    dnaLabel: null, dnaDescription: null,
  });

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    setDNA(loadStyleDNA());
  }, []);

  const toggleSave = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    toggleSaved(product);
  };

  const hasDNA = !!(dna.primaryStyle);

  // Personalised products sorted by DNA
  const personalisedProducts = useMemo(
    () => applyPreferences(products, dna),
    [products, dna]
  );

  // Trending = raw first 8 (not DNA-filtered)
  const trendingProducts = useMemo(() => products.slice(0, 8), [products]);

  // "Because you like [PrimaryStyle]" — products matching primary style category
  const becauseYouLike = useMemo(() => {
    if (!dna.primaryStyle) return [];
    const cats = STYLE_CATEGORY_MAP[dna.primaryStyle] || [];
    return products.filter((p) => cats.includes(p.category)).slice(0, 8);
  }, [products, dna.primaryStyle]);

  // "Trending in your style" — products matching secondary style (or primary if no secondary)
  const trendingInStyle = useMemo(() => {
    const style = dna.secondaryStyle || dna.primaryStyle;
    if (!style) return [];
    const cats = STYLE_CATEGORY_MAP[style] || [];
    return products.filter((p) => cats.includes(p.category)).slice(0, 4);
  }, [products, dna.primaryStyle, dna.secondaryStyle]);

  return (
    <main>
      <Header savedCount={savedIds.length} />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="container fade-in" style={{ paddingTop: 20 }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 2 }}>
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80"
            alt="IRELIA"
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
              background: "linear-gradient(to right, rgba(0,0,0,0.52) 0%, transparent 65%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "32px 32px",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {hasDNA ? `Your ${dna.dnaLabel} Edit` : "Your Edit"}
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(255,255,255,0.8)", maxWidth: 380, lineHeight: 1.5 }}>
              {hasDNA
                ? dna.dnaDescription || "Fashion discovery powered by your Style DNA."
                : "AI-powered fashion discovery from real affiliate feeds."}
            </p>
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/shop"
                style={{
                  display: "inline-block",
                  background: "#fff",
                  color: "#111",
                  padding: "12px 22px",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                Shop now
              </Link>
              {!hasDNA && (
                <Link
                  href="/dna"
                  style={{
                    display: "inline-block",
                    border: "1px solid rgba(255,255,255,0.65)",
                    color: "#fff",
                    padding: "12px 22px",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    borderRadius: 2,
                  }}
                >
                  Discover your style →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Style DNA card (shown when set) ───────────────────────── */}
      {hasDNA && (
        <section className="container fade-in" style={{ paddingTop: 20 }}>
          <StyleDNACard dna={dna} variant="inline" />
        </section>
      )}

      {/* ── Category quick-links ──────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Women", "Men", "Shoes", "Accessories", "Dresses", "Bags"].map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
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
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Because you like [Style] ──────────────────────────────── */}
      {hasDNA && becauseYouLike.length > 0 && (
        <section className="container" style={{ paddingTop: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Because you like {dna.primaryStyle}
            </h2>
            <Link
              href="/shop"
              style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              See all →
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <ProductGrid
              products={becauseYouLike}
              savedIds={savedIds}
              onToggleSave={toggleSave}
              onOpenPanel={setSelectedProduct}
              hasMore={false}
              totalCount={becauseYouLike.length}
            />
          )}
        </section>
      )}

      {/* ── Trending now (always visible) ────────────────────────── */}
      <section className="container" style={{ paddingTop: 36 }}>
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

      {/* ── Shop by category editorial ────────────────────────────── */}
      <section className="container" style={{ paddingTop: 40 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
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
                style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "14px",
                }}
              >
                <span style={{ color: "#fff", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                  {entry.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending in your style (secondary style) ──────────────── */}
      {hasDNA && trendingInStyle.length > 0 && (
        <section className="container" style={{ paddingTop: 40 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Trending in your style
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--muted)" }}>
            Inspired by your {dna.dnaLabel} DNA.
          </p>
          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <ProductGrid
              products={trendingInStyle}
              savedIds={savedIds}
              onToggleSave={toggleSave}
              onOpenPanel={setSelectedProduct}
              hasMore={false}
              totalCount={trendingInStyle.length}
            />
          )}
        </section>
      )}

      {/* ── Personalised for you / New in ────────────────────────── */}
      <section className="container" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {hasDNA ? "Inspired by your style" : "New in"}
          </h2>
          {!hasDNA && (
            <Link
              href="/quiz"
              style={{ fontSize: 11, color: "var(--muted)", textDecoration: "underline", letterSpacing: "0.06em" }}
            >
              Personalise your feed →
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
