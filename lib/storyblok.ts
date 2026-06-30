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

export async function getWorkProjects(): Promise<WorkProject[]> {
  const { isEnabled } = await draftMode();
  const { data } = await Storyblok.getStories({
    starts_with: "work/",
    version: isEnabled ? "draft" : "published",
    per_page: 50,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.stories // justified-any: Storyblok SDK returns untyped story objects
    .filter((s: any) => s.slug !== "archive" && s.name !== "Archive")
    .map((s: any) => ({
      slug: s.slug as string,
      name: s.name as string,
      thumbnail: s.content?.thumbnail?.filename as string | undefined,
    }));
}
