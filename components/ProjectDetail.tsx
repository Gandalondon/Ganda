"use client";

import { useStoryblokState } from "@storyblok/react";
import { useEffect, useState } from "react";
import WorkGrid from "@/components/WorkGrid";
import BlurImage from "@/components/BlurImage";
import { renderInlineLinks } from "@/lib/inline";
import type { WorkProject } from "@/lib/storyblok";

type TextBlock = {
  component: "text_block";
  Title?: string;
  text?: string;
  image?: { filename: string; alt?: string };
  show_image_border?: boolean;
};

type ImageBlock = {
  component: "image";
  image?: { filename: string; alt?: string };
  // Defaults OFF. Toggle on in Storyblok for screenshots that need a frame
  // to separate them from the page background.
  show_image_border?: boolean;
};

// A single subtitle+body pair inside a TextBlockSections block (nested
// Storyblok component: text_section_item).
type TextSectionItem = {
  _uid?: string;
  subtitle?: string;
  body?: string;
};

// Same two-column text+image layout as TextBlock, but for content that
// needs repeated subtitle/body pairs under one title (e.g. "Opportunity" /
// "Outcome") instead of a single body field. Nested Storyblok component:
// text_block_sections. Image border defaults OFF for this block (opposite
// of TextBlock, where it defaults on) - only shows when explicitly true.
type TextBlockSections = {
  component: "text_block_sections";
  title?: string;
  image?: { filename: string; alt?: string };
  sections?: TextSectionItem[];
  show_image_border?: boolean;
};

// A large standalone statement, styled like the page's top hero text, that
// can be dropped in anywhere in the body to break up a long case study.
// Nested Storyblok component: hero_block.
type HeroBlock = {
  component: "hero_block";
  text?: string;
};

// A pull quote at the same width as HeroBlock, with an attribution line
// underneath (e.g. a testimonial). Nested Storyblok component: quote_block.
type QuoteBlock = {
  component: "quote_block";
  text?: string;
  byline?: string;
};

// Same two-column text+visual layout as TextBlock (title/body on the
// left, visual on the right), but the visual is an interactive HTML
// prototype (e.g. a Claude-exported build dropped in public/) embedded
// via iframe on desktop. On mobile, where the prototype likely will not
// work well, a static fallback image is shown instead and the iframe is
// never mounted (so its HTML/JS never even loads over a mobile
// connection). Nested Storyblok component: prototype_embed.
type PrototypeEmbedBlock = {
  component: "prototype_embed";
  title?: string;
  body?: string;
  // Path to the exported HTML file, e.g. /prototypes/carwow-lionel.html
  prototype_url?: string;
  fallback_image?: { filename: string; alt?: string };
  // Border defaults OFF for this block's fallback image (matching
  // prototype_embed's own no-border iframe). Toggle on in Storyblok if
  // the uploaded fallback screenshot needs one to read correctly.
  show_image_border?: boolean;
};

type Block =
  | TextBlock
  | ImageBlock
  | TextBlockSections
  | HeroBlock
  | QuoteBlock
  | PrototypeEmbedBlock;

type StoryContent = {
  title?: string;
  client?: string;
  summary?: string;
  hero_text?: string;
  thumbnail?: { filename: string; alt?: string };
  body?: Block[];
  // Storyblok boolean field: when true, the More Work grid at the bottom
  // of this project page is hidden so the page simply ends.
  hide_work_grid?: boolean;
};

const PLACEHOLDER_BLOCKS: TextBlock[] = [
  {
    component: "text_block",
    text: "Project summary goes here. A short opening paragraph introducing the project, the brief and the role played.",
  },
  {
    component: "text_block",
    text: "A second passage describing the process, the decisions made and the outcome. Replace this with project-specific copy in the CMS.",
  },
];


// Same breakpoint the site's CSS already switches to a stacked, mobile
// layout at (see .gd-split / .gd-grid-3 in globals.css), reused here so
// desktop vs mobile stays consistent across the page.
const DESKTOP_BREAKPOINT = "(min-width: 1025px)";

// Renders the two-column title/body + prototype layout described above.
// Split into its own component (rather than inlined in the body-block
// map) because it needs its own hook state, and hooks cannot be called
// from inside a .map() callback.
function PrototypeEmbed({ block }: { block: PrototypeEmbedBlock }) {
  const [showPrototype, setShowPrototype] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT);
    const update = () => setShowPrototype(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!block.prototype_url && !block.fallback_image?.filename) return null;

  // With no title or body, there's no left column to balance - center the
  // prototype in the page instead of leaving it pinned to the (empty)
  // right-hand track of the two-column split.
  const hasText = Boolean(block.title || block.body);

  const media = (
    <>
      {showPrototype && block.prototype_url ? (
        <iframe
          src={block.prototype_url}
          title={block.title ?? "Interactive prototype"}
          data-fade-media
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          // The export centers its content vertically within the
          // page (body { align-items: center }), which leaves a gap
          // above it whenever the content is shorter than the fixed
          // iframe height. Since the export is same-origin (served
          // from our own public/), pin it to the top instead so it
          // lines up with the text column, rather than trying to
          // predict/crop the gap from outside the iframe.
          onLoad={(e) => {
            try {
              const doc = e.currentTarget.contentDocument;
              if (doc?.body) {
                doc.body.style.alignItems = "flex-start";
              }
            } catch {
              // Cross-origin or otherwise inaccessible - leave the
              // export's own centering as-is.
            }
          }}
          style={{
            width: "100%",
            // Locked to the export's real design canvas ratio (full
            // prototype incl. side panel: 880x922). maxHeight caps the
            // rendered size on the page (the design-tool reference
            // showed the same 880x922 canvas at a smaller effective
            // size than our wide column renders it at) - the browser
            // shrinks width to match once maxHeight kicks in, keeping
            // the exact ratio rather than cropping or distorting it.
            maxWidth: 880,
            aspectRatio: "880 / 922",
            maxHeight: 824,
            height: "auto",
            border: "none",
            display: "block",
          }}
        />
      ) : (
        block.fallback_image?.filename && (
          <BlurImage
            src={block.fallback_image.filename}
            alt={block.fallback_image.alt ?? ""}
            width={1200}
            height={900}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              ...(block.show_image_border === true
                ? { border: "1px solid var(--border)" }
                : {}),
            }}
          />
        )
      )}
    </>
  );

  if (!hasText) {
    return (
      <div className="gd-container" style={{ marginTop: 176 }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>{media}</div>
      </div>
    );
  }

  return (
    <div className="gd-container" style={{ marginTop: 176 }}>
      <div className="gd-split" style={{ gap: 24 }}>
        <div style={{ maxWidth: "calc(100% - 24px)" }}>
          {block.title && (
            <h2
              style={{
                fontSize: "var(--type-display)",
                fontWeight: 500,
                letterSpacing: "-0.006em",
                lineHeight: 1.15,
                marginBottom: 24,
              }}
            >
              {block.title}
            </h2>
          )}
          {block.body &&
            block.body.split("\n\n").map((para, j) => (
              <p
                key={j}
                style={{
                  fontSize: "var(--type-body)",
                  fontWeight: 300,
                  lineHeight: 1.45,
                  marginBottom: "1em",
                  textWrap: "pretty",
                }}
              >
                {renderInlineLinks(para)}
              </p>
            ))}
        </div>
        {/* media is capped at maxWidth:880, narrower than this column's
            stretched track - push it to the column's right edge so the
            leftover gap sits in the middle gutter (next to the text)
            instead of trailing on the page's outer right edge. */}
        <div style={{ marginLeft: "auto", maxWidth: 880, width: "100%" }}>
          {media}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail({
  story: initialStory,
  slug,
  projects,
}: {
  story: unknown;
  slug?: string;
  projects: WorkProject[];
}) {
  const story = useStoryblokState(initialStory as never);
  const content = ((story as { content?: StoryContent })?.content ??
    {}) as StoryContent;

  const blocks = content.body?.length ? content.body : PLACEHOLDER_BLOCKS;

  return (
    <main style={{ paddingBottom: 144 }}>
      {content.hero_text && (
        <div className="gd-container">
          <h1
            style={{
              maxWidth: 960,
              marginTop: 128,
              marginBottom: 128,
              fontSize: "var(--type-display)",
              lineHeight: 1.2,
              fontWeight: 500,
              letterSpacing: "-0.006em",
              color: "var(--ink)",
              textWrap: "pretty",
            }}
          >
            {content.hero_text}
          </h1>
        </div>
      )}

      {/* Body blocks */}
      {blocks.map((block, i) => {
        if (block.component === "image") {
          if (!block.image?.filename) return null;
          return (
            <div key={i} className="gd-container" style={{ marginTop: 176 }}>
              <BlurImage
                src={block.image.filename}
                alt={block.image.alt ?? ""}
                width={1200}
                height={900}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  ...(block.show_image_border === true
                    ? { border: "1px solid var(--border)" }
                    : {}),
                }}
              />
            </div>
          );
        }

        if (block.component === "text_block_sections") {
          const sections = block.sections ?? [];
          return (
            <div key={i} className="gd-container" style={{ marginTop: 176 }}>
              <div className="gd-split" style={{ gap: 24 }}>
                <div style={{ maxWidth: "calc(100% - 24px)" }}>
                  {block.title && (
                    <h2
                      style={{
                        fontSize: "var(--type-display)",
                        fontWeight: 500,
                        letterSpacing: "-0.006em",
                        lineHeight: 1.15,
                        marginBottom: 24,
                      }}
                    >
                      {block.title}
                    </h2>
                  )}
                  {sections.map((sec, si) => (
                    <div
                      key={sec._uid ?? si}
                      style={{ marginTop: si === 0 ? 0 : 32 }}
                    >
                      {sec.subtitle && (
                        <h3
                          style={{
                            fontSize: "var(--type-body)",
                            letterSpacing: "-0.0048em",
                            fontWeight: 500,
                            lineHeight: 1.3,
                            marginBottom: "0.5em",
                          }}
                        >
                          {sec.subtitle}
                        </h3>
                      )}
                      {sec.body &&
                        sec.body.split("\n\n").map((para, j) => (
                          <p
                            key={j}
                            style={{
                              fontSize: "var(--type-body)",
                              fontWeight: 300,
                              lineHeight: 1.45,
                              marginBottom: "1em",
                              textWrap: "pretty",
                            }}
                          >
                            {renderInlineLinks(para)}
                          </p>
                        ))}
                    </div>
                  ))}
                </div>
                <div>
                  {block.image?.filename && (
                    <BlurImage
                      src={block.image.filename}
                      alt={block.image.alt ?? ""}
                      width={1200}
                      height={900}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        ...(block.show_image_border === true
                          ? { border: "1px solid var(--border)" }
                          : {}),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        }

        if (block.component === "hero_block") {
          if (!block.text) return null;
          return (
            <div key={i} className="gd-container" style={{ marginTop: 176 }}>
              <h2
                style={{
                  maxWidth: 960,
                  fontSize: "var(--type-display)",
                  lineHeight: 1.2,
                  fontWeight: 500,
                  letterSpacing: "-0.006em",
                  color: "var(--ink)",
                  textWrap: "pretty",
                }}
              >
                {renderInlineLinks(block.text)}
              </h2>
            </div>
          );
        }

        if (block.component === "quote_block") {
          if (!block.text) return null;
          return (
            // data-fade-block: the quote and byline fade in together as one.
            <div
              key={i}
              className="gd-container"
              data-fade-block
              style={{ marginTop: 176 }}
            >
              <h2
                style={{
                  maxWidth: 960,
                  fontSize: "var(--type-display)",
                  lineHeight: 1.2,
                  fontWeight: 500,
                  letterSpacing: "-0.006em",
                  color: "var(--ink)",
                  textWrap: "pretty",
                }}
              >
                {block.text}
              </h2>
              {block.byline && (
                <p
                  style={{
                    maxWidth: 816,
                    marginTop: 24,
                    fontSize: "var(--type-body)",
                    fontWeight: 300,
                    lineHeight: 1.45,
                    color: "var(--ink)",
                  }}
                >
                  {block.byline}
                </p>
              )}
            </div>
          );
        }

        if (block.component === "prototype_embed") {
          return <PrototypeEmbed key={i} block={block} />;
        }

        return (
          <div key={i} className="gd-container" style={{ marginTop: 176 }}>
            <div className="gd-split" style={{ gap: 24 }}>
              <div style={{ maxWidth: "calc(100% - 24px)" }}>
                {block.Title && (
                  <h2
                    style={{
                      fontSize: "var(--type-display)",
                      fontWeight: 500,
                      letterSpacing: "-0.006em",
                      lineHeight: 1.15,
                      marginBottom: 24,
                    }}
                  >
                    {block.Title}
                  </h2>
                )}
                {block.text &&
                  block.text.split("\n\n").map((para, j) => (
                    <p
                      key={j}
                      style={{
                        fontSize: "var(--type-body)",
                        fontWeight: 300,
                        lineHeight: 1.45,
                        marginBottom: "1em",
                        textWrap: "pretty",
                      }}
                    >
                      {renderInlineLinks(para)}
                    </p>
                  ))}
              </div>
              <div>
                {block.image?.filename && (
                  <BlurImage
                    src={block.image.filename}
                    alt={block.image.alt ?? ""}
                    width={1200}
                    height={900}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      ...(block.show_image_border !== false
                        ? { border: "1px solid var(--border)" }
                        : {}),
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Work grid */}
      {!content.hide_work_grid && (
        <div className="gd-container" style={{ marginTop: 200 }}>
          {/* The page's own project is left out of its list. */}
          <WorkGrid
            projects={projects.filter(
              (p) => p.slug.toLowerCase() !== slug?.toLowerCase(),
            )}
          />
        </div>
      )}
    </main>
  );
}
