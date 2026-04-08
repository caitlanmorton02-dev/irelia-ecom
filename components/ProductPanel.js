"use client";

import Image from "next/image";

export default function ProductPanel({ product, saved, onClose, onToggleSave }) {
  if (!product) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 70 }} />
      <aside className="panel-shell">
        <div style={{ borderBottom: "1px solid var(--border)", padding: "12px 14px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{product.category}</div>
          <button onClick={onClose} style={{ border: 0, background: "transparent", cursor: "pointer" }}>x</button>
        </div>
        <Image src={product.image} alt={product.title} width={800} height={1000} unoptimized style={{ width: "100%", height: "auto", aspectRatio: "4/5", objectFit: "cover" }} />
        <div style={{ padding: 16, display: "grid", gap: 8, paddingBottom: 84 }}>
          <strong>{product.price}</strong>
          <div>{product.title}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{product.brand} - {product.retailer}</div>
        </div>
        <div className="panel-cta">
          <a href={product.affiliateUrl || product.productUrl} target="_blank" rel="noreferrer" style={{ flex: 1, background: "#111", color: "#fff", borderRadius: 2, padding: "12px", textAlign: "center", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.08em" }}>
            Shop {product.retailer}
          </a>
          <button onClick={() => onToggleSave(product.id)} style={{ width: 44, border: "1px solid var(--border)", borderRadius: 2, background: "#fff" }}>
            {saved ? "♥" : "♡"}
          </button>
        </div>
      </aside>
      <style>{`
        .panel-shell {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 460px;
          background: #fff;
          z-index: 80;
          overflow: auto;
          animation: panelIn .22s ease;
        }
        .panel-cta {
          position: fixed;
          right: 0;
          bottom: 0;
          width: 460px;
          display: flex;
          gap: 10px;
          padding: 12px;
          border-top: 1px solid var(--border);
          background: #fff;
        }
        @keyframes panelIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 740px) {
          .panel-shell {
            top: auto;
            left: 0;
            width: 100%;
            max-height: 88vh;
            border-radius: 2px 2px 0 0;
            animation: panelUp .22s ease;
          }
          .panel-cta {
            left: 0;
            width: 100%;
          }
          @keyframes panelUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        }
      `}</style>
    </>
  );
}
