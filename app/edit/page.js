"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import SavedEdit from "../../components/SavedEdit";
import ProductPanel from "../../components/ProductPanel";
import BoardsSection from "../../components/BoardsSection";
import { applyPreferences, fetchProducts } from "../../lib/fetchProducts";
import { loadSavedIds, saveSavedIds, loadStyleDNA } from "../../lib/storage";
import { loadBoards } from "../../lib/dna";

export default function EditPage() {
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [boards, setBoards] = useState([]);
  const [dna, setDNA] = useState({
    stores: [], brands: [], vibes: [], colors: [], sizes: [],
    fit: "", primaryStyle: null, secondaryStyle: null,
  });

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    setSavedIds(loadSavedIds());
    setDNA(loadStyleDNA());
    setBoards(loadBoards());
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

  // Saved items
  const savedProducts = useMemo(
    () => products.filter((p) => savedIds.includes(p.id)),
    [products, savedIds]
  );

  // All products sorted by DNA for "More like your style" / "Trending for style"
  const sortedProducts = useMemo(
    () => applyPreferences(products, dna),
    [products, dna]
  );

  const toggleSave = (id) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container" style={{ paddingTop: 24, paddingBottom: 56 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <h1 style={{ margin: 0, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Your Edit
          </h1>
          {savedProducts.length > 0 && (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {savedProducts.length} {savedProducts.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>
        <BoardsSection
          boards={boards}
          products={products}
          onBoardsChange={setBoards}
          onOpenPanel={setSelectedProduct}
        />

        <SavedEdit
          products={savedProducts}
          allProducts={sortedProducts}
          savedIds={savedIds}
          dna={dna}
          onToggleSave={toggleSave}
          onOpenPanel={setSelectedProduct}
        />
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
