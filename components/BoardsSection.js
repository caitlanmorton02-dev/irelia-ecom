"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProductGrid from "./ProductGrid";
import {
  createBoard,
  deleteBoard,
  removeProductFromBoard,
  addProductsToBoard,
} from "../lib/dna";
import { getSavedProducts } from "../lib/saveProduct";
import { processProducts } from "../lib/processProducts";

// ─── Preset tags ──────────────────────────────────────────────────────────────

const PRESET_TAGS = [
  "Holiday", "Workwear", "Night out", "Weekend",
  "Occasion", "Casual", "Summer", "Winter",
];

// ─── Ghost placeholder card ───────────────────────────────────────────────────

function GhostCard() {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 2,
        overflow: "hidden",
        opacity: 0.28,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "var(--border)",
          aspectRatio: "1",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ background: "#e8e8e4" }} />
        ))}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ height: 10, background: "#e0e0dc", borderRadius: 2, width: "55%", marginBottom: 6 }} />
        <div style={{ height: 8, background: "#e0e0dc", borderRadius: 2, width: "35%" }} />
      </div>
    </div>
  );
}

// ─── Create board modal ───────────────────────────────────────────────────────

function CreateBoardModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
    setCustomTag("");
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const board = createBoard(name.trim(), selectedTags);
    onCreated(board);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 200,
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 2,
          width: "min(440px, calc(100vw - 32px))",
          zIndex: 201,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
            Create board
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: 2, width: 28, height: 28,
              cursor: "pointer", fontSize: 12, color: "var(--muted)",
              display: "grid", placeItems: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "18px 18px 22px" }}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "var(--muted)",
                display: "block", marginBottom: 8,
              }}
            >
              Board name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. Holiday wardrobe"
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1px solid var(--border)", borderRadius: 2,
                padding: "10px 12px", fontSize: 13, outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "var(--muted)",
                display: "block", marginBottom: 8,
              }}
            >
              Tags (optional)
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {PRESET_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "5px 11px",
                      border: `1px solid ${active ? "#111" : "var(--border)"}`,
                      background: active ? "#111" : "transparent",
                      color: active ? "#fff" : "#111",
                      borderRadius: 20, fontSize: 11,
                      cursor: "pointer", transition: "all 0.12s",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
                placeholder="Add custom tag…"
                style={{
                  flex: 1, border: "1px solid var(--border)", borderRadius: 2,
                  padding: "8px 10px", fontSize: 12, outline: "none",
                }}
              />
              <button
                onClick={addCustomTag}
                style={{
                  border: "1px solid var(--border)", borderRadius: 2,
                  padding: "8px 12px", fontSize: 11, cursor: "pointer",
                  background: "transparent", color: "var(--muted)",
                }}
              >
                Add
              </button>
            </div>
            {selectedTags.filter((t) => !PRESET_TAGS.includes(t)).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {selectedTags.filter((t) => !PRESET_TAGS.includes(t)).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "3px 8px", background: "#111", color: "#fff",
                      borderRadius: 20, fontSize: 11,
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => setSelectedTags((prev) => prev.filter((t2) => t2 !== tag))}
                      style={{
                        background: "none", border: "none", color: "#fff",
                        cursor: "pointer", fontSize: 10, padding: 0, lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              width: "100%", padding: "12px",
              background: name.trim() ? "#111" : "#ccc",
              color: "#fff", border: "none", borderRadius: 2,
              fontSize: 12, fontWeight: 700,
              cursor: name.trim() ? "pointer" : "default",
              textTransform: "uppercase", letterSpacing: "0.08em",
              transition: "background 0.15s",
            }}
          >
            Create board
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Board card (list view) ───────────────────────────────────────────────────

function BoardCard({ board, productMap, onClick }) {
  const previews = (board.items || [])
    .map((id) => productMap[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 2, overflow: "hidden", cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 1, background: "var(--border)", aspectRatio: "1",
        }}
      >
        {previews.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1", gridRow: "1 / -1",
              background: "#f0f0ec",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Empty
            </span>
          </div>
        ) : (
          [0, 1, 2, 3].map((i) =>
            previews[i] ? (
              <div key={i} style={{ overflow: "hidden", background: "#f5f5f0" }}>
                <Image
                  src={previews[i].image}
                  alt={previews[i].title}
                  width={300}
                  height={300}
                  unoptimized
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ) : (
              <div key={i} style={{ background: "#f5f5f0" }} />
            )
          )
        )}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{board.name}</div>
        {board.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
            {board.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10, padding: "2px 7px",
                  border: "1px solid var(--border)",
                  borderRadius: 20, color: "var(--muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          {board.items?.length || 0} {(board.items?.length || 0) === 1 ? "item" : "items"}
        </div>
      </div>
    </div>
  );
}

// ─── Selectable card (used only in selection mode) ────────────────────────────

function SelectableCard({ product, selected, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        cursor: "pointer",
        outline: selected ? "2px solid #111" : "2px solid transparent",
        outlineOffset: -2,
        borderRadius: 2,
        overflow: "hidden",
        transition: "outline-color 0.12s",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Image
          src={product.image}
          alt={product.title}
          width={400}
          height={500}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "3/4",
            objectFit: "cover",
            display: "block",
            opacity: selected ? 1 : 0.82,
            transition: "opacity 0.15s",
          }}
        />

        {/* Subtle overlay when selected */}
        {selected && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(17,17,17,0.08)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Selection indicator dot */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: selected ? "#111" : "rgba(255,255,255,0.7)",
            border: selected ? "none" : "1.5px solid rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>{product.brand}</div>
        <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>{product.title}</div>
        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3 }}>{product.price}</div>
      </div>
    </div>
  );
}

// ─── Selection view ───────────────────────────────────────────────────────────

function SelectionView({ board, savedProducts, onAdd, onCancel }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const inBoard = new Set(board.items || []);
  const available = (savedProducts || []).filter((p) => !inBoard.has(p.id));

  const toggle = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const count = selectedIds.length;

  return (
    <div>
      {/* Sticky action bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "11px 0 12px",
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 2,
              padding: "6px 12px",
              fontSize: 11,
              cursor: "pointer",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Cancel
          </button>
          <span
            style={{
              fontSize: 12,
              color: count > 0 ? "#111" : "var(--muted)",
              transition: "color 0.15s",
            }}
          >
            {count > 0 ? `${count} selected` : "Select pieces to add"}
          </span>
          {count > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              style={{
                background: "none",
                border: "none",
                fontSize: 11,
                color: "var(--muted)",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={() => count > 0 && onAdd(selectedIds)}
          disabled={count === 0}
          style={{
            background: count > 0 ? "#111" : "#e0e0dc",
            color: count > 0 ? "#fff" : "#aaa",
            border: "none",
            borderRadius: 2,
            padding: "9px 18px",
            fontSize: 11,
            fontWeight: 700,
            cursor: count > 0 ? "pointer" : "default",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {count > 0 ? `Add ${count} to board` : "Add to board"}
        </button>
      </div>

      {/* Section label */}
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--muted)",
          marginBottom: 14,
        }}
      >
        Your saved items
      </div>

      {available.length === 0 ? (
        <div
          style={{
            background: "#f5f5f0",
            borderRadius: 2,
            padding: "28px 22px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {(savedProducts || []).length === 0
              ? "Save some products first, then add them to this board."
              : "All your saved items are already in this board."}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "16px 10px",
          }}
        >
          {available.map((product) => (
            <SelectableCard
              key={product.id}
              product={product}
              selected={selectedIds.includes(product.id)}
              onToggle={() => toggle(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Board detail view ────────────────────────────────────────────────────────

function BoardDetailView({
  board,
  productMap,
  products,
  dna,
  savedProducts,
  savedIds,
  onToggleSave,
  onOpenPanel,
  onBack,
  onRemoveItem,
  onDeleteBoard,
  onBoardsChange,
}) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const boardProducts = (board.items || [])
    .map((id) => productMap[id])
    .filter(Boolean);

  const suggested = useMemo(() => {
    if (!products?.length) return [];
    const inBoard = new Set(board.items || []);
    return processProducts(products, dna)
      .filter((p) => !inBoard.has(p.id))
      .slice(0, 8);
  }, [products, dna, board.items]);

  const handleAdd = (selectedIds) => {
    const updated = addProductsToBoard(board.id, selectedIds);
    onBoardsChange(updated);
    setSelectionMode(false);
  };

  // ── Selection mode ──────────────────────────────────────────────────────────
  if (selectionMode) {
    return (
      <SelectionView
        board={board}
        savedProducts={savedProducts}
        onAdd={handleAdd}
        onCancel={() => setSelectionMode(false)}
      />
    );
  }

  // ── Normal detail ───────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 2,
            padding: "6px 12px",
            fontSize: 11,
            cursor: "pointer",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          ← Back
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {board.name}
          </div>
          {board.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {board.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    color: "var(--muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {/* Add pieces CTA */}
          <button
            onClick={() => setSelectionMode(true)}
            style={{
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              padding: "7px 14px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Add pieces
          </button>

          {/* Delete */}
          {confirmDelete ? (
            <>
              <button
                onClick={() => onDeleteBoard(board.id)}
                style={{
                  background: "#c0392b", color: "#fff",
                  border: "none", borderRadius: 2,
                  padding: "7px 12px", fontSize: 11, cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 2, padding: "7px 12px",
                  fontSize: 11, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 2, padding: "7px 12px",
                fontSize: 11, color: "var(--muted)", cursor: "pointer",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Board products */}
      {boardProducts.length === 0 ? (
        <div
          style={{
            background: "#f5f5f0",
            borderRadius: 2,
            padding: "32px 22px",
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
            No products in this board yet.
          </div>
          <button
            onClick={() => setSelectionMode(true)}
            style={{
              background: "#111", color: "#fff",
              border: "none", borderRadius: 2,
              padding: "10px 18px", fontSize: 11,
              fontWeight: 700, cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}
          >
            Add pieces
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "20px 12px",
            marginBottom: 44,
          }}
        >
          {boardProducts.map((product) => (
            <div key={product.id}>
              <div
                onClick={() => onOpenPanel(product)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ position: "relative", overflow: "hidden", borderRadius: 2 }}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={500}
                    unoptimized
                    style={{
                      width: "100%", height: "auto",
                      aspectRatio: "4/5", objectFit: "cover", display: "block",
                    }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveItem(board.id, product.id); }}
                    title="Remove from board"
                    style={{
                      position: "absolute", top: 6, right: 6,
                      background: "rgba(255,255,255,0.92)",
                      border: "1px solid var(--border)",
                      borderRadius: 2, width: 26, height: 26,
                      display: "grid", placeItems: "center",
                      cursor: "pointer", fontSize: 10, color: "var(--muted)",
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{product.brand}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>
                    {product.title}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3 }}>{product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested for this board */}
      {suggested.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Suggested for this board
          </h3>
          <p style={{ margin: "0 0 18px", fontSize: 12, color: "var(--muted)" }}>
            Based on your style DNA.
          </p>
          <ProductGrid
            products={suggested}
            savedIds={savedIds || []}
            onToggleSave={onToggleSave}
            onOpenPanel={onOpenPanel}
            hasMore={false}
            totalCount={suggested.length}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main BoardsSection ───────────────────────────────────────────────────────

export default function BoardsSection({
  boards,
  products,
  dna,
  savedIds,
  savedProducts,
  onToggleSave,
  onBoardsChange,
  onOpenPanel,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  const productMap = useMemo(() => {
    const saved = getSavedProducts();
    return Object.fromEntries([
      ...saved.map((p) => [p.id, p]),
      ...(products || []).map((p) => [p.id, p]),
    ]);
  }, [products]);

  const allTags = useMemo(() => {
    const tags = new Set();
    (boards || []).forEach((b) => (b.tags || []).forEach((t) => tags.add(t)));
    return [...tags];
  }, [boards]);

  const visibleBoards = useMemo(() => {
    if (!activeTag) return boards || [];
    return (boards || []).filter((b) => (b.tags || []).includes(activeTag));
  }, [boards, activeTag]);

  const handleCreated = (board) => {
    onBoardsChange([...(boards || []), board]);
    setSelectedBoardId(board.id);
  };

  const handleDeleteBoard = (boardId) => {
    const updated = deleteBoard(boardId);
    onBoardsChange(updated);
    setSelectedBoardId(null);
  };

  const handleRemoveItem = (boardId, productId) => {
    const updated = removeProductFromBoard(boardId, productId);
    onBoardsChange(updated);
  };

  // ── Detail view ─────────────────────────────────────────────────────────────
  const selectedBoard = (boards || []).find((b) => b.id === selectedBoardId);
  if (selectedBoardId && selectedBoard) {
    return (
      <BoardDetailView
        board={selectedBoard}
        productMap={productMap}
        products={products}
        dna={dna}
        savedProducts={savedProducts || getSavedProducts()}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onOpenPanel={onOpenPanel}
        onBack={() => setSelectedBoardId(null)}
        onRemoveItem={handleRemoveItem}
        onDeleteBoard={handleDeleteBoard}
        onBoardsChange={onBoardsChange}
      />
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!boards || boards.length === 0) {
    return (
      <>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No boards yet</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18, lineHeight: 1.5 }}>
            Create boards to organise your looks by occasion, season, or mood.
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: "#111", color: "#fff",
              border: "none", borderRadius: 2,
              padding: "11px 20px", fontSize: 11,
              fontWeight: 700, cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: 28,
            }}
          >
            Create board
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {[1, 2, 3].map((i) => <GhostCard key={i} />)}
        </div>

        {showCreate && (
          <CreateBoardModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
        )}
      </>
    );
  }

  // ── Board list view ─────────────────────────────────────────────────────────
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--muted)" }}>
          {boards.length} {boards.length === 1 ? "board" : "boards"}
        </span>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 2, padding: "7px 14px",
            fontSize: 11, cursor: "pointer",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}
        >
          + New board
        </button>
      </div>

      {allTags.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          <button
            onClick={() => setActiveTag(null)}
            style={{
              padding: "5px 12px",
              border: `1px solid ${!activeTag ? "#111" : "var(--border)"}`,
              background: !activeTag ? "#111" : "transparent",
              color: !activeTag ? "#fff" : "#111",
              borderRadius: 20, fontSize: 11,
              cursor: "pointer", transition: "all 0.12s",
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              style={{
                padding: "5px 12px",
                border: `1px solid ${activeTag === tag ? "#111" : "var(--border)"}`,
                background: activeTag === tag ? "#111" : "transparent",
                color: activeTag === tag ? "#fff" : "#111",
                borderRadius: 20, fontSize: 11,
                cursor: "pointer", transition: "all 0.12s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {visibleBoards.length === 0 ? (
        <div style={{ fontSize: 12, color: "var(--muted)", padding: "16px 0" }}>
          No boards tagged &ldquo;{activeTag}&rdquo;.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 32,
          }}
        >
          {visibleBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              productMap={productMap}
              onClick={() => setSelectedBoardId(board.id)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateBoardModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </>
  );
}
