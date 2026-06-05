export interface WordPart {
  text: string;
  accent: boolean;
}

/**
 * Splits text into words for per-word animation. Spans wrapped in
 * `*asterisks*` are flagged as accent, and punctuation touching an accent
 * (e.g. `*performance*,`) stays in the same word so no stray space appears.
 */
export function splitWords(text: string): WordPart[][] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split(/(\*[^*]+\*)/)
        .filter(Boolean)
        .map((part) =>
          part.startsWith('*') && part.endsWith('*') && part.length > 2
            ? { text: part.slice(1, -1), accent: true }
            : { text: part, accent: false },
        ),
    );
}

/** Text without accent markers, e.g. for accessible names. */
export const stripAccents = (text: string) => text.replaceAll('*', '');
