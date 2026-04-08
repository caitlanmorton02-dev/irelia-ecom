"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { loadPreferences, loadSavedIds, savePreferences } from "../../lib/storage";

const STORES = ["ASOS", "Zara", "PLT", "Selfridges", "Mango", "COS", "Net-a-Porter"];
const VIBES = ["Minimal", "Streetwear", "Luxe"];
const COLOURS = ["Black", "White", "Navy", "Camel", "Grey", "Pink", "Blue"];
const SIZES = ["XS", "S", "M", "L", "XL"];

function ToggleGroup({ title, options, selected, onToggle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ margin: "0 0 10px", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              style={{
                border: "1px solid #111",
                background: active ? "#111" : "#fff",
                color: active ? "#fff" : "#111",
                borderRadius: 2,
                fontSize: 12,
                padding: "8px 11px",
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

export default function ProfilePage() {
  const [savedCount, setSavedCount] = useState(0);
  const [prefs, setPrefs] = useState({ stores: [], vibes: [], colors: [], sizes: [] });

  useEffect(() => {
    setPrefs(loadPreferences());
    setSavedCount(loadSavedIds().length);
  }, []);

  useEffect(() => {
    savePreferences(prefs);
  }, [prefs]);

  const toggle = (group, value) => {
    setPrefs((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((entry) => entry !== value)
        : [...prev[group], value],
    }));
  };

  return (
    <main>
      <Header savedCount={savedCount} />
      <section className="container" style={{ paddingTop: 20, paddingBottom: 38 }}>
        <h1 style={{ margin: "0 0 16px", fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Profile</h1>
        <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: 13 }}>
          Your preferences personalise homepage sections and automatically prioritise matching products in shop.
        </p>
        <ToggleGroup title="Favourite stores" options={STORES} selected={prefs.stores} onToggle={(value) => toggle("stores", value)} />
        <ToggleGroup title="Style vibes" options={VIBES} selected={prefs.vibes} onToggle={(value) => toggle("vibes", value)} />
        <ToggleGroup title="Colours" options={COLOURS} selected={prefs.colors} onToggle={(value) => toggle("colors", value)} />
        <ToggleGroup title="Sizes" options={SIZES} selected={prefs.sizes} onToggle={(value) => toggle("sizes", value)} />
      </section>
    </main>
  );
}
