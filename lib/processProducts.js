/**
 * lib/processProducts.js — Shared product pipeline
 *
 * Single source of truth for filtering, scoring, and sorting products.
 * Used by Shop, Edit, and DNA results — guarantees consistent behaviour.
 *
 * processProducts(products, dna, options)
 *   1. Hard-filter — strict AND logic: products must match DNA brands AND colours
 *   2. Score       — filtered pool scored for relevance (brand, colour, style, tags)
 *   3. Sort        — highest score first. Price sort overrides if user selects it.
 *   4. Filter      — user filter bar choices applied last (category, brand, etc.)
 *
 * All brand/colour comparisons are case-insensitive (lowercased before compare).
 * If AND filter yields zero results, falls back to the full product list.
 * Pass { hardFilterByDNA: true } to additionally filter by primaryStyle category
 * (used by the DNA results curated feed).
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

  // Brand match (+3) — case-insensitive, skip when allBrands = true
  if (!allBrands && brands.length) {
    const dnaBrandsLower = brands.map((b) => b.trim().toLowerCase());
    if (dnaBrandsLower.includes((product.brand || "").trim().toLowerCase())) score += 3;
  }

  // Colour match (+2) — case-insensitive
  if (colors.length) {
    const dnaColorsLower = colors.map((c) => c.trim().toLowerCase());
    if (dnaColorsLower.includes((product.color || "").trim().toLowerCase())) score += 2;
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

  // ── Step 1: DNA strict AND filter ────────────────────────────────────────
  // Brand AND colour must both match (case-insensitive).
  // If allBrands is set, brand filter is skipped entirely.
  // Falls back to full product list if the AND combination yields nothing.
  let pool = products;

  if (dna) {
    const rawBrands = dna.brands || [];
    const rawColors = dna.colors || [];
    const skipBrands = dna.allBrands || rawBrands.length === 0;

    const dnaBrands = rawBrands.map((b) => b.trim().toLowerCase());
    const dnaColors = rawColors.map((c) => c.trim().toLowerCase());

    const hasBrandFilter = !skipBrands && dnaBrands.length > 0;
    const hasColorFilter = dnaColors.length > 0;

    if (hasBrandFilter || hasColorFilter) {
      const andFiltered = products.filter((p) => {
        const productBrand = (p.brand || "").trim().toLowerCase();
        const productColor = (p.color || "").trim().toLowerCase();
        const brandOk = !hasBrandFilter || dnaBrands.includes(productBrand);
        const colorOk = !hasColorFilter || dnaColors.includes(productColor);
        return brandOk && colorOk;
      });
      // Fallback: if AND combo returns nothing, show full list
      pool = andFiltered.length ? andFiltered : products;
    }

    // Additional style-category filter for DNA curated feed (hardFilterByDNA only)
    if (hardFilterByDNA && dna.primaryStyle) {
      const styleCats = STYLE_CATEGORY_MAP[dna.primaryStyle] || [];
      if (styleCats.length) {
        const styleCatFiltered = pool.filter((p) => styleCats.includes(p.category));
        if (styleCatFiltered.length) pool = styleCatFiltered;
      }
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
