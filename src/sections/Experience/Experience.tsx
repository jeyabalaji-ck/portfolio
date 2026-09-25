import { useRef, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { experience } from '../../data/experience';
import { cx } from '../../utils/cx';
import { formatPeriod } from '../../utils/date';
import { RoleCard } from './RoleCard';
import { useExperienceMotion } from './useExperienceMotion';
import styles from './Experience.module.scss';

export function Experience() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useExperienceMotion(ref, setActive);

  const current = experience[active] ?? experience[0];

  return (
    <Section
      index="02"
      id="experience"
      eyebrow="Experience"
      title="Shipping *production* frontend work."
      intro="Building and maintaining React applications that partners, customers and internal teams depend on."
    >
      <div ref={ref} className={styles.layout}>
        {/* A visual summary of the role in view; the cards carry the same content for assistive technology. */}
        <div className={styles.aside} aria-hidden="true">
          <div className={styles.sticky}>
            {current ? (
              <div key={current.id} className={styles.focus}>
                <p className={styles.focusPeriod}>{formatPeriod(current.period)}</p>
                <p className={styles.focusCompany}>
                  <span>{current.company}</span>
                </p>
                <p className={styles.focusTitle}>
                  {current.title} · {current.location}
                </p>
              </div>
            ) : null}

            <div className={styles.rail}>
              <span className={styles.railTrack} />
              <span className={styles.railFill} data-rail-fill />
              <ol className={styles.railList}>
                {experience.map((role, index) => (
                  <li key={role.id} className={cx(styles.railItem, index === active && styles.railActive)}>
                    <span className={styles.railDot} />
                    <span className={styles.railLabel}>
                      <span>{role.company}</span>
                      <span className={styles.railYears}>{formatPeriod(role.period)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className={styles.rolesWrap}>
          <span className={styles.rolesFill} aria-hidden="true" data-roles-fill />
          <ol role="list" className={styles.roles} data-roles>
            {experience.map((role, index) => (
              <li key={role.id} data-role-card className={cx(styles.roleItem, index === active && styles.isActive)}>
                <RoleCard role={role} primary={index === 0} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
