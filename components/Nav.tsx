"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "28px 24px 0",
      }}
    >
      <Link href="/" aria-label="Ganda home">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" fill="#231F20" />
          <text
            x="6"
            y="23"
            fill="white"
            fontSize="16"
            fontFamily="DM Sans, sans-serif"
            fontWeight="400"
          >
            G
          </text>
        </svg>
      </Link>
      <nav style={{ display: "flex", gap: "24px", fontSize: "0.9375rem" }}>
        <Link href="/about">About</Link>
        <Link href="mailto:tony@gandalondon.com">Connect</Link>
      </nav>
    </header>
  );
}
