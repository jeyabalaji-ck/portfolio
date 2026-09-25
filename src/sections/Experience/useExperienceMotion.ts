import type { RefObject } from 'react';
import { useStepActivation } from '../../hooks/useStepActivation';
import { gsap, media, useGSAP } from '../../motion/gsap';

/**
 * Drives the experience timeline: each role becomes active as it crosses the
 * middle of the viewport, and the timeline lines (the desktop rail and the
 * line beside the cards on small screens) grow in step with scroll progress.
 */
export function useExperienceMotion(
  scope: RefObject<HTMLElement | null>,
  onActivate: (index: number) => void,
) {
  useStepActivation(scope, '[data-role-card]', onActivate);

  useGSAP(
    () => {
      if (!scope.current) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(
          '[data-rail-fill], [data-roles-fill]',
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
    { scope },
  );
}
