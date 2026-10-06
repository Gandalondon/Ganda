"use client";

import { useEffect } from "react";

// Scroll-in blur reveal for images and work grid tiles. Text is never
// animated: it is always there and sharp.
//
// Only things that arrive from below the fold animate. Anything already on
// screen when it appears (page load, client-side navigation, Storyblok data
// arriving) is left alone and simply shows, with no movement. Off-screen
// images are marked data-fade="pending" (slightly blurred, in globals.css) and
// then "in" as they scroll into view, when they sharpen. The "gd-fade" flag on
// <html> (set before first paint by the inline script in app/layout.tsx, only
// when motion is allowed and the page is not inside an iframe, e.g. the
// Storyblok visual editor) switches it on. Images opt in with data-fade-media;
// work grid tiles count as images.
//
// To turn it all off: set FADE_ENABLED to false in app/layout.tsx. To remove
// the code: delete this file, <FadeUp /> and the boot script in
// app/layout.tsx, and the ".gd-fade" block in globals.css.

// Keep in sync with the selector in globals.css.
// Images are marked data-fade-media; work grid tiles (image + label) are
// handled as one unit, so anything inside the grid is skipped.
const IMAGE_SELECTOR = "[data-fade-media]";
const EXCLUDE_SELECTOR = ".gd-grid-3 *, .gd-list *, .sr-only";
const TILE_SELECTOR = ".gd-grid-3 > a, .gd-list > li";

export default function FadeUp() {
  useEffect(() => {
    const root = document.documentElement;
    // Flag absent = reduced motion, iframe, or the boot script did not run.
    if (!root.classList.contains("gd-fade")) return;
    (window as unknown as { __gdFade?: boolean }).__gdFade = true;

    const seen = new WeakSet<Element>();

    const onHit = (
      entries: IntersectionObserverEntry[],
      obs: IntersectionObserver,
    ) => {
      const hits = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) =>
          a.target.compareDocumentPosition(b.target) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        );
      for (const entry of hits) {
        const el = entry.target as HTMLElement;
        el.setAttribute("data-fade", "in");
        obs.unobserve(el);
      }
    };

    // Images unblur as they scroll into view: the effect starts once the top
    // edge is 8% up from the bottom of the screen, so you actually see it.
    const mediaIo = new IntersectionObserver(onHit, {
      threshold: 0,
      rootMargin: "0px 0px -8% 0px",
    });

    // Already on screen (or scrolled past) as it appears: leave it alone, so
    // it shows with no movement. Otherwise hide it and wait for the scroll.
    const track = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.setAttribute("data-fade", "pending");
      mediaIo.observe(el);
    };

    const scan = () => {
      document.querySelectorAll(IMAGE_SELECTOR).forEach((el) => {
        if (!el.matches(EXCLUDE_SELECTOR)) track(el);
      });
      document.querySelectorAll(TILE_SELECTOR).forEach(track);
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
      mediaIo.disconnect();
    };
  }, []);

  return null;
}
