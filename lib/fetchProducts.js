import { STYLE_CATEGORY_MAP } from "./styleDNA";

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
  return [...new Set(products.map((p) => p[key]).filter(Boolean))].sort();
}

/**
 * Score and sort products based on Style DNA.
 * Scoring:
 *   +3 — brand match
 *   +3 — retailer/store match
 *   +2 — colour match
 *   +2 — category aligns with primaryStyle
 *   +1 — category aligns with secondaryStyle
 *   +1 — vibe matches category or title
 */
export function applyPreferences(products, preferences) {
  if (!preferences) return products;

  const stores = preferences.stores || [];
  const brands = preferences.brands || [];
  const colors = preferences.colors || [];
  const vibes = preferences.vibes || [];
  const primaryStyle = preferences.primaryStyle || null;
  const secondaryStyle = preferences.secondaryStyle || null;

  const hasPrefs =
    stores.length ||
    brands.length ||
    colors.length ||
    vibes.length ||
    primaryStyle;

  if (!hasPrefs) return products;

  const primaryCats = primaryStyle ? STYLE_CATEGORY_MAP[primaryStyle] || [] : [];
  const secondaryCats = secondaryStyle ? STYLE_CATEGORY_MAP[secondaryStyle] || [] : [];

  const scoreProduct = (product) => {
    let score = 0;
    if (brands.includes(product.brand)) score += 3;
    if (stores.includes(product.retailer)) score += 3;
    if (colors.includes(product.color)) score += 2;
    if (primaryCats.includes(product.category)) score += 2;
    else if (secondaryCats.includes(product.category)) score += 1;
    if (
      vibes.some(
        (vibe) =>
          (product.category || "").toLowerCase().includes(vibe.toLowerCase()) ||
          (product.title || "").toLowerCase().includes(vibe.toLowerCase())
      )
    )
      score += 1;
    return score;
  };

  return [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
}
