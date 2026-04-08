"use client";

import Image from "next/image";

export default function ProductCard({ product, isSaved, onToggleSave, onOpenPanel }) {
  return (
    <article className="fade-in">
      <div onClick={() => onOpenPanel(product)} style={{ cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: 2 }}>
        <Image
          src={product.image}
          alt={product.title}
          width={600}
          height={800}
          unoptimized
          style={{ width: "100%", height: "auto", aspectRatio: "3/4", objectFit: "cover", transition: "transform 250ms ease" }}
          loading="lazy"
        />
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave(product.id);
          }}
          aria-label={isSaved ? "Remove from Your Edit" : "Save to Your Edit"}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            border: "1px solid var(--border)",
            borderRadius: 2,
            background: "rgba(255,255,255,0.95)",
            width: 30,
            height: 30,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{product.brand}</span>
          <strong style={{ fontSize: 12 }}>{product.price}</strong>
        </div>
        <div style={{ fontSize: 13 }}>{product.title}</div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>{product.retailer}</div>
        <a
          href={product.affiliateUrl || product.productUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          style={{
            marginTop: 4,
            display: "inline-block",
            border: "1px solid #111",
            padding: "10px 12px",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontSize: 11,
          }}
        >
          Shop {product.retailer}
        </a>
      </div>
    </article>
  );
}
