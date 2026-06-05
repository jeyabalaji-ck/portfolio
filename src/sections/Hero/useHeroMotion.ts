import type { RefObject } from 'react';
import { gsap, media, useGSAP } from '../../motion/gsap';
import { whenIntroRevealed } from '../../motion/intro';

/** Horizontal travel (px) of each headline line under the pointer, for layered depth. */
const LINE_DEPTH = [14, 28, 8];

/**
 * Hero motion in three layers:
 * 1. Entrance: headline words rise from their masks once the intro clears.
 * 2. Scroll: content recedes at different speeds while the next section rises over it.
 * 3. Pointer (desktop): lines, code window and glow drift with the cursor.
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

          const visual = hero.querySelector<HTMLElement>('[data-hero-visual]');
          const tilt = hero.querySelector<HTMLElement>('[data-hero-tilt]');
          const glow = hero.querySelector<HTMLElement>('[data-hero-glow]');

          // 1. Entrance
          const entrance = gsap
            .timeline({ paused: true })
            .from('[data-hero-word]', {
              yPercent: 120,
              rotate: desktop ? 5 : 0,
              duration: 1.25,
              ease: 'expo.out',
              stagger: 0.065,
            })
            .from(
              '[data-hero-fade]',
              { y: 28, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 },
              0.3,
            )
            .from(glow, { opacity: 0, scale: 0.5, duration: 1.8, ease: 'power2.out' }, 0);
          if (visual) {
            entrance.from(
              visual,
              { y: 80, rotate: 3, opacity: 0, duration: 1.4, ease: 'expo.out' },
              0.35,
            );
          }
          const unsubscribe = whenIntroRevealed(() => entrance.play());

          // 2. Scroll: title recedes, code window and backdrop move at their own depth.
          gsap
            .timeline({
              scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
              defaults: { ease: 'none' },
            })
            .to(
              '[data-hero-title]',
              { yPercent: desktop ? -22 : -10, scale: 0.94, opacity: 0.15, transformOrigin: 'left bottom' },
              0,
            )
            .to('[data-hero-out]', { y: desktop ? -80 : -30, opacity: 0 }, 0)
            .to(visual, { yPercent: -55 }, 0)
            .to('[data-hero-backdrop]', { yPercent: 30 }, 0);

          if (!(pointer && desktop)) return unsubscribe;

          // 3. Pointer: quickTo setters only write transforms, so moves never cause layout.
          const settle = { duration: 1.1, ease: 'power3.out' };
          const lines = gsap.utils
            .toArray<HTMLElement>('[data-hero-line]')
            .map((line) => gsap.quickTo(line, 'x', settle));
          const visualMoves = tilt
            ? (['x', 'y', 'rotationY', 'rotationX'] as const).map((prop) =>
                gsap.quickTo(tilt, prop, settle),
              )
            : [];
          const glowX = glow ? gsap.quickTo(glow, 'x', { duration: 1.6, ease: 'power3.out' }) : null;
          const glowY = glow ? gsap.quickTo(glow, 'y', { duration: 1.6, ease: 'power3.out' }) : null;
          if (tilt) gsap.set(tilt, { transformPerspective: 1000 });

          let bounds: DOMRect | null = null;
          const onEnter = () => {
            bounds = hero.getBoundingClientRect();
          };
          const onMove = (event: PointerEvent) => {
            bounds ??= hero.getBoundingClientRect();
            const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
            const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
            lines.forEach((setX, index) => setX(nx * (LINE_DEPTH[index] ?? 10)));
            const [x, y, rotateY, rotateX] = visualMoves;
            x?.(nx * -36);
            y?.(ny * -24);
            rotateY?.(nx * 8);
            rotateX?.(ny * -8);
            // The glow is anchored at 72% / 40% of the hero; offset it toward the pointer.
            glowX?.((nx + 0.5 - 0.72) * bounds.width * 0.6);
            glowY?.((ny + 0.5 - 0.4) * bounds.height * 0.6);
          };
          const onLeave = () => {
            bounds = null;
            lines.forEach((setX) => setX(0));
            visualMoves.forEach((set) => set(0));
            glowX?.(0);
            glowY?.(0);
          };

          const onScroll = () => {
            bounds = null;
          };

          hero.addEventListener('pointerenter', onEnter);
          window.addEventListener('scroll', onScroll, { passive: true });
          hero.addEventListener('pointermove', onMove);
          hero.addEventListener('pointerleave', onLeave);

          return () => {
            unsubscribe();
            hero.removeEventListener('pointerenter', onEnter);
            window.removeEventListener('scroll', onScroll);
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
          };
        },
      );
    },
    { scope },
  );
}
