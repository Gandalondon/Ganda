"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "76px 76px 0",
      }}
    >
      <Link
        href="/"
        aria-label="Ganda — home"
        style={{ display: "block", pointerEvents: "auto" }}
      >
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
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          pointerEvents: "auto",
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
