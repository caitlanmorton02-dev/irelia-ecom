"use client";

/**
 * SaveIcon — bookmark-style save indicator.
 * Outline = unsaved, Filled = saved.
 */
export default function SaveIcon({ saved, size = 14 }) {
  return saved ? (
    <svg
      width={size}
      height={Math.round(size * 1.28)}
      viewBox="0 0 16 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 1h10a2 2 0 012 2v15l-7-4-7 4V3a2 2 0 012-2z" />
    </svg>
  ) : (
    <svg
      width={size}
      height={Math.round(size * 1.28)}
      viewBox="0 0 16 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 1h10a2 2 0 012 2v15l-7-4-7 4V3a2 2 0 012-2z" />
    </svg>
  );
}
