import { useEffect, useRef } from 'react';
import { ease, gsap, media } from '../motion/gsap';

interface MagneticOptions {
  /** How far the element follows the pointer, as a fraction of the pointer offset. */
  strength?: number;
  /** Extra travel for a `[data-magnetic-inner]` child, for a layered feel. */
  innerStrength?: number;
}

/**
 * Pulls an element slightly toward the pointer while it hovers, then lets it
 * settle back. Only active for precise pointers with motion allowed. The
 * element is measured on enter, so pointer moves never trigger layout.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.3,
  innerStrength = 0.18,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia(media.pointer).matches) return;

    const inner = element.querySelector<HTMLElement>('[data-magnetic-inner]');
    const tween = { duration: 0.7, ease: ease.settle };
    const moveX = gsap.quickTo(element, 'x', tween);
    const moveY = gsap.quickTo(element, 'y', tween);
    const innerX = inner ? gsap.quickTo(inner, 'x', tween) : null;
    const innerY = inner ? gsap.quickTo(inner, 'y', tween) : null;
    let bounds: DOMRect | null = null;

    const onEnter = () => {
      bounds = element.getBoundingClientRect();
    };
    const onMove = (event: PointerEvent) => {
      bounds ??= element.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      moveX(dx * strength);
      moveY(dy * strength);
      innerX?.(dx * innerStrength);
      innerY?.(dy * innerStrength);
    };
    const onLeave = () => {
      bounds = null;
      moveX(0);
      moveY(0);
      innerX?.(0);
      innerY?.(0);
    };

    element.addEventListener('pointerenter', onEnter);
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);

    return () => {
      element.removeEventListener('pointerenter', onEnter);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([element, inner]);
      gsap.set([element, inner], { clearProps: 'transform' });
    };
  }, [strength, innerStrength]);

  return ref;
}
