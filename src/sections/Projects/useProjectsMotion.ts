import type { RefObject } from 'react';
import { gsap, media, useGSAP } from '../../motion/gsap';

/** Must match the media query that enables sticky stacking in Projects.module.scss. */
const STACKED = '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';

/**
 * Project presentation:
 * - Desktop: cards stick and stack; as the next card slides over, the covered
 *   card recedes (scale + shade) so attention moves to the new one.
 * - Everywhere: each card's visual layers drift at their own depth while it
 *   enters, and the card lifts into view on smaller screens.
 */
export function useProjectsMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const list = scope.current;
      if (!list) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: media.motion, stacked: STACKED }, (context) => {
        const { motion, stacked } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        const slots = gsap.utils.toArray<HTMLElement>('[data-project-slot]');

        slots.forEach((slot, index) => {
          const card = slot.querySelector<HTMLElement>('[data-project-card]');
          const stage = slot.querySelector<HTMLElement>('[data-visual-stage]');
          const layers = slot.querySelectorAll<HTMLElement>('[data-depth]');
          const next = slots[index + 1];

          // Depth: layers inside the visual travel further the higher their depth.
          gsap.fromTo(
            layers,
            { y: (_: number, element: HTMLElement) => Number(element.dataset.depth) * 18 },
            {
              y: (_: number, element: HTMLElement) => Number(element.dataset.depth) * -18,
              ease: 'none',
              scrollTrigger: { trigger: slot, start: 'top bottom', end: 'top top', scrub: 0.8 },
            },
          );
          if (stage) {
            gsap.fromTo(
              stage,
              { yPercent: 6 },
              {
                yPercent: 0,
                ease: 'none',
                scrollTrigger: { trigger: slot, start: 'top bottom', end: 'top top', scrub: 0.8 },
              },
            );
          }

          if (!card) return;

          if (stacked && next) {
            gsap.to(card, {
              scale: 0.92,
              '--shade': 0.55,
              ease: 'none',
              transformOrigin: '50% 0%',
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
              },
            });
          } else if (!stacked) {
            gsap.from(card, {
              y: 60,
              opacity: 0,
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: slot, start: 'top 90%', once: true },
            });
          }
        });
      });
    },
    { scope },
  );
}
