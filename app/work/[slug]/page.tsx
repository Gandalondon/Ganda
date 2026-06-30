import { getStory, getWorkProjects } from "@/lib/storyblok";
import ProjectDetail from "@/components/ProjectDetail";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [story, projects] = await Promise.all([
    getStory(`work/${slug}`).catch(() => null),
    getWorkProjects().catch(() => []),
  ]);

  return <ProjectDetail story={story} slug={slug} projects={projects} />;
}
