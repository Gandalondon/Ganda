import type { Metadata } from "next";
import WorkGrid from "@/components/WorkGrid";
import AltHero from "@/components/alt/AltHero";
import { altDisplay } from "@/app/alt/fonts";
import { HOME_JSON_LD } from "@/lib/seo";
import { getWorkProjects } from "@/lib/storyblok";

// Title, description and Open Graph tags come from the root layout.
export const metadata: Metadata = { alternates: { canonical: "/" } };

// Runs before first paint so the nav shows its label, not the logo, with no
// flash (the same job the effect in AltHero does after client navigation).
const NAV_BOOT = `(function(){var r=document.documentElement;r.classList.add("alt-nav");if(window.scrollY<=24)r.classList.add("alt-top")})()`;

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
      <script dangerouslySetInnerHTML={{ __html: NAV_BOOT }} />
      <main id="main" className="alt-home">
        <AltHero fontClass={altDisplay.className} intro={INTRO} />
        <div className="gd-container">
          <WorkGrid projects={projects} />
        </div>
      </main>
    </>
  );
}
