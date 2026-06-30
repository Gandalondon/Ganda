"use client";

import { useStoryblokState } from "@storyblok/react";
import WorkGrid from "@/components/WorkGrid";
import type { WorkProject } from "@/lib/storyblok";

export default function LiveHomePage({
  story: initialStory,
  projects,
}: {
  story: unknown;
  projects: WorkProject[];
}) {
  const story = useStoryblokState(initialStory as never);
  const content =
    (story as { content?: Record<string, unknown> })?.content ?? {};

  const heroText =
    (content.hero_text as string) ??
    "Hello, I'm Tony Goff-Yu. I have over twenty years of design experience across branding, user experience and interaction design. I help businesses improve customer experience and conversion. This is my work.";

  return (
    <main className="gd-container" style={{ paddingBottom: 144 }}>
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
        {heroText}
      </h1>

      <WorkGrid projects={projects} />
    </main>
  );
}
