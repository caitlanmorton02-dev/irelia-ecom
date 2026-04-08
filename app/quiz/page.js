"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import { saveStyleDNA, loadSavedIds } from "../../lib/storage";

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
    id: "o-statement",
    label: "Statement Piece",
    desc: "Bold, editorial, expressive",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80",
    vibes: ["Statement", "Luxe"],
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
  { id: "oversized", label: "Oversized", desc: "Roomy, relaxed silhouettes", icon: "◈" },
  { id: "tailored", label: "Tailored", desc: "Sharp, precise, structured", icon: "◇" },
  { id: "relaxed", label: "Relaxed", desc: "Easy, effortless everyday", icon: "○" },
  { id: "fitted", label: "Fitted", desc: "Close to the body, sleek", icon: "◆" },
];

const STORE_OPTIONS = [
  "ASOS", "Zara", "PLT", "Selfridges", "Net-a-Porter",
  "Mango", "COS", "MATCHESFASHION", "John Lewis", "Mr Porter",
];

const TOTAL_STEPS = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveVibes(outfitIds) {
  const vibeCounts = {};
  outfitIds.forEach((id) => {
    const option = OUTFIT_OPTIONS.find((o) => o.id === id);
    if (!option) return;
    option.vibes.forEach((v) => {
      vibeCounts[v] = (vibeCounts[v] || 0) + 1;
    });
  });
  return Object.entries(vibeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([vibe]) => vibe);
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepOutfits({ selected, onToggle }) {
  return (
    <div>
      <StepHeader
        step={1}
        title="Pick outfits you love"
        subtitle="Select as many as feel like you. No wrong answers."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {OUTFIT_OPTIONS.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              className={`quiz-option ${active ? "quiz-option--selected" : ""}`}
              style={{
                background: "none",
                border: `2px solid ${active ? "#111" : "transparent"}`,
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
              }}
            >
              <Image
                src={option.image}
                alt={option.label}
                width={500}
                height={600}
                unoptimized
                style={{ width: "100%", height: "auto", aspectRatio: "5/6", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: active
                    ? "rgba(0,0,0,0.15)"
                    : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "12px 12px",
                  transition: "background 0.2s",
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
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>
                  {option.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 }}>
                  {option.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBrands({ selected, onToggle }) {
  return (
    <div>
      <StepHeader
        step={2}
        title="Which brands do you shop?"
        subtitle="Pick your favourites. We'll prioritise them in your feed."
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
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
                gap: 6,
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: color.hex,
                  border: active ? "3px solid #111" : "2px solid var(--border)",
                  transition: "border 0.15s, transform 0.15s",
                  transform: active ? "scale(1.1)" : "scale(1)",
                  boxShadow: active ? "0 0 0 2px #fff inset" : "none",
                }}
              />
              <span style={{ fontSize: 10, color: active ? "#111" : "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
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
                padding: "22px 18px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{option.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{option.label}</div>
              <div style={{ fontSize: 12, opacity: active ? 0.7 : 0.55 }}>{option.desc}</div>
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
                padding: "10px 16px",
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
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{title}</h2>
      <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: 36, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${(step / TOTAL_STEPS) * 100}%`,
          background: "#111",
          borderRadius: 2,
          transition: "width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
    </div>
  );
}

// ─── Main quiz page ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(false);

  const [outfits, setOutfits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [fit, setFit] = useState("");
  const [stores, setStores] = useState([]);

  const savedCount = typeof window !== "undefined" ? loadSavedIds().length : 0;

  const toggleItem = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleNext = () => {
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
    const vibes = deriveVibes(outfits);
    const dna = { vibes, brands, colors, stores, sizes: [], fit };
    saveStyleDNA(dna);
    setToast(true);
    setTimeout(() => {
      router.push("/shop");
    }, 1600);
  };

  const canProceed =
    step === 1
      ? outfits.length > 0
      : step === 2
      ? brands.length > 0
      : step === 3
      ? colors.length > 0
      : step === 4
      ? true // fit is optional
      : step === 5
      ? stores.length > 0
      : true;

  return (
    <main>
      <Header savedCount={savedCount} />

      <section className="container fade-in" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 860 }}>
        {/* Title */}
        <div style={{ marginBottom: 6 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--muted)",
            }}
          >
            Style DNA Quiz
          </h1>
        </div>

        <ProgressBar step={step} />

        {/* Steps */}
        <div className="fade-in" key={step}>
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
            <StepStores selected={stores} onToggle={toggleItem(setStores)} />
          )}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 36,
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
              opacity: step === 1 ? 0.3 : 1,
              borderRadius: 2,
            }}
          >
            ← Back
          </button>

          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {step} / {TOTAL_STEPS}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              background: canProceed ? "#111" : "#ccc",
              color: "#fff",
              border: 0,
              padding: "12px 28px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
              cursor: canProceed ? "pointer" : "default",
              borderRadius: 2,
              transition: "background 0.2s",
            }}
          >
            {step === TOTAL_STEPS ? "Build my DNA →" : "Next →"}
          </button>
        </div>

        {/* Skip */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link
            href="/shop"
            style={{ fontSize: 12, color: "var(--muted)", textDecoration: "underline" }}
          >
            Skip quiz and browse
          </Link>
        </div>
      </section>

      <Toast message="Style DNA saved ✨ Taking you to the shop..." visible={toast} />
    </main>
  );
}
