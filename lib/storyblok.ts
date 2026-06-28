import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

export default Storyblok;

export async function getStory(slug: string) {
  const { data } = await Storyblok.getStory(slug, {
    version: process.env.NODE_ENV === "production" ? "published" : "draft",
  });
  return data.story;
}
