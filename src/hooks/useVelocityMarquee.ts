import type { RefObject } from 'react';
import { gsap, media, ScrollTrigger, useGSAP } from '../motion/gsap';

/** Base seconds for one full loop of a track, and the most scrolling may speed it up. */
const LOOP_SECONDS = 38;
const MAX_BOOST = 2.6;

/**
 * Loops each `[data-marquee-track]` inside `scope` (whose content is rendered
 * twice) and speeds it up a little while the page scrolls quickly, easing back
 * to its resting pace afterwards. Tracks with `data-marquee-reverse` run the
 * other way. The loop pauses while off screen and never runs with reduced
 * motion, where the tracks simply sit still.
 */
export function useVelocityMarquee(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const loops = gsap.utils.toArray<HTMLElement>('[data-marquee-track]').map((track) =>
          track.hasAttribute('data-marquee-reverse')
            ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: LOOP_SECONDS, ease: 'none', repeat: -1, paused: true })
            : gsap.to(track, { xPercent: -50, duration: LOOP_SECONDS, ease: 'none', repeat: -1, paused: true }),
        );

        let boost = 1;
        const onTick = () => {
          // Ease the boost back toward the resting pace every frame.
          boost += (1 - boost) * 0.06;
          loops.forEach((loop) => loop.timeScale(boost));
        };

        ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            loops.forEach((loop) => (self.isActive ? loop.play() : loop.pause()));
            if (self.isActive) gsap.ticker.add(onTick);
            else gsap.ticker.remove(onTick);
          },
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            boost = Math.max(boost, 1 + Math.min(velocity / 900, MAX_BOOST));
          },
        });

        return () => gsap.ticker.remove(onTick);
      });
    },
    { scope },
  );
}
