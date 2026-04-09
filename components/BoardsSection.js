"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteBoard, removeProductFromBoard } from "../lib/dna";
import { getSavedProducts } from "../lib/saveProduct";

export default function BoardsSection({ boards, products, onBoardsChange, onOpenPanel }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!boards || boards.length === 0) {
    return (
      <div
        style={{
          background: "#f5f5f0",
          borderRadius: 2,
          padding: "28px 22px",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No boards yet</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Save products to a board to organise your favourites.
        </div>
      </div>
    );
  }

  // Build product lookup from both the catalogue prop AND saved products (localStorage).
  // This ensures board items resolve even if the catalogue hasn't loaded yet.
  const savedProductsFromStorage = getSavedProducts();
  const productMap = Object.fromEntries([
    ...savedProductsFromStorage.map((p) => [p.id, p]),
    ...(products || []).map((p) => [p.id, p]), // catalogue takes precedence
  ]);

  const handleDeleteBoard = (boardId) => {
    const updated = deleteBoard(boardId);
    onBoardsChange(updated);
    setConfirmDelete(null);
  };

  const handleRemoveItem = (boardId, productId) => {
    const updated = removeProductFromBoard(boardId, productId);
    onBoardsChange(updated);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Your Boards
        </h2>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {boards.length} {boards.length === 1 ? "board" : "boards"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {boards.map((board) => {
          const items = (board.items || [])
            .map((id) => productMap[id])
            .filter(Boolean);

          return (
            <div
              key={board.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {/* Board header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: items.length > 0 ? "1px solid var(--border)" : "none",
                  background: "#fafafa",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{board.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {confirmDelete === board.id ? (
                    <>
                      <button
                        onClick={() => handleDeleteBoard(board.id)}
                        style={{
                          background: "#c0392b",
                          color: "#fff",
                          border: "none",
                          borderRadius: 2,
                          padding: "6px 12px",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        style={{
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: 2,
                          padding: "6px 12px",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(board.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: 2,
                        padding: "6px 12px",
                        fontSize: 11,
                        color: "var(--muted)",
                        cursor: "pointer",
                      }}
                    >
                      Delete board
                    </button>
                  )}
                </div>
              </div>

              {/* Board items */}
              {items.length === 0 ? (
                <div
                  style={{
                    padding: "20px 16px",
                    fontSize: 12,
                    color: "var(--muted)",
                    textAlign: "center",
                  }}
                >
                  No items yet — open a product and add it to this board.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 1,
                    background: "var(--border)",
                  }}
                >
                  {items.map((product) => (
                    <div
                      key={product.id}
                      style={{ position: "relative", background: "#fff", cursor: "pointer" }}
                      onClick={() => onOpenPanel && onOpenPanel(product)}
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={400}
                        height={500}
                        unoptimized
                        style={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "4/5",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          padding: "8px 10px",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 2,
                          }}
                        >
                          <span>{product.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(board.id, product.id);
                            }}
                            title="Remove from board"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--muted)",
                              fontSize: 12,
                              padding: 0,
                              lineHeight: 1,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
