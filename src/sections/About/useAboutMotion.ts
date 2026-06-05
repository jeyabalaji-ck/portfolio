import type { RefObject } from 'react';
import { usePanelReveal } from '../../hooks/usePanelReveal';
import { gsap, media, useGSAP } from '../../motion/gsap';

/**
 * About motion:
 * - the panel opens from an inset, rounded mask as it rises over the hero (desktop);
 * - the statement brightens word by word, tied to scroll position;
 * - figures count up once they enter the viewport.
 */
export function useAboutMotion(scope: RefObject<HTMLElement | null>) {
  usePanelReveal(scope);

  useGSAP(
    () => {
      const panel = scope.current;
      if (!panel) return;
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        gsap.fromTo(
          '[data-statement-word]',
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: '[data-statement]',
              start: 'top 82%',
              end: 'bottom 45%',
              scrub: 0.4,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
          const target = Number(element.dataset.count);
          const decimals = Number.isInteger(target) ? 0 : 1;
          const counter = { value: 0 };
          element.textContent = (0).toFixed(decimals);
          gsap.to(counter, {
            value: target,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
            onUpdate: () => {
              element.textContent = counter.value.toFixed(decimals);
            },
          });
        });

        // Restore the real figures if the animation is reverted (e.g. reduced motion switched on).
        return () => {
          gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
            element.textContent = element.dataset.count ?? '';
          });
        };
      });
    },
    { scope },
  );
}
