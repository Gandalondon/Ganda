import Link from "next/link";

const FEATURED_PROJECTS = [
  { slug: "finn-drive" },
  { slug: "eclipse" },
  { slug: "optic" },
  { slug: "profile" },
  { slug: "altitude" },
  { slug: "go" },
  { slug: "studio-hours" },
  { slug: "care" },
];

export default function WorkGrid() {
  return (
    <div className="gd-grid-3" style={{ columnGap: 24, rowGap: 24 }}>
      {FEATURED_PROJECTS.map((p) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          aria-label={`View project: ${p.slug.replace(/-/g, " ")}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1 / 1",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontSize: 16, color: "var(--ink-subtle)" }}
          >
            Work
          </span>
        </Link>
      ))}
      <Link
        href="/archive"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "1 / 1",
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 16, color: "var(--ink)" }}>Archive</span>
      </Link>
    </div>
  );
}
