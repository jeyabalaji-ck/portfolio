import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { navItems, profile } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { gsap, media, useGSAP } from '../../motion/gsap';
import { whenIntroRevealed } from '../../motion/intro';
import { cx } from '../../utils/cx';
import { ButtonLink } from '../ui/ButtonLink';
import { SocialLinks } from '../ui/SocialLinks';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.scss';

const sectionIds = navItems.map((item) => item.id);
const MENU_ID = 'mobile-navigation';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(sectionIds);
  const { scrolled, down } = useScrollDirection();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The bar slides in once the intro has cleared.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        // Resolve targets now: the reveal callback may run inside another component's scope.
        const items = gsap.utils.toArray<HTMLElement>('[data-header-item]');
        gsap.set(items, { yPercent: -120, opacity: 0 });
        return whenIntroRevealed(() => {
          gsap.to(items, {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.07,
            delay: 0.45,
            clearProps: 'transform,opacity',
          });
        });
      });
    },
    { scope: headerRef },
  );

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onViewportChange = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onViewportChange);
    document.body.style.overflow = 'hidden';
    // The menu covers the page, so keep keyboard and screen reader focus inside it.
    const background = [document.getElementById('main'), document.getElementById('site-footer')];
    background.forEach((element) => element?.setAttribute('inert', ''));

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onViewportChange);
      document.body.style.overflow = '';
      background.forEach((element) => element?.removeAttribute('inert'));
    };
  }, [menuOpen]);

  const hidden = down && !menuOpen && !focusWithin;

  return (
    <>
      <header
        ref={headerRef}
        className={cx(
          styles.header,
          (scrolled || menuOpen) && styles.raised,
          menuOpen && styles.open,
          hidden && styles.hidden,
        )}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
        }}
      >
        <div className={`container ${styles.bar}`}>
          <a href="#home" className={styles.brand} onClick={closeMenu} data-header-item>
            <span className={styles.monogram} aria-hidden="true">
              JB
            </span>
            <span className={styles.brandName}>{profile.name}</span>
          </a>

          <nav aria-label="Primary" className={styles.desktopNav} data-header-item>
            <ul role="list" className={styles.list}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={styles.link}
                    data-label={item.label}
                    aria-current={activeId === item.id ? 'location' : undefined}
                  >
                    <span className={styles.linkText}>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions} data-header-item>
            <ThemeToggle />
            <ButtonLink href="#contact" variant="secondary" className={styles.cta}>
              Let&apos;s talk
            </ButtonLink>
            <button
              ref={menuButtonRef}
              type="button"
              className={cx(styles.iconButton, styles.menuButton)}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={styles.burger} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <nav id={MENU_ID} aria-label="Mobile" className={styles.mobileNav} hidden={!menuOpen}>
        <div className={`container ${styles.mobileInner}`}>
          <ul role="list" className={styles.mobileList}>
            {navItems.map((item, index) => (
              <li key={item.id} style={{ '--i': index } as CSSProperties}>
                <a
                  href={`#${item.id}`}
                  className={styles.mobileLink}
                  aria-current={activeId === item.id ? 'location' : undefined}
                  onClick={closeMenu}
                >
                  <span className={styles.mobileIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.mobileFooter}>
            <a className={styles.mobileEmail} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <SocialLinks />
          </div>
        </div>
      </nav>
    </>
  );
}
