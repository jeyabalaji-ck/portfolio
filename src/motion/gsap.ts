import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });
// Mobile address bars resize the viewport while scrolling; recalculating then causes jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

// Trigger positions depend on text metrics, so measure again once web fonts have loaded.
if (typeof document !== 'undefined' && 'fonts' in document) {
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/** Easing by intent, so the same kind of movement always feels the same. */
export const ease = {
  /** Content arriving on screen: fast start, long soft landing. */
  reveal: 'expo.out',
  /** Typography rising out of a mask. */
  text: 'power4.out',
  /** Full-screen wipes and panel transitions. */
  wipe: 'power3.inOut',
  /** Small UI feedback such as magnetic movement. */
  settle: 'power3.out',
} as const;

/**
 * Media conditions shared by every animation. They are evaluated through
 * gsap.matchMedia(), which reverts animations automatically when a condition
 * stops matching (for example when reduced motion is switched on).
 */
export const media = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
  pointer: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
} as const;

export { gsap, ScrollTrigger, useGSAP };
