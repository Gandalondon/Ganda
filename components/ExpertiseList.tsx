"use client";

import {
  storyblokEditable,
  useStoryblokState,
  type ISbStoryData,
  type SbBlokData,
} from "@storyblok/react";
import { renderInlineLinks } from "@/lib/inline";

const DEFAULT_EXPERTISE = [
  "Product Design",
  "Product Strategy",
  "UX Research",
  "Experimentation",
  "Conversion Optimisation",
  "AI Workflows",
];

const textStyle = {
  fontSize: "var(--type-body)",
  fontWeight: 300,
  lineHeight: 1.45,
  color: "var(--ink)",
} as const;

type ExpertiseGroup = SbBlokData & {
  title?: string;
  items?: string;
};

// One item per line in Storyblok.
function splitLines(value: unknown): string[] {
  return typeof value === "string"
    ? value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

// Same, but remembers where a blank line separated two lines, so a short
// bio can keep its paragraph spacing while a plain list stays tight.
function splitBlocks(value: unknown): { text: string; gap: boolean }[] {
  if (typeof value !== "string") return [];
  const out: { text: string; gap: boolean }[] = [];
  let gap = false;
  for (const raw of value.split("\n")) {
    const text = raw.trim();
    if (!text) {
      gap = true;
      continue;
    }
    out.push({ text, gap: gap && out.length > 0 });
    gap = false;
  }
  return out;
}

export default function ExpertiseList({
  story,
}: {
  story: ISbStoryData<unknown>;
}) {
  const liveStory = useStoryblokState(story);
  const content =
    typeof liveStory?.content === "object" && liveStory.content !== null
      ? (liveStory.content as Record<string, unknown>)
      : {};

  // Preferred: repeatable "expertise_group" blocks (title + items).
  const rawGroups = content.expertise_groups;
  const groups = (Array.isArray(rawGroups) ? rawGroups : []).filter(
    (g): g is ExpertiseGroup =>
      typeof g === "object" &&
      g !== null &&
      Boolean((g as ExpertiseGroup).title),
  );

  if (groups.length > 0) {
    // Each group is a full row, laid out exactly like the Clients row: the
    // group title is the big left heading, its items the small, single-column
    // list on the right. The groups replace the single "Expertise" heading.
    return (
      <>
        {groups.map((group, i) => {
          // The page has no other title, so the first group is the h1.
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={group._uid ?? i}
              {...storyblokEditable(group)}
              // One fade for the whole row (title and items together).
              data-fade-block
              className="gd-container"
              style={{ marginTop: 96 }}
            >
              <div className="gd-split" style={{ gap: 24 }}>
                <Heading
                  style={{
                    fontSize: "var(--type-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.006em",
                    lineHeight: 1.15,
                    color: "var(--ink)",
                  }}
                >
                  {group.title}
                </Heading>
                <div>
                  {splitBlocks(group.items).map((item, j) => (
                    <p
                      key={j}
                      style={{
                        ...textStyle,
                        marginTop: item.gap ? "1.2em" : 0,
                      }}
                    >
                      {renderInlineLinks(item.text)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  // Fallback: the original flat "expertise" text field (one item per line).
  const lines = splitLines(content.expertise);
  const expertise = lines.length > 0 ? lines : DEFAULT_EXPERTISE;

  return (
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
          Expertise
        </h2>
        <div className="gd-clients">
          {expertise.map((item, i) => (
            <p key={i} style={textStyle}>
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
