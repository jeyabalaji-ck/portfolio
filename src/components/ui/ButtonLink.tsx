import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from './Icon';
import styles from './ButtonLink.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  icon?: IconName;
  /** Renders the icon before the label instead of after it. */
  iconLeading?: boolean;
  /** Opens in a new tab with safe `rel` attributes and an accessible hint. */
  external?: boolean;
  /** Label shown by the custom cursor while hovering. */
  cursorLabel?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = 'primary',
  icon,
  iconLeading = false,
  external = false,
  cursorLabel,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const ref = useMagnetic<HTMLAnchorElement>();
  const iconNode = icon ? <Icon name={icon} size={16} className={styles.icon} /> : null;

  return (
    <a
      ref={ref}
      href={href}
      className={cx(styles.button, styles[variant], className)}
      data-cursor={cursorLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span className={styles.inner} data-magnetic-inner>
        {iconLeading && iconNode}
        <span className={styles.label}>{children}</span>
        {!iconLeading && iconNode}
      </span>
      {external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
    </a>
  );
}
