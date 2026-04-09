"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import SavedEdit from "../../components/SavedEdit";
import ProductPanel from "../../components/ProductPanel";
import BoardsSection from "../../components/BoardsSection";
import { fetchProducts } from "../../lib/fetchProducts";
import { processProducts } from "../../lib/processProducts";
import { loadStyleDNA } from "../../lib/storage";
import { loadBoards, loadAuralisDNA, mergeWithAuralisDNA } from "../../lib/dna";
import { useSaved } from "../../lib/useSaved";

const TABS = ["The Edit", "Boards"];

export default function EditPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [boards, setBoards] = useState([]);
  const [activeTab, setActiveTab] = useState("The Edit");
  const [dna, setDNA] = useState({
    stores: [], brands: [], vibes: [], colors: [], sizes: [],
    fit: "", primaryStyle: null, secondaryStyle: null,
  });

  const { savedProducts, savedIds, toggle: toggleSaved } = useSaved();

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    const base = loadStyleDNA();
    const auralis = loadAuralisDNA();
    setDNA(mergeWithAuralisDNA(base, auralis));
    setBoards(loadBoards());
  }, []);

  // All products scored + sorted by DNA — no user filters applied
  const sortedProducts = useMemo(
    () => processProducts(products, dna),
    [products, dna]
  );

  const toggleSave = (id) => {
    // Look up the full product object: check saved list first, then full catalogue
    const product =
      savedProducts.find((p) => p.id === id) ||
      sortedProducts.find((p) => p.id === id) ||
      products.find((p) => p.id === id);
    if (!product) return;
    toggleSaved(product);
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container" style={{ paddingTop: 24, paddingBottom: 56 }}>

        {/* ── Page heading ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Your Edit
          </h1>
          {activeTab === "The Edit" && savedProducts.length > 0 && (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {savedProducts.length} {savedProducts.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* ── Tab bar ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--border)",
            marginBottom: 28,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent",
                padding: "8px 20px 10px",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: activeTab === tab ? 700 : 400,
                cursor: "pointer",
                color: activeTab === tab ? "#111" : "var(--muted)",
                marginBottom: -1,
                transition: "color 0.15s",
              }}
            >
              {tab}
              {tab === "The Edit" && savedProducts.length > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "#111",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {savedProducts.length}
                </span>
              )}
              {tab === "Boards" && boards.length > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "var(--border)",
                    color: "#111",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {boards.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────────────────────── */}
        {activeTab === "The Edit" && (
          <SavedEdit
            products={savedProducts}
            allProducts={sortedProducts}
            savedIds={savedIds}
            dna={dna}
            onToggleSave={toggleSave}
            onOpenPanel={setSelectedProduct}
          />
        )}

        {activeTab === "Boards" && (
          <BoardsSection
            boards={boards}
            products={products}
            onBoardsChange={setBoards}
            onOpenPanel={setSelectedProduct}
          />
        )}
      </section>

      <ProductPanel
        product={selectedProduct}
        saved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelectedProduct(null)}
        dna={dna}
        onBoardsChange={setBoards}
      />

    </main>
  );
}
