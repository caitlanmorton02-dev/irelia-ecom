"use client";

/**
 * Renders the user's active Style DNA as removable filter chips.
 * removedChips: Set of chip keys already dismissed in this session.
 * onRemove: called with the chip key e.g. "vibe:Minimal", "color:Black".
 */
export default function StyleDNAChips({ dna, removedChips = new Set(), onRemove }) {
  const all = [
    ...(dna.vibes || []).map((v) => ({ key: `vibe:${v}`, label: v, type: "vibe" })),
    ...(dna.brands || []).map((b) => ({ key: `brand:${b}`, label: b, type: "brand" })),
    ...(dna.colors || []).map((c) => ({ key: `color:${c}`, label: c, type: "color" })),
    ...(dna.stores || []).map((s) => ({ key: `store:${s}`, label: s, type: "store" })),
  ].filter((chip) => !removedChips.has(chip.key));

  if (!all.length) return null;

  const typeColor = {
    vibe: "#111",
    brand: "#444",
    color: "#444",
    store: "#444",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
      <span
        style={{
          fontSize: 10,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          flexShrink: 0,
        }}
      >
        Your DNA
      </span>
      {all.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onRemove(chip.key)}
          className="dna-chip"
          style={{ borderColor: typeColor[chip.type] }}
          title={`Remove ${chip.label} from active filters`}
        >
          {chip.label}
          <span style={{ fontSize: 9, opacity: 0.5, lineHeight: 1 }}>✕</span>
        </button>
      ))}
    </div>
  );
}
