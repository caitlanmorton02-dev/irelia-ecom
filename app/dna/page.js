"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import ProductGrid from "../../components/ProductGrid";
import ProductPanel from "../../components/ProductPanel";
import { SkeletonGrid } from "../../components/SkeletonCard";
import Toast from "../../components/Toast";
import QuizStep from "../../components/dna/QuizStep";
import {
  STYLE_OPTIONS,
  OUTFIT_OPTIONS,
  SHOPPING_OPTIONS,
  COLOUR_GROUPS,
  BRAND_OPTIONS,
  STYLE_RECOMMENDATIONS,
  computeDNA,
  saveAuralisDNA,
  loadAuralisDNA,
  removeAuralisDNA,
} from "../../lib/dna";
import { generateDNADescription } from "../../lib/styleDNA";
import { fetchProducts } from "../../lib/fetchProducts";
import { processProducts } from "../../lib/processProducts";
import { loadSavedIds, saveSavedIds, loadStyleDNA } from "../../lib/storage";

// ─── Step 1: Style vibe image grid ───────────────────────────────────────────

function StyleGrid({ selected, onToggle }) {
  const atMax = selected.length >= 3;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
        gap: 10,
        marginBottom: 4,
      }}
    >
      {STYLE_OPTIONS.map((opt) => {
        const active = selected.includes(opt.id);
        const disabled = !active && atMax;
        return (
          <button
            key={opt.id}
            onClick={() => !disabled && onToggle(opt.id)}
            style={{
              background: "none",
              border: `2px solid ${active ? "#111" : "transparent"}`,
              padding: 0,
              cursor: disabled ? "not-allowed" : "pointer",
              textAlign: "left",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              transition: "border-color 0.18s, transform 0.15s",
              transform: active ? "scale(0.97)" : "scale(1)",
              opacity: disabled ? 0.45 : 1,
            }}
          >
            <Image
              src={opt.image}
              alt={opt.label}
              width={500}
              height={580}
              unoptimized
              style={{ width: "100%", height: "auto", aspectRatio: "5/6", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: active
                  ? "rgba(0,0,0,0.15)"
                  : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "12px 12px",
                transition: "background 0.18s",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    top: 9,
                    right: 9,
                    width: 24,
                    height: 24,
                    background: "#111",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  ✓
                </div>
              )}
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, display: "block" }}>
                {opt.label}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>
                {opt.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 2: Real-life outfit scenarios ──────────────────────────────────────

function OutfitGrid({ selected, onToggle }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
        gap: 10,
        marginBottom: 4,
      }}
    >
      {OUTFIT_OPTIONS.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            style={{
              background: "none",
              border: `2px solid ${active ? "#111" : "transparent"}`,
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              transition: "border-color 0.18s, transform 0.15s",
              transform: active ? "scale(0.97)" : "scale(1)",
            }}
          >
            <Image
              src={opt.image}
              alt={opt.label}
              width={500}
              height={580}
              unoptimized
              style={{ width: "100%", height: "auto", aspectRatio: "5/6", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: active
                  ? "rgba(0,0,0,0.15)"
                  : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "12px 12px",
                transition: "background 0.18s",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    top: 9,
                    right: 9,
                    width: 24,
                    height: 24,
                    background: "#111",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  ✓
                </div>
              )}
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, display: "block" }}>
                {opt.label}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>
                {opt.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 3: Shopping behaviour (text-based list) ─────────────────────────────

function ShoppingGrid({ selected, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {SHOPPING_OPTIONS.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            style={{
              border: `2px solid ${active ? "#111" : "var(--border)"}`,
              background: active ? "#111" : "#fff",
              borderRadius: 2,
              padding: "16px 20px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.18s",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : "#111",
                  marginBottom: 3,
                }}
              >
                {opt.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: active ? "rgba(255,255,255,0.65)" : "var(--muted)",
                  lineHeight: 1.5,
                }}
              >
                {opt.desc}
              </div>
            </div>
            {active && (
              <div
                style={{
                  width: 22,
                  height: 22,
                  background: "#fff",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#111", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 4: Grouped colour palettes ─────────────────────────────────────────

function PaletteGrid({ selected, onToggle }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 10,
      }}
    >
      {COLOUR_GROUPS.map((group) => {
        const active = selected.includes(group.id);
        return (
          <button
            key={group.id}
            onClick={() => onToggle(group.id)}
            style={{
              border: `2px solid ${active ? "#111" : "var(--border)"}`,
              borderRadius: 2,
              padding: "16px 18px",
              cursor: "pointer",
              background: active ? "#fafafa" : "#fff",
              textAlign: "left",
              transition: "border-color 0.18s, background 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Swatch row */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {group.swatches.slice(0, 4).map((hex, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: hex,
                    border: "1px solid rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            {/* Label + desc */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: "#111",
                  marginBottom: 2,
                }}
              >
                {group.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{group.desc}</div>
            </div>
            {active && (
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "#111",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 5: Brands with "All brands" option ─────────────────────────────────

function BrandChips({ selected, onToggle }) {
  const allBrandsSelected = selected.includes("All brands");
  return (
    <div>
      {/* "All brands" sentinel — full width, prominent */}
      <button
        onClick={() => onToggle("All brands")}
        style={{
          width: "100%",
          border: `2px solid ${allBrandsSelected ? "#111" : "var(--border)"}`,
          background: allBrandsSelected ? "#111" : "#fff",
          color: allBrandsSelected ? "#fff" : "#111",
          borderRadius: 2,
          fontSize: 13,
          padding: "14px 18px",
          cursor: "pointer",
          transition: "all 0.15s",
          fontWeight: allBrandsSelected ? 700 : 500,
          marginBottom: 14,
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ marginBottom: 2 }}>Show everything — all brands</div>
          <div
            style={{
              fontSize: 11,
              color: allBrandsSelected ? "rgba(255,255,255,0.65)" : "var(--muted)",
              fontWeight: 400,
            }}
          >
            No brand filtering applied — your full personalised feed
          </div>
        </div>
        {allBrandsSelected && (
          <div
            style={{
              width: 22,
              height: 22,
              background: "#fff",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            <span style={{ color: "#111", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>
          </div>
        )}
      </button>

      {/* Specific brand chips */}
      <div style={{ opacity: allBrandsSelected ? 0.35 : 1, transition: "opacity 0.2s" }}>
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            marginBottom: 10,
          }}
        >
          Or pick specific brands:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {BRAND_OPTIONS.map((brand) => {
            const active = selected.includes(brand);
            return (
              <button
                key={brand}
                onClick={() => !allBrandsSelected && onToggle(brand)}
                disabled={allBrandsSelected}
                style={{
                  border: `1px solid ${active ? "#111" : "var(--border)"}`,
                  background: active ? "#111" : "#fff",
                  color: active ? "#fff" : "#111",
                  borderRadius: 2,
                  fontSize: 13,
                  padding: "10px 16px",
                  cursor: allBrandsSelected ? "default" : "pointer",
                  transition: "all 0.15s",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Recommendation banner (DNA results) ──────────────────────────────────────

function RecommendationBanner({ dna }) {
  const recs = (STYLE_RECOMMENDATIONS[dna.primaryStyle] || []).slice(0, 3);
  if (!recs.length) return null;
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 2,
        padding: "20px 22px",
        marginBottom: 28,
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--muted)",
          marginBottom: 14,
        }}
      >
        Based on your {dna.primaryStyle} style, try adding:
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 10,
        }}
      >
        {recs.map((rec, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 2,
              padding: "12px 14px",
              background: "#fafafa",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
              {rec.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>
              {rec.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DNA results page ─────────────────────────────────────────────────────────

function DNABadge({ label }) {
  return (
    <span
      style={{
        display: "inline-block",
        border: "1px solid #111",
        borderRadius: 20,
        padding: "4px 12px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function ResultView({ dna, onRetake }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [baseDNA, setBaseDNA] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    setSavedIds(loadSavedIds());
    setBaseDNA(loadStyleDNA());
  }, []);

  useEffect(() => {
    saveSavedIds(savedIds);
  }, [savedIds]);

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  };

  const toggleSave = (id) => {
    const isAdding = !savedIds.includes(id);
    setSavedIds((prev) =>
      isAdding ? [...prev, id] : prev.filter((v) => v !== id)
    );
    if (isAdding) showToast("Saved to your edit ♥");
  };

  // Curated feed: hard-filter by DNA match first, then score + sort, limit 30
  const curated = useMemo(
    () =>
      processProducts(products, dna, {
        hardFilterByDNA: true,
        limit: 30,
      }),
    [products, dna]
  );

  const effectiveDNA = baseDNA
    ? {
        ...baseDNA,
        brands: [...new Set([...(baseDNA.brands || []), ...(dna.brands || [])])],
        colors: [...new Set([...(baseDNA.colors || []), ...(dna.colors || [])])],
      }
    : dna;

  const dnaDescription = generateDNADescription(dna.primaryStyle, dna.secondaryStyle);

  return (
    <main>
      <Header savedCount={savedIds.length} />

      <section className="container fade-in" style={{ paddingTop: 28, paddingBottom: 60 }}>

        {/* ── DNA summary ──────────────────────────────────────────── */}
        <div
          style={{
            background: "#f5f5f0",
            borderRadius: 2,
            padding: "24px 26px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Your Auralis DNA
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {dna.primaryStyle || "Curated"}
            {dna.secondaryStyle && (
              <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 22 }}>
                {" "}× {dna.secondaryStyle}
              </span>
            )}
          </div>

          {dnaDescription && (
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.6,
                margin: "0 0 16px",
                maxWidth: 520,
              }}
            >
              {dnaDescription}
            </p>
          )}

          {/* Style + palette badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {dna.primaryStyle && <DNABadge label={dna.primaryStyle} />}
            {dna.secondaryStyle && <DNABadge label={dna.secondaryStyle} />}
            {dna.paletteType && (
              <span
                style={{
                  display: "inline-block",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                {dna.paletteType}
              </span>
            )}
            {dna.allBrands ? (
              <span
                style={{
                  display: "inline-block",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                All brands
              </span>
            ) : (
              (dna.brands || []).slice(0, 3).map((b) => (
                <span
                  key={b}
                  style={{
                    display: "inline-block",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {b}
                </span>
              ))
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onRetake}
              style={{
                border: "1px solid var(--border)",
                padding: "9px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                borderRadius: 2,
                color: "#111",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Retake quiz
            </button>
            <Link
              href="/shop"
              style={{
                background: "#111",
                color: "#fff",
                padding: "9px 20px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                borderRadius: 2,
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              Browse all →
            </Link>
          </div>
        </div>

        {/* ── Recommendation banner ─────────────────────────────────── */}
        <RecommendationBanner dna={dna} />

        {/* ── Curated products ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 18,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Curated for your DNA
          </h1>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {loading ? "…" : `${curated.length} picks`}
          </span>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <ProductGrid
            products={curated}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onOpenPanel={setSelectedProduct}
            hasMore={false}
            totalCount={curated.length}
          />
        )}

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link
            href="/shop"
            style={{
              display: "inline-block",
              border: "1px solid #111",
              padding: "12px 28px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: 2,
            }}
          >
            View all products →
          </Link>
        </div>
      </section>

      <ProductPanel
        product={selectedProduct}
        saved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelectedProduct(null)}
        dna={effectiveDNA}
      />

      <Toast message={toast.message} visible={toast.visible} />
    </main>
  );
}

// ─── Quiz steps config ────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "What's your vibe?",
    subtitle: "Pick the aesthetics that feel most like you.",
    hint: "Choose up to 3 — this sets the foundation of your style profile.",
  },
  {
    title: "What do you actually wear?",
    subtitle: "Pick the outfits closest to your day-to-day reality.",
    hint: "Be honest — this shapes your recommendations more than aspirational picks.",
  },
  {
    title: "How do you usually shop?",
    subtitle: "Your shopping mindset helps us weight your preferences.",
    hint: "This influences your style scores, not your product filters directly.",
  },
  {
    title: "Your colour world",
    subtitle: "Which palettes do you gravitate towards?",
    hint: "Select one or more — we'll match these to product colours in your feed.",
  },
  {
    title: "Which brands do you love?",
    subtitle: "Pick your favourites, or skip brand filtering entirely.",
    hint: "Selecting 'All brands' gives you the widest personalised selection.",
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

const EMPTY_ANSWERS = {
  styles: [],
  outfits: [],
  shopping: [],
  colours: [],
  brands: [],
};

export default function DNAPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [computedDNA, setComputedDNA] = useState(null);
  const [toast, setToast] = useState(false);
  const savedCount = typeof window !== "undefined" ? loadSavedIds().length : 0;

  // ── CRITICAL FIX: Load existing DNA on mount — skip quiz if already done ─────
  useEffect(() => {
    const existing = loadAuralisDNA();
    if (existing) setComputedDNA(existing);
  }, []);

  // ── Generic toggle for most steps ────────────────────────────────────────────
  const toggleItem = (group) => (value) => {
    setAnswers((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...prev[group], value],
    }));
  };

  // ── Special toggle for brands: "All brands" clears individual picks ───────────
  const handleBrandToggle = (brand) => {
    if (brand === "All brands") {
      setAnswers((prev) => ({
        ...prev,
        brands: prev.brands.includes("All brands") ? [] : ["All brands"],
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        brands: prev.brands.includes(brand)
          ? prev.brands.filter((v) => v !== brand)
          : [...prev.brands.filter((v) => v !== "All brands"), brand],
      }));
    }
  };

  // ── Can proceed to next step ──────────────────────────────────────────────────
  const canProceed =
    step === 0 ? answers.styles.length > 0
    : step === 1 ? answers.outfits.length > 0
    : step === 2 ? answers.shopping.length > 0
    : step === 3 ? answers.colours.length > 0
    : answers.brands.length > 0; // step 4 — "All brands" also counts

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final step — compute, persist, show results
      const dna = computeDNA(answers);
      saveAuralisDNA(dna);
      setComputedDNA(dna);
      setToast(true);
      setTimeout(() => setToast(false), 2400);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Retake: clear stored DNA and restart quiz ─────────────────────────────────
  const handleRetake = () => {
    removeAuralisDNA();
    setComputedDNA(null);
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show results if DNA is available (persisted or just computed)
  if (computedDNA) {
    return <ResultView dna={computedDNA} onRetake={handleRetake} />;
  }

  return (
    <main>
      <Header savedCount={savedCount} />

      <section
        className="container fade-in"
        style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 960 }}
      >
        {/* Eyebrow */}
        <span
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--muted)",
            display: "block",
            marginBottom: 6,
          }}
        >
          Auralis DNA
        </span>

        <div key={step} className="fade-in">
          <QuizStep
            step={step}
            total={STEPS.length}
            title={STEPS[step].title}
            subtitle={STEPS[step].subtitle}
            hint={STEPS[step].hint}
            onBack={handleBack}
            onNext={handleNext}
            canProceed={canProceed}
            isLast={step === STEPS.length - 1}
          >
            {step === 0 && (
              <StyleGrid
                selected={answers.styles}
                onToggle={toggleItem("styles")}
              />
            )}
            {step === 1 && (
              <OutfitGrid
                selected={answers.outfits}
                onToggle={toggleItem("outfits")}
              />
            )}
            {step === 2 && (
              <ShoppingGrid
                selected={answers.shopping}
                onToggle={toggleItem("shopping")}
              />
            )}
            {step === 3 && (
              <PaletteGrid
                selected={answers.colours}
                onToggle={toggleItem("colours")}
              />
            )}
            {step === 4 && (
              <BrandChips
                selected={answers.brands}
                onToggle={handleBrandToggle}
              />
            )}
          </QuizStep>
        </div>
      </section>

      <Toast message="Auralis DNA saved ✨" visible={toast} />
    </main>
  );
}
