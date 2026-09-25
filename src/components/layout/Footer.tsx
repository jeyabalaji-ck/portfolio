import { useRef } from 'react';
import { navItems, profile } from '../../data/profile';
import { gsap, media, useGSAP } from '../../motion/gsap';
import { ButtonLink } from '../ui/ButtonLink';
import { SocialLinks } from '../ui/SocialLinks';
import styles from './Footer.module.scss';

export function Footer() {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);

  // The closing flourish: the name rises letter by letter as the page ends.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.from('[data-footer-char]', {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.035,
          scrollTrigger: { trigger: '[data-footer-name]', start: 'top 98%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} id="site-footer" className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.identity}>
          <p className={styles.name}>{profile.name}</p>
          <p className={styles.role}>{profile.role}</p>
          <p className={styles.stack}>React • TypeScript • JavaScript</p>
        </div>

        <nav aria-label="Footer" className={styles.nav}>
          <ul role="list" className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.aside}>
          <a className={styles.email} href={`mailto:${profile.email}`} data-cursor="Email">
            {profile.email}
          </a>
          <SocialLinks />
          <ButtonLink href="#home" variant="secondary" icon="arrowUp" className={styles.backTop}>
            Back to top
          </ButtonLink>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.meta}>
          © {year} {profile.name}. Designed and built with React, TypeScript, SCSS and GSAP.
        </p>
      </div>

      <p className={styles.giant} aria-hidden="true" data-footer-name>
        {Array.from(profile.name).map((char, index) => (
          <span key={index} className={styles.mask}>
            <span data-footer-char>{char === ' ' ? ' ' : char}</span>
          </span>
        ))}
      </p>
    </footer>
  );
}
