import { getStory } from "@/lib/storyblok";
import LiveHomePage from "@/components/LiveHomePage";

export default async function HomePage() {
  const story = await getStory("home").catch(() => null);
  return <LiveHomePage story={story} />;
}
