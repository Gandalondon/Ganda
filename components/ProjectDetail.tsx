"use client";

import { useStoryblokState } from "@storyblok/react";
import type { ReactNode } from "react";
import WorkGrid from "@/components/WorkGrid";
import BlurImage from "@/components/BlurImage";
import type { WorkProject } from "@/lib/storyblok";

type TextBlock = {
  component: "text_block";
  Title?: string;
  text?: string;
  image?: { filename: string; alt?: string };
};

type ImageBlock = {
  component: "image";
  image?: { filename: string; alt?: string };
};

type Block = TextBlock | ImageBlock;

type StoryContent = {
  title?: string;
  client?: string;
  summary?: string;
  hero_text?: string;
  thumbnail?: { filename: string; alt?: string };
  body?: Block[];
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

function renderInlineLinks(text: string): ReactNode[] {
  const linkPattern = /\[([^\]]+)]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(text)) !== null) {
    const [markdown, label, href] = match;
    const isSafeLink = href.startsWith("/") || /^https?:\/\//.test(href);

    parts.push(text.slice(lastIndex, match.index));
    parts.push(
      isSafeLink ? (
        <a
          key={`${match.index}-${href}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ) : (
        markdown
      ),
    );
    lastIndex = match.index + markdown.length;
  }

  parts.push(text.slice(lastIndex));
  return parts;
}

export default function ProjectDetail({
  story: initialStory,
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
              maxWidth: 816,
              marginTop: 128,
              marginBottom: 128,
              fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
              lineHeight: 1.25,
              fontWeight: 400,
              letterSpacing: "1px",
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
            <div key={i} className="gd-container" style={{ marginTop: 120 }}>
              <BlurImage
                src={block.image.filename}
                alt={block.image.alt ?? ""}
                width={1200}
                height={900}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          );
        }
        return (
          <div key={i} className="gd-container" style={{ marginTop: 120 }}>
            <div className="gd-split" style={{ gap: 24 }}>
              <div style={{ maxWidth: "calc(100% - 24px)" }}>
                {block.Title && (
                  <h2
                    style={{
                      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                      fontWeight: 400,
                      letterSpacing: "1px",
                      lineHeight: 1.25,
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
                        fontSize: 18,
                        fontWeight: 300,
                        lineHeight: 1.5,
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
                      border: "1px solid var(--border)",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Work grid */}
      <div className="gd-container" style={{ marginTop: 200 }}>
        <WorkGrid projects={projects} />
      </div>
    </main>
  );
}
