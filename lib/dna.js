/**
 * lib/dna.js — Auralis DNA core logic
 *
 * Owns the 5-step DNA quiz data, scoring engine, and persistence.
 * Compatible with applyPreferences() in lib/fetchProducts.js.
 */

import { STYLE_TYPES, BRAND_STYLE_MAP, COLOUR_STYLE_MAP } from "./styleDNA";

// ─── localStorage keys ────────────────────────────────────────────────────────

export const AURALIS_DNA_KEY = "auralis_dna";
export const AURALIS_BOARDS_KEY = "auralis_boards";

// ─── Step 1: Style vibes (image-based, multi-select max 3) ───────────────────

export const STYLE_OPTIONS = [
  {
    id: "minimal",
    label: "Minimal",
    desc: "Clean, understated, neutral",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    vibes: ["Minimal"],
    scores: { Minimal: 3 },
  },
  {
    id: "luxe",
    label: "Luxe",
    desc: "Elevated, polished, premium",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
    vibes: ["Luxe"],
    scores: { Luxe: 3 },
  },
  {
    id: "streetwear",
    label: "Streetwear",
    desc: "Urban, bold, expressive",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80",
    vibes: ["Streetwear"],
    scores: { Streetwear: 3 },
  },
  {
    id: "classic",
    label: "Classic",
    desc: "Timeless, tailored, refined",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    vibes: ["Classic"],
    scores: { Classic: 3 },
  },
  {
    id: "vintage",
    label: "Vintage",
    desc: "Nostalgic, retro, story-driven",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    vibes: ["Vintage"],
    scores: { Vintage: 3 },
  },
  {
    id: "sporty",
    label: "Sporty",
    desc: "Performance-inspired, casual",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
    vibes: ["Sporty"],
    scores: { Sporty: 3 },
  },
];

// ─── Step 2: Real-life outfit scenarios (image-based, multi-select) ───────────

export const OUTFIT_OPTIONS = [
  {
    id: "clean-casual",
    label: "Off-duty minimal",
    desc: "White tee, straight jeans, clean trainers",
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&q=80",
    scores: { Minimal: 3, Classic: 1 },
  },
  {
    id: "street-layer",
    label: "Street layers",
    desc: "Oversized hoodie, wide-leg cargos, chunky trainers",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80",
    scores: { Streetwear: 3, Vintage: 1 },
  },
  {
    id: "luxe-evening",
    label: "Elevated evening",
    desc: "Silk midi, tailored blazer, barely-there heels",
    image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=500&q=80",
    scores: { Luxe: 3, "Trend-led": 1 },
  },
  {
    id: "sharp-tailored",
    label: "Sharp & tailored",
    desc: "Wide-leg trousers, fitted top, structured bag",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80",
    scores: { Classic: 3, Luxe: 1 },
  },
  {
    id: "sporty-active",
    label: "Sporty & effortless",
    desc: "Co-ord set, sleek trainers, crossbody",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
    scores: { Sporty: 3, Streetwear: 1 },
  },
  {
    id: "vintage-mix",
    label: "Vintage & mixed",
    desc: "Flared jeans, printed blouse, platform boots",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    scores: { Vintage: 3, "Trend-led": 1 },
  },
];

// ─── Step 3: Shopping behaviour (affects scoring, not filters) ────────────────

export const SHOPPING_OPTIONS = [
  {
    id: "neutrals",
    label: "Stick to neutrals",
    desc: "I build around a core palette — rarely deviate from what works",
    scores: { Minimal: 2, Classic: 2, Luxe: 1 },
  },
  {
    id: "trend",
    label: "Trend-led pieces",
    desc: "I like staying ahead — seasonal pieces, editorial picks",
    scores: { "Trend-led": 3, Streetwear: 1 },
  },
  {
    id: "staples",
    label: "Invest in staples",
    desc: "I spend on quality things I'll wear for years",
    scores: { Classic: 3, Luxe: 2, Minimal: 1 },
  },
  {
    id: "mix",
    label: "Mix high & low",
    desc: "I blend investment pieces with accessible everyday finds",
    scores: { Vintage: 1, Minimal: 1, "Trend-led": 1, Streetwear: 1 },
  },
];

// ─── Step 4: Colour palettes (grouped, not individual swatches) ───────────────

export const COLOUR_GROUPS = [
  {
    id: "neutrals",
    label: "Neutrals",
    desc: "Black · White · Grey · Cream",
    colours: ["Black", "White", "Grey", "Cream"],
    swatches: ["#111111", "#f5f5f5", "#9e9e9e", "#f5f0e8"],
  },
  {
    id: "earth",
    label: "Earthy & Warm",
    desc: "Camel · Brown · Tan",
    colours: ["Camel", "Brown"],
    swatches: ["#c19a6b", "#795548", "#a0785a"],
  },
  {
    id: "navy-blue",
    label: "Navy & Denim",
    desc: "Navy · Blue · Indigo",
    colours: ["Navy", "Blue"],
    swatches: ["#1a2a4a", "#4a90d9", "#3d4b6e"],
  },
  {
    id: "rich-warm",
    label: "Rich & Deep",
    desc: "Burgundy · Red · Berry",
    colours: ["Burgundy", "Red"],
    swatches: ["#7b1c3e", "#c0392b", "#8b1a2e"],
  },
  {
    id: "soft-pastel",
    label: "Soft & Pastel",
    desc: "Pink · Blush · Powder",
    colours: ["Pink"],
    swatches: ["#f4a7b9", "#f2d0d0", "#e8b4c4"],
  },
  {
    id: "bold-fresh",
    label: "Bold & Fresh",
    desc: "Green · Cobalt · Citrus",
    colours: ["Green"],
    swatches: ["#4a7c59", "#1a5276", "#d4a017"],
  },
];

// ─── Step 5: Brands (with "All brands" option) ────────────────────────────────

export const BRAND_OPTIONS = [
  "Zara", "Arket", "COS", "Reformation", "Ganni",
  "Toteme", "& Other Stories", "Mango", "Reiss", "Burberry",
  "A.P.C.", "Ralph Lauren", "Levi's", "New Balance",
];

// ─── Style-based product recommendations (for DNA results banner) ─────────────

export const STYLE_RECOMMENDATIONS = {
  Minimal: [
    { label: "Structured outerwear", desc: "A tailored coat in camel or charcoal" },
    { label: "Straight-leg trousers", desc: "Neutral tones, clean silhouette" },
    { label: "Elevated white shirt", desc: "The wardrobe anchor — oversized or fitted" },
  ],
  Luxe: [
    { label: "Investment bag", desc: "A classic silhouette that holds its value" },
    { label: "Silk or satin midi", desc: "Evening-ready with minimal effort" },
    { label: "Premium knitwear", desc: "Cashmere blend in a neutral palette" },
  ],
  Classic: [
    { label: "Well-cut blazer", desc: "The cornerstone of any polished wardrobe" },
    { label: "Timeless trench coat", desc: "Tan or black — always relevant" },
    { label: "Pleated wide-leg trousers", desc: "Elevated everyday dressing" },
  ],
  Streetwear: [
    { label: "Statement hoodie", desc: "Graphic or tonal — always wearable" },
    { label: "Utility trousers", desc: "Cargo or parachute cut for urban edge" },
    { label: "Chunky-sole trainers", desc: "Elevated kicks to anchor any look" },
  ],
  Sporty: [
    { label: "Technical co-ord set", desc: "Sleek performance fabric for daily wear" },
    { label: "Knit or mesh training top", desc: "Layering anchor for active looks" },
    { label: "Clean white trainer", desc: "The versatile athletic foundation" },
  ],
  Vintage: [
    { label: "Wide-leg or flare denim", desc: "Retro silhouette, timeless feel" },
    { label: "Knit vest or cardigan", desc: "Layering piece with nostalgic charm" },
    { label: "Worn-in leather jacket", desc: "Characterful, forever cool" },
  ],
  "Trend-led": [
    { label: "Statement outerwear", desc: "Bold colour or silhouette to lead a look" },
    { label: "Print or texture piece", desc: "Fearless pairings, editorial energy" },
    { label: "Seasonal statement bag", desc: "The piece everyone wants this season" },
  ],
};

// ─── DNA computation ──────────────────────────────────────────────────────────

/**
 * Convert raw quiz answers into a structured DNA object.
 * Five-signal scoring pass:
 *   1. Style vibes     → direct style type match (+3 each)
 *   2. Outfits         → weighted per-outfit scores
 *   3. Shopping behav. → influences style weighting (not filters)
 *   4. Colour groups   → expanded to individual colours via COLOUR_STYLE_MAP
 *   5. Brands          → scored via BRAND_STYLE_MAP
 *
 * Output is fully compatible with applyPreferences() in lib/fetchProducts.js.
 */
export function computeDNA({
  styles = [],
  outfits = [],
  shopping = [],
  colours = [],
  brands = [],
} = {}) {
  // Initialise score buckets
  const scores = {};
  STYLE_TYPES.forEach((t) => (scores[t] = 0));

  // 1. Style vibe selections
  styles.forEach((id) => {
    const opt = STYLE_OPTIONS.find((o) => o.id === id);
    if (opt) {
      Object.entries(opt.scores).forEach(([style, pts]) => {
        if (scores[style] !== undefined) scores[style] += pts;
      });
    }
  });

  // 2. Outfit scenario selections
  outfits.forEach((id) => {
    const opt = OUTFIT_OPTIONS.find((o) => o.id === id);
    if (opt) {
      Object.entries(opt.scores).forEach(([style, pts]) => {
        if (scores[style] !== undefined) scores[style] += pts;
      });
    }
  });

  // 3. Shopping behaviour (influences weighting, not filters)
  shopping.forEach((id) => {
    const opt = SHOPPING_OPTIONS.find((o) => o.id === id);
    if (opt) {
      Object.entries(opt.scores).forEach(([style, pts]) => {
        if (scores[style] !== undefined) scores[style] += pts;
      });
    }
  });

  // 4. Colour palette selections → expand to individual colour names
  const expandedColours = [
    ...new Set(
      colours.flatMap((groupId) => {
        const group = COLOUR_GROUPS.find((g) => g.id === groupId);
        return group ? group.colours : [];
      })
    ),
  ];
  expandedColours.forEach((colour) => {
    (COLOUR_STYLE_MAP[colour] || []).forEach((style, i) => {
      if (scores[style] !== undefined) scores[style] += i === 0 ? 2 : 1;
    });
  });

  // 5. Brand selections (skip scoring for "All brands" sentinel)
  const allBrands = brands.includes("All brands");
  const filteredBrands = allBrands ? [] : brands;

  filteredBrands.forEach((brand) => {
    (BRAND_STYLE_MAP[brand] || []).forEach((style, i) => {
      if (scores[style] !== undefined) scores[style] += i === 0 ? 2 : 1;
    });
  });

  // Rank and pick top 2 styles
  const ranked = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort(([, a], [, b]) => b - a);

  const primaryStyle = ranked[0]?.[0] || "Minimal";
  const secondaryStyle = ranked[1]?.[0] || null;

  // Vibes array (for applyPreferences compatibility)
  const vibes = [
    ...new Set(
      styles.flatMap((id) => {
        const opt = STYLE_OPTIONS.find((o) => o.id === id);
        return opt ? opt.vibes : [];
      })
    ),
  ];

  // Palette display label (first selected group)
  const paletteType =
    colours.length > 0
      ? (COLOUR_GROUPS.find((g) => g.id === colours[0])?.label ?? "")
      : "";

  return {
    // ── Fields required by applyPreferences() ─────────────────────────────────
    primaryStyle,
    secondaryStyle,
    vibes,
    colors: expandedColours,     // individual colour names for product matching
    brands: filteredBrands,      // empty when allBrands = true
    stores: [],
    sizes: [],

    // ── Structured quiz data ──────────────────────────────────────────────────
    styles,                      // raw style vibe IDs from step 1
    outfits,                     // raw outfit IDs from step 2
    shopping,                    // raw shopping behaviour IDs from step 3
    paletteGroups: colours,      // raw colour group IDs from step 4
    paletteType,                 // display label of first selected colour group
    allBrands,                   // true → brand filtering disabled in shop
    scores,                      // full style score map (debug / insights)

    // ── Pre-built filter object ───────────────────────────────────────────────
    filters: {
      brands: filteredBrands,    // empty when allBrands = true
      colours: expandedColours,
      styles: [primaryStyle, secondaryStyle].filter(Boolean),
    },
  };
}

// ─── Merge helper ─────────────────────────────────────────────────────────────

/**
 * Merge auralis_dna into an existing preferences object.
 * If auralis.allBrands is true, brand filtering is skipped entirely.
 */
export function mergeWithAuralisDNA(base, auralis) {
  if (!auralis) return base;
  return {
    ...base,
    vibes: [...new Set([...(base.vibes || []), ...(auralis.vibes || [])])],
    // If user selected "All brands", don't apply brand filtering
    brands: auralis.allBrands
      ? []
      : [...new Set([...(base.brands || []), ...(auralis.brands || [])])],
    colors: [...new Set([...(base.colors || []), ...(auralis.colors || [])])],
    stores: [...new Set([...(base.stores || []), ...(auralis.stores || [])])],
    primaryStyle: base.primaryStyle || auralis.primaryStyle || null,
    secondaryStyle: base.secondaryStyle || auralis.secondaryStyle || null,
    allBrands: auralis.allBrands || false,
  };
}

// ─── localStorage: Auralis DNA ────────────────────────────────────────────────

export function loadAuralisDNA() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(AURALIS_DNA_KEY) || "null");
  } catch {
    return null;
  }
}

/**
 * Persist DNA to localStorage.
 * Pass null to clear (used by retake flow).
 */
export function saveAuralisDNA(dna) {
  if (typeof window === "undefined") return;
  if (dna === null || dna === undefined) {
    window.localStorage.removeItem(AURALIS_DNA_KEY);
  } else {
    window.localStorage.setItem(AURALIS_DNA_KEY, JSON.stringify(dna));
  }
}

/** Remove DNA entirely — used by quiz retake. */
export function removeAuralisDNA() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AURALIS_DNA_KEY);
}

// ─── localStorage: Boards ─────────────────────────────────────────────────────

export function loadBoards() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(AURALIS_BOARDS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBoards(boards) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AURALIS_BOARDS_KEY, JSON.stringify(boards));
}

export function createBoard(name) {
  const board = {
    id: `board_${Date.now()}`,
    name: name.trim() || "My Board",
    items: [],
    createdAt: new Date().toISOString(),
  };
  saveBoards([...loadBoards(), board]);
  return board;
}

export function addProductToBoard(boardId, productId) {
  const updated = loadBoards().map((b) =>
    b.id === boardId && !b.items.includes(productId)
      ? { ...b, items: [...b.items, productId] }
      : b
  );
  saveBoards(updated);
  return updated;
}

export function removeProductFromBoard(boardId, productId) {
  const updated = loadBoards().map((b) =>
    b.id === boardId
      ? { ...b, items: b.items.filter((id) => id !== productId) }
      : b
  );
  saveBoards(updated);
  return updated;
}

export function deleteBoard(boardId) {
  const updated = loadBoards().filter((b) => b.id !== boardId);
  saveBoards(updated);
  return updated;
}
