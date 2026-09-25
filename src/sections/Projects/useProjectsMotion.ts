import type { RefObject } from 'react';
import { gsap, media, ScrollTrigger, useGSAP } from '../../motion/gsap';
import { scrollToTarget } from '../../motion/smoothScroll';

/** Must match `$horizontal` in Projects.module.scss. */
export const HORIZONTAL = '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Work gallery motion.
 * - Large screens: the gallery pins and vertical scrolling moves the project
 *   panels horizontally. Each panel scales up as it arrives and its visual
 *   drifts against the movement for depth; a counter and progress bar track
 *   the position. Keyboard focus moving into an off-screen panel scrolls the
 *   page to bring that panel into view.
 * - Smaller screens: panels stack vertically and lift in as they appear.
 * - Reduced motion: a plain vertical list.
 */
export function useProjectsMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: media.motion, horizontal: HORIZONTAL }, (context) => {
        const { motion, horizontal } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        const pin = root.querySelector<HTMLElement>('[data-work-pin]');
        const track = root.querySelector<HTMLElement>('[data-work-track]');
        const slides = gsap.utils.toArray<HTMLElement>('[data-work-slide]');
        if (!pin || !track) return;

        if (!horizontal) {
          slides.forEach((slide) => {
            gsap.from(slide, {
              y: 60,
              opacity: 0,
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: slide, start: 'top 90%', once: true },
            });
            const layers = slide.querySelectorAll<HTMLElement>('[data-depth]');
            gsap.fromTo(
              layers,
              { y: (_: number, element: HTMLElement) => Number(element.dataset.depth) * 12 },
              {
                y: (_: number, element: HTMLElement) => Number(element.dataset.depth) * -12,
                ease: 'none',
                scrollTrigger: { trigger: slide, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
              },
            );
          });
          return;
        }

        const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
        const current = root.querySelector<HTMLElement>('[data-work-current]');
        const fill = root.querySelector<HTMLElement>('[data-work-progress]');
        const setProgress = fill ? gsap.quickSetter(fill, 'scaleX') : () => undefined;
        let shown = 0;

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress);
              const index = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1)));
              if (index !== shown && current) {
                shown = index;
                current.textContent = pad(index + 1);
              }
            },
          },
        });

        slides.forEach((slide, index) => {
          const card = slide.querySelector<HTMLElement>('[data-project-card]');
          const stage = slide.querySelector<HTMLElement>('[data-visual-stage]');
          const bigIndex = slide.querySelector<HTMLElement>('[data-project-index]');
          const inView = { trigger: slide, containerAnimation: travel, scrub: true };

          // Panels after the first arrive slightly small and settle to full size.
          if (card && index > 0) {
            gsap.fromTo(
              card,
              { scale: 0.88, rotate: 1.5 },
              { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { ...inView, start: 'left right', end: 'left 35%' } },
            );
          }
          if (stage) {
            gsap.fromTo(
              stage,
              { xPercent: 9 },
              { xPercent: -9, ease: 'none', scrollTrigger: { ...inView, start: 'left right', end: 'right left' } },
            );
          }
          if (bigIndex) {
            gsap.fromTo(
              bigIndex,
              { xPercent: 60 },
              { xPercent: -30, ease: 'none', scrollTrigger: { ...inView, start: 'left right', end: 'right left' } },
            );
          }
        });

        // Keep keyboard users oriented: focusing into a panel scrolls it into view.
        const onFocusIn = (event: FocusEvent) => {
          const slide = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-work-slide]') : null;
          const trigger = travel.scrollTrigger;
          if (!slide || !trigger) return;
          const total = distance();
          // Slides are positioned relative to the track; centre the focused one in the viewport.
          const offset = Math.min(total, Math.max(0, slide.offsetLeft - (pin.clientWidth - slide.offsetWidth) / 2));
          const progress = total ? offset / total : 0;
          scrollToTarget(trigger.start + progress * (trigger.end - trigger.start), { immediate: true });
        };
        track.addEventListener('focusin', onFocusIn);

        return () => track.removeEventListener('focusin', onFocusIn);
      });

      // Sections below the pin must be measured after its spacing exists.
      ScrollTrigger.sort();
    },
    { scope },
  );
}
