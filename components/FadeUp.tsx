"use client";

import { useEffect } from "react";

// Scroll-in fade-up for text (h1/h2/h3/p inside <main>, plus the closing CTA).
//
// The hidden start state lives in globals.css (".gd-fade" block) and is keyed
// on an <html class="gd-fade"> flag that the inline script in app/layout.tsx
// sets before first paint, only when motion is allowed and the page is not
// inside an iframe (e.g. the Storyblok visual editor). This component reveals
// elements once, as they reach 15% visibility, staggering siblings that
// arrive together by 60ms.
//
// To remove the effect entirely: delete this file, its <FadeUp /> in
// app/layout.tsx, the inline boot script there, and the ".gd-fade" block in
// globals.css.

// Keep in sync with the selector in globals.css.
const TEXT_SELECTOR = "main :is(h1, h2, h3, p), footer p";
const EXCLUDE_SELECTOR = ".gd-grid-3 *, .sr-only";
const STAGGER_MS = 60;
// Stop a long list (e.g. the client names) from taking seconds to finish.
const MAX_STAGGER_STEPS = 8;

export default function FadeUp() {
  useEffect(() => {
    const root = document.documentElement;
    // Flag absent = reduced motion, iframe, or the boot script did not run.
    if (!root.classList.contains("gd-fade")) return;
    (window as unknown as { __gdFade?: boolean }).__gdFade = true;

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) =>
            a.target.compareDocumentPosition(b.target) &
            Node.DOCUMENT_POSITION_FOLLOWING
              ? -1
              : 1,
          );
        const perParent = new Map<Element | null, number>();
        for (const entry of hits) {
          const el = entry.target as HTMLElement;
          const parent = el.parentElement;
          const n = perParent.get(parent) ?? 0;
          perParent.set(parent, n + 1);
          el.style.transitionDelay = `${Math.min(n, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
          el.setAttribute("data-fade", "in");
          io.unobserve(el);
          // Drop the inline delay once done so it cannot affect later
          // transitions on the same element.
          el.addEventListener(
            "transitionend",
            () => {
              el.style.transitionDelay = "";
            },
            { once: true },
          );
        }
      },
      { threshold: 0.15 },
    );

    const scan = () => {
      document.querySelectorAll(TEXT_SELECTOR).forEach((el) => {
        if (seen.has(el) || el.matches(EXCLUDE_SELECTOR)) return;
        seen.add(el);
        io.observe(el);
      });
    };

    // Pages swap content on client-side navigation and when Storyblok data
    // arrives, so watch for new text elements rather than scanning once.
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
