"use client";

export default function FilterBar({
  filters,
  setFilters,
  categories,
  colors,
  brands,
  retailers,
  sort,
  setSort,
}) {
  const inputStyle = { border: "1px solid var(--border)", borderRadius: 2, padding: "8px 10px", fontSize: 12, background: "#fff" };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
      <select value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} style={inputStyle}>
        <option value="">Category</option>
        {categories.map((value) => <option key={value}>{value}</option>)}
      </select>
      <select value={filters.color} onChange={(e) => setFilters((prev) => ({ ...prev, color: e.target.value }))} style={inputStyle}>
        <option value="">Colour</option>
        {colors.map((value) => <option key={value}>{value}</option>)}
      </select>
      <select value={filters.brand} onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))} style={inputStyle}>
        <option value="">Brand</option>
        {brands.map((value) => <option key={value}>{value}</option>)}
      </select>
      <select value={filters.retailer} onChange={(e) => setFilters((prev) => ({ ...prev, retailer: e.target.value }))} style={inputStyle}>
        <option value="">Retailer</option>
        {retailers.map((value) => <option key={value}>{value}</option>)}
      </select>
      <input
        type="number"
        min="0"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
        style={{ ...inputStyle, width: 110 }}
      />
      <select value={sort} onChange={(e) => setSort(e.target.value)} style={inputStyle}>
        <option value="new">New in</option>
        <option value="price-low">Price low-high</option>
        <option value="price-high">Price high-low</option>
      </select>
    </div>
  );
}
