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
        {heroText}
      </h1>

      <WorkGrid projects={projects} />

      {/* Closing CTA. Uses the hero's type settings and the case-study
          section spacing (176). maxWidth is in em so the break after
          "interesting" holds at every size; narrow screens wrap naturally.
          Link mirrors the nav's Book a call link. */}
      <p
        style={{
          maxWidth: "13.3em",
          marginTop: 176,
          fontSize: "var(--type-display)",
          lineHeight: 1.2,
          fontWeight: 500,
          letterSpacing: "-0.006em",
          color: "var(--ink)",
          textWrap: "pretty",
        }}
      >
        Have something interesting to work on?{" "}
        <a
          href="https://cal.com/tony-goff-yu-an7khw/intro"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Let’s talk: book a call (opens in new tab)"
        >
          Let’s talk.
        </a>
      </p>
    </main>
  );
}
