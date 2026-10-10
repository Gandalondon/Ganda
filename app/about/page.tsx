import { getStory } from "@/lib/storyblok";
import { renderInlineLinks } from "@/lib/inline";
import ExpertiseList from "@/components/ExpertiseList";
import PageStatement from "@/components/PageStatement";
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

// The gap under the last row is the gap between the rows (96), and then the
// black closing block begins (main's own 144 elsewhere is for pages that end
// on a list).
export default async function AboutPage() {
  const story = await getStory("about").catch(() => null);
  const content = story?.content ?? {};

  const bio = (content.bio as string) || DEFAULT_BIO;
  const clients: string[] = (content.clients as string)
    ? (content.clients as string).split("\n").filter(Boolean)
    : DEFAULT_CLIENTS;

  // When expertise groups are set in Storyblok they replace the whole page
  // body (About, Expertise and Clients): each group is one row. The old
  // layout below stays as the fallback until groups exist.
  const groups = content.expertise_groups;

  // Optional opening statement, set from Storyblok in either of two ways: a
  // "hero_text" field on the About Page type, or a Hero Block (its Text field)
  // added to the Expertise Groups list. Either becomes the page's h1 above
  // everything else; the groups list skips the Hero Block itself (it has no
  // title), so it can sit anywhere in the list.
  const heroBlock = Array.isArray(groups)
    ? groups.find(
        (g) =>
          typeof g === "object" &&
          g !== null &&
          g.component === "hero_block" &&
          typeof g.text === "string" &&
          g.text.trim() !== "",
      )
    : undefined;
  const statement =
    typeof content.hero_text === "string" && content.hero_text.trim()
      ? content.hero_text.trim()
      : typeof heroBlock?.text === "string"
        ? heroBlock.text.trim()
        : "";
  const hasGroups =
    Array.isArray(groups) &&
    groups.some((g) => typeof g === "object" && g !== null && g.title);
  if (story && hasGroups) {
    return (
      <main id="main" style={{ paddingBottom: "calc(96 * var(--u))" }}>
        {/* Each row carries a 96px top margin; 32px more matches the 128px
            the old title sat at. With a statement above, it sits 128 from the
            nav and the first row 128 under it (32 + the row's 96). */}
        {statement ? (
          <>
            <PageStatement marginBottom="calc(32 * var(--u))">
              {renderInlineLinks(statement)}
            </PageStatement>
            <ExpertiseList story={story} statementAbove />
          </>
        ) : (
          <div style={{ paddingTop: "calc(32 * var(--u))" }}>
            <ExpertiseList story={story} />
          </div>
        )}
      </main>
    );
  }

  return (
    <main id="main" style={{ paddingBottom: "calc(96 * var(--u))" }}>
      {/* Title — full width, above the split */}
      <div
        className="gd-container"
        style={{ paddingTop: "calc(128 * var(--u))", paddingBottom: 0 }}
      >
        <div className="gd-split" style={{ gap: "calc(24 * var(--u))" }}>
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
      <div className="gd-container" data-fade-block style={{ marginTop: "calc(96 * var(--u))" }}>
        <div className="gd-split" style={{ gap: "calc(24 * var(--u))" }}>
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
    </main>
  );
}
