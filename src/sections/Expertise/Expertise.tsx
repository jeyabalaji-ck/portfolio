import { useState } from 'react';
import { Section } from '../../components/ui/Section';
import { expertise } from '../../data/expertise';
import { cx } from '../../utils/cx';
import { ExpertiseDiagram } from './ExpertiseDiagram';
import styles from './Expertise.module.scss';

export function Expertise() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <Section
      index="03"
      id="expertise"
      eyebrow="Frontend expertise"
      title="What I bring to a *frontend* team."
      intro="The capabilities I use day to day to build interfaces that stay fast, consistent and maintainable as products grow."
      className={styles.section}
    >
      <div className={styles.layout}>
        <ExpertiseDiagram activeId={activeId} onActivate={setActiveId} />

        <ol
          role="list"
          className={styles.list}
          data-reveal="stagger"
          onPointerLeave={() => setActiveId(null)}
        >
          {expertise.map((capability, index) => (
            <li
              key={capability.id}
              className={cx(styles.item, activeId === capability.id && styles.itemActive)}
              onPointerEnter={() => setActiveId(capability.id)}
            >
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.itemBody}>
                <h3 className={styles.title}>{capability.title}</h3>
                <p className={styles.description}>{capability.description}</p>
                <ul role="list" className={styles.items} aria-label={`${capability.title} skills`}>
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
