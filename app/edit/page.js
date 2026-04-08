"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import SavedEdit from "../../components/SavedEdit";
import ProductPanel from "../../components/ProductPanel";
import { fetchProducts } from "../../lib/fetchProducts";
import { loadSavedIds, saveSavedIds } from "../../lib/storage";

export default function EditPage() {
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    setSavedIds(loadSavedIds());
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

  const savedProducts = useMemo(() => products.filter((product) => savedIds.includes(product.id)), [products, savedIds]);

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container" style={{ paddingTop: 20, paddingBottom: 36 }}>
        <h1 style={{ margin: "0 0 14px", fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Edit</h1>
        <SavedEdit products={savedProducts} onToggleSave={toggleSave} onOpenPanel={setSelectedProduct} />
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
