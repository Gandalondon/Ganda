"use client";

import Image from "next/image";
import { useStoryblokState } from "@storyblok/react";
import WorkGrid from "@/components/WorkGrid";
import type { WorkProject } from "@/lib/storyblok";

type TextBlock = {
  component: "text_block";
  text?: string;
  image?: { filename: string; alt?: string };
};

type StoryContent = {
  title?: string;
  client?: string;
  summary?: string;
  thumbnail?: { filename: string; alt?: string };
  body?: TextBlock[];
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

export default function ProjectDetail({
  story: initialStory,
  slug,
  projects,
}: {
  story: unknown;
  slug: string;
  projects: WorkProject[];
}) {
  const story = useStoryblokState(initialStory as never);
  const content = ((story as { content?: StoryContent })?.content ??
    {}) as StoryContent;

  const title = content.client ?? content.title ?? "Client Name";
  const summary =
    content.summary ?? "A concise one-line summary of this archived project.";
  const blocks = content.body?.length ? content.body : PLACEHOLDER_BLOCKS;

  return (
    <main style={{ paddingBottom: 144 }}>
      <div
        className="gd-container"
        style={{ paddingTop: 128, paddingBottom: 0 }}
      >
        {/* Hero: title + summary left, thumbnail right */}
        <div className="gd-split" style={{ gap: 24 }}>
          <div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "1px",
                lineHeight: 1.25,
                marginBottom: 24,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 18,
                fontWeight: 300,
                lineHeight: 1.5,
                color: "var(--ink)",
              }}
            >
              {summary}
            </p>
          </div>
          <div
            style={{
              aspectRatio: "4 / 5",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {content.thumbnail?.filename && (
              <Image
                src={content.thumbnail.filename}
                alt={content.thumbnail.alt ?? title}
                fill
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Body blocks */}
      {blocks.map((block, i) => (
        <div key={i} className="gd-container" style={{ marginTop: 120 }}>
          <div className="gd-split" style={{ gap: 24 }}>
            <div>
              {block.text &&
                block.text.split("\n\n").map((para, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: 1.5,
                      marginBottom: "1em",
                    }}
                  >
                    {para}
                  </p>
                ))}
            </div>
            <div
              style={{
                aspectRatio: "16 / 9",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {block.image?.filename && (
                <Image
                  src={block.image.filename}
                  alt={block.image.alt ?? ""}
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Work grid */}
      <div className="gd-container" style={{ marginTop: 200 }}>
        <WorkGrid projects={projects} />
      </div>
    </main>
  );
}
