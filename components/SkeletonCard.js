"use client";

export default function SkeletonCard() {
  return (
    <div>
      <div
        className="skeleton"
        style={{ width: "100%", aspectRatio: "3/4", borderRadius: 2 }}
      />
      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
        <div className="skeleton" style={{ height: 11, width: "55%", borderRadius: 2 }} />
        <div className="skeleton" style={{ height: 13, width: "80%", borderRadius: 2 }} />
        <div className="skeleton" style={{ height: 11, width: "40%", borderRadius: 2 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "28px 18px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
