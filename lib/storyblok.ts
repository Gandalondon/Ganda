import StoryblokClient from "storyblok-js-client";
import { draftMode } from "next/headers";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  cache: { clear: "auto", type: "memory" },
});

export default Storyblok;

export async function getStory(slug: string) {
  const { isEnabled } = await draftMode();
  const { data } = await Storyblok.getStory(slug, {
    version: isEnabled ? "draft" : "published",
  });
  return data.story;
}

export type WorkProject = {
  slug: string;
  name: string;
  thumbnail?: string;
};

// Minimal shape of a Storyblok work story, typed just enough to avoid `any`
// (the SDK itself returns untyped story objects).
type WorkStoryblokStory = {
  slug: string;
  name: string;
  content?: {
    thumbnail?: { filename?: string };
    hide_from_work_grid?: boolean;
  };
};

export async function getWorkProjects(): Promise<WorkProject[]> {
  const { isEnabled } = await draftMode();
  const { data } = await Storyblok.getStories({
    starts_with: "work/",
    version: isEnabled ? "draft" : "published",
    per_page: 50,
  });
  // Unlisted pages (hide_from_work_grid) stay reachable by direct URL but
  // are dropped here, which keeps them out of every grid, related-project
  // list and the sitemap for free, since they all read from this list.
  return (data.stories as WorkStoryblokStory[])
    .filter((s) => !s.content?.hide_from_work_grid)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      thumbnail: s.content?.thumbnail?.filename,
    }));
}
