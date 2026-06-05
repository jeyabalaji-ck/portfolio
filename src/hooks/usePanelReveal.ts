import type { RefObject } from 'react';
import { gsap, media, useGSAP } from '../motion/gsap';

/**
 * Opens a full-width panel from an inset, rounded mask as it scrolls into
 * view, so the section appears to rise and unfold over the one before it.
 * Desktop only: on small screens the inset would just waste width.
 */
export function usePanelReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const panel = ref.current;
      if (!panel) return;
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        gsap.fromTo(
          panel,
          { clipPath: 'inset(0% 5% 0% 5% round 2.5rem)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0rem)',
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 20%', scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );
}
