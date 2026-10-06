"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isWriting = pathname === "/writing";
  // Carwow case study: hide the global Book-a-call link on this page
  // only (About stays).
  const isCarwow = pathname === "/work/carwow";
  const linkStyle = {
    fontSize: "var(--type-small)",
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
        paddingBottom: "var(--gd-header-gap)",
        // Sticky header. It sits at the same distance from the top of the
        // screen at rest and when stuck (--gd-header-top), so it never
        // moves. No background for now (set one here to try white). The
        // header itself ignores clicks so the empty strip between the logo
        // and the links never blocks the content underneath.
        position: "sticky",
        top: 0,
        zIndex: 50,
        pointerEvents: "none",
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
          width={32}
          height={32}
          priority
        />
      </Link>
      <nav aria-label="Site navigation" style={{ pointerEvents: "auto" }}>
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
              {!isCarwow && (
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
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
