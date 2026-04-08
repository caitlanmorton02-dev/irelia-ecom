import React, { useState } from "react";

export default function Header({ navItems, activeNav, onNavChange, savedCount, onEditOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid var(--border)" }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "var(--nav-height)",
        padding: "0 24px",
        maxWidth: 1440,
        margin: "0 auto",
        width: "100%",
      }}>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: "none", flexDirection: "column", gap: 4, padding: 4 }}
          className="mobile-menu-btn"
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 20, height: 1.5, background: "#111" }} />
          <span style={{ display: "block", width: 20, height: 1.5, background: "#111" }} />
          <span style={{ display: "block", width: 14, height: 1.5, background: "#111" }} />
        </button>

        {/* Wordmark */}
        <div style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#111",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          IRELIA
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: "auto" }}>
          <button
            onClick={onEditOpen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#111",
              padding: "6px 0",
            }}
          >
            Your Edit
            {savedCount > 0 && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 18,
                height: 18,
                background: "#111",
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 1,
                padding: "0 4px",
              }}>
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav style={{
        borderTop: "1px solid var(--border)",
        height: "var(--subnav-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}>
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavChange(item)}
            style={{
              fontSize: 12,
              fontWeight: activeNav === item ? 600 : 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#111",
              padding: "0 18px",
              height: "100%",
              borderBottom: activeNav === item ? "2px solid #111" : "2px solid transparent",
              transition: "border-color var(--transition)",
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Mobile dropdown nav */}
      {mobileMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          zIndex: 200,
        }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                onNavChange(item);
                setMobileMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "14px 24px",
                fontSize: 13,
                fontWeight: activeNav === item ? 600 : 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderBottom: "1px solid var(--border)",
                color: "#111",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
