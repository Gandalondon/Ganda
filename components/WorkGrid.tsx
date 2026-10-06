import Link from "next/link";
import type { WorkProject } from "@/lib/storyblok";

// Text-led project list (trial on feat/project-list). Replaces the thumbnail
// grid everywhere WorkGrid is used. Copy is hardcoded here for the trial;
// move it into Storyblok fields if this version ships. Keys are lower-case
// slugs. Projects without a thumbnail stay hidden, as before.
const SUMMARIES: Record<string, { text: string; tags: string }> = {
  finn: {
    text: "Five years shaping car discovery, pricing and checkout through design and experimentation.",
    tags: "Product design · Experimentation",
  },
  lionel: {
    text: "Designing and building a working prototype for a more personal way to find your next car.",
    tags: "Product design · Prototyping",
  },
  telescopic: {
    text: "Bringing a digital transformation consultancy’s identity and site together.",
    tags: "Branding · Site design",
  },
  cazoo: {
    text: "Designing the online car-buying experience during Cazoo’s founding phase.",
    tags: "Product design · E-commerce",
  },
  gap: {
    text: "Creating the identity and site for Gap Inc’s internal digital innovation agency.",
    tags: "Branding · Site design",
  },
  inpay: {
    text: "Redesigning a global payments company’s site, with improvements to performance and accessibility.",
    tags: "Site design · Fintech",
  },
  takumi: {
    text: "Evolving an influencer marketing agency’s identity and site through bold imagery and motion.",
    tags: "Branding · Site design",
  },
  barclays: {
    text: "Helping founders find relevant business support through the Eagle Labs site.",
    tags: "Site design · UX design",
  },
  archive: {
    text: "Selected earlier work across digital products, sites and brand identities.",
    tags: "Product design · Site design",
  },
};

function Chevron() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function WorkGrid({ projects }: { projects: WorkProject[] }) {
  const visible = projects.filter((p) => p.thumbnail);
  return (
    <ul className="gd-list">
      {visible.map((p) => {
        const s = SUMMARIES[p.slug.toLowerCase()];
        const tags = s?.tags ?? p.tags.join(" · ");
        return (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`} className="gd-row">
              <span className="gd-row-name">{p.name}</span>
              <span className="gd-row-desc">
                {s?.text && <span className="gd-row-text">{s.text}</span>}
                {tags && <span className="gd-row-tags">{tags}</span>}
              </span>
              <span className="gd-row-arrow" aria-hidden="true">
                <Chevron />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
