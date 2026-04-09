/**
 * lib/saveProduct.js — Auralis save system
 *
 * Stores full product objects (not just IDs) in localStorage.
 * Key: "auralis_saved"  →  Array<ProductObject>
 *
 * All functions are synchronous and safe to call server-side (they guard
 * against the absence of window / localStorage with a try-catch).
 */

export const AURALIS_SAVED_KEY = "auralis_saved";

/** @returns {Array} Saved product objects, newest first */
export function getSavedProducts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AURALIS_SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persist the given array of products */
function _persist(products) {
  try {
    localStorage.setItem(AURALIS_SAVED_KEY, JSON.stringify(products));
  } catch {
    // Silently fail if storage is full or unavailable
  }
}

/**
 * Save a product.  No-op if already saved (matched by product.id).
 * Prepends to array so newest saved item appears first.
 * @returns {Array} Updated saved products array
 */
export function saveProduct(product) {
  const current = getSavedProducts();
  if (current.some((p) => p.id === product.id)) return current;
  const updated = [product, ...current];
  _persist(updated);
  return updated;
}

/**
 * Remove a saved product by id.
 * @returns {Array} Updated saved products array
 */
export function removeSavedProduct(productId) {
  const updated = getSavedProducts().filter((p) => p.id !== productId);
  _persist(updated);
  return updated;
}

/**
 * Toggle a product's saved state.
 * @returns {{ products: Array, added: boolean }}
 */
export function toggleSavedProduct(product) {
  const current = getSavedProducts();
  const alreadySaved = current.some((p) => p.id === product.id);
  const products = alreadySaved
    ? removeSavedProduct(product.id)
    : saveProduct(product);
  return { products, added: !alreadySaved };
}

/**
 * Check whether a product is currently saved.
 * @param {string|number} productId
 * @returns {boolean}
 */
export function isProductSaved(productId) {
  return getSavedProducts().some((p) => p.id === productId);
}
