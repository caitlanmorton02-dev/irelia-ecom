"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import FilterBar from "../../components/FilterBar";
import ProductGrid from "../../components/ProductGrid";
import ProductPanel from "../../components/ProductPanel";
import { applyPreferences, fetchProducts, getUniqueValues, parsePrice } from "../../lib/fetchProducts";
import { loadPreferences, loadSavedIds, saveSavedIds } from "../../lib/storage";

const PAGE_SIZE = 60;

const NAV_CATEGORY_MAP = {
  Women: ["Dresses", "Tops", "Skirts", "Trousers", "Knitwear", "Coats & Jackets", "Shorts", "Jeans"],
  Men: ["Tops", "Trousers", "Jeans", "Coats & Jackets", "Knitwear"],
  Shoes: ["Shoes"],
  Accessories: ["Accessories", "Bags"],
};

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [preferences, setPreferences] = useState({ stores: [], vibes: [], colors: [], sizes: [] });
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sort, setSort] = useState("new");
  const [filters, setFilters] = useState({ category: "", color: "", brand: "", maxPrice: "", retailer: "" });
  const [queryCategory, setQueryCategory] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    setSavedIds(loadSavedIds());
    setPreferences(loadPreferences());
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

  const filteredProducts = useMemo(() => {
    let result = applyPreferences(products, preferences);
    if (queryCategory && NAV_CATEGORY_MAP[queryCategory]) {
      result = result.filter((product) => NAV_CATEGORY_MAP[queryCategory].includes(product.category));
    }
    if (filters.category) result = result.filter((product) => product.category === filters.category);
    if (filters.color) result = result.filter((product) => product.color === filters.color);
    if (filters.brand) result = result.filter((product) => product.brand === filters.brand);
    if (filters.retailer) result = result.filter((product) => product.retailer === filters.retailer);
    if (filters.maxPrice) result = result.filter((product) => parsePrice(product.price) <= Number(filters.maxPrice));

    if (sort === "price-low") result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price-high") result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return result;
  }, [filters, preferences, products, queryCategory, sort]);

  const visibleProducts = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container" style={{ paddingTop: 20, paddingBottom: 36 }}>
        <h1 style={{ margin: "0 0 16px", fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Shop</h1>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          categories={getUniqueValues(products, "category")}
          colors={getUniqueValues(products, "color")}
          brands={getUniqueValues(products, "brand")}
          retailers={getUniqueValues(products, "retailer")}
          sort={sort}
          setSort={setSort}
        />
        <ProductGrid
          products={visibleProducts}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onOpenPanel={setSelectedProduct}
          hasMore={hasMore}
          onLoadMore={() => setPage((value) => value + 1)}
          totalCount={filteredProducts.length}
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
