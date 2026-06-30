import { getStory, getWorkProjects } from "@/lib/storyblok";
import LiveHomePage from "@/components/LiveHomePage";

export default async function HomePage() {
  const [story, projects] = await Promise.all([
    getStory("home").catch(() => null),
    getWorkProjects().catch(() => []),
  ]);
  return <LiveHomePage story={story} projects={projects} />;
}
