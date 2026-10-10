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
  const isHome = pathname === "/";

  // Name to logo swap (the styles are in app/alt/alt.css). The name shows at
  // the top left on every page and the logo takes its place as the page
  // scrolls, as one wipe: both are masked from the bottom upwards along the
  // same line, so above the line it is still the name and below it already
  // the logo. Two variables, both from the live scroll position (scrolling
  // back up runs it backwards):
  //
  //   --nav-n  0 to 1: how far up the name has been masked away.
  //   --nav-l  0 to 1: how far up the logo has been revealed, worked out from
  //            --nav-n so that the two edges are on the same line.
  //
  // It does not start until the page has caught up with the nav: until the
  // first block of content (heading, text or image, not the wrapper round it,
  // whose padding is empty space) reaches it, and never before 64px of
  // scrolling. So the first part of a scroll, when a phone's browser bar is
  // collapsing and the page is moving up under the finger, changes nothing in
  // the nav. Then it takes 80px of scrolling (scaled up with the page above
  // 1728px wide, as --u in globals.css). Reduced motion: no in-between, one
  // step at the same point. The colours are the page's own (white on the
  // black Writing page, dark on the white pages).
  //
  // The home page does it differently, with no scroll distances of its own:
  // the nav is transparent over the dark opening screen, white name and
  // links, and the white work section rising up through it is the mask. A
  // second copy of the nav (the ghost: dark, with the logo and no name) is
  // cut off above the work section's top edge, so above the edge it is the
  // white name on black and below it the dark logo on white, one wipe, from
  // the bottom upwards, and the links turn dark along the same edge. When the
  // edge reaches the top of the screen the nav itself becomes the usual white
  // one with the logo (nav-light, --nav-n and --nav-l at 1) and the ghost is
  // dropped. The class nav-logo is on <html> once the logo has started, so the
  // keyboard focus ring and the screen reader label follow whichever is
  // showing. Everything is removed on leaving the page.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector("header");
    if (!header) return;
    const work = document.querySelector<HTMLElement>(".hb-work");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const round = (v: number) => Math.round(v * 1000) / 1000;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const update = () => {
      if (work) {
        // Home: where the work section's top edge is on the screen. The ghost
        // nav is cut off above it (--nav-sheet), and once it has gone up past
        // the top of the screen the nav is the white one with the logo.
        const top = work.getBoundingClientRect().top;
        const done = top <= 0 ? 1 : 0;
        root.style.setProperty("--nav-sheet", `${round(Math.max(0, top))}px`);
        root.style.setProperty("--nav-n", String(done));
        root.style.setProperty("--nav-l", String(done));
        root.classList.add("nav-glass");
        root.classList.toggle("nav-light", done === 1);
        root.classList.toggle("nav-logo", done === 1);
        return;
      }
      const scale = Math.min(2, Math.max(1, window.innerWidth / 1728));
      const navBottom = header.getBoundingClientRect().bottom;
      const first = document.querySelector(
        "main h1, main h2, main h3, main p, main img, main video",
      );
      const y = window.scrollY;
      const contentTop = first
        ? first.getBoundingClientRect().top + y
        : navBottom;
      const past = y - Math.max(64 * scale, contentTop - navBottom);
      // The line where the name is cut off (its mask reaches 6px past its box
      // each way) is the line where the logo starts, so the two meet along it.
      // h is the height of both: the 24 * --u nav row.
      const h = 24 * scale;
      const n = reduce.matches
        ? past > 0
          ? 1
          : 0
        : clamp(past / (80 * scale));
      const l = clamp(1 - ((1 - n) * (h + 12) - 6) / h);
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
      root.style.removeProperty("--nav-sheet");
      root.classList.remove("nav-logo", "nav-light", "nav-glass");
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

  const headerStyle = {
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "var(--gd-header-top)",
    paddingBottom: "var(--gd-header-gap)",
  } as const;

  const links = (
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
  );

  return (
    <>
      <header
        className="gd-container"
        style={{
          ...headerStyle,
          display: "flex",
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
          {links}
        </nav>
      </header>
      {isHome && (
        // The ghost: the same nav in the dark, fixed in the same place, shown
        // only while the work section is passing behind the nav, and cut off
        // above that section's top edge (alt.css / hb.css). It is only for
        // the eye: hidden from screen readers, not focusable, not clickable.
        <header
          className="gd-container nav-ghost"
          aria-hidden="true"
          inert
          style={{
            ...headerStyle,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 51,
            pointerEvents: "none",
          }}
        >
          <Link
            href="/"
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: "block" }}
          >
            <Image src="/logo-mark.svg" alt="" width={24} height={24} />
          </Link>
          <nav aria-hidden="true">{links}</nav>
        </header>
      )}
    </>
  );
}
