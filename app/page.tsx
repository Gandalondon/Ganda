import type { Metadata } from "next";
import WorkGrid from "@/components/WorkGrid";
import "./alt/hb.css";
import HbStage from "@/components/alt/HbStage";
import { altDisplay } from "@/app/alt/fonts";
import { HOME_JSON_LD } from "@/lib/seo";
import { getStory, getWorkProjects } from "@/lib/storyblok";

// Title, description and Open Graph tags come from the root layout.
export const metadata: Metadata = { alternates: { canonical: "/" } };

// Shown only if the Home story has no Hero Text.
const INTRO =
  "This is the work of Tony Goff-Yu, a product designer with over 20 years’ experience shaping digital products and sites. My work brings together clear design, rapid prototyping and experimentation.";

export default async function HomePage() {
  const [story, projects] = await Promise.all([
    getStory("home").catch(() => null),
    getWorkProjects().catch(() => []),
  ]);
  // The intro is the Home story's Hero Text, the same field the live site
  // reads, so the copy is edited in Storyblok.
  const heroText = (story as { content?: { hero_text?: unknown } } | null)
    ?.content?.hero_text;
  const intro =
    typeof heroText === "string" && heroText.trim() ? heroText.trim() : INTRO;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOME_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main" className="hb-home">
        <HbStage fontClass={altDisplay.className} intro={intro} />
        <div className="hb-work">
          <div className="gd-container">
            <WorkGrid projects={projects} />
          </div>
        </div>
      </main>
    </>
  );
}
