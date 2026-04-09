"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ savedCount = 0 }) {
  const path = usePathname();

  const navLink = (href, label) => (
    <Link
      href={href}
      style={{
        opacity: path === href ? 1 : 0.6,
        fontWeight: path === href ? 600 : 400,
        transition: "opacity 0.15s",
      }}
    >
      {label}
    </Link>
  );

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ letterSpacing: "0.16em", fontWeight: 700, fontSize: 17 }}>
          AURALIS
        </Link>

        <nav
          style={{
            display: "flex",
            gap: 20,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            alignItems: "center",
          }}
        >
          {navLink("/shop", "Shop")}
          {navLink(
            "/edit",
            savedCount > 0 ? `Your Edit (${savedCount})` : "Your Edit"
          )}
          {navLink("/dna", "Your DNA")}
          {navLink("/profile", "Account")}
        </nav>
      </div>
    </header>
  );
}
