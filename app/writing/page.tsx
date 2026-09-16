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
  title: "Writing — Ganda",
  description:
    "Short science-fiction stories about work, judgement and what happens when automation still needs a human.",
};

const DEFAULT_HERO_STATEMENT =
  "I write short science-fiction stories about work, judgement and what happens when automation can do almost everything, but still needs a human.";

const DEFAULT_AUTHOR =
  "Tony Goff-Yu lives in London with his wife and dog. He grew up reading science fiction and has always wanted to write something of his own.";

// Local fallback — used until (or unless) a story's own cover_image asset
// is set in Storyblok. Keeping the file in the repo means a story block
// never has a missing-image state.
const DEFAULT_COVER_IMAGE = "/writing/cover-title.jpg";

const DEFAULT_PROCESS = [
  "Placeholder: a short introduction to how these stories are written, covering the starting idea and the overall approach.",
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

// Shape of a single "story" nestable block (Storyblok component: story).
// Each story on /writing carries its own cover, blurb and store link, and
// its title now stands in as that row's own section label (same slot
// "Process"/"Author" use) rather than sitting under one shared "Stories"
// heading — so a new title can be added from the CMS without a code
// change or a redeploy.
type StoryBlock = {
  _uid?: string;
  title?: string;
  description?: string;
  cover_image?: { filename?: string };
  amazon_url?: string;
};

export default async function WritingPage() {
  const story = await getStory("writing").catch(() => null);
  const content = (story?.content ?? {}) as {
    hero_statement?: string;
    stories?: StoryBlock[];
    process?: string;
    author?: string;
  };

  const heroStatement = content.hero_statement || DEFAULT_HERO_STATEMENT;
  // No hardcoded fallback list here on purpose — this section is driven
  // entirely by the "stories" Blocks field in Storyblok. Until at least
  // one story block is added there, no story rows render at all.
  const stories = content.stories ?? [];
  const author = content.author || DEFAULT_AUTHOR;
  const process = content.process || DEFAULT_PROCESS;

  // The page's first visible label should be an <h1>; every one after it
  // is an <h2>. Normally that's the first story's own title, but if no
  // story blocks exist yet, "Process" steps up to <h1> instead so the
  // page never ends up without one.
  const hasStories = stories.length > 0;
  const ProcessHeadingTag = hasStories ? "h2" : "h1";

  return (
    <main
      className={`gd-writing-page ${instrumentSans.className}`}
      style={{ paddingBottom: 144 }}
    >
      {/* Hero */}
      <section>
        <div className="gd-container">
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

      {/* Stories — one gd-split row per story, its own title standing in
          as the row's label (no shared "Stories" heading). */}
      {stories.map((s, i) => {
        const coverUrl = s.cover_image?.filename || DEFAULT_COVER_IMAGE;
        const description = s.description || "";
        const amazonUrl = s.amazon_url || "#";
        const StoryHeadingTag = i === 0 ? "h1" : "h2";
        return (
          <div
            key={s._uid ?? i}
            className="gd-container"
            style={{ marginTop: i === 0 ? 0 : 96 }}
          >
            <div className="gd-split" style={{ gap: 24 }}>
              <StoryHeadingTag style={labelStyle}>{s.title}</StoryHeadingTag>
              <div style={{ display: "flex", gap: 24 }}>
                {/* Cover thumbnail — border reuses the site's own
                    --border token (globals.css). */}
                <div
                  style={{
                    position: "relative",
                    width: 248,
                    flexShrink: 0,
                    aspectRatio: "1600 / 2560",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Image
                    src={coverUrl}
                    alt={`${s.title || "Story"} book cover`}
                    fill
                    sizes="248px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    maxWidth: 420,
                  }}
                >
                  <div>
                    {description.split("\n\n").map((para, pi) => (
                      <p
                        key={pi}
                        style={{
                          ...bodyTextStyle,
                          marginTop: pi === 0 ? 0 : "1.2em",
                          textWrap: "pretty" as React.CSSProperties["textWrap"],
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${s.title || "story"} on Amazon (opens in new tab)`}
                    style={{
                      ...bodyTextStyle,
                      alignSelf: "flex-start",
                      textDecoration: "underline",
                    }}
                  >
                    View on Amazon
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Process */}
      <div
        className="gd-container"
        style={{ marginTop: hasStories ? 96 : 0 }}
      >
        <div className="gd-split" style={{ gap: 24 }}>
          <ProcessHeadingTag style={labelStyle}>Process</ProcessHeadingTag>
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
    </main>
  );
}
