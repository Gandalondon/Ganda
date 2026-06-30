"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { WorkProject } from "@/lib/storyblok";

function GridTile({ p }: { p: WorkProject }) {
  const [loaded, setLoaded] = useState(false);
  if (!p.thumbnail) return null;
  return (
    <Link
      href={`/work/${p.slug}`}
      aria-label={`View project: ${p.name}`}
      className={p.thumbnail && !loaded ? "gd-skeleton" : undefined}
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
          style={{
            objectFit: "cover",
            transition: "opacity 0.3s",
            opacity: loaded ? 1 : 0,
          }}
          onLoad={() => setLoaded(true)}
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
  );
}

export default function WorkGrid({ projects }: { projects: WorkProject[] }) {
  return (
    <div className="gd-grid-3" style={{ columnGap: 24, rowGap: 24 }}>
      {projects.map((p) => (
        <GridTile key={p.slug} p={p} />
      ))}
    </div>
  );
}
