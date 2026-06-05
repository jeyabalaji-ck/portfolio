import styles from './SectionPlaceholder.module.scss';

/** Loading state shown while lazily loaded sections are fetched. */
export function SectionPlaceholder() {
  return (
    <div className={styles.placeholder} role="status" aria-live="polite">
      <div className={`container ${styles.inner}`}>
        <span className={styles.lineShort} />
        <span className={styles.lineLong} />
        <span className={styles.block} />
        <span className="visually-hidden">Loading more sections…</span>
      </div>
    </div>
  );
}
