import { profile } from '../../data/profile';
import { useMagnetic } from '../../hooks/useMagnetic';
import type { SocialLink } from '../../types/content';
import { cx } from '../../utils/cx';
import { Icon } from './Icon';
import styles from './SocialLinks.module.scss';

type Variant = 'icons' | 'detailed';

interface SocialLinksProps {
  /** `icons` renders compact icon buttons; `detailed` adds the profile handle. */
  variant?: Variant;
  className?: string;
}

function SocialItem({ social, variant }: { social: SocialLink; variant: Variant }) {
  const ref = useMagnetic<HTMLAnchorElement>(
    variant === 'icons' ? { strength: 0.35, innerStrength: 0.15 } : { strength: 0.04, innerStrength: 0.08 },
  );

  return (
    <a
      ref={ref}
      className={styles.link}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor={`${social.label} ↗`}
      aria-label={variant === 'icons' ? `${social.label} profile (opens in a new tab)` : undefined}
    >
      <span className={styles.inner} data-magnetic-inner>
        <Icon name={social.id} size={variant === 'icons' ? 18 : 22} />
        {variant === 'detailed' ? (
          <span className={styles.text}>
            <span className={styles.label}>{social.label}</span>
            <span className={styles.handle}>{social.handle}</span>
          </span>
        ) : null}
      </span>
      {variant === 'detailed' ? (
        <>
          <Icon name="arrowUpRight" size={20} className={styles.arrow} />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}

export function SocialLinks({ variant = 'icons', className }: SocialLinksProps) {
  return (
    <ul role="list" className={cx(styles.list, styles[variant], className)}>
      {profile.socials.map((social) => (
        <li key={social.id}>
          <SocialItem social={social} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
