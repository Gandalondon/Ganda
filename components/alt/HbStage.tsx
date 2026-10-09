"use client";

import { useLayoutEffect, useRef } from "react";

// Opening screen for the alternative home B (/hero-b): the introduction near
// the top, GANDA at the foot of the screen, and the work arriving over it.
//
// The stage is pinned (position: sticky, in hb.css) while the work section,
// which comes after it and has an opaque white background, scrolls up over it.
// So the work's top edge rises through GANDA from the bottom: the foot of the
// letters is covered first and the edge climbs until the word has gone. Nothing
// is faded, moved or scaled; it is plain layers.
//
// This component only (1) measures two layout values and (2) turns the scroll
// position into two numbers for the nav:
//
//   --hb-n  0 to 1: how much of GANDA the work has covered. The nav name is
//           masked away from the bottom upwards by the same amount.
//   --hb-l  0 to 1: starts once GANDA is completely covered, over the next
//           ~96px of scrolling. The small logo is revealed from the top down.
//
// Both come from where the word and the work actually are on screen, on every
// scroll frame, so scrolling up simply runs it backwards. Reduced motion: the
// stage is not pinned (ordinary scrolling) and the nav swaps in one step.
export default function HbStage({
  fontClass,
  intro,
}: {
  fontClass: string;
  intro: string;
}) {
  const stage = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = stage.current;
    const work = document.querySelector<HTMLElement>(".hb-work");
    const word = el?.querySelector<HTMLElement>(".hb-wordmark");
    const header = document.querySelector("header");
    if (!el || !work || !word || !header) return;

    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const round = (v: number) => Math.round(v * 10) / 10;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    // Layout values (change on resize and when the font arrives). --hb-fit:
    // from the top of the work section to the middle of the first project
    // title, so the opening screen ends halfway through that title. --hb-h:
    // the stage's own height, so a stage taller than the screen (a short
    // phone) still pins with its foot at the bottom of the screen.
    const measure = () => {
      const name = work.querySelector<HTMLElement>(".gd-row-name");
      if (name) {
        const w = work.getBoundingClientRect();
        const n = name.getBoundingClientRect();
        el.style.setProperty("--hb-fit", `${round(n.top + n.height / 2 - w.top)}px`);
      }
      el.style.setProperty("--hb-h", `${el.offsetHeight}px`);
    };

    const update = () => {
      let n: number;
      let l: number;
      const w = word.getBoundingClientRect();
      if (reduce.matches) {
        const gone = w.bottom <= header.getBoundingClientRect().bottom;
        n = gone ? 1 : 0;
        l = gone ? 1 : 0;
      } else {
        // The letters' ink, not the text box: the round G rises about 0.022em
        // above the box (and sinks 0.004em below it), so "covered" is counted
        // between those, and the word is completely covered, with no sliver
        // left, exactly when n reaches 1.
        const fs = parseFloat(getComputedStyle(word).fontSize);
        const inkBottom = w.bottom + 0.004 * fs;
        const ink = w.height + 0.026 * fs;
        const covered = inkBottom - work.getBoundingClientRect().top;
        // The logo's reveal is 96px of scrolling (96px at 1728px wide and
        // below, then scaled with the page, as --u in globals.css).
        const ramp = 96 * Math.min(2, Math.max(1, window.innerWidth / 1728));
        n = clamp(covered / ink);
        l = clamp((covered - ink) / ramp);
      }
      root.style.setProperty("--hb-n", String(round(n * 1000) / 1000));
      root.style.setProperty("--hb-l", String(round(l * 1000) / 1000));
      root.classList.toggle("hb-logo", l > 0);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", onResize);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", onResize);
      root.style.removeProperty("--hb-n");
      root.style.removeProperty("--hb-l");
      root.classList.remove("hb-logo");
    };
  }, []);

  return (
    <section ref={stage} className="hb-stage gd-container">
      <h1 className={`hb-wordmark ${fontClass}`}>Ganda</h1>
      <div className="hb-intro-row">
        <p className="hb-intro">{intro}</p>
      </div>
    </section>
  );
}
