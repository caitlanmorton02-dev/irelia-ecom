/**
 * lib/processProducts.js — Shared product pipeline
 *
 * Single source of truth for filtering, scoring, and sorting products.
 * Used by Shop, Edit, and DNA results — guarantees consistent behaviour.
 *
 * processProducts(products, dna, options)
 *   1. Score  — every product gets a relevance score against DNA
 *   2. Sort   — highest score first (DNA order). Price sort overrides if set.
 *   3. Filter — hard-filter by user-selected filter bar values
 *
 * DNA scoring is always soft (never hides products, only reorders).
 * Hard filtering is always driven by the user's explicit filter bar choices.
 *
 * For the DNA results "curated" feed, pass { hardFilterByDNA: true } to
 * additionally restrict the pool to products with at least one DNA match
 * before scoring. Falls back to the full set if nothing matches.
 */

import { STYLE_CATEGORY_MAP } from "./styleDNA";

// ─── Price parser (mirrors fetchProducts.js) ──────────────────────────────────

function parsePrice(value) {
  return Number(String(value).replace(/[^\d.]/g, "")) || 0;
}

// ─── Score a single product against DNA ──────────────────────────────────────

/**
 * Returns a numeric score for how well a product matches the user's DNA.
 *
 * Weights (per spec):
 *   +3 — brand in dna.brands (skipped when allBrands = true)
 *   +2 — colour matches dna.colors
 *   +3 — category aligns with primaryStyle
 *   +1 — category aligns with secondaryStyle
 *   +1 — vibe match (title / category text contains a dna vibe)
 *
 * Scores stack: a product can score up to 10 if it ticks every signal.
 */
export function scoreProduct(product, dna) {
  if (!dna) return 0;

  const {
    primaryStyle = null,
    secondaryStyle = null,
    brands = [],
    colors = [],
    vibes = [],
    allBrands = false,
  } = dna;

  let score = 0;

  // Brand match (+3) — skip entirely when user picked "All brands"
  if (!allBrands && brands.length && brands.includes(product.brand)) {
    score += 3;
  }

  // Colour match (+2)
  if (colors.length && colors.includes(product.color)) {
    score += 2;
  }

  // Primary style category match (+3)
  const primaryCats = primaryStyle ? STYLE_CATEGORY_MAP[primaryStyle] || [] : [];
  if (primaryCats.includes(product.category)) {
    score += 3;
  } else {
    // Secondary style category match (+1) — only when primary doesn't match
    const secondaryCats = secondaryStyle ? STYLE_CATEGORY_MAP[secondaryStyle] || [] : [];
    if (secondaryCats.includes(product.category)) {
      score += 1;
    }
  }

  // Tag match (+2 primary / +1 secondary) — direct style-type alignment
  // Tags are lowercase style identifiers: "minimal" | "luxe" | "streetwear" | "classic" | "sporty"
  const TAG_STYLE_MAP = {
    minimal: "Minimal",
    luxe: "Luxe",
    streetwear: "Streetwear",
    classic: "Classic",
    sporty: "Sporty",
  };
  if (product.tags?.length) {
    product.tags.forEach((tag) => {
      const styleType = TAG_STYLE_MAP[tag];
      if (!styleType) return;
      if (styleType === primaryStyle) score += 2;
      else if (styleType === secondaryStyle) score += 1;
    });
  }

  // Vibe text match (+1) — loose fallback on product title or category
  if (vibes.length) {
    const haystack = `${product.title || product.name || ""} ${product.category || ""}`.toLowerCase();
    if (vibes.some((v) => haystack.includes(v.toLowerCase()))) {
      score += 1;
    }
  }

  return score;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

/**
 * @param {Array}   products         — Raw product list from API
 * @param {Object}  dna              — Merged DNA object (from mergeWithAuralisDNA or loadAuralisDNA)
 * @param {Object}  [options]
 * @param {Object}  [options.filters]           — User filter bar state { category, color, brand, retailer, maxPrice }
 * @param {string}  [options.sort]              — Sort override: "price-low" | "price-high" | "new"
 * @param {string}  [options.navCategory]       — URL nav category key (maps to multiple categories)
 * @param {Object}  [options.navCategoryMap]    — Map of nav key → category array
 * @param {boolean} [options.hardFilterByDNA]   — DNA results mode: pre-filter by DNA match
 * @param {number}  [options.limit]             — Max products to return (used by DNA feed)
 * @returns {Array} Processed product list
 */
export function processProducts(products, dna, options = {}) {
  if (!products?.length) return [];

  const {
    filters = {},
    sort = "new",
    navCategory = "",
    navCategoryMap = {},
    hardFilterByDNA = false,
    limit = 0,
  } = options;

  // ── Step 1: Optional DNA hard-filter (curated feed only) ──────────────────
  let pool = products;

  if (hardFilterByDNA && dna) {
    const { brands = [], colors = [], primaryStyle = null, allBrands = false } = dna;
    const styleCats = primaryStyle ? STYLE_CATEGORY_MAP[primaryStyle] || [] : [];
    const hasFilters =
      (!allBrands && brands.length) || colors.length || styleCats.length;

    if (hasFilters) {
      const filtered = products.filter(
        (p) =>
          (!allBrands && brands.length && brands.includes(p.brand)) ||
          (colors.length && colors.includes(p.color)) ||
          (styleCats.length && styleCats.includes(p.category))
      );
      // Fall back to full pool if nothing matched
      pool = filtered.length ? filtered : products;
    }
  }

  // ── Step 2: Score every product ───────────────────────────────────────────
  const hasDNA = !!(
    dna &&
    (dna.primaryStyle || (dna.colors || []).length || (dna.brands || []).length)
  );

  let result;
  if (hasDNA) {
    // Stable sort: score desc, preserve original index for ties
    result = pool
      .map((product, idx) => ({ product, score: scoreProduct(product, dna), idx }))
      .sort((a, b) => b.score - a.score || a.idx - b.idx)
      .map(({ product }) => product);
  } else {
    // No DNA — keep original order
    result = [...pool];
  }

  // ── Step 3: Nav category filter (URL-driven, multi-category) ─────────────
  if (navCategory && navCategoryMap[navCategory]) {
    result = result.filter((p) =>
      navCategoryMap[navCategory].includes(p.category)
    );
  }

  // ── Step 4: User filter bar (hard filters) ────────────────────────────────
  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (filters.color) result = result.filter((p) => p.color === filters.color);
  if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
  if (filters.retailer) result = result.filter((p) => p.retailer === filters.retailer);
  if (filters.maxPrice) {
    result = result.filter((p) => parsePrice(p.price) <= Number(filters.maxPrice));
  }

  // ── Step 5: Price sort override (user-selected) ───────────────────────────
  if (sort === "price-low") {
    result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sort === "price-high") {
    result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  // ── Step 6: Limit (DNA curated feed) ─────────────────────────────────────
  if (limit > 0) result = result.slice(0, limit);

  return result;
}
