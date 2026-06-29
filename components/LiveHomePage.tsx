"use client";

import { useStoryblokState } from "@storyblok/react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  slug: string;
  title: string;
  thumbnail?: { filename: string; alt?: string };
  localImage?: string;
};

const FALLBACK_PROJECTS: Project[] = [
  { slug: "finn-drive", title: "FINN", localImage: "/work/work-01.jpg" },
  { slug: "eclipse", title: "Eclipse", localImage: "/work/work-02.jpg" },
  { slug: "optic", title: "Optic", localImage: "/work/work-03.jpg" },
  { slug: "profile", title: "Profile", localImage: "/work/work-04.jpg" },
  { slug: "altitude", title: "Altitude", localImage: "/work/work-05.jpg" },
  { slug: "go", title: "Go!", localImage: "/work/work-06.jpg" },
  {
    slug: "studio-hours",
    title: "Studio Hours",
    localImage: "/work/work-07.jpg",
  },
  { slug: "care", title: "Care", localImage: "/work/work-08.jpg" },
  { slug: "creekside", title: "Creekside", localImage: "/work/work-09.jpg" },
  { slug: "bloom", title: "Bloom", localImage: "/work/work-10.jpg" },
  { slug: "horizon", title: "Horizon", localImage: "/work/work-11.jpg" },
  { slug: "detail", title: "Detail", localImage: "/work/work-12.jpg" },
  { slug: "expedition", title: "Expedition", localImage: "/work/work-13.jpg" },
  { slug: "pasture", title: "Pasture", localImage: "/work/work-14.jpg" },
  { slug: "make", title: "Make", localImage: "/work/work-15.jpg" },
  { slug: "sovereign", title: "Sovereign", localImage: "/work/work-16.jpg" },
];

export default function LiveHomePage({
  story: initialStory,
}: {
  story: unknown;
}) {
  const story = useStoryblokState(initialStory as never);
  const content =
    (story as { content?: Record<string, unknown> })?.content ?? {};

  const heroText =
    (content.intro as string) ??
    "Hello, I'm Tony Goff-Yu. I have over twenty years of design experience across branding, user experience and interaction design. I help businesses improve customer experience and conversion. This is my work.";

  const projects: Project[] = (content.projects as Project[])?.length
    ? (content.projects as Project[])
    : FALLBACK_PROJECTS;

  return (
    <main style={{ padding: "0 192px 140px" }}>
      <p
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 1060,
          marginTop: 248,
          marginBottom: 112,
          fontSize: "clamp(28px, 3.4vw, 48px)",
          lineHeight: 1.32,
          fontWeight: 400,
          letterSpacing: "2px",
          color: "var(--ink)",
        }}
      >
        {heroText}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          columnGap: 24,
          rowGap: 24,
        }}
      >
        {projects.map((p) => {
          const src = p.thumbnail?.filename ?? p.localImage ?? "";
          return (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              style={{
                position: "relative",
                display: "block",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: "var(--surface-raised)",
              }}
            >
              {src && (
                <Image
                  src={src}
                  alt={p.thumbnail?.alt ?? p.title}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
