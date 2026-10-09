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
  // the top left on every page and the logo takes its place as the page
  // scrolls, as two masks that run one after the other, never together:
  //
  //   --nav-n  0 to 1: the name is masked away from the bottom upwards.
  //   --nav-l  0 to 1: starts when --nav-n has finished; the logo is revealed
  //            from the bottom upwards.
  //
  // Both come from the live scroll position, so scrolling back up runs it
  // backwards. On the home page the position is where the work section is on
  // top of GANDA (the name goes as the letters are covered, then the logo);
  // on every other page it is the distance scrolled: 128px for the name, then
  // 96px for the logo (both scaled up with the page above 1728px wide, as
  // --u in globals.css). Reduced motion: no in-between, one step. The class
  // nav-logo is on <html> once the logo has started, so the keyboard focus
  // ring and the screen reader label follow whichever is showing. Everything
  // is removed on leaving the page.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector("header");
    if (!header) return;
    const word = document.querySelector<HTMLElement>(".hb-wordmark");
    const work = document.querySelector<HTMLElement>(".hb-work");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const round = (v: number) => Math.round(v * 1000) / 1000;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const update = () => {
      const scale = Math.min(2, Math.max(1, window.innerWidth / 1728));
      const ramp = 96 * scale;
      let n: number;
      let l: number;
      if (word && work) {
        const w = word.getBoundingClientRect();
        if (reduce.matches) {
          const gone = w.bottom <= header.getBoundingClientRect().bottom;
          n = gone ? 1 : 0;
          l = n;
        } else {
          // The letters' ink, not the text box: the round G rises about
          // 0.022em above the box (and sinks 0.004em below it), so "covered"
          // is counted between those and the word is completely covered, with
          // no sliver left, exactly when n reaches 1.
          const fs = parseFloat(getComputedStyle(word).fontSize);
          const inkBottom = w.bottom + 0.004 * fs;
          const ink = w.height + 0.026 * fs;
          const covered = inkBottom - work.getBoundingClientRect().top;
          n = clamp(covered / ink);
          l = clamp((covered - ink) / ramp);
        }
      } else {
        const y = window.scrollY;
        if (reduce.matches) {
          n = y > 64 ? 1 : 0;
          l = n;
        } else {
          const dist = 128 * scale;
          n = clamp(y / dist);
          l = clamp((y - dist) / ramp);
        }
      }
      root.style.setProperty("--nav-n", String(round(n)));
      root.style.setProperty("--nav-l", String(round(l)));
      root.classList.toggle("nav-logo", l > 0);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    document.fonts?.ready.then(onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
      root.style.removeProperty("--nav-n");
      root.style.removeProperty("--nav-l");
      root.classList.remove("nav-logo");
    };
  }, [pathname]);

  const linkStyle = {
    fontSize: "var(--type-small)",
    color: "var(--ink)",
    fontWeight: 300,
    // Same height as the logo (24 * --u), so the two centre on one line and
    // the header is that tall under its padding.
    lineHeight: "calc(24 * var(--u))",
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
        // The writing page is the one exception to the job title: there the
        // name reads "Writer" (data-role, styled in alt.css).
        aria-label={`Tony Goff-Yu, ${isWriting ? "Writer" : "Product Designer"} (Ganda home)`}
        data-role={isWriting ? "writer" : undefined}
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
            gap: "calc(32 * var(--u))",
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
