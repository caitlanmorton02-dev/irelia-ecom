"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import ProductPanel from "../components/ProductPanel";
import { applyPreferences, fetchProducts } from "../lib/fetchProducts";
import { loadPreferences, loadSavedIds, saveSavedIds } from "../lib/storage";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [preferences, setPreferences] = useState({ stores: [], vibes: [], colors: [], sizes: [] });

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    setSavedIds(loadSavedIds());
    setPreferences(loadPreferences());
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

  const personalisedProducts = useMemo(() => applyPreferences(products, preferences), [products, preferences]);
  const trendingProducts = useMemo(() => products.slice(0, 8), [products]);

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container fade-in" style={{ paddingTop: 20 }}>
        <div style={{ position: "relative" }}>
          <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80" alt="IRELIA hero" width={1600} height={700} unoptimized style={{ width: "100%", height: "auto", aspectRatio: "16/7", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 20, bottom: 20, color: "#fff" }}>
            <h1 style={{ margin: 0, fontSize: 36, letterSpacing: "0.04em" }}>Your Edit</h1>
            <p style={{ marginTop: 8, fontSize: 14 }}>Luxury-inspired fashion discovery from real affiliate feeds</p>
            <Link href="/shop" style={{ marginTop: 12, display: "inline-block", border: "1px solid #fff", padding: "10px 14px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Shop now</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 24 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Women", "Men", "Shoes", "Accessories"].map((category) => (
            <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} style={{ border: "1px solid var(--border)", padding: "10px 14px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingTop: 30 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Trending now</h2>
        <ProductGrid
          products={trendingProducts}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onOpenPanel={setSelectedProduct}
          hasMore={false}
          totalCount={trendingProducts.length}
        />
      </section>

      <section className="container" style={{ paddingTop: 34 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Shop by category</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {[
            { name: "Dresses", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80" },
            { name: "Shoes", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80" },
          ].map((entry) => (
            <Link key={entry.name} href={`/shop?category=${encodeURIComponent(entry.name)}`} style={{ position: "relative" }}>
              <Image src={entry.image} alt={entry.name} width={900} height={600} unoptimized style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 12, bottom: 12, color: "#fff", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>{entry.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingTop: 34, paddingBottom: 44 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Personalised for you</h2>
        <ProductGrid
          products={personalisedProducts.slice(0, 8)}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onOpenPanel={setSelectedProduct}
          hasMore={false}
          totalCount={personalisedProducts.length}
        />
      </section>

      <ProductPanel
        product={selectedProduct}
        saved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
