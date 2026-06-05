import { gsap, media } from './gsap';

/**
 * Scroll reveals driven by `data-reveal` attributes, so sections describe what
 * should animate in markup and share one motion vocabulary:
 *
 * - `words`   words rise out of their masks (use with <SplitText>)
 * - `fade`    the element lifts and fades in
 * - `stagger` the element's children lift in one after another
 * - `clip`    the element is uncovered from the bottom up
 * - `line`    a rule draws from left to right
 *
 * Opacity is animated rather than visibility so hidden content stays focusable:
 * tabbing to it scrolls it into view, which plays the reveal.
 */
export function createReveals(scope: HTMLElement) {
  const mm = gsap.matchMedia();

  mm.add({ motion: media.motion, desktop: media.desktop }, (context) => {
    const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
    if (!motion) return;

    const distance = desktop ? 48 : 28;

    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      const scrollTrigger = { trigger: element, start: 'top 88%', once: true };

      switch (element.dataset.reveal) {
        case 'words':
          gsap.from(element.querySelectorAll('[data-word]'), {
            yPercent: 115,
            rotate: desktop ? 4 : 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger,
          });
          break;
        case 'fade':
          gsap.from(element, { y: distance, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger });
          break;
        case 'stagger':
          gsap.from(element.children, {
            y: distance,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger,
          });
          break;
        case 'clip':
          gsap.from(element, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger,
          });
          break;
        case 'line':
          gsap.from(element, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger,
          });
          break;
      }
    });
  });

  return () => mm.revert();
}
