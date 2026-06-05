import { Section } from '../../components/ui/Section';
import { principles } from '../../data/approach';
import styles from './Approach.module.scss';

export function Approach() {
  return (
    <Section
      index="06"
      id="approach"
      eyebrow="Engineering approach"
      title="How I build *frontend* software."
      intro="The principles behind the day-to-day decisions, from component APIs to what gets tested before release."
    >
      <ol role="list" className={styles.list} data-reveal="stagger">
        {principles.map((principle, index) => (
          <li key={principle.title} className={styles.item}>
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.title}>{principle.title}</h3>
            <p className={styles.description}>{principle.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
