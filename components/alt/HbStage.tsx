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
// This component only measures two layout values (the nav's name and logo
// masks are driven by components/Nav.tsx, which reads where GANDA and the work
// section are). Reduced motion: the stage is not pinned (ordinary scrolling).
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
    if (!el || !work) return;

    const round = (v: number) => Math.round(v * 10) / 10;

    // Layout values (change on resize and when the font arrives). --hb-fit:
    // from the top of the work section to the foot of the first project row,
    // so the opening screen ends with that whole row in view. --hb-h: the
    // stage's own height, so a stage taller than the screen (a short phone)
    // still pins with its foot at the bottom of the screen.
    const measure = () => {
      const row = work.querySelector<HTMLElement>(".gd-row");
      if (row) {
        const w = work.getBoundingClientRect();
        const r = row.getBoundingClientRect();
        el.style.setProperty("--hb-fit", `${round(r.bottom - w.top)}px`);
      }
      el.style.setProperty("--hb-h", `${el.offsetHeight}px`);
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
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
