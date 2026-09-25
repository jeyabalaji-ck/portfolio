import { useRef } from 'react';
import { useVelocityMarquee } from '../../hooks/useVelocityMarquee';
import { cx } from '../../utils/cx';
import styles from './Marquee.module.scss';

interface MarqueeProps {
  items: readonly string[];
  /** Adds a second, outlined row running the opposite way. */
  twoRows?: boolean;
  className?: string;
}

function Row({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  // The content is rendered twice so the loop can wrap seamlessly at -50%.
  return (
    <div className={cx(styles.row, reverse && styles.outline)}>
      <div className={styles.track} data-marquee-track data-marquee-reverse={reverse || undefined}>
        {[0, 1].map((copy) => (
          <span key={copy} className={styles.group}>
            {items.map((item) => (
              <span key={item} className={styles.item}>
                {item}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Full-bleed scrolling technology names. Purely decorative (the same
 * technologies are listed accessibly nearby), so it is hidden from assistive
 * technology. Movement speeds up slightly with fast scrolling.
 */
export function Marquee({ items, twoRows = false, className }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  useVelocityMarquee(ref);

  const reversed = [...items].reverse();

  return (
    <div ref={ref} className={cx(styles.marquee, className)} aria-hidden="true">
      <Row items={items} />
      {twoRows ? <Row items={reversed} reverse /> : null}
    </div>
  );
}
