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
      const fit = h.top + (n.top + n.height / 2 - h.bottom);
      el.style.setProperty("--alt-fit", `${Math.round(fit * 10) / 10}px`);

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
        <span className="sr-only">Ganda</span>
        <span aria-hidden="true">GANDA</span>
      </h1>
      <div className="alt-intro-row">
        <p className="alt-intro">{intro}</p>
      </div>
    </section>
  );
}
