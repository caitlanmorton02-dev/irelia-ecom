export async function fetchProducts() {
  const response = await fetch("/api/products", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const data = await response.json();
  return data.products || [];
}

export function parsePrice(value) {
  return Number(String(value).replace(/[^\d.]/g, "")) || 0;
}

export function getUniqueValues(products, key) {
  return [...new Set(products.map((product) => product[key]).filter(Boolean))].sort();
}

/**
 * Score and sort products based on Style DNA preferences.
 * Scoring:
 *   +3 — retailer/store match
 *   +3 — brand match
 *   +2 — colour match
 *   +1 — vibe matches category or title
 */
export function applyPreferences(products, preferences) {
  if (!preferences) return products;

  const stores = preferences.stores || [];
  const brands = preferences.brands || [];
  const colors = preferences.colors || [];
  const vibes = preferences.vibes || [];

  const hasPrefs = stores.length || brands.length || colors.length || vibes.length;
  if (!hasPrefs) return products;

  const scoreProduct = (product) => {
    let score = 0;
    if (stores.includes(product.retailer)) score += 3;
    if (brands.includes(product.brand)) score += 3;
    if (colors.includes(product.color)) score += 2;
    if (
      vibes.some((vibe) =>
        (product.category || "").toLowerCase().includes(vibe.toLowerCase()) ||
        (product.title || "").toLowerCase().includes(vibe.toLowerCase())
      )
    )
      score += 1;
    return score;
  };

  return [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
}
