import { getStory } from "@/lib/storyblok";
import { Instrument_Sans } from "next/font/google";
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

// Dual-axis mask so the cover art has no rectangular edges — values from
// design_handoff_writing_page/Writing.dc.html
const MASK_HORIZONTAL =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 24%, #000 60%)";
const MASK_VERTICAL =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 14%, rgba(0,0,0,0.2) 26%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.72) 50%, #000 66%, #000 88%, transparent 100%)";

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
      style={{ paddingBottom: 144 }}
    >
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={
            {
              position: "absolute",
              top: "-8%",
              right: "-4%",
              bottom: "-2%",
              width: "min(74%, 1250px)",
              backgroundImage: "url(/writing/cover.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "60% 100%",
              backgroundRepeat: "no-repeat",
              mixBlendMode: "screen",
              opacity: 0.85,
              pointerEvents: "none",
              WebkitMaskImage: `${MASK_HORIZONTAL}, ${MASK_VERTICAL}`,
              WebkitMaskComposite: "source-in",
              maskImage: `${MASK_HORIZONTAL}, ${MASK_VERTICAL}`,
              maskComposite: "intersect",
            } as React.CSSProperties
          }
        />
        <div
          className="gd-container"
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
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
      <div className="gd-container">
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

      {/* Author */}
      <div className="gd-container" style={{ marginTop: 96 }}>
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

      {/* Process */}
      <div className="gd-container" style={{ marginTop: 96 }}>
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

      {/* Read */}
      <div className="gd-container" style={{ marginTop: 96 }}>
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
