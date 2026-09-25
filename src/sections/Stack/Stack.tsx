import { useState, type FocusEvent } from 'react';
import { Marquee } from '../../components/ui/Marquee';
import { Section } from '../../components/ui/Section';
import { skillGroups } from '../../data/skills';
import { marqueeItems, stackCategories } from '../../data/stack';
import { cx } from '../../utils/cx';
import styles from './Stack.module.scss';

const pad = (value: number) => String(value).padStart(2, '0');

export function Stack() {
  // The technology currently highlighted (hovered, focused or tapped).
  const [active, setActive] = useState<string | null>(null);

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
  };

  return (
    <Section
      index="03"
      id="stack"
      eyebrow="Tech stack"
      title="The *stack* behind the work."
      intro="Frontend first, with enough backend and delivery experience to work across the stack when a feature needs it. Hover or tap a technology to see how I use it."
      after={<Marquee items={marqueeItems} twoRows className={styles.marquee} />}
    >
      <div
        className={cx(styles.categories, active && styles.focused)}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setActive(null);
        }}
        onBlur={onBlur}
      >
        {stackCategories.map((category, categoryIndex) => {
          const selected = category.items.find((item) => item.name === active);
          const headingId = `stack-${category.id}`;

          return (
            <section
              key={category.id}
              className={cx(styles.category, selected && styles.categoryActive)}
              aria-labelledby={headingId}
              data-reveal="fade"
            >
              <div className={styles.heading}>
                <span className={styles.index} aria-hidden="true">
                  {pad(categoryIndex + 1)}
                </span>
                <h3 id={headingId} className={styles.title}>
                  {category.title}
                </h3>
                <p className={styles.detail} aria-live="polite">
                  <span key={selected?.name ?? 'summary'} className={styles.detailText}>
                    {selected ? (
                      <>
                        <strong>{selected.name}.</strong> {selected.note}
                      </>
                    ) : (
                      category.summary
                    )}
                  </span>
                </p>
              </div>

              <ul role="list" className={styles.techs}>
                {category.items.map((item, itemIndex) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      className={cx(styles.tech, item.name === active && styles.techActive)}
                      aria-pressed={item.name === active}
                      onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') setActive(item.name);
                      }}
                      onFocus={() => setActive(item.name)}
                      onClick={() => setActive(item.name)}
                    >
                      <span className={styles.techName}>{item.name}</span>
                      <span className={styles.techIndex} aria-hidden="true">
                        {pad(itemIndex + 1)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className={styles.toolkit}>
        <h3 className={styles.toolkitTitle} data-reveal="fade">
          The full toolkit
        </h3>
        <div className={styles.toolkitGrid} data-reveal="stagger">
          {skillGroups.map((group) => (
            <section key={group.id} className={styles.group} aria-labelledby={`toolkit-${group.id}`}>
              <h4 id={`toolkit-${group.id}`} className={styles.groupTitle}>
                {group.title}
              </h4>
              {group.note ? <p className={styles.groupNote}>{group.note}</p> : null}
              <ul role="list" className={styles.skills} aria-label={`${group.title} skills`}>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
