import { getStory } from "@/lib/storyblok";
import ProjectDetail from "@/components/ProjectDetail";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStory(`work/${slug}`).catch(() => null);

  return <ProjectDetail story={story} slug={slug} />;
}
