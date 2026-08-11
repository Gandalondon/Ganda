"use client";

import { useStoryblokState, type ISbStoryData } from "@storyblok/react";

const DEFAULT_EXPERTISE = [
  "Product Design",
  "Product Strategy",
  "UX Research",
  "Experimentation",
  "Conversion Optimisation",
  "AI Workflows",
];

export default function ExpertiseList({
  story,
}: {
  story: ISbStoryData<unknown>;
}) {
  const liveStory = useStoryblokState(story);
  const content = liveStory?.content;
  const value =
    typeof content === "object" && content !== null && "expertise" in content
      ? content.expertise
      : undefined;
  const expertise =
    typeof value === "string" && value.trim()
      ? value.split("\n").filter(Boolean)
      : DEFAULT_EXPERTISE;

  return (
    <div className="gd-clients">
      {expertise.map((item, i) => (
        <p
          key={i}
          style={{
            fontSize: 18,
            fontWeight: 300,
            lineHeight: 1.5,
            color: "var(--ink)",
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );
}
