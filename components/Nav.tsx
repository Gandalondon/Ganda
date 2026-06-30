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
          width={40}
          height={40}
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
              href="/about"
              style={{ fontSize: 18, color: "var(--ink)", fontWeight: 300 }}
            >
              About
            </Link>
          </li>
          <li>
            <a
              href="https://cal.com/tony-goff-yu-an7khw/intro"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 18, color: "var(--ink)", fontWeight: 300 }}
            >
              Book a call
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
