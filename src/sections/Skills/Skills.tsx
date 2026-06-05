import { useRef } from 'react';
import { Section } from '../../components/ui/Section';
import { skillGroups } from '../../data/skills';
import { gsap, media, useGSAP } from '../../motion/gsap';
import { cx } from '../../utils/cx';
import styles from './Skills.module.scss';

const [primary] = skillGroups;
const half = Math.ceil((primary?.skills.length ?? 0) / 2);
/** The primary skills, split across two bands that drift in opposite directions. */
const bands = primary ? [primary.skills.slice(0, half), primary.skills.slice(half)] : [];

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);

  // The bands move with scroll position (not on a timer), so they only move when the reader does.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-band]').forEach((band, index) => {
          gsap.fromTo(
            band,
            { xPercent: index % 2 ? -18 : 0 },
            {
              xPercent: index % 2 ? 0 : -18,
              ease: 'none',
              scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <Section
      index="05"
      id="skills"
      eyebrow="Technical skills"
      title="The *toolkit* behind the work."
      intro="Frontend first, with enough backend and delivery experience to work across the stack when a feature needs it."
    >
      <div ref={ref} className={styles.bands} aria-hidden="true">
        {bands.map((band, index) => (
          <p key={index} className={cx(styles.band, index % 2 === 1 && styles.bandOutline)} data-band>
            {[...band, ...band].map((skill, skillIndex) => (
              <span key={skillIndex} className={styles.bandItem}>
                {skill}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className={styles.groups}>
        {skillGroups.map((group, index) => (
          <section
            key={group.id}
            className={cx(styles.group, index === 0 && styles.primary)}
            aria-labelledby={`skills-${group.id}`}
          >
            <div className={styles.heading} data-reveal="fade">
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 id={`skills-${group.id}`} className={styles.title}>
                {group.title}
              </h3>
              {group.note ? <p className={styles.note}>{group.note}</p> : null}
            </div>
            <ul role="list" className={styles.skills} aria-label={`${group.title} skills`} data-reveal="stagger">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
