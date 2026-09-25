import type { RefObject } from 'react';
import { useGSAP } from '../motion/gsap';
import { createReveals } from '../motion/reveal';

/**
 * Activates the `data-reveal`, `data-parallax` and `data-drift` markup inside
 * `scope` (see motion/reveal.ts). Everything is reverted on unmount.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => (scope.current ? createReveals(scope.current) : undefined), { scope });
}
