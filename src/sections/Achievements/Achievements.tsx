import { useRef } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Section } from '../../components/ui/Section';
import { achievements, activities } from '../../data/achievements';
import { usePanelReveal } from '../../hooks/usePanelReveal';
import { cx } from '../../utils/cx';
import styles from './Achievements.module.scss';

export function Achievements() {
  const ref = useRef<HTMLDivElement>(null);
  usePanelReveal(ref);

  return (
    <div ref={ref} className="inverse">
      <Section index="07" id="achievements" eyebrow="Achievements" title="Recognition and *activities*.">
        <ul role="list" className={styles.highlights} data-reveal="stagger">
          {achievements.map((achievement, index) => (
            <li key={achievement.title} className={cx(styles.card, index === 0 && styles.featured)}>
              <p className={styles.label}>
                <Icon name="award" size={18} />
                {achievement.label}
              </p>
              <h3 className={styles.title}>{achievement.title}</h3>
              <p className={styles.context}>{achievement.context}</p>
              <p className={styles.description}>{achievement.description}</p>
            </li>
          ))}
        </ul>

        <div className={styles.activities}>
          <h3 className={styles.activitiesTitle}>Co-curricular activities</h3>
          <ol role="list" className={styles.activityList} data-reveal="stagger">
            {activities.map((activity, index) => (
              <li key={activity}>
                <span className={styles.activityIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {activity}
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </div>
  );
}
