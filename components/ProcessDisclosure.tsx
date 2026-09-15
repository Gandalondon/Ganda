"use client";

import { useId, useState } from "react";

// Shape kept flat and array-based so this can later be populated straight
// from a Storyblok bloks field (each entry becomes one bloks item with an
// optional subheading and one or more paragraphs).
export type ProcessBlock = {
  heading?: string;
  paragraphs: string[];
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: 18,
  // See app/writing/page.tsx — Instrument Sans has no 300 weight, so the
  // rest of the page renders body copy at 400. Matched here for consistency.
  fontWeight: 400,
  lineHeight: 1.5,
  color: "#ffffff",
};

const buttonStyle: React.CSSProperties = {
  ...bodyTextStyle,
  display: "inline-block",
  marginTop: "1.2em",
  padding: 0,
  border: 0,
  background: "none",
  color: "inherit",
  textDecoration: "underline",
  cursor: "pointer",
  WebkitAppearance: "none",
};

export default function ProcessDisclosure({
  blocks,
}: {
  blocks: ProcessBlock[];
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
        style={buttonStyle}
      >
        {open ? "Close process ↑" : "Read about the process ↓"}
      </button>

      <div
        id={contentId}
        className="gd-process-collapse"
        data-open={open || undefined}
      >
        <div className="gd-process-collapse-inner">
          {blocks.map((block, i) => (
            <div key={i} style={{ marginTop: i === 0 ? "1.2em" : "1.6em" }}>
              {block.heading && (
                <h3
                  style={{
                    ...bodyTextStyle,
                    fontWeight: 700,
                    marginBottom: "0.4em",
                  }}
                >
                  {block.heading}
                </h3>
              )}
              {block.paragraphs.map((para, j) => (
                <p
                  key={j}
                  style={{
                    ...bodyTextStyle,
                    marginTop: j === 0 ? 0 : "1.2em",
                    textWrap: "pretty" as React.CSSProperties["textWrap"],
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
