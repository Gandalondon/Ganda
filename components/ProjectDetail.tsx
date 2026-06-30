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

function PlaceholderWell({
  ratio = "4 / 5",
  label = "Image",
}: {
  ratio?: string;
  label?: string;
}) {
  return (
    <div
      style={{
        aspectRatio: ratio,
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 16, color: "var(--ink-subtle)" }}>{label}</span>
    </div>
  );
}

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
  | { type: "image"; src?: string; ratio?: string; caption?: string }
  | {
      type: "images";
      items: { src?: string; ratio?: string; caption?: string }[];
    };

type StoryContent = {
  title?: string;
  discipline?: string;
  category?: string;
  summary?: string;
  cover?: string;
  body?: BodyBlock[];
};

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

  const title = content.title ?? "Project Name";
  const discipline =
    content.discipline ??
    content.category ??
    "Discipline · Discipline · Discipline";
  const summary =
    content.summary ??
    "Project summary goes here — a concise one or two sentence description of the project, its context and the work delivered.";

  // Group body blocks into sections: text + following images
  type Section = {
    text: string | null;
    images: { src?: string; ratio?: string; caption?: string }[];
  };
  const sections: Section[] = [];
  (content.body ?? []).forEach((b) => {
    if (b.type === "text") {
      sections.push({ text: b.text, images: [] });
    } else {
      if (!sections.length) sections.push({ text: null, images: [] });
      const last = sections[sections.length - 1];
      if (b.type === "images") last.images.push(...b.items);
      else last.images.push({ src: b.src, ratio: b.ratio, caption: b.caption });
    }
  });

  const container: React.CSSProperties = {
    maxWidth: 1680,
    margin: "0 auto",
    padding: "0 80px",
    boxSizing: "border-box",
  };

  return (
    <main style={{ paddingBottom: 144 }}>
      {/* Split hero */}
      <div style={{ ...container, paddingTop: 128 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 360px) 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                fontWeight: 600,
                letterSpacing: 0,
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              {title}
            </h1>
            {discipline && (
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  marginBottom: 24,
                  color: "var(--ink-muted)",
                }}
              >
                {discipline}
              </p>
            )}
            {summary && (
              <p style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.4 }}>
                {summary}
              </p>
            )}
          </div>
          <PlaceholderWell ratio="4 / 5" label={title} />
        </div>
      </div>

      {/* Body sections — copy left, images right */}
      {sections.map((s, i) => (
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
              {s.images.length > 0 ? (
                s.images.map((img, j) => (
                  <PlaceholderWell
                    key={j}
                    ratio={img.ratio ?? "16 / 9"}
                    label={img.caption ?? "Image"}
                  />
                ))
              ) : (
                <PlaceholderWell ratio="16 / 9" />
              )}
            </div>
          </div>
        </div>
      ))}

      {/* If no body sections yet, show a placeholder body */}
      {sections.length === 0 && (
        <div style={{ ...container, marginTop: 120 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 360px) 1fr",
              gap: 56,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  lineHeight: 1.5,
                  color: "var(--ink-subtle)",
                }}
              >
                Project description coming soon.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <PlaceholderWell ratio="16 / 9" />
              <PlaceholderWell ratio="16 / 9" />
            </div>
          </div>
        </div>
      )}

      {/* Work grid at the bottom */}
      <div style={{ ...container, marginTop: 200 }}>
        <WorkGrid />
      </div>
    </main>
  );
}
