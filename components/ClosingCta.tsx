"use client";

import { usePathname } from "next/navigation";

// Site-wide closing CTA, rendered once in the root layout after each page's
// <main>. Uses the hero's type settings. maxWidth is in em so the break after
// "interesting" holds at every size; narrow screens wrap naturally. The link
// mirrors the nav's Book a call link. Spacing lives in globals.css
// (.gd-closing-cta) so the gap above it stays 176px at every breakpoint,
// matching the original home page footer.
export default function ClosingCta() {
  const pathname = usePathname();

  // The Carwow case study hides the nav's Book a call link, so the CTA that
  // links to the same booking page is hidden there too. The writing page is
  // not a work page, so it ends with the stories instead of a work pitch.
  if (pathname === "/work/carwow" || pathname === "/writing") return null;

  return (
    <footer className="gd-container gd-closing-cta">
      <p
        style={{
          maxWidth: "13.3em",
          fontSize: "var(--type-hero)",
          lineHeight: 1.2,
          fontWeight: 500,
          letterSpacing: "-0.006em",
          color: "var(--ink)",
          textWrap: "pretty",
        }}
      >
        Have something interesting to work on?{" "}
        <a
          href="https://cal.com/tony-goff-yu-an7khw/intro"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Let’s talk: book a call (opens in new tab)"
        >
          Let’s talk.
        </a>
      </p>
    </footer>
  );
}
