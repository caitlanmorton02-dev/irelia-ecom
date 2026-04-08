export const SAVED_KEY = "irelia_saved";
export const PREFS_KEY = "irelia_preferences";

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

export function loadPreferences() {
  if (typeof window === "undefined") return { stores: [], vibes: [], colors: [], sizes: [] };
  try {
    return (
      JSON.parse(window.localStorage.getItem(PREFS_KEY) || "null") || {
        stores: [],
        vibes: [],
        colors: [],
        sizes: [],
      }
    );
  } catch {
    return { stores: [], vibes: [], colors: [], sizes: [] };
  }
}

export function savePreferences(preferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
}
