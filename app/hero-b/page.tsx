import type { Metadata } from "next";
import "../alt/hb.css";
import WorkGrid from "@/components/WorkGrid";
import HbStage from "@/components/alt/HbStage";
import { altDisplay } from "@/app/alt/fonts";
import { getWorkProjects } from "@/lib/storyblok";

// Alternative home, version B, for comparison with "/". A separate route: the
// existing home page, the shared nav and every other page are untouched (all
// the styles are in app/alt/hb.css and are scoped to .hb-home). Kept out of
// search results, with the real home page as the canonical address.
export const metadata: Metadata = {
  title: "Ganda — Tony Goff-Yu",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

// Same copy as the home page ("/"). Page files cannot export it, so it is
// repeated here.
const INTRO =
  "This is the work of Tony Goff-Yu, a product designer with over 20 years’ experience shaping digital products and sites. My work brings together clear design, rapid prototyping and experimentation.";

export default async function HeroBPage() {
  const projects = await getWorkProjects().catch(() => []);

  return (
    <main id="main" className="hb-home">
      <HbStage fontClass={altDisplay.className} intro={INTRO} />
      <div className="hb-work">
        <div className="gd-container">
          <WorkGrid projects={projects} />
        </div>
      </div>
    </main>
  );
}
