"use client";

import { useState } from "react";
import { createBoard, addProductToBoard } from "../lib/dna";

export default function AddToBoardModal({ product, boards, onClose, onBoardsChange, onSuccess }) {
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);
  const [added, setAdded] = useState(null);

  if (!product) return null;

  const handleAddToBoard = (boardId) => {
    const updated = addProductToBoard(boardId, product.id);
    onBoardsChange(updated);
    setAdded(boardId);
    if (onSuccess) onSuccess();
    setTimeout(onClose, 900);
  };

  const handleCreateAndAdd = () => {
    const name = newBoardName.trim() || "My Board";
    const board = createBoard(name);
    // addProductToBoard returns updated boards list
    const updated = addProductToBoard(board.id, product.id);
    onBoardsChange(updated);
    setAdded(board.id);
    if (onSuccess) onSuccess();
    setTimeout(onClose, 900);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 200,
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 2,
          width: "min(400px, calc(100vw - 32px))",
          zIndex: 201,
          overflow: "hidden",
          animation: "slideInUp 0.22s ease",
        }}
      >
        {/* Header */}
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
            Add to board
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 2,
              width: 28,
              height: 28,
              cursor: "pointer",
              fontSize: 12,
              color: "var(--muted)",
              display: "grid",
              placeItems: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "16px 18px" }}>
          {/* Existing boards */}
          {boards.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--muted)",
                  marginBottom: 10,
                }}
              >
                Your boards
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {boards.map((board) => {
                  const isAdded = added === board.id || board.items?.includes(product.id);
                  return (
                    <button
                      key={board.id}
                      onClick={() => !isAdded && handleAddToBoard(board.id)}
                      disabled={isAdded}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        border: `1px solid ${isAdded ? "#111" : "var(--border)"}`,
                        background: isAdded ? "#111" : "#fff",
                        color: isAdded ? "#fff" : "#111",
                        borderRadius: 2,
                        cursor: isAdded ? "default" : "pointer",
                        fontSize: 13,
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <span>{board.name}</span>
                      <span style={{ fontSize: 11, opacity: 0.6 }}>
                        {isAdded ? "✓ Added" : `${board.items?.length || 0} items`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Create new board */}
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--muted)",
                marginBottom: 10,
              }}
            >
              {boards.length > 0 ? "Or create new" : "Create a board"}
            </div>
            {creating ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  autoFocus
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateAndAdd();
                    if (e.key === "Escape") setCreating(false);
                  }}
                  placeholder="Board name…"
                  style={{
                    flex: 1,
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    padding: "9px 12px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleCreateAndAdd}
                  style={{
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: 2,
                    padding: "9px 16px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                style={{
                  width: "100%",
                  border: "1px dashed var(--border)",
                  background: "transparent",
                  borderRadius: 2,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--muted)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                + New board
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
