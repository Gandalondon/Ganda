import Link from "next/link";
import Image from "next/image";
import type { WorkProject } from "@/lib/storyblok";

export default function WorkGrid({ projects }: { projects: WorkProject[] }) {
  return (
    <div className="gd-grid-3" style={{ columnGap: 24, rowGap: 24 }}>
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          aria-label={`View project: ${p.name}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1 / 1",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {p.thumbnail ? (
            <Image
              src={p.thumbnail}
              alt={p.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span
              aria-hidden="true"
              style={{ fontSize: 16, color: "var(--ink-subtle)" }}
            >
              Work
            </span>
          )}
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
