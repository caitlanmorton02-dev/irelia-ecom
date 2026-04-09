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
  COLOUR_OPTIONS,
  BRAND_OPTIONS,
  computeDNA,
  saveAuralisDNA,
} from "../../lib/dna";
import { applyPreferences, fetchProducts } from "../../lib/fetchProducts";
import { loadSavedIds, saveSavedIds, loadStyleDNA } from "../../lib/storage";

// ─── Quiz step renderers ──────────────────────────────────────────────────────

function StyleGrid({ selected, onToggle }) {
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

function ColourGrid({ selected, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
      {COLOUR_OPTIONS.map((c) => {
        const active = selected.includes(c.name);
        return (
          <button
            key={c.name}
            onClick={() => onToggle(c.name)}
            title={c.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: c.hex,
                border: active ? "3px solid #111" : "2px solid var(--border)",
                transition: "all 0.15s",
                transform: active ? "scale(1.12)" : "scale(1)",
                boxShadow: active ? "0 0 0 3px #fff inset" : "none",
              }}
            />
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: active ? "#111" : "var(--muted)",
                fontWeight: active ? 600 : 400,
                transition: "color 0.15s",
              }}
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BrandChips({ selected, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {BRAND_OPTIONS.map((brand) => {
        const active = selected.includes(brand);
        return (
          <button
            key={brand}
            onClick={() => onToggle(brand)}
            style={{
              border: `1px solid ${active ? "#111" : "var(--border)"}`,
              background: active ? "#111" : "#fff",
              color: active ? "#fff" : "#111",
              borderRadius: 2,
              fontSize: 13,
              padding: "10px 16px",
              cursor: "pointer",
              transition: "all 0.15s",
              fontWeight: active ? 600 : 400,
            }}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}

// ─── Result view (step 3) ─────────────────────────────────────────────────────

function ResultView({ dna }) {
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
    setTimeout(() => setToast({ visible: false, message: msg }), 2400);
  };

  const toggleSave = (id) => {
    const isAdding = !savedIds.includes(id);
    setSavedIds((prev) =>
      isAdding ? [...prev, id] : prev.filter((v) => v !== id)
    );
    if (isAdding) showToast("Saved to your edit ♥");
  };

  // Hard-filter: products must match at least one selected brand, color, or vibe
  const curated = useMemo(() => {
    if (!products.length) return [];
    const { brands = [], colors = [], vibes = [] } = dna;
    const hasFilters = brands.length || colors.length || vibes.length;

    let pool = products;
    if (hasFilters) {
      const filtered = products.filter(
        (p) =>
          (brands.length && brands.includes(p.brand)) ||
          (colors.length && colors.includes(p.color)) ||
          (vibes.length &&
            vibes.some(
              (v) =>
                (p.category || "").toLowerCase().includes(v.toLowerCase()) ||
                (p.title || "").toLowerCase().includes(v.toLowerCase())
            ))
      );
      pool = filtered.length ? filtered : products;
    }
    return applyPreferences(pool, dna).slice(0, 30);
  }, [products, dna]);

  const effectiveDNA = baseDNA
    ? { ...baseDNA, brands: [...new Set([...(baseDNA.brands || []), ...(dna.brands || [])])], colors: [...new Set([...(baseDNA.colors || []), ...(dna.colors || [])])] }
    : dna;

  return (
    <main>
      <Header savedCount={savedIds.length} />
      <section className="container fade-in" style={{ paddingTop: 28, paddingBottom: 60 }}>

        {/* DNA summary strip */}
        <div
          style={{
            background: "#f5f5f0",
            borderRadius: 2,
            padding: "20px 22px",
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--muted)",
                marginBottom: 4,
              }}
            >
              Your Auralis DNA
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {dna.primaryStyle || "Curated"}
              {dna.secondaryStyle ? ` ${dna.secondaryStyle}` : ""}
            </div>
            {(dna.colors.length > 0 || dna.brands.length > 0) && (
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                {[...dna.colors.slice(0, 3), ...dna.brands.slice(0, 2)].join(" · ")}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Link
              href="/dna"
              style={{
                border: "1px solid var(--border)",
                padding: "9px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                borderRadius: 2,
                color: "#111",
              }}
            >
              Retake
            </Link>
            <Link
              href="/shop"
              style={{
                background: "#111",
                color: "#fff",
                padding: "9px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                borderRadius: 2,
              }}
            >
              View all →
            </Link>
          </div>
        </div>

        {/* Curated products */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Curated for you
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

        <div style={{ textAlign: "center", marginTop: 32 }}>
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

// ─── Main page ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "What's your vibe?",
    subtitle: "Pick the styles that feel like you. Select as many as resonate.",
  },
  {
    title: "Your colour palette",
    subtitle: "Select the colours you reach for most.",
  },
  {
    title: "Which brands do you love?",
    subtitle: "Pick your favourites — we'll prioritise them in your feed.",
  },
];

export default function DNAPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ styles: [], colors: [], brands: [] });
  const [computedDNA, setComputedDNA] = useState(null);
  const [toast, setToast] = useState(false);
  const savedCount = typeof window !== "undefined" ? loadSavedIds().length : 0;

  const toggleItem = (group) => (value) => {
    setAnswers((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...prev[group], value],
    }));
  };

  const canProceed =
    step === 0
      ? answers.styles.length > 0
      : step === 1
      ? answers.colors.length > 0
      : answers.brands.length > 0;

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final step — compute, persist, show result
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

  // Show result once DNA is computed
  if (computedDNA) {
    return <ResultView dna={computedDNA} />;
  }

  return (
    <main>
      <Header savedCount={savedCount} />

      <section
        className="container fade-in"
        style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 920 }}
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
              <ColourGrid
                selected={answers.colors}
                onToggle={toggleItem("colors")}
              />
            )}
            {step === 2 && (
              <BrandChips
                selected={answers.brands}
                onToggle={toggleItem("brands")}
              />
            )}
          </QuizStep>
        </div>
      </section>

      <Toast message="Auralis DNA saved ✨" visible={toast} />
    </main>
  );
}
