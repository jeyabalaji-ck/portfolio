import { TagList } from '../../components/ui/Tag';
import type { Role } from '../../types/content';
import { cx } from '../../utils/cx';
import { formatPeriod } from '../../utils/date';
import styles from './Experience.module.scss';

interface RoleCardProps {
  role: Role;
  /** The primary role gets more visual weight. */
  primary?: boolean;
}

export function RoleCard({ role, primary = false }: RoleCardProps) {
  const isCurrent = !role.period.end;
  const headingId = `role-${role.id}`;

  return (
    <article className={cx(styles.role, primary && styles.primary)} aria-labelledby={headingId}>
      <header className={styles.roleHeader} data-reveal="fade">
        <p className={styles.meta}>
          <time dateTime={role.period.start}>{formatPeriod(role.period)}</time>
          <span aria-hidden="true">/</span>
          <span>{role.location}</span>
          {isCurrent ? <span className={styles.current}>Current</span> : null}
        </p>
        <h3 id={headingId} className={styles.title}>
          {role.title}
        </h3>
        <p className={styles.company}>{role.company}</p>
      </header>

      <p className={styles.summary} data-reveal="fade">
        {role.summary}
      </p>

      <div className={styles.groups} data-reveal="stagger">
        {role.highlights.map((group) => (
          <div key={group.title} className={styles.group}>
            <h4 className={styles.groupTitle}>{group.title}</h4>
            <ul className={styles.points}>
              {group.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <TagList items={role.stack} label={`Technologies used at ${role.company}`} reveal />
    </article>
  );
}
