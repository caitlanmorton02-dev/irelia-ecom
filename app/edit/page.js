"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import SavedEdit from "../../components/SavedEdit";
import ProductPanel from "../../components/ProductPanel";
import { fetchProducts } from "../../lib/fetchProducts";
import { loadSavedIds, saveSavedIds, loadStyleDNA } from "../../lib/storage";

export default function EditPage() {
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dna, setDNA] = useState({ stores: [], brands: [], vibes: [], colors: [], sizes: [] });

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    setSavedIds(loadSavedIds());
    setDNA(loadStyleDNA());
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

  const savedProducts = useMemo(
    () => products.filter((product) => savedIds.includes(product.id)),
    [products, savedIds]
  );

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container" style={{ paddingTop: 24, paddingBottom: 50 }}>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 18,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Your Edit
        </h1>
        {savedProducts.length > 0 && (
          <p style={{ margin: "0 0 22px", fontSize: 13, color: "var(--muted)" }}>
            {savedProducts.length} saved {savedProducts.length === 1 ? "item" : "items"}
          </p>
        )}
        <SavedEdit
          products={savedProducts}
          allProducts={products}
          savedIds={savedIds}
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
