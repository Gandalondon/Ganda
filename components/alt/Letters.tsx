import type { CSSProperties } from "react";

// Splits a phrase into words (kept whole, so a line can never break inside a
// word) made of single-letter spans. Each letter gets its index in --i, which
// the CSS in app/alt/alt.css uses as the animation delay. The spans are
// aria-hidden: the parent renders the complete phrase for screen readers.
export default function Letters({ text }: { text: string }) {
  let index = 0;
  const words = text
    .split(" ")
    .map((word) => [...word].map((char) => ({ char, i: index++ })));

  return (
    <span aria-hidden="true">
      {words.map((letters, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="alt-w">
            {letters.map(({ char, i }) => (
              <span
                key={i}
                className="alt-l"
                style={{ "--i": i } as CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
