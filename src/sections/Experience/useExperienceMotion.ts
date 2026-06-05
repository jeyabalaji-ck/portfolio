import type { RefObject } from 'react';
import { gsap, media, ScrollTrigger, useGSAP } from '../../motion/gsap';

/**
 * Drives the experience timeline: each role becomes active as it crosses the
 * middle of the viewport, and the rail fills in step with scroll progress.
 * Activation is state, not motion, so it also runs with reduced motion.
 */
export function useExperienceMotion(
  scope: RefObject<HTMLElement | null>,
  onActivate: (index: number) => void,
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.utils.toArray<HTMLElement>('[data-role-card]').forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) onActivate(index);
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(
          '[data-rail-fill]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-roles]',
              start: 'top 55%',
              end: 'bottom 55%',
              scrub: 0.5,
            },
          },
        );
      });
    },
    { scope, dependencies: [onActivate] },
  );
}
