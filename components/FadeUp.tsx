"use client";

import { useEffect } from "react";

// Scroll-in fade-up for text (h1/h2/h3/p inside <main>, plus the closing CTA),
// images and work grid tiles.
//
// Only things that arrive from below the fold animate. Anything already on
// screen when it appears (page load, client-side navigation, Storyblok data
// arriving) is left alone and simply shows, with no movement. Off-screen
// elements are marked data-fade="pending" (hidden, in globals.css) and then
// "in" once they are 12% of the screen up from the bottom edge, staggering siblings that arrive
// together by 60ms. The "gd-fade" flag on <html> (set before first paint by
// the inline script in app/layout.tsx, only when motion is allowed and the
// page is not inside an iframe, e.g. the Storyblok visual editor) switches the
// whole thing on.
//
// Elements with data-fade-block (e.g. a quote and its byline) fade as one
// unit; their children are not animated separately. This is applied
// automatically to any container holding a long run of paragraphs (a list). Images (and the
// prototype iframe) opt in with data-fade-media: they do not fade or move,
// they start very slightly blurred and sharpen, quickly, as they scroll into
// view. Work grid tiles count as images.
//
// To turn it all off: set FADE_ENABLED to false in app/layout.tsx. To remove
// the code: delete this file, <FadeUp /> and the boot script in
// app/layout.tsx, and the ".gd-fade" blocks in globals.css.

// Keep in sync with the selector in globals.css.
const TEXT_SELECTOR =
  "main :is(h1, h2, h3, p), footer p, [data-fade-block], [data-fade-media]";
const EXCLUDE_SELECTOR = ".gd-grid-3 *, .sr-only, [data-fade-block] *";
const TILE_SELECTOR = ".gd-grid-3 > a";
// Images: marked data-fade-media, plus the work grid tiles (image + label).
const MEDIA_SELECTOR = "[data-fade-media], .gd-grid-3 > a";
// A container with this many (or more) paragraphs directly inside it is
// treated as a list, and fades in as one block rather than line by line.
const LIST_MIN_PARAGRAPHS = 5;
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
      const perParent = new Map<Element | null, number>();
      for (const entry of hits) {
        const el = entry.target as HTMLElement;
        const parent = el.parentElement;
        const n = perParent.get(parent) ?? 0;
        perParent.set(parent, n + 1);
        // Grid tiles and images reveal with no stagger.
        const noStagger = el.matches(`${TILE_SELECTOR}, ${MEDIA_SELECTOR}`);
        el.style.transitionDelay = noStagger
          ? ""
          : `${Math.min(n, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
        el.setAttribute("data-fade", "in");
        obs.unobserve(el);
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
    };

    // Reveal once an element's top edge is 12% of the viewport above the
    // bottom edge. (A percentage-visible threshold never fires for an
    // element much taller than the screen, e.g. a full-page screenshot.)
    const io = new IntersectionObserver(onHit, {
      threshold: 0,
      rootMargin: "0px 0px -12% 0px",
    });
    // Images unblur just before they scroll into view, so they are already
    // sharp by the time they are seen.
    const mediaIo = new IntersectionObserver(onHit, {
      threshold: 0,
      rootMargin: "0px 0px 10% 0px",
    });

    // Already on screen (or scrolled past) as it appears: leave it alone, so
    // it shows with no movement. Otherwise hide it and wait for the scroll.
    const track = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.setAttribute("data-fade", "pending");
      (el.matches(MEDIA_SELECTOR) ? mediaIo : io).observe(el);
    };

    // Global rule: any run of LIST_MIN_PARAGRAPHS+ sibling paragraphs (a long
    // list of names, say) is one block, so it never fades line by line.
    const markLists = () => {
      const parents = new Set<Element>();
      document.querySelectorAll("main p, footer p").forEach((p) => {
        const parent = p.parentElement;
        if (parent && !parent.closest(`[data-fade-block], .gd-grid-3`)) {
          parents.add(parent);
        }
      });
      parents.forEach((parent) => {
        const count = Array.from(parent.children).filter(
          (c) => c.tagName === "P",
        ).length;
        if (count >= LIST_MIN_PARAGRAPHS) {
          parent.setAttribute("data-fade-block", "");
        }
      });
    };

    const scan = () => {
      markLists();
      document.querySelectorAll(TEXT_SELECTOR).forEach((el) => {
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
      io.disconnect();
      mediaIo.disconnect();
    };
  }, []);

  return null;
}
