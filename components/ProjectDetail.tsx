"use client";

import Image from "next/image";
import { useStoryblokState } from "@storyblok/react";
import WorkGrid from "@/components/WorkGrid";
import type { WorkProject } from "@/lib/storyblok";

type TextBlock = {
  component: "text_block";
  title?: string;
  client?: string;
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
      {/* Body blocks */}
      {blocks.map((block, i) => {
        if (block.component === "image") {
          return (
            <div key={i} className="gd-container" style={{ marginTop: 120 }}>
              <div
                style={{
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                {block.image?.filename && (
                  <Image
                    src={block.image.filename}
                    alt={block.image.alt ?? ""}
                    width={1200}
                    height={900}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                )}
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="gd-container" style={{ marginTop: 120 }}>
            <div className="gd-split" style={{ gap: 24 }}>
              <div>
                {(block.title || block.client) && (
                  <h2
                    style={{
                      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                      fontWeight: 400,
                      letterSpacing: "1px",
                      lineHeight: 1.25,
                      marginBottom: 24,
                    }}
                  >
                    {block.title ?? block.client}
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
                      }}
                    >
                      {para}
                    </p>
                  ))}
              </div>
              <div />
            </div>
            {block.image?.filename && (
              <div
                style={{
                  marginTop: 24,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={block.image.filename}
                  alt={block.image.alt ?? ""}
                  width={1200}
                  height={900}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            )}
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
