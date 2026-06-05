import { Fragment, useRef } from 'react';
import { Section } from '../../components/ui/Section';
import { profile } from '../../data/profile';
import { splitWords } from '../../utils/splitWords';
import { useAboutMotion } from './useAboutMotion';
import styles from './About.module.scss';

/** The statement, with key concepts marked `*like this*` to be set in the accent serif. */
const statement =
  'I build interfaces where *React* and *TypeScript* meet real product data - Redux Toolkit and RTK Query for predictable state, REST APIs for booking flows, and a steady focus on *performance*, *architecture* and the people who use them.';

const facts = [
  { term: 'Current role', detail: 'Software Engineer - UI' },
  { term: 'Company', detail: 'CodeMagen Technologies' },
  { term: 'Based in', detail: profile.currentBase },
  { term: 'Core stack', detail: 'React.js · TypeScript · Redux Toolkit' },
  { term: 'Education', detail: 'MSc Software Systems, Kongu Engineering College' },
] as const;

/** Figures taken directly from the resume. `value` counts up; `suffix` stays fixed. */
const stats = [
  { value: 25, suffix: '%', label: 'Application performance improved at CodeMagen' },
  { value: 4, suffix: '', label: 'Selected full-stack and IoT projects' },
  { value: 8.5, suffix: '', label: 'CGPA, MSc Software Systems' },
] as const;

function renderStatement(text: string) {
  return splitWords(text).map((parts, index) => (
    <Fragment key={index}>
      {index > 0 ? ' ' : null}
      <span data-statement-word>
        {parts.map((part, partIndex) =>
          part.accent ? (
            <span key={partIndex} className={styles.keyword}>
              {part.text}
            </span>
          ) : (
            part.text
          ),
        )}
      </span>
    </Fragment>
  ));
}

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  useAboutMotion(ref);

  return (
    <div ref={ref} className={styles.panel} data-about-panel>
      <Section index="01" id="about" eyebrow="About" title="Frontend engineer, *production* mindset.">
        <p className={styles.statement} data-statement>
          {renderStatement(statement)}
        </p>

        <div className={styles.grid}>
          <div className={styles.body} data-reveal="stagger">
            <p>
              At CodeMagen Technologies I work on customer-facing travel and hotel booking products,
              building the React.js and TypeScript interfaces that partners and internal teams use to
              manage listings, pricing, availability and policies.
            </p>
            <p>
              I care about what makes an application dependable in production: load and rendering
              performance, efficient API calling patterns, Jest tests around core functionality, code
              reviews and CI/CD pipelines that ship changes reliably. Hands-on Java and Spring Boot
              experience from full-stack projects helps me work closely with backend teams on the APIs
              the interface depends on.
            </p>
          </div>

          <aside className={styles.facts} aria-label="At a glance">
            <p className={styles.factsTitle}>At a glance</p>
            <dl className={styles.list} data-reveal="stagger">
              {facts.map(({ term, detail }) => (
                <div key={term} className={styles.row}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <ul role="list" className={styles.stats} data-reveal="stagger">
          {stats.map((stat) => (
            <li key={stat.label} className={styles.stat}>
              <p className={styles.figure}>
                <span data-count={stat.value}>{stat.value}</span>
                {stat.suffix}
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
