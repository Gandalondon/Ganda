import type { ReactNode } from "react";

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
    parts.push(text.slice(lastIndex, match.index));

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

  parts.push(text.slice(lastIndex));
  return parts;
}
