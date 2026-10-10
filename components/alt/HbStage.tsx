"use client";

import { useLayoutEffect, useRef } from "react";

// Opening screen for the home page: dark, the introduction near the top and
// GANDA at the foot of the screen, with the work (the first project is below
// the fold) arriving over it as a white sheet.
//
// The stage is pinned (position: sticky, in hb.css) while the work section,
// which comes after it and has an opaque white background, scrolls up over it.
// So the work's top edge rises through GANDA from the bottom: the foot of the
// letters is covered first and the edge climbs until the word has gone. Nothing
// is faded, moved or scaled; it is plain layers.
//
// This component only measures the stage's height (the nav's colours and its
// name and logo masks are driven by components/Nav.tsx, which reads where the
// work section is). Reduced motion: the stage is not pinned (ordinary
// scrolling).
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

    // Layout value (changes on resize and when the font arrives). --hb-h: the
    // stage's own height, so a stage taller than the screen (a short phone)
    // still pins with its foot at the bottom of the screen.
    const measure = () => {
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
