/**
 * lib/dna.js — Auralis DNA core logic
 *
 * Completely separate from lib/styleDNA.js (the style-type scoring engine).
 * This module owns:
 *  - auralis_dna  localStorage key  (quiz → preferences object)
 *  - auralis_boards localStorage key (boards / collections)
 *  - Helper to merge auralis_dna into the existing applyPreferences shape
 */

// ─── localStorage keys ────────────────────────────────────────────────────────

export const AURALIS_DNA_KEY = "auralis_dna";
export const AURALIS_BOARDS_KEY = "auralis_boards";

// ─── Quiz option data ─────────────────────────────────────────────────────────

export const STYLE_OPTIONS = [
  {
    id: "minimal",
    label: "Minimal",
    desc: "Clean, understated, neutral",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    vibes: ["Minimal"],
  },
  {
    id: "luxe",
    label: "Luxe",
    desc: "Elevated, polished, premium",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
    vibes: ["Luxe"],
  },
  {
    id: "streetwear",
    label: "Streetwear",
    desc: "Urban, bold, expressive",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80",
    vibes: ["Streetwear"],
  },
  {
    id: "classic",
    label: "Classic",
    desc: "Timeless, tailored, refined",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    vibes: ["Classic"],
  },
  {
    id: "vintage",
    label: "Vintage",
    desc: "Nostalgic, retro, story-driven",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    vibes: ["Vintage"],
  },
  {
    id: "sporty",
    label: "Sporty",
    desc: "Performance-inspired, casual",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
    vibes: ["Sporty"],
  },
];

export const COLOUR_OPTIONS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Cream", hex: "#f5f0e8" },
  { name: "Navy", hex: "#1a2a4a" },
  { name: "Camel", hex: "#c19a6b" },
  { name: "Grey", hex: "#9e9e9e" },
  { name: "Pink", hex: "#f4a7b9" },
  { name: "Green", hex: "#4a7c59" },
  { name: "Blue", hex: "#4a90d9" },
  { name: "Red", hex: "#c0392b" },
  { name: "Brown", hex: "#795548" },
  { name: "Burgundy", hex: "#7b1c3e" },
];

export const BRAND_OPTIONS = [
  "Zara", "Arket", "COS", "Reformation", "Ganni",
  "Toteme", "& Other Stories", "Mango", "Reiss", "Burberry",
  "A.P.C.", "Ralph Lauren", "Levi's", "New Balance",
];

// ─── DNA computation ──────────────────────────────────────────────────────────

/**
 * Convert raw quiz answers into a DNA object.
 * The resulting shape is fully compatible with applyPreferences().
 */
export function computeDNA({ styles = [], colors = [], brands = [] }) {
  const vibes = [
    ...new Set(
      styles.flatMap((id) => {
        const opt = STYLE_OPTIONS.find((o) => o.id === id);
        return opt ? opt.vibes : [];
      })
    ),
  ];

  return {
    primaryStyle: vibes[0] || null,
    secondaryStyle: vibes[1] || null,
    vibes,
    colors,
    brands,
    stores: [],
    sizes: [],
  };
}

/**
 * Merge auralis_dna into an existing preferences object.
 * Used in the shop page to combine both DNA sources without overwriting either.
 */
export function mergeWithAuralisDNA(base, auralis) {
  if (!auralis) return base;
  return {
    ...base,
    vibes: [...new Set([...(base.vibes || []), ...(auralis.vibes || [])])],
    brands: [...new Set([...(base.brands || []), ...(auralis.brands || [])])],
    colors: [...new Set([...(base.colors || []), ...(auralis.colors || [])])],
    stores: [...new Set([...(base.stores || []), ...(auralis.stores || [])])],
    primaryStyle: base.primaryStyle || auralis.primaryStyle || null,
    secondaryStyle: base.secondaryStyle || auralis.secondaryStyle || null,
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

export function saveAuralisDNA(dna) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AURALIS_DNA_KEY, JSON.stringify(dna));
}

// ─── localStorage: Boards ────────────────────────────────────────────────────

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
