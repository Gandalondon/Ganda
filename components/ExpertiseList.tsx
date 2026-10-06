"use client";

import {
  storyblokEditable,
  useStoryblokState,
  type ISbStoryData,
  type SbBlokData,
} from "@storyblok/react";

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
    return (
      <div>
        {groups.map((group, i) => (
          <div
            key={group._uid ?? i}
            {...storyblokEditable(group)}
            className="gd-expertise-row"
          >
            <p style={{ ...textStyle, fontWeight: 500 }}>{group.title}</p>
            <div>
              {splitLines(group.items).map((item, j) => (
                <p key={j} style={textStyle}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: the original flat "expertise" text field (one item per line).
  const lines = splitLines(content.expertise);
  const expertise = lines.length > 0 ? lines : DEFAULT_EXPERTISE;

  return (
    <div className="gd-clients">
      {expertise.map((item, i) => (
        <p key={i} style={textStyle}>
          {item}
        </p>
      ))}
    </div>
  );
}
