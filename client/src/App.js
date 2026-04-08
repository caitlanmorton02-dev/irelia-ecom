import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import ProductGrid from "./components/ProductGrid";
import ProductPanel from "./components/ProductPanel";
import SavedEdit from "./components/SavedEdit";

const PAGE_SIZE = 60;

const NAV_CATEGORIES = ["Women", "Men", "Shoes", "Bags", "Accessories", "Sale"];

const CATEGORY_MAP = {
  Women: ["Dresses", "Tops", "Skirts", "Trousers", "Knitwear", "Coats & Jackets", "Shorts", "Jeans"],
  Men: ["Tops", "Trousers", "Jeans", "Coats & Jackets", "Knitwear"],
  Shoes: ["Shoes"],
  Bags: ["Bags"],
  Accessories: ["Accessories"],
  Sale: null, // show all
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: "", color: "", brand: "", maxPrice: "", vibe: "" });
  const [activeNav, setActiveNav] = useState("Women");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("irelia_saved") || "[]");
    } catch {
      return [];
    }
  });
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("irelia_saved", JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = useCallback((id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const filteredProducts = products.filter((p) => {
    // Nav filter
    const navCats = CATEGORY_MAP[activeNav];
    if (navCats !== null && navCats && !navCats.includes(p.category)) return false;

    // Filter bar filters
    if (filters.category && p.category !== filters.category) return false;
    if (filters.color && p.color.toLowerCase() !== filters.color.toLowerCase()) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.maxPrice) {
      const numPrice = parseFloat(p.price.replace("£", ""));
      if (numPrice > parseFloat(filters.maxPrice)) return false;
    }
    return true;
  });

  const paginatedProducts = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleNavChange = (nav) => {
    setActiveNav(nav);
    setFilters({ category: "", color: "", brand: "", maxPrice: "", vibe: "" });
    setPage(1);
  };

  const savedProducts = products.filter((p) => savedIds.includes(p.id));

  // Derived filter options from current product set
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const colors = [...new Set(products.map((p) => p.color))].sort();
  const brands = [...new Set(products.map((p) => p.brand))].sort();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header
        navItems={NAV_CATEGORIES}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        savedCount={savedIds.length}
        onEditOpen={() => setEditOpen(true)}
      />

      <FilterBar
        filters={filters}
        onFilterChange={(key, val) => {
          setFilters((prev) => ({ ...prev, [key]: val }));
          setPage(1);
        }}
        categories={categories}
        colors={colors}
        brands={brands}
        resultCount={filteredProducts.length}
      />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px 80px" }}>
        <ProductGrid
          products={paginatedProducts}
          loading={loading}
          error={error}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onProductClick={setSelectedProduct}
          hasMore={hasMore}
          onLoadMore={() => setPage((p) => p + 1)}
          totalCount={filteredProducts.length}
        />
      </main>

      {selectedProduct && (
        <ProductPanel
          product={selectedProduct}
          isSaved={savedIds.includes(selectedProduct.id)}
          onToggleSave={toggleSave}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {editOpen && (
        <SavedEdit
          products={savedProducts}
          onRemove={toggleSave}
          onClose={() => setEditOpen(false)}
          onProductClick={(p) => {
            setSelectedProduct(p);
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}
