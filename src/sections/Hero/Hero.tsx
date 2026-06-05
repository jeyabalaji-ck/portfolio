import { Fragment, useRef } from 'react';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { SocialLinks } from '../../components/ui/SocialLinks';
import { profile } from '../../data/profile';
import { splitWords } from '../../utils/splitWords';
import { CodeWindow } from './CodeWindow';
import { LocalTime } from './LocalTime';
import { useHeroMotion } from './useHeroMotion';
import styles from './Hero.module.scss';

/** The headline as composed lines; `*word*` is set in the accent serif. */
const headlineLines = ['Building scalable,', 'responsive & *thoughtful*', 'web experiences.'];

/** Wraps each word in a mask so it can rise into view; accent words use the serif. */
function renderWords(line: string) {
  return splitWords(line).map((parts, index) => (
    <Fragment key={index}>
      {index > 0 ? ' ' : null}
      <span className={styles.mask}>
        <span data-hero-word>
          {parts.map((part, partIndex) =>
            part.accent ? (
              <span key={partIndex} className={styles.accent}>
                {part.text}
              </span>
            ) : (
              part.text
            ),
          )}
        </span>
      </span>
    </Fragment>
  ));
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroMotion(ref);

  return (
    <section ref={ref} id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true" data-hero-backdrop>
        <div className={styles.grid} />
        <div className={styles.glow} data-hero-glow />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.meta} data-hero-out>
          <p className={styles.status} data-hero-fade>
            <span className={styles.pulse} aria-hidden="true" />
            Software Engineer - UI at CodeMagen Technologies
          </p>
          <p className={styles.place} data-hero-fade>
            {profile.currentBase} <span aria-hidden="true">·</span> <LocalTime />
          </p>
        </div>

        <div className={styles.stage}>
          <h1 id="hero-title" className={styles.title} data-hero-title>
            <span className="visually-hidden">{profile.headline}</span>
            <span aria-hidden="true">
              {headlineLines.map((line, lineIndex) => (
                <span key={line} className={styles.line} data-hero-line={lineIndex}>
                  {renderWords(line)}
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.visual} data-hero-visual>
            <div className={styles.tilt} data-hero-tilt>
              <CodeWindow />
            </div>
          </div>
        </div>

        <div className={styles.bottom} data-hero-out>
          <p className={styles.lede} data-hero-fade>
            I&apos;m <strong>{profile.name}</strong>, a software engineer. I build
            production interfaces for hotel booking and extranet platforms with{' '}
            <strong>React.js</strong>, <strong>TypeScript</strong> and{' '}
            <strong>Redux Toolkit</strong>: reusable components, RTK Query data layers and REST API
            integration inside a microfrontend architecture.
          </p>

          <div className={styles.actions} data-hero-fade>
            <div className={styles.ctas}>
              <ButtonLink href="#projects" icon="arrowRight">
                View Projects
              </ButtonLink>
              <ButtonLink href="#contact" variant="secondary" cursorLabel="Let's talk">
                Contact Me
              </ButtonLink>
            </div>
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
