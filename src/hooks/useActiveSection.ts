import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently crossing the middle band of the
 * viewport. Sections that mount later (e.g. lazily loaded ones) are picked up
 * through a MutationObserver until every id has been found.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observed = new Set<string>();
    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    const observeAvailable = () => {
      for (const id of ids) {
        if (observed.has(id)) continue;
        const element = document.getElementById(id);
        if (element) {
          intersection.observe(element);
          observed.add(id);
        }
      }
      return observed.size === ids.length;
    };

    let mutation: MutationObserver | undefined;
    if (!observeAvailable()) {
      mutation = new MutationObserver(() => {
        if (observeAvailable()) mutation?.disconnect();
      });
      mutation.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      intersection.disconnect();
      mutation?.disconnect();
    };
  }, [ids]);

  return activeId;
}
