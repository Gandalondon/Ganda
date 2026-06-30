"use client";

import { useStoryblokState } from "@storyblok/react";
import Link from "next/link";

const FEATURED_PROJECTS = [
  { slug: "finn-drive", title: "FINN" },
  { slug: "eclipse", title: "Eclipse" },
  { slug: "optic", title: "Optic" },
  { slug: "profile", title: "Profile" },
  { slug: "altitude", title: "Altitude" },
  { slug: "go", title: "Go!" },
  { slug: "studio-hours", title: "Studio Hours" },
  { slug: "care", title: "Care" },
];

function WorkGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        columnGap: 24,
        rowGap: 24,
      }}
    >
      {FEATURED_PROJECTS.map((p) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1 / 1",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: 16, color: "var(--ink-subtle)" }}>
            {p.title}
          </span>
        </Link>
      ))}
      <Link
        href="/archive"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "1 / 1",
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 16, color: "var(--ink)" }}>Archive</span>
      </Link>
    </div>
  );
}

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
}: {
  story: unknown;
  slug: string;
}) {
  const story = useStoryblokState(initialStory as never);
  const content = ((story as { content?: StoryContent })?.content ??
    {}) as StoryContent;

  const title = content.client ?? content.title ?? "Client Name";
  const summary =
    content.summary ?? "A concise one-line summary of this archived project.";

  const container: React.CSSProperties = {
    maxWidth: 1680,
    margin: "0 auto",
    padding: "0 80px",
    boxSizing: "border-box",
  };

  return (
    <main style={{ paddingBottom: 144 }}>
      <div style={{ ...container, paddingTop: 128 }}>
        {/* Title — full width, above the split */}
        <h1
          style={{
            fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
            fontWeight: 400,
            letterSpacing: "1px",
            lineHeight: 1.25,
            marginBottom: 64,
          }}
        >
          {title}
        </h1>

        {/* Two-column: summary left, image well right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 360px) 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
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
        <div key={i} style={{ ...container, marginTop: 120 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 360px) 1fr",
              gap: 56,
            }}
          >
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

      {/* Work grid at the bottom */}
      <div style={{ ...container, marginTop: 200 }}>
        <WorkGrid />
      </div>
    </main>
  );
}
