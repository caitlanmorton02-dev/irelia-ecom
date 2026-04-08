"use client";

import Image from "next/image";

export default function SavedEdit({ products, onToggleSave, onOpenPanel }) {
  if (!products.length) {
    return <div style={{ color: "var(--muted)" }}>No saved items yet.</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px 16px" }}>
      {products.map((product) => (
        <article key={product.id}>
          <div onClick={() => onOpenPanel(product)} style={{ cursor: "pointer", position: "relative" }}>
            <Image src={product.image} alt={product.title} width={500} height={700} unoptimized style={{ width: "100%", height: "auto", aspectRatio: "3/4", objectFit: "cover" }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 13 }}>{product.title}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{product.price}</div>
          <button onClick={() => onToggleSave(product.id)} style={{ marginTop: 8, border: "1px solid var(--border)", borderRadius: 2, padding: "8px 10px", background: "#fff", fontSize: 12 }}>
            Remove from Your Edit
          </button>
        </article>
      ))}
    </div>
  );
}
