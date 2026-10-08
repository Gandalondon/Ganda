import { getStory, getWorkProjects } from "@/lib/storyblok";
import WorkGrid from "@/components/WorkGrid";
import { renderInlineLinks } from "@/lib/inline";
import ExpertiseList from "@/components/ExpertiseList";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About — Ganda",
  description:
    "Tony Goff-Yu — product design, strategy and digital experience.",
  path: "/about",
});

const DEFAULT_BIO =
  "Studio introduction goes here. A short statement describing the studio or individual, the focus of the work and the approach taken.\n\nA second paragraph with more detail — the kinds of clients, sectors or disciplines covered, and the way projects are typically run.\n\nA closing line, for example an invitation to get in touch about new work.";

const DEFAULT_CLIENTS = [
  "Client Name",
  "Client Name",
  "Client Name",
  "Client Name",
  "Client Name",
  "Client Name",
];

export default async function AboutPage() {
  const [story, projects] = await Promise.all([
    getStory("about").catch(() => null),
    getWorkProjects().catch(() => []),
  ]);
  const content = story?.content ?? {};

  const bio = (content.bio as string) || DEFAULT_BIO;
  const clients: string[] = (content.clients as string)
    ? (content.clients as string).split("\n").filter(Boolean)
    : DEFAULT_CLIENTS;

  // When expertise groups are set in Storyblok they replace the whole page
  // body (About, Expertise and Clients): each group is one row. The old
  // layout below stays as the fallback until groups exist.
  const groups = content.expertise_groups;
  const hasGroups =
    Array.isArray(groups) &&
    groups.some((g) => typeof g === "object" && g !== null && g.title);
  if (story && hasGroups) {
    return (
      <main id="main" style={{ paddingBottom: 144 }}>
        {/* Each row carries a 96px top margin; 32px more matches the 128px
            the old title sat at. */}
        <div style={{ paddingTop: 32 }}>
          <ExpertiseList story={story} />
        </div>
        <div className="gd-container" style={{ marginTop: 200 }}>
          <WorkGrid projects={projects} />
        </div>
      </main>
    );
  }

  return (
    <main id="main" style={{ paddingBottom: 144 }}>
      {/* Title — full width, above the split */}
      <div
        className="gd-container"
        style={{ paddingTop: 128, paddingBottom: 0 }}
      >
        <div className="gd-split" style={{ gap: 24 }}>
          <h1
            style={{
              fontSize: "var(--type-display)",
              fontWeight: 500,
              letterSpacing: "-0.006em",
              lineHeight: 1.15,
            }}
          >
            About
          </h1>
          <div>
            {bio.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: "var(--type-body)",
                  fontWeight: 300,
                  lineHeight: 1.45,
                  color: "var(--ink)",
                  marginTop: i === 0 ? 0 : "1.2em",
                  textWrap: "pretty" as React.CSSProperties["textWrap"],
                }}
              >
                {renderInlineLinks(para)}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Expertise. Renders its own rows: one per Storyblok
          expertise_group (big title left, items right), or the original
          single "Expertise" row if no groups are set. */}
      {story ? <ExpertiseList story={story} /> : null}

      {/* Row 3: Clients label left, client list right */}
      <div className="gd-container" data-fade-block style={{ marginTop: 96 }}>
        <div className="gd-split" style={{ gap: 24 }}>
          <h2
            style={{
              fontSize: "var(--type-display)",
              fontWeight: 500,
              letterSpacing: "-0.006em",
              lineHeight: 1.15,
              color: "var(--ink)",
            }}
          >
            Clients
          </h2>
          <div className="gd-clients">
            {clients.map((c, i) => (
              <p
                key={i}
                style={{
                  fontSize: "var(--type-body)",
                  fontWeight: 300,
                  lineHeight: 1.45,
                  color: "var(--ink)",
                }}
              >
                {c}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Work grid */}
      <div className="gd-container" style={{ marginTop: 200 }}>
        <WorkGrid projects={projects} />
      </div>
    </main>
  );
}
