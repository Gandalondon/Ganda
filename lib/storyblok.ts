import StoryblokClient from "storyblok-js-client";
import { draftMode } from "next/headers";

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
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
