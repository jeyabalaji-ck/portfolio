import { useRef } from 'react';
import { gsap, media, useGSAP } from '../../motion/gsap';
import styles from './Chapter.module.scss';

interface ChapterProps {
  label: string;
}

/** Wider screens travel a little less, since the word is further from the edge. */
const WIDE = '(min-width: 1024px)';

/**
 * A compact title card between sections: an outlined word drifts into place
 * and fills with colour as it scrolls past. Decorative only - the section it
 * introduces carries the real heading.
 */
export function Chapter({ label }: ChapterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add({ wide: WIDE, motion: media.motion }, (context) => {
        const { wide, motion } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom 35%', scrub: 0.6 },
          })
          .fromTo('[data-chapter-word]', { xPercent: wide ? 8 : 12 }, { xPercent: 0 }, 0)
          .fromTo('[data-chapter-fill]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0.15);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={styles.chapter} aria-hidden="true">
      <div className={styles.frame}>
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
