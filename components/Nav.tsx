"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header
      className="gd-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "var(--gd-header-top)",
        paddingBottom: 0,
      }}
    >
      <Link href="/" aria-label="Ganda — home" style={{ display: "block" }}>
        <Image
          src="/logo-mark.svg"
          alt="Ganda"
          width={32}
          height={32}
          priority
        />
      </Link>
      <nav aria-label="Site navigation">
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            listStyle: "none",
          }}
        >
          <li>
            <Link
              href="/"
              style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)", color: "var(--ink)", fontWeight: 400 }}
            >
              Folio
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
