import { getStory } from "@/lib/storyblok";
import Link from "next/link";
import Image from "next/image";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStory(`work/${slug}`).catch(() => null);
  const content = story?.content ?? {};

  return (
    <div
      style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px 96px" }}
    >
      <Link
        href="/"
        style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}
      >
        ← Back to work
      </Link>

      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          marginTop: "40px",
          marginBottom: "8px",
        }}
      >
        {content.title ?? story?.name ?? slug}
      </h1>
      {content.discipline && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--ink-muted)",
            marginBottom: "40px",
          }}
        >
          {content.discipline}
        </p>
      )}

      {content.cover_image?.filename && (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            marginBottom: "48px",
            background: "var(--grey-100)",
          }}
        >
          <Image
            src={content.cover_image.filename}
            alt={content.cover_image.alt || ""}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {content.body && (
        <div style={{ maxWidth: "640px" }}>
          {(content.body as string[]).map((p: string, i: number) => (
            <p
              key={i}
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.65,
                marginBottom: "1.5em",
                color: "var(--ink)",
              }}
            >
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
