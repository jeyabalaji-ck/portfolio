import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from './Icon';
import styles from './ButtonLink.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: IconName;
  /** Renders the icon before the label instead of after it. */
  iconLeading?: boolean;
  /** Label shown by the custom cursor while hovering. */
  cursorLabel?: string;
  children: ReactNode;
}

/** The `<button>` counterpart of `ButtonLink`, sharing its look and magnetic hover. */
export function Button({
  variant = 'primary',
  icon,
  iconLeading = false,
  cursorLabel,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>();
  const iconNode = icon ? <Icon name={icon} size={16} className={styles.icon} /> : null;

  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button, styles[variant], className)}
      data-cursor={cursorLabel}
      {...rest}
    >
      <span className={styles.inner} data-magnetic-inner>
        {iconLeading && iconNode}
        <span className={styles.label}>{children}</span>
        {!iconLeading && iconNode}
      </span>
    </button>
  );
}
