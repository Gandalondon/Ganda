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
      className={loaded ? undefined : "gd-skeleton"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "1 / 1",
        background: "var(--surface-raised)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image
        src={p.thumbnail}
        alt=""
        className="gd-tile-img"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: "cover",
          // Shown the moment it has loaded, with no fade: it replays on
          // every page change otherwise.
          opacity: loaded ? 1 : 0,
        }}
        onLoad={() => setLoaded(true)}
      />
      {/* Labels sit above the image. The link already carries an
          aria-label, so the image alt is empty and these are visual only. */}
      <span className="gd-tile-hover" aria-hidden="true" />
      <span className="gd-tile-scrim" aria-hidden="true" />
      <div className="gd-tile-label">
        <p className="gd-tile-name">{p.name}</p>
        {p.tags.length > 0 && (
          <p className="gd-tile-tags">{p.tags.join(" \u00b7 ")}</p>
        )}
      </div>
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
