import { useRef, useState } from 'react';
import { profile } from '../../data/profile';
import { gsap, useGSAP } from '../../motion/gsap';
import { introEnabled, markIntroRevealed } from '../../motion/intro';
import styles from './Intro.module.scss';

/** Longest the intro may take before the page is shown regardless. */
const FAILSAFE_MS = 3500;

/**
 * A short entrance: the name rises in, a rule draws, then the overlay wipes
 * upward while the hero starts its own reveal underneath. Plays once per
 * session and never with reduced motion or on deep links.
 */
export function Intro() {
  const [done, setDone] = useState(!introEnabled);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const finish = () => {
        markIntroRevealed();
        setDone(true);
      };
      const timeline = gsap
        .timeline({ paused: true, onComplete: finish })
        .from('[data-char]', { yPercent: 115, duration: 0.6, ease: 'power4.out', stagger: 0.022 }, 0)
        .from('[data-line]', { scaleX: 0, duration: 0.85, ease: 'power2.inOut' }, 0)
        .from('[data-meta]', { opacity: 0, duration: 0.4 }, 0.2)
        .to('[data-char]', { yPercent: -115, duration: 0.42, ease: 'power3.in', stagger: 0.012 }, 0.82)
        .to('[data-meta], [data-line]', { opacity: 0, duration: 0.3 }, 0.82)
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'power3.inOut' }, 0.95)
        .add(markIntroRevealed, 1.05);

      // Start once the display font is ready (capped), so the name never swaps typeface mid-animation.
      let cancelled = false;
      const start = () => {
        if (!cancelled && timeline.paused()) timeline.play();
      };
      const startTimer = window.setTimeout(start, 450);
      const failsafe = window.setTimeout(finish, FAILSAFE_MS);
      void document.fonts?.ready.then(start);

      return () => {
        cancelled = true;
        window.clearTimeout(startTimer);
        window.clearTimeout(failsafe);
      };
    },
    { scope: ref },
  );

  if (done) return null;

  return (
    <div ref={ref} className={styles.intro} aria-hidden="true">
      <div className={styles.center}>
        <p className={styles.name}>
          {profile.name.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} className={styles.word}>
              {Array.from(word).map((char, charIndex) => (
                <span key={charIndex} className={styles.mask}>
                  <span data-char className={styles.char}>
                    {char}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </p>
        <span data-line className={styles.line} />
        <p data-meta className={styles.meta}>
          <span>Software Engineer</span>
          <span>Frontend</span>
        </p>
      </div>
    </div>
  );
}
