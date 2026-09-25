import { useRef } from 'react';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { SocialLinks } from '../../components/ui/SocialLinks';
import { profile } from '../../data/profile';
import { LocalTime } from './LocalTime';
import { useHeroMotion } from './useHeroMotion';
import styles from './Hero.module.scss';

/** The name as composed display lines. */
const nameLines = ['Jeya Balaji', 'C K'];
/** The core technologies, shown as the hero's technical signature. */
const coreTech = ['React', 'TypeScript', 'Redux Toolkit', 'RTK Query'];

const pad = (value: number) => String(value).padStart(2, '0');

/** Each character sits in its own mask so it can rise into view. */
function Chars({ text }: { text: string }) {
  return Array.from(text).map((char, index) =>
    char === ' ' ? (
      <span key={index} className={styles.space} />
    ) : (
      <span key={index} className={styles.mask}>
        <span data-hero-char>{char}</span>
      </span>
    ),
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroMotion(ref);

  return (
    <section ref={ref} id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true" data-hero-backdrop>
        <div className={styles.gridMask}>
          <div className={styles.grid} data-hero-grid />
        </div>
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
          <h1 id="hero-title" className={styles.name} data-hero-title>
            <span className="visually-hidden">{profile.name}</span>
            <span aria-hidden="true">
              {nameLines.map((line, index) => (
                <span key={line} className={styles.line} data-hero-line={index}>
                  <Chars text={line} />
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.identity} data-hero-identity>
            <p className={styles.role} data-hero-fade>
              <span className={styles.roleRule} aria-hidden="true" />
              <span>
                <span className={styles.accent}>Frontend</span> Developer
              </span>
            </p>
            <ul role="list" className={styles.tech} aria-label="Core technologies">
              {coreTech.map((tech, index) => (
                <li key={tech} className={styles.techItem} data-hero-tech data-depth={(index % 2) + 1}>
                  <span className={styles.techIndex} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom} data-hero-out>
          <p className={styles.lede} data-hero-fade>
            Building <strong>scalable</strong>, <strong>responsive</strong> and{' '}
            <strong>high-performance</strong> web experiences with React, TypeScript and modern frontend
            architecture.
          </p>

          <div className={styles.actions} data-hero-fade>
            <div className={styles.ctas}>
              <ButtonLink href="#projects" icon="arrowRight">
                View Work
              </ButtonLink>
              <ButtonLink href="#contact" variant="secondary" cursorLabel="Let's talk">
                Contact Me
              </ButtonLink>
            </div>
            <SocialLinks />
          </div>
        </div>

        <a href="#about" className={styles.cue} data-hero-cue>
          <span>Scroll to explore</span>
          <span className={styles.cueTrack} aria-hidden="true">
            <span className={styles.cueDot} />
          </span>
        </a>
      </div>
    </section>
  );
}
