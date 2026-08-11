"use client";

import { useStoryblokState } from "@storyblok/react";

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
  story: Parameters<typeof useStoryblokState>[0];
}) {
  const liveStory = useStoryblokState(story);
  const value = liveStory?.content?.expertise;
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
