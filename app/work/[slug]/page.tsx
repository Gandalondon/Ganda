import { getStory, getWorkProjects } from "@/lib/storyblok";
import ProjectDetail from "@/components/ProjectDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(`work/${slug}`).catch(() => null);
  const content = (story as { content?: { title?: string; client?: string; summary?: string } })?.content ?? {};
  const title = content.client ?? content.title ?? slug;
  return {
    title: `${title} — Ganda`,
    description: content.summary ?? undefined,
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const [story, projects] = await Promise.all([
    getStory(`work/${slug}`).catch(() => null),
    getWorkProjects().catch(() => []),
  ]);
  if (!story) notFound();
  return <ProjectDetail story={story} slug={slug} projects={projects} />;
}
