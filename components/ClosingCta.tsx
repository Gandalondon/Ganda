"use client";

import { usePathname } from "next/navigation";
import AltTalk from "@/components/alt/AltTalk";

// Site-wide closing statement, rendered once in the root layout after each
// page's <main>: a large "Let's talk" that links to the booking page and types
// in once as it scrolls into view (components/alt/AltTalk.tsx, styles in
// app/alt/alt.css). Spacing above it is set in alt.css (.alt-talk).
export default function ClosingCta() {
  const pathname = usePathname();

  // The Carwow case study hides the nav's Book a call link, so the statement
  // that links to the same booking page is hidden there too. The writing page
  // is not a work page, so it ends with the stories instead of a work pitch.
  if (pathname === "/work/carwow" || pathname === "/writing") return null;

  // Keyed by path so each page gets a fresh element and the type-in plays
  // again, rather than the layout keeping one (already revealed) across
  // client-side navigation.
  return <AltTalk key={pathname} />;
}
