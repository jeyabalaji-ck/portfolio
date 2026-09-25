import { useRef, type ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { SectionId } from '../../types/content';
import { cx } from '../../utils/cx';
import { SplitText } from './SplitText';
import styles from './Section.module.scss';

interface SectionProps {
  id: SectionId;
  /** Two-digit chapter number shown before the eyebrow. */
  index: string;
  eyebrow: string;
  /** Section heading; wrap a word in `*asterisks*` to accent it. */
  title: string;
  intro?: ReactNode;
  className?: string;
  headerClassName?: string;
  /** Full-bleed content rendered after the contained content, outside the container. */
  after?: ReactNode;
  children?: ReactNode;
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  className,
  headerClassName,
  after,
  children,
}: SectionProps) {
  const headingId = `${id}-title`;
  const ref = useRef<HTMLElement>(null);

  useScrollReveal(ref);

  return (
    <section ref={ref} id={id} aria-labelledby={headingId} className={cx(styles.section, className)}>
      <div className="container">
        <header className={cx(styles.header, headerClassName)}>
          <p className={styles.eyebrow} data-reveal="fade">
            <span className={styles.index}>{index}</span>
            <span className={styles.rule} data-reveal="line" aria-hidden="true" />
            <span>{eyebrow}</span>
          </p>
          <h2 id={headingId} className={styles.title} data-reveal="words">
            <SplitText text={title} />
          </h2>
          {intro ? (
            <p className={styles.intro} data-reveal="fade">
              {intro}
            </p>
          ) : null}
        </header>
        {children}
      </div>
      {after}
    </section>
  );
}
