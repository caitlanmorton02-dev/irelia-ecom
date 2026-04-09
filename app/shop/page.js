"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import FilterBar from "../../components/FilterBar";
import ProductGrid from "../../components/ProductGrid";
import ProductPanel from "../../components/ProductPanel";
import { SkeletonGrid } from "../../components/SkeletonCard";
import { fetchProducts, getUniqueValues, parsePrice } from "../../lib/fetchProducts";
import { processProducts } from "../../lib/processProducts";
import { loadStyleDNA } from "../../lib/storage";
import { loadAuralisDNA, mergeWithAuralisDNA, STYLE_RECOMMENDATIONS } from "../../lib/dna";
import { useSaved } from "../../lib/useSaved";

const PAGE_SIZE = 60;

const NAV_CATEGORY_MAP = {
  Women: ["Dresses", "Tops", "Skirts", "Trousers", "Knitwear", "Coats & Jackets", "Shorts", "Jeans"],
  Men: ["Tops", "Trousers", "Jeans", "Coats & Jackets", "Knitwear"],
  Shoes: ["Shoes"],
  Accessories: ["Accessories", "Bags"],
};

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { savedProducts, savedIds, toggle: toggleSaved } = useSaved();
  const [dna, setDNA] = useState({ stores: [], brands: [], vibes: [], colors: [], sizes: [] });
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sort, setSort] = useState("new");
  const [filters, setFilters] = useState({ category: "", color: "", brand: "", maxPrice: "", retailer: "" });
  const [queryCategory, setQueryCategory] = useState("");
  // Chips the user has temporarily dismissed for this session
  const [removedDNAChips, setRemovedDNAChips] = useState(new Set());

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    const base = loadStyleDNA();
    const auralis = loadAuralisDNA();
    setDNA(mergeWithAuralisDNA(base, auralis));
  }, []);

  // Re-read DNA when user navigates back to this tab (e.g. after completing quiz in another tab)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const base = loadStyleDNA();
        const auralis = loadAuralisDNA();
        setDNA(mergeWithAuralisDNA(base, auralis));
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("category");
    setQueryCategory(fromQuery || "");
    if (!fromQuery) return;
    if (NAV_CATEGORY_MAP[fromQuery]) {
      setFilters((prev) => ({ ...prev, category: "" }));
    } else {
      setFilters((prev) => ({ ...prev, category: fromQuery }));
    }
  }, []);

  // Build effective DNA excluding chips the user dismissed
  const effectiveDNA = useMemo(() => {
    if (!removedDNAChips.size) return dna;
    return {
      ...dna,
      vibes: (dna.vibes || []).filter((v) => !removedDNAChips.has(`vibe:${v}`)),
      brands: (dna.brands || []).filter((b) => !removedDNAChips.has(`brand:${b}`)),
      colors: (dna.colors || []).filter((c) => !removedDNAChips.has(`color:${c}`)),
      stores: (dna.stores || []).filter((s) => !removedDNAChips.has(`store:${s}`)),
    };
  }, [dna, removedDNAChips]);

  const filteredProducts = useMemo(
    () =>
      processProducts(products, effectiveDNA, {
        filters,
        sort,
        navCategory: queryCategory,
        navCategoryMap: NAV_CATEGORY_MAP,
      }),
    [filters, effectiveDNA, products, queryCategory, sort]
  );

  const visibleProducts = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const toggleSave = (id) => {
    // Find the full product object so we can store it in auralis_saved
    const product = products.find((p) => p.id === id);
    if (!product) return;
    toggleSaved(product);
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container" style={{ paddingTop: 20, paddingBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Shop
          </h1>
          {!loading && (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {filteredProducts.length} items
            </span>
          )}
        </div>

        <div className="sticky-filters">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            categories={getUniqueValues(products, "category")}
            colors={getUniqueValues(products, "color")}
            brands={getUniqueValues(products, "brand")}
            retailers={getUniqueValues(products, "retailer")}
            sort={sort}
            setSort={setSort}
            dna={dna}
            removedDNAChips={removedDNAChips}
            onRemoveDNAChip={(key) => setRemovedDNAChips((prev) => new Set([...prev, key]))}
          />
        </div>

        {/* ── Recommendation banner (shown when DNA has a primaryStyle) ──── */}
        {!loading && effectiveDNA?.primaryStyle && (() => {
          const recs = (STYLE_RECOMMENDATIONS[effectiveDNA.primaryStyle] || []).slice(0, 3);
          if (!recs.length) return null;
          return (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 2,
                padding: "16px 18px",
                marginBottom: 24,
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--muted)",
                  marginBottom: 12,
                }}
              >
                Curated for your {effectiveDNA.primaryStyle} style
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 8,
                }}
              >
                {recs.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 2,
                      padding: "10px 12px",
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{rec.label}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{rec.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <ProductGrid
            products={visibleProducts}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onOpenPanel={setSelectedProduct}
            hasMore={hasMore}
            onLoadMore={() => setPage((v) => v + 1)}
            totalCount={filteredProducts.length}
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
