import Link from "next/link";
import type { WorkProject } from "@/lib/storyblok";

import WorkGridTiles from "@/components/WorkGridTiles";

// Which layout every work list on the site uses (home, about, foot of each
// project page). "grid" brings back the previous thumbnail grid exactly as it
// was (components/WorkGridTiles.tsx; its CSS is still in globals.css).
const LAYOUT: "list" | "grid" = "list";

// Project list content comes from Storyblok, per work story:
//   name         -> story name
//   description  -> "list_description" (Textarea)
//   tags         -> "tags" (Text, comma-separated), shown as "A · B"
// Projects without a thumbnail stay hidden, as with the grid.
//
// FALLBACK only covers the gap until list_description is filled in for each
// story. Once every project has one in Storyblok, delete this map.
const FALLBACK: Record<string, { text: string; tags: string }> = {
  finn: {
    text: "Five years shaping car discovery, pricing and checkout through product design and experimentation.",
    tags: "Product design · Experimentation",
  },
  lionel: {
    text: "Designing and building a working prototype to help drivers find their next car in a more personal way.",
    tags: "Product design · Prototyping",
  },
  telescopic: {
    text: "Creating a brand identity and site for a consultancy helping businesses with digital transformation.",
    tags: "Branding · Site design",
  },
  cazoo: {
    text: "Designing discovery, finance and checkout for an online car retailer during its early founding phase.",
    tags: "Product design · E-commerce",
  },
  gap: {
    text: "Creating the brand identity and site for Thomas Street, Gap Inc’s internal digital innovation agency.",
    tags: "Branding · Site design",
  },
  inpay: {
    text: "Redesigning a global payments company’s site to improve performance, accessibility and sustainability.",
    tags: "Site design · Fintech",
  },
  takumi: {
    text: "Evolving an influencer marketing agency’s identity and site with bold imagery and expressive motion.",
    tags: "Branding · Site design",
  },
  barclays: {
    text: "Designing the Eagle Labs site to help founders find workspaces, programmes and relevant business support.",
    tags: "Site design · UX design",
  },
  archive: {
    text: "Selected earlier work across digital products, sites and brand identities for a wide range of clients.",
    tags: "Product design · Site design",
  },
};

// Material "arrow_forward", filled, 24px.
function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
    </svg>
  );
}

export default function WorkGrid({ projects }: { projects: WorkProject[] }) {
  if (LAYOUT === "grid") return <WorkGridTiles projects={projects} />;
  const visible = projects.filter((p) => p.thumbnail);
  return (
    <ul className="gd-list">
      {visible.map((p) => {
        const fallback = FALLBACK[p.slug.toLowerCase()];
        const text = p.listDescription ?? fallback?.text;
        const tags =
          p.tags.length > 0 ? p.tags.join(" · ") : fallback?.tags;
        return (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`} className="gd-row">
              <span className="gd-row-name">{p.name}</span>
              <span className="gd-row-desc">
                {text && <span className="gd-row-text">{text}</span>}
                {tags && <span className="gd-row-tags">{tags}</span>}
              </span>
              <span className="gd-row-arrow" aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
