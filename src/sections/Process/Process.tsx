import { useRef, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { SplitText } from '../../components/ui/SplitText';
import { TagList } from '../../components/ui/Tag';
import { buildStages } from '../../data/approach';
import { useStepActivation } from '../../hooks/useStepActivation';
import { cx } from '../../utils/cx';
import { ArchitectureWindow } from './ArchitectureWindow';
import styles from './Process.module.scss';

const pad = (value: number) => String(value).padStart(2, '0');

export function Process() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useStepActivation(ref, '[data-stage]', setActive);

  return (
    <Section
      index="04"
      id="process"
      eyebrow="How I build"
      title="From problem to *production*."
      intro="Four stages I follow on every feature - and how a frontend codebase takes shape along the way."
    >
      <div ref={ref} className={styles.layout}>
        <ol role="list" className={styles.stages}>
          {buildStages.map((stage, index) => (
            <li
              key={stage.id}
              className={cx(styles.stage, index === active && styles.stageActive)}
              data-stage
              aria-labelledby={`stage-${stage.id}`}
            >
              <p className={styles.stageIndex} aria-hidden="true">
                {pad(index + 1)} <span>/ {pad(buildStages.length)}</span>
              </p>
              <h3 id={`stage-${stage.id}`} className={styles.stageTitle} data-reveal="words">
                <SplitText text={stage.title} />
              </h3>
              <p className={styles.stageText} data-reveal="fade">
                {stage.description}
              </p>
              <TagList items={stage.concepts} label={`${stage.title} concepts`} size="md" reveal />
            </li>
          ))}
        </ol>

        <div className={styles.aside}>
          <div className={styles.sticky}>
            <ArchitectureWindow active={active} />
          </div>
        </div>
      </div>
    </Section>
  );
}
