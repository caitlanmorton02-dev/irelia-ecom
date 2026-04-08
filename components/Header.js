"use client";

import Link from "next/link";

export default function Header({ savedCount = 0 }) {
  return (
    <header style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "#fff", zIndex: 50 }}>
      <div className="container" style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ letterSpacing: "0.16em", fontWeight: 700, fontSize: 17 }}>
          IRELIA
        </Link>
        <nav style={{ display: "flex", gap: 18, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <Link href="/shop">Shop</Link>
          <Link href="/edit">Your Edit {savedCount > 0 ? `(${savedCount})` : ""}</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </div>
    </header>
  );
}
