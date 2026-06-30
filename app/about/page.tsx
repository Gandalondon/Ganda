import { getStory, getWorkProjects } from "@/lib/storyblok";
import WorkGrid from "@/components/WorkGrid";

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

  return (
    <main style={{ paddingBottom: 144 }}>
      {/* Title — full width, above the split */}
      <div
        className="gd-container"
        style={{ paddingTop: 128, paddingBottom: 0 }}
      >
        <div className="gd-split" style={{ gap: 24 }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
              fontWeight: 400,
              letterSpacing: "1px",
              lineHeight: 1.25,
            }}
          >
            About
          </h1>
          <div>
            {bio.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  lineHeight: 1.5,
                  color: "var(--ink)",
                  marginTop: i === 0 ? 0 : "1.2em",
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Clients label left, client list right */}
      <div className="gd-container" style={{ marginTop: 96 }}>
        <div className="gd-split" style={{ gap: 24 }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
              fontWeight: 400,
              letterSpacing: "1px",
              lineHeight: 1.25,
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
                  fontSize: 18,
                  fontWeight: 300,
                  lineHeight: 1.5,
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
