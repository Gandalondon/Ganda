import { getStory } from "@/lib/storyblok";

const DEFAULT_ITEMS = [
  {
    slug: "archive-1",
    title: "Project Name",
    discipline: "Category",
    client: "Client Name",
    year: "Year",
    summary: "A concise one-line summary of this archived project.",
  },
  {
    slug: "archive-2",
    title: "Project Name",
    discipline: "Category",
    client: "Client Name",
    year: "Year",
    summary: "A concise one-line summary of this archived project.",
  },
  {
    slug: "archive-3",
    title: "Project Name",
    discipline: "Category",
    client: "Client Name",
    year: "Year",
    summary: "A concise one-line summary of this archived project.",
  },
  {
    slug: "archive-4",
    title: "Project Name",
    discipline: "Category",
    client: "Client Name",
    year: "Year",
    summary: "A concise one-line summary of this archived project.",
  },
  {
    slug: "archive-5",
    title: "Project Name",
    discipline: "Category",
    client: "Client Name",
    year: "Year",
    summary: "A concise one-line summary of this archived project.",
  },
  {
    slug: "archive-6",
    title: "Project Name",
    discipline: "Category",
    client: "Client Name",
    year: "Year",
    summary: "A concise one-line summary of this archived project.",
  },
];

type ArchiveItem = {
  slug: string;
  title: string;
  discipline?: string;
  client?: string;
  year?: string;
  summary?: string;
};

export default async function ArchivePage() {
  const story = await getStory("archive").catch(() => null);
  const content = story?.content ?? {};
  const items: ArchiveItem[] = (content.items as ArchiveItem[])?.length
    ? (content.items as ArchiveItem[])
    : DEFAULT_ITEMS;

  return (
    <main style={{ paddingBottom: 144 }}>
      {/* Rows — info left, image well right */}
      {items.map((it, i) => (
        <div
          key={it.slug || i}
          className="gd-container"
          style={{ marginTop: i === 0 ? 128 : 96 }}
        >
          <div className="gd-split" style={{ gap: 24 }}>
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                  fontWeight: 400,
                  letterSpacing: "1px",
                  lineHeight: 1.25,
                  marginBottom: 24,
                }}
              >
                {it.title}
              </h2>
              <p style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.4 }}>
                {it.summary}
              </p>
            </div>
            <div
              style={{
                aspectRatio: "4 / 5",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
