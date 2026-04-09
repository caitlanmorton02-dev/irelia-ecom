"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import StyleDNACard from "../../components/StyleDNACard";
import {
  loadStyleDNA,
  saveStyleDNA,
  loadRecentlyViewed,
} from "../../lib/storage";
import { getSavedProducts } from "../../lib/saveProduct";
import { loadAuralisDNA, mergeWithAuralisDNA } from "../../lib/dna";
import { AESTHETIC_BOARDS } from "../../lib/styleDNA";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_BRANDS = [
  "Zara", "Arket", "COS", "Reformation", "Ganni", "Toteme",
  "& Other Stories", "Mango", "Reiss", "Burberry", "A.P.C.",
  "Ralph Lauren", "Levi's", "New Balance", "ASOS Design",
];
const COLOURS = [
  "Black", "White", "Cream", "Navy", "Camel", "Grey",
  "Pink", "Green", "Blue", "Red", "Brown", "Burgundy",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const FITS = ["Oversized", "Tailored", "Relaxed", "Fitted"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        margin: "0 0 16px",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "var(--muted)",
      }}
    >
      {children}
    </h2>
  );
}

function Chip({ label, active, onClick, colour }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "#111" : "var(--border)"}`,
        background: active ? "#111" : "#fff",
        color: active ? "#fff" : "#111",
        borderRadius: 20,
        fontSize: 12,
        padding: "7px 14px",
        cursor: "pointer",
        transition: "all 0.15s",
        fontWeight: active ? 600 : 400,
        display: "inline-flex",
        alignItems: "center",
        gap: colour ? 7 : 0,
      }}
    >
      {colour && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: colour,
            border: "1px solid rgba(0,0,0,0.1)",
            display: "inline-block",
          }}
        />
      )}
      {label}
    </button>
  );
}

const COLOUR_HEX = {
  Black: "#111", White: "#f5f5f5", Cream: "#f5f0e8", Navy: "#1a2a4a",
  Camel: "#c19a6b", Grey: "#9e9e9e", Pink: "#f4a7b9", Green: "#4a7c59",
  Blue: "#4a90d9", Red: "#c0392b", Brown: "#795548", Burgundy: "#7b1c3e",
};

function ToggleGroup({ options, selected, onToggle, colours }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((opt) => (
        <Chip
          key={opt}
          label={opt}
          active={selected.includes(opt)}
          onClick={() => onToggle(opt)}
          colour={colours ? COLOUR_HEX[opt] : null}
        />
      ))}
    </div>
  );
}

function StatCard({ value, label, href, sub }) {
  const inner = (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 2,
        padding: "20px 16px",
        textAlign: "center",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: href ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => href && (e.currentTarget.style.borderColor = "#111")}
      onMouseLeave={(e) => href && (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.09em", marginTop: 5 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, opacity: 0.6 }}>{sub}</div>
      )}
      {href && (
        <div style={{ position: "absolute", bottom: 6, right: 10, fontSize: 12, color: "var(--muted)" }}>
          →
        </div>
      )}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function AestheticBoard({ board, selected, onToggle }) {
  const active = selected.includes(board.id);
  return (
    <button
      onClick={() => onToggle(board.id)}
      style={{
        background: "none",
        border: `2px solid ${active ? "#111" : "transparent"}`,
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.18s",
      }}
    >
      <Image
        src={board.image}
        alt={board.label}
        width={500}
        height={600}
        unoptimized
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "4/5",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: active
            ? "rgba(0,0,0,0.2)"
            : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
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
              top: 8,
              right: 8,
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
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
          {board.label}
        </span>
        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
          {board.styles.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8,
                padding: "1px 6px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [dna, setDNA] = useState({ stores: [], brands: [], vibes: [], colors: [], sizes: [], fit: "", primaryStyle: null, secondaryStyle: null, dnaLabel: null, dnaDescription: null });
  const [auralisDNA, setAuralisDNA] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [aesthetics, setAesthetics] = useState([]);
  const [toast, setToast] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const editRef = useRef(null);

  useEffect(() => {
    const stored = loadStyleDNA();
    const auralis = loadAuralisDNA();
    setDNA(stored);
    setAuralisDNA(auralis);
    setSavedCount(getSavedProducts().length);
    setRecentCount(loadRecentlyViewed().length);
  }, []);

  const toggle = (group) => (value) => {
    setDNA((prev) => ({
      ...prev,
      [group]: prev[group]?.includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...(prev[group] || []), value],
    }));
  };

  const setFit = (value) =>
    setDNA((prev) => ({ ...prev, fit: prev.fit === value ? "" : value }));

  const toggleAesthetic = (id) => {
    setAesthetics((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    saveStyleDNA(dna);
    setToast(true);
    setEditOpen(false);
    setTimeout(() => setToast(false), 2800);
  };

  const openEdit = () => {
    setEditOpen(true);
    setTimeout(() => editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  // Merge auralis DNA signals into signal count
  const signalCount = [
    ...new Set([
      ...(dna.vibes || []),
      ...(dna.brands || []),
      ...(dna.colors || []),
      ...(dna.stores || []),
      ...(auralisDNA?.brands || []),
      ...(auralisDNA?.colors || []),
      ...(auralisDNA?.vibes || []),
    ]),
  ].length;

  return (
    <main>
      <Header savedCount={savedCount} />

      <section className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>

        {/* ── Page title ───────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Account
          </h1>
          <Link
            href="/dna"
            style={{
              background: "#111",
              color: "#fff",
              padding: "10px 18px",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: 2,
            }}
          >
            {auralisDNA ? "Retake DNA →" : "Discover your DNA →"}
          </Link>
        </div>

        {/* ── Style DNA hero card ──────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <StyleDNACard dna={dna} variant="hero" onEdit={openEdit} />
        </div>

        {/* ── Auralis DNA summary (shown when DNA quiz completed) ───── */}
        {auralisDNA && (
          <div
            style={{
              background: "#f5f5f0",
              borderRadius: 2,
              padding: "18px 20px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", marginBottom: 4 }}>
                Auralis DNA
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
                {auralisDNA.primaryStyle || "Curated"}
                {auralisDNA.secondaryStyle ? ` × ${auralisDNA.secondaryStyle}` : ""}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(auralisDNA.colors || []).slice(0, 4).map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 11,
                      border: "1px solid var(--border)",
                      borderRadius: 20,
                      padding: "3px 10px",
                      background: "#fff",
                    }}
                  >
                    {c}
                  </span>
                ))}
                {(auralisDNA.brands || []).slice(0, 3).map((b) => (
                  <span
                    key={b}
                    style={{
                      fontSize: 11,
                      border: "1px solid #111",
                      borderRadius: 20,
                      padding: "3px 10px",
                      background: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/dna"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 2,
                padding: "8px 14px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#111",
                flexShrink: 0,
              }}
            >
              Edit DNA →
            </Link>
          </div>
        )}

        {/* ── Stats row ────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 36 }}>
          <StatCard
            value={savedCount}
            label="Saved items"
            href="/edit"
            sub={savedCount === 1 ? "1 piece" : `${savedCount} pieces`}
          />
          <StatCard
            value={recentCount}
            label="Recently viewed"
            sub="Last session"
          />
          <StatCard
            value={signalCount}
            label="Style signals"
            sub="DNA inputs"
          />
        </div>

        {/* ── Preferences editor ───────────────────────────────────── */}
        <div
          ref={editRef}
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 28,
            marginBottom: 36,
            display: editOpen || dna.primaryStyle ? "block" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <SectionTitle>Style Controls</SectionTitle>
            <button
              onClick={() => setEditOpen((v) => !v)}
              style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 12, color: "var(--muted)", textDecoration: "underline" }}
            >
              {editOpen ? "Collapse" : "Edit all"}
            </button>
          </div>

          {editOpen && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10, color: "var(--muted)" }}>Favourite brands</div>
                <ToggleGroup options={ALL_BRANDS} selected={dna.brands || []} onToggle={toggle("brands")} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10, color: "var(--muted)" }}>Preferred colours</div>
                <ToggleGroup options={COLOURS} selected={dna.colors || []} onToggle={toggle("colors")} colours />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10, color: "var(--muted)" }}>Sizes</div>
                <ToggleGroup options={SIZES} selected={dna.sizes || []} onToggle={toggle("sizes")} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10, color: "var(--muted)" }}>Fit preference</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {FITS.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      active={dna.fit === f.toLowerCase()}
                      onClick={() => setFit(f.toLowerCase())}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                style={{
                  background: "#111",
                  color: "#fff",
                  border: 0,
                  padding: "13px 32px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Save changes
              </button>
              <p style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
                Your preferences are applied instantly across the shop.{" "}
                <Link href="/dna" style={{ textDecoration: "underline" }}>Retake DNA quiz →</Link>
              </p>
            </div>
          )}
        </div>

        {/* ── Inspiration / Aesthetic boards ───────────────────────── */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <SectionTitle>Aesthetic Inspiration</SectionTitle>
            {aesthetics.length > 0 && (
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{aesthetics.length} selected</span>
            )}
          </div>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
            Pick the aesthetics that resonate with you. We'll refine your picks to match.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {AESTHETIC_BOARDS.map((board) => (
              <AestheticBoard
                key={board.id}
                board={board}
                selected={aesthetics}
                onToggle={toggleAesthetic}
              />
            ))}
          </div>
          {aesthetics.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center" }}>Inspired by:</span>
              {aesthetics.map((id) => {
                const board = AESTHETIC_BOARDS.find((b) => b.id === id);
                return board ? (
                  <span
                    key={id}
                    style={{
                      fontSize: 11,
                      border: "1px solid #111",
                      borderRadius: 20,
                      padding: "4px 10px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {board.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

      </section>

      <Toast message="Style DNA updated ✨" visible={toast} />
    </main>
  );
}
