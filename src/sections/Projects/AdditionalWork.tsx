import { additionalWork } from '../../data/projects';
import { formatPeriod } from '../../utils/date';
import styles from './Projects.module.scss';

export function AdditionalWork() {
  if (additionalWork.length === 0) return null;

  return (
    <div className={styles.more}>
      <h3 className={styles.moreTitle}>More work &amp; research</h3>
      <ul role="list" className={styles.moreList} data-reveal="stagger">
        {additionalWork.map((item) => (
          <li key={item.title} className={styles.moreItem}>
            <div>
              <p className={styles.moreName}>{item.title}</p>
              <p className={styles.moreDescription}>{item.description}</p>
            </div>
            <time className={styles.morePeriod} dateTime={item.period.start}>
              {formatPeriod(item.period)}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
}
