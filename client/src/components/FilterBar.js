import React, { useState } from "react";

const PRICE_OPTIONS = ["", "50", "100", "200", "500"];
const PRICE_LABELS = { "": "Any price", "50": "Under £50", "100": "Under £100", "200": "Under £200", "500": "Under £500" };

export default function FilterBar({ filters, onFilterChange, categories, colors, brands, resultCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearAll = () => {
    onFilterChange("category", "");
    onFilterChange("color", "");
    onFilterChange("brand", "");
    onFilterChange("maxPrice", "");
    onFilterChange("vibe", "");
  };

  const selectStyle = {
    appearance: "none",
    WebkitAppearance: "none",
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "7px 28px 7px 10px",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.04em",
    color: "#111",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23111' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    minWidth: 120,
  };

  return (
    <div style={{
      borderBottom: "1px solid var(--border)",
      background: "#fff",
      position: "sticky",
      top: "calc(var(--nav-height) + var(--subnav-height))",
      zIndex: 90,
    }}>
      <div style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}>
        {/* Result count */}
        <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4, whiteSpace: "nowrap" }}>
          {resultCount} items
        </span>

        {/* Desktop filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }} className="desktop-filters">
          <div style={{ position: "relative" }}>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              style={selectStyle}
            >
              <option value="">Category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={filters.color}
              onChange={(e) => onFilterChange("color", e.target.value)}
              style={selectStyle}
            >
              <option value="">Colour</option>
              {colors.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange("brand", e.target.value)}
              style={selectStyle}
            >
              <option value="">Brand</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              style={selectStyle}
            >
              {PRICE_OPTIONS.map((p) => (
                <option key={p} value={p}>{PRICE_LABELS[p]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "underline",
              whiteSpace: "nowrap",
            }}
          >
            Clear ({activeFilterCount})
          </button>
        )}

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-filter-btn"
          style={{
            display: "none",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.04em",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "7px 12px",
            color: "#111",
          }}
        >
          Filter
          {activeFilterCount > 0 && (
            <span style={{
              background: "#111",
              color: "#fff",
              borderRadius: 1,
              fontSize: 10,
              fontWeight: 600,
              padding: "1px 5px",
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileOpen && (
        <div className="mobile-filter-panel" style={{
          padding: "12px 24px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <select value={filters.category} onChange={(e) => onFilterChange("category", e.target.value)} style={{ ...selectStyle, width: "100%" }}>
            <option value="">Category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.color} onChange={(e) => onFilterChange("color", e.target.value)} style={{ ...selectStyle, width: "100%" }}>
            <option value="">Colour</option>
            {colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.brand} onChange={(e) => onFilterChange("brand", e.target.value)} style={{ ...selectStyle, width: "100%" }}>
            <option value="">Brand</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filters.maxPrice} onChange={(e) => onFilterChange("maxPrice", e.target.value)} style={{ ...selectStyle, width: "100%" }}>
            {PRICE_OPTIONS.map((p) => <option key={p} value={p}>{PRICE_LABELS[p]}</option>)}
          </select>
          {activeFilterCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "underline", textAlign: "left" }}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-filters { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
