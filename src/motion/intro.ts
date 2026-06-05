/**
 * Coordinates the page-load sequence: the intro overlay announces when the page
 * underneath may start its entrance, and the hero and header wait for it.
 */
type Listener = () => void;

const SESSION_KEY = 'intro-played';
const listeners = new Set<Listener>();
let revealed = false;

function decideIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Deep links should land on their section straight away.
  if (window.location.hash.length > 1) return false;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Storage may be unavailable; the intro then simply plays.
  }
  return true;
}

/** Whether the intro overlay plays on this page load. Decided once per load. */
export const introEnabled = decideIntro();

if (!introEnabled) revealed = true;

export function markIntroRevealed() {
  if (revealed) return;
  revealed = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Runs `listener` once the page may reveal itself. Returns an unsubscribe function. */
export function whenIntroRevealed(listener: Listener): () => void {
  if (revealed) {
    listener();
    return () => undefined;
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}
