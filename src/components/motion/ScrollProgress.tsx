import { useRef } from 'react';
import { gsap, useGSAP } from '../../motion/gsap';
import styles from './ScrollProgress.module.scss';

/**
 * A hairline across the top of the viewport showing how far through the page
 * the reader is. It maps scroll position directly (no easing), so it stays
 * accurate - and is kept - with reduced motion.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } },
      );
    },
    { scope: ref },
  );

  return <div ref={ref} className={styles.bar} aria-hidden="true" />;
}
