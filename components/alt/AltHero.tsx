"use client";

import { useLayoutEffect, useRef } from "react";
import Letters from "@/components/alt/Letters";

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
    };
  }, []);

  // Nav label. No logo on load: "Product Design" shows where it would be (set
  // in CSS, so it is there from the first paint), and once GANDA has scrolled
  // up past the nav the logo takes its place and stays. This adds the
  // alt-passed class to <html> when that happens (styles in alt.css) and
  // removes it when leaving the page.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const word =
      hero.current?.querySelector<HTMLElement>(".alt-wordmark") ?? null;
    const header = document.querySelector("header");
    if (!word || !header) return;
    const update = () => {
      const passed =
        word.getBoundingClientRect().bottom <=
        header.getBoundingClientRect().bottom;
      root.classList.toggle("alt-passed", passed);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.classList.remove("alt-passed");
    };
  }, []);

  return (
    <section ref={hero} className="alt-hero gd-container">
      <h1 className={`alt-wordmark ${fontClass}`} data-reveal="load">
        <span className="sr-only">Ganda</span>
        <Letters text="GANDA" />
      </h1>
      <div className="alt-intro-row">
        <p className="alt-intro">{intro}</p>
      </div>
    </section>
  );
}
