"use client";

import { useStoryblokState } from "@storyblok/react";
import Link from "next/link";

type Project = {
  slug: string;
  title: string;
};

const FEATURED_PROJECTS: Project[] = [
  { slug: "finn-drive", title: "FINN" },
  { slug: "eclipse", title: "Eclipse" },
  { slug: "optic", title: "Optic" },
  { slug: "profile", title: "Profile" },
  { slug: "altitude", title: "Altitude" },
  { slug: "go", title: "Go!" },
  { slug: "studio-hours", title: "Studio Hours" },
  { slug: "care", title: "Care" },
];

function WorkTile({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: 16, color: "var(--ink-subtle)" }}>{title}</span>
    </Link>
  );
}

function ArchiveTile() {
  return (
    <Link
      href="/archive"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: 16, color: "var(--ink)" }}>Archive</span>
    </Link>
  );
}

export default function LiveHomePage({
  story: initialStory,
}: {
  story: unknown;
}) {
  const story = useStoryblokState(initialStory as never);
  const content =
    (story as { content?: Record<string, unknown> })?.content ?? {};

  const heroText =
    (content.hero_text as string) ??
    "Hello, I'm Tony Goff-Yu. I have over twenty years of design experience across branding, user experience and interaction design. I help businesses improve customer experience and conversion. This is my work.";

  return (
    <main
      style={{
        maxWidth: 1680,
        margin: "0 auto",
        padding: "0 80px 144px",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          maxWidth: 816,
          marginTop: 128,
          marginBottom: 248,
          fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
          lineHeight: 1.25,
          fontWeight: 400,
          letterSpacing: "1px",
          color: "var(--ink)",
        }}
      >
        {heroText}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          columnGap: 24,
          rowGap: 24,
        }}
      >
        {FEATURED_PROJECTS.map((p) => (
          <WorkTile key={p.slug} title={p.title} href={`/work/${p.slug}`} />
        ))}
        <ArchiveTile />
      </div>
    </main>
  );
}
