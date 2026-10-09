import type { Metadata } from "next";
import WorkGrid from "@/components/WorkGrid";
import "./alt/hb.css";
import HbStage from "@/components/alt/HbStage";
import { altDisplay } from "@/app/alt/fonts";
import { HOME_JSON_LD } from "@/lib/seo";
import { getWorkProjects } from "@/lib/storyblok";

// Title, description and Open Graph tags come from the root layout.
export const metadata: Metadata = { alternates: { canonical: "/" } };

const INTRO =
  "This is the work of Tony Goff-Yu, a product designer with over 20 years’ experience shaping digital products and sites. My work brings together clear design, rapid prototyping and experimentation.";

export default async function HomePage() {
  const projects = await getWorkProjects().catch(() => []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOME_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main" className="hb-home">
        <HbStage fontClass={altDisplay.className} intro={INTRO} />
        <div className="hb-work">
          <div className="gd-container">
            <WorkGrid projects={projects} />
          </div>
        </div>
      </main>
    </>
  );
}
