"use client";

import { useLayoutEffect, useRef } from "react";

// Opening statement for the alternative home (/alt): GANDA across the full
// width, the introduction at the foot of the opening screen.
//
// Hero height. The opening screen should end halfway through the first
// project's title. The hero's min-height is therefore
//   100svh - --alt-fit
// where --alt-fit is the distance from the top of the page to that crop line
// *measured from the page*: the hero's own top edge, plus the gap between the
// hero's bottom edge and the middle of the first project title. Neither value
// depends on the viewport height, so the result does not move when a phone's
// browser bars show or hide (svh is the small viewport, bars showing). The CSS
// in alt.css carries a close estimate of --alt-fit so that the first paint,
// and a browser with JavaScript off, are already almost exact.
export default function AltHero({
  fontClass,
  intro,
}: {
  fontClass: string;
  intro: string;
}) {
  const hero = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = hero.current;
    if (!el) return;

    const measure = () => {
      const name = document.querySelector<HTMLElement>(".gd-list .gd-row-name");
      if (!name) return;
      const h = el.getBoundingClientRect();
      const n = name.getBoundingClientRect();
      // The hero's top edge in the document, not in the window: rects are
      // measured from the top of the window, so without adding the scroll
      // distance a measurement taken while scrolled (a resize, a late font, a
      // restored scroll position) came out too small and the hero grew.
      const fit = h.top + window.scrollY + (n.top + n.height / 2 - h.bottom);
      el.style.setProperty("--alt-fit", `${Math.round(fit * 10) / 10}px`);

      // The tallest the hero may be: its own padding, GANDA, the intro and at
      // most --alt-gap-max (256px, 240px on a phone, scaled above 1440px wide) between them. Past that
      // the hero stops following the window height, so a tall window, a
      // zoomed-out page or a big monitor shows more of the list instead of a
      // wider gap. Built from the children's own sizes, so nothing is changed
      // or re-laid-out to measure it (which could move the scroll position).
      const wordEl = el.querySelector<HTMLElement>(".alt-wordmark");
      const row = el.querySelector<HTMLElement>(".alt-intro-row");
      if (wordEl && row) {
        const cs = getComputedStyle(el);
        // 256px (240px on a phone) at 1440px wide and below, growing with the
        // page above that: the same scale as --u in globals.css, which CSS
        // cannot hand back to a script as a number.
        const scale = Math.min(2, Math.max(1, window.innerWidth / 1440));
        const cap = (window.matchMedia("(max-width: 640px)").matches ? 240 : 256) * scale;
        const max =
          parseFloat(cs.paddingTop) +
          parseFloat(cs.paddingBottom) +
          wordEl.getBoundingClientRect().height +
          row.getBoundingClientRect().height +
          cap;
        el.style.setProperty("--alt-max", `${Math.round(max * 10) / 10}px`);
      }

      // The gap between GANDA and the intro. The closing statement uses the
      // same distance above it (see .alt-talk in alt.css), so the top and the
      // bottom of the page mirror each other.
      const word = el.querySelector<HTMLElement>(".alt-wordmark");
      const intro = el.querySelector<HTMLElement>(".alt-intro");
      if (word && intro) {
        const gap =
          intro.getBoundingClientRect().top - word.getBoundingClientRect().bottom;
        document.documentElement.style.setProperty(
          "--alt-hero-gap",
          `${Math.round(gap * 10) / 10}px`,
        );
      }
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      document.documentElement.style.removeProperty("--alt-hero-gap");
    };
  }, []);

  return (
    <section ref={hero} className="alt-hero gd-container">
      <h1 className={`alt-wordmark ${fontClass}`}>
        Ganda
      </h1>
      <div className="alt-intro-row">
        <p className="alt-intro">{intro}</p>
      </div>
    </section>
  );
}
