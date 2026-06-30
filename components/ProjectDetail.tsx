"use client";

import { useStoryblokState } from "@storyblok/react";
import WorkGrid from "@/components/WorkGrid";
import type { WorkProject } from "@/lib/storyblok";

type BodyBlock =
  | { type: "text"; text: string }
  | { type: "image"; ratio?: string }
  | { type: "images"; items: { ratio?: string }[] };

type Section = { text: string | null; images: { ratio?: string }[] };

type StoryContent = {
  title?: string;
  client?: string;
  summary?: string;
  body?: BodyBlock[];
};

function parseSections(body: BodyBlock[]): Section[] {
  const sections: Section[] = [];
  body.forEach((b) => {
    if (b.type === "text") {
      sections.push({ text: b.text, images: [] });
    } else {
      if (!sections.length) sections.push({ text: null, images: [] });
      const last = sections[sections.length - 1];
      if (b.type === "images") last.images.push(...b.items);
      else last.images.push({ ratio: b.ratio });
    }
  });
  return sections;
}

const PLACEHOLDER_SECTIONS: Section[] = [
  {
    text: "Project summary goes here. A short opening paragraph introducing the project, the brief and the role played. This text maps to a rich-text field and can run to a few sentences.",
    images: [{ ratio: "16 / 9" }],
  },
  {
    text: "A second passage describing the process, the decisions made and the outcome. Replace this with project-specific copy in the CMS. Keep it concise and readable.",
    images: [{ ratio: "4 / 5" }, { ratio: "4 / 5" }],
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

  return (
    <main style={{ paddingBottom: 144 }}>
      <div
        className="gd-container"
        style={{ paddingTop: 128, paddingBottom: 0 }}
      >
        {/* Hero split: title + summary left, image right */}
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
            }}
          />
        </div>
      </div>

      {/* Body sections — text left, images right */}
      {(content.body && content.body.length > 0
        ? parseSections(content.body)
        : PLACEHOLDER_SECTIONS
      ).map((s, i) => (
        <div key={i} className="gd-container" style={{ marginTop: 120 }}>
          <div className="gd-split" style={{ gap: 24 }}>
            <div>
              {s.text &&
                s.text.split("\n\n").map((para, j) => (
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
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {s.images.map((img, j) => (
                <div
                  key={j}
                  style={{
                    aspectRatio: img.ratio ?? "16 / 9",
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
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
