import { getStory, getWorkProjects } from "@/lib/storyblok";
import WorkGrid from "@/components/WorkGrid";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work — Ganda",
  description:
    "Recent product design work by Tony Goff-Yu: experimentation, conversion and the use of AI in the design process.",
  path: "/work",
});

// Placeholder until the copy is settled. To edit it in Storyblok with no code
// change, add an ordinary story at the top level (not inside the work folder)
// with the slug "work-intro" and a "hero_text" field, the same field the case
// studies use for their opening statement. It is kept out of the work folder
// on purpose: everything in that folder is listed as a project.
const DEFAULT_STATEMENT =
  "Recent work across product design, experimentation and conversion, and how I use AI in the process. Earlier projects are in the archive.";

export default async function WorkIndexPage() {
  const [story, projects] = await Promise.all([
    getStory("work-intro").catch(() => null),
    getWorkProjects().catch(() => []),
  ]);
  const content = (story?.content ?? {}) as { hero_text?: string };
  const statement = content.hero_text || DEFAULT_STATEMENT;

  return (
    <main id="main" style={{ paddingBottom: "calc(144 * var(--u))" }}>
      {/* The opening statement is set as on the case studies and the archive:
          the page's one h1, 128px from the nav. */}
      <div className="gd-container">
        <h1
          style={{
            maxWidth: "calc(960 * var(--u))",
            marginTop: "calc(128 * var(--u))",
            marginBottom: "calc(128 * var(--u))",
            fontSize: "var(--type-display)",
            lineHeight: 1.2,
            fontWeight: 500,
            letterSpacing: "-0.006em",
            color: "var(--ink)",
            textWrap: "pretty",
          }}
        >
          {statement}
        </h1>
      </div>
      <div className="gd-container">
        <WorkGrid projects={projects} />
      </div>
    </main>
  );
}
