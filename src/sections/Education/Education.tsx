import { Icon } from '../../components/ui/Icon';
import { Section } from '../../components/ui/Section';
import { certifications, education } from '../../data/education';
import { formatPeriod } from '../../utils/date';
import styles from './Education.module.scss';

export function Education() {
  return (
    <Section index="07" id="education" eyebrow="Education & certifications" title="*Foundations*.">
      <div className={styles.layout}>
        <div>
          <h3 className={styles.columnTitle}>Education</h3>
          <ol role="list" className={styles.entries} data-reveal="stagger">
            {education.map((entry) => (
              <li key={entry.degree} className={styles.entry}>
                <div className={styles.entryMain}>
                  <h4 className={styles.degree}>{entry.degree}</h4>
                  <p className={styles.institution}>
                    {entry.institution}
                    {entry.location ? `, ${entry.location}` : ''}
                  </p>
                </div>
                <time className={styles.period} dateTime={entry.period.start}>
                  {formatPeriod(entry.period)}
                </time>
                <p className={styles.score}>{entry.score}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className={styles.columnTitle}>Certifications</h3>
          <ul role="list" className={styles.certs} data-reveal="stagger">
            {certifications.map((cert) => (
              <li key={cert.name} className={styles.cert}>
                <Icon name="check" size={16} className={styles.certIcon} />
                <span>
                  <span className={styles.certName}>{cert.name}</span>
                  {cert.issuer ? <span className={styles.issuer}>{cert.issuer}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
