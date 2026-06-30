import type { MetadataRoute } from "next";
import { getWorkProjects } from "@/lib/storyblok";

const BASE = "https://gandalondon.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getWorkProjects().catch(() => []);
  const workEntries = projects.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8 },
    ...workEntries,
  ];
}
