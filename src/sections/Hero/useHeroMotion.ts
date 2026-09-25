import type { RefObject } from 'react';
import { gsap, media, useGSAP } from '../../motion/gsap';
import { whenIntroRevealed } from '../../motion/intro';

/** Horizontal travel (px) of each name line under the pointer, for layered depth. */
const LINE_DEPTH = [10, 18];

/**
 * Hero motion in three layers:
 * 1. Entrance: the name rises character by character once the intro clears.
 * 2. Scroll: the two name lines part at different speeds while content fades
 *    and the backdrop sinks, so the next section visibly takes over.
 * 3. Pointer (desktop): name lines, technology chips and the glow drift with
 *    the cursor at different depths.
 */
export function useHeroMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const hero = scope.current;
      if (!hero) return;
      const mm = gsap.matchMedia();

      mm.add(
        { motion: media.motion, desktop: media.desktop, pointer: media.pointer },
        (context) => {
          const { motion, desktop, pointer } = context.conditions as Record<string, boolean>;
          if (!motion) return;

          const glow = hero.querySelector<HTMLElement>('[data-hero-glow]');

          // 1. Entrance
          const entrance = gsap
            .timeline({ paused: true })
            .from('[data-hero-char]', {
              yPercent: 110,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.025,
            })
            .from('[data-hero-fade]', { y: 14, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.3)
            .from('[data-hero-tech]', { y: 10, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, 0.5)
            .from('[data-hero-cue]', { opacity: 0, duration: 0.8 }, 0.9)
            .from(glow, { opacity: 0, scale: 0.8, duration: 1.6, ease: 'power2.out' }, 0);
          const unsubscribe = whenIntroRevealed(() => entrance.play());

          // 2. Scroll: the lines part, content recedes and the backdrop sinks.
          gsap
            .timeline({
              scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
              defaults: { ease: 'none' },
            })
            .to('[data-hero-line="0"]', { x: desktop ? '-2.5vw' : '-1.5vw' }, 0)
            .to('[data-hero-line="1"]', { x: desktop ? '4vw' : '2vw' }, 0)
            .to('[data-hero-title]', { yPercent: desktop ? -12 : -6, opacity: 0.25 }, 0)
            .to('[data-hero-identity]', { y: desktop ? -36 : -16, opacity: 0 }, 0)
            .to('[data-hero-out]', { y: desktop ? -28 : -16, opacity: 0 }, 0)
            .to('[data-hero-cue]', { opacity: 0, duration: 0.2 }, 0)
            .to('[data-hero-backdrop]', { yPercent: 14, scale: 1.03 }, 0);

          if (!(pointer && desktop)) return unsubscribe;

          // 3. Pointer: quickTo setters only write transforms, so moves never cause layout.
          const settle = { duration: 1.2, ease: 'power3.out' };
          const lines = gsap.utils
            .toArray<HTMLElement>('[data-hero-line]')
            .map((line) => gsap.quickTo(line, 'xPercent', settle));
          const chips = gsap.utils.toArray<HTMLElement>('[data-hero-tech]').map((chip) => ({
            x: gsap.quickTo(chip, 'x', settle),
            y: gsap.quickTo(chip, 'y', settle),
            depth: Number(chip.dataset.depth) || 1,
          }));
          const glowX = glow ? gsap.quickTo(glow, 'x', { duration: 1.6, ease: 'power3.out' }) : null;
          const glowY = glow ? gsap.quickTo(glow, 'y', { duration: 1.6, ease: 'power3.out' }) : null;

          let bounds: DOMRect | null = null;
          const onMove = (event: PointerEvent) => {
            bounds ??= hero.getBoundingClientRect();
            const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
            const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
            // Name lines move by a fraction of their own width, converted from px depth.
            lines.forEach((setX, index) => setX(nx * (LINE_DEPTH[index] ?? 12) * 0.12));
            chips.forEach(({ x, y, depth }) => {
              x(nx * -6 * depth);
              y(ny * -4 * depth);
            });
            // The glow is anchored at 62% / 42% of the hero; offset it toward the pointer.
            glowX?.((nx + 0.5 - 0.62) * bounds.width * 0.45);
            glowY?.((ny + 0.5 - 0.42) * bounds.height * 0.45);
          };
          const onLeave = () => {
            bounds = null;
            lines.forEach((setX) => setX(0));
            chips.forEach(({ x, y }) => {
              x(0);
              y(0);
            });
            glowX?.(0);
            glowY?.(0);
          };
          const onScroll = () => {
            bounds = null;
          };

          hero.addEventListener('pointermove', onMove);
          hero.addEventListener('pointerleave', onLeave);
          window.addEventListener('scroll', onScroll, { passive: true });

          return () => {
            unsubscribe();
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('scroll', onScroll);
          };
        },
      );
    },
    { scope },
  );
}
