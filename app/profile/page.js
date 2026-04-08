"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import { loadStyleDNA, saveStyleDNA, loadSavedIds, loadRecentlyViewed } from "../../lib/storage";
import { fetchProducts } from "../../lib/fetchProducts";

const STORES = ["ASOS", "Zara", "PLT", "Selfridges", "Mango", "COS", "Net-a-Porter", "MATCHESFASHION", "John Lewis", "Mr Porter"];
const VIBES = ["Minimal", "Streetwear", "Luxe", "Sporty", "Vintage", "Statement"];
const COLOURS = ["Black", "White", "Cream", "Navy", "Camel", "Grey", "Pink", "Green", "Blue", "Red", "Brown", "Burgundy"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_BRANDS = ["Zara", "Arket", "COS", "Reformation", "Ganni", "Toteme", "& Other Stories", "Mango", "Reiss", "Burberry", "A.P.C.", "Ralph Lauren", "Levi's", "New Balance", "ASOS Design"];

function ToggleGroup({ title, options, selected, onToggle }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              style={{
                border: `1px solid ${active ? "#111" : "var(--border)"}`,
                background: active ? "#111" : "#fff",
                color: active ? "#fff" : "#111",
                borderRadius: 20,
                fontSize: 12,
                padding: "7px 13px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ value, label, href }) {
  const inner = (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 2,
        padding: "20px 18px",
        textAlign: "center",
        cursor: href ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function ProfilePage() {
  const [savedCount, setSavedCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [dna, setDNA] = useState({ stores: [], brands: [], vibes: [], colors: [], sizes: [], fit: "" });
  const [toast, setToast] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const loaded = loadStyleDNA();
    setDNA(loaded);
    setSavedCount(loadSavedIds().length);
    setRecentCount(loadRecentlyViewed().length);
    setQuizDone(
      !!(loaded.vibes?.length || loaded.brands?.length || loaded.colors?.length || loaded.stores?.length)
    );
  }, []);

  const toggle = (group, value) => {
    setDNA((prev) => ({
      ...prev,
      [group]: prev[group]?.includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...(prev[group] || []), value],
    }));
  };

  const handleSave = () => {
    saveStyleDNA(dna);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const hasAnyDNA = (dna.vibes || []).length || (dna.brands || []).length || (dna.colors || []).length || (dna.stores || []).length;

  return (
    <main>
      <Header savedCount={savedCount} />

      <section className="container" style={{ paddingTop: 24, paddingBottom: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Account</h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>
              Your Style DNA personalises the entire shopping experience.
            </p>
          </div>
          {!quizDone && (
            <Link
              href="/quiz"
              style={{
                border: "1px solid #111",
                padding: "10px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              Take Style Quiz →
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 36 }}>
          <StatCard value={savedCount} label="Saved items" href="/edit" />
          <StatCard value={recentCount} label="Recently viewed" />
          <StatCard value={(dna.vibes || []).length + (dna.brands || []).length} label="DNA signals" />
        </div>

        {/* Style DNA section */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <h2 style={{ margin: 0, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Your Style DNA
            </h2>
            {hasAnyDNA && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[...(dna.vibes || []), ...(dna.brands || []), ...(dna.colors || [])].slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      border: "1px solid #111",
                      borderRadius: 20,
                      padding: "3px 9px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ToggleGroup title="Style vibes" options={VIBES} selected={dna.vibes || []} onToggle={(v) => toggle("vibes", v)} />
          <ToggleGroup title="Favourite brands" options={ALL_BRANDS} selected={dna.brands || []} onToggle={(v) => toggle("brands", v)} />
          <ToggleGroup title="Preferred stores" options={STORES} selected={dna.stores || []} onToggle={(v) => toggle("stores", v)} />
          <ToggleGroup title="Colours" options={COLOURS} selected={dna.colors || []} onToggle={(v) => toggle("colors", v)} />
          <ToggleGroup title="Sizes" options={SIZES} selected={dna.sizes || []} onToggle={(v) => toggle("sizes", v)} />

          <button
            onClick={handleSave}
            style={{
              marginTop: 10,
              background: "#111",
              color: "#fff",
              border: 0,
              padding: "13px 32px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Save Style DNA
          </button>

          <p style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
            Your preferences automatically prioritise matching products across the shop.{" "}
            <Link href="/quiz" style={{ textDecoration: "underline" }}>Retake the quiz →</Link>
          </p>
        </div>
      </section>

      <Toast message="Style DNA updated ✨" visible={toast} />
    </main>
  );
}
