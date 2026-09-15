import { getStory } from "@/lib/storyblok";
import { Instrument_Sans } from "next/font/google";
import Image from "next/image";
import type { Metadata } from "next";

// Instrument Sans on Google Fonts only ships 400/500/600/700 — there is no
// 300/Light weight, so body copy renders at 400 (closest available) rather
// than the 300 in the design spec. Flagged in the handoff notes.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Human Assurance Required — Ganda",
  description:
    "A short science-fiction story about work, judgement and what happens when automation still needs a human.",
};

const DEFAULT_HERO_STATEMENT =
  "Human Assurance Required is a short science-fiction story about work, judgement and what happens when automation still needs a human.";

const DEFAULT_SYNOPSIS = [
  "A routine cargo run to an orbital transfer station. Every calculation has already been made, every manifest already checked. The only task left is the one the system cannot do for itself: a person, at the end of the chain, confirming the work was done correctly.",
  "Human Assurance Required follows a single shift in that job, and the moment the numbers stop agreeing.",
  "I grew up reading science fiction and have always wanted to write something of my own. After spending the last few years using AI extensively in my design work, I wanted to see how those same tools could support a different creative process.",
  "Human Assurance Required was developed with the assistance of AI, which helped with proofreading, exploring dialogue and testing ideas as the story took shape. Research on cargo manifests, orbital logistics and mission terminology was also done with AI assistance.",
].join("\n\n");

const DEFAULT_AUTHOR =
  "Tony Goff-Yu lives in London with his wife and dog. He grew up reading science fiction and has always wanted to write something of his own.";

const DEFAULT_KINDLE_URL = "#";
const DEFAULT_AMAZON_URL = "#";

const DEFAULT_PROCESS = [
  "Placeholder: a short introduction to how Human Assurance Required was written, covering the starting idea and the overall approach.",
  "Placeholder: a second paragraph continuing that introduction, on research, drafting and where AI assistance was and wasn't used.",
].join("\n\n");

const labelStyle: React.CSSProperties = {
  fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
  fontWeight: 400,
  letterSpacing: "1px",
  lineHeight: 1.25,
  color: "#ffffff",
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 300,
  lineHeight: 1.5,
  color: "#ffffff",
};

// Every content row needs to sit above the hero artwork, which is
// absolutely positioned against <main> and deliberately extends down past
// the hero into the About row (see .gd-writing-hero-art in globals.css).
const rowStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
};

export default async function WritingPage() {
  const story = await getStory("writing").catch(() => null);
  const content = (story?.content ?? {}) as {
    hero_statement?: string;
    synopsis?: string;
    kindle_url?: string;
    amazon_url?: string;
    author?: string;
    process?: string;
  };

  const heroStatement = content.hero_statement || DEFAULT_HERO_STATEMENT;
  const synopsis = content.synopsis || DEFAULT_SYNOPSIS;
  const kindleUrl = content.kindle_url || DEFAULT_KINDLE_URL;
  const amazonUrl = content.amazon_url || DEFAULT_AMAZON_URL;
  const author = content.author || DEFAULT_AUTHOR;
  const process = content.process || DEFAULT_PROCESS;

  return (
    <main
      className={`gd-writing-page ${instrumentSans.className}`}
      style={{ position: "relative", paddingBottom: 144 }}
    >
      {/* Cover artwork — decorative, absolutely positioned against <main>
          (not the hero section) so it isn't constrained to the hero's
          height and can extend down behind the About row. Natural portrait
          aspect ratio preserved via object-fit: contain (no crop/stretch).
          Sizing, position and the fade-to-black mask live in globals.css
          (.gd-writing-hero-art) so mobile can use a separate treatment. */}
      <div className="gd-writing-hero-art" aria-hidden="true">
        <Image
          src="/writing/cover.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 64vw, (max-width: 1024px) 46vw, 36vw"
          style={{ objectFit: "contain", objectPosition: "top right" }}
        />
      </div>

      {/* Hero */}
      <section style={{ position: "relative" }}>
        <div className="gd-container" style={rowStyle}>
          <p
            style={{
              // Same position and measure as the homepage h1: marginTop/
              // marginBottom 128, maxWidth 816 — not the hero's own padding
              // scale, so the two pages line up exactly.
              marginTop: 128,
              marginBottom: 128,
              maxWidth: 816,
              fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
              lineHeight: 1.25,
              letterSpacing: "1px",
              fontWeight: 400,
              color: "#ffffff",
              textWrap: "pretty" as React.CSSProperties["textWrap"],
            }}
          >
            {heroStatement}
          </p>
        </div>
      </section>

      {/* About */}
      <div className="gd-container" style={rowStyle}>
        <div className="gd-split" style={{ gap: 24 }}>
          <h1 style={labelStyle}>About</h1>
          <div>
            {synopsis.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  ...bodyTextStyle,
                  marginTop: i === 0 ? 0 : "1.2em",
                  textWrap: "pretty" as React.CSSProperties["textWrap"],
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="gd-container" style={{ ...rowStyle, marginTop: 96 }}>
        <div className="gd-split" style={{ gap: 24 }}>
          <h2 style={labelStyle}>Process</h2>
          <div>
            {process.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  ...bodyTextStyle,
                  marginTop: i === 0 ? 0 : "1.2em",
                  textWrap: "pretty" as React.CSSProperties["textWrap"],
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="gd-container" style={{ ...rowStyle, marginTop: 96 }}>
        <div className="gd-split" style={{ gap: 24 }}>
          <h2 style={labelStyle}>Author</h2>
          <p
            style={{
              ...bodyTextStyle,
              textWrap: "pretty" as React.CSSProperties["textWrap"],
            }}
          >
            {author}
          </p>
        </div>
      </div>

      {/* Read */}
      <div className="gd-container" style={{ ...rowStyle, marginTop: 96 }}>
        <div className="gd-split" style={{ gap: 24 }}>
          <h2 style={labelStyle}>Read</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <a
              href={kindleUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kindle (opens in new tab)"
              style={{ ...bodyTextStyle, alignSelf: "flex-start" }}
            >
              Kindle ↗
            </a>
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amazon (opens in new tab)"
              style={{ ...bodyTextStyle, alignSelf: "flex-start" }}
            >
              Amazon ↗
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
