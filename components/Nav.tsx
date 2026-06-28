"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "28px 24px 0",
      }}
    >
      <Link href="/" aria-label="Ganda home">
        {/* Geometric logo mark — two rectangles forming a stylised bracket/G */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0"
            y="0"
            width="36"
            height="36"
            fill="none"
            stroke="#231F20"
            strokeWidth="3"
          />
          <rect x="9" y="9" width="18" height="9" fill="#231F20" />
        </svg>
      </Link>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "4px",
          fontSize: "0.9375rem",
        }}
      >
        <Link href="/about">About</Link>
        <Link href="mailto:tony@gandalondon.com">Connect</Link>
      </nav>
    </header>
  );
}
