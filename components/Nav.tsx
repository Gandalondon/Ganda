"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isWriting = pathname === "/writing";
  const linkStyle = {
    fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
    color: "var(--ink)",
    fontWeight: 400,
  };

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
          {isWriting ? (
            <li>
              <Link href="/" style={linkStyle}>
                Folio
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/about" style={linkStyle}>
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://cal.com/tony-goff-yu-an7khw/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Book a call (opens in new tab)"
                  style={linkStyle}
                >
                  Book a call
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
