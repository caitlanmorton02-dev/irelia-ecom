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

export function applyPreferences(products, preferences) {
  if (!preferences) return products;

  const hasPrefs =
    (preferences.stores || []).length ||
    (preferences.vibes || []).length ||
    (preferences.colors || []).length;

  if (!hasPrefs) return products;

  const scoreProduct = (product) => {
    let score = 0;
    if ((preferences.stores || []).includes(product.retailer)) score += 3;
    if ((preferences.colors || []).includes(product.color)) score += 2;
    if ((preferences.vibes || []).some((vibe) => product.category.toLowerCase().includes(vibe.toLowerCase()))) score += 1;
    return score;
  };

  return [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
}
