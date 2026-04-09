"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import FilterBar from "../../components/FilterBar";
import ProductGrid from "../../components/ProductGrid";
import ProductPanel from "../../components/ProductPanel";
import { SkeletonGrid } from "../../components/SkeletonCard";
import { applyPreferences, fetchProducts, getUniqueValues, parsePrice } from "../../lib/fetchProducts";
import { loadStyleDNA, loadSavedIds, saveSavedIds } from "../../lib/storage";
import { loadAuralisDNA, mergeWithAuralisDNA } from "../../lib/dna";

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
  const [savedIds, setSavedIds] = useState([]);
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
    setSavedIds(loadSavedIds());
    const base = loadStyleDNA();
    const auralis = loadAuralisDNA();
    setDNA(mergeWithAuralisDNA(base, auralis));
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

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

  const filteredProducts = useMemo(() => {
    let result = applyPreferences(products, effectiveDNA);
    if (queryCategory && NAV_CATEGORY_MAP[queryCategory]) {
      result = result.filter((p) => NAV_CATEGORY_MAP[queryCategory].includes(p.category));
    }
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.color) result = result.filter((p) => p.color === filters.color);
    if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
    if (filters.retailer) result = result.filter((p) => p.retailer === filters.retailer);
    if (filters.maxPrice) result = result.filter((p) => parsePrice(p.price) <= Number(filters.maxPrice));

    if (sort === "price-low") result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price-high") result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return result;
  }, [filters, effectiveDNA, products, queryCategory, sort]);

  const visibleProducts = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
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
