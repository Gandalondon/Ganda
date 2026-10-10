import type { ReactNode } from "react";

// The house no-widow rule: the last two words of a block of text are joined
// with a non-breaking space, so the last line is never a single word.
// (text-wrap: pretty is only a hint and browsers often ignore it.)
export function noWidow(text: string): string {
  return text.replace(/\s+(\S+)\s*$/, "\u00a0$1");
}

// The house no-break-at-a-hyphen rule: a hyphenated word (AI-assisted,
// London-based) is kept whole, so a line never ends on "AI-".
function keepHyphenated(text: string, key: string): ReactNode[] {
  return text
    .split(/([\p{L}\p{N}\u2019']+(?:-[\p{L}\p{N}\u2019']+)+)/u)
    .map((piece, i) =>
      i % 2 === 1 ? (
        <span key={`${key}-${i}`} style={{ whiteSpace: "nowrap" }}>
          {piece}
        </span>
      ) : (
        piece
      ),
    );
}

// Both rules for a block of plain text (the big statements).
export function typeset(text: string): ReactNode[] {
  return keepHyphenated(noWidow(text), "t");
}

// Handles two inline markdown patterns within body copy: [label](href) links
// and **bold** emphasis. Both are matched in a single pass so ordering stays
// correct regardless of which appears first in the text.
export function renderInlineLinks(text: string): ReactNode[] {
  const inlinePattern = /\[([^\]]+)]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text)) !== null) {
    const [markdown, label, href, boldText] = match;
    parts.push(...keepHyphenated(text.slice(lastIndex, match.index), `m${match.index}`));

    if (boldText !== undefined) {
      parts.push(<strong key={match.index}>{boldText}</strong>);
    } else {
      const isSafeLink = href.startsWith("/") || /^https?:\/\//.test(href);
      parts.push(
        isSafeLink ? (
          <a
            key={`${match.index}-${href}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        ) : (
          markdown
        ),
      );
    }
    lastIndex = match.index + markdown.length;
  }

  parts.push(...keepHyphenated(noWidow(text.slice(lastIndex)), "end"));
  return parts;
}
