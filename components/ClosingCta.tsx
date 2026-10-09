"use client";

import { usePathname } from "next/navigation";
import AltTalk from "@/components/alt/AltTalk";

// Site-wide closing statement, rendered once in the root layout after each
// page's <main>: a large "Let's talk" that links to the booking page
// (components/alt/AltTalk.tsx, styles in app/alt/alt.css). Spacing above it
// is set in alt.css (.alt-talk).
export default function ClosingCta({ fontClass }: { fontClass: string }) {
  const pathname = usePathname();

  // The Carwow case study hides the nav's Book a call link, so the statement
  // that links to the same booking page is hidden there too. The writing page
  // is not a work page, so it ends with the stories instead of a work pitch.
  if (pathname === "/work/carwow" || pathname === "/writing") return null;

  return <AltTalk fontClass={fontClass} />;
}
