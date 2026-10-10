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
  // scrolls, as two masks that run one after the other, never together:
  //
  //   --nav-n  0 to 1: the name is masked away from the bottom upwards.
  //   --nav-l  0 to 1: starts when --nav-n has finished; the logo is revealed
  //            from the bottom upwards.
  //
  // Both come from the live scroll position, so scrolling back up runs it
  // backwards. Neither starts until the page has caught up with the nav: on
  // the home page, until the work section (which rises over GANDA) reaches the
  // bottom of the nav; on every other page, until the first block of content
  // does (and never before 64px of scrolling). So the first part of a scroll,
  // when a phone's browser bar is collapsing and the page is moving up under
  // the finger, changes nothing in the nav. After that point it takes 128px of
  // scrolling for the name, then 96px for the logo (both scaled up with the
  // page above 1728px wide, as --u in globals.css). Reduced motion: no
  // in-between, one step at the same point. On the home page the nav is also
  // transparent over the dark opening screen, and the white work section
  // passes behind it: a second, dark copy of the nav (the ghost, hidden from
  // everything but the eye) is cut off at the work section's top edge, so
  // each pixel of the nav is white-on-black above the edge and dark-on-white
  // below it, all the way up. When the edge reaches the top of the screen the
  // nav itself turns to the usual white one (nav-light on <html>) and the
  // ghost is dropped. That is the same moment and the same scroll as the name
  // to logo swap, which both copies share. The class nav-logo is on <html>
  // once the logo has started, so the keyboard focus ring and the screen
  // reader label follow whichever is showing. Everything is removed on
  // leaving the page.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector("header");
    if (!header) return;
    const work = document.querySelector<HTMLElement>(".hb-work");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const round = (v: number) => Math.round(v * 1000) / 1000;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const update = () => {
      const scale = Math.min(2, Math.max(1, window.innerWidth / 1728));
      const dist = 128 * scale; // the name's mask
      const ramp = 96 * scale; // the logo's mask
      const navBottom = header.getBoundingClientRect().bottom;
      // How far the page has gone on after it reached the nav, in px.
      let past: number;
      if (work) {
        // Home: the top edge of the work section against the bottom of the nav.
        past = navBottom - work.getBoundingClientRect().top;
      } else {
        // Other pages: the first heading, text or image against the nav (not
        // the wrapper round it, whose padding is empty space), with at least
        // 64px of scrolling before anything changes.
        const first = document.querySelector(
          "main h1, main h2, main h3, main p, main img, main video",
        );
        const y = window.scrollY;
        const contentTop = first
          ? first.getBoundingClientRect().top + y
          : navBottom;
        past = y - Math.max(64 * scale, contentTop - navBottom);
      }
      const n = reduce.matches ? (past > 0 ? 1 : 0) : clamp(past / dist);
      const l = reduce.matches ? n : clamp((past - dist) / ramp);
      root.style.setProperty("--nav-n", String(round(n)));
      root.style.setProperty("--nav-l", String(round(l)));
      root.classList.toggle("nav-logo", l > 0);
      // Home page only: where the white work section's top edge is on the
      // screen (the ghost nav is cut off above it), and the switch to the
      // white nav once that edge has gone up past the top of the screen.
      if (work) {
        const top = work.getBoundingClientRect().top;
        root.style.setProperty("--nav-sheet", `${round(Math.max(0, top))}px`);
        root.classList.add("nav-glass");
        root.classList.toggle("nav-light", top <= 0);
      }
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
