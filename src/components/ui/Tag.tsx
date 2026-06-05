import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Tag.module.scss';

type TagSize = 'sm' | 'md';

interface TagListProps {
  items: readonly string[];
  label: string;
  size?: TagSize;
  /** Stagger the tags in when they scroll into view. */
  reveal?: boolean;
  className?: string;
}

/** A labelled list of technology tags. */
export function TagList({ items, label, size = 'sm', reveal = false, className }: TagListProps) {
  return (
    <ul
      role="list"
      aria-label={label}
      className={cx(styles.list, className)}
      data-reveal={reveal ? 'stagger' : undefined}
    >
      {items.map((item) => (
        <li key={item}>
          <Tag size={size}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

interface TagProps {
  size?: TagSize;
  children: ReactNode;
}

export function Tag({ size = 'sm', children }: TagProps) {
  return <span className={cx(styles.tag, styles[size])}>{children}</span>;
}
