// ─── Style types ──────────────────────────────────────────────────────────────

export const STYLE_TYPES = [
  "Minimal",
  "Streetwear",
  "Luxe",
  "Classic",
  "Trend-led",
  "Sporty",
  "Vintage",
];

export const STYLE_DESCRIPTIONS = {
  Minimal:
    "Clean silhouettes, neutral tones, and elevated basics. Less is always more.",
  Streetwear:
    "Bold, oversized and expressive with an urban edge. You make the rules.",
  Luxe:
    "Elevated refinement, premium materials, and effortless polish. Quiet luxury, loud impact.",
  Classic:
    "Timeless tailoring, structured cuts, and enduring style. Forever in fashion.",
  "Trend-led":
    "Always ahead of the curve. Bold prints, statement pieces, and fearless fashion.",
  Sporty:
    "Performance-inspired looks that move with you. Function meets serious style.",
  Vintage:
    "Retro-inspired pieces with a nostalgic, timeless appeal. Style that tells a story.",
};

// Maps style type → product categories it aligns with
export const STYLE_CATEGORY_MAP = {
  Minimal: ["Tops", "Trousers", "Dresses", "Knitwear", "Skirts"],
  Luxe: ["Bags", "Coats & Jackets", "Shoes", "Accessories", "Dresses"],
  Classic: ["Coats & Jackets", "Trousers", "Knitwear", "Tops", "Jeans"],
  Streetwear: ["Jeans", "Tops", "Shoes", "Coats & Jackets", "Accessories"],
  Sporty: ["Shoes", "Tops", "Shorts", "Accessories"],
  Vintage: ["Jeans", "Coats & Jackets", "Skirts", "Dresses", "Tops"],
  "Trend-led": ["Dresses", "Tops", "Skirts", "Accessories", "Bags"],
};

// ─── Brand → style affinities ─────────────────────────────────────────────────

export const BRAND_STYLE_MAP = {
  Zara: ["Minimal", "Trend-led"],
  Arket: ["Minimal", "Classic"],
  COS: ["Minimal", "Classic"],
  Reformation: ["Luxe", "Minimal"],
  Ganni: ["Trend-led", "Vintage"],
  Toteme: ["Minimal", "Luxe"],
  "& Other Stories": ["Minimal", "Classic"],
  Mango: ["Classic", "Trend-led"],
  Reiss: ["Classic", "Luxe"],
  Burberry: ["Classic", "Luxe"],
  "A.P.C.": ["Minimal", "Luxe"],
  "Ralph Lauren": ["Classic", "Luxe"],
  "Polo Ralph Lauren": ["Classic", "Luxe"],
  "Levi's": ["Vintage", "Streetwear"],
  "New Balance": ["Sporty", "Streetwear"],
  "ASOS Design": ["Trend-led"],
  PLT: ["Trend-led"],
  Boohoo: ["Trend-led"],
  Nike: ["Sporty"],
  Adidas: ["Sporty", "Streetwear"],
  "John Smedley": ["Classic", "Luxe"],
  "Johnstons of Elgin": ["Classic", "Luxe"],
  "Kurt Geiger": ["Luxe", "Trend-led"],
  Missoma: ["Minimal", "Luxe"],
  Weekday: ["Streetwear", "Vintage"],
  Monki: ["Streetwear", "Trend-led"],
  Ghost: ["Minimal", "Classic"],
  Whistles: ["Classic", "Minimal"],
  CLUSE: ["Minimal", "Classic"],
  Agolde: ["Minimal", "Vintage"],
  GANNI: ["Trend-led", "Vintage"],
  Topshop: ["Trend-led"],
  "Diane von Furstenberg": ["Luxe", "Trend-led"],
  Chanel: ["Luxe", "Classic"],
};

// ─── Store → style affinities ─────────────────────────────────────────────────

const STORE_STYLE_MAP = {
  Zara: ["Minimal", "Trend-led"],
  PLT: ["Trend-led"],
  Boohoo: ["Trend-led"],
  Selfridges: ["Luxe", "Classic"],
  "Net-a-Porter": ["Luxe"],
  Mango: ["Classic", "Minimal"],
  COS: ["Minimal", "Classic"],
  MATCHESFASHION: ["Luxe"],
  "John Lewis": ["Classic"],
  "Mr Porter": ["Classic", "Luxe"],
  ASOS: ["Trend-led", "Streetwear"],
  "JD Sports": ["Sporty", "Streetwear"],
  "Dune London": ["Luxe", "Classic"],
};

// ─── Colour → style affinities ────────────────────────────────────────────────

export const COLOUR_STYLE_MAP = {
  Black: ["Minimal", "Luxe", "Streetwear"],
  White: ["Minimal", "Classic"],
  Cream: ["Minimal", "Luxe", "Classic"],
  Navy: ["Classic", "Minimal"],
  Camel: ["Classic", "Minimal", "Luxe"],
  Grey: ["Minimal", "Classic"],
  Pink: ["Trend-led", "Sporty"],
  Green: ["Vintage", "Trend-led"],
  Blue: ["Classic", "Streetwear", "Vintage"],
  Red: ["Trend-led", "Vintage"],
  Brown: ["Vintage", "Classic"],
  Burgundy: ["Vintage", "Luxe"],
  Indigo: ["Vintage", "Streetwear"],
  Sage: ["Minimal", "Vintage"],
  Tan: ["Classic", "Luxe"],
  Nude: ["Minimal", "Luxe"],
  Gold: ["Luxe", "Trend-led"],
  Silver: ["Minimal", "Luxe"],
  Champagne: ["Luxe", "Minimal"],
};

// ─── Fit → style affinities ───────────────────────────────────────────────────

const FIT_STYLE_MAP = {
  oversized: { Streetwear: 3, Vintage: 2, "Trend-led": 1 },
  tailored: { Classic: 3, Luxe: 2, Minimal: 1 },
  relaxed: { Minimal: 3, Vintage: 1 },
  fitted: { "Trend-led": 3, Luxe: 2, Sporty: 1 },
};

// ─── Core scoring function ────────────────────────────────────────────────────

export function scoreQuizAnswers({ vibes = [], brands = [], colors = [], fit = "", stores = [] }) {
  const scores = {};
  STYLE_TYPES.forEach((t) => (scores[t] = 0));

  // Outfit vibes (each directly maps to a style type with a strong signal)
  vibes.forEach((vibe) => {
    if (scores[vibe] !== undefined) scores[vibe] += 3;
  });

  // Brands
  brands.forEach((brand) => {
    (BRAND_STYLE_MAP[brand] || []).forEach((style, i) => {
      scores[style] = (scores[style] || 0) + (i === 0 ? 2 : 1);
    });
  });

  // Stores
  stores.forEach((store) => {
    (STORE_STYLE_MAP[store] || []).forEach((style, i) => {
      scores[style] = (scores[style] || 0) + (i === 0 ? 1 : 0);
    });
  });

  // Colors
  colors.forEach((color) => {
    (COLOUR_STYLE_MAP[color] || []).forEach((style, i) => {
      scores[style] = (scores[style] || 0) + (i === 0 ? 2 : 1);
    });
  });

  // Fit
  if (fit && FIT_STYLE_MAP[fit]) {
    Object.entries(FIT_STYLE_MAP[fit]).forEach(([style, pts]) => {
      scores[style] = (scores[style] || 0) + pts;
    });
  }

  // Sort highest to lowest
  const ranked = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort(([, a], [, b]) => b - a);

  const primary = ranked[0]?.[0] || "Minimal";
  const secondary = ranked[1]?.[0] || null;

  return { primary, secondary, scores };
}

// ─── DNA label + description ──────────────────────────────────────────────────

export function generateDNALabel(primary, secondary) {
  return secondary ? `${primary} ${secondary}` : primary;
}

const COMBO_DESCRIPTIONS = {
  "Minimal+Luxe":
    "You prefer clean silhouettes and elevated basics with a premium, polished finish.",
  "Minimal+Classic":
    "Timeless simplicity defines your style — clean cuts and enduring pieces.",
  "Minimal+Streetwear":
    "You balance minimal restraint with bold, urban expression.",
  "Minimal+Vintage":
    "Considered classics with a nostalgic, story-driven edge.",
  "Luxe+Classic":
    "Refined elegance with impeccable tailoring and premium materials.",
  "Luxe+Trend-led":
    "You invest in quality but always stay ahead of what's next.",
  "Classic+Luxe":
    "Timeless sophistication with a premium edge that never dates.",
  "Streetwear+Sporty":
    "Urban meets athletic — bold, comfortable and always on-trend.",
  "Streetwear+Vintage":
    "Retro-influenced street style with real cultural edge.",
  "Trend-led+Streetwear":
    "You're always ahead of the curve with bold, expressive looks.",
  "Vintage+Minimal":
    "Nostalgic pieces reimagined with a clean, considered approach.",
  "Sporty+Minimal":
    "Performance-ready with a clean, stripped-back aesthetic.",
};

export function generateDNADescription(primary, secondary) {
  if (!secondary) return STYLE_DESCRIPTIONS[primary] || "";
  const key = `${primary}+${secondary}`;
  const reverseKey = `${secondary}+${primary}`;
  return (
    COMBO_DESCRIPTIONS[key] ||
    COMBO_DESCRIPTIONS[reverseKey] ||
    `${STYLE_DESCRIPTIONS[primary]} With a ${secondary.toLowerCase()} influence.`
  );
}

// ─── Product → DNA match logic (for PDP "Why we recommend this") ──────────────

export function getProductMatchReason(product, dna) {
  if (!dna || !product) return null;
  const { primaryStyle, secondaryStyle, brands = [], colors = [], stores = [] } = dna;

  if (brands.includes(product.brand)) {
    return `${product.brand} is one of your favourite brands`;
  }
  if (stores.includes(product.retailer)) {
    return `You shop at ${product.retailer}`;
  }
  if (colors.includes(product.color)) {
    return `${product.color} is in your colour palette`;
  }
  if (primaryStyle && STYLE_CATEGORY_MAP[primaryStyle]?.includes(product.category)) {
    return `Fits your ${primaryStyle} aesthetic`;
  }
  if (secondaryStyle && STYLE_CATEGORY_MAP[secondaryStyle]?.includes(product.category)) {
    return `Matches your ${secondaryStyle} side`;
  }
  return null;
}

export function productMatchesStyle(product, primaryStyle) {
  if (!primaryStyle || !product) return false;
  const cats = STYLE_CATEGORY_MAP[primaryStyle] || [];
  return cats.includes(product.category);
}

// ─── Aesthetic boards (for account inspiration section) ───────────────────────

export const AESTHETIC_BOARDS = [
  {
    id: "old-money",
    label: "Old Money",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    styles: ["Classic", "Luxe"],
  },
  {
    id: "clean-girl",
    label: "Clean Girl",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    styles: ["Minimal"],
  },
  {
    id: "street-style",
    label: "Street Style",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80",
    styles: ["Streetwear"],
  },
  {
    id: "dark-academia",
    label: "Dark Academia",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    styles: ["Vintage", "Classic"],
  },
  {
    id: "coastal-chic",
    label: "Coastal Chic",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
    styles: ["Minimal", "Classic"],
  },
  {
    id: "quiet-luxury",
    label: "Quiet Luxury",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80",
    styles: ["Luxe", "Minimal"],
  },
  {
    id: "y2k-revival",
    label: "Y2K Revival",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
    styles: ["Trend-led", "Sporty"],
  },
  {
    id: "sporty-luxe",
    label: "Sporty Luxe",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80",
    styles: ["Sporty", "Luxe"],
  },
];
