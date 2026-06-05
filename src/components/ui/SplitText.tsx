import { Fragment, type CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import { splitWords, stripAccents } from '../../utils/splitWords';
import styles from './SplitText.module.scss';

interface SplitTextProps {
  /** Text to split into masked words. Wrap a word in `*asterisks*` to set it in the accent serif. */
  text: string;
  className?: string;
}

/**
 * Renders text as words inside overflow masks so they can rise into view.
 * Assistive technology reads a single visually hidden copy instead of the
 * fragmented words.
 */
export function SplitText({ text, className }: SplitTextProps) {
  return (
    <>
      <span className="visually-hidden">{stripAccents(text)}</span>
      <span aria-hidden="true" className={cx(styles.split, className)}>
        {splitWords(text).map((parts, index) => (
          <Fragment key={index}>
            {index > 0 ? ' ' : null}
            <span className={styles.mask}>
              <span
                data-word
                className={styles.word}
                style={{ '--word-index': index } as CSSProperties}
              >
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
        ))}
      </span>
    </>
  );
}
