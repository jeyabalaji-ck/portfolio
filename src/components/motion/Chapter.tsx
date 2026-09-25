import { useRef } from 'react';
import { gsap, media, useGSAP } from '../../motion/gsap';
import styles from './Chapter.module.scss';

interface ChapterProps {
  /** Two-digit chapter number, e.g. "01". */
  index: string;
  label: string;
}

/** Keep in sync with `$cinematic` in Chapter.module.scss. */
const CINEMATIC = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/**
 * A cinematic title card between sections: an oversized word slides in from
 * beyond the viewport edge and settles while its frame holds on screen, then
 * fills with colour as the section below arrives. Decorative only - the
 * section it introduces carries the real heading.
 */
export function Chapter({ index, label }: ChapterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add({ cinematic: CINEMATIC, motion: media.motion }, (context) => {
        const { cinematic, motion } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        if (cinematic) {
          // Progress 0 - 0.5: the chapter scrolls into view; 0.5 - 1: the frame holds (sticky).
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
            })
            .fromTo('[data-chapter-word]', { scale: 2.8, xPercent: 42 }, { scale: 1, xPercent: 0, duration: 0.55, ease: 'power2.out' }, 0)
            .fromTo('[data-chapter-meta]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15 }, 0.4)
            .fromTo('[data-chapter-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, 0.45)
            .fromTo('[data-chapter-fill]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3 }, 0.5)
            .to('[data-chapter-word]', { yPercent: -10, scale: 0.94, duration: 0.2 }, 0.8);
          return;
        }

        // Small screens: no hold, the word simply drifts across and fills as it passes.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom 30%', scrub: 0.6 },
          })
          .fromTo('[data-chapter-word]', { xPercent: 28 }, { xPercent: -6 }, 0)
          .fromTo('[data-chapter-fill]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0.2);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={styles.chapter} aria-hidden="true">
      <div className={styles.frame}>
        <p className={styles.meta} data-chapter-meta>
          <span className={styles.index}>{index}</span>
          <span className={styles.rule} data-chapter-rule />
          <span>{label}</span>
        </p>
        <p className={styles.word} data-chapter-word>
          <span className={styles.outline}>{label}</span>
          <span className={styles.fill} data-chapter-fill>
            {label}
          </span>
        </p>
      </div>
    </div>
  );
}
