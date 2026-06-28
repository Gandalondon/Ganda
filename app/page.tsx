import { getStory } from "@/lib/storyblok";
import WorkGrid from "@/components/WorkGrid";

export default async function HomePage() {
  const story = await getStory("home").catch(() => null);
  const content = story?.content ?? {};

  const heroText =
    content.hero_text ??
    "Hello, I'm Tony Goff-Yu. I have over twenty years of design experience across branding, user experience and interaction design. I help businesses improve customer experience and conversion. This is my work.";
  const projects = content.projects ?? [];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 24px 96px",
      }}
    >
      <p
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.625rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          maxWidth: "820px",
          marginTop: "80px",
        }}
      >
        {heroText}
      </p>
      {projects.length > 0 && <WorkGrid projects={projects} />}
    </div>
  );
}
