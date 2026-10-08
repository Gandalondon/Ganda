"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Always start a newly opened page at the top.
//
// Next.js only scrolls to the top on navigation when the new page's first
// element is outside the viewport. The header is part of the layout, so the
// page content starts a little way down the document: if you had scrolled
// less than that distance (say 60px) before tapping a link, the new page
// counted as "already in view" and opened part-way down. This sets the scroll
// position explicitly.
//
// Not applied to back/forward (the browser restores the old position then)
// or to links that jump to a #hash.
export default function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
