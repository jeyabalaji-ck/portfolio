import { Fragment, useRef } from 'react';
import { Chapter } from '../../components/motion/Chapter';
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

/** What the day-to-day work covers, each tied to the experience described on this page. */
const focusAreas = [
  { title: 'React development', detail: 'Functional components and hooks for production booking and extranet interfaces.' },
  { title: 'TypeScript', detail: 'Typed props, state and API responses for safer changes.' },
  { title: 'State management', detail: 'Redux Toolkit for shared state, local state for local concerns.' },
  { title: 'API integration', detail: 'REST APIs through RTK Query and Axios, with caching and clean error handling.' },
  { title: 'Responsive UI', detail: 'Layouts that hold up across desktop and mobile, cross-browser.' },
  { title: 'Reusable components', detail: 'Shared building blocks that behave consistently across microfrontends.' },
  { title: 'Performance', detail: 'Lazy loading, leaner API calling patterns and careful rendering.' },
  { title: 'Testing', detail: 'Jest unit tests around core functionality, plus reviews and CI/CD.' },
] as const;

/** Figures taken directly from the resume. `value` counts up; `suffix` stays fixed. */
const stats = [
  { value: 25, suffix: '%', label: 'Application performance improved at CodeMagen' },
  { value: 4, suffix: '', label: 'Selected full-stack and IoT projects' },
  { value: 8.5, suffix: '', label: 'CGPA, MSc Software Systems' },
] as const;

const tagRows = [
  ['React.js', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'React Hooks', 'REST APIs', 'Axios', 'SCSS'],
  ['Jest', 'Microfrontends', 'Responsive UI', 'Lazy loading', 'Git', 'Jenkins', 'Docker', 'Spring Boot'],
];

const pad = (value: number) => String(value).padStart(2, '0');

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
  const tagsRef = useRef<HTMLDivElement>(null);
  useAboutMotion(ref, tagsRef);

  return (
    <div ref={ref} className={styles.panel} data-about-panel>
      <Chapter label="About" />

      <Section
        index="01"
        id="about"
        eyebrow="About"
        title="Frontend-focused engineer building *scalable* web applications."
        className={styles.section}
      >
        <div className={styles.intro}>
          <p className={styles.statement} data-statement>
            {renderStatement(statement)}
          </p>

          <div className={styles.side}>
            <div className={styles.body} data-reveal="stagger">
              <p>
                At CodeMagen Technologies I work on customer-facing travel and hotel booking products, building the
                React.js and TypeScript interfaces that partners and internal teams use to manage listings, pricing,
                availability and policies.
              </p>
              <p>
                I care about what makes an application dependable in production: load and rendering performance,
                efficient API calling patterns, Jest tests around core functionality, code reviews and CI/CD pipelines
                that ship changes reliably. Hands-on Java and Spring Boot experience from full-stack projects helps me
                work closely with backend teams on the APIs the interface depends on.
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
        </div>

        <div className={styles.focus}>
          <h3 className={styles.focusTitle} data-reveal="fade">
            What I focus on
          </h3>
          <ol role="list" className={styles.focusGrid} data-focus-grid>
            {focusAreas.map((area, index) => (
              <li key={area.title} className={styles.focusItem} data-focus-item>
                <span className={styles.focusIndex} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <h4 className={styles.focusName}>{area.title}</h4>
                <p className={styles.focusDetail}>{area.detail}</p>
              </li>
            ))}
          </ol>
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

      {/* Technologies drift in opposite directions as the section scrolls past. */}
      <div ref={tagsRef} className={styles.tags} aria-hidden="true">
        {tagRows.map((row, index) => (
          <p key={index} className={styles.tagRow} data-drift={index % 2 ? 14 : -14}>
            {row.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
