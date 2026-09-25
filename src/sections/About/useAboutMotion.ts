import type { RefObject } from 'react';
import { usePanelReveal } from '../../hooks/usePanelReveal';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { gsap, media, useGSAP } from '../../motion/gsap';

/**
 * About motion:
 * - the panel opens from an inset, rounded mask as it rises over the hero (desktop);
 * - the statement brightens word by word, tied to scroll position;
 * - the focus grid's rules draw in and its items rise in sequence;
 * - figures count up once they enter the viewport;
 * - the technology tags below drift with scroll (`data-drift`).
 */
export function useAboutMotion(
  scope: RefObject<HTMLElement | null>,
  tags: RefObject<HTMLElement | null>,
) {
  usePanelReveal(scope);
  // Only the tags strip: it sits outside the Section, which runs its own reveals.
  useScrollReveal(tags);

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

        const items = gsap.utils.toArray<HTMLElement>('[data-focus-item]');
        gsap
          .timeline({ scrollTrigger: { trigger: '[data-focus-grid]', start: 'top 85%', once: true } })
          .fromTo(items, { '--rule': 0 }, { '--rule': 1, duration: 1.2, ease: 'expo.out', stagger: 0.06 }, 0)
          .from(items, { y: 36, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, 0.1);

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
