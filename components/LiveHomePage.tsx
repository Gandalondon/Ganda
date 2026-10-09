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
    <main id="main" className="gd-container" style={{ paddingBottom: "calc(144 * var(--u))" }}>
      <h1
        style={{
          maxWidth: "calc(1160 * var(--u))",
          marginTop: "calc(128 * var(--u))",
          marginBottom: "calc(128 * var(--u))",
          fontSize: "var(--type-hero)",
          lineHeight: 1.2,
          fontWeight: 500,
          letterSpacing: "-0.006em",
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
