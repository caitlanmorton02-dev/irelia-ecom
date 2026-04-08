export const SAVED_KEY = "irelia_saved";
export const PREFS_KEY = "irelia_preferences";
export const STYLE_DNA_KEY = "irelia_style_dna";
export const RECENT_KEY = "irelia_recent";

// ─── Saved IDs ───────────────────────────────────────────────────────────────

export function loadSavedIds() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSavedIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

// ─── Style DNA (source of truth for personalisation) ─────────────────────────

function defaultDNA() {
  return { stores: [], brands: [], vibes: [], colors: [], sizes: [], fit: "" };
}

export function loadStyleDNA() {
  if (typeof window === "undefined") return defaultDNA();
  try {
    const stored = JSON.parse(window.localStorage.getItem(STYLE_DNA_KEY) || "null");
    if (stored) return { ...defaultDNA(), ...stored };
    // Migrate from old preferences key
    const legacy = JSON.parse(window.localStorage.getItem(PREFS_KEY) || "null");
    if (legacy) return { ...defaultDNA(), ...legacy };
    return defaultDNA();
  } catch {
    return defaultDNA();
  }
}

export function saveStyleDNA(dna) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STYLE_DNA_KEY, JSON.stringify(dna));
  // Keep old key in sync for backwards compat
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(dna));
}

// ─── Legacy preferences (maps to Style DNA) ───────────────────────────────────

export function loadPreferences() {
  return loadStyleDNA();
}

export function savePreferences(preferences) {
  saveStyleDNA(preferences);
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

export function loadRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId) {
  if (typeof window === "undefined") return;
  try {
    const recent = loadRecentlyViewed();
    const next = [productId, ...recent.filter((id) => id !== productId)].slice(0, 12);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
