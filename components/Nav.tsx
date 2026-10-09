"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Nav() {
  const pathname = usePathname();
  const isWriting = pathname === "/writing";
  // Carwow case study: hide the global Book-a-call link on this page
  // only (About stays).
  const isCarwow = pathname === "/work/carwow";
  // Name to logo swap (the styles are in app/alt/alt.css). The name shows at
  // the top left on every page, and the logo takes its place once the page has
  // scrolled: on the home page when GANDA has gone up past the nav, elsewhere
  // after 64px. Sets the alt-passed class on <html>; removed on leaving.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => {
      const word = document.querySelector<HTMLElement>(".alt-wordmark");
      const passed = word
        ? word.getBoundingClientRect().bottom <=
          header.getBoundingClientRect().bottom
        : window.scrollY > 64;
      root.classList.toggle("alt-passed", passed);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.classList.remove("alt-passed");
    };
  }, [pathname]);

  const linkStyle = {
    fontSize: "var(--type-small)",
    color: "var(--ink)",
    fontWeight: 400,
    // Same height as the 24px logo, so the two centre on one line and the
    // header is 24px tall under its padding.
    lineHeight: "24px",
    display: "block",
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
        // moves. The white band behind it is header::before in alt.css (not
        // a background here, so the spacer under the nav stays see-through).
        // The header itself ignores clicks so the empty strip between the
        // logo and the links never blocks the content underneath.
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
          width={24}
          height={24}
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
