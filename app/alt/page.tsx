import type { Metadata } from "next";
import WorkGrid from "@/components/WorkGrid";
import AltHero from "@/components/alt/AltHero";
import AltTalk from "@/components/alt/AltTalk";
import { getWorkProjects } from "@/lib/storyblok";
import { altDisplay } from "./fonts";
import "./alt.css";

// Alternative home, for side-by-side comparison with "/". Not indexed. The
// Storyblok publish webhook (app/api/revalidate) only refreshes "/", so this
// page refreshes itself every minute instead.
export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const INTRO =
  "This is the work of Tony Goff-Yu, a product designer with over 20 years’ experience shaping digital products and sites. My work brings together clear design, rapid prototyping and experimentation.";

// Runs before first paint so the nav shows its label, not the logo, with no
// flash (the same job the effect in AltHero does after client navigation).
const NAV_BOOT = `(function(){var r=document.documentElement;r.classList.add("alt-nav");if(window.scrollY<=24)r.classList.add("alt-top")})()`;

export default async function AltHomePage() {
  const projects = await getWorkProjects().catch(() => []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: NAV_BOOT }} />
      <main id="main" className="alt-home">
        <AltHero fontClass={altDisplay.className} intro={INTRO} />
        <div className="gd-container">
          <WorkGrid projects={projects} />
        </div>
      </main>
      <AltTalk fontClass={altDisplay.className} />
    </>
  );
}
