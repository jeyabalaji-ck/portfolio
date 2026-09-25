import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap';

/**
 * Reports which of the elements matching `selector` inside `scope` is crossing
 * the activation line (55% down the viewport), for scroll-driven "current
 * step" UIs. It is state rather than motion, so it also runs with reduced
 * motion. `onActivate` should be stable (e.g. a state setter).
 */
export function useStepActivation(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  onActivate: (index: number) => void,
) {
  useGSAP(
    () => {
      if (!scope.current) return;
      gsap.utils.toArray<HTMLElement>(selector).forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) onActivate(index);
          },
        });
      });
    },
    { scope, dependencies: [selector, onActivate] },
  );
}
