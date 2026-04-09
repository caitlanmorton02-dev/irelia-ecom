"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import {
  scoreQuizAnswers,
  generateDNALabel,
  generateDNADescription,
  STYLE_TYPES,
  STYLE_DESCRIPTIONS,
} from "../../lib/styleDNA";
import { saveStyleDNA } from "../../lib/storage";
import { getSavedProducts } from "../../lib/saveProduct";

// ─── Quiz data ────────────────────────────────────────────────────────────────

const OUTFIT_OPTIONS = [
  {
    id: "o-minimal",
    label: "Minimal Edit",
    desc: "Clean lines, neutral palette",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    vibes: ["Minimal"],
  },
  {
    id: "o-street",
    label: "Street Ready",
    desc: "Oversized, bold, casual",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80",
    vibes: ["Streetwear"],
  },
  {
    id: "o-luxe",
    label: "Luxe Moment",
    desc: "Elevated, polished, refined",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
    vibes: ["Luxe"],
  },
  {
    id: "o-classic",
    label: "Timeless Classic",
    desc: "Tailored, structured, enduring",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    vibes: ["Classic"],
  },
  {
    id: "o-sporty",
    label: "Sporty Chic",
    desc: "Performance meets fashion",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
    vibes: ["Sporty"],
  },
  {
    id: "o-vintage",
    label: "Vintage Mood",
    desc: "Retro-inspired, timeless",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
    vibes: ["Vintage"],
  },
  {
    id: "o-trend",
    label: "Trend Setter",
    desc: "Bold prints, statement looks",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80",
    vibes: ["Trend-led"],
  },
  {
    id: "o-quiet-luxe",
    label: "Quiet Luxury",
    desc: "Understated premium, no logos",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
    vibes: ["Luxe", "Minimal"],
  },
];

const BRAND_OPTIONS = [
  "Zara", "Arket", "COS", "Reformation", "Ganni", "Toteme",
  "& Other Stories", "Mango", "Reiss", "Burberry", "A.P.C.",
  "Ralph Lauren", "Levi's", "New Balance", "ASOS Design",
];

const COLOR_OPTIONS = [
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

const FIT_OPTIONS = [
  {
    id: "oversized",
    label: "Oversized",
    desc: "Roomy, relaxed silhouettes",
    icon: "◈",
    signals: ["Streetwear", "Vintage"],
  },
  {
    id: "tailored",
    label: "Tailored",
    desc: "Sharp, precise, structured",
    icon: "◇",
    signals: ["Classic", "Luxe"],
  },
  {
    id: "relaxed",
    label: "Relaxed",
    desc: "Easy, effortless everyday",
    icon: "○",
    signals: ["Minimal"],
  },
  {
    id: "fitted",
    label: "Fitted",
    desc: "Close to the body, sleek",
    icon: "◆",
    signals: ["Trend-led", "Luxe"],
  },
];

const STORE_OPTIONS = [
  "ASOS", "Zara", "PLT", "Selfridges", "Net-a-Porter",
  "Mango", "COS", "MATCHESFASHION", "John Lewis", "Mr Porter",
];

const TOTAL_STEPS = 5;

// ─── Step components ──────────────────────────────────────────────────────────

function StepHeader({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--muted)",
          marginBottom: 8,
        }}
      >
        Step {step} of {TOTAL_STEPS}
      </div>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {title}
      </h2>
      <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: 40, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${(step / TOTAL_STEPS) * 100}%`,
          background: "#111",
          borderRadius: 2,
          transition: "width 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
    </div>
  );
}

function StepOutfits({ selected, onToggle }) {
  return (
    <div>
      <StepHeader
        step={1}
        title="Pick outfits that feel like you"
        subtitle="Select all that resonate. Your choices map to your style DNA."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10,
        }}
      >
        {OUTFIT_OPTIONS.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              style={{
                background: "none",
                border: `2px solid ${active ? "#111" : "transparent"}`,
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                transition: "border-color 0.18s, transform 0.18s",
                transform: active ? "scale(0.97)" : "scale(1)",
              }}
            >
              <Image
                src={option.image}
                alt={option.label}
                width={500}
                height={600}
                unoptimized
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "5/6",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: active
                    ? "rgba(0,0,0,0.12)"
                    : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "14px",
                }}
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 26,
                      height: 26,
                      background: "#111",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      fontSize: 13,
                    }}
                  >
                    ✓
                  </div>
                )}
                <span
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    display: "block",
                  }}
                >
                  {option.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>
                  {option.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
          {selected.length} selected
        </p>
      )}
    </div>
  );
}

function StepBrands({ selected, onToggle }) {
  return (
    <div>
      <StepHeader
        step={2}
        title="Which brands do you love?"
        subtitle="Pick your favourites — we'll use this to find your style matches."
      />
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
                padding: "11px 18px",
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
    </div>
  );
}

function StepColors({ selected, onToggle }) {
  return (
    <div>
      <StepHeader
        step={3}
        title="Your colour palette"
        subtitle="Pick the colours you reach for most."
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {COLOR_OPTIONS.map((color) => {
          const active = selected.includes(color.name);
          return (
            <button
              key={color.name}
              onClick={() => onToggle(color.name)}
              title={color.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 7,
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: color.hex,
                  border: active ? "3px solid #111" : "2px solid var(--border)",
                  transition: "all 0.15s",
                  transform: active ? "scale(1.12)" : "scale(1)",
                  boxShadow: active ? "0 0 0 3px #fff inset" : "none",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: active ? "#111" : "var(--muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepFit({ selected, onSelect }) {
  return (
    <div>
      <StepHeader
        step={4}
        title="How do you like your clothes to fit?"
        subtitle="Pick the silhouette that feels most like you."
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}
      >
        {FIT_OPTIONS.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(active ? "" : option.id)}
              style={{
                border: `2px solid ${active ? "#111" : "var(--border)"}`,
                background: active ? "#111" : "#fff",
                color: active ? "#fff" : "#111",
                borderRadius: 2,
                padding: "22px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>{option.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{option.label}</div>
              <div style={{ fontSize: 12, opacity: active ? 0.65 : 0.5, lineHeight: 1.4 }}>
                {option.desc}
              </div>
              {active && (
                <div style={{ marginTop: 12, display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {option.signals.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 9,
                        border: "1px solid rgba(255,255,255,0.4)",
                        borderRadius: 10,
                        padding: "2px 7px",
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepStores({ selected, onToggle }) {
  return (
    <div>
      <StepHeader
        step={5}
        title="Where do you usually shop?"
        subtitle="We'll surface items from your go-to retailers first."
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {STORE_OPTIONS.map((store) => {
          const active = selected.includes(store);
          return (
            <button
              key={store}
              onClick={() => onToggle(store)}
              style={{
                border: `1px solid ${active ? "#111" : "var(--border)"}`,
                background: active ? "#111" : "#fff",
                color: active ? "#fff" : "#111",
                borderRadius: 2,
                fontSize: 13,
                padding: "11px 18px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontWeight: active ? 600 : 400,
              }}
            >
              {store}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Result preview ───────────────────────────────────────────────────────────

function ResultPreview({ primary, secondary, description }) {
  if (!primary) return null;
  return (
    <div
      style={{
        marginTop: 28,
        padding: "20px 22px",
        background: "#f5f5f0",
        borderRadius: 2,
        borderLeft: "3px solid #111",
      }}
    >
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 6 }}>
        Your Style DNA preview
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.01em" }}>
        {secondary ? `${primary} ${secondary}` : primary}
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

// ─── Main quiz page ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(false);

  // Answers
  const [outfits, setOutfits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [fit, setFit] = useState("");
  const [stores, setStores] = useState([]);

  // Live score preview (computed on step 5)
  const [preview, setPreview] = useState(null);

  const savedCount = typeof window !== "undefined" ? getSavedProducts().length : 0;

  const toggleItem = (setter) => (value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    if (step === 4) {
      // Compute preview before showing step 5
      const vibes = outfits.flatMap(
        (id) => OUTFIT_OPTIONS.find((o) => o.id === id)?.vibes || []
      );
      const { primary, secondary } = scoreQuizAnswers({ vibes, brands, colors, fit, stores });
      setPreview({ primary, secondary });
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = () => {
    const vibes = outfits.flatMap(
      (id) => OUTFIT_OPTIONS.find((o) => o.id === id)?.vibes || []
    );
    const { primary, secondary } = scoreQuizAnswers({ vibes, brands, colors, fit, stores });
    const dnaLabel = generateDNALabel(primary, secondary);
    const dnaDescription = generateDNADescription(primary, secondary);

    saveStyleDNA({
      stores,
      brands,
      vibes: [...new Set(vibes)],
      colors,
      sizes: [],
      fit,
      primaryStyle: primary,
      secondaryStyle: secondary,
      dnaLabel,
      dnaDescription,
    });

    setToast(true);
    setTimeout(() => router.push("/shop"), 1800);
  };

  const canProceed =
    step === 1
      ? outfits.length > 0
      : step === 2
      ? brands.length > 0
      : step === 3
      ? colors.length > 0
      : true; // fit (step 4) and stores (step 5) are soft-required

  return (
    <main>
      <Header savedCount={savedCount} />

      <section
        className="container fade-in"
        style={{ paddingTop: 32, paddingBottom: 72, maxWidth: 900 }}
      >
        {/* Eyebrow */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--muted)",
            }}
          >
            Style DNA Quiz
          </span>
        </div>

        <ProgressBar step={step} />

        {/* Step content */}
        <div key={step} className="fade-in">
          {step === 1 && (
            <StepOutfits selected={outfits} onToggle={toggleItem(setOutfits)} />
          )}
          {step === 2 && (
            <StepBrands selected={brands} onToggle={toggleItem(setBrands)} />
          )}
          {step === 3 && (
            <StepColors selected={colors} onToggle={toggleItem(setColors)} />
          )}
          {step === 4 && (
            <StepFit selected={fit} onSelect={setFit} />
          )}
          {step === 5 && (
            <>
              <StepStores selected={stores} onToggle={toggleItem(setStores)} />
              {preview && (
                <ResultPreview
                  primary={preview.primary}
                  secondary={preview.secondary}
                  description={generateDNADescription(preview.primary, preview.secondary)}
                />
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              padding: "12px 22px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: step === 1 ? "default" : "pointer",
              opacity: step === 1 ? 0.25 : 1,
              borderRadius: 2,
              transition: "opacity 0.15s",
            }}
          >
            ← Back
          </button>

          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {step} / {TOTAL_STEPS}
          </span>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              background: canProceed ? "#111" : "#d0d0d0",
              color: "#fff",
              border: 0,
              padding: "12px 28px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 700,
              cursor: canProceed ? "pointer" : "default",
              borderRadius: 2,
              transition: "background 0.2s",
            }}
          >
            {step === TOTAL_STEPS ? "Build my DNA →" : "Next →"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link
            href="/shop"
            style={{
              fontSize: 12,
              color: "var(--muted)",
              textDecoration: "underline",
            }}
          >
            Skip and browse
          </Link>
        </div>
      </section>

      <Toast message="Style DNA created ✨ Taking you to the shop..." visible={toast} />
    </main>
  );
}
