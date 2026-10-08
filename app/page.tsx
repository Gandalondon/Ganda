import { getStory, getWorkProjects } from "@/lib/storyblok";
import LiveHomePage from "@/components/LiveHomePage";
import { HOME_JSON_LD } from "@/lib/seo";
import type { Metadata } from "next";

// Title, description and Open Graph tags come from the root layout.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [story, projects] = await Promise.all([
    getStory("home").catch(() => null),
    getWorkProjects().catch(() => []),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOME_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <LiveHomePage story={story} projects={projects} />
    </>
  );
}
