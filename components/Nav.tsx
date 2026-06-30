"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1680,
        margin: "0 auto",
        padding: "80px 80px 0",
        boxSizing: "border-box",
      }}
    >
      <Link href="/" aria-label="Ganda — home" style={{ display: "block" }}>
        <Image
          src="/logo-mark.svg"
          alt="Ganda"
          width={40}
          height={40}
          priority
        />
      </Link>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 32,
        }}
      >
        <Link href="/about" style={{ fontSize: 18, color: "var(--ink)" }}>
          About
        </Link>
        <a
          href="https://cal.com/tony-goff-yu-an7khw/intro"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 18, color: "var(--ink)" }}
        >
          Connect
        </a>
      </div>
    </header>
  );
}
