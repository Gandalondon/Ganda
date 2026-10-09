"use client";

import { useLayoutEffect, useRef } from "react";
import Letters from "@/components/alt/Letters";

const BOOKING_URL = "https://cal.com/tony-goff-yu-an7khw/intro";

// Closing statement for the alternative home (/alt). Visible by default, so it
// is complete with JavaScript off. With JavaScript and motion allowed it is
// hidden just before first paint and revealed letter by letter, once, when it
// first scrolls into view. Reduced motion never hides it.
export default function AltTalk({ fontClass }: { fontClass: string }) {
  const footer = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = footer.current;
    if (!el || el.dataset.reveal === "in") return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={footer} className="alt-talk gd-container">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`alt-talk-link ${fontClass}`}
      >
        <span className="sr-only">
          Let’s talk: book a call (opens in new tab)
        </span>
        <Letters text="Let’s talk" />
      </a>
    </footer>
  );
}
